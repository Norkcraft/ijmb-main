-- Add type column to payments table (mirrors what PaymentButton and upload-receipt already use)
ALTER TABLE public.payments
ADD COLUMN IF NOT EXISTS type TEXT;
