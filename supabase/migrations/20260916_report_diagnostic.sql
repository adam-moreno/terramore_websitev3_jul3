-- Digital Footprint MVP diagnostic fields on the lead row.
-- Safe to re-run. Nullable; existing report_text / PDF flow unchanged.
--
-- Run in the Supabase SQL Editor of the dashboard project (website schema).

ALTER TABLE website.free_courses_signups
  ADD COLUMN IF NOT EXISTS business_location VARCHAR(255),
  ADD COLUMN IF NOT EXISTS service_area      VARCHAR(255),
  ADD COLUMN IF NOT EXISTS industry          VARCHAR(255),
  ADD COLUMN IF NOT EXISTS report_json       JSONB;

COMMENT ON COLUMN website.free_courses_signups.report_json IS
  'Structured diagnostic: scores, facts, recommendations, evidence appendix (MVP v2+)';
COMMENT ON COLUMN website.free_courses_signups.business_location IS
  'Optional lead-provided location hint for analysis';
COMMENT ON COLUMN website.free_courses_signups.service_area IS
  'Optional lead-provided service area hint';
COMMENT ON COLUMN website.free_courses_signups.industry IS
  'Optional lead-provided industry / category hint';
