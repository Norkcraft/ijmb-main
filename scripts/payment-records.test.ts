import assert from 'node:assert/strict';
import test from 'node:test';
import { filterPaymentRecords, groupPaymentRecords, paymentTotals, reportDate, type PaymentRecord } from '../src/lib/paymentRecords';
const records: PaymentRecord[] = [
  {id:'1', studentId:'a', reference:'REF1', fullName:'Ada Okafor', course:'Medicine', intendedCenter:'Abuja Centre, Abuja, FCT', amount:100.10, paymentType:'tuition', paymentDate:'2026-07-23T09:25:53Z', paymentStatus:'success', admissionStatus:'Admitted'},
  {id:'2', studentId:'a', reference:'REF2', fullName:'Ada Okafor', course:'Medicine', intendedCenter:'Abuja Centre, Abuja, FCT', amount:200.20, paymentType:'tuition_fee', paymentDate:'2026-07-24T09:25:54Z', paymentStatus:'success', admissionStatus:'Admitted'},
  {id:'3', studentId:'b', reference:'REF3', fullName:'Bola Ade', course:'Law', intendedCenter:'Ilorin Centre, Ilorin, Kwara', amount:9000, paymentType:'form_fee', paymentDate:'2026-07-23T09:25:53Z', paymentStatus:'pending', admissionStatus:'Pending Admission'},
  {id:'4', studentId:'c', reference:'REF4', fullName:'Chidi Obi', course:'Law', intendedCenter:'Oko Centre, Oko, Anambra', amount:7000, paymentType:'form_fee', paymentDate:'2026-07-23T09:25:53Z', paymentStatus:'failed', admissionStatus:'Not Admitted'},
];
test('keeps separate payments sharing student and timestamp; totals only confirmed receipts', () => {
  assert.deepEqual(paymentTotals(records), {students:3, payments:4, received:300.30});
  assert.equal(filterPaymentRecords(records).length, 4);
});
test('filters fee aliases, names and references before calculating report totals', () => {
  assert.equal(filterPaymentRecords(records, ' ada ', 'tuition_fee').length, 2);
  assert.deepEqual(paymentTotals(filterPaymentRecords(records, 'ref2')), {students:1, payments:1, received:200.20});
  assert.equal(filterPaymentRecords(records, 'missing').length, 0);
});
test('empty selection has zero totals', () => assert.deepEqual(paymentTotals([]), {students:0,payments:0,received:0}));
test('dates include time to the second in Nigeria time', () => assert.match(reportDate(records[0].paymentDate), /10:25:53/));

test('groups each student once, keeps newest payment first, and totals successful payments only', () => {
  const groups = groupPaymentRecords(records);
  assert.equal(groups.length, 3);
  assert.equal(groups[0].studentId, 'a');
  assert.equal(groups[0].intendedCenter, 'Abuja Centre, Abuja, FCT');
  assert.deepEqual(groups[0].payments.map(payment => payment.id), ['2', '1']);
  assert.equal(groups[0].latestPaymentDate, records[1].paymentDate);
  assert.equal(groups[0].totalPaid, 300.30);
  assert.equal(groups[1].totalPaid, 0);
});

test('omits only the specified internal test reference from export rows and totals', () => {
  const internalTest = {...records[0], id:'test', studentId:'test-student', reference:'T505759112493846', amount:50000};
  const similarReference = {...records[0], id:'similar', reference:'T505759112493846-2'};
  const source = [...records, internalTest, similarReference];
  const exported = filterPaymentRecords(source);
  assert.deepEqual(exported.map(r => r.id), ['1','2','3','4','similar']);
  assert.deepEqual(paymentTotals(exported), {students:3, payments:5, received:400.40});
  assert.equal(source.length, 6);
  assert.equal(source.find(r => r.id === 'test'), internalTest);
  assert.equal(filterPaymentRecords([internalTest], internalTest.reference, 'tuition_fee').length, 0);
  assert.deepEqual(paymentTotals(filterPaymentRecords([internalTest])), {students:0, payments:0, received:0});
});

test('excludes the second test payment without excluding other payments from the same student', () => {
  const internalTest = {...records[0], id:'second-test', studentId:'onwuka', fullName:'Onwuka Victor Hillary', reference:'T134032134653374', paymentType:'form_fee', amount:10000, paymentDate:'2026-07-24T09:41:41Z'};
  const otherPayment = {...internalTest, id:'other', reference:'T134032134653374-2'};
  const exported = filterPaymentRecords([internalTest, otherPayment]);
  assert.deepEqual(exported, [otherPayment]);
  assert.deepEqual(paymentTotals(exported), {students:1, payments:1, received:10000});
  assert.equal(filterPaymentRecords([internalTest], 'Onwuka', 'form_fee').length, 0);
  assert.equal(filterPaymentRecords([internalTest], internalTest.reference).length, 0);
  const bothExcluded = filterPaymentRecords([internalTest, {...internalTest, id:'first-test', reference:'T505759112493846'}]);
  assert.deepEqual(paymentTotals(bothExcluded), {students:0, payments:0, received:0});
});

test('excludes the confirmed Nigeria-time second, including fractional seconds, but preserves adjacent payments', () => {
  const dates = ['2026-07-24T09:25:52.999Z', '2026-07-24T09:25:53Z', '2026-07-24T10:25:53.999+01:00', '2026-07-24T09:25:54Z', '2026-07-25T09:25:53Z'];
  const source = dates.map((paymentDate, i) => ({...records[0], id:String(i), studentId:String(i), reference:'TIMESTAMP'+i, amount:10000, paymentDate}));
  const exported = filterPaymentRecords(source);
  assert.deepEqual(exported.map(r => r.id), ['0','3','4']);
  assert.deepEqual(paymentTotals(exported), {students:3, payments:3, received:30000});
  assert.equal(source.length, 5);
  assert.equal(filterPaymentRecords([source[1]], source[1].reference, 'tuition_fee').length, 0);
  assert.deepEqual(paymentTotals(filterPaymentRecords([source[1], source[2]])), {students:0, payments:0, received:0});
});
