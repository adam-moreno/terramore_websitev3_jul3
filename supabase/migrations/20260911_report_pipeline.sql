-- Digital Footprint report pipeline: progress and a copy of the report text on the lead row.
-- Run once in the Supabase SQL Editor of the dashboard project. Safe to re-run.
--
-- The website tables live in the `website` schema there (see supabase-website-migration.sql),
-- and the app runs with SUPABASE_SCHEMA=website. Make sure `website` is listed under
-- Project Settings -> API -> Exposed schemas.

ALTER TABLE website.free_courses_signups
  ADD COLUMN IF NOT EXISTS business_name   VARCHAR(255),
  ADD COLUMN IF NOT EXISTS website         VARCHAR(500),
  ADD COLUMN IF NOT EXISTS report_status   VARCHAR(50),
  ADD COLUMN IF NOT EXISTS report_text     TEXT,
  ADD COLUMN IF NOT EXISTS report_error    VARCHAR(500),
  ADD COLUMN IF NOT EXISTS report_sent_at  TIMESTAMPTZ;

COMMENT ON COLUMN website.free_courses_signups.report_status IS 'needs_keys | generating | sent | failed';

CREATE INDEX IF NOT EXISTS idx_website_free_courses_signups_report_status
  ON website.free_courses_signups (report_status);
