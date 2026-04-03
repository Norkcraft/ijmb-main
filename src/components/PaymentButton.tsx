import { PaystackButton } from 'react-paystack';
import { Button } from '@/components/ui/button';
import { CreditCard, Loader2 } from 'lucide-react';
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
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

const PaymentButton = ({ email, amount, onSuccess, userId, applicationId, paymentType, disabled, label, variant }: PaymentButtonProps) => {
  const { toast } = useToast();
  
  // Replace with your actual Paystack public key from environment variable
  const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';

  const componentProps = {
    email,
    amount: amount * 100, // Paystack expects amount in kobo
    publicKey,
    metadata: {
      user_id: userId,
      application_id: applicationId,
      payment_type: paymentType,
      custom_fields: [
        { display_name: "Payment Type", variable_name: "payment_type", value: paymentType },
        { display_name: "Application ID", variable_name: "application_id", value: applicationId }
      ]
    },
    text: label || `Pay ₦${amount.toLocaleString()}`,
    onSuccess: async (reference: any) => {
      try {
        // Only verify 'success' status if it's explicitly returned, otherwise assume success for callback
        if (reference.status && reference.status !== 'success') {
             toast({ title: "Payment Failed", description: "Transaction was not successful.", variant: "destructive" });
             return;
        }

        // Record payment in database
        const { error } = await supabase.from('payments').insert({
          user_id: userId,
          application_id: applicationId,
          amount: amount,
          reference: reference.reference,
          status: 'success', 
          metadata: { ...reference, payment_type: paymentType }
        });

        if (error) {
           console.error('Payment DB Insert Error:', error);
           // Even if logging fails, we might want to proceed if the payment was actually successful on Paystack
        }

        toast({
          title: "Payment Successful",
          description: `Reference: ${reference.reference}`,
        });
        
        // Trigger the parent success callback to update UI state immediately
        await onSuccess({ reference: reference.reference, paymentType, amount });
        
      } catch (error: any) {
        console.error('Payment recording error:', error);
        // Fallback: still try to update UI if we have a reference
        if (reference?.reference) {
            await onSuccess({ reference: reference.reference, paymentType, amount });
        }
      }
    },
    onClose: () => {
      toast({
        title: "Payment Cancelled",
        description: "You closed the payment window.",
        variant: "destructive"
      });
    },
  };

  if (!publicKey || publicKey.includes('xxxx')) {
    return (
      <div className="text-red-500 text-sm p-2 border border-red-200 rounded bg-red-50 mb-2">
        Error: Paystack Public Key not configured in .env
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* @ts-ignore - React-Paystack types might be slightly off */}
      <PaystackButton {...componentProps} className="w-full">
        <Button 
          className={`w-full ${!variant ? 'cta-gradient' : ''}`} 
          disabled={disabled}
          variant={variant || "default"}
        >
          <CreditCard size={16} className="mr-2" /> {label || `Pay ₦${amount.toLocaleString()} Now`}
        </Button>
      </PaystackButton>
    </div>
  );
};

export default PaymentButton;
