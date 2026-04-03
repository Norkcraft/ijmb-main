-- Add document status and feedback columns to applications table
ALTER TABLE public.applications
ADD COLUMN IF NOT EXISTS passport_status text DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS olevel_status text DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS passport_msg text,
ADD COLUMN IF NOT EXISTS olevel_msg text;

-- Restrict valid status values
ALTER TABLE public.applications
ADD CONSTRAINT valid_passport_status CHECK (passport_status IN ('pending', 'approved', 'rejected')),
ADD CONSTRAINT valid_olevel_status CHECK (olevel_status IN ('pending', 'approved', 'rejected'));
