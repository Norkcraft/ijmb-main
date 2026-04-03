-- Add category to subjects
ALTER TABLE public.subjects ADD COLUMN IF NOT EXISTS category TEXT;

-- Update subject_combinations with detailed fields
ALTER TABLE public.subject_combinations ADD COLUMN IF NOT EXISTS subject1 TEXT;
ALTER TABLE public.subject_combinations ADD COLUMN IF NOT EXISTS subject2 TEXT;
ALTER TABLE public.subject_combinations ADD COLUMN IF NOT EXISTS subject3 TEXT;
ALTER TABLE public.subject_combinations ADD COLUMN IF NOT EXISTS recommended_course TEXT;

-- Create O-Level Results table
CREATE TABLE IF NOT EXISTS public.olevel_results (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE NOT NULL,
  subject TEXT NOT NULL,
  exam_type TEXT NOT NULL, -- WAEC, NECO, etc.
  exam_year TEXT NOT NULL,
  grade TEXT NOT NULL, -- A1, B2, etc.
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for olevel_results
ALTER TABLE public.olevel_results ENABLE ROW LEVEL SECURITY;

-- Policies for olevel_results
-- Users can view their own results via application -> user_id check
CREATE POLICY "Users can view own olevel results" ON public.olevel_results 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.applications 
      WHERE applications.id = olevel_results.application_id 
      AND applications.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own olevel results" ON public.olevel_results 
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.applications 
      WHERE applications.id = olevel_results.application_id 
      AND applications.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own olevel results" ON public.olevel_results 
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.applications 
      WHERE applications.id = olevel_results.application_id 
      AND applications.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own olevel results" ON public.olevel_results 
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.applications 
      WHERE applications.id = olevel_results.application_id 
      AND applications.user_id = auth.uid()
    )
  );

-- Seed some subjects if table is empty (Optional but good for testing)
INSERT INTO public.subjects (name, category, code)
VALUES 
('Mathematics', 'Science', 'MTH'),
('Physics', 'Science', 'PHY'),
('Chemistry', 'Science', 'CHM'),
('Biology', 'Science', 'BIO'),
('Geography', 'Science', 'GEO'),
('Agricultural Science', 'Science', 'AGR'),
('Computer Science', 'Science', 'CSC'),
('Accounting', 'Social Science', 'ACC'),
('Economics', 'Social Science', 'ECO'),
('Business Management', 'Social Science', 'BUS'),
('Government', 'Social Science', 'GOV'),
('Sociology', 'Social Science', 'SOC'),
('Literature in English', 'Arts', 'LIT'),
('CRS', 'Arts', 'CRS'),
('Islamic Studies', 'Arts', 'ISS'),
('History', 'Arts', 'HIS'),
('Arabic', 'Arts', 'ARB'),
('Hausa', 'Arts', 'HAU')
ON CONFLICT (name) DO UPDATE SET category = EXCLUDED.category;

-- Seed some combinations
INSERT INTO public.subject_combinations (name, track, subject1, subject2, subject3, recommended_course)
VALUES
('Medicine Combination', 'Science', 'Biology', 'Chemistry', 'Physics', 'Medicine'),
('Engineering Combination', 'Science', 'Mathematics', 'Physics', 'Chemistry', 'Engineering'),
('Accounting Combination', 'Social Science', 'Accounting', 'Economics', 'Business Management', 'Accounting'),
('Law Combination', 'Arts', 'Literature in English', 'Government', 'CRS', 'Law'),
('Mass Comm Combination', 'Social Science', 'Literature in English', 'Government', 'Economics', 'Mass Communication')
ON CONFLICT DO NOTHING;
