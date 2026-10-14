import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { processVerifiedPayment, verifyPaystackTransaction } from '@/lib/paymentProcessing';

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const auth = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
    const { data: { user }, error } = await auth.auth.getUser(token);
    if (error || !user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const { reference, applicationId, paymentType } = await request.json();
    if (!reference || typeof reference !== 'string') {
      return NextResponse.json({ message: 'Payment reference is required' }, { status: 400 });
    }
    const transaction = await verifyPaystackTransaction(reference);
    const metadataUserId = transaction.metadata?.user_id;
    if (metadataUserId && metadataUserId !== user.id) {
      return NextResponse.json({ message: 'This payment belongs to another account' }, { status: 403 });
    }
    if (!metadataUserId && transaction.customer?.email && user.email &&
        transaction.customer.email.toLowerCase() !== user.email.toLowerCase()) {
      return NextResponse.json({ message: 'This payment belongs to another account' }, { status: 403 });
    }
    const result = await processVerifiedPayment(transaction, { userId: user.id, applicationId, paymentType });
    return NextResponse.json({ message: 'Payment verified and synchronized', ...result });
  } catch (error: any) {
    console.error('[paystack-verify] Error:', error);
    return NextResponse.json({ message: error?.message || 'Unable to verify payment' }, { status: 500 });
  }
}
