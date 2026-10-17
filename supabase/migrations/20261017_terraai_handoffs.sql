-- TerraAI hand-offs (2026-10-17). Additive. Run in the dashboard project's SQL editor. Service role only.
--
-- sms_handoffs: one row each time TerraAI hands a texting conversation to Adam. While a row is active (not closed,
--   and the conversation had activity in the last 24 hours) TerraAI stays quiet on that number. Adam answers from his
--   own phone by texting the 612 line "<code> <message>" (the code, e.g. A7, is in his alert), or from the Sendblue
--   inbox. "<code> done" gives the conversation back to TerraAI. If nobody answers within 10 minutes during business
--   hours, the owner gets one "still getting someone" text.

CREATE TABLE IF NOT EXISTS website.sms_handoffs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT NOT NULL CHECK (phone ~ '^\+[1-9][0-9]{7,14}$'),
  code TEXT NOT NULL CHECK (code ~ '^[A-Z][0-9]$'),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'claimed', 'closed')),
  reason TEXT CHECK (char_length(reason) <= 300),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_activity_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  claimed_at TIMESTAMPTZ,
  followup_sent_at TIMESTAMPTZ,
  closed_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS sms_handoffs_phone_active ON website.sms_handoffs (phone, last_activity_at DESC) WHERE closed_at IS NULL;
CREATE INDEX IF NOT EXISTS sms_handoffs_code_active ON website.sms_handoffs (code) WHERE closed_at IS NULL;

ALTER TABLE website.sms_handoffs ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON website.sms_handoffs FROM anon, authenticated;
