import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { generateApplicationPDF } from '@/lib/generateApplicationPDF';

// Allow up to 30s — Puppeteer needs time on cold start
export const maxDuration = 30;

export async function GET() {
  return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
}

export async function POST(request: NextRequest) {
  try {
    // Auth check
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const anonClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data: { user } } = await anonClient.auth.getUser(token);
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const { applicationId } = await request.json();
    if (!applicationId) return NextResponse.json({ message: 'Missing applicationId' }, { status: 400 });

    // Verify the application belongs to this user (or user is admin)
    const userClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    );
    const { data: app, error } = await userClient
      .from('applications')
      .select('id, user_id, application_number')
      .eq('id', applicationId)
      .single();

    if (error || !app) return NextResponse.json({ message: 'Application not found' }, { status: 404 });
    if (app.user_id !== user.id) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

    const pdfBuffer = await generateApplicationPDF(applicationId, token);

    const appNum = app.application_number || applicationId.split('-')[0].toUpperCase();

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="IJMB-Application-${appNum}.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });
  } catch (err: any) {
    console.error('[application-pdf] Error:', err);
    return NextResponse.json({ message: err?.message || 'PDF generation failed' }, { status: 500 });
  }
}
