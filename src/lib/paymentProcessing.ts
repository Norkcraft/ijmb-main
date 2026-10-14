import { paymentConfirmationEmail } from '@/lib/emailTemplates';
import { sendEmail } from '@/lib/resendClient';
import { supabaseServer } from '@/lib/supabaseServer';

export type PaymentType = 'form_fee' | 'acceptance_fee' | 'tuition_fee' | 'hostel_fee' | 'exam_fee';
const aliases: Record<string, PaymentType> = {
  form: 'form_fee', form_fee: 'form_fee', registration_fee: 'form_fee',
  acceptance: 'acceptance_fee', acceptance_fee: 'acceptance_fee',
  tuition: 'tuition_fee', tuition_fee: 'tuition_fee',
  hostel: 'hostel_fee', hostel_fee: 'hostel_fee', exam: 'exam_fee', exam_fee: 'exam_fee',
};
const legacyType: Record<PaymentType, string> = {
  form_fee: 'form_fee', acceptance_fee: 'acceptance', tuition_fee: 'tuition',
  hostel_fee: 'hostel', exam_fee: 'exam_fee',
};

export interface VerifiedPaystackTransaction {
  reference: string; status: string; amount: number;
  paid_at?: string | null; channel?: string | null;
  customer?: { email?: string | null } | null;
  metadata?: Record<string, any> | null;
}
export interface ProcessingHints {
  userId?: string | null; applicationId?: string | null;
  paymentType?: string | null; sendNotifications?: boolean;
}

export function normalizePaymentType(value: unknown): PaymentType | null {
  return typeof value === 'string' ? aliases[value.trim().toLowerCase()] || null : null;
}

function metadataField(metadata: Record<string, any>, name: string) {
  const direct = metadata?.[name];
  if (typeof direct === 'string' && direct.trim()) return direct.trim();
  const fields = Array.isArray(metadata?.custom_fields) ? metadata.custom_fields : [];
  const custom = fields.find((field: any) => field?.variable_name === name)?.value;
  return typeof custom === 'string' && custom.trim() ? custom.trim() : undefined;
}

async function syncApplication(app: any, type: PaymentType, amount: number) {
  const updates: Record<string, any> = { updated_at: new Date().toISOString() };
  if (type === 'form_fee') {
    updates.form_fee_paid = true;
    if (['draft', 'payment_pending', 'paid_details_pending'].includes(app.status)) {
      updates.status = app.surname ? 'submitted' : 'paid_details_pending';
    }
  } else if (type === 'acceptance_fee' && app.status === 'admitted') {
    updates.status = 'fees_pending';
  } else if (type === 'tuition_fee') {
    updates.tuition_payment_status = 'fully_paid'; updates.tuition_amount_paid = amount;
    if (app.status !== 'active') updates.status = 'active';
  } else if (type === 'hostel_fee') updates.hostel_fee_paid = true;
  else if (type === 'exam_fee') updates.exam_fee_paid = true;
  const { error } = await supabaseServer.from('applications').update(updates).eq('id', app.id);
  if (error) throw new Error(`Application synchronization failed: ${error.message}`);
}

async function notifyStudent(userId: string, type: PaymentType, amount: number, reference: string) {
  const [{ data: profile }, { data: authUser }] = await Promise.all([
    supabaseServer.from('profiles').select('full_name, email').eq('id', userId).maybeSingle(),
    supabaseServer.auth.admin.getUserById(userId),
  ]);
  const email = profile?.email || authUser?.user?.email;
  if (!email) return { sent: false, reason: 'missing_email' };
  const message = paymentConfirmationEmail(profile?.full_name || 'Student', amount, reference, type);
  const result = await sendEmail({
    to: email, subject: message.subject, html: message.html,
    emailType: `payment_confirmation:${reference}`,
    idempotencyKey: `payment-confirmation/${reference}`,
  });
  if (!result.success) throw new Error(`Payment synchronized but confirmation email failed for ${reference}`);
  return { sent: true };
}

export async function processVerifiedPayment(tx: VerifiedPaystackTransaction, hints: ProcessingHints = {}) {
  if (!tx.reference || tx.status !== 'success' || !Number.isFinite(tx.amount) || tx.amount <= 0) {
    throw new Error('Paystack transaction is not successful');
  }
  const { data: existing, error: existingError } = await supabaseServer
    .from('payments').select('*').eq('reference', tx.reference).maybeSingle();
  if (existingError) throw new Error(`Payment lookup failed: ${existingError.message}`);
  const metadata = tx.metadata || {};
  const userId = metadataField(metadata, 'user_id') || existing?.user_id || hints.userId;
  let applicationId = metadataField(metadata, 'application_id') || existing?.application_id || hints.applicationId;
  const type = normalizePaymentType(
    metadataField(metadata, 'payment_type') || metadataField(metadata, 'fee_type') ||
    existing?.metadata?.payment_type || existing?.fee_type || existing?.type || hints.paymentType,
  );
  if (!userId || !type) throw new Error(`Payment ${tx.reference} is missing student or fee metadata`);
  if (!applicationId) {
    const { data, error } = await supabaseServer.from('applications').select('id').eq('user_id', userId).maybeSingle();
    if (error) throw new Error(`Application lookup failed: ${error.message}`);
    applicationId = data?.id;
  }
  if (!applicationId) throw new Error(`No application is linked to payment ${tx.reference}`);
  const { data: app, error: appError } = await supabaseServer.from('applications').select('*').eq('id', applicationId).single();
  if (appError || !app) throw new Error(`Application lookup failed: ${appError?.message || 'not found'}`);
  if (app.user_id !== userId) throw new Error(`Payment ${tx.reference} belongs to another application`);

  const amount = tx.amount / 100;
  const mergedMetadata = {
    ...(existing?.metadata || {}), ...metadata, user_id: userId,
    application_id: applicationId, payment_type: type,
    paystack_status: tx.status, paystack_channel: tx.channel || null, paystack_paid_at: tx.paid_at || null,
  };
  const { data: payment, error: paymentError } = await supabaseServer.from('payments').upsert({
    reference: tx.reference, user_id: userId, application_id: applicationId, amount,
    type: legacyType[type], fee_type: type, status: 'success', metadata: mergedMetadata,
  }, { onConflict: 'reference' }).select('id').single();
  if (paymentError) throw new Error(`Payment persistence failed: ${paymentError.message}`);
  await syncApplication(app, type, amount);
  const notification = hints.sendNotifications === false
    ? { sent: false, reason: 'disabled' }
    : await notifyStudent(userId, type, amount, tx.reference);
  return { paymentId: payment.id, reference: tx.reference, paymentType: type, applicationId, userId, amount, notification };
}

export async function verifyPaystackTransaction(reference: string): Promise<VerifiedPaystackTransaction> {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) throw new Error('PAYSTACK_SECRET_KEY is not configured');
  const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${secret}` }, cache: 'no-store',
  });
  const payload = await response.json();
  if (!response.ok || !payload?.status || !payload?.data) {
    throw new Error(payload?.message || `Paystack verification failed (${response.status})`);
  }
  return payload.data;
}
