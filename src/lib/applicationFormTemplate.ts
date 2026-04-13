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
  const logoSrc = data.logoBase64 || 'https://www.ijmb.info/ijmb-logo.jpeg';

  const subjects = [data.subject1, data.subject2, data.subject3].filter(Boolean);
  const subjectRows = subjects.length
    ? subjects.map((s, i) => `<tr><td class="nc">${i + 1}</td><td>${esc(s)}</td><td>IJMB Core Subject</td></tr>`).join('')
    : `<tr><td class="nc">—</td><td colspan="2">${esc(data.subjectCombination) || '—'}</td></tr>`;

  const olevelRows = data.olevelResults && data.olevelResults.length
    ? data.olevelResults.slice(0, 9).map((r, i) =>
        `<tr><td class="nc">${i + 1}</td><td>${esc(r.subject)}</td><td>${esc(r.grade)}</td><td>${esc(r.examYear)}</td><td>${esc(r.examType)}</td></tr>`
      ).join('')
    : `<tr><td class="nc">—</td><td colspan="4" style="text-align:center;color:#bbb;font-style:italic;font-size:7px">O-Level results not yet uploaded</td></tr>`;

  const passportHtml = data.passportPhotoBase64
    ? `<img src="${data.passportPhotoBase64}" alt="Passport" style="width:100%;height:100%;object-fit:cover"/>`
    : `<div style="display:flex;flex-direction:column;align-items:center;gap:3px">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#bbb" stroke-width="1.2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
        <span style="font-size:6px;color:#bbb;text-transform:uppercase;letter-spacing:0.5px">Photo</span>
       </div>`;

  const printDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>IJMB Student Registration Slip</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}

body{
  font-family:'Segoe UI',system-ui,-apple-system,Arial,sans-serif;
  background:#ccc;
  display:flex;
  justify-content:center;
  padding:16px;
  font-size:8px;
  line-height:1.3;
}

/* ── PAGE ───────────────────────────────── */
.page{
  width:210mm;
  min-height:297mm;
  background:#fff;
  display:flex;
  flex-direction:column;
  box-shadow:0 4px 24px rgba(0,0,0,0.25);
  position:relative;
  overflow:hidden;
}

/* WATERMARK */
.wm{position:absolute;inset:0;pointer-events:none;z-index:0;overflow:hidden}
.wm::after{
  content:'';
  position:absolute;top:50%;left:50%;
  transform:translate(-50%,-50%) rotate(-25deg);
  width:280px;height:280px;
  background-image:url('${logoSrc}');
  background-size:contain;background-repeat:no-repeat;background-position:center;
  opacity:0.055;filter:grayscale(1);
}

.shell{position:relative;z-index:1;display:flex;flex-direction:column;flex:1}

/* ── HEADER ─────────────────────────────── */
.hdr{background:#003d00;flex-shrink:0}
.gold-bar{height:2.5px;background:linear-gradient(90deg,#6b500e,#c9950f,#f0c040,#c9950f,#6b500e)}
.hdr-body{display:flex;align-items:center;gap:10px;padding:8px 14px 9px}

.logo-wrap{flex-shrink:0;width:52px;height:52px;border-radius:50%;background:#fff;border:2px solid #c9950f;padding:2px;display:flex;align-items:center;justify-content:center}
.logo-wrap img{width:100%;height:100%;border-radius:50%;object-fit:cover}

.hdr-mid{flex:1;text-align:center}
.hdr-mid .sub{font-size:6.5px;letter-spacing:2px;color:#7ec47e;text-transform:uppercase;font-weight:600}
.hdr-mid .title{font-family:Georgia,'Times New Roman',serif;font-size:13px;font-weight:700;color:#fff;margin:2px 0 1px;line-height:1.2}
.hdr-mid .doc{font-size:7.5px;color:#aad4aa;letter-spacing:0.4px}
.hdr-mid .sess{display:inline-block;margin-top:3px;font-size:7px;color:#c9950f;letter-spacing:1.2px;text-transform:uppercase;border-top:1px solid rgba(201,149,15,0.4);border-bottom:1px solid rgba(201,149,15,0.4);padding:1.5px 7px}

.reg-badge{background:rgba(255,255,255,0.07);border:1.5px solid #c9950f;border-radius:3px;padding:5px 9px;text-align:center;min-width:90px}
.reg-badge .rbl{display:block;font-size:6px;letter-spacing:1.2px;text-transform:uppercase;color:#7ec47e;font-weight:700}
.reg-badge .rbv{display:block;font-family:'Courier New',monospace;font-size:10px;font-weight:700;color:#f0c040;letter-spacing:1.5px;margin-top:2px}

/* ── RIBBON ─────────────────────────────── */
.ribbon{background:#1a3300;display:flex;align-items:stretch;flex-shrink:0}
.rib-txt{flex:1;padding:3px 14px;font-size:6.5px;letter-spacing:1.5px;text-transform:uppercase;color:#5e9e5e;display:flex;align-items:center;gap:8px}
.rib-txt .dot{color:#c9950f}
.rib-stamp{background:#c9950f;color:#1a3300;font-size:6.5px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;padding:0 12px;display:flex;align-items:center}

/* ── BODY ───────────────────────────────── */
.body{display:grid;grid-template-columns:1fr 112px;flex:1}
.main{padding:7px 12px;border-right:1px solid #e2e2da;overflow:hidden}
.side{padding:6px 6px;display:flex;flex-direction:column;gap:5px;align-items:center;background:#fafaf7}

/* ── SECTIONS ───────────────────────────── */
.sec{margin-bottom:5px}
.sec-hdr{
  background:#003d00;color:#fff;
  font-size:6.5px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;
  padding:2.5px 7px;
  display:flex;align-items:center;gap:5px;
  margin-bottom:5px;position:relative;
}
.sec-hdr::after{content:'';position:absolute;right:0;top:0;bottom:0;width:2.5px;background:#c9950f}
.sec-num{
  width:13px;height:13px;border-radius:50%;
  background:#c9950f;color:#003d00;
  font-size:7px;font-weight:700;
  display:flex;align-items:center;justify-content:center;flex-shrink:0
}

/* ── FIELD GRIDS ────────────────────────── */
.g2{display:grid;grid-template-columns:1fr 1fr;gap:4px 10px;margin-bottom:4px}
.g3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:4px 8px;margin-bottom:4px}
.g4{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:4px 8px;margin-bottom:4px}

.f{display:flex;flex-direction:column;gap:1px}
.f .lbl{font-size:6px;font-weight:700;color:#999;text-transform:uppercase;letter-spacing:0.7px}
.f .val{
  font-size:8px;color:#111;
  padding:1.5px 0 2px;
  border-bottom:1px solid #dcdcd4;
  min-height:14px;
}

.divider{height:1px;background:#ebebе3;margin:5px 0}

/* ── TABLES ─────────────────────────────── */
table{width:100%;border-collapse:collapse}
thead.gh th{
  background:#003d00;color:#fff;
  font-size:6px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;
  padding:3px 5px;text-align:left;
  border-right:1px solid rgba(255,255,255,0.1);
}
thead.gh th:last-child{border-right:none}
table td{
  font-size:7.5px;color:#222;
  padding:3px 5px;
  border-bottom:1px solid #ebebе3;
  border-right:1px solid #ebebе3;
}
table td:last-child{border-right:none}
table tr:last-child td{border-bottom:none}
table tr:nth-child(even) td{background:rgba(0,61,0,0.018)}
.nc{
  font-family:'Courier New',monospace;font-size:7px;font-weight:700;
  color:#003d00;width:18px;text-align:center
}

/* ── SIDEBAR ────────────────────────────── */
.photo-wrap{
  width:100px;height:120px;
  border:1px solid #ccc;background:#f0f0eb;
  overflow:hidden;display:flex;align-items:center;justify-content:center;
  flex-shrink:0;position:relative;
}
.photo-label{
  width:100px;background:#003d00;color:#fff;
  font-size:6px;font-weight:700;text-align:center;
  padding:2.5px;letter-spacing:0.6px;text-transform:uppercase;
  border-top:2px solid #c9950f;
}

.id-box{
  width:100%;background:#003d00;border-radius:2px;
  padding:5px 6px;text-align:center;position:relative;overflow:hidden
}
.id-box::after{content:'';position:absolute;bottom:0;left:0;right:0;height:2px;background:linear-gradient(90deg,#6b500e,#c9950f,#f0c040,#c9950f,#6b500e)}
.id-box .il{font-size:5.5px;text-transform:uppercase;letter-spacing:1px;color:#7ec47e;font-weight:700}
.id-box .iv{font-family:'Courier New',monospace;font-size:9px;font-weight:700;color:#f0c040;letter-spacing:1.5px;display:block;margin-top:2px}

.qr-box{
  width:100%;background:#fff;
  border:1px solid #ddd;border-top:2px solid #c9950f;
  padding:4px 5px;text-align:center
}
.qr-box .ql{font-size:5.5px;text-transform:uppercase;letter-spacing:0.8px;color:#aaa;font-weight:700;margin-bottom:3px}
.qr-box img{width:72px;height:72px}

.ins-box{
  width:100%;border:1px solid #ddd;border-left:2.5px solid #003d00;
  background:rgba(255,255,255,0.9);padding:5px 6px;
  font-size:6.5px;color:#555;line-height:1.75;
}
.ins-box .it{font-size:6px;font-weight:700;color:#003d00;text-transform:uppercase;letter-spacing:0.6px;display:block;margin-bottom:3px;padding-bottom:2px;border-bottom:1px solid #e0e0d4}
.ins-box li{margin-left:9px;margin-bottom:0.5px}

/* ── FOOTER ─────────────────────────────── */
.ftr{background:#1a3300;flex-shrink:0}
.ftr-body{display:flex;justify-content:space-between;align-items:center;padding:4px 14px}
.ftr-body span{font-size:6.5px;color:#5e9e5e;letter-spacing:0.2px}
.ftr-pill{background:#c9950f;color:#1a3300;font-size:6.5px;font-weight:700;letter-spacing:1px;text-transform:uppercase;padding:2px 10px;border-radius:20px}

@media print{
  body{background:#fff;padding:0}
  .page{box-shadow:none;width:210mm;min-height:297mm}
  @page{size:A4 portrait;margin:0}
}
</style>
</head>
<body>
<div class="page">
<div class="wm"></div>
<div class="shell">

<!-- HEADER -->
<div class="hdr">
  <div class="gold-bar"></div>
  <div class="hdr-body">
    <div class="logo-wrap"><img src="${logoSrc}" alt="IJMB"/></div>
    <div class="hdr-mid">
      <div class="sub">Federal Republic of Nigeria</div>
      <div class="title">Interim Joint Matriculation Board (IJMB)</div>
      <div class="doc">Official Student Registration Slip</div>
      <div class="sess">&#9632;&nbsp;Academic Session ${esc(data.academicSession)}&nbsp;&#9632;</div>
    </div>
    <div class="reg-badge">
      <span class="rbl">Reg. No.</span>
      <span class="rbv">${esc(data.applicationId)}</span>
    </div>
  </div>
  <div class="gold-bar"></div>
</div>

<!-- RIBBON -->
<div class="ribbon">
  <div class="rib-txt"><span class="dot">&#9632;</span> Registration File <span class="dot">&#9632;</span> Confidential &mdash; Do Not Duplicate <span class="dot">&#9632;</span> Candidate Use Only</div>
  <div class="rib-stamp">Candidate Copy</div>
</div>

<!-- BODY -->
<div class="body">
  <div class="main">

    <!-- A: Personal -->
    <div class="sec">
      <div class="sec-hdr"><span class="sec-num">A</span> Personal Details</div>
      <div class="g3">
        <div class="f"><span class="lbl">Surname</span><div class="val">${esc(data.surname)}</div></div>
        <div class="f"><span class="lbl">First Name</span><div class="val">${esc(data.firstName)}</div></div>
        <div class="f"><span class="lbl">Middle Name</span><div class="val">${esc(data.middleName) || '—'}</div></div>
      </div>
      <div class="g4">
        <div class="f"><span class="lbl">Date of Birth</span><div class="val">${esc(data.dateOfBirth)}</div></div>
        <div class="f"><span class="lbl">Gender</span><div class="val">${esc(data.gender)}</div></div>
        <div class="f"><span class="lbl">State of Origin</span><div class="val">${esc(data.stateOfOrigin)}</div></div>
        <div class="f"><span class="lbl">LGA</span><div class="val">${esc(data.lga)}</div></div>
      </div>
      <div class="g3">
        <div class="f"><span class="lbl">Phone Number</span><div class="val">${esc(data.phoneNumber)}</div></div>
        <div class="f"><span class="lbl">Email Address</span><div class="val">${esc(data.email)}</div></div>
        <div class="f"><span class="lbl">Nationality</span><div class="val">Nigerian</div></div>
      </div>
      <div class="f" style="margin-bottom:4px"><span class="lbl">Residential Address</span><div class="val">${esc(data.residentialAddress)}</div></div>
    </div>

    <!-- B: Programme -->
    <div class="sec">
      <div class="sec-hdr"><span class="sec-num">B</span> Programme &amp; Centre</div>
      <div class="g2">
        <div class="f"><span class="lbl">Study Centre</span><div class="val">${esc(data.centreOfStudy)}</div></div>
        <div class="f"><span class="lbl">Programme</span><div class="val">Direct Entry Programme</div></div>
      </div>
      <div class="g2">
        <div class="f"><span class="lbl">Course of Choice</span><div class="val">${esc(data.courseOfChoice)}</div></div>
        <div class="f"><span class="lbl">Subject Combination</span><div class="val">${esc(data.subjectCombination)}</div></div>
      </div>
    </div>

    <!-- C: Subjects -->
    <div class="sec">
      <div class="sec-hdr"><span class="sec-num">C</span> IJMB Subject Choices</div>
      <table>
        <thead class="gh"><tr><th style="width:18px">#</th><th>Subject</th><th>Category</th></tr></thead>
        <tbody>${subjectRows}</tbody>
      </table>
    </div>

    <!-- D: O-Level -->
    <div class="sec" style="margin-bottom:4px">
      <div class="sec-hdr"><span class="sec-num">D</span> O&apos;Level Results</div>
      <table>
        <thead class="gh">
          <tr><th style="width:18px">#</th><th>Subject</th><th style="width:40px">Grade</th><th style="width:52px">Year</th><th style="width:58px">Exam Body</th></tr>
        </thead>
        <tbody>${olevelRows}</tbody>
      </table>
    </div>

    <!-- E: Payment -->
    <div class="sec">
      <div class="sec-hdr"><span class="sec-num">E</span> Payment &amp; Registration</div>
      <div class="g3">
        <div class="f"><span class="lbl">Payment Reference</span><div class="val">${esc(data.paymentReference) || '—'}</div></div>
        <div class="f"><span class="lbl">Payment Date</span><div class="val">${esc(data.paymentDate) || '—'}</div></div>
        <div class="f"><span class="lbl">Amount Paid</span><div class="val">${esc(data.amountPaid) || '—'}</div></div>
      </div>
      <div class="g2">
        <div class="f"><span class="lbl">Application ID</span><div class="val">${esc(data.applicationId)}</div></div>
        <div class="f"><span class="lbl">Registration Date</span><div class="val">${esc(data.registrationDate)}</div></div>
      </div>
    </div>

  </div><!-- /main -->

  <div class="side">
    <div class="photo-wrap">${passportHtml}</div>
    <div class="photo-label">Passport Photo</div>

    <div class="id-box">
      <div class="il">Registration No.</div>
      <span class="iv">${esc(data.applicationId)}</span>
    </div>

    ${data.qrCodeBase64 ? `
    <div class="qr-box">
      <div class="ql">Scan to Verify</div>
      <img src="${data.qrCodeBase64}" alt="QR"/>
    </div>` : ''}

    <div class="ins-box">
      <span class="it">Instructions</span>
      <ul>
        <li>Keep this slip safe</li>
        <li>Bring on exam day</li>
        <li>No alterations allowed</li>
        <li>Present valid ID</li>
        <li>Arrive 30 mins early</li>
        <li>No phones in hall</li>
        <li>Biometrics compulsory</li>
      </ul>
    </div>
  </div><!-- /side -->

</div><!-- /body -->

<!-- FOOTER -->
<div class="ftr">
  <div class="gold-bar"></div>
  <div class="ftr-body">
    <span>IJMB &copy; ${new Date().getFullYear()} &mdash; Federal Republic of Nigeria</span>
    <div class="ftr-pill">Candidate Copy</div>
    <span>Printed: ${printDate}</span>
  </div>
</div>

</div><!-- /shell -->
</div><!-- /page -->
</body>
</html>`;
};
