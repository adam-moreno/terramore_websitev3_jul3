-- Report launch readiness: attribution click IDs, socials, SMS send markers.
-- Run once in the Supabase SQL Editor of the dashboard project. Safe to re-run.
--
-- Tables live in the `website` schema (see supabase-website-migration.sql).
-- App uses SUPABASE_SCHEMA=website. Expose `website` under Project Settings → API.

ALTER TABLE website.free_courses_signups
  ADD COLUMN IF NOT EXISTS phone              VARCHAR(50),
  ADD COLUMN IF NOT EXISTS socials            VARCHAR(500),
  ADD COLUMN IF NOT EXISTS utm_source         VARCHAR(255),
  ADD COLUMN IF NOT EXISTS utm_medium         VARCHAR(255),
  ADD COLUMN IF NOT EXISTS utm_campaign       VARCHAR(255),
  ADD COLUMN IF NOT EXISTS utm_content        VARCHAR(255),
  ADD COLUMN IF NOT EXISTS utm_term           VARCHAR(255),
  ADD COLUMN IF NOT EXISTS gclid              VARCHAR(255),
  ADD COLUMN IF NOT EXISTS gbraid             VARCHAR(255),
  ADD COLUMN IF NOT EXISTS wbraid             VARCHAR(255),
  ADD COLUMN IF NOT EXISTS fbclid             VARCHAR(255),
  ADD COLUMN IF NOT EXISTS ttclid             VARCHAR(255),
  ADD COLUMN IF NOT EXISTS report_sms_m1_sent_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS report_sms_m2_sent_at TIMESTAMPTZ;

COMMENT ON COLUMN website.free_courses_signups.socials IS
  'Optional Instagram / Facebook / LinkedIn URL or handles from the report form.';
COMMENT ON COLUMN website.free_courses_signups.gclid IS 'Google Ads click id (web).';
COMMENT ON COLUMN website.free_courses_signups.gbraid IS 'Google Ads click id (iOS / privacy).';
COMMENT ON COLUMN website.free_courses_signups.wbraid IS 'Google Ads click id (web privacy).';
COMMENT ON COLUMN website.free_courses_signups.fbclid IS 'Meta click id (stored for future pixel / CAPI).';
COMMENT ON COLUMN website.free_courses_signups.ttclid IS 'TikTok click id (stored for future pixel).';
COMMENT ON COLUMN website.free_courses_signups.report_sms_m1_sent_at IS
  'When Message 1 (request received) SMS was sent. Idempotency for report accept path.';
COMMENT ON COLUMN website.free_courses_signups.report_sms_m2_sent_at IS
  'When Message 2 (report ready) SMS was sent. Idempotency after PDF delivery.';

CREATE INDEX IF NOT EXISTS idx_website_fcs_phone
  ON website.free_courses_signups (phone)
  WHERE phone IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_website_fcs_business_name
  ON website.free_courses_signups (lower(business_name))
  WHERE business_name IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_website_fcs_website
  ON website.free_courses_signups (lower(website))
  WHERE website IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_website_fcs_socials
  ON website.free_courses_signups (lower(socials))
  WHERE socials IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_website_fcs_name
  ON website.free_courses_signups (lower(first_name), lower(last_name));

CREATE INDEX IF NOT EXISTS idx_website_fcs_signup_date
  ON website.free_courses_signups (signup_date DESC);
