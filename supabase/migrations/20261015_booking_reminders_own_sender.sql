-- Pre-call reminders are sent by our own cron (/api/cron/booking-reminders) instead of being scheduled with Resend,
-- whose send-only key can't withdraw them. 2026-10-15. Additive. Run in the dashboard project's SQL editor.
--
-- manage_token: the booking's /book/manage token, so the sender can read the booking (still on? same time?) and the
-- owner's name and email at send time. Service role only (RLS on, no anon/authenticated grants), like the rest of the
-- table. start_iso: the call time the reminder was queued for (a moved call's old reminders are dropped).

ALTER TABLE website.booking_scheduled_emails ADD COLUMN IF NOT EXISTS manage_token TEXT;
ALTER TABLE website.booking_scheduled_emails ADD COLUMN IF NOT EXISTS start_iso TIMESTAMPTZ;

ALTER TABLE website.booking_scheduled_emails DROP CONSTRAINT IF EXISTS booking_scheduled_emails_status_check;
ALTER TABLE website.booking_scheduled_emails ADD CONSTRAINT booking_scheduled_emails_status_check
  CHECK (status IN ('scheduled', 'sending', 'sent', 'send_failed', 'skipped', 'canceled', 'cancel_failed', 'not_cancelable'));

CREATE INDEX IF NOT EXISTS idx_website_booking_scheduled_emails_due
  ON website.booking_scheduled_emails (send_at)
  WHERE status = 'scheduled' AND provider = 'terramore';

REVOKE ALL ON website.booking_scheduled_emails FROM anon, authenticated;
