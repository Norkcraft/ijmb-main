'use client';

import { useState } from 'react';
import { usePaystackPayment } from 'react-paystack';
import { CreditCard, Lock, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabaseClient';

interface PaymentButtonProps {
  email: string;
  amount: number;
  onSuccess: (args: { reference: string; paymentType: string; amount: number }) => void | Promise<void>;
  userId: string;
  applicationId?: string;
  paymentType: string;
  disabled?: boolean;
  label?: string;
  variant?: 'default' | 'outline';
}

const PaymentButton = ({ email, amount, onSuccess, userId, applicationId, paymentType, disabled, label, variant = 'default' }: PaymentButtonProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const isTestMode = process.env.NEXT_PUBLIC_PAYMENT_MODE === 'test';
  const publicKey = isTestMode
    ? (process.env.NEXT_PUBLIC_PAYSTACK_TEST_PUBLIC_KEY || '')
    : (process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '');

  const config = {
    email,
    amount: amount * 100, // Paystack expects kobo
    publicKey,
    metadata: {
      user_id: userId,
      application_id: applicationId,
      payment_type: paymentType,
      custom_fields: [
        { display_name: 'Payment Type', variable_name: 'payment_type', value: paymentType },
        { display_name: 'Application ID', variable_name: 'application_id', value: applicationId ?? '' },
      ],
    },
  };

  const initializePayment = usePaystackPayment(config);

  const handlePayment = () => {
    if (disabled || loading) return;

    initializePayment({
      onSuccess: async (reference: any) => {
        setLoading(true);
        try {
          if (reference.status && reference.status !== 'success') {
            toast({ title: 'Payment Failed', description: 'Transaction was not successful.', variant: 'destructive' });
            return;
          }

          // Guard 1: check this reference hasn't already been recorded
          const { data: existing } = await supabase
            .from('payments')
            .select('id')
            .eq('reference', reference.reference)
            .maybeSingle();

          if (existing) {
            // Already saved — just trigger the success callback so the UI updates
            toast({ title: 'Payment already recorded', description: `Reference: ${reference.reference}` });
            await onSuccess({ reference: reference.reference, paymentType, amount });
            return;
          }

          // Guard 2: check the fee isn't already marked as paid on the application
          if (applicationId) {
            const { data: app } = await supabase
              .from('applications')
              .select('form_fee_paid, tuition_payment_status, hostel_fee_paid')
              .eq('id', applicationId)
              .maybeSingle();

            const alreadyPaid =
              (paymentType === 'form_fee' && app?.form_fee_paid) ||
              (paymentType === 'tuition_fee' && app?.tuition_payment_status === 'fully_paid') ||
              (paymentType === 'hostel_fee' && app?.hostel_fee_paid);

            if (alreadyPaid) {
              toast({ title: 'Already paid', description: 'This fee has already been recorded on your account.' });
              await onSuccess({ reference: reference.reference, paymentType, amount });
              return;
            }
          }

          const { error } = await supabase.from('payments').insert({
            user_id: userId,
            application_id: applicationId,
            amount: amount,
            reference: reference.reference,
            type: paymentType,
            status: 'success',
            metadata: { ...reference, payment_type: paymentType },
          });

          if (error) {
            console.error('Payment DB Insert Error:', error);
            toast({
              title: 'Payment recorded on Paystack but not saved locally',
              description: `Contact support with reference: ${reference.reference}`,
              variant: 'destructive',
            });
          } else {
            toast({ title: 'Payment Successful!', description: `Reference: ${reference.reference}` });
          }

          await onSuccess({ reference: reference.reference, paymentType, amount });
        } catch (err: any) {
          console.error('Payment recording error:', err);
          toast({
            title: 'Payment may have succeeded',
            description: `Contact support if charged. Ref: ${reference?.reference ?? 'unknown'}`,
            variant: 'destructive',
          });
          if (reference?.reference) {
            await onSuccess({ reference: reference.reference, paymentType, amount });
          }
        } finally {
          setLoading(false);
        }
      },
      onClose: () => {
        toast({ title: 'Payment Cancelled', description: 'You closed the payment window.', variant: 'destructive' });
      },
    });
  };

  if (!publicKey) {
    return (
      <div className="text-red-600 text-sm p-3 border border-red-300 rounded-lg bg-red-50">
        Paystack key not configured — contact support.
      </div>
    );
  }

  if (isTestMode && !process.env.NEXT_PUBLIC_PAYSTACK_TEST_PUBLIC_KEY) {
    return (
      <div className="text-amber-700 text-sm p-3 border border-amber-300 rounded-lg bg-amber-50">
        Test mode is on but no test key is set. Add <code>NEXT_PUBLIC_PAYSTACK_TEST_PUBLIC_KEY</code> to your environment.
      </div>
    );
  }

  const isOutline = variant === 'outline';

  return (
    <button
      type="button"
      onClick={handlePayment}
      disabled={disabled || loading}
      className={[
        'relative w-full flex items-center justify-center gap-2 rounded-lg px-5 py-3 font-semibold text-base transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2',
        isOutline
          ? 'border-2 border-green-600 text-green-700 bg-white hover:bg-green-50 focus:ring-green-500'
          : 'bg-green-600 hover:bg-green-700 active:bg-green-800 text-white shadow-md hover:shadow-lg focus:ring-green-500',
        (disabled || loading) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
      ].join(' ')}
    >
      {loading ? (
        <Loader2 size={18} className="animate-spin" />
      ) : (
        <CreditCard size={18} />
      )}
      <span>{loading ? 'Processing...' : (label ?? `Pay ₦${amount.toLocaleString()} Now`)}</span>
      {!loading && isTestMode && <span className="ml-auto text-xs font-bold bg-yellow-400 text-yellow-900 px-1.5 py-0.5 rounded">TEST</span>}
      {!loading && !isOutline && !isTestMode && <Lock size={14} className="ml-auto opacity-70" />}
    </button>
  );
};

export default PaymentButton;
