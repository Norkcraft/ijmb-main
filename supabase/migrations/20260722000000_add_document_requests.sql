-- Document requests table
-- Allows admin to request specific documents from candidates
-- and candidates to upload them from their dashboard

create table if not exists document_requests (
  id            uuid primary key default gen_random_uuid(),
  application_id uuid references applications(id) on delete cascade not null,
  message       text not null,
  status        text not null default 'pending'
                  check (status in ('pending', 'uploaded', 'reviewed')),
  uploaded_path text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Index for fast lookup by application
create index if not exists document_requests_application_id_idx
  on document_requests (application_id);

-- RLS policies
alter table document_requests enable row level security;

-- Students can see their own document requests (joined via their application)
create policy "Students can view their own document requests"
  on document_requests for select
  using (
    application_id in (
      select id from applications where user_id = auth.uid()
    )
  );

-- Students can upload to their own document requests (update uploaded_path and status)
create policy "Students can upload documents for their requests"
  on document_requests for update
  using (
    application_id in (
      select id from applications where user_id = auth.uid()
    )
  )
  with check (
    application_id in (
      select id from applications where user_id = auth.uid()
    )
  );

-- Admins can do everything
create policy "Admins have full access to document requests"
  on document_requests for all
  using (
    exists (
      select 1 from profiles
      where id = auth.uid()
        and role in ('super_admin', 'admin', 'coordinator')
    )
  );

-- Allow storage uploads for requested documents
-- Run this in your Supabase dashboard Storage policies if not already set:
-- Bucket: student-documents
-- Path prefix: {user_id}/requested/
-- Already covered by existing student-documents storage policy for authenticated users
