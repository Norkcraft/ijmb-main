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
    ? subjects.map((s, i) => `
        <tr>
          <td class="nc">${i + 1}</td>
          <td>${esc(s)}</td>
          <td>IJMB Core Subject</td>
        </tr>`).join('')
    : `<tr><td class="nc">—</td><td colspan="2">${esc(data.subjectCombination) || '—'}</td></tr>`;

  const olevelRows = data.olevelResults && data.olevelResults.length
    ? data.olevelResults.slice(0, 9).map((r, i) => `
        <tr>
          <td class="nc ol-nc">${i + 1}</td>
          <td>${esc(r.subject)}</td>
          <td>${esc(r.grade)}</td>
          <td>${esc(r.examYear)}</td>
          <td>${esc(r.examType)}</td>
        </tr>`).join('')
    : `<tr><td class="nc ol-nc">—</td><td colspan="4" style="text-align:center;color:#aaa;font-style:italic">O-Level results not yet uploaded</td></tr>`;

  const passportHtml = data.passportPhotoBase64
    ? `<img src="${data.passportPhotoBase64}" alt="Passport" style="width:100%;height:100%;object-fit:cover;border-radius:2px"/>`
    : `<div class="photo-inner">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#999" stroke-width="1.1">
          <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
        </svg>
        <div class="pt">Passport<br/>Photo</div>
       </div>`;

  const printDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>IJMB Student Registration Slip</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=Source+Sans+3:wght@400;600;700&family=Roboto+Mono:wght@400;600&display=swap');

*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Source Sans 3',sans-serif;background:#d6d0c4;display:flex;justify-content:center;padding:20px 16px;}

.page{width:210mm;height:297mm;background:#fff;position:relative;overflow:hidden;box-shadow:0 6px 32px rgba(0,0,0,0.22);display:flex;flex-direction:column;}

/* WATERMARK */
.watermark{position:absolute;inset:0;z-index:0;pointer-events:none;overflow:hidden}
.watermark::before{content:'';position:absolute;inset:0;background-image:url('${logoSrc}');background-size:100px 100px;background-repeat:repeat;opacity:0.038;filter:grayscale(100%) contrast(1.2);}
.watermark::after{content:'';position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) rotate(-25deg);width:360px;height:360px;background-image:url('${logoSrc}');background-size:contain;background-repeat:no-repeat;background-position:center;opacity:0.07;filter:grayscale(100%) contrast(1.1);}

.shell{position:relative;z-index:1;display:flex;flex-direction:column;flex:1;overflow:hidden}

/* HEADER */
.hdr{background:#003d00;position:relative;overflow:hidden;flex-shrink:0}
.hdr::before{content:'';position:absolute;inset:0;background-image:repeating-linear-gradient(-55deg,transparent,transparent 18px,rgba(255,255,255,0.03) 18px,rgba(255,255,255,0.03) 19px);}
.hdr-gold{height:3px;background:linear-gradient(90deg,#8b6914,#d4a017,#f5cc5a,#d4a017,#8b6914)}
.hdr-body{display:flex;align-items:center;gap:14px;padding:9px 18px 11px;position:relative;z-index:1}

.logo-ring{flex-shrink:0;width:62px;height:62px;border-radius:50%;background:#fff;border:2.5px solid #d4a017;padding:2px;display:flex;align-items:center;justify-content:center;}
.logo-ring img{width:100%;height:100%;border-radius:50%;object-fit:cover}

.hdr-center{flex:1;text-align:center}
.hdr-center .republic{font-size:7.5px;letter-spacing:2.5px;color:#81c784;text-transform:uppercase;font-weight:600}
.hdr-center .board{font-family:'Libre Baskerville',serif;font-size:14.5px;font-weight:700;color:#fff;margin:3px 0 2px;line-height:1.2;text-shadow:0 1px 3px rgba(0,0,0,0.4)}
.hdr-center .slip-type{font-size:8.5px;color:#b9e0bb;letter-spacing:0.6px}
.hdr-center .session{display:inline-block;margin-top:3px;font-size:8px;color:#d4a017;letter-spacing:1.5px;text-transform:uppercase;border-top:1px solid rgba(212,160,23,0.4);border-bottom:1px solid rgba(212,160,23,0.4);padding:2px 8px}

.reg-badge{background:rgba(255,255,255,0.08);border:1.5px solid #d4a017;border-radius:3px;padding:5px 10px;text-align:center}
.reg-badge .rb-label{font-size:6.5px;letter-spacing:1.5px;text-transform:uppercase;color:#81c784;font-weight:600;display:block}
.reg-badge .rb-value{font-family:'Roboto Mono',monospace;font-size:11px;font-weight:600;color:#f5cc5a;display:block;margin-top:2px;letter-spacing:1.5px}

/* RIBBON */
.ribbon{background:#1a3a00;display:flex;align-items:stretch;flex-shrink:0}
.ribbon-text{flex:1;padding:4px 18px;font-size:7.5px;letter-spacing:2px;text-transform:uppercase;color:#69a869;display:flex;align-items:center;gap:10px}
.ribbon-text .sq{color:#d4a017;font-size:8px}
.ribbon-stamp{background:#d4a017;color:#1a3a00;font-size:7px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;padding:0 14px;display:flex;align-items:center;white-space:nowrap}

/* BODY */
.body{display:grid;grid-template-columns:1fr 138px;flex:1;overflow:hidden;min-height:0}
.mc{padding:8px 14px;border-right:1px solid #e0e0d8;overflow:hidden}
.sc{padding:8px 8px;display:flex;flex-direction:column;gap:7px;align-items:center;background:rgba(248,248,244,0.6)}

/* SECTION BARS */
.sec{margin-bottom:6px}
.sec-bar{background:#003d00;color:#fff;font-size:7.5px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;padding:3px 8px;display:flex;align-items:center;gap:6px;margin-bottom:7px;position:relative;}
.sec-bar::after{content:'';position:absolute;right:0;top:0;bottom:0;width:3px;background:#d4a017}
.sec-letter{width:15px;height:15px;border-radius:50%;background:#d4a017;color:#003d00;font-size:8px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;}

/* GRIDS */
.g2{display:grid;grid-template-columns:1fr 1fr;gap:5px 14px;margin-bottom:6px}
.g3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:5px 10px;margin-bottom:6px}

.f{display:flex;flex-direction:column;gap:1px}
.f label{font-size:6.5px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:0.9px}
.fv{font-size:9.5px;color:#222;padding:2px 0 3px;border-bottom:1px solid #deded6;min-height:17px;position:relative;}
.fv::before{content:'';position:absolute;bottom:-1px;left:0;width:0;height:0;border-left:5px solid #003d00;border-right:5px solid transparent;border-bottom:2px solid #003d00;}

.dv{height:1px;background:#eeede6;margin:6px 0}

/* TABLES */
table{width:100%;border-collapse:collapse;font-size:8.5px}
.t-head{background:#003d00}
.t-head th{padding:3.5px 6px;text-align:left;font-size:7px;font-weight:700;color:#fff;text-transform:uppercase;letter-spacing:0.7px;border-right:1px solid rgba(255,255,255,0.12);}
.t-head th:last-child{border-right:none}
.ol-head{background:#1a3a00}
.ol-head th{padding:3.5px 6px;text-align:left;font-size:7px;font-weight:700;color:#fff;text-transform:uppercase;letter-spacing:0.7px;border-right:1px solid rgba(255,255,255,0.12);}
.ol-head th:last-child{border-right:none}
table td{border-bottom:1px solid #eeeee6;border-right:1px solid #eeeee6;padding:3.5px 6px;color:#222;font-size:8.5px;}
table td:last-child{border-right:none}
table tr:last-child td{border-bottom:none}
table tr:nth-child(even) td{background:rgba(0,61,0,0.02)}
.nc{color:#003d00;font-weight:700;width:20px;text-align:center;font-family:'Roboto Mono',monospace;font-size:8.5px}
.ol-nc{color:#1a3a00!important}

/* SIDEBAR */
.photo-area{width:116px;height:136px;border:1px solid #c8c8c0;background:#f5f5f0;position:relative;overflow:hidden;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;}
.photo-area::before{content:'';position:absolute;inset:0;background-image:linear-gradient(45deg,#e8e8e0 25%,transparent 25%),linear-gradient(-45deg,#e8e8e0 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#e8e8e0 75%),linear-gradient(-45deg,transparent 75%,#e8e8e0 75%);background-size:8px 8px;background-position:0 0,0 4px,4px -4px,-4px 0;background-color:#efefea;opacity:0.6;}
.photo-inner{position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;gap:4px}
.photo-area .pt{font-size:7px;color:#aaa;text-align:center;line-height:1.5;font-weight:700;text-transform:uppercase;letter-spacing:0.8px}
.co{position:absolute;width:10px;height:10px;border-color:#003d00;border-style:solid;opacity:0.5}
.co.tl{top:4px;left:4px;border-width:2px 0 0 2px}
.co.tr{top:4px;right:4px;border-width:2px 2px 0 0}
.co.bl{bottom:4px;left:4px;border-width:0 0 2px 2px}
.co.br{bottom:4px;right:4px;border-width:0 2px 2px 0}
.photo-label{width:116px;background:#003d00;color:#fff;font-size:6.5px;font-weight:700;text-align:center;padding:3px;letter-spacing:0.8px;text-transform:uppercase;border-top:2px solid #d4a017}

.reg-box{background:#003d00;width:100%;border-radius:2px;padding:7px 8px;text-align:center;position:relative;overflow:hidden}
.reg-box::after{content:'';position:absolute;bottom:0;left:0;right:0;height:2px;background:linear-gradient(90deg,#8b6914,#d4a017,#f5cc5a,#d4a017,#8b6914)}
.reg-box .rl{font-size:6.5px;text-transform:uppercase;letter-spacing:1.2px;color:#81c784;font-weight:700}
.reg-box .rv{font-family:'Roboto Mono',monospace;font-size:11px;font-weight:600;color:#f5cc5a;letter-spacing:2px;display:block;margin-top:2px}

.app-box{background:#f5f5f0;border:1px solid #deded4;border-top:2.5px solid #003d00;width:100%;padding:5px 8px;text-align:center}
.app-box .al{font-size:6.5px;text-transform:uppercase;letter-spacing:1.2px;color:#999;font-weight:700}
.app-box .av{font-family:'Roboto Mono',monospace;font-size:9.5px;font-weight:600;color:#333;margin-top:1px}

.qr-box{width:100%;background:#fff;border:1px solid #deded4;border-top:2.5px solid #d4a017;padding:5px 8px;text-align:center}
.qr-box .ql{font-size:6.5px;text-transform:uppercase;letter-spacing:1.2px;color:#999;font-weight:700;margin-bottom:4px}
.qr-box img{width:80px;height:80px}

.ins-box{width:100%;border:1px solid #deded4;border-left:3px solid #003d00;background:rgba(255,255,255,0.8);padding:7px 8px;font-size:7px;color:#555;line-height:1.8}
.ins-box .ins-title{font-size:7px;font-weight:700;color:#003d00;text-transform:uppercase;letter-spacing:0.8px;display:block;margin-bottom:4px;padding-bottom:3px;border-bottom:1px solid #e0e0d4}
.ins-box li{margin-left:11px;margin-bottom:1px}

/* FOOTER */
.ftr{background:#1a3a00;flex-shrink:0}
.ftr-gold{height:3px;background:linear-gradient(90deg,#8b6914,#d4a017,#f5cc5a,#d4a017,#8b6914)}
.ftr-inner{display:flex;justify-content:space-between;align-items:center;padding:5px 18px}
.ftr-inner span{font-size:7px;color:#69a869;letter-spacing:0.3px}
.ftr-badge{background:#d4a017;color:#1a3a00;font-size:7px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;padding:2px 12px;border-radius:20px}

@media print{
  body{background:#fff;padding:0}
  .page{box-shadow:none;width:210mm;height:297mm}
  @page{size:A4 portrait;margin:0}
}
</style>
</head>
<body>
<div class="page">
  <div class="watermark"></div>
  <div class="shell">

    <div class="hdr">
      <div class="hdr-gold"></div>
      <div class="hdr-body">
        <div class="logo-ring"><img src="${logoSrc}" alt="IJMB Logo"/></div>
        <div class="hdr-center">
          <div class="republic">Federal Republic of Nigeria</div>
          <div class="board">Interim Joint Matriculation Board (IJMB)</div>
          <div class="slip-type">Official Student Registration Slip</div>
          <div class="session">&#9632;&nbsp; Academic Session ${esc(data.academicSession)} &nbsp;&#9632;</div>
        </div>
        <div class="reg-badge">
          <span class="rb-label">Reg. No.</span>
          <span class="rb-value">${esc(data.applicationId)}</span>
        </div>
      </div>
      <div class="hdr-gold"></div>
    </div>

    <div class="ribbon">
      <div class="ribbon-text"><span class="sq">&#9632;</span> Registration File <span class="sq">&#9632;</span> Confidential &mdash; Do Not Duplicate <span class="sq">&#9632;</span> For Candidate Use Only</div>
      <div class="ribbon-stamp">Candidate Copy</div>
    </div>

    <div class="body">
      <div class="mc">

        <div class="sec">
          <div class="sec-bar"><span class="sec-letter">A</span> Personal Details</div>
          <div class="g3">
            <div class="f"><label>Surname</label><div class="fv">${esc(data.surname)}</div></div>
            <div class="f"><label>First Name</label><div class="fv">${esc(data.firstName)}</div></div>
            <div class="f"><label>Middle Name</label><div class="fv">${esc(data.middleName) || '—'}</div></div>
          </div>
          <div class="g3">
            <div class="f"><label>Date of Birth</label><div class="fv">${esc(data.dateOfBirth)}</div></div>
            <div class="f"><label>Gender</label><div class="fv">${esc(data.gender)}</div></div>
            <div class="f"><label>Nationality</label><div class="fv">Nigerian</div></div>
          </div>
          <div class="g3">
            <div class="f"><label>State of Origin</label><div class="fv">${esc(data.stateOfOrigin)}</div></div>
            <div class="f"><label>LGA</label><div class="fv">${esc(data.lga)}</div></div>
            <div class="f"><label>Phone Number</label><div class="fv">${esc(data.phoneNumber)}</div></div>
          </div>
          <div class="g2">
            <div class="f"><label>Email Address</label><div class="fv">${esc(data.email)}</div></div>
            <div class="f"><label>Home Address</label><div class="fv">${esc(data.residentialAddress)}</div></div>
          </div>
        </div>

        <div class="dv"></div>

        <div class="sec">
          <div class="sec-bar"><span class="sec-letter">B</span> Programme &amp; Centre</div>
          <div class="g2">
            <div class="f"><label>Centre of Choice</label><div class="fv">${esc(data.centreOfStudy)}</div></div>
            <div class="f"><label>Programme</label><div class="fv">Direct Entry Programme</div></div>
          </div>
          <div class="g2">
            <div class="f"><label>Course of Choice</label><div class="fv">${esc(data.courseOfChoice)}</div></div>
            <div class="f"><label>Subject Combination</label><div class="fv">${esc(data.subjectCombination)}</div></div>
          </div>
        </div>

        <div class="dv"></div>

        <div class="sec">
          <div class="sec-bar"><span class="sec-letter">C</span> IJMB Subject Choices</div>
          <table>
            <thead class="t-head">
              <tr><th style="width:20px">#</th><th>Subject</th><th>Category</th></tr>
            </thead>
            <tbody>${subjectRows}</tbody>
          </table>
        </div>

        <div class="dv"></div>

        <div class="sec">
          <div class="sec-bar"><span class="sec-letter">D</span> O&apos;Level Results</div>
          <table>
            <thead class="ol-head">
              <tr><th style="width:20px">#</th><th>Subject</th><th style="width:48px">Grade</th><th style="width:55px">Exam Year</th><th style="width:65px">Exam Body</th></tr>
            </thead>
            <tbody>${olevelRows}</tbody>
          </table>
        </div>

        <div class="dv"></div>

        <div class="sec">
          <div class="sec-bar"><span class="sec-letter">E</span> Payment &amp; Registration Details</div>
          <div class="g3">
            <div class="f"><label>Payment Reference</label><div class="fv">${esc(data.paymentReference) || '—'}</div></div>
            <div class="f"><label>Payment Date</label><div class="fv">${esc(data.paymentDate) || '—'}</div></div>
            <div class="f"><label>Amount Paid (&#8358;)</label><div class="fv">${esc(data.amountPaid) || '—'}</div></div>
          </div>
          <div class="g2">
            <div class="f"><label>Application ID</label><div class="fv">${esc(data.applicationId)}</div></div>
            <div class="f"><label>Date of Registration</label><div class="fv">${esc(data.registrationDate)}</div></div>
          </div>
        </div>

      </div>

      <div class="sc">
        <div class="photo-area">
          <div class="co tl"></div><div class="co tr"></div><div class="co bl"></div><div class="co br"></div>
          ${passportHtml}
        </div>
        <div class="photo-label">Passport Photograph</div>

        <div class="reg-box">
          <div class="rl">Registration Number</div>
          <span class="rv">${esc(data.applicationId)}</span>
        </div>

        <div class="app-box">
          <div class="al">Application ID</div>
          <div class="av">${esc(data.applicationId)}</div>
        </div>

        ${data.qrCodeBase64 ? `
        <div class="qr-box">
          <div class="ql">Scan to Verify</div>
          <img src="${data.qrCodeBase64}" alt="QR Code"/>
        </div>` : ''}

        <div class="ins-box">
          <span class="ins-title">Instructions</span>
          <ul>
            <li>Keep this slip safe</li>
            <li>Bring on exam day</li>
            <li>No alterations allowed</li>
            <li>Present valid ID</li>
            <li>Arrive 30 mins early</li>
            <li>No phones in hall</li>
            <li>Biometric verification compulsory</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="ftr">
      <div class="ftr-gold"></div>
      <div class="ftr-inner">
        <span>IJMB &copy; ${new Date().getFullYear()} &mdash; Federal Republic of Nigeria</span>
        <div class="ftr-badge">Candidate Copy</div>
        <span>Print Date: ${printDate}</span>
      </div>
    </div>

  </div>
</div>
</body>
</html>`;
};
