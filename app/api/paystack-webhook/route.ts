import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { processVerifiedPayment } from '@/lib/paymentProcessing';

export async function GET() { return NextResponse.json({ message: 'Webhook endpoint active' }); }

export async function POST(request: NextRequest) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) return NextResponse.json({ message: 'Server configuration error' }, { status: 500 });
  const body = await request.text();
  const expected = crypto.createHmac('sha512', secret).update(body).digest('hex');
  const signature = request.headers.get('x-paystack-signature') || '';
  let valid = false;
  try { valid = crypto.timingSafeEqual(Buffer.from(expected, 'hex'), Buffer.from(signature, 'hex')); } catch {}
  if (!valid) return NextResponse.json({ message: 'Invalid signature' }, { status: 401 });
  try {
    const event = JSON.parse(body);
    if (event.event !== 'charge.success') return NextResponse.json({ message: 'Event ignored' });
    const result = await processVerifiedPayment(event.data);
    return NextResponse.json({ message: 'Payment synchronized', reference: result.reference });
  } catch (error: any) {
    console.error('[paystack-webhook] Processing failed:', error);
    return NextResponse.json({ message: error?.message || 'Payment processing failed' }, { status: 500 });
  }
}
