export type PaymentRecord = {
  id: string; studentId: string; reference: string; fullName: string; course: string;
  amount: number; paymentType: string; paymentDate: string; paymentStatus: string; admissionStatus: string;
};
export type PaymentSnapshot = {
  generatedAt: string; startDate: string | null; endDate: string | null; records: PaymentRecord[];
};
export const paymentLabels: Record<string, string> = {
  form_fee: 'Registration Fee', acceptance: 'Acceptance Fee', acceptance_fee: 'Acceptance Fee',
  tuition: 'Tuition Fee', tuition_fee: 'Tuition Fee', hostel: 'Hostel Fee', hostel_fee: 'Hostel Fee', exam_fee: 'Exam Fee',
};
// Internal test payments explicitly identified for omission from shared exports.
const EXCLUDED_EXPORT_REFERENCES = new Set(['T505759112493846', 'T134032134653374']);
// Match the displayed second: 24 July 2026, 10:25:53 AM in Nigeria (UTC+1).
const EXCLUDED_EXPORT_SECOND = Date.parse('2026-07-24T10:25:53+01:00') / 1000;

export function filterPaymentRecords(records: PaymentRecord[], search = '', feeType = '') {
  const query = search.trim().toLowerCase();
  return records.filter(r => !EXCLUDED_EXPORT_REFERENCES.has(r.reference)
    && Math.floor(Date.parse(r.paymentDate) / 1000) !== EXCLUDED_EXPORT_SECOND
    && (!feeType || (paymentLabels[r.paymentType] || r.paymentType) === (paymentLabels[feeType] || feeType))
    && (!query || r.fullName.toLowerCase().includes(query) || r.reference.toLowerCase().includes(query)));
}
export function paymentTotals(records: PaymentRecord[]) {
  return {
    students: new Set(records.map(r => r.studentId)).size,
    payments: records.length,
    received: records.reduce((sum, r) => sum + (r.paymentStatus === 'success' ? Math.round(Number(r.amount) * 100) : 0), 0) / 100,
  };
}
export function reportDate(value: string) {
  return new Intl.DateTimeFormat('en-GB', { timeZone: 'Africa/Lagos', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).format(new Date(value));
}
