
-- Enable storage extension if not enabled (usually enabled by default on Supabase projects)
-- Create the storage bucket for student documents
insert into storage.buckets (id, name, public)
values ('student-documents', 'student-documents', true)
on conflict (id) do nothing;

-- Policy to allow authenticated users to upload their own documents
create policy "Authenticated users can upload their own documents"
on storage.objects for insert
to authenticated
with check ( bucket_id = 'student-documents' and (storage.foldername(name))[1] = auth.uid()::text );

-- Policy to allow authenticated users to view their own documents
create policy "Authenticated users can view their own documents"
on storage.objects for select
to authenticated
using ( bucket_id = 'student-documents' and (storage.foldername(name))[1] = auth.uid()::text );

-- Policy to allow users to update their own documents
create policy "Authenticated users can update their own documents"
on storage.objects for update
to authenticated
using ( bucket_id = 'student-documents' and (storage.foldername(name))[1] = auth.uid()::text );

-- Policy to allow users to delete their own documents
create policy "Authenticated users can delete their own documents"
on storage.objects for delete
to authenticated
using ( bucket_id = 'student-documents' and (storage.foldername(name))[1] = auth.uid()::text );
