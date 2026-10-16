-- TerraAI texting, draft mode (2026-10-16). Additive. Run in the dashboard project's SQL editor. Service role only.
--
-- sms_messages: the full text of each message on the Terramore line, so TerraAI can read the conversation. The Comms
--   log (public.comms_messages) keeps only a 300-character preview. Kept 180 days; a cleanup job removes older rows.
-- sms_drafts: TerraAI's suggested replies. Adam approves, edits or discards each one (/sms/drafts/{id}). Nothing is
--   sent until he does.

CREATE TABLE IF NOT EXISTS website.sms_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT NOT NULL CHECK (phone ~ '^\+[1-9][0-9]{7,14}$'),
  direction TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound')),
  body TEXT NOT NULL CHECK (char_length(body) <= 2000),
  source TEXT NOT NULL DEFAULT 'owner' CHECK (source IN ('owner', 'terraai', 'adam', 'auto')),
  provider_id TEXT CHECK (char_length(provider_id) <= 200),
  at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE UNIQUE INDEX IF NOT EXISTS sms_messages_provider_unique ON website.sms_messages (provider_id) WHERE provider_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS sms_messages_phone_at ON website.sms_messages (phone, at DESC);

CREATE TABLE IF NOT EXISTS website.sms_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT NOT NULL CHECK (phone ~ '^\+[1-9][0-9]{7,14}$'),
  inbound_id UUID REFERENCES website.sms_messages (id) ON DELETE SET NULL,
  draft TEXT NOT NULL CHECK (char_length(draft) <= 1200),
  intent TEXT NOT NULL CHECK (intent ~ '^[a-z_]{2,40}$'),
  handoff BOOLEAN NOT NULL DEFAULT FALSE,
  notes TEXT CHECK (char_length(notes) <= 600),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'edited', 'discarded', 'superseded', 'failed')),
  final_text TEXT CHECK (char_length(final_text) <= 1200),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  decided_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS sms_drafts_phone_status ON website.sms_drafts (phone, status, created_at DESC);

ALTER TABLE website.sms_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE website.sms_drafts ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON website.sms_messages FROM anon, authenticated;
REVOKE ALL ON website.sms_drafts FROM anon, authenticated;
