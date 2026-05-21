import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendEmail } from '@/lib/resendClient';

export async function POST(request: NextRequest) {
  try {
    // Admin-only: check internal secret
    const secret = request.headers.get('authorization')?.replace('Bearer ', '');
    if (secret !== process.env.INTERNAL_API_SECRET) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { email, fullName } = await request.json();
    if (!email) {
      return NextResponse.json({ message: 'Missing email' }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Generate a fresh confirmation link using the admin API
    const { data, error } = await supabase.auth.admin.generateLink({
      type: 'signup',
      email,
    });

    if (error || !data?.properties?.action_link) {
      console.error('generateLink error:', error);
      return NextResponse.json(
        { message: error?.message || 'Failed to generate confirmation link' },
        { status: 500 }
      );
    }

    const confirmationLink = data.properties.action_link;
    const name = fullName || 'Student';

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
</head>
<body style="margin:0;padding:0;background:#f0f4f8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif">
  <div style="max-width:600px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.10)">
    <div style="background:linear-gradient(135deg,#006400 0%,#004d00 100%);padding:40px 40px 32px;text-align:center">
      <img src="https://www.ijmb.info/ijmb-logo.jpeg" alt="IJMB" style="height:60px;width:60px;border-radius:12px;display:block;margin:0 auto 16px;object-fit:cover;border:3px solid rgba(255,255,255,0.2)"/>
      <h1 style="color:#ffffff;margin:0 0 6px;font-size:22px;font-weight:700;font-family:Georgia,serif">Confirm Your Email Address</h1>
      <p style="color:rgba(255,255,255,0.75);margin:0;font-size:13px">IJMB Student Portal</p>
    </div>
    <div style="padding:40px 40px 32px">
      <p style="color:#0f172a;font-size:18px;font-weight:700;margin:0 0 8px">Hi ${name},</p>
      <p style="color:#475569;font-size:15px;margin:0 0 24px;line-height:1.7">
        Please confirm your email address to activate your IJMB Student Portal account. Click the button below to verify your email.
      </p>
      <div style="text-align:center;margin:32px 0">
        <a href="${confirmationLink}" style="display:inline-block;background:#006400;color:#ffffff;padding:15px 40px;border-radius:50px;text-decoration:none;font-weight:700;font-size:15px;box-shadow:0 4px 12px rgba(0,100,0,0.25)">
          Confirm Email Address &rarr;
        </a>
      </div>
      <p style="color:#94a3b8;font-size:13px;text-align:center;margin:0">
        This link expires in 24 hours. If you did not create an account, you can ignore this email.
      </p>
    </div>
    <div style="background:#0a0a0a;padding:32px 40px;text-align:center">
      <p style="color:#ffffff;font-size:15px;font-weight:700;margin:0 0 2px">Thanks for choosing IJMB.</p>
      <p style="color:#f5a623;font-size:12px;font-weight:600;margin:0 0 16px;letter-spacing:0.5px;text-transform:uppercase">IJMB Support Group</p>
      <p style="color:#555;font-size:11px;margin:0">&copy; ${new Date().getFullYear()} IJMB Info &nbsp;&middot;&nbsp; <a href="https://www.ijmb.info" style="color:#555;text-decoration:none">ijmb.info</a></p>
    </div>
  </div>
</body>
</html>`;

    await sendEmail({
      to: email,
      subject: 'Confirm your IJMB Portal email address',
      html,
    });

    return NextResponse.json({ message: 'Confirmation email sent' });

  } catch (err: any) {
    console.error('[resend-confirmation] Error:', err);
    return NextResponse.json({ message: err?.message || 'Internal server error' }, { status: 500 });
  }
}
