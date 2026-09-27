-- Append-only stage history for Digital Footprint reports.
-- Additive. Does not alter or drop attribution columns on free_courses_signups.
-- Run in the Supabase SQL editor of the dashboard project (website schema).
-- Not applied automatically.
--
-- booking_id is reserved for a later booking link. This migration does not
-- write bookings and does not change consultation_bookings.

CREATE TABLE IF NOT EXISTS website.report_stage_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  signup_id UUID NOT NULL REFERENCES website.free_courses_signups(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN (
    'report_submitted',
    'contacted',
    'qualified',
    'meeting_booked',
    'proposal_sent',
    'won',
    'lost'
  )),
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  booking_id UUID REFERENCES public.consultation_bookings(id) ON DELETE SET NULL,
  source TEXT NOT NULL DEFAULT 'system',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE website.report_stage_events IS
  'Append-only funnel times for a Digital Footprint report. First row of each event_type is the measurement timestamp. Later rows keep history.';

CREATE INDEX IF NOT EXISTS idx_website_report_stage_events_signup
  ON website.report_stage_events (signup_id, occurred_at);

CREATE INDEX IF NOT EXISTS idx_website_report_stage_events_lead
  ON website.report_stage_events (lead_id)
  WHERE lead_id IS NOT NULL;

ALTER TABLE website.report_stage_events ENABLE ROW LEVEL SECURITY;
