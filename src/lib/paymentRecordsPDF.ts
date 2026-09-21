import { jsPDF } from 'jspdf';
import { paymentLabels, paymentTotals, reportDate, type PaymentSnapshot } from './paymentRecords';

export function buildPaymentRecordsPDF(snapshot: PaymentSnapshot, logo: string, scope: string) {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const totals = paymentTotals(snapshot.records);
  const money = (n: number) => `NGN ${n.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const widths = [47, 47, 34, 34, 38, 27, 42];
  const headings = ['Student Full Name', 'Course Applied', 'Amount Paid', 'Payment Type', 'Payment Date', 'Payment Status', 'Current Admission Status'];
  let y = 0;
  const header = () => {
    doc.setFillColor(20, 66, 52); doc.rect(0, 0, 297, 3, 'F');
    const image = doc.getImageProperties(logo);
    const scale = Math.min(19 / image.width, 19 / image.height);
    doc.addImage(logo, 'JPEG', 14, 9, image.width * scale, image.height * scale);
    doc.setTextColor(20, 66, 52); doc.setFont('helvetica', 'bold'); doc.setFontSize(18); doc.text('IJMB', 38, 15);
    doc.setFontSize(11); doc.text('Dynamic College of Advanced Studies', 38, 22);
    doc.setFontSize(17); doc.text('Payment Records', 14, 39);
    doc.setFont('helvetica', 'normal'); doc.setTextColor(65); doc.setFontSize(9);
    doc.text(`Generated: ${reportDate(snapshot.generatedAt)} WAT (UTC+1)`, 283, 37, { align: 'right' });
    const range = snapshot.startDate ? `${snapshot.startDate} to ${snapshot.endDate} (inclusive)` : 'All Records';
    doc.text(`Payment dates: ${range} | Africa/Lagos`, 14, 46);
    const scopeLines = doc.splitTextToSize(scope.length > 240 ? scope.slice(0, 237) + '...' : scope, 265);
    doc.text(scopeLines, 14, 52);
    y = 58 + (scopeLines.length - 1) * 4;
    doc.setFillColor(237, 245, 240); doc.roundedRect(14, y, 269, 16, 2, 2, 'F');
    doc.setFont('helvetica', 'bold'); doc.setFontSize(10);
    doc.text(`Students: ${totals.students}     Payments: ${totals.payments}`, 19, y + 7);
    doc.text(`Total received: ${money(totals.received)}`, 278, y + 7, { align: 'right' });
    doc.setFont('helvetica', 'normal'); doc.setFontSize(8);
    doc.text('Total received includes successful payments only. Pending and failed payments are excluded from this total.', 19, y + 12);
    y += 22;
    drawRow(headings, true);
  };
  const drawRow = (values: string[], heading = false) => {
    doc.setFont('helvetica', heading ? 'bold' : 'normal'); doc.setFontSize(heading ? 8 : 8.5);
    const lines = values.map((v, i) => doc.splitTextToSize(v, widths[i] - 5) as string[]);
    let offset = 0;
    const count = Math.max(...lines.map(l => l.length));
    if (!heading && y + Math.max(12, count * 4 + 5) > 190 && count * 4 + 5 <= 90) {
      doc.addPage(); header(); doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5);
    }
    do {
      if (!heading && y + 12 > 190) { doc.addPage(); header(); doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5); }
      const capacity = heading ? count : Math.max(1, Math.floor((190 - y - 5) / 4));
      const take = Math.min(count - offset, capacity);
      const height = Math.max(12, take * 4 + 5);
      let x = 14;
      lines.forEach((cell, i) => {
        doc.setDrawColor(207, 218, 212); doc.setLineWidth(0.2);
        doc.setFillColor(heading ? 20 : 255, heading ? 66 : 255, heading ? 52 : 255);
        doc.rect(x, y, widths[i], height, 'FD'); doc.setTextColor(heading ? 255 : 40);
        const chunk = cell.slice(offset, offset + take);
        if (chunk.length) doc.text(chunk, i === 2 && !heading ? x + widths[i] - 2.5 : x + 2.5, y + 5, { align: i === 2 && !heading ? 'right' : 'left', lineHeightFactor: 1.33 });
        x += widths[i];
      });
      y += height; offset += take;
    } while (offset < count);
  };
  header();
  snapshot.records.forEach(r => drawRow([r.fullName, r.course, money(Number(r.amount)), paymentLabels[r.paymentType] || r.paymentType || 'Not available', reportDate(r.paymentDate).replace(', ', '\n'), r.paymentStatus === 'success' ? 'Successful' : r.paymentStatus.charAt(0).toUpperCase() + r.paymentStatus.slice(1), r.admissionStatus]));
  for (let p = 1; p <= doc.getNumberOfPages(); p++) {
    doc.setPage(p); doc.setDrawColor(207, 218, 212); doc.line(14, 197, 283, 197);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(90);
    doc.text('IJMB | Administrative Payment Records | Statuses as at generation time', 14, 202);
    doc.text(`Page ${p} of ${doc.getNumberOfPages()}`, 283, 202, { align: 'right' });
  }
  doc.setProperties({ title: 'Payment Records', author: 'Dynamic College of Advanced Studies', subject: 'IJMB Payment Records Report' });
  return doc;
}
