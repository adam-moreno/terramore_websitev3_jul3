-- Provider handles for the emails a booking schedules ahead (prep note ~5 min, reminders 24h/2h/30m), so a cancel or
-- reschedule on /book/manage can withdraw them (lib/booking/scheduled-emails.ts). 2026-10-14.
-- Additive. Run in the Supabase SQL editor of the dashboard project (website schema). Not applied automatically.
-- Until it runs, bookings still schedule reminders; they just can't be withdrawn (logged as "table missing").
--
-- booking_id is the Terra IQ booking id (text, no foreign key: the website only sees it through the public booking API).
-- No name, email or phone here: the booking API returns those on cancel/reschedule.

CREATE TABLE IF NOT EXISTS website.booking_scheduled_emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id TEXT NOT NULL,
  kind TEXT NOT NULL,
  provider TEXT NOT NULL,
  message_id TEXT,
  send_at TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'canceled', 'cancel_failed', 'not_cancelable')),
  -- What the reminder copy needs to be rebuilt for a new time on reschedule.
  visitor_tz TEXT,
  has_phone BOOLEAN NOT NULL DEFAULT FALSE,
  error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE website.booking_scheduled_emails IS
  'Scheduled booking emails (prep + reminders) with the provider id (Resend email id / SendGrid batch_id), so cancel and reschedule can withdraw them.';

CREATE INDEX IF NOT EXISTS idx_website_booking_scheduled_emails_booking
  ON website.booking_scheduled_emails (booking_id, status);

ALTER TABLE website.booking_scheduled_emails ENABLE ROW LEVEL SECURITY;
