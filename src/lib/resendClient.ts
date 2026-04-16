import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  console.warn('[Resend] RESEND_API_KEY is not set — emails will not be sent');
}

export const resend = new Resend(process.env.RESEND_API_KEY || '');

export const FROM_EMAIL = process.env.EMAIL_FROM || 'IJMB Portal <noreply@ijmb.info>';

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('[Resend] Skipping email — no API key configured');
    return { success: false, error: 'No API key' };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
    });

    if (error) {
      console.error('[Resend] Failed to send email:', error);
      return { success: false, error };
    }

    return { success: true, id: data?.id };
  } catch (err) {
    console.error('[Resend] Unexpected error:', err);
    return { success: false, error: err };
  }
}
