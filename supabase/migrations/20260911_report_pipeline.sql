-- Digital Footprint report pipeline: progress and a copy of the report text on the lead row.
-- Run once in the Supabase SQL Editor. Safe to re-run.
--
-- If the tables live in the `website` schema (supabase-website-migration.sql), replace
-- `public.` with `website.` below and set SUPABASE_SCHEMA=website in the app env.

ALTER TABLE public.free_courses_signups
  ADD COLUMN IF NOT EXISTS business_name   VARCHAR(255),
  ADD COLUMN IF NOT EXISTS website         VARCHAR(500),
  ADD COLUMN IF NOT EXISTS report_status   VARCHAR(50),
  ADD COLUMN IF NOT EXISTS report_text     TEXT,
  ADD COLUMN IF NOT EXISTS report_error    VARCHAR(500),
  ADD COLUMN IF NOT EXISTS report_sent_at  TIMESTAMPTZ;

COMMENT ON COLUMN public.free_courses_signups.report_status IS 'needs_keys | generating | sent | failed';

CREATE INDEX IF NOT EXISTS idx_free_courses_signups_report_status
  ON public.free_courses_signups (report_status);
