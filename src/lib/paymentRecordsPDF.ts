import { jsPDF } from 'jspdf';
import { groupPaymentRecords, paymentLabels, paymentTotals, reportDate, type PaymentRecord, type PaymentSnapshot, type StudentPaymentGroup } from './paymentRecords';

const PAGE_WIDTH = 210;
const MARGIN = 14;
const CONTENT_WIDTH = PAGE_WIDTH - (MARGIN * 2);
const CONTENT_TOP = 72;
const CONTENT_BOTTOM = 282;

export function buildPaymentRecordsPDF(snapshot: PaymentSnapshot, logo: string, scope: string) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const totals = paymentTotals(snapshot.records);
  const groups = groupPaymentRecords(snapshot.records);
  const money = (amount: number) => `NGN ${amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const statusLabel = (status: string) => status === 'success' ? 'Successful' : status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Not available';
  let y = CONTENT_TOP;

  const drawPageHeader = () => {
    doc.setFillColor(20, 66, 52);
    doc.rect(0, 0, PAGE_WIDTH, 3, 'F');
    const image = doc.getImageProperties(logo);
    const scale = Math.min(17 / image.width, 17 / image.height);
    doc.addImage(logo, 'JPEG', MARGIN, 8, image.width * scale, image.height * scale);

    doc.setTextColor(20, 66, 52);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(15);
    doc.text('IJMB', 35, 13);
    doc.setFontSize(8.5);
    doc.text('Dynamic College of Advanced Studies', 35, 19);
    doc.setFontSize(14);
    doc.text('Payment History Report', PAGE_WIDTH - MARGIN, 14, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(78, 91, 86);
    doc.setFontSize(7.5);
    doc.text(`Generated ${reportDate(snapshot.generatedAt)} WAT`, PAGE_WIDTH - MARGIN, 20, { align: 'right' });

    const range = snapshot.startDate ? `${snapshot.startDate} to ${snapshot.endDate} (inclusive)` : 'All payment dates';
    doc.setFillColor(246, 249, 247);
    doc.roundedRect(MARGIN, 30, CONTENT_WIDTH, 14, 2, 2, 'F');
    doc.setTextColor(73, 86, 80);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.text('PERIOD', MARGIN + 4, 35);
    doc.text('SELECTION', 93, 35);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.2);
    doc.text(range, MARGIN + 4, 40);
    const scopeText = scope.length > 125 ? `${scope.slice(0, 122)}...` : scope;
    doc.text(scopeText, 93, 40, { maxWidth: 99 });

    const boxWidth = (CONTENT_WIDTH - 6) / 3;
    const summary = [
      ['STUDENTS', String(totals.students)],
      ['PAYMENTS', String(totals.payments)],
      ['TOTAL RECEIVED', money(totals.received)],
    ];
    summary.forEach(([label, value], index) => {
      const x = MARGIN + index * (boxWidth + 3);
      doc.setFillColor(index === 2 ? 232 : 238, index === 2 ? 245 : 242, index === 2 ? 237 : 240);
      doc.roundedRect(x, 48, boxWidth, 17, 2, 2, 'F');
      doc.setTextColor(69, 84, 77);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.8);
      doc.text(label, x + 4, 54);
      doc.setTextColor(20, 66, 52);
      doc.setFontSize(index === 2 ? 10 : 12);
      doc.text(value, x + 4, 61.5);
    });
    doc.setFont('helvetica', 'normal');
    y = CONTENT_TOP;
  };

  const addPage = () => {
    doc.addPage();
    drawPageHeader();
  };

  const ensureSpace = (height: number) => {
    if (y + height > CONTENT_BOTTOM) addPage();
  };

  const drawStudentSummary = (group: StudentPaymentGroup, index: number, followingHeight: number) => {
    const nameLines = doc.splitTextToSize(group.fullName, 112) as string[];
    const courseLines = doc.splitTextToSize(group.course, 148) as string[];
    const centerLines = doc.splitTextToSize(group.intendedCenter || 'Not available', 137) as string[];
    const topHeight = Math.max(13, nameLines.length * 4.5 + 7);
    const bodyHeight = Math.max(23, (courseLines.length + centerLines.length) * 4 + 13);
    const height = topHeight + bodyHeight;
    ensureSpace(height + followingHeight);

    doc.setFillColor(20, 66, 52);
    doc.roundedRect(MARGIN, y, CONTENT_WIDTH, height, 2, 2, 'F');
    doc.setFillColor(255, 255, 255);
    doc.rect(MARGIN + 0.5, y + topHeight, CONTENT_WIDTH - 1, bodyHeight - 0.5, 'F');

    doc.setTextColor(207, 232, 220);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.text(`STUDENT ${index + 1}`, MARGIN + 4, y + 5);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.text(nameLines, MARGIN + 4, y + 10, { lineHeightFactor: 1.15 });
    doc.setFontSize(6.5);
    doc.setTextColor(207, 232, 220);
    doc.text('TOTAL PAID (SUCCESSFUL)', PAGE_WIDTH - MARGIN - 4, y + 5, { align: 'right' });
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10.5);
    doc.text(money(group.totalPaid), PAGE_WIDTH - MARGIN - 4, y + 11, { align: 'right' });

    let detailY = y + topHeight + 6;
    const drawDetail = (label: string, lines: string[], valueX = MARGIN + 34) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(92, 105, 99);
      doc.text(label, MARGIN + 4, detailY);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(35, 45, 40);
      doc.text(lines, valueX, detailY, { lineHeightFactor: 1.25 });
      detailY += Math.max(1, lines.length) * 4 + 2;
    };
    drawDetail('COURSE', courseLines);
    drawDetail('INTENDED CENTER', centerLines, MARGIN + 45);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(92, 105, 99);
    doc.text('ADMISSION', MARGIN + 4, detailY);
    doc.text('PAYMENTS', 123, detailY);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(35, 45, 40);
    doc.text(group.admissionStatus, MARGIN + 34, detailY);
    doc.text(String(group.payments.length), 144, detailY);
    y += height;
  };

  const drawContinuation = (group: StudentPaymentGroup) => {
    doc.setFillColor(238, 245, 241);
    doc.roundedRect(MARGIN, y, CONTENT_WIDTH, 11, 2, 2, 'F');
    doc.setTextColor(20, 66, 52);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.text(`${group.fullName} - payment history continued`, MARGIN + 4, y + 7, { maxWidth: 122 });
    doc.setFontSize(8);
    doc.text(`Total paid: ${money(group.totalPaid)}`, PAGE_WIDTH - MARGIN - 4, y + 7, { align: 'right' });
    y += 13;
  };

  const columns = [40, 75, 27, 40];
  const drawTransactionHeading = () => {
    doc.setFillColor(226, 234, 230);
    doc.rect(MARGIN, y, CONTENT_WIDTH, 8, 'F');
    doc.setTextColor(62, 77, 70);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    let x = MARGIN;
    ['PAYMENT DATE', 'TRANSACTION', 'STATUS', 'AMOUNT'].forEach((heading, index) => {
      doc.text(heading, index === 3 ? x + columns[index] - 3 : x + 3, y + 5.2, { align: index === 3 ? 'right' : 'left', maxWidth: columns[index] - 6 });
      x += columns[index];
    });
    y += 8;
  };

  const transactionHeight = (record: PaymentRecord, latest: boolean) => {
    doc.setFontSize(8.2);
    const typeLines = doc.splitTextToSize(paymentLabels[record.paymentType] || record.paymentType || 'Not available', columns[1] - 7) as string[];
    doc.setFontSize(7.2);
    const referenceLines = doc.splitTextToSize(`Ref: ${record.reference || 'Not available'}`, columns[1] - 7) as string[];
    const statusLines = doc.splitTextToSize(statusLabel(record.paymentStatus), columns[2] - 6) as string[];
    return Math.max(latest ? 19 : 16, 6 + Math.max((typeLines.length + referenceLines.length) * 3.5, statusLines.length * 3.5));
  };

  const drawTransaction = (record: PaymentRecord, latest: boolean, alternate: boolean) => {
    const height = transactionHeight(record, latest);
    if (y + height > CONTENT_BOTTOM) return false;
    doc.setFillColor(alternate ? 248 : 255, alternate ? 250 : 255, alternate ? 249 : 255);
    doc.rect(MARGIN, y, CONTENT_WIDTH, height, 'F');
    doc.setDrawColor(218, 226, 222);
    doc.setLineWidth(0.2);
    doc.line(MARGIN, y + height, PAGE_WIDTH - MARGIN, y + height);

    const [datePart, timePart = ''] = reportDate(record.paymentDate).split(', ');
    const textTop = y + (latest ? 10 : 5);
    if (latest) {
      doc.setFillColor(214, 239, 225);
      doc.roundedRect(MARGIN + 3, y + 2.3, 17, 5, 1.5, 1.5, 'F');
      doc.setTextColor(20, 105, 65);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(5.8);
      doc.text('LATEST', MARGIN + 11.5, y + 5.8, { align: 'center' });
    }
    doc.setTextColor(39, 50, 45);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.2);
    doc.text(datePart, MARGIN + 3, textTop);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.4);
    doc.setTextColor(89, 101, 96);
    doc.text(timePart, MARGIN + 3, textTop + 4);

    const transactionX = MARGIN + columns[0];
    const type = paymentLabels[record.paymentType] || record.paymentType || 'Not available';
    const typeLines = doc.splitTextToSize(type, columns[1] - 7) as string[];
    doc.setTextColor(39, 50, 45);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.2);
    doc.text(typeLines, transactionX + 3, y + 5, { lineHeightFactor: 1.2 });
    const referenceY = y + 5 + typeLines.length * 3.7;
    doc.setTextColor(89, 101, 96);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.2);
    doc.text(doc.splitTextToSize(`Ref: ${record.reference || 'Not available'}`, columns[1] - 7), transactionX + 3, referenceY, { lineHeightFactor: 1.2 });

    const statusX = transactionX + columns[1];
    doc.setTextColor(record.paymentStatus === 'success' ? 20 : record.paymentStatus === 'failed' ? 166 : 151, record.paymentStatus === 'success' ? 105 : record.paymentStatus === 'failed' ? 48 : 102, record.paymentStatus === 'success' ? 65 : record.paymentStatus === 'failed' ? 48 : 20);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.text(doc.splitTextToSize(statusLabel(record.paymentStatus), columns[2] - 6), statusX + 3, y + 6, { lineHeightFactor: 1.2 });

    doc.setTextColor(31, 42, 37);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.4);
    doc.text(money(Number(record.amount)), PAGE_WIDTH - MARGIN - 3, y + 6, { align: 'right' });
    y += height;
    return true;
  };

  drawPageHeader();
  groups.forEach((group, groupIndex) => {
    drawStudentSummary(group, groupIndex, 8 + transactionHeight(group.payments[0], true));
    drawTransactionHeading();
    group.payments.forEach((payment, paymentIndex) => {
      const latest = paymentIndex === 0;
      if (!drawTransaction(payment, latest, paymentIndex % 2 === 1)) {
        addPage();
        drawContinuation(group);
        drawTransactionHeading();
        drawTransaction(payment, latest, paymentIndex % 2 === 1);
      }
    });
    y += 5;
  });

  const pages = doc.getNumberOfPages();
  for (let page = 1; page <= pages; page++) {
    doc.setPage(page);
    doc.setDrawColor(207, 218, 212);
    doc.line(MARGIN, 287, PAGE_WIDTH - MARGIN, 287);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.2);
    doc.setTextColor(90, 101, 96);
    doc.text('Successful totals exclude pending and failed transactions. Statuses are current at generation time.', MARGIN, 292);
    doc.text(`Page ${page} of ${pages}`, PAGE_WIDTH - MARGIN, 292, { align: 'right' });
  }
  doc.setProperties({ title: 'IJMB Payment History Report', author: 'Dynamic College of Advanced Studies', subject: 'Grouped student payment records' });
  return doc;
}
