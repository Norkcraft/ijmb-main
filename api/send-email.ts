import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sendEmail } from '../src/lib/resendClient';
import {
  welcomeEmail,
  applicationSubmittedEmail,
  accountUpdateEmail,
  admissionOfferEmail,
  adminNewRegistrationEmail,
  adminDirectMessageEmail,
  reminderNoApplicationEmail,
  reminderAbandonedDraftEmail,
  reminderPaymentPendingEmail,
} from '../src/lib/emailTemplates';

// Internal secret to prevent abuse — set INTERNAL_API_SECRET in your env vars
const INTERNAL_SECRET = process.env.INTERNAL_API_SECRET;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // Verify internal secret (only enforced if INTERNAL_API_SECRET is configured)
  const authHeader = req.headers['x-internal-secret'];
  if (INTERNAL_SECRET && authHeader !== INTERNAL_SECRET) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { type, data } = req.body;

  if (!type || !data) {
    return res.status(400).json({ message: 'Missing type or data' });
  }

  try {
    let email: { html: string; subject: string } | null = null;
    let recipientEmail: string = data.email;

    switch (type) {
      case 'welcome':
        email = welcomeEmail(data.fullName, data.email);
        break;

      case 'application_submitted':
        email = applicationSubmittedEmail(
          data.fullName,
          data.applicationId,
          data.centre,
          data.subjects
        );
        break;

      case 'account_update':
        email = accountUpdateEmail(data.fullName, data.changeDescription);
        break;

      case 'admission_offer':
        email = admissionOfferEmail(
          data.fullName,
          data.applicationId,
          data.centre,
          data.resumptionDate,
          data.subjects
        );
        break;

      case 'admin_new_registration':
        email = adminNewRegistrationEmail(data.fullName, data.email, data.phone);
        recipientEmail = 'support@ijmb.info';
        break;

      case 'admin_direct_message':
        email = adminDirectMessageEmail(data.studentName, data.subject, data.message);
        recipientEmail = data.email;
        break;

      case 'reminder_no_application':
        email = reminderNoApplicationEmail(data.fullName);
        break;

      case 'reminder_abandoned_draft':
        email = reminderAbandonedDraftEmail(data.fullName);
        break;

      case 'reminder_payment_pending':
        email = reminderPaymentPendingEmail(data.fullName);
        break;

      default:
        return res.status(400).json({ message: `Unknown email type: ${type}` });
    }

    const result = await sendEmail({
      to: recipientEmail,
      subject: email.subject,
      html: email.html,
      replyTo: type === 'admin_direct_message' ? 'support@ijmb.info' : undefined,
    });

    if (!result.success) {
      return res.status(500).json({ message: 'Failed to send email', error: result.error });
    }

    return res.status(200).json({ message: 'Email sent', id: result.id });
  } catch (err) {
    console.error('[send-email] Error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
