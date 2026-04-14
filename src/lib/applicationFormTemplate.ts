/** Escape user-supplied strings before embedding in HTML to prevent XSS */
function esc(str: string | undefined | null): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

export interface OLevelResult {
  subject: string;
  grade: string;
  examYear: string;
  examType: string;
}

export interface ApplicationFormData {
  applicationId: string;
  registrationDate: string;
  academicSession: string;
  surname: string;
  firstName: string;
  middleName: string;
  gender: string;
  dateOfBirth: string;
  stateOfOrigin: string;
  lga: string;
  phoneNumber: string;
  email: string;
  residentialAddress: string;
  centreOfStudy: string;
  courseOfChoice: string;
  subjectCombination: string;
  subject1?: string;
  subject2?: string;
  subject3?: string;
  olevelResults?: OLevelResult[];
  paymentReference?: string;
  paymentDate?: string;
  amountPaid?: string;
  passportPhotoBase64: string;
  qrCodeBase64: string;
  logoBase64: string;
}

export const buildApplicationFormHTML = (data: ApplicationFormData): string => {
  const logoSrc = data.logoBase64 || '';

  /* ── Subject rows ─────────────────────────────────────────────── */
  const subjects = [data.subject1, data.subject2, data.subject3].filter(Boolean);
  const subjectRows = subjects.length
    ? subjects
        .map(
          (s, i) =>
            `<tr>
              <td style="width:22px;text-align:center;font-family:'Courier New',monospace;font-size:8px;font-weight:700;color:#003d00;padding:4px 5px;border-bottom:1px solid #e0e0d8;border-right:1px solid #e0e0d8;">${i + 1}</td>
              <td style="font-size:8px;color:#222;padding:4px 5px;border-bottom:1px solid #e0e0d8;border-right:1px solid #e0e0d8;">${esc(s)}</td>
              <td style="font-size:8px;color:#222;padding:4px 5px;border-bottom:1px solid #e0e0d8;">IJMB Core Subject</td>
            </tr>`
        )
        .join('')
    : `<tr>
        <td style="width:22px;text-align:center;font-family:'Courier New',monospace;font-size:8px;font-weight:700;color:#003d00;padding:4px 5px;border-bottom:1px solid #e0e0d8;border-right:1px solid #e0e0d8;">1</td>
        <td colspan="2" style="font-size:8px;color:#222;padding:4px 5px;border-bottom:1px solid #e0e0d8;">${esc(data.subjectCombination) || '&mdash;'}</td>
      </tr>`;

  /* ── O-Level rows ─────────────────────────────────────────────── */
  const olevelRows =
    data.olevelResults && data.olevelResults.length
      ? data.olevelResults
          .slice(0, 9)
          .map((r, i) => {
            const bg = i % 2 === 1 ? 'background:#f5f8f5;' : '';
            return `<tr>
              <td style="width:22px;text-align:center;font-family:'Courier New',monospace;font-size:8px;font-weight:700;color:#003d00;padding:4px 5px;border-bottom:1px solid #e0e0d8;border-right:1px solid #e0e0d8;${bg}">${i + 1}</td>
              <td style="font-size:8px;color:#222;padding:4px 5px;border-bottom:1px solid #e0e0d8;border-right:1px solid #e0e0d8;${bg}">${esc(r.subject)}</td>
              <td style="width:44px;font-size:8px;color:#222;padding:4px 5px;border-bottom:1px solid #e0e0d8;border-right:1px solid #e0e0d8;${bg}">${esc(r.grade)}</td>
              <td style="width:52px;font-size:8px;color:#222;padding:4px 5px;border-bottom:1px solid #e0e0d8;border-right:1px solid #e0e0d8;${bg}">${esc(r.examYear)}</td>
              <td style="width:60px;font-size:8px;color:#222;padding:4px 5px;border-bottom:1px solid #e0e0d8;${bg}">${esc(r.examType)}</td>
            </tr>`;
          })
          .join('')
      : `<tr>
          <td style="text-align:center;font-size:7px;color:#bbb;font-style:italic;padding:6px 5px;border-bottom:1px solid #e0e0d8;" colspan="5">O-Level results not yet uploaded</td>
        </tr>`;

  /* ── Passport photo HTML ──────────────────────────────────────── */
  const passportHtml = data.passportPhotoBase64
    ? `<img src="${data.passportPhotoBase64}" alt="Passport" style="width:100px;height:120px;object-fit:cover;display:block;"/>`
    : `<div style="width:100px;height:120px;background:#f0f0eb;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#bbb" stroke-width="1.2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
        <span style="font-size:6px;color:#bbb;text-transform:uppercase;letter-spacing:0.5px;">No Photo</span>
      </div>`;

  /* ── QR code HTML ─────────────────────────────────────────────── */
  const qrHtml = data.qrCodeBase64
    ? `<img src="${data.qrCodeBase64}" alt="QR Code" style="width:76px;height:76px;display:block;"/>`
    : `<div style="width:76px;height:76px;background:#eee;display:flex;align-items:center;justify-content:center;font-size:7px;color:#bbb;">No QR</div>`;

  const printDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  /* ── Section header helper ────────────────────────────────────── */
  const secHdr = (letter: string, title: string) =>
    `<div style="background:#003d00;display:flex;align-items:center;gap:6px;padding:3px 8px;margin-bottom:5px;position:relative;">
      <div style="width:15px;height:15px;border-radius:50%;background:#c9950f;color:#003d00;font-size:8px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;line-height:1;">${letter}</div>
      <span style="font-size:7px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#fff;">${title}</span>
      <div style="position:absolute;right:0;top:0;bottom:0;width:3px;background:#c9950f;"></div>
    </div>`;

  /* ── Field helper ─────────────────────────────────────────────── */
  const field = (label: string, value: string) =>
    `<div style="display:flex;flex-direction:column;gap:1px;">
      <span style="font-size:6px;font-weight:700;color:#999;text-transform:uppercase;letter-spacing:0.7px;">${label}</span>
      <div style="font-size:8px;font-weight:700;color:#111;padding:2px 0 3px;border-bottom:1px solid #dcdcd4;min-height:14px;">${value || '&mdash;'}</div>
    </div>`;

  /* ── Table header row helper ──────────────────────────────────── */
  const thStyle =
    'background:#003d00;color:#fff;font-size:7px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;padding:4px 5px;text-align:left;border-right:1px solid rgba(255,255,255,0.15);';
  const thStyleLast =
    'background:#003d00;color:#fff;font-size:7px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;padding:4px 5px;text-align:left;';

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>IJMB Student Registration Slip</title>
<style>
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'Segoe UI',Arial,sans-serif;background:#ccc;display:flex;justify-content:center;padding:16px;font-size:8px;line-height:1.3;}
</style>
</head>
<body>

<!-- ═══════════════════════════════════════════════════════════════ -->
<!-- OUTER DOCUMENT BORDER — double-line frame                      -->
<!-- ═══════════════════════════════════════════════════════════════ -->
<div style="width:794px;height:1123px;border:4px double #003d00;padding:8px;background:#fff;box-shadow:0 4px 24px rgba(0,0,0,0.28);position:relative;overflow:hidden;">

  <!-- WATERMARK — faint logo centered behind content -->
  <img src="${logoSrc}" alt="" aria-hidden="true"
    style="position:absolute;top:50%;left:50%;width:340px;height:340px;object-fit:contain;opacity:0.06;filter:grayscale(1);transform:translate(-50%,-50%) rotate(-20deg);pointer-events:none;z-index:0;"/>

  <!-- INNER BORDER -->
  <div style="position:relative;z-index:1;width:100%;height:100%;border:1.5px solid #003d00;display:flex;flex-direction:column;overflow:hidden;">

    <!-- ══════════════════════════════════════════════════════════ -->
    <!-- HEADER BAND                                               -->
    <!-- ══════════════════════════════════════════════════════════ -->
    <div style="background:#003d00;flex-shrink:0;">

      <!-- Gold top accent stripe -->
      <div style="height:3px;background:linear-gradient(90deg,#6b500e,#c9950f,#f0c040,#c9950f,#6b500e);"></div>

      <!-- Header content row -->
      <div style="display:flex;align-items:center;gap:10px;padding:8px 14px 10px;min-height:90px;">

        <!-- Logo circle -->
        <div style="flex-shrink:0;width:60px;height:60px;border-radius:50%;background:#fff;border:2px solid #c9950f;padding:2px;display:flex;align-items:center;justify-content:center;overflow:hidden;">
          <img src="${logoSrc}" alt="IJMB" style="width:54px;height:54px;border-radius:50%;object-fit:cover;display:block;"/>
        </div>

        <!-- Centre text block -->
        <div style="flex:1;text-align:center;">
          <div style="font-size:7px;letter-spacing:2px;color:#7ec47e;text-transform:uppercase;font-weight:600;">Federal Republic of Nigeria</div>
          <div style="font-family:Georgia,'Times New Roman',serif;font-size:14px;font-weight:700;color:#fff;margin:3px 0 2px;line-height:1.2;">Interim Joint Matriculation Board (IJMB)</div>
          <div style="font-size:8px;color:#aad4aa;letter-spacing:0.5px;">P.M.B. 1026, Ahmadu Bello University, Zaria &mdash; ijmb.info</div>
          <div style="display:inline-block;margin-top:5px;font-size:11px;font-weight:700;color:#f0c040;letter-spacing:2px;text-transform:uppercase;border-top:1px solid rgba(201,149,15,0.5);border-bottom:1px solid rgba(201,149,15,0.5);padding:2px 10px;">
            STUDENT REGISTRATION SLIP
          </div>
          <div style="margin-top:3px;font-size:7px;color:#c9950f;letter-spacing:1.5px;text-transform:uppercase;">Academic Session: ${esc(data.academicSession)}</div>
        </div>

        <!-- Registration number badge -->
        <div style="flex-shrink:0;background:rgba(255,255,255,0.07);border:1.5px solid #c9950f;border-radius:4px;padding:6px 10px;text-align:center;min-width:95px;">
          <span style="display:block;font-size:6px;letter-spacing:1.2px;text-transform:uppercase;color:#7ec47e;font-weight:700;">Reg. Number</span>
          <span style="display:block;font-family:'Courier New',monospace;font-size:11px;font-weight:700;color:#f0c040;letter-spacing:1.5px;margin-top:3px;">${esc(data.applicationId)}</span>
        </div>

      </div><!-- /header content row -->

      <!-- Gold bottom accent stripe -->
      <div style="height:3px;background:linear-gradient(90deg,#6b500e,#c9950f,#f0c040,#c9950f,#6b500e);"></div>
    </div><!-- /header band -->

    <!-- ══════════════════════════════════════════════════════════ -->
    <!-- BODY — main + sidebar                                     -->
    <!-- ══════════════════════════════════════════════════════════ -->
    <div style="display:flex;flex-direction:row;flex:1;overflow:hidden;min-height:0;">

      <!-- ────────────────────────────────────────────────────── -->
      <!-- MAIN CONTENT                                           -->
      <!-- ────────────────────────────────────────────────────── -->
      <div style="flex:1;padding:8px 10px;overflow:hidden;min-height:0;border-right:1px solid #d8d8d0;">

        <!-- SECTION A: Personal Details -->
        <div style="margin-bottom:6px;">
          ${secHdr('A', 'Personal Details')}
          <!-- Row 1: Name (3 cols) -->
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:4px 10px;margin-bottom:4px;">
            ${field('Surname', esc(data.surname))}
            ${field('First Name', esc(data.firstName))}
            ${field('Middle Name', esc(data.middleName) || '&mdash;')}
          </div>
          <!-- Row 2: DOB / Gender / State / LGA (4 cols) -->
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:4px 8px;margin-bottom:4px;">
            ${field('Date of Birth', esc(data.dateOfBirth))}
            ${field('Gender', esc(data.gender))}
            ${field('State of Origin', esc(data.stateOfOrigin))}
            ${field('L.G.A.', esc(data.lga))}
          </div>
          <!-- Row 3: Phone / Email / Nationality (3 cols) -->
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:4px 10px;margin-bottom:4px;">
            ${field('Phone Number', esc(data.phoneNumber))}
            ${field('Email Address', esc(data.email))}
            ${field('Nationality', 'Nigerian')}
          </div>
          <!-- Row 4: Address (full width) -->
          <div style="margin-bottom:2px;">
            ${field('Residential Address', esc(data.residentialAddress))}
          </div>
        </div>

        <!-- SECTION B: Programme & Centre -->
        <div style="margin-bottom:6px;">
          ${secHdr('B', 'Programme &amp; Centre')}
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px 10px;margin-bottom:4px;">
            ${field('Study Centre', esc(data.centreOfStudy))}
            ${field('Programme', 'Direct Entry Programme')}
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px 10px;margin-bottom:2px;">
            ${field('Course of Choice', esc(data.courseOfChoice))}
            ${field('Subject Combination', esc(data.subjectCombination))}
          </div>
        </div>

        <!-- SECTION C: IJMB Subject Choices -->
        <div style="margin-bottom:6px;">
          ${secHdr('C', 'IJMB Subject Choices')}
          <table style="width:100%;border-collapse:collapse;">
            <thead>
              <tr>
                <th style="width:22px;${thStyle}">#</th>
                <th style="${thStyle}">Subject</th>
                <th style="${thStyleLast}">Category</th>
              </tr>
            </thead>
            <tbody>${subjectRows}</tbody>
          </table>
        </div>

        <!-- SECTION D: O-Level Results -->
        <div style="margin-bottom:6px;">
          ${secHdr('D', "O'Level Results")}
          <table style="width:100%;border-collapse:collapse;">
            <thead>
              <tr>
                <th style="width:22px;${thStyle}">#</th>
                <th style="${thStyle}">Subject</th>
                <th style="width:44px;${thStyle}">Grade</th>
                <th style="width:52px;${thStyle}">Year</th>
                <th style="width:60px;${thStyleLast}">Exam Body</th>
              </tr>
            </thead>
            <tbody>${olevelRows}</tbody>
          </table>
        </div>

        <!-- SECTION E: Payment & Registration -->
        <div style="margin-bottom:4px;">
          ${secHdr('E', 'Payment &amp; Registration')}
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:4px 10px;margin-bottom:4px;">
            ${field('Payment Reference', esc(data.paymentReference) || '&mdash;')}
            ${field('Payment Date', esc(data.paymentDate) || '&mdash;')}
            ${field('Amount Paid', esc(data.amountPaid) || '&mdash;')}
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px 10px;">
            ${field('Application ID', esc(data.applicationId))}
            ${field('Registration Date', esc(data.registrationDate))}
          </div>
        </div>

      </div><!-- /main -->

      <!-- ────────────────────────────────────────────────────── -->
      <!-- SIDEBAR                                                -->
      <!-- ────────────────────────────────────────────────────── -->
      <div style="width:120px;flex-shrink:0;padding:6px;display:flex;flex-direction:column;gap:6px;align-items:center;background:#fafaf7;overflow:hidden;">

        <!-- Passport photo -->
        <div style="width:100px;height:120px;border:1.5px solid #bbb;overflow:hidden;flex-shrink:0;display:flex;align-items:center;justify-content:center;background:#f0f0eb;">
          ${passportHtml}
        </div>
        <!-- Photo label -->
        <div style="width:100px;background:#003d00;color:#fff;font-size:6px;font-weight:700;text-align:center;padding:3px;letter-spacing:0.7px;text-transform:uppercase;border-top:2px solid #c9950f;flex-shrink:0;">
          Passport Photo
        </div>

        <!-- Registration number box -->
        <div style="width:100%;background:#003d00;border-radius:3px;padding:5px 6px;text-align:center;flex-shrink:0;overflow:hidden;">
          <div style="font-size:6px;text-transform:uppercase;letter-spacing:1px;color:#7ec47e;font-weight:700;">Registration No.</div>
          <div style="font-family:'Courier New',monospace;font-size:8px;font-weight:700;color:#f0c040;letter-spacing:1px;display:block;margin-top:2px;word-break:break-all;">${esc(data.applicationId)}</div>
          <!-- Gold accent line at bottom -->
          <div style="height:2px;background:linear-gradient(90deg,#6b500e,#c9950f,#f0c040,#c9950f,#6b500e);margin-top:4px;border-radius:1px;"></div>
        </div>

        <!-- QR code box -->
        <div style="width:100%;background:#fff;border:1px solid #ddd;border-top:2px solid #c9950f;padding:4px 5px;text-align:center;flex-shrink:0;">
          <div style="font-size:6px;text-transform:uppercase;letter-spacing:0.8px;color:#aaa;font-weight:700;margin-bottom:3px;">Scan to Verify</div>
          <div style="display:flex;justify-content:center;">
            ${qrHtml}
          </div>
        </div>

        <!-- Instructions box -->
        <div style="width:100%;border:1px solid #ddd;border-left:2.5px solid #003d00;background:#fff;padding:5px 6px;flex-shrink:0;">
          <span style="font-size:6px;font-weight:700;color:#003d00;text-transform:uppercase;letter-spacing:0.6px;display:block;margin-bottom:3px;padding-bottom:2px;border-bottom:1px solid #e0e0d4;">Instructions</span>
          <ul style="font-size:6px;color:#555;line-height:1.9;padding-left:9px;">
            <li>Keep this slip safe</li>
            <li>Bring on exam day</li>
            <li>No alterations allowed</li>
            <li>Present valid ID</li>
            <li>Arrive 30 mins early</li>
            <li>No phones in hall</li>
            <li>Biometrics compulsory</li>
          </ul>
        </div>

      </div><!-- /sidebar -->

    </div><!-- /body -->

    <!-- ══════════════════════════════════════════════════════════ -->
    <!-- FOOTER                                                    -->
    <!-- ══════════════════════════════════════════════════════════ -->
    <div style="background:#1a3300;flex-shrink:0;">
      <div style="height:2px;background:linear-gradient(90deg,#6b500e,#c9950f,#f0c040,#c9950f,#6b500e);"></div>
      <div style="display:flex;justify-content:space-between;align-items:center;padding:5px 14px;">
        <span style="font-size:6px;color:#5e9e5e;letter-spacing:0.3px;">This document is an official IJMB registration slip. Any alterations render it void.</span>
        <div style="background:#c9950f;color:#1a3300;font-size:6px;font-weight:700;letter-spacing:1px;text-transform:uppercase;padding:2px 10px;border-radius:20px;white-space:nowrap;">Candidate Copy</div>
        <span style="font-size:6px;color:#5e9e5e;white-space:nowrap;">Printed: ${printDate}</span>
      </div>
    </div><!-- /footer -->

  </div><!-- /inner border -->
</div><!-- /outer border -->

</body>
</html>`;
};
