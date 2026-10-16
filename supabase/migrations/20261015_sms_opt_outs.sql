-- Text opt-outs (2026-10-15). Someone who texts STOP (or UNSUBSCRIBE, CANCEL, END, QUIT, STOPALL) to the Sendblue line
-- gets no more texts from the website or the dashboard; START or UNSTOP removes the row. Written by
-- app/api/sms/sendblue/route.ts, checked by sendSms (lib/notify.ts) before every send.
-- Additive. Run in the dashboard project's SQL editor. Phone in E.164 only; no name, email or message text.

CREATE TABLE IF NOT EXISTS website.sms_opt_outs (
  phone TEXT PRIMARY KEY CHECK (phone ~ '^\+[1-9][0-9]{7,14}$'),
  keyword TEXT NOT NULL CHECK (char_length(keyword) <= 20),
  source TEXT NOT NULL DEFAULT 'sendblue' CHECK (source ~ '^[a-z0-9_-]{2,40}$'),
  opted_out_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE website.sms_opt_outs IS 'Phones that texted STOP. No texts go to these numbers until they text START.';

ALTER TABLE website.sms_opt_outs ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON website.sms_opt_outs FROM anon, authenticated;
