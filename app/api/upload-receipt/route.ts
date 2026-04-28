import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendEmail } from '@/lib/resendClient';

const ALLOWED_TYPES: Record<string, { magic: number[] | null }> = {
  'image/jpeg': { magic: [0xFF, 0xD8, 0xFF] },
  'image/png':  { magic: [0x89, 0x50, 0x4E, 0x47] },
  'application/pdf': { magic: [0x25, 0x50, 0x44, 0x46] },
};

const MAX_SIZE = 5 * 1024 * 1024; // 5MB

const FEE_LABELS: Record<string, string> = {
  form_fee: 'Registration Form Fee',
  acceptance_fee: 'Acceptance Fee',
  tuition_fee: 'Tuition Fee',
  hostel_fee: 'Hostel Fee',
};

function checkMagicBytes(buffer: Buffer, magic: number[]): boolean {
  if (buffer.length < magic.length) return false;
  return magic.every((byte, i) => buffer[i] === byte);
}

function esc(str: string | undefined | null): string {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
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

    // Service role client for application status updates and profile fetch
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
    const storagePath = `${user.id}/payment-receipts/${ref}.${ext}`;

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

    // Fetch student profile for the notification email (fire-and-forget)
    adminClient
      .from('profiles')
      .select('full_name, phone, email')
      .eq('id', user.id)
      .single()
      .then(({ data: profile }) => {
        const name = profile?.full_name || 'Unknown';
        const phone = profile?.phone || 'N/A';
        const email = profile?.email || user.email || 'N/A';
        const feeLabel = FEE_LABELS[paymentType!] || paymentType!;
        const amountFormatted = `₦${parseFloat(amount!).toLocaleString()}`;
        const receiptUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/student-documents/${storagePath}`;
        const paidAt = new Date().toLocaleString('en-NG', { timeZone: 'Africa/Lagos', dateStyle: 'full', timeStyle: 'short' });

        const html = `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden">
            <div style="background:#006400;padding:24px 32px">
              <img src="https://www.ijmb.info/ijmb-logo.jpeg" alt="IJMB" style="height:56px;border-radius:8px;display:block;margin:0 auto 10px"/>
              <p style="color:#fff;text-align:center;margin:0;font-size:18px;font-weight:bold">New Payment Receipt Received</p>
            </div>

            <div style="padding:28px 32px;background:#fff">
              <p style="color:#475569;margin:0 0 20px">A student has uploaded a bank transfer receipt. Details below:</p>

              <table style="width:100%;border-collapse:collapse;font-size:14px">
                <tr style="border-bottom:1px solid #f1f5f9">
                  <td style="padding:10px 8px;color:#64748b;width:40%">Student Name</td>
                  <td style="padding:10px 8px;font-weight:600;color:#1e293b">${esc(name)}</td>
                </tr>
                <tr style="border-bottom:1px solid #f1f5f9">
                  <td style="padding:10px 8px;color:#64748b">Email</td>
                  <td style="padding:10px 8px;font-weight:600;color:#1e293b">${esc(email)}</td>
                </tr>
                <tr style="border-bottom:1px solid #f1f5f9">
                  <td style="padding:10px 8px;color:#64748b">Phone</td>
                  <td style="padding:10px 8px;font-weight:600;color:#1e293b">${esc(phone)}</td>
                </tr>
                <tr style="border-bottom:1px solid #f1f5f9">
                  <td style="padding:10px 8px;color:#64748b">Fee Type</td>
                  <td style="padding:10px 8px;font-weight:600;color:#1e293b">${esc(feeLabel)}</td>
                </tr>
                <tr style="border-bottom:1px solid #f1f5f9">
                  <td style="padding:10px 8px;color:#64748b">Amount</td>
                  <td style="padding:10px 8px;font-weight:600;color:#006400;font-size:16px">${esc(amountFormatted)}</td>
                </tr>
                <tr style="border-bottom:1px solid #f1f5f9">
                  <td style="padding:10px 8px;color:#64748b">Reference</td>
                  <td style="padding:10px 8px;font-family:monospace;color:#1e293b">${esc(ref)}</td>
                </tr>
                <tr>
                  <td style="padding:10px 8px;color:#64748b">Submitted At</td>
                  <td style="padding:10px 8px;color:#1e293b">${esc(paidAt)}</td>
                </tr>
              </table>

              <div style="margin-top:24px;text-align:center">
                <a href="${receiptUrl}" style="display:inline-block;background:#006400;color:#fff;padding:12px 28px;border-radius:6px;text-decoration:none;font-weight:bold;font-size:14px">
                  View Payment Receipt
                </a>
              </div>

              <p style="color:#94a3b8;font-size:12px;margin-top:24px;text-align:center">
                This payment has been automatically confirmed in the portal.<br/>
                Log in to the admin dashboard to review.
              </p>
            </div>
          </div>
        `;

        sendEmail({
          to: 'support@ijmb.info',
          subject: `New Payment Receipt — ${feeLabel} (${amountFormatted}) from ${name}`,
          html,
        }).catch(err => console.error('[upload-receipt] Email error:', err));
      })
      .catch(err => console.error('[upload-receipt] Profile fetch error:', err));

    return NextResponse.json({ message: 'Payment confirmed', reference: ref });
  } catch (err: any) {
    console.error('[upload-receipt] Unhandled error:', err);
    return NextResponse.json({ message: err?.message || 'Internal server error' }, { status: 500 });
  }
}
