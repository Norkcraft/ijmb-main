import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const ALLOWED_TYPES: Record<string, { magic: number[] | null }> = {
  'image/jpeg': { magic: [0xFF, 0xD8, 0xFF] },
  'image/png':  { magic: [0x89, 0x50, 0x4E, 0x47] },
  'application/pdf': { magic: [0x25, 0x50, 0x44, 0x46] },
};

const MAX_SIZE = 5 * 1024 * 1024; // 5MB

function checkMagicBytes(buffer: Buffer, magic: number[]): boolean {
  if (buffer.length < magic.length) return false;
  return magic.every((byte, i) => buffer[i] === byte);
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    // Verify user identity
    const anonClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data: { user } } = await anonClient.auth.getUser(token);
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    // User-scoped client for storage upload and payment insert (RLS enforced)
    const userClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    );

    // Service role client for application status updates (same as webhook)
    const adminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const paymentType = formData.get('payment_type') as string | null;
    const applicationId = formData.get('application_id') as string | null;
    const amount = formData.get('amount') as string | null;

    if (!file || !paymentType || !amount) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ message: 'File too large. Max 5MB allowed.' }, { status: 400 });
    }

    const allowedEntry = ALLOWED_TYPES[file.type];
    if (!allowedEntry) {
      return NextResponse.json({ message: 'Only JPG, PNG, and PDF files are allowed.' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (allowedEntry.magic && !checkMagicBytes(buffer, allowedEntry.magic)) {
      return NextResponse.json({ message: 'File content does not match its declared type.' }, { status: 400 });
    }

    const extMap: Record<string, string> = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'application/pdf': 'pdf',
    };
    const ext = extMap[file.type];
    const ref = `MANUAL-${Date.now()}-${user.id.slice(0, 8)}`;
    const storagePath = `payment-receipts/${user.id}/${ref}.${ext}`;

    // Upload receipt to storage
    const { error: uploadError } = await userClient.storage
      .from('student-documents')
      .upload(storagePath, buffer, { contentType: file.type, upsert: true });

    if (uploadError) {
      console.error('[upload-receipt] Storage error:', uploadError);
      return NextResponse.json({ message: 'Upload failed', error: uploadError.message }, { status: 500 });
    }

    // Record payment as immediately confirmed
    const { error: payError } = await userClient.from('payments').insert({
      user_id: user.id,
      application_id: applicationId || null,
      amount: parseFloat(amount),
      reference: ref,
      status: 'success',
      metadata: {
        payment_type: paymentType,
        receipt_path: storagePath,
        manual: true,
      },
    });

    if (payError) {
      console.error('[upload-receipt] DB error:', payError);
      return NextResponse.json({ message: 'Failed to record payment', error: payError.message }, { status: 500 });
    }

    // Update application status — mirrors what the Paystack webhook does
    if (applicationId && paymentType) {
      const updates: Record<string, any> = { updated_at: new Date().toISOString() };

      if (paymentType === 'form_fee') {
        updates.form_fee_paid = true;
        updates.status = 'submitted';
      } else if (paymentType === 'acceptance_fee') {
        updates.status = 'fees_pending';
      } else if (paymentType === 'tuition_fee') {
        updates.tuition_payment_status = 'fully_paid';
        updates.tuition_amount_paid = parseFloat(amount);
        updates.status = 'active';
      } else if (paymentType === 'hostel_fee') {
        updates.hostel_fee_paid = true;
      }

      await adminClient.from('applications').update(updates).eq('id', applicationId);
    }

    return NextResponse.json({ message: 'Payment confirmed', reference: ref });
  } catch (err: any) {
    console.error('[upload-receipt] Unhandled error:', err);
    return NextResponse.json({ message: err?.message || 'Internal server error' }, { status: 500 });
  }
}
