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

  /* ── Passport photo ───────────────────────────────────────────── */
  const passportHtml = data.passportPhotoBase64
    ? `<img src="${data.passportPhotoBase64}" style="width:100%;height:100%;object-fit:cover;display:block;" alt="Passport"/>`
    : `<div class="passport-icon">&#128100;</div><span>PASTE PASSPORT<br>PHOTO HERE</span>`;

  /* ── QR code ──────────────────────────────────────────────────── */
  const qrHtml = data.qrCodeBase64
    ? `<img src="${data.qrCodeBase64}" alt="QR Code" style="width:55px;height:55px;display:block;margin-top:6px;"/>`
    : '';

  /* ── O-Level rows (padded to 9) ───────────────────────────────── */
  const olevelData = data.olevelResults || [];
  const olevelRows = Array.from({ length: 9 }, (_, i) => {
    const r = olevelData[i];
    return `<tr>
      <td class="rn">${i + 1}</td>
      <td>${r ? esc(r.subject) : '&nbsp;'}</td>
      <td>${r ? esc(r.grade) : '&nbsp;'}</td>
      <td>${r ? esc(r.examType) : '&nbsp;'}</td>
      <td>${r ? esc(r.examYear) : '&nbsp;'}</td>
    </tr>`;
  }).join('');

  const printDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  });

  /* ── Determine subjects from combination or individual fields ─── */
  const subjectParts = data.subjectCombination ? data.subjectCombination.split(/[,/]/).map(s => s.trim()) : [];
  const sub1 = data.subject1 || subjectParts[0] || '';
  const sub2 = data.subject2 || subjectParts[1] || '';
  const sub3 = data.subject3 || subjectParts[2] || '';

  /* ── Payment method checkbox ─────────────────────────────────── */
  const isManualPayment = (data.paymentReference || '').startsWith('MANUAL-');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>IJMB Registration Form ${esc(data.academicSession)}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }

  @page { size: A4; margin: 0; }

  body {
    font-family: Arial, Helvetica, sans-serif;
    font-size: 10.5px;
    background: #ccc;
    display: flex;
    justify-content: center;
    padding: 20px;
  }

  .page {
    width: 210mm;
    min-height: 297mm;
    background: #fff;
    position: relative;
    overflow: hidden;
    box-shadow: 0 4px 24px rgba(0,0,0,0.25);
  }

  .watermark {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 370px;
    height: 370px;
    opacity: 0.065;
    z-index: 0;
    pointer-events: none;
  }
  .watermark img { width: 100%; height: 100%; object-fit: contain; }

  .content { position: relative; z-index: 1; }

  .top-strip {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px 12mm;
    font-size: 8.5px;
    font-weight: bold;
    background: #1a6b3a;
    color: #fff;
    letter-spacing: 0.3px;
  }

  .header {
    display: grid;
    grid-template-columns: 88px 1fr 130px;
    align-items: center;
    gap: 8px;
    padding: 8px 12mm 4px;
  }

  .passport-box {
    width: 82px;
    height: 100px;
    border: 1.5px solid #333;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 8.5px;
    text-align: center;
    color: #555;
    font-weight: bold;
    line-height: 1.6;
    background: #fafafa;
    overflow: hidden;
  }
  .passport-box .passport-icon { font-size: 22px; margin-bottom: 2px; opacity: 0.3; }

  .header-center {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
  }
  .header-center img { width: 80px; height: 80px; object-fit: contain; }

  .form-no-box {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: flex-start;
    padding-top: 4px;
    gap: 3px;
  }
  .form-no-box .fn-label { font-size: 8.5px; font-weight: bold; text-transform: uppercase; color: #333; }
  .form-no-box .fn-value {
    font-family: 'Courier New', monospace;
    font-size: 10px;
    font-weight: bold;
    color: #1a6b3a;
    width: 115px;
    text-align: right;
    border-bottom: 1.5px solid #333;
    min-height: 15px;
    padding-bottom: 1px;
  }

  .form-title {
    text-align: center;
    padding: 5px 12mm 6px;
    border-bottom: 2px dashed #888;
    margin: 0 12mm;
  }
  .form-title h1 { font-size: 20px; font-weight: 900; letter-spacing: 1px; color: #111; text-transform: uppercase; line-height: 1.2; }
  .form-title h2 { font-size: 9px; font-weight: normal; color: #444; letter-spacing: 0.4px; margin-top: 3px; }

  .form-body { padding: 6px 12mm 0; }

  .section { margin-bottom: 8px; }

  .section-header {
    background-color: #1a6b3a;
    color: #fff;
    font-weight: bold;
    font-size: 10px;
    padding: 4px 8px;
    display: flex;
    align-items: center;
    gap: 7px;
    margin-bottom: 6px;
    letter-spacing: 0.4px;
    text-transform: uppercase;
  }
  .section-letter {
    background: #fff;
    color: #1a6b3a;
    font-weight: 900;
    font-size: 9.5px;
    width: 17px;
    height: 17px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 2px;
    flex-shrink: 0;
  }

  .field-row { display: flex; gap: 10px; margin-bottom: 6px; align-items: flex-end; }
  .field { display: flex; flex-direction: column; flex: 1; min-width: 0; }
  .field label {
    font-size: 8px;
    font-weight: bold;
    color: #222;
    margin-bottom: 1px;
    text-transform: uppercase;
    letter-spacing: 0.3px;
    white-space: nowrap;
  }
  .field .underline {
    border-bottom: 1px dotted #555;
    height: 15px;
    width: 100%;
    padding-bottom: 1px;
    font-size: 9px;
    color: #111;
    font-weight: bold;
  }

  .inline-field { display: flex; align-items: flex-end; gap: 5px; flex: 1; min-width: 0; }
  .inline-field .lbl {
    font-size: 8px;
    font-weight: bold;
    text-transform: uppercase;
    white-space: nowrap;
    color: #222;
    padding-bottom: 1px;
    flex-shrink: 0;
  }
  .inline-field .underline {
    flex: 1;
    border-bottom: 1px dotted #555;
    height: 15px;
    min-width: 30px;
    font-size: 9px;
    color: #111;
    font-weight: bold;
    padding-bottom: 1px;
  }

  .cb-row {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 6px;
    font-size: 8.5px;
  }
  .cb-label { font-weight: bold; text-transform: uppercase; white-space: nowrap; color: #222; font-size: 8px; }
  .cb-item { display: flex; align-items: center; gap: 3px; font-weight: bold; font-size: 8.5px; white-space: nowrap; }
  .cb-item input[type="checkbox"] { width: 10px; height: 10px; margin: 0; accent-color: #1a6b3a; flex-shrink: 0; }
  .cb-divider { flex: 1; }

  .olevel-table { width: 100%; border-collapse: collapse; margin-top: 4px; font-size: 9px; }
  .olevel-table th {
    background: #1a6b3a;
    color: #fff;
    font-weight: bold;
    padding: 4px 6px;
    border: 1px solid #1a6b3a;
    text-align: left;
    font-size: 8.5px;
    text-transform: uppercase;
    letter-spacing: 0.2px;
  }
  .olevel-table td { border: 1px solid #ccc; padding: 3px 6px; height: 18px; font-size: 9px; }
  .olevel-table tr:nth-child(even) td { background: #f7fbf9; }
  .olevel-table .rn { color: #777; font-weight: bold; text-align: center; font-size: 8px; width: 18px; }

  .declaration {
    border: 1.5px solid #1a6b3a;
    padding: 7px 12px;
    margin-bottom: 8px;
    background: #f6fcf8;
    text-align: center;
    font-style: italic;
    font-size: 9px;
    color: #222;
    line-height: 1.5;
    border-radius: 2px;
  }

  .sig-row { display: flex; align-items: flex-end; gap: 16px; margin-bottom: 7px; }
  .sig-field { display: flex; align-items: flex-end; gap: 5px; flex: 1; min-width: 0; }
  .sig-field .lbl { font-size: 8px; font-weight: bold; text-transform: uppercase; white-space: nowrap; padding-bottom: 1px; flex-shrink: 0; }
  .sig-field .underline { flex: 1; border-bottom: 1px dotted #555; height: 13px; min-width: 40px; }

  .date-group { display: flex; align-items: flex-end; gap: 3px; flex-shrink: 0; }
  .date-group .lbl { font-size: 8px; font-weight: bold; text-transform: uppercase; padding-bottom: 2px; white-space: nowrap; }
  .date-group .dbox { border-bottom: 1px dotted #555; height: 13px; }
  .date-group .dbox.dd { width: 20px; }
  .date-group .dbox.mm { width: 20px; }
  .date-group .dbox.yyyy { width: 34px; }
  .date-group .dsep { font-size: 9px; font-weight: bold; padding-bottom: 2px; }

  .official-box { border: 1.5px solid #1a6b3a; padding: 6px 10px 8px; margin-top: 2px; border-radius: 2px; }
  .official-title { font-size: 8.5px; font-weight: 900; text-transform: uppercase; color: #1a6b3a; text-decoration: underline; margin-bottom: 7px; letter-spacing: 0.5px; }

  .footer {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 6px 12mm;
    border-top: 1.5px solid #1a6b3a;
    margin-top: 8px;
    background: #f5f5f5;
  }
  .footer .website { color: #1a6b3a; font-weight: bold; font-size: 9.5px; letter-spacing: 0.5px; text-align: center; }

  @media print { body { background: none; padding: 0; } .page { box-shadow: none; } }
</style>
</head>
<body>
<div class="page">

  <!-- WATERMARK -->
  <div class="watermark">
    <img src="${logoSrc}" alt="">
  </div>

  <div class="content">

    <!-- TOP STRIP -->
    <div class="top-strip">
      <span>FEDERAL REPUBLIC OF NIGERIA</span>
      <span>MINISTRY OF EDUCATION</span>
    </div>

    <!-- HEADER -->
    <div class="header">

      <!-- Passport photo (left) -->
      <div class="passport-box">
        ${passportHtml}
      </div>

      <!-- Logo + title (center) -->
      <div class="header-center">
        <img src="${logoSrc}" alt="IJMB">
        <div style="text-align:center;font-weight:900;font-size:12px;text-transform:uppercase;line-height:1.2;margin-top:2px;">Interim Joint Matriculation Board</div>
        <div style="text-align:center;font-size:9px;font-weight:bold;">(IJMB)</div>
        <div style="text-align:center;font-size:8px;color:#555;">Permanent Secretary, ABU, Zaria</div>
        <div style="text-align:center;font-size:8px;color:#1a6b3a;font-weight:bold;">www.ijmb.info</div>
      </div>

      <!-- Form number + QR (right) -->
      <div class="form-no-box">
        <span class="fn-label">Form Number</span>
        <div class="fn-value">${esc(data.applicationId)}</div>
        ${qrHtml}
      </div>

    </div><!-- /header -->

    <!-- FORM TITLE -->
    <div class="form-title">
      <h1>Student Registration Form</h1>
      <h2>Academic Session ${esc(data.academicSession)} &mdash; Direct Entry Programme</h2>
    </div>

    <!-- FORM BODY -->
    <div class="form-body">

      <!-- SECTION A: Personal Information -->
      <div class="section">
        <div class="section-header"><span class="section-letter">A</span> Personal Information</div>

        <!-- Row 1: Surname | First Name | Middle Name -->
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:6px;">
          <div class="field"><label>Surname</label><div class="underline">${esc(data.surname)}</div></div>
          <div class="field"><label>First Name</label><div class="underline">${esc(data.firstName)}</div></div>
          <div class="field"><label>Middle Name</label><div class="underline">${esc(data.middleName)}</div></div>
        </div>

        <!-- Row 2: Date of Birth | Nationality -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:6px;">
          <div class="field"><label>Date of Birth</label><div class="underline">${esc(data.dateOfBirth)}</div></div>
          <div class="field"><label>Nationality</label><div class="underline">Nigerian</div></div>
        </div>

        <!-- Row 3: State of Origin | LGA -->
        <div style="display:grid;grid-template-columns:3fr 2fr;gap:10px;margin-bottom:6px;">
          <div class="field"><label>State of Origin</label><div class="underline">${esc(data.stateOfOrigin)}</div></div>
          <div class="field"><label>L.G.A.</label><div class="underline">${esc(data.lga)}</div></div>
        </div>

        <!-- Row 4: Phone | Email -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:6px;">
          <div class="field"><label>Phone Number</label><div class="underline">${esc(data.phoneNumber)}</div></div>
          <div class="field"><label>Email Address</label><div class="underline">${esc(data.email)}</div></div>
        </div>

        <!-- Row 5: Residential Address full width -->
        <div style="margin-bottom:6px;">
          <div class="field"><label>Residential Address</label><div class="underline">${esc(data.residentialAddress)}</div></div>
        </div>
      </div><!-- /section A -->

      <!-- SECTION B: O'Level Information -->
      <div class="section">
        <div class="section-header"><span class="section-letter">B</span> O&apos;Level Information</div>

        <div class="cb-row">
          <span class="cb-label">Result Status:</span>
          <div class="cb-item"><input type="checkbox"> Result Available</div>
          <div class="cb-item"><input type="checkbox"> Awaiting Result</div>
          <div class="cb-divider"></div>
          <span class="cb-label">Exam Body:</span>
          <div class="cb-item"><input type="checkbox"> WAEC</div>
          <div class="cb-item"><input type="checkbox"> NECO</div>
          <div class="cb-item"><input type="checkbox"> NABTEB</div>
          <div class="cb-item"><input type="checkbox"> GCE</div>
          <span class="cb-label" style="margin-left:6px;">Sittings:</span>
          <div class="cb-item"><input type="checkbox"> 1</div>
          <div class="cb-item"><input type="checkbox"> 2</div>
        </div>

        <table class="olevel-table">
          <thead>
            <tr>
              <th class="rn">#</th>
              <th style="width:44%;">Subject</th>
              <th style="width:13%;">Grade</th>
              <th style="width:24%;">Exam Body</th>
              <th style="width:14%;">Year</th>
            </tr>
          </thead>
          <tbody>
            ${olevelRows}
          </tbody>
        </table>
      </div><!-- /section B -->

      <!-- SECTION C: Programme Information -->
      <div class="section">
        <div class="section-header"><span class="section-letter">C</span> Programme Information</div>

        <div class="field-row">
          <div class="field" style="flex:3;">
            <label>Preferred Study Centre</label>
            <div class="underline">${esc(data.centreOfStudy)}</div>
          </div>
          <div style="display:flex;align-items:flex-end;gap:5px;flex-shrink:0;">
            <span style="font-size:8px;font-weight:bold;text-transform:uppercase;padding-bottom:2px;">Academic Session:</span>
            <span style="font-size:10px;font-weight:900;padding-bottom:1px;color:#1a6b3a;">${esc(data.academicSession)}</span>
          </div>
        </div>

        <div class="cb-row">
          <span class="cb-label">Programme Track:</span>
          <div class="cb-item"><input type="checkbox"> Science</div>
          <div class="cb-item"><input type="checkbox"> Arts</div>
          <div class="cb-item"><input type="checkbox"> Social Science</div>
        </div>

        <div style="margin-bottom:5px;">
          <span style="font-size:8px;font-weight:bold;text-transform:uppercase;color:#222;letter-spacing:0.3px;">A-Level Subject Combination:</span>
        </div>
        <div class="field-row">
          <div class="inline-field"><span class="lbl">Subject 1:</span><div class="underline">${esc(sub1)}</div></div>
        </div>
        <div class="field-row">
          <div class="inline-field"><span class="lbl">Subject 2:</span><div class="underline">${esc(sub2)}</div></div>
        </div>
        <div class="field-row">
          <div class="inline-field"><span class="lbl">Subject 3:</span><div class="underline">${esc(sub3)}</div></div>
        </div>
      </div><!-- /section C -->

      <!-- SECTION D: Payment Details -->
      <div class="section">
        <div class="section-header"><span class="section-letter">D</span> Payment Details</div>

        <div class="field-row">
          <div class="field" style="flex:3;">
            <label>Invoice / Reference Number</label>
            <div class="underline">${esc(data.paymentReference) || '&mdash;'}</div>
          </div>
          <div class="field" style="flex:2;">
            <label>Amount Paid (&#8358;)</label>
            <div class="underline">${esc(data.amountPaid) || '&mdash;'}</div>
          </div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:6px;">
          <div class="field">
            <label>Payment Date</label>
            <div class="underline">${esc(data.paymentDate) || '&mdash;'}</div>
          </div>
          <div class="field">
            <label>Payment Method</label>
            <div style="display:flex;align-items:center;gap:10px;padding-top:3px;">
              <div class="cb-item"><input type="checkbox" ${!isManualPayment ? 'checked' : ''}> Online</div>
              <div class="cb-item"><input type="checkbox" ${isManualPayment ? 'checked' : ''}> Bank</div>
              <div class="cb-item"><input type="checkbox"> POS</div>
            </div>
          </div>
        </div>
      </div><!-- /section D -->

      <!-- SECTION E: Declaration & Signatures -->
      <div class="section">
        <div class="section-header"><span class="section-letter">E</span> Declaration &amp; Signatures</div>

        <div class="declaration">
          &ldquo;I hereby certify that all information provided in this form is true, correct and complete to the best of my knowledge.&rdquo;
        </div>

        <div class="sig-row">
          <div class="sig-field">
            <span class="lbl">Candidate Signature:</span>
            <div class="underline"></div>
          </div>
          <div class="date-group">
            <span class="lbl">Date:</span>
            <div class="dbox dd"></div>
            <span class="dsep">/</span>
            <div class="dbox mm"></div>
            <span class="dsep">/</span>
            <div class="dbox yyyy"></div>
          </div>
        </div>

        <div class="official-box">
          <div class="official-title">For Official Use Only</div>
          <div class="sig-row" style="margin-bottom:0;">
            <div class="sig-field">
              <span class="lbl">Signature &amp; Stamp of Centre Coordinator:</span>
              <div class="underline"></div>
            </div>
            <div class="date-group">
              <span class="lbl">Date:</span>
              <div class="dbox dd"></div>
              <span class="dsep">/</span>
              <div class="dbox mm"></div>
              <span class="dsep">/</span>
              <div class="dbox yyyy"></div>
            </div>
          </div>
        </div>
      </div><!-- /section E -->

    </div><!-- /form-body -->

    <!-- FOOTER -->
    <div class="footer">
      <span class="website">www.ijmb.info &nbsp;&bull;&nbsp; IJMB Registration Form ${esc(data.academicSession)} &nbsp;&bull;&nbsp; Printed: ${printDate}</span>
    </div>

  </div><!-- /content -->
</div><!-- /page -->
</body>
</html>`;
};
