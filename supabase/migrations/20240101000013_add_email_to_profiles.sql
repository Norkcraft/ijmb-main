-- Add email to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;

-- Update handle_new_user function to include email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone, email)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'phone', new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Backfill email (this might fail if RLS prevents it, but as admin/postgres it should work)
-- We can't easily backfill from auth.users via SQL in migration unless we have permissions.
-- Usually migrations run as postgres/superuser so it might work.
-- UPDATE public.profiles p SET email = u.email FROM auth.users u WHERE p.id = u.id;
