import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { sendEmail } from '@/lib/resendClient';
import {
  welcomeEmail,
  applicationSubmittedEmail,
  accountUpdateEmail,
  admissionOfferEmail,
} from '@/lib/emailTemplates';

// Simple in-memory rate limiter (per-IP, resets on server restart)
// For production scale use Vercel KV or Upstash Redis
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5; // max requests
const RATE_WINDOW = 60 * 1000; // per 60 seconds

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

export async function POST(request: NextRequest) {
  // Rate limiting
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown';
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ message: 'Too many requests' }, { status: 429 });
  }

  // Auth — must be a logged-in user to trigger emails
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll() {},
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { type, data } = body;

  if (!type || !data) {
    return NextResponse.json({ message: 'Missing type or data' }, { status: 400 });
  }

  // Admission offer emails are admin-only
  if (type === 'admission_offer') {
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (!profile || !['super_admin', 'coordinator', 'admin'].includes(profile.role)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }
  }

  // For welcome/account_update, only allow sending to own email
  if (['welcome', 'account_update'].includes(type)) {
    if (data.email !== user.email) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }
  }

  try {
    let email: { html: string; subject: string } | null = null;

    switch (type) {
      case 'welcome':
        email = welcomeEmail(data.fullName, data.email);
        break;
      case 'application_submitted':
        email = applicationSubmittedEmail(data.fullName, data.applicationId, data.centre, data.subjects);
        break;
      case 'account_update':
        email = accountUpdateEmail(data.fullName, data.changeDescription);
        break;
      case 'admission_offer':
        email = admissionOfferEmail(data.fullName, data.applicationId, data.centre, data.resumptionDate, data.subjects);
        break;
      default:
        return NextResponse.json({ message: `Unknown email type: ${type}` }, { status: 400 });
    }

    const result = await sendEmail({ to: data.email, subject: email.subject, html: email.html });
    if (!result.success) {
      return NextResponse.json({ message: 'Failed to send email' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Email sent' });
  } catch (err) {
    console.error('[send-email route] Error:', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
