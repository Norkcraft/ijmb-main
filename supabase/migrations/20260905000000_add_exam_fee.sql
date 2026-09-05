-- Add exam_fee_paid column to applications table
ALTER TABLE public.applications
  ADD COLUMN IF NOT EXISTS exam_fee_paid BOOLEAN NOT NULL DEFAULT false;

-- Insert exam_fee into fees table (if not already present)
INSERT INTO public.fees (name, amount, description)
VALUES ('exam_fee', 50000, 'Examination fee')
ON CONFLICT (name) DO NOTHING;
