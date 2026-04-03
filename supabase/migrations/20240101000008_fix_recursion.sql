-- DROP existing problematic policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;

-- Create a simplified policy for profiles
-- 1. Users can always see their own profile
CREATE POLICY "Users can view own profile" ON public.profiles 
FOR SELECT TO authenticated 
USING (auth.uid() = id);

-- 2. Admins can view all profiles WITHOUT recursion
-- Instead of checking the profiles table (which causes recursion), 
-- we check the auth.users metadata or use a security definer function if needed.
-- But the simplest fix for recursion is to avoid querying the table being protected in the policy itself if possible.

-- HOWEVER, since 'role' is stored IN the profiles table, checking "role = 'admin'" inside a policy on "profiles" is what causes the recursion 
-- when we try to select * from profiles.

-- FIX: Use a SECURITY DEFINER function to check admin status safely.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  -- This query runs as the superuser, bypassing RLS
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Now use this function in the policy. 
-- Note: To prevent recursion inside the function, we might need to bypass RLS or ensure the function has access.
-- SECURITY DEFINER functions run with the privileges of the creator (postgres/admin), bypassing RLS on the table.

CREATE POLICY "Admins can view all profiles" ON public.profiles 
FOR SELECT TO authenticated 
USING (public.is_admin());

-- Also fix other admin policies to use this function for better performance/safety
DROP POLICY IF EXISTS "Admins can insert centres" ON public.centres;
CREATE POLICY "Admins can insert centres" ON public.centres FOR INSERT TO authenticated WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can update centres" ON public.centres;
CREATE POLICY "Admins can update centres" ON public.centres FOR UPDATE TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete centres" ON public.centres;
CREATE POLICY "Admins can delete centres" ON public.centres FOR DELETE TO authenticated USING (public.is_admin());
