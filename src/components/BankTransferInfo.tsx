'use client';

import { useRef, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Upload, CheckCircle, Loader2, Copy, Building2 } from 'lucide-react';

interface BankTransferInfoProps {
  amount: number;
  paymentType: string;
  applicationId?: string;
  userId: string;
  disabled?: boolean;
  onSuccess?: () => void;
}

const FEE_LABELS: Record<string, string> = {
  form_fee: 'Registration Form Fee',
  acceptance_fee: 'Acceptance Fee',
  tuition_fee: 'Tuition Fee',
  hostel_fee: 'Hostel Fee',
};

export default function BankTransferInfo({
  amount,
  paymentType,
  applicationId,
  userId,
  disabled,
  onSuccess,
}: BankTransferInfoProps) {
  const { session } = useAuth();
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({ title: `${label} copied!` });
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const token = session?.access_token;
      if (!token) {
        toast({ title: 'Session expired', description: 'Please log in again.', variant: 'destructive' });
        return;
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('payment_type', paymentType);
      formData.append('amount', String(amount));
      if (applicationId) formData.append('application_id', applicationId);

      const res = await fetch('/api/upload-receipt', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const result = await res.json();
      if (!res.ok) {
        toast({ title: 'Upload failed', description: result.message || result.error || 'Unknown error', variant: 'destructive' });
        return;
      }

      setUploaded(true);
      toast({
        title: 'Payment confirmed!',
        description: 'Your receipt has been uploaded and your payment has been confirmed.',
      });
      onSuccess?.();
    } catch (err: any) {
      toast({ title: 'Upload failed', description: err.message, variant: 'destructive' });
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  if (uploaded) {
    return (
      <div className="flex items-center justify-center gap-2 text-sm font-semibold text-green-700 bg-green-100 border border-green-300 px-4 py-3 rounded-lg w-full">
        <CheckCircle size={18} /> Payment Confirmed
      </div>
    );
  }

  return (
    <div className="w-full space-y-3">
      {/* Bank details card */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 space-y-3">
        <div className="flex items-center gap-2 text-blue-800 font-semibold text-sm mb-1">
          <Building2 size={16} />
          Bank Transfer Details — {FEE_LABELS[paymentType] || paymentType}
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Bank</span>
            <span className="font-medium">First Bank of Nigeria</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Account Name</span>
            <span className="font-medium text-right text-xs leading-tight max-w-[60%]">
              Ernest and Monica Ezeilo Education Foundation (EMEEF)
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Account Number</span>
            <div className="flex items-center gap-1">
              <span className="font-bold font-mono tracking-wider">2035584700</span>
              <button
                type="button"
                onClick={() => copyToClipboard('2035584700', 'Account number')}
                className="text-blue-600 hover:text-blue-800 p-0.5 rounded"
                title="Copy account number"
              >
                <Copy size={13} />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-blue-200 pt-2 mt-1">
            <span className="text-muted-foreground">Amount to Transfer</span>
            <span className="font-bold text-base text-blue-800">₦{amount.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Upload receipt */}
      <div className="text-xs text-muted-foreground text-center">
        After making the transfer, upload your bank receipt below.
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,application/pdf"
        className="hidden"
        onChange={handleFileChange}
        disabled={disabled || uploading}
      />

      <Button
        type="button"
        className="w-full"
        variant="outline"
        disabled={disabled || uploading}
        onClick={() => fileRef.current?.click()}
      >
        {uploading ? (
          <><Loader2 size={16} className="mr-2 animate-spin" /> Uploading...</>
        ) : (
          <><Upload size={16} className="mr-2" /> Upload Payment Receipt</>
        )}
      </Button>
    </div>
  );
}
