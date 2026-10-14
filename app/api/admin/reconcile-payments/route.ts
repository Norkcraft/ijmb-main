import { NextRequest, NextResponse } from 'next/server';
import { processVerifiedPayment } from '@/lib/paymentProcessing';

export async function POST(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  if (!token || token !== process.env.INTERNAL_API_SECRET) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) return NextResponse.json({ message: 'Paystack is not configured' }, { status: 500 });

  try {
    const body = await request.json().catch(() => ({}));
    const pages = Math.min(Math.max(Number(body.pages) || 5, 1), 20);
    const apply = body.apply === true;
    const results = { scanned: 0, eligible: 0, repaired: 0, failed: 0, errors: [] as string[] };

    for (let page = 1; page <= pages; page += 1) {
      const response = await fetch(`https://api.paystack.co/transaction?status=success&perPage=100&page=${page}`, {
        headers: { Authorization: `Bearer ${secret}` }, cache: 'no-store',
      });
      const payload = await response.json();
      if (!response.ok || !payload?.status) throw new Error(payload?.message || 'Unable to list Paystack transactions');
      const transactions = Array.isArray(payload.data) ? payload.data : [];
      results.scanned += transactions.length;

      for (const transaction of transactions) {
        const metadata = transaction.metadata || {};
        const customFields = Array.isArray(metadata.custom_fields) ? metadata.custom_fields : [];
        const hasApplication = metadata.application_id || customFields.some((field: any) => field?.variable_name === 'application_id' && field?.value);
        const hasUser = metadata.user_id;
        if (!hasApplication && !hasUser) continue;
        results.eligible += 1;
        if (!apply) continue;
        try {
          await processVerifiedPayment(transaction, { sendNotifications: body.sendNotifications === true });
          results.repaired += 1;
        } catch (error: any) {
          results.failed += 1;
          results.errors.push(`${transaction.reference}: ${error?.message || 'unknown error'}`);
        }
      }
      if (transactions.length < 100) break;
    }
    return NextResponse.json({ mode: apply ? 'apply' : 'dry-run', ...results });
  } catch (error: any) {
    console.error('[reconcile-payments] Error:', error);
    return NextResponse.json({ message: error?.message || 'Reconciliation failed' }, { status: 500 });
  }
}
