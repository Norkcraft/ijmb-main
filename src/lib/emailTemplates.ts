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
const PRIMARY = '#006400';
const GOLD = '#f5a623';

const header = (title: string, subtitle?: string) => `
  <div style="background:linear-gradient(135deg,#006400 0%,#004d00 100%);padding:40px 40px 32px;text-align:center">
    <img src="${LOGO}" alt="IJMB" style="height:60px;width:60px;border-radius:12px;display:block;margin:0 auto 16px;object-fit:cover;border:3px solid rgba(255,255,255,0.2)"/>
    <h1 style="color:#ffffff;margin:0 0 6px;font-size:22px;font-weight:700;letter-spacing:-0.3px;font-family:Georgia,serif">${title}</h1>
    ${subtitle ? `<p style="color:rgba(255,255,255,0.75);margin:0;font-size:13px;letter-spacing:0.3px">${subtitle}</p>` : `<p style="color:rgba(255,255,255,0.6);margin:0;font-size:12px;letter-spacing:0.5px;text-transform:uppercase">IJMB Student Portal &mdash; ${YEAR}</p>`}
  </div>
`;

const footer = () => `
  <div style="background:#0a0a0a;padding:32px 40px;text-align:center">
    <img src="${LOGO}" alt="IJMB" style="height:36px;width:36px;border-radius:8px;display:block;margin:0 auto 14px;opacity:0.85"/>
    <p style="color:#ffffff;font-size:15px;font-weight:700;margin:0 0 2px;letter-spacing:-0.2px">Thanks for choosing IJMB.</p>
    <p style="color:#f5a623;font-size:12px;font-weight:600;margin:0 0 16px;letter-spacing:0.5px;text-transform:uppercase">IJMB Support Group</p>
    <div style="border-top:1px solid rgba(255,255,255,0.1);padding-top:16px;margin-top:4px">
      <p style="color:#888;font-size:12px;margin:0 0 6px">
        Need help? <a href="mailto:${SUPPORT_EMAIL}" style="color:#f5a623;text-decoration:none;font-weight:600">${SUPPORT_EMAIL}</a>
      </p>
      <p style="color:#555;font-size:11px;margin:0">
        &copy; ${new Date().getFullYear()} IJMB Info &nbsp;&middot;&nbsp;
        <a href="${SITE}" style="color:#555;text-decoration:none">ijmb.info</a>
        &nbsp;&middot;&nbsp;
        <a href="${SITE}/contact" style="color:#555;text-decoration:none">Contact Us</a>
      </p>
    </div>
  </div>
`;

const wrapper = (content: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <meta name="color-scheme" content="light"/>
</head>
<body style="margin:0;padding:0;background:#f0f4f8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased">
  <div style="max-width:600px;margin:40px auto 40px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.10)">
    ${content}
  </div>
  <p style="text-align:center;color:#aab;font-size:11px;margin:12px 0 32px">This email was sent by IJMB Portal. Please do not reply directly to this address.</p>
</body>
</html>`;

const ctaButton = (text: string, href: string, color = PRIMARY) => `
  <div style="text-align:center;margin:32px 0 8px">
    <a href="${href}" style="display:inline-block;background:${color};color:#ffffff;padding:15px 40px;border-radius:50px;text-decoration:none;font-weight:700;font-size:15px;letter-spacing:0.2px;box-shadow:0 4px 12px rgba(0,100,0,0.25)">
      ${text} &rarr;
    </a>
  </div>
`;

const infoTable = (rows: string) => `
  <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
    <tbody>${rows}</tbody>
  </table>
`;

const infoRow = (label: string, value: string) => `
  <tr>
    <td style="padding:11px 16px;background:#f8fafc;border-bottom:1px solid #e8edf2;color:#64748b;font-size:13px;font-weight:500;width:44%;border-radius:0">${label}</td>
    <td style="padding:11px 16px;background:#ffffff;border-bottom:1px solid #e8edf2;color:#0f172a;font-size:13px;font-weight:600">${value}</td>
  </tr>
`;

const divider = () => `<div style="height:1px;background:#f1f5f9;margin:24px 0"></div>`;

const badge = (text: string, color: string, bg: string) => `<span style="display:inline-block;background:${bg};color:${color};font-size:11px;font-weight:700;padding:3px 10px;border-radius:20px;letter-spacing:0.3px">${text}</span>`;

// ─── 1. WELCOME / REGISTRATION ─────────────────────────────────────────────
export function welcomeEmail(fullName: string, email: string) {
  const body = `
    ${header('Welcome to IJMB Portal', 'Your journey to Direct Entry starts here')}
    <div style="padding:40px 40px 32px">
      <p style="color:#0f172a;font-size:18px;font-weight:700;margin:0 0 8px">Hi ${esc(fullName)}, welcome aboard!</p>
      <p style="color:#475569;font-size:15px;margin:0 0 24px;line-height:1.7">
        Your IJMB Student Portal account has been created. You're now one step closer to gaining <strong style="color:#006400">Direct Entry into 200 Level</strong> at any Nigerian university &mdash; no UTME required.
      </p>

      <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:16px 20px;margin-bottom:28px">
        <p style="margin:0;font-size:13px;color:#166534"><span style="font-weight:700">Account Email:</span> ${esc(email)}</p>
      </div>

      <p style="color:#0f172a;font-size:14px;font-weight:700;margin:0 0 12px;text-transform:uppercase;letter-spacing:0.5px">What to do next</p>
      <table style="width:100%;border-collapse:collapse">
        ${[
          ['1', 'Log in to your dashboard'],
          ['2', 'Fill in your application form (takes ~10 minutes)'],
          ['3', 'Pay the ₦10,000 registration form fee'],
          ['4', 'Upload your O-Level result or awaiting slip'],
          ['5', 'Receive your admission letter and report to your centre'],
        ].map(([num, step]) => `
          <tr>
            <td style="padding:8px 0;vertical-align:top;width:32px">
              <div style="width:24px;height:24px;background:#006400;border-radius:50%;color:#fff;font-size:12px;font-weight:700;text-align:center;line-height:24px">${num}</div>
            </td>
            <td style="padding:8px 0;color:#475569;font-size:14px;line-height:1.5">${step}</td>
          </tr>
        `).join('')}
      </table>

      ${ctaButton('Go to My Dashboard', `${SITE}/dashboard`)}
      <p style="color:#94a3b8;font-size:12px;text-align:center;margin-top:16px">
        Slots are limited &mdash; complete your application early to secure your place.
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
  const typeLabel = paymentType === 'form_fee' ? 'IJMB Registration Form Fee'
    : paymentType === 'tuition' ? 'IJMB Tuition Fee'
    : paymentType === 'hostel'  ? 'IJMB Hostel Fee'
    : 'Payment';

  const nextStep = paymentType === 'form_fee'
    ? 'Complete your application form and upload your documents on your dashboard.'
    : 'Your payment has been recorded. View your payment history on your dashboard.';

  const body = `
    ${header('Payment Confirmed', 'Your payment has been received')}
    <div style="padding:40px 40px 32px">

      <div style="text-align:center;margin-bottom:32px">
        <div style="display:inline-block;background:#dcfce7;border-radius:50%;width:72px;height:72px;line-height:72px;font-size:36px;margin-bottom:12px">✓</div>
        <p style="color:#16a34a;font-size:20px;font-weight:700;margin:0">Payment Successful!</p>
        <p style="color:#64748b;font-size:14px;margin:6px 0 0">Hi <strong>${esc(fullName)}</strong>, here are your payment details</p>
      </div>

      <div style="background:#f8fafc;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;margin-bottom:24px">
        ${infoTable([
          infoRow('Payment For', typeLabel),
          infoRow('Amount Paid', `<span style="color:#16a34a;font-size:15px">₦${amount.toLocaleString()}</span>`),
          infoRow('Reference', `<code style="font-size:12px;background:#f1f5f9;padding:2px 6px;border-radius:4px">${esc(reference)}</code>`),
          infoRow('Date', new Date().toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })),
          infoRow('Status', badge('✓ CONFIRMED', '#14532d', '#dcfce7')),
        ].join(''))}
      </div>

      <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:12px;padding:16px 20px;margin-bottom:24px">
        <p style="margin:0;font-size:14px;color:#7a5c00;font-weight:600">Next step</p>
        <p style="margin:4px 0 0;font-size:13px;color:#92400e">${nextStep}</p>
      </div>

      ${ctaButton('View My Dashboard', `${SITE}/dashboard`)}
      <p style="color:#94a3b8;font-size:12px;text-align:center;margin-top:16px">
        Save this email as your receipt &mdash; Ref: <strong>${esc(reference)}</strong>
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
    ${header('Application Submitted', `IJMB ${YEAR} Session`)}
    <div style="padding:40px 40px 32px">
      <p style="color:#0f172a;font-size:18px;font-weight:700;margin:0 0 8px">Application Received!</p>
      <p style="color:#475569;font-size:15px;margin:0 0 24px;line-height:1.7">
        Hi <strong>${esc(fullName)}</strong>, your IJMB ${YEAR} application has been submitted and is now under review by our admissions team.
      </p>

      <div style="background:#f8fafc;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;margin-bottom:24px">
        ${infoTable([
          infoRow('Application ID', `<code style="font-size:12px;background:#f1f5f9;padding:2px 6px;border-radius:4px">${esc(applicationId)}</code>`),
          infoRow('Study Centre', esc(centre) || 'To be assigned'),
          infoRow('Subjects', esc(subjects) || 'As selected'),
          infoRow('Session', YEAR),
          infoRow('Status', badge('⏳ Under Review', '#7a5c00', '#fef9c3')),
        ].join(''))}
      </div>

      <p style="color:#0f172a;font-size:14px;font-weight:700;margin:0 0 12px;text-transform:uppercase;letter-spacing:0.5px">What happens next</p>
      <table style="width:100%;border-collapse:collapse">
        ${[
          ['Our team reviews your documents', '2–5 working days'],
          ['You receive an admission offer email', 'Once approved'],
          ['Print your admission letter', 'From your dashboard'],
          ['Report to your assigned centre', 'On resumption date'],
        ].map(([step, timing]) => `
          <tr>
            <td style="padding:8px 0 8px 0;vertical-align:top;width:16px">
              <div style="width:8px;height:8px;background:#006400;border-radius:50%;margin-top:6px"></div>
            </td>
            <td style="padding:8px 0 8px 12px">
              <p style="margin:0;color:#0f172a;font-size:14px;font-weight:600">${step}</p>
              <p style="margin:2px 0 0;color:#94a3b8;font-size:12px">${timing}</p>
            </td>
          </tr>
        `).join('')}
      </table>

      ${ctaButton('Track My Application', `${SITE}/dashboard`)}
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
    ${header('Congratulations — You\'ve Been Admitted!', `IJMB ${YEAR} Session`)}
    <div style="padding:40px 40px 32px">

      <div style="text-align:center;margin-bottom:32px">
        <div style="font-size:56px;margin-bottom:8px">🎉</div>
        <p style="color:#006400;font-size:22px;font-weight:700;margin:0 0 6px">Congratulations, ${esc(fullName)}!</p>
        <p style="color:#64748b;font-size:14px;margin:0">You have been offered admission into the IJMB Programme</p>
      </div>

      <div style="background:linear-gradient(135deg,#006400,#004d00);border-radius:12px;padding:20px 24px;margin-bottom:24px;text-align:center">
        <p style="color:#ffd700;font-weight:700;font-size:18px;margin:0 0 4px;letter-spacing:-0.2px">IJMB ${YEAR} Session</p>
        <p style="color:rgba(255,255,255,0.75);font-size:13px;margin:0">Interim Joint Matriculation Board &mdash; Direct Entry Programme</p>
      </div>

      <div style="background:#f8fafc;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;margin-bottom:24px">
        ${infoTable([
          infoRow('Full Name', esc(fullName)),
          infoRow('Application ID', `<code style="font-size:12px;background:#f1f5f9;padding:2px 6px;border-radius:4px">${esc(applicationId)}</code>`),
          infoRow('Study Centre', esc(centre)),
          infoRow('Subject Combination', esc(subjects)),
          infoRow('Resumption Date', `<strong style="color:#006400">${esc(resumptionDate)}</strong>`),
          infoRow('Status', badge('✓ ADMITTED', '#14532d', '#dcfce7')),
        ].join(''))}
      </div>

      <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:12px;padding:16px 20px;margin-bottom:24px">
        <p style="margin:0;font-size:14px;color:#7a5c00;font-weight:700">Important — What to bring on resumption day:</p>
        <p style="margin:8px 0 0;font-size:13px;color:#92400e;line-height:1.7">
          ✓ Printed admission letter &nbsp;&nbsp; ✓ O-Level result &nbsp;&nbsp; ✓ Passport photographs &nbsp;&nbsp; ✓ Payment receipts
        </p>
      </div>

      ${ctaButton('Download Admission Letter', `${SITE}/dashboard`)}
      <p style="color:#64748b;font-size:13px;text-align:center;margin-top:16px;line-height:1.7">
        Upon completing IJMB, you qualify for <strong>Direct Entry into 200 Level</strong> at over 200 Nigerian universities &mdash; without UTME.
      </p>
    </div>
    ${footer()}
  `;
  return {
    html: wrapper(body),
    subject: `🎉 Admission Offer — IJMB ${YEAR} | ${esc(fullName)}`
  };
}

// ─── 5. ADMISSION LETTER AVAILABLE ────────────────────────────────────────
export function admissionLetterEmail(fullName: string, applicationId: string) {
  const body = `
    ${header('Your Admission Letter is Ready', 'Download it from your dashboard')}
    <div style="padding:40px 40px 32px">

      <div style="text-align:center;margin-bottom:32px">
        <div style="font-size:56px;margin-bottom:8px">📄</div>
        <p style="color:#0f172a;font-size:20px;font-weight:700;margin:0 0 6px">Admission Letter Ready</p>
        <p style="color:#64748b;font-size:14px;margin:0">Hi <strong>${esc(fullName)}</strong>, your letter has been uploaded and is available for download.</p>
      </div>

      <div style="background:#f8fafc;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;margin-bottom:24px">
        ${infoTable([
          infoRow('Application ID', `<code style="font-size:12px;background:#f1f5f9;padding:2px 6px;border-radius:4px">${esc(applicationId)}</code>`),
          infoRow('Status', badge('✓ Letter Available', '#14532d', '#dcfce7')),
        ].join(''))}
      </div>

      <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:12px;padding:16px 20px;margin-bottom:24px">
        <p style="margin:0;font-size:14px;color:#7a5c00;font-weight:700">Next step</p>
        <p style="margin:4px 0 0;font-size:13px;color:#92400e">Log in to your dashboard, download and print your admission letter. Bring it on resumption day.</p>
      </div>

      ${ctaButton('Download My Admission Letter', `${SITE}/dashboard`)}
    </div>
    ${footer()}
  `;
  return {
    html: wrapper(body),
    subject: `Your IJMB Admission Letter is Ready — ${esc(applicationId)}`
  };
}

// ─── 6. PASSWORD RESET ────────────────────────────────────────────────────
export function passwordResetEmail(resetLink: string) {
  const body = `
    ${header('Reset Your Password', 'This link expires in 1 hour')}
    <div style="padding:40px 40px 32px">
      <p style="color:#0f172a;font-size:18px;font-weight:700;margin:0 0 8px">Forgot your password?</p>
      <p style="color:#475569;font-size:15px;margin:0 0 28px;line-height:1.7">
        We received a request to reset the password for your IJMB Student Portal account. Click the button below to set a new password.
      </p>

      ${ctaButton('Reset My Password', resetLink)}

      <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:12px;padding:16px 20px;margin:24px 0">
        <p style="margin:0;font-size:13px;color:#7f1d1d;font-weight:600">Security notice</p>
        <p style="margin:4px 0 0;font-size:13px;color:#991b1b">
          This link expires in <strong>1 hour</strong>. If you did not request a password reset, you can safely ignore this email.
        </p>
      </div>

      <p style="color:#94a3b8;font-size:12px;text-align:center;margin:0">
        Button not working? Copy and paste this link:<br/>
        <a href="${resetLink}" style="color:#006400;font-size:11px;word-break:break-all">${resetLink}</a>
      </p>
    </div>
    ${footer()}
  `;
  return { html: wrapper(body), subject: 'Reset Your IJMB Portal Password' };
}

// ─── 7. ACCOUNT UPDATE ───────────────────────────────────────────────────
export function accountUpdateEmail(fullName: string, changeDescription: string) {
  const body = `
    ${header('Account Updated', 'A change was made to your account')}
    <div style="padding:40px 40px 32px">
      <p style="color:#0f172a;font-size:18px;font-weight:700;margin:0 0 8px">Account Change Notification</p>
      <p style="color:#475569;font-size:15px;margin:0 0 24px;line-height:1.7">
        Hi <strong>${esc(fullName)}</strong>, this is a notification that your IJMB Student Portal account was recently updated.
      </p>

      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:18px 20px;margin-bottom:20px">
        <p style="margin:0 0 4px;font-size:13px;color:#64748b;font-weight:600;text-transform:uppercase;letter-spacing:0.4px">Change made</p>
        <p style="margin:0;font-size:15px;color:#0f172a;font-weight:600">${esc(changeDescription)}</p>
        <p style="margin:6px 0 0;font-size:12px;color:#94a3b8">${new Date().toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
      </div>

      <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:12px;padding:16px 20px;margin-bottom:24px">
        <p style="margin:0;font-size:13px;color:#7f1d1d">
          <strong>Wasn't you?</strong> Contact us immediately at <a href="mailto:${SUPPORT_EMAIL}" style="color:#006400;font-weight:600">${SUPPORT_EMAIL}</a>
        </p>
      </div>

      ${ctaButton('Review My Account', `${SITE}/dashboard`)}
    </div>
    ${footer()}
  `;
  return { html: wrapper(body), subject: 'Your IJMB Portal Account Was Updated' };
}

// ─── 8. ADMIN: NEW REGISTRATION NOTIFICATION ──────────────────────────────
export function adminNewRegistrationEmail(fullName: string, email: string, phone: string) {
  const body = `
    ${header('New Student Registration', 'A new account was just created')}
    <div style="padding:40px 40px 32px">
      <p style="color:#0f172a;font-size:18px;font-weight:700;margin:0 0 8px">New Student Registered</p>
      <p style="color:#475569;font-size:15px;margin:0 0 24px;line-height:1.7">
        A new student has just created an account on the IJMB portal.
      </p>

      <div style="background:#f8fafc;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;margin-bottom:24px">
        ${infoTable([
          infoRow('Full Name', esc(fullName)),
          infoRow('Email', esc(email)),
          infoRow('Phone', esc(phone) || 'Not provided'),
          infoRow('Registered', new Date().toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' } as any)),
        ].join(''))}
      </div>

      ${ctaButton('View in Admin Dashboard', `${SITE}/portal-admin?tab=students`)}
    </div>
    ${footer()}
  `;
  return { html: wrapper(body), subject: `New Registration: ${esc(fullName)}` };
}

// ─── 9. INCOMPLETE APPLICATION REMINDER ───────────────────────────────────
export function incompleteApplicationReminderEmail(
  fullName: string,
  type: 'no_application' | 'draft'
) {
  const isNoApp = type === 'no_application';
  const statusLine = isNoApp
    ? "You created your IJMB account but haven't started your application yet."
    : "You started your IJMB application but haven't submitted it yet.";
  const ctaLabel = isNoApp ? 'Start My Application' : 'Complete My Application';

  const body = `
    ${header('Your IJMB Application is Waiting', `Don't miss your spot for ${YEAR}`)}
    <div style="padding:40px 40px 32px">
      <p style="color:#0f172a;font-size:18px;font-weight:700;margin:0 0 8px">Hi ${esc(fullName)},</p>
      <p style="color:#475569;font-size:15px;margin:0 0 24px;line-height:1.7">
        ${statusLine} Thousands of students are applying for the IJMB ${YEAR} session &mdash; <strong style="color:#006400">don't lose your place.</strong>
      </p>

      <div style="background:linear-gradient(135deg,#006400,#004d00);border-radius:12px;padding:20px 24px;margin-bottom:28px;text-align:center">
        <p style="color:#ffd700;font-weight:700;font-size:17px;margin:0 0 4px">IJMB ${YEAR} Session</p>
        <p style="color:rgba(255,255,255,0.75);font-size:13px;margin:0">Complete your application to secure your admission</p>
      </div>

      <p style="color:#0f172a;font-size:14px;font-weight:700;margin:0 0 12px;text-transform:uppercase;letter-spacing:0.5px">Why complete your application?</p>
      <table style="width:100%;border-collapse:collapse;margin-bottom:28px">
        ${[
          ['Gain Direct Entry into 200 Level', 'Skip 100 Level and go straight into your second year at university'],
          ['No UTME required', 'IJMB is fully recognised by JAMB as a Direct Entry qualification'],
          ['200+ universities accept IJMB', 'Including University of Ibadan, OAU, UNILAG, ABU and many more'],
          ['Flexible study centres nationwide', 'Study near you — centres in every major state'],
        ].map(([title, detail]) => `
          <tr>
            <td style="padding:8px 0;vertical-align:top;width:16px">
              <div style="width:8px;height:8px;background:#006400;border-radius:50%;margin-top:6px"></div>
            </td>
            <td style="padding:8px 0 8px 12px">
              <p style="margin:0;color:#0f172a;font-size:14px;font-weight:600">${title}</p>
              <p style="margin:2px 0 0;color:#94a3b8;font-size:12px">${detail}</p>
            </td>
          </tr>
        `).join('')}
      </table>

      <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:12px;padding:16px 20px;margin-bottom:28px">
        <p style="margin:0;font-size:14px;color:#7a5c00;font-weight:700">⚠ Limited Slots Available</p>
        <p style="margin:4px 0 0;font-size:13px;color:#92400e;line-height:1.6">
          The ${YEAR} session is open now. Each study centre has a limited number of places. Complete your application before the session closes.
        </p>
      </div>

      ${ctaButton(ctaLabel, `${SITE}/dashboard`)}
      <p style="color:#94a3b8;font-size:12px;text-align:center;margin-top:16px">
        The application takes about 10 minutes to complete. The registration fee is ₦10,000.
      </p>
      ${divider()}
      <p style="color:#cbd5e1;font-size:11px;text-align:center;margin:0">
        You're receiving this because you registered on the IJMB portal. If you no longer wish to apply, simply ignore this email.
      </p>
    </div>
    ${footer()}
  `;
  return {
    html: wrapper(body),
    subject: `Complete Your IJMB ${YEAR} Application — Slots Are Filling Up`
  };
}

// ─── 10. STAGE REMINDERS ───────────────────────────────────────────────────

export function reminderNoApplicationEmail(fullName: string) {
  const body = `
    ${header('Your IJMB Journey Awaits', 'You registered but haven\'t started your application yet')}
    <div style="padding:40px 40px 32px">
      <p style="color:#0f172a;font-size:18px;font-weight:700;margin:0 0 16px">Hi ${esc(fullName)},</p>
      <p style="color:#475569;font-size:15px;line-height:1.8;margin-bottom:20px">
        You created your IJMB account but haven't started your application yet. Slots at our study centres are limited
        and filling up fast for the <strong>${YEAR}</strong> session.
      </p>
      <div style="background:#f0fdf4;border:1px solid #86efac;border-radius:12px;padding:20px 24px;margin-bottom:24px">
        <p style="margin:0 0 10px;font-size:14px;font-weight:700;color:#166534">What happens when you apply:</p>
        <p style="margin:4px 0;font-size:13px;color:#166534">✓ Skip 100 level — enter university at 200 level directly</p>
        <p style="margin:4px 0;font-size:13px;color:#166534">✓ Recognised by 40+ federal and state universities</p>
        <p style="margin:4px 0;font-size:13px;color:#166534">✓ Registration form fee is just ₦10,000</p>
      </div>
      ${ctaButton('Start My Application Now', `${SITE}/dashboard`)}
      <p style="color:#94a3b8;font-size:12px;text-align:center;margin-top:16px">
        Takes less than 10 minutes. Need help? Reply to this email or contact <a href="mailto:${SUPPORT_EMAIL}" style="color:#006400">${SUPPORT_EMAIL}</a>
      </p>
    </div>
    ${footer()}
  `;
  return { html: wrapper(body), subject: `${esc(fullName)}, your IJMB application is waiting — start today` };
}

export function reminderAbandonedDraftEmail(fullName: string) {
  const body = `
    ${header('Complete Your IJMB Application', 'You\'re almost there — don\'t lose your spot')}
    <div style="padding:40px 40px 32px">
      <p style="color:#0f172a;font-size:18px;font-weight:700;margin:0 0 16px">Hi ${esc(fullName)},</p>
      <p style="color:#475569;font-size:15px;line-height:1.8;margin-bottom:20px">
        You started your IJMB application but didn't finish it. Your draft is saved — log in now to pick up where you left off
        and secure your place for the <strong>${YEAR}</strong> session before slots close.
      </p>
      <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:12px;padding:16px 20px;margin-bottom:24px">
        <p style="margin:0;font-size:14px;color:#7a5c00;font-weight:700">⚠ Don't lose your spot</p>
        <p style="margin:4px 0 0;font-size:13px;color:#92400e;line-height:1.6">
          Study centre slots are limited. Incomplete applications do not reserve a place — submit yours today.
        </p>
      </div>
      ${ctaButton('Continue My Application', `${SITE}/dashboard`)}
      <p style="color:#94a3b8;font-size:12px;text-align:center;margin-top:16px">
        Questions? Reply to this email or contact <a href="mailto:${SUPPORT_EMAIL}" style="color:#006400">${SUPPORT_EMAIL}</a>
      </p>
    </div>
    ${footer()}
  `;
  return { html: wrapper(body), subject: `${esc(fullName)}, complete your IJMB application — slots are filling up` };
}

export function reminderPaymentPendingEmail(fullName: string) {
  const body = `
    ${header('Complete Your IJMB Payment', 'One step away from securing your place')}
    <div style="padding:40px 40px 32px">
      <p style="color:#0f172a;font-size:18px;font-weight:700;margin:0 0 16px">Hi ${esc(fullName)},</p>
      <p style="color:#475569;font-size:15px;line-height:1.8;margin-bottom:20px">
        Your IJMB application is ready — the only thing left is to complete your payment to confirm your place
        for the <strong>${YEAR}</strong> session.
      </p>
      <div style="background:#f0fdf4;border:1px solid #86efac;border-radius:12px;padding:20px 24px;margin-bottom:24px">
        <p style="margin:0 0 8px;font-size:14px;font-weight:700;color:#166534">Registration Form Fee</p>
        <p style="margin:0;font-size:28px;font-weight:800;color:#006400">₦10,000</p>
        <p style="margin:4px 0 0;font-size:12px;color:#166534">One-time payment to confirm your application</p>
      </div>
      <p style="color:#475569;font-size:14px;line-height:1.7;margin-bottom:24px">
        Log in to your dashboard to complete payment. If you have any issues paying, reply to this email and we'll help you straight away.
      </p>
      ${ctaButton('Pay Now & Confirm My Place', `${SITE}/dashboard`)}
      <p style="color:#94a3b8;font-size:12px;text-align:center;margin-top:16px">
        Need help? Contact us at <a href="mailto:${SUPPORT_EMAIL}" style="color:#006400">${SUPPORT_EMAIL}</a>
      </p>
    </div>
    ${footer()}
  `;
  return { html: wrapper(body), subject: `Action needed: complete your IJMB payment, ${esc(fullName)}` };
}

// ─── 11. REJECTION NOTIFICATION ───────────────────────────────────────────
export function rejectionEmail(fullName: string, applicationId: string) {
  const body = `
    ${header('Application Update', `IJMB ${YEAR} Session`)}
    <div style="padding:40px 40px 32px">

      <div style="text-align:center;margin-bottom:32px">
        <div style="font-size:48px;margin-bottom:12px">📋</div>
        <p style="color:#0f172a;font-size:20px;font-weight:700;margin:0 0 6px">Dear ${esc(fullName)},</p>
        <p style="color:#64748b;font-size:14px;margin:0">We have an update regarding your IJMB application.</p>
      </div>

      <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:12px;padding:20px 24px;margin-bottom:24px">
        <p style="margin:0;font-size:15px;color:#7f1d1d;line-height:1.8">
          We regret to inform you that your application was not successful at this time. We appreciate the interest you showed in the IJMB programme.
        </p>
      </div>

      <div style="background:#f8fafc;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;margin-bottom:24px">
        ${infoTable([
          infoRow('Application ID', `<code style="font-size:12px;background:#f1f5f9;padding:2px 6px;border-radius:4px">${esc(applicationId)}</code>`),
          infoRow('Status', badge('Application Closed', '#7f1d1d', '#fef2f2')),
        ].join(''))}
      </div>

      <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:12px;padding:16px 20px;margin-bottom:28px">
        <p style="margin:0;font-size:14px;color:#7a5c00;font-weight:700">Need help or want to appeal?</p>
        <p style="margin:6px 0 0;font-size:13px;color:#92400e;line-height:1.7">
          Please contact us on WhatsApp for next steps. Our team will be happy to assist you and explain any further options available to you.
        </p>
      </div>

      ${ctaButton('Chat with Us on WhatsApp', 'https://wa.link/udcjk0', '#25D366')}
      <p style="color:#94a3b8;font-size:12px;text-align:center;margin-top:16px">
        You can also reach us at <a href="mailto:${SUPPORT_EMAIL}" style="color:#006400">${SUPPORT_EMAIL}</a>
      </p>
    </div>
    ${footer()}
  `;
  return {
    html: wrapper(body),
    subject: `IJMB Application Update — ${esc(applicationId)}`
  };
}

// ─── 12. DOCUMENT REQUEST ─────────────────────────────────────────────────
export function documentRequestEmail(studentName: string, message: string, dashboardUrl: string) {
  const body = `
    ${header('Document Upload Required', 'Action needed on your IJMB application')}
    <div style="padding:40px 40px 32px">
      <p style="color:#0f172a;font-size:18px;font-weight:700;margin:0 0 20px">Dear ${esc(studentName)},</p>

      <p style="color:#475569;font-size:15px;margin:0 0 24px;line-height:1.7">
        Our admissions team has reviewed your application and requires additional document(s) from you before we can proceed.
      </p>

      <div style="background:#f8fafc;border-left:4px solid #006400;border-radius:0 12px 12px 0;padding:20px 24px;margin-bottom:24px">
        <p style="margin:0 0 6px;font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.4px">Message from Admissions</p>
        <p style="margin:0;font-size:15px;color:#1e293b;line-height:1.8;white-space:pre-wrap">${esc(message)}</p>
      </div>

      <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:12px;padding:16px 20px;margin-bottom:28px">
        <p style="margin:0;font-size:14px;color:#7a5c00;font-weight:700">What to do next</p>
        <p style="margin:4px 0 0;font-size:13px;color:#92400e;line-height:1.7">
          Log in to your dashboard and go to the <strong>Documents</strong> section to upload the requested file. Once uploaded, our team will be notified automatically.
        </p>
      </div>

      ${ctaButton('Upload Document Now', dashboardUrl)}
      <p style="color:#94a3b8;font-size:12px;text-align:center;margin-top:16px">
        Questions? Reply to this email or contact <a href="mailto:${SUPPORT_EMAIL}" style="color:#006400">${SUPPORT_EMAIL}</a>
      </p>
    </div>
    ${footer()}
  `;
  return {
    html: wrapper(body),
    subject: `Action Required: Upload Document for Your IJMB Application`
  };
}

// ─── 13. ADMIN: DIRECT MESSAGE TO STUDENT ─────────────────────────────────
export function adminDirectMessageEmail(studentName: string, subject: string, message: string) {
  const body = `
    ${header('Message from IJMB', 'Official communication from the IJMB team')}
    <div style="padding:40px 40px 32px">
      <p style="color:#0f172a;font-size:18px;font-weight:700;margin:0 0 20px">Dear ${esc(studentName)},</p>

      <div style="background:#f8fafc;border-left:4px solid #006400;border-radius:0 12px 12px 0;padding:20px 24px;margin-bottom:24px">
        <p style="margin:0;font-size:15px;color:#1e293b;line-height:1.8;white-space:pre-wrap">${esc(message)}</p>
      </div>

      <p style="color:#475569;font-size:14px;line-height:1.7;margin-bottom:24px">
        You can reply directly to this email and our support team will respond as soon as possible.
      </p>

      ${ctaButton('Go to My Dashboard', `${SITE}/dashboard`)}
    </div>
    ${footer()}
  `;
  return { html: wrapper(body), subject: esc(subject) };
}

export function centreRemovedEmail(fullName: string, dashboardUrl: string) {
  const body = `
    ${header('Action Required: Select a New Study Centre', 'Your previously selected centre is no longer available')}
    <div style="padding:40px 40px 32px">
      <p style="color:#0f172a;font-size:18px;font-weight:700;margin:0 0 20px">Dear ${esc(fullName)},</p>

      <p style="color:#475569;font-size:15px;line-height:1.7;margin-bottom:20px">
        We're writing to let you know that the study centre you previously selected for your IJMB programme
        is no longer available.
      </p>

      <div style="background:#fef9c3;border-left:4px solid #ca8a04;border-radius:0 12px 12px 0;padding:20px 24px;margin-bottom:28px">
        <p style="margin:0;font-size:14px;color:#92400e;font-weight:600">
          Please log in to your dashboard and select a new centre from the available options as soon as possible.
          Your application cannot proceed without a valid centre selection.
        </p>
      </div>

      ${ctaButton('Select a New Centre', dashboardUrl)}

      <p style="color:#94a3b8;font-size:13px;line-height:1.6;margin-top:28px">
        If you have any questions, contact us on WhatsApp:
        <a href="https://wa.me/2348100000000" style="color:#006400">+234 810 000 0000</a>
      </p>
    </div>
    ${footer()}
  `;
  return { html: wrapper(body), subject: 'Action Required — Please Select a New Study Centre' };
}
