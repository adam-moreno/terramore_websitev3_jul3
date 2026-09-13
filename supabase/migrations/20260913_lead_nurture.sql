-- Lead nurture sequence: 3 follow-up emails after Talk / report / book signup.
-- Run once in the Supabase SQL Editor of the dashboard project. Safe to re-run.
--
-- The website tables live in the `website` schema (see supabase-website-migration.sql),
-- and the app runs with SUPABASE_SCHEMA=website. Make sure `website` is listed under
-- Project Settings -> API -> Exposed schemas.
--
-- Cron at /api/cron/nurture uses SUPABASE_SERVICE_ROLE_KEY. Do not backfill historical leads.

CREATE TABLE IF NOT EXISTS website.lead_nurture (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  source VARCHAR(20) NOT NULL CHECK (source IN ('talk', 'report', 'book')),
  business_type VARCHAR(255),
  job VARCHAR(255),
  business_name VARCHAR(255),
  website VARCHAR(500),
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  step1_sent_at TIMESTAMPTZ,
  step2_sent_at TIMESTAMPTZ,
  step3_sent_at TIMESTAMPTZ,
  unsubscribed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (email)
);

COMMENT ON TABLE website.lead_nurture IS
  'Future Talk/report/book signups enrolled into a 3-email nurture (day 1 / 3 / 5). One row per email; never backfill historical leads.';

COMMENT ON COLUMN website.lead_nurture.source IS 'talk | report | book';
COMMENT ON COLUMN website.lead_nurture.job IS 'Talk form goal text, or freeform note when available';
COMMENT ON COLUMN website.lead_nurture.business_type IS 'Talk businessType, or inferred from report answers (e.g. type=local)';

CREATE INDEX IF NOT EXISTS idx_website_lead_nurture_enrolled_at
  ON website.lead_nurture (enrolled_at);

CREATE INDEX IF NOT EXISTS idx_website_lead_nurture_due
  ON website.lead_nurture (enrolled_at)
  WHERE unsubscribed_at IS NULL AND step3_sent_at IS NULL;

ALTER TABLE website.lead_nurture ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'website' AND tablename = 'lead_nurture' AND policyname = 'website_ln_service_role_all'
  ) THEN
    CREATE POLICY website_ln_service_role_all ON website.lead_nurture
      FOR ALL
      USING (auth.role() = 'service_role')
      WITH CHECK (auth.role() = 'service_role');
  END IF;
END $$;

GRANT SELECT, INSERT, UPDATE ON website.lead_nurture TO service_role;

CREATE OR REPLACE FUNCTION website.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS website_ln_updated_at ON website.lead_nurture;
CREATE TRIGGER website_ln_updated_at
  BEFORE UPDATE ON website.lead_nurture
  FOR EACH ROW EXECUTE FUNCTION website.update_updated_at();
