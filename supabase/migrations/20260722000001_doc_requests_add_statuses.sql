-- Add 'cancelled' and 'accepted' to document_requests status options
-- and add a rejection_reason column for when admin rejects an uploaded doc

alter table document_requests
  drop constraint if exists document_requests_status_check;

alter table document_requests
  add constraint document_requests_status_check
  check (status in ('pending', 'uploaded', 'accepted', 'cancelled'));

alter table document_requests
  add column if not exists rejection_reason text;
