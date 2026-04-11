/** Escape user-supplied strings before embedding in HTML email to prevent XSS */
function esc(str: string | undefined | null): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

// Shared branding constants
const LOGO = 'https://www.ijmb.info/ijmb-logo.jpeg';
const SITE = 'https://www.ijmb.info';
const SUPPORT_EMAIL = 'support@ijmb.info';
const YEAR = new Date().getFullYear() + '/' + (new Date().getFullYear() + 1);

const header = (title: string) => `
  <div style="background:#1a3c6e;padding:28px 32px;text-align:center">
    <img src="${LOGO}" alt="IJMB" style="height:64px;border-radius:10px;display:block;margin:0 auto 12px"/>
    <p style="color:#f0f4ff;margin:0;font-size:13px;letter-spacing:0.5px;text-transform:uppercase">IJMB Student Portal — ${YEAR}</p>
  </div>
`;

const footer = () => `
  <div style="background:#f1f5f9;padding:20px 32px;border-top:1px solid #e2e8f0;text-align:center">
    <p style="color:#64748b;font-size:12px;margin:0 0 6px">
      Need help? Email us at <a href="mailto:${SUPPORT_EMAIL}" style="color:#1a3c6e">${SUPPORT_EMAIL}</a>
    </p>
    <p style="color:#94a3b8;font-size:11px;margin:0">
      © ${new Date().getFullYear()} IJMB Info ·
      <a href="${SITE}" style="color:#94a3b8;text-decoration:none">ijmb.info</a> ·
      <a href="${SITE}/contact" style="color:#94a3b8;text-decoration:none">Contact Us</a>
    </p>
  </div>
`;

const wrapper = (content: string) => `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:Arial,Helvetica,sans-serif">
  <div style="max-width:600px;margin:32px auto;background:#ffffff;border-radius:10px;overflow:hidden;border:1px solid #e2e8f0;box-shadow:0 2px 8px rgba(0,0,0,0.06)">
    ${content}
  </div>
</body>
</html>`;

const ctaButton = (text: string, href: string) => `
  <div style="text-align:center;margin:28px 0">
    <a href="${href}"
      style="display:inline-block;background:#f59e0b;color:#1a1a1a;padding:14px 36px;border-radius:7px;text-decoration:none;font-weight:bold;font-size:16px;letter-spacing:0.3px">
      ${text}
    </a>
  </div>
`;

const infoRow = (label: string, value: string) => `
  <tr>
    <td style="padding:8px 0;color:#64748b;font-size:14px;width:160px">${label}</td>
    <td style="padding:8px 0;color:#1e293b;font-size:14px;font-weight:600">${value}</td>
  </tr>
`;

// ─── 1. WELCOME / REGISTRATION ─────────────────────────────────────────────
export function welcomeEmail(fullName: string, email: string) {
  const body = `
    ${header('Welcome to IJMB Portal')}
    <div style="padding:36px 32px">
      <h1 style="color:#1a3c6e;margin:0 0 8px;font-size:22px">Welcome, ${esc(fullName)}! 🎓</h1>
      <p style="color:#475569;margin:0 0 20px;line-height:1.7">
        Your IJMB Student Portal account has been created successfully. You're one step closer to gaining <strong>direct entry into 200 Level</strong> at any Nigerian university — without UTME.
      </p>
      <div style="background:#f0f7ff;border-left:4px solid #1a3c6e;padding:16px 20px;border-radius:0 8px 8px 0;margin-bottom:24px">
        <p style="margin:0;font-size:14px;color:#1e293b"><strong>Your account email:</strong> ${esc(email)}</p>
      </div>
      <h3 style="color:#1a3c6e;font-size:15px;margin:0 0 12px">What to do next:</h3>
      <ol style="color:#475569;font-size:14px;line-height:2;margin:0 0 24px;padding-left:20px">
        <li>Log in to your dashboard</li>
        <li>Fill in your application form (takes ~10 minutes)</li>
        <li>Pay the ₦5,500 registration form fee</li>
        <li>Upload your O-Level result or awaiting slip</li>
        <li>Receive your admission letter and report to your assigned centre</li>
      </ol>
      ${ctaButton('Go to My Dashboard', `${SITE}/student-dashboard`)}
      <p style="color:#94a3b8;font-size:13px;text-align:center;margin-top:8px">
        Registration closes when slots are filled. Register now to secure your place.
      </p>
    </div>
    ${footer()}
  `;
  return { html: wrapper(body), subject: `Welcome to IJMB Portal, ${esc(fullName)}!` };
}

// ─── 2. PAYMENT CONFIRMATION ───────────────────────────────────────────────
export function paymentConfirmationEmail(
  fullName: string,
  amount: number,
  reference: string,
  paymentType: 'form_fee' | 'tuition' | 'hostel' | string
) {
  const typeLabel = paymentType === 'form_fee'
    ? 'IJMB Registration Form Fee'
    : paymentType === 'tuition'
    ? 'IJMB Tuition Fee'
    : paymentType === 'hostel'
    ? 'IJMB Hostel Fee'
    : 'Payment';

  const nextStep = paymentType === 'form_fee'
    ? 'Your application has been submitted. Complete your application form on your dashboard and upload your documents.'
    : 'Your payment has been recorded. You can view your payment history on your dashboard.';

  const body = `
    ${header('Payment Confirmed')}
    <div style="padding:36px 32px">
      <div style="text-align:center;margin-bottom:28px">
        <div style="display:inline-flex;align-items:center;justify-content:center;background:#dcfce7;border-radius:50%;width:64px;height:64px;margin-bottom:12px">
          <span style="font-size:32px">✓</span>
        </div>
        <h1 style="color:#16a34a;margin:0;font-size:22px">Payment Successful!</h1>
      </div>
      <p style="color:#475569;margin:0 0 24px;line-height:1.7">
        Hi <strong>${esc(fullName)}</strong>, we have received your payment. Here are your payment details:
      </p>
      <table style="width:100%;border-collapse:collapse;background:#f8fafc;border-radius:8px;padding:4px;margin-bottom:24px">
        <tbody>
          ${infoRow('Payment For', typeLabel)}
          ${infoRow('Amount Paid', `₦${amount.toLocaleString()}`)}
          ${infoRow('Reference', reference)}
          ${infoRow('Date', new Date().toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' }))}
          ${infoRow('Status', '<span style="color:#16a34a">✓ Confirmed</span>')}
        </tbody>
      </table>
      <div style="background:#fffbeb;border-left:4px solid #f59e0b;padding:14px 18px;border-radius:0 8px 8px 0;margin-bottom:24px">
        <p style="margin:0;font-size:14px;color:#92400e">${nextStep}</p>
      </div>
      ${ctaButton('View My Dashboard', `${SITE}/student-dashboard`)}
      <p style="color:#94a3b8;font-size:12px;text-align:center">
        Keep this email as your payment receipt. Reference: <strong>${reference}</strong>
      </p>
    </div>
    ${footer()}
  `;
  return { html: wrapper(body), subject: `Payment Confirmed — ${typeLabel} (₦${amount.toLocaleString()})` };
}

// ─── 3. APPLICATION SUBMITTED ──────────────────────────────────────────────
export function applicationSubmittedEmail(
  fullName: string,
  applicationId: string,
  centre: string,
  subjects: string
) {
  const body = `
    ${header('Application Submitted')}
    <div style="padding:36px 32px">
      <h1 style="color:#1a3c6e;margin:0 0 12px;font-size:22px">Application Received!</h1>
      <p style="color:#475569;margin:0 0 20px;line-height:1.7">
        Hi <strong>${esc(fullName)}</strong>, your IJMB ${YEAR} application has been submitted successfully and is now under review by our admissions team.
      </p>
      <table style="width:100%;border-collapse:collapse;background:#f8fafc;border-radius:8px;padding:4px;margin-bottom:24px">
        <tbody>
          ${infoRow('Application ID', esc(applicationId))}
          ${infoRow('Assigned Centre', esc(centre) || 'To be assigned')}
          ${infoRow('Subjects', esc(subjects) || 'As selected')}
          ${infoRow('Session', YEAR)}
          ${infoRow('Status', '<span style="color:#d97706">⏳ Under Review</span>')}
        </tbody>
      </table>
      <h3 style="color:#1a3c6e;font-size:15px;margin:0 0 12px">What happens next?</h3>
      <ol style="color:#475569;font-size:14px;line-height:2;margin:0 0 24px;padding-left:20px">
        <li>Our team will review your documents (2–5 working days)</li>
        <li>You'll receive an admission offer email once approved</li>
        <li>Print your admission letter from your dashboard</li>
        <li>Report to your assigned centre on the stated resumption date</li>
      </ol>
      ${ctaButton('Track My Application', `${SITE}/student-dashboard`)}
    </div>
    ${footer()}
  `;
  return {
    html: wrapper(body),
    subject: `Application Submitted — ID: ${esc(applicationId)} | IJMB ${YEAR}`
  };
}

// ─── 4. ADMISSION OFFER ────────────────────────────────────────────────────
export function admissionOfferEmail(
  fullName: string,
  applicationId: string,
  centre: string,
  resumptionDate: string,
  subjects: string
) {
  const body = `
    ${header('Congratulations — Admission Offer')}
    <div style="padding:36px 32px">
      <div style="text-align:center;margin-bottom:28px">
        <div style="font-size:48px;margin-bottom:8px">🎉</div>
        <h1 style="color:#1a3c6e;margin:0;font-size:24px">Congratulations, ${esc(fullName)}!</h1>
        <p style="color:#475569;margin:8px 0 0">You have been offered admission into the IJMB Programme</p>
      </div>
      <div style="background:#f0f7ff;border:2px solid #1a3c6e;border-radius:10px;padding:20px 24px;margin-bottom:24px;text-align:center">
        <p style="color:#1a3c6e;font-weight:bold;font-size:18px;margin:0 0 4px">IJMB ${YEAR} Session</p>
        <p style="color:#475569;font-size:13px;margin:0">Interim Joint Matriculation Board — Direct Entry Programme</p>
      </div>
      <table style="width:100%;border-collapse:collapse;background:#f8fafc;border-radius:8px;padding:4px;margin-bottom:24px">
        <tbody>
          ${infoRow('Full Name', esc(fullName))}
          ${infoRow('Application ID', esc(applicationId))}
          ${infoRow('Study Centre', esc(centre))}
          ${infoRow('Subject Combination', esc(subjects))}
          ${infoRow('Resumption Date', esc(resumptionDate))}
          ${infoRow('Status', '<span style="color:#16a34a;font-weight:bold">✓ ADMITTED</span>')}
        </tbody>
      </table>
      <div style="background:#fffbeb;border-left:4px solid #f59e0b;padding:14px 18px;border-radius:0 8px 8px 0;margin-bottom:24px">
        <p style="margin:0;font-size:14px;color:#92400e;font-weight:bold">Important: Report to your centre on or before the resumption date.</p>
        <p style="margin:6px 0 0;font-size:13px;color:#92400e">Bring: printed admission letter, O-Level result, passport photos, and payment receipts.</p>
      </div>
      ${ctaButton('Download Admission Letter', `${SITE}/student-dashboard`)}
      <p style="color:#475569;font-size:13px;line-height:1.7;text-align:center">
        Upon successful completion of the IJMB programme, you will be eligible for <strong>Direct Entry admission into 200 Level</strong> at over 200 Nigerian universities — without sitting UTME.
      </p>
    </div>
    ${footer()}
  `;
  return {
    html: wrapper(body),
    subject: `Admission Offer — IJMB ${YEAR} | ${esc(fullName)}`
  };
}

// ─── 5. PASSWORD RESET (CUSTOM) ────────────────────────────────────────────
export function passwordResetEmail(resetLink: string) {
  const body = `
    ${header('Reset Your Password')}
    <div style="padding:36px 32px">
      <h1 style="color:#1a3c6e;margin:0 0 12px;font-size:22px">Reset Your Password</h1>
      <p style="color:#475569;margin:0 0 20px;line-height:1.7">
        We received a request to reset the password for your IJMB Student Portal account. Click the button below to set a new password.
      </p>
      ${ctaButton('Reset My Password', resetLink)}
      <div style="background:#fef2f2;border-left:4px solid #ef4444;padding:14px 18px;border-radius:0 8px 8px 0;margin-bottom:24px">
        <p style="margin:0;font-size:13px;color:#7f1d1d">
          This link expires in <strong>1 hour</strong>. If you did not request a password reset, please ignore this email — your account is safe.
        </p>
      </div>
      <p style="color:#94a3b8;font-size:12px;text-align:center">
        If the button doesn't work, copy and paste this link into your browser:<br/>
        <a href="${resetLink}" style="color:#1a3c6e;font-size:11px;word-break:break-all">${resetLink}</a>
      </p>
    </div>
    ${footer()}
  `;
  return { html: wrapper(body), subject: 'Reset Your IJMB Portal Password' };
}

// ─── 6. ACCOUNT UPDATE NOTIFICATION ───────────────────────────────────────
export function accountUpdateEmail(fullName: string, changeDescription: string) {
  const body = `
    ${header('Account Updated')}
    <div style="padding:36px 32px">
      <h1 style="color:#1a3c6e;margin:0 0 12px;font-size:22px">Your Account Was Updated</h1>
      <p style="color:#475569;margin:0 0 20px;line-height:1.7">
        Hi <strong>${esc(fullName)}</strong>, this is a notification that your IJMB Student Portal account was recently updated.
      </p>
      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:16px 20px;margin-bottom:24px">
        <p style="margin:0;font-size:14px;color:#1e293b"><strong>Change made:</strong> ${esc(changeDescription)}</p>
        <p style="margin:6px 0 0;font-size:12px;color:#94a3b8">Date: ${new Date().toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
      </div>
      <div style="background:#fef2f2;border-left:4px solid #ef4444;padding:14px 18px;border-radius:0 8px 8px 0;margin-bottom:24px">
        <p style="margin:0;font-size:13px;color:#7f1d1d">
          If you did not make this change, please contact us immediately at <a href="mailto:${SUPPORT_EMAIL}" style="color:#1a3c6e">${SUPPORT_EMAIL}</a>.
        </p>
      </div>
      ${ctaButton('Review My Account', `${SITE}/student-dashboard`)}
    </div>
    ${footer()}
  `;
  return { html: wrapper(body), subject: 'Your IJMB Portal Account Was Updated' };
}
