-- Email logs table to track all outgoing emails
CREATE TABLE IF NOT EXISTS public.email_logs (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient       TEXT        NOT NULL,
  subject         TEXT        NOT NULL,
  email_type      TEXT,
  status          TEXT        NOT NULL DEFAULT 'sent'
                              CHECK (status IN ('sent', 'failed')),
  resend_id       TEXT,
  error           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_email_logs_created_at ON public.email_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_email_logs_recipient ON public.email_logs(recipient);

-- Allow service role full access (RLS)
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow service role full access to email_logs"
  ON public.email_logs
  FOR ALL
  USING (true)
  WITH CHECK (true);
