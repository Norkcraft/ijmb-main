# Payment records export

The Payments tab includes a separate Export Payment Records button. Exports fetch a fresh, atomic database snapshot; they never reuse the dashboard's loaded rows.

## Database setup

Apply `supabase/migrations/20260921000000_payment_records_export.sql` and the follow-up `supabase/migrations/20260926000000_add_intended_center_to_payment_export.sql` through the project's normal Supabase migration process before releasing the UI. The function is security-invoker, enforces the dashboard's super_admin/coordinator roles, and retains existing row-level security. No service key is exposed to the browser.

## Report rules

- Today, This Week (Monday onward), This Month, Custom Date Range, and All Records use Africa/Lagos time.
- Custom end dates include the entire day. Future transactions are excluded at snapshot time.
- Internal test references `T505759112493846` and `T134032134653374` are omitted from all exported rows and report totals. Both remain in the dashboard.
- Payments displayed as 24 July 2026, 10:25:53 AM in Africa/Lagos are also excluded from export rows and totals, including fractional seconds within that second. Adjacent seconds and other dates remain eligible. No dashboard records are removed.
- Payments are grouped by student, with the newest student's history first and each student's newest transaction first. Every included payment remains a separate transaction entry with its date, status, amount, type, and reference.
- Each student summary shows the intended centre selected at registration, course, admission status, payment count, and total successful amount paid. Pending and failed transactions remain in the history but are excluded from that student's paid total.
- Total received includes only successful payments, in NGN. Pending and failed amounts remain visible but are not added to receipts.
- Application statuses admitted/fees_pending/active map to Admitted; rejected maps to Not Admitted; other existing statuses map to Pending Admission. Missing linked application data is Not available.
- Payment date is payments.created_at, matching the dashboard. Current search and payment-type filters can optionally be applied within the chosen date range.
- The portrait layout uses one readable student section at a time. Continued histories repeat the student's name and transaction headings; footers show Page X of Y.

## Verification

Run `npx tsx --test scripts/payment-records.test.ts`, `npx tsc --noEmit`, and `npm run build`.

Use synthetic records to check a multiple-page report, long names/courses, no matches, failed retrieval, and custom date boundaries. Compare counts and totals to the exact selection, and change a student's admission status before generating a second report to confirm fresh data.
