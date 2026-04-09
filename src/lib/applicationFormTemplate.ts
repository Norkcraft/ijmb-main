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
  passportPhotoBase64: string; // base64 data URI of passport photo
  qrCodeBase64: string;        // base64 data URI of QR code
  logoBase64: string;          // base64 data URI of site logo
}

export const buildApplicationFormHTML = (data: ApplicationFormData): string => {
  const accentColor = '#1a5276'; // Deep Green/Navy hybrid
  const lightGray = '#f8f9fa';
  const borderColor = '#e0e0e0';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>IJMB Application Form - ${data.applicationId}</title>
  <style>
    @page {
      size: A4;
      margin: 0;
    }
    
    body {
      margin: 0;
      padding: 0;
      font-family: 'Times New Roman', Times, serif;
      background-color: white;
      color: #1a1a2e;
      box-sizing: border-box;
      width: 210mm;
      min-height: 297mm;
      position: relative;
    }

    .container {
      width: 190mm; /* A4 width minus padding */
      margin: 0 auto;
      padding: 10mm 15mm;
      position: relative;
      min-height: 290mm;
    }

    /* Header Styling */
    .header {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 5px;
      position: relative;
    }

    .logo {
      position: absolute;
      left: 0;
      top: 0;
      width: 70px;
      height: 70px;
      object-fit: contain;
    }

    .institution-name {
      text-align: center;
    }

    .institution-name h1 {
      margin: 0;
      font-size: 24px;
      font-weight: bold;
      color: ${accentColor};
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .institution-name p {
      margin: 5px 0 0 0;
      font-size: 14px;
      font-weight: bold;
      color: #555;
      letter-spacing: 3px;
    }

    /* Banner */
    .banner {
      background-color: ${accentColor};
      color: white;
      text-align: center;
      padding: 8px 0;
      margin: 15px 0 20px 0;
      font-weight: bold;
      font-size: 16px;
      text-transform: uppercase;
      border-radius: 2px;
    }

    /* Top Info & Passport */
    .top-section {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 25px;
    }

    .meta-info {
      flex: 1;
      padding-top: 10px;
    }

    .meta-field {
      margin-bottom: 8px;
      font-size: 14px;
    }

    .meta-field strong {
      display: inline-block;
      width: 140px;
      color: #333;
    }

    .meta-field span {
      font-weight: bold;
      font-family: Arial, sans-serif;
      color: ${accentColor};
    }

    .passport-box {
      width: 120px;
      height: 140px;
      border: 1px solid #333;
      background-color: #f0f0f0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }

    .passport-box img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .passport-label {
      font-size: 10px;
      margin-top: 4px;
      text-align: center;
      color: #666;
    }

    /* Section Styling */
    .section {
      margin-bottom: 25px;
    }

    .section-header {
      background-color: ${lightGray};
      border-left: 4px solid ${accentColor};
      padding: 6px 10px;
      font-weight: bold;
      font-size: 14px;
      text-transform: uppercase;
      color: ${accentColor};
      margin-bottom: 8px;
      border-bottom: 1px solid ${borderColor};
    }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
    }

    td {
      padding: 8px 12px;
      border: 1px solid ${borderColor};
      vertical-align: top;
    }

    .label-col {
      width: 30%;
      background-color: #fafafa;
      font-weight: bold;
      color: #444;
    }

    .value-col {
      width: 70%;
      color: #000;
    }

    /* Declaration */
    .declaration {
      margin-top: 40px;
      padding: 20px;
      border: 1px solid ${borderColor};
      background-color: #fafafa;
    }

    .declaration-text {
      font-style: italic;
      font-size: 13px;
      line-height: 1.5;
      margin-bottom: 30px;
      color: #333;
    }

    .signature-line {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      font-weight: bold;
    }

    /* Footer */
    .footer {
      position: absolute;
      bottom: 15mm;
      left: 15mm;
      right: 15mm;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      border-top: 2px solid ${accentColor};
      padding-top: 15px;
    }

    .footer-left {
      font-size: 11px;
      color: #666;
      max-width: 60%;
    }

    .footer-right {
      text-align: center;
    }

    .qr-code {
      width: 80px;
      height: 80px;
      margin-bottom: 4px;
    }

    .qr-label {
      font-size: 9px;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    /* Print Optimization */
    @media print {
      body {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
    }
  </style>
</head>
<body>

  <div class="container">
    
    <!-- Header -->
    <div class="header">
      ${data.logoBase64 ? `<img src="${data.logoBase64}" alt="Logo" class="logo">` : ''}
      <div class="institution-name">
        <h1>INTERIM JOINT MATRICULATION BOARD</h1>
        <p>ADVANCED LEVEL STUDIES</p>
      </div>
    </div>

    <!-- Banner -->
    <div class="banner">
      IJMB Application Form
    </div>

    <!-- Top Section -->
    <div class="top-section">
      <div class="meta-info">
        <div class="meta-field">
          <strong>Application ID:</strong>
          <span>${data.applicationId}</span>
        </div>
        <div class="meta-field">
          <strong>Registration Date:</strong>
          <span>${data.registrationDate}</span>
        </div>
        <div class="meta-field">
          <strong>Academic Session:</strong>
          <span>${data.academicSession}</span>
        </div>
      </div>

      <div>
        <div class="passport-box">
          ${data.passportPhotoBase64 
            ? `<img src="${data.passportPhotoBase64}" alt="Passport">` 
            : `<span style="color:#999; font-size:12px;">PHOTO</span>`
          }
        </div>
        <div class="passport-label">Passport Photograph</div>
      </div>
    </div>

    <!-- 1. Personal Information -->
    <div class="section">
      <div class="section-header">1. Personal Information</div>
      <table>
        <tr>
          <td class="label-col">Surname</td>
          <td class="value-col">${data.surname}</td>
        </tr>
        <tr>
          <td class="label-col">First Name</td>
          <td class="value-col">${data.firstName}</td>
        </tr>
        <tr>
          <td class="label-col">Middle Name</td>
          <td class="value-col">${data.middleName || '-'}</td>
        </tr>
        <tr>
          <td class="label-col">Gender</td>
          <td class="value-col">${data.gender}</td>
        </tr>
        <tr>
          <td class="label-col">Date of Birth</td>
          <td class="value-col">${data.dateOfBirth}</td>
        </tr>
      </table>
    </div>

    <!-- 2. Origin Information -->
    <div class="section">
      <div class="section-header">2. Origin Information</div>
      <table>
        <tr>
          <td class="label-col">State of Origin</td>
          <td class="value-col">${data.stateOfOrigin}</td>
        </tr>
        <tr>
          <td class="label-col">Local Govt. Area</td>
          <td class="value-col">${data.lga}</td>
        </tr>
      </table>
    </div>

    <!-- 3. Contact Information -->
    <div class="section">
      <div class="section-header">3. Contact Information</div>
      <table>
        <tr>
          <td class="label-col">Phone Number</td>
          <td class="value-col">${data.phoneNumber}</td>
        </tr>
        <tr>
          <td class="label-col">Email Address</td>
          <td class="value-col">${data.email}</td>
        </tr>
        <tr>
          <td class="label-col">Residential Address</td>
          <td class="value-col">${data.residentialAddress}</td>
        </tr>
      </table>
    </div>

    <!-- 4. Programme Information -->
    <div class="section">
      <div class="section-header">4. Programme Information</div>
      <table>
        <tr>
          <td class="label-col">Centre of Study</td>
          <td class="value-col">${data.centreOfStudy}</td>
        </tr>
        <tr>
          <td class="label-col">Course of Choice</td>
          <td class="value-col">${data.courseOfChoice}</td>
        </tr>
        <tr>
          <td class="label-col">Subject Combination</td>
          <td class="value-col">${data.subjectCombination}</td>
        </tr>
      </table>
    </div>

    <!-- Declaration -->
    <div class="declaration">
      <div class="declaration-text">
        "I hereby declare that the information provided in this application is true and correct to the best of my knowledge. I understand that any false information may lead to the cancellation of my admission."
      </div>
      <div class="signature-line">
        <span>Student Signature: _______________________</span>
        <span>Date: _________________</span>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <div class="footer-left">
        <p><strong>Note:</strong> This document is computer generated and serves as a provisional registration slip. Please present this slip at your study centre for final documentation.</p>
        <p style="margin-top:5px; font-size:10px;">Generated on: ${new Date().toLocaleString()}</p>
      </div>
      <div class="footer-right">
        ${data.qrCodeBase64 ? `<img src="${data.qrCodeBase64}" alt="QR Verification" class="qr-code">` : ''}
        <div class="qr-label">Scan to Verify</div>
      </div>
    </div>

  </div>

</body>
</html>
  `;
};
