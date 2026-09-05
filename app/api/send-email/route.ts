import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { supabaseServer } from '@/lib/supabaseServer';
import { sendEmail } from '@/lib/resendClient';
import {
  welcomeEmail,
  applicationSubmittedEmail,
  accountUpdateEmail,
  admissionOfferEmail,
  admissionLetterEmail,
  adminNewRegistrationEmail,
  adminDirectMessageEmail,
  paymentConfirmationEmail,
  rejectionEmail,
  documentRequestEmail,
  centreRemovedEmail,
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
    // Clean up expired entries to prevent memory leak
    if (rateLimitMap.size > 5000) {
      for (const [key, val] of rateLimitMap) {
        if (now > val.resetAt) rateLimitMap.delete(key);
      }
    }
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

const INTERNAL_SECRET = process.env.INTERNAL_API_SECRET;

export async function POST(request: NextRequest) {
  // Rate limiting
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown';
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ message: 'Too many requests' }, { status: 429 });
  }

  const body = await request.json();
  const { type, data } = body;

  if (!type || !data) {
    return NextResponse.json({ message: 'Missing type or data' }, { status: 400 });
  }

  // Two auth paths:
  // 1. Internal secret header — used by admin portal direct messages and registration notifications
  // 2. Bearer token — used by logged-in users
  const secretHeader = request.headers.get('x-internal-secret');
  const isInternalCall = INTERNAL_SECRET ? secretHeader === INTERNAL_SECRET : !!secretHeader;

  let isAdmin = false;

  if (!isInternalCall) {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: { user } } = await supabase.auth.getUser(token);
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const { data: callerProfile } = await supabaseServer.from('profiles').select('role').eq('id', user.id).single();
    isAdmin = !!(callerProfile && ['super_admin', 'coordinator', 'admin'].includes(callerProfile.role));

    // Admission offer, rejection, and admin emails are admin-only
    if (['admission_offer', 'admission_letter', 'admin_direct_message', 'admin_new_registration', 'rejection', 'document_request', 'centre_removed'].includes(type) && !isAdmin) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }
  }

  try {
    let email: { html: string; subject: string } | null = null;
    let recipientEmail: string = data.email;
    let replyTo: string | undefined;

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
      case 'admission_letter':
        email = admissionLetterEmail(data.fullName, data.applicationId);
        break;
      case 'admin_new_registration':
        email = adminNewRegistrationEmail(data.fullName, data.email, data.phone);
        recipientEmail = 'support@ijmb.info';
        break;
      case 'admin_direct_message':
        email = adminDirectMessageEmail(data.studentName, data.subject, data.message);
        recipientEmail = data.email;
        replyTo = 'support@ijmb.info';
        break;
      case 'payment_confirmation':
        email = paymentConfirmationEmail(data.fullName, Number(data.amount), data.reference, data.paymentType);
        break;
      case 'rejection':
        email = rejectionEmail(data.fullName, data.applicationId);
        break;
      case 'document_request':
        email = documentRequestEmail(data.studentName, data.message, `${process.env.NEXT_PUBLIC_SUPABASE_URL ? 'https://www.ijmb.info' : 'https://www.ijmb.info'}/dashboard?tab=documents`);
        recipientEmail = data.email;
        break;
      case 'centre_removed':
        email = centreRemovedEmail(data.fullName, 'https://www.ijmb.info/dashboard');
        recipientEmail = data.email;
        break;
      default:
        return NextResponse.json({ message: `Unknown email type: ${type}` }, { status: 400 });
    }

    const result = await sendEmail({ to: recipientEmail, subject: email.subject, html: email.html, replyTo, emailType: type });
    if (!result.success) {
      const errMsg = typeof result.error === 'object'
        ? JSON.stringify(result.error)
        : String(result.error ?? 'Unknown Resend error');
      return NextResponse.json({ message: errMsg }, { status: 500 });
    }

    return NextResponse.json({ message: 'Email sent' });
  } catch (err: any) {
    return NextResponse.json({ message: err?.message || String(err) }, { status: 500 });
  }
}
