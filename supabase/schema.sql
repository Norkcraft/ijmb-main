-- =================================================================
-- IJMB PORTAL — COMPLETE DATABASE SCHEMA v3.0
-- Run this ONCE in your Supabase SQL Editor (New Query → Paste → Run)
-- This version matches the application code exactly.
-- =================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =================================================================
-- SECTION 1: HELPER FUNCTIONS
-- =================================================================

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('super_admin', 'coordinator')
  );
END; $$;

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'super_admin'
  );
END; $$;

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$;


-- =================================================================
-- SECTION 2: CORE TABLES
-- =================================================================

-- profiles: One per user. Auto-created on signup.
CREATE TABLE IF NOT EXISTS public.profiles (
  id           UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email        TEXT        UNIQUE NOT NULL,
  full_name    TEXT,
  phone        TEXT,
  role         TEXT        NOT NULL DEFAULT 'student'
                           CHECK (role IN ('student', 'coordinator', 'super_admin')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- sessions: Academic sessions e.g. 2025/2026
CREATE TABLE IF NOT EXISTS public.sessions (
  id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT        NOT NULL,
  code        TEXT        NOT NULL,
  start_date  DATE,
  end_date    DATE,
  status      TEXT        NOT NULL DEFAULT 'open'
                          CHECK (status IN ('open', 'closed', 'upcoming')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- centres: Physical study centres
CREATE TABLE IF NOT EXISTS public.centres (
  id             UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  name           TEXT        NOT NULL,
  state          TEXT        NOT NULL,
  location       TEXT,
  contact_phone  TEXT,
  tuition_fee    NUMERIC     NOT NULL DEFAULT 0,
  hostel_fee     NUMERIC     NOT NULL DEFAULT 0,
  active         BOOLEAN     NOT NULL DEFAULT true,
  coordinator_id UUID        REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- subjects: Individual A-Level subjects
CREATE TABLE IF NOT EXISTS public.subjects (
  id         UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  name       TEXT        NOT NULL UNIQUE,
  code       TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- subject_combinations: Groups of 3 subjects
CREATE TABLE IF NOT EXISTS public.subject_combinations (
  id         UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  name       TEXT        NOT NULL,
  track      TEXT        NOT NULL DEFAULT 'Science'
                         CHECK (track IN ('Science', 'Social Science', 'Arts', 'Commercial')),
  subject1   TEXT        NOT NULL,
  subject2   TEXT        NOT NULL,
  subject3   TEXT        NOT NULL,
  active     BOOLEAN     NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- fees: Configurable fee amounts
CREATE TABLE IF NOT EXISTS public.fees (
  id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT        UNIQUE NOT NULL,
  amount      NUMERIC     NOT NULL DEFAULT 0,
  description TEXT,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- applications: Main student application (one per student)
CREATE TABLE IF NOT EXISTS public.applications (
  id                      UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id                 UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  application_number      TEXT        UNIQUE,
  status                  TEXT        NOT NULL DEFAULT 'draft'
                                      CHECK (status IN ('draft','submitted','under_review','admitted','fees_pending','active','rejected')),
  -- Personal
  surname                 TEXT,
  first_name              TEXT,
  middle_name             TEXT,
  gender                  TEXT        CHECK (gender IN ('Male','Female') OR gender IS NULL),
  date_of_birth           DATE,
  -- Origin
  state_of_origin         TEXT,
  lga                     TEXT,
  -- Contact
  phone_number            TEXT,
  residential_address     TEXT,
  -- Guardian
  guardian_name           TEXT,
  guardian_phone          TEXT,
  guardian_occupation     TEXT,
  -- Programme
  session_id              UUID        REFERENCES public.sessions(id) ON DELETE SET NULL,
  preferred_centre_id     UUID        REFERENCES public.centres(id) ON DELETE SET NULL,
  assigned_centre_id      UUID        REFERENCES public.centres(id) ON DELETE SET NULL,
  subject_combination_id  UUID        REFERENCES public.subject_combinations(id) ON DELETE SET NULL,
  intended_course         TEXT,
  -- O-Level exam
  olevel_exam_type        TEXT,
  olevel_exam_year        TEXT,
  olevel_exam_number      TEXT,
  -- Documents (Supabase Storage paths)
  passport_path           TEXT,
  olevel_path             TEXT,
  admission_letter_path   TEXT,
  -- Document review
  passport_status         TEXT        NOT NULL DEFAULT 'pending'
                                      CHECK (passport_status IN ('pending','approved','rejected')),
  olevel_status           TEXT        NOT NULL DEFAULT 'pending'
                                      CHECK (olevel_status IN ('pending','approved','rejected','awaiting')),
  passport_msg            TEXT,
  olevel_msg              TEXT,
  -- Payments
  form_fee_paid           BOOLEAN     NOT NULL DEFAULT false,
  tuition_payment_status  TEXT        NOT NULL DEFAULT 'unpaid'
                                      CHECK (tuition_payment_status IN ('unpaid','part_paid','fully_paid')),
  tuition_amount_paid     NUMERIC     NOT NULL DEFAULT 0,
  hostel_needed           BOOLEAN     NOT NULL DEFAULT false,
  hostel_fee_paid         BOOLEAN     NOT NULL DEFAULT false,
  -- Admin
  admin_notes             TEXT,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- olevel_results: Individual subject grades
CREATE TABLE IF NOT EXISTS public.olevel_results (
  id              UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id  UUID        NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  subject         TEXT        NOT NULL,
  exam_type       TEXT,
  exam_year       TEXT,
  grade           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- payments: All payment transactions
CREATE TABLE IF NOT EXISTS public.payments (
  id              UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  application_id  UUID        REFERENCES public.applications(id) ON DELETE SET NULL,
  amount          NUMERIC     NOT NULL,
  reference       TEXT        UNIQUE NOT NULL,
  type            TEXT        NOT NULL
                              CHECK (type IN ('form_fee','tuition','hostel','acceptance')),
  status          TEXT        NOT NULL DEFAULT 'success'
                              CHECK (status IN ('pending','success','failed')),
  metadata        JSONB,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- =================================================================
-- SECTION 3: ROW LEVEL SECURITY
-- =================================================================

ALTER TABLE public.profiles             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.centres              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subject_combinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fees                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.olevel_results       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments             ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies first (safe to re-run)
DO $$ DECLARE r RECORD;
BEGIN
  FOR r IN SELECT policyname, tablename FROM pg_policies WHERE schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', r.policyname, r.tablename);
  END LOOP;
END $$;

-- Also drop storage policies
DROP POLICY IF EXISTS "Students: upload own docs"   ON storage.objects;
DROP POLICY IF EXISTS "Students: view own docs"     ON storage.objects;
DROP POLICY IF EXISTS "Students: update own docs"   ON storage.objects;
DROP POLICY IF EXISTS "Admins: view all docs"       ON storage.objects;
-- Legacy policy names from previous schema runs
DROP POLICY IF EXISTS "Students: upload own documents"  ON storage.objects;
DROP POLICY IF EXISTS "Students: view own documents"    ON storage.objects;
DROP POLICY IF EXISTS "Students: update own documents"  ON storage.objects;
DROP POLICY IF EXISTS "Students: delete own documents"  ON storage.objects;
DROP POLICY IF EXISTS "Admins: view all documents"      ON storage.objects;

-- profiles
CREATE POLICY "Users: view own profile"     ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users: update own profile"   ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins: view all profiles"   ON public.profiles FOR SELECT USING (is_admin());
CREATE POLICY "Admins: update all profiles" ON public.profiles FOR UPDATE USING (is_admin());

-- sessions (public read)
CREATE POLICY "Public: read sessions"       ON public.sessions FOR SELECT USING (true);
CREATE POLICY "Admins: manage sessions"     ON public.sessions FOR ALL USING (is_admin());

-- centres (public read active, admin all)
CREATE POLICY "Public: read active centres" ON public.centres FOR SELECT USING (active = true OR is_admin());
CREATE POLICY "Admins: manage centres"      ON public.centres FOR ALL USING (is_admin());

-- subjects (public read)
CREATE POLICY "Public: read subjects"       ON public.subjects FOR SELECT USING (true);
CREATE POLICY "Admins: manage subjects"     ON public.subjects FOR ALL USING (is_admin());

-- subject_combinations
CREATE POLICY "Public: read active combos"  ON public.subject_combinations FOR SELECT USING (active = true OR is_admin());
CREATE POLICY "Admins: manage combos"       ON public.subject_combinations FOR ALL USING (is_admin());

-- fees
CREATE POLICY "Public: read fees"           ON public.fees FOR SELECT USING (true);
CREATE POLICY "Super admins: manage fees"   ON public.fees FOR ALL USING (is_super_admin());

-- applications
CREATE POLICY "Students: view own app"      ON public.applications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Students: create own app"    ON public.applications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Students: update own app"    ON public.applications FOR UPDATE USING (
  auth.uid() = user_id AND status IN ('draft','submitted')
);
CREATE POLICY "Admins: view all apps"       ON public.applications FOR SELECT USING (is_admin());
CREATE POLICY "Admins: update all apps"     ON public.applications FOR UPDATE USING (is_admin());

-- olevel_results
CREATE POLICY "Students: manage own results" ON public.olevel_results FOR ALL USING (
  EXISTS (SELECT 1 FROM public.applications a WHERE a.id = application_id AND a.user_id = auth.uid())
);
CREATE POLICY "Admins: view all results"     ON public.olevel_results FOR SELECT USING (is_admin());

-- payments
CREATE POLICY "Users: view own payments"     ON public.payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users: create own payments"   ON public.payments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins: view all payments"    ON public.payments FOR SELECT USING (is_admin());


-- =================================================================
-- SECTION 4: STORAGE BUCKET
-- =================================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('student-documents', 'student-documents', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Students: upload own docs"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'student-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Students: view own docs"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'student-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Students: update own docs"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'student-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Admins: view all docs"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'student-documents' AND is_admin());


-- =================================================================
-- SECTION 5: TRIGGERS
-- =================================================================

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', NULL),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-update timestamps
DROP TRIGGER IF EXISTS profiles_updated_at     ON public.profiles;
DROP TRIGGER IF EXISTS sessions_updated_at     ON public.sessions;
DROP TRIGGER IF EXISTS centres_updated_at      ON public.centres;
DROP TRIGGER IF EXISTS applications_updated_at ON public.applications;
-- Legacy trigger names from previous schema (wrapped in DO block — table may not exist)
DO $$ BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'student_profiles') THEN
    EXECUTE 'DROP TRIGGER IF EXISTS student_profiles_updated_at ON public.student_profiles';
  END IF;
END $$;

CREATE TRIGGER profiles_updated_at     BEFORE UPDATE ON public.profiles      FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER sessions_updated_at     BEFORE UPDATE ON public.sessions       FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER centres_updated_at      BEFORE UPDATE ON public.centres        FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER applications_updated_at BEFORE UPDATE ON public.applications   FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Auto-generate application number: IJMB/2025/00001
CREATE OR REPLACE FUNCTION public.generate_app_number()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
  year_str TEXT := TO_CHAR(NOW(), 'YYYY');
  seq_num  INT;
BEGIN
  SELECT COUNT(*) + 1 INTO seq_num
  FROM public.applications
  WHERE EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM NOW());
  NEW.application_number := 'IJMB/' || year_str || '/' || LPAD(seq_num::TEXT, 5, '0');
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS set_app_number ON public.applications;
CREATE TRIGGER set_app_number
  BEFORE INSERT ON public.applications
  FOR EACH ROW WHEN (NEW.application_number IS NULL)
  EXECUTE FUNCTION public.generate_app_number();


-- =================================================================
-- SECTION 6: SEED DATA
-- =================================================================

INSERT INTO public.fees (name, amount, description) VALUES
  ('form_fee',       10000,  'Application form processing fee'),
  ('tuition_fee',    85000, 'Full tuition fee for one academic session'),
  ('hostel_fee',     45000, 'Hostel accommodation fee per session'),
  ('acceptance_fee', 15000, 'Acceptance fee upon admission')
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.sessions (name, code, start_date, end_date, status) VALUES
  ('2025/2026', '2025', '2025-09-01', '2026-06-30', 'open')
ON CONFLICT DO NOTHING;

INSERT INTO public.subjects (name, code) VALUES
  ('Mathematics', 'MTH'), ('Further Mathematics', 'FMT'),
  ('Physics', 'PHY'), ('Chemistry', 'CHM'), ('Biology', 'BIO'),
  ('Agricultural Science', 'AGR'), ('Economics', 'ECO'),
  ('Government', 'GOV'), ('Literature in English', 'LIT'),
  ('Geography', 'GEO'), ('Accounting', 'ACC'), ('Commerce', 'COM'),
  ('Christian Religious Studies', 'CRS'), ('Islamic Studies', 'ISL'),
  ('History', 'HIS')
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.subject_combinations (name, track, subject1, subject2, subject3, active) VALUES
  ('Physics, Chemistry & Mathematics',   'Science',        'Physics',               'Chemistry',                      'Mathematics',           true),
  ('Physics, Chemistry & Biology',       'Science',        'Physics',               'Chemistry',                      'Biology',               true),
  ('Biology, Chemistry & Agriculture',   'Science',        'Biology',               'Chemistry',                      'Agricultural Science',  true),
  ('Economics, Government & Literature', 'Social Science', 'Economics',             'Government',                     'Literature in English', true),
  ('Economics, Government & Geography',  'Social Science', 'Economics',             'Government',                     'Geography',             true),
  ('Economics, Accounting & Commerce',   'Commercial',     'Economics',             'Accounting',                     'Commerce',              true),
  ('Literature, Government & History',   'Arts',           'Literature in English', 'Government',                     'History',               true),
  ('Literature, CRS & Government',       'Arts',           'Literature in English', 'Christian Religious Studies',    'Government',            true)
ON CONFLICT DO NOTHING;
