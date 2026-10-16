-- Text-us-first refs (2026-10-16). Sendblue's AI Agent line is inbound-first, so owners are invited to text us first
-- ("Tap to text us"). Each report request and booking gets a 5-character code that rides in the pre-filled text
-- ("… (Ref K7Q2M)"), so the webhook (app/api/sms/sendblue/route.ts) knows which report or booking the text is about,
-- sends one instant reply, and texts booking reminders to that number.
-- Additive. Run in the dashboard project's SQL editor. Service role only.

CREATE TABLE IF NOT EXISTS website.text_refs (
  code TEXT PRIMARY KEY CHECK (code ~ '^[A-HJ-NP-Z2-9]{5}$'),
  kind TEXT NOT NULL CHECK (kind IN ('report', 'booking')),
  ref_id TEXT NOT NULL CHECK (char_length(ref_id) <= 80),
  first_name TEXT CHECK (char_length(first_name) <= 60),
  phone TEXT CHECK (phone IS NULL OR phone ~ '^\+[1-9][0-9]{7,14}$'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  used_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_website_text_refs_ref ON website.text_refs (kind, ref_id);

ALTER TABLE website.text_refs ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON website.text_refs FROM anon, authenticated;
