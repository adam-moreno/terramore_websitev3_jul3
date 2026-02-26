-- ============================================================
-- Terramore website → dashboard Supabase migration
-- Run this in your existing dashboard Supabase project (SQL Editor).
-- Only adds objects; does not change existing dashboard tables.
-- ============================================================

-- ============================================================
-- 1. Create website schema (keeps data separate from dashboard)
-- ============================================================
CREATE SCHEMA IF NOT EXISTS website;

-- ============================================================
-- 2. Website table: free course signups (leads)
-- ============================================================
CREATE TABLE website.free_courses_signups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  company VARCHAR(255),
  email_consent BOOLEAN NOT NULL DEFAULT false,
  signup_source VARCHAR(100) DEFAULT 'free_courses_banner',
  course_type VARCHAR(100),
  signup_date TIMESTAMPTZ DEFAULT NOW(),
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(email)
);

CREATE INDEX idx_website_free_courses_signups_email ON website.free_courses_signups(email);
CREATE INDEX idx_website_free_courses_signups_status ON website.free_courses_signups(status);
CREATE INDEX idx_website_free_courses_signups_signup_date ON website.free_courses_signups(signup_date);
CREATE INDEX idx_website_free_courses_signups_signup_source ON website.free_courses_signups(signup_source);
CREATE INDEX idx_website_free_courses_signups_course_type ON website.free_courses_signups(course_type);

ALTER TABLE website.free_courses_signups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "website_fcs_allow_insert" ON website.free_courses_signups
  FOR INSERT WITH CHECK (true);

CREATE POLICY "website_fcs_allow_select_authenticated" ON website.free_courses_signups
  FOR SELECT USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- ============================================================
-- 3. Website table: partner applications (leads)
-- ============================================================
CREATE TABLE website.partner_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  location VARCHAR(255) NOT NULL,
  business_type VARCHAR(255) NOT NULL,
  revenue VARCHAR(255) NOT NULL,
  team_size VARCHAR(255) NOT NULL,
  goal VARCHAR(255) NOT NULL,
  timeline VARCHAR(255) NOT NULL,
  budget VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  message TEXT,
  application_date TIMESTAMPTZ DEFAULT NOW(),
  status VARCHAR(50) DEFAULT 'pending_review',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(email)
);

CREATE INDEX idx_website_partner_applications_email ON website.partner_applications(email);
CREATE INDEX idx_website_partner_applications_status ON website.partner_applications(status);
CREATE INDEX idx_website_partner_applications_application_date ON website.partner_applications(application_date);
CREATE INDEX idx_website_partner_applications_location ON website.partner_applications(location);
CREATE INDEX idx_website_partner_applications_business_type ON website.partner_applications(business_type);

ALTER TABLE website.partner_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "website_pa_allow_insert" ON website.partner_applications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "website_pa_allow_select_authenticated" ON website.partner_applications
  FOR SELECT USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- ============================================================
-- 4. updated_at triggers
-- ============================================================
CREATE OR REPLACE FUNCTION website.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER website_fcs_updated_at
  BEFORE UPDATE ON website.free_courses_signups
  FOR EACH ROW EXECUTE FUNCTION website.update_updated_at();

CREATE TRIGGER website_pa_updated_at
  BEFORE UPDATE ON website.partner_applications
  FOR EACH ROW EXECUTE FUNCTION website.update_updated_at();
