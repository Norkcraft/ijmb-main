import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const secret = authHeader?.replace('Bearer ', '');
    if (secret !== process.env.INTERNAL_API_SECRET) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { paymentId } = await request.json();
    if (!paymentId) return NextResponse.json({ message: 'Missing paymentId' }, { status: 400 });

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: payment, error: fetchError } = await supabase
      .from('payments')
      .select('*')
      .eq('id', paymentId)
      .single();

    if (fetchError || !payment) {
      return NextResponse.json({ message: 'Payment not found' }, { status: 404 });
    }

    await supabase.from('payments').update({ status: 'success' }).eq('id', paymentId);

    const paymentType = payment.metadata?.payment_type;
    const appId = payment.application_id;

    if (appId && paymentType) {
      const updates: Record<string, any> = { updated_at: new Date().toISOString() };

      if (paymentType === 'form_fee') {
        updates.form_fee_paid = true;
        updates.status = 'submitted';
      } else if (paymentType === 'acceptance_fee') {
        updates.status = 'fees_pending';
      } else if (paymentType === 'tuition_fee') {
        updates.tuition_payment_status = 'fully_paid';
        updates.tuition_amount_paid = payment.amount;
        updates.status = 'active';
      } else if (paymentType === 'hostel_fee') {
        updates.hostel_fee_paid = true;
      }

      await supabase.from('applications').update(updates).eq('id', appId);
    }

    return NextResponse.json({ message: 'Payment confirmed' });
  } catch (err: any) {
    console.error('[confirm-payment] Error:', err);
    return NextResponse.json({ message: err?.message || 'Internal server error' }, { status: 500 });
  }
}
