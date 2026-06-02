-- Track when a reminder email was last sent so we send exactly once
-- per student, regardless of how long they've been inactive.

ALTER TABLE applications
  ADD COLUMN IF NOT EXISTS reminder_sent_at TIMESTAMPTZ;

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS reminder_sent_at TIMESTAMPTZ;
