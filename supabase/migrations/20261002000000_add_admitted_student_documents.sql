create table if not exists public.admitted_student_documents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  category text,
  storage_path text not null unique,
  original_filename text not null,
  mime_type text not null default 'application/pdf',
  file_size bigint not null default 0,
  session_id uuid references public.sessions(id) on delete set null,
  centre_id uuid references public.centres(id) on delete set null,
  is_published boolean not null default false,
  sort_order integer not null default 0,
  uploaded_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists admitted_documents_published_idx on public.admitted_student_documents (is_published);
create index if not exists admitted_documents_session_idx on public.admitted_student_documents (session_id);
create index if not exists admitted_documents_centre_idx on public.admitted_student_documents (centre_id);
create index if not exists admitted_documents_sort_idx on public.admitted_student_documents (sort_order, created_at);

create or replace function public.update_admitted_document_timestamp()
returns trigger language plpgsql set search_path = public as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists admitted_document_updated_at on public.admitted_student_documents;
create trigger admitted_document_updated_at before update on public.admitted_student_documents
for each row execute function public.update_admitted_document_timestamp();

create or replace function public.is_admitted_documents_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'super_admin', 'coordinator')
  );
$$;

revoke all on function public.is_admitted_documents_admin() from public;
grant execute on function public.is_admitted_documents_admin() to authenticated;

create or replace function public.can_access_admitted_document(requested_storage_path text)
returns boolean language sql stable security definer set search_path = public as $$
  select public.is_admitted_documents_admin() or exists (
    select 1
    from public.admitted_student_documents d
    join public.applications a on a.user_id = auth.uid()
    where d.storage_path = requested_storage_path
      and d.is_published = true
      and a.status in ('admitted', 'fees_pending', 'active')
      and (d.session_id is null or d.session_id = a.session_id)
      and (d.centre_id is null or d.centre_id = coalesce(a.assigned_centre_id, a.preferred_centre_id))
  );
$$;

revoke all on function public.can_access_admitted_document(text) from public;
grant execute on function public.can_access_admitted_document(text) to authenticated;

alter table public.admitted_student_documents enable row level security;

drop policy if exists "Admins manage admitted documents" on public.admitted_student_documents;
drop policy if exists "Admitted students view published documents" on public.admitted_student_documents;

create policy "Admins manage admitted documents" on public.admitted_student_documents
for all to authenticated
using (public.is_admitted_documents_admin())
with check (public.is_admitted_documents_admin());

create policy "Admitted students view published documents" on public.admitted_student_documents
for select to authenticated
using (
  is_published = true and exists (
    select 1 from public.applications a
    where a.user_id = auth.uid()
      and a.status in ('admitted', 'fees_pending', 'active')
      and (admitted_student_documents.session_id is null or admitted_student_documents.session_id = a.session_id)
      and (
        admitted_student_documents.centre_id is null
        or admitted_student_documents.centre_id = coalesce(a.assigned_centre_id, a.preferred_centre_id)
      )
  )
);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'admitted-student-documents',
  'admitted-student-documents',
  false,
  10485760,
  array['application/pdf']::text[]
)
on conflict (id) do update set
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Admins upload admitted documents" on storage.objects;
drop policy if exists "Admins update admitted documents" on storage.objects;
drop policy if exists "Admins delete admitted documents" on storage.objects;
drop policy if exists "Admins view admitted documents" on storage.objects;
drop policy if exists "Admitted students view school documents" on storage.objects;

create policy "Admins upload admitted documents" on storage.objects for insert to authenticated
with check (bucket_id = 'admitted-student-documents' and public.is_admitted_documents_admin());

create policy "Admins update admitted documents" on storage.objects for update to authenticated
using (bucket_id = 'admitted-student-documents' and public.is_admitted_documents_admin())
with check (bucket_id = 'admitted-student-documents' and public.is_admitted_documents_admin());

create policy "Admins delete admitted documents" on storage.objects for delete to authenticated
using (bucket_id = 'admitted-student-documents' and public.is_admitted_documents_admin());

create policy "Admins view admitted documents" on storage.objects for select to authenticated
using (bucket_id = 'admitted-student-documents' and public.is_admitted_documents_admin());

create policy "Admitted students view school documents" on storage.objects for select to authenticated
using (bucket_id = 'admitted-student-documents' and public.can_access_admitted_document(name));

alter table public.applications
add column if not exists admission_documents_notified_at timestamptz;
