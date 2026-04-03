-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- USERS table is handled by Supabase Auth, we use public.profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  phone TEXT,
  role TEXT DEFAULT 'student' CHECK (role IN ('student', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- SESSIONS (Academic Sessions)
CREATE TABLE IF NOT EXISTS public.sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL, -- e.g., "2024/2025"
  code TEXT NOT NULL UNIQUE, -- e.g., "2024"
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'closed')),
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CENTRES
CREATE TABLE IF NOT EXISTS public.centres (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  state TEXT NOT NULL,
  contact_phone TEXT,
  price DECIMAL(10, 2) DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- SUBJECTS
CREATE TABLE IF NOT EXISTS public.subjects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  code TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- SUBJECT COMBINATIONS
CREATE TABLE IF NOT EXISTS public.subject_combinations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL, -- e.g., "Physics, Chemistry, Mathematics"
  track TEXT NOT NULL CHECK (track IN ('Science', 'Social Science', 'Arts')),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- APPLICATIONS
CREATE TABLE IF NOT EXISTS public.applications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  session_id UUID REFERENCES public.sessions(id),
  preferred_centre_id UUID REFERENCES public.centres(id),
  assigned_centre_id UUID REFERENCES public.centres(id),
  subject_combination_id UUID REFERENCES public.subject_combinations(id),
  
  -- Personal Info
  gender TEXT,
  date_of_birth DATE,
  state_of_origin TEXT,
  residential_address TEXT,
  
  -- Guardian Details
  guardian_name TEXT,
  guardian_phone TEXT,
  guardian_occupation TEXT,
  
  -- Academic Info
  olevel_exam_type TEXT, -- WAEC, NECO, NABTEB
  olevel_exam_year TEXT,
  olevel_exam_number TEXT,
  
  -- Documents (paths in storage)
  passport_path TEXT,
  olevel_path TEXT,
  admission_letter_path TEXT,
  
  -- Status
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'admitted', 'rejected')),
  admission_granted BOOLEAN DEFAULT false,
  form_fee_paid BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- PAYMENTS
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  application_id UUID REFERENCES public.applications(id) ON DELETE SET NULL,
  amount DECIMAL(10, 2) NOT NULL,
  reference TEXT NOT NULL UNIQUE, -- Paystack reference
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed')),
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS POLICIES (Row Level Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Policies for applications
CREATE POLICY "Users can view own application" ON public.applications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own application" ON public.applications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own application" ON public.applications FOR UPDATE USING (auth.uid() = user_id);

-- Admin policies (assuming admin has a specific role or checking auth.jwt() -> role)
-- For simplicity in this setup, we'll allow reading all for now if authenticated, 
-- but ideally should check role. Let's add a basic admin check function later.
-- For now, open read for authenticated users on public data (centres, subjects, sessions)
ALTER TABLE public.centres ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read centres" ON public.centres FOR SELECT TO authenticated USING (true);

ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read sessions" ON public.sessions FOR SELECT TO authenticated USING (true);

ALTER TABLE public.subject_combinations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read combos" ON public.subject_combinations FOR SELECT TO authenticated USING (true);

-- Functions
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'phone');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
