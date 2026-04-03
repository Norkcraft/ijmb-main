-- Add tuition and hostel columns to applications table

ALTER TABLE public.applications 
ADD COLUMN IF NOT EXISTS hostel_needed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS tuition_payment_status TEXT DEFAULT 'pending' CHECK (tuition_payment_status IN ('pending', 'part_paid', 'fully_paid')),
ADD COLUMN IF NOT EXISTS tuition_amount_paid DECIMAL(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS installments_allowed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS hostel_fee_paid BOOLEAN DEFAULT false;

-- Create function to update tuition status based on payments
CREATE OR REPLACE FUNCTION update_tuition_status()
RETURNS TRIGGER AS $$
DECLARE
  total_paid DECIMAL;
  tuition_fee DECIMAL := 150000; -- Default fee, ideally should be fetched from fees table
  app_installments BOOLEAN;
BEGIN
  -- Get current total paid for tuition
  SELECT COALESCE(SUM(amount), 0) INTO total_paid
  FROM public.payments
  WHERE application_id = NEW.application_id 
  AND status = 'success'
  AND metadata->>'fee_type' = 'tuition_fee';

  -- Get application settings
  SELECT installments_allowed INTO app_installments
  FROM public.applications
  WHERE id = NEW.application_id;

  -- Update application record
  UPDATE public.applications
  SET 
    tuition_amount_paid = total_paid,
    tuition_payment_status = CASE 
      WHEN total_paid >= tuition_fee THEN 'fully_paid'
      WHEN total_paid > 0 THEN 'part_paid'
      ELSE 'pending'
    END
  WHERE id = NEW.application_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for payment updates (if we were tracking individual payments strictly for status)
-- For now, we handle this in the application logic or manual updates, 
-- but having the columns is the first step.
