-- Drop the constraint on applications status
ALTER TABLE public.applications DROP CONSTRAINT IF EXISTS applications_status_check;

-- Add the new constraint with all required statuses
ALTER TABLE public.applications ADD CONSTRAINT applications_status_check CHECK (status IN (
  'draft', 
  'submitted', 
  'payment_pending', 
  'payment_completed', 
  'review',
  'admitted', 
  'fees_pending',
  'active',
  'rejected'
));

-- Update existing records if necessary
UPDATE public.applications SET status = 'submitted' WHERE status = 'review';
