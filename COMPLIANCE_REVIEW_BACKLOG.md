# Compliance review backlog — for counsel; not legal advice; nothing here has been changed

Opened 2026-09-29 during the contact-channel audit. The only site changes from that audit were replacing the unmonitored contact@terramore.io with admin@terramore.io (Privacy Policy, Disclosure page, footer "Privacy Choices" dialog). Everything below is an open question, recorded as found. Line numbers are as of the commit that adds this file (the MK-01 privacy commit on top of `3610bb6`).

## 1. Mailbox status

| Address | Status | Source |
| --- | --- | --- |
| admin@terramore.io | Monitored | Confirmed by Adam, 2026-09-29 |
| contact@terramore.io | Not monitored | Confirmed by Adam; no longer referenced in site code |
| support@terramore.io | Unknown | |
| legal@terramore.io | Unknown | |
| dmca@terramore.io | Unknown | |
| adam.moreno@terramore.io | Unknown (not confirmed in this audit) | |
| reports@ / no-reply@ / noreply@terramore.io | Sender addresses only | |

admin@terramore.io is currently serving as the monitored general/privacy administrative contact until dedicated channels are established.

## 2. Inboxes needing Adam's confirmation

Public pages:
- support@terramore.io — `app/terms/page.tsx:224` (/terms, section 25 "Contacting Us": questions about products and services).
- legal@terramore.io — `app/terms/page.tsx:225` (/terms, section 25: questions about the Terms).
- dmca@terramore.io — `app/dmca/page.tsx:138` (/dmca, Copyright Agent block for DMCA notices and counter-notifications).

Shown to leads and clients (booking and report flows), and the default Reply-To for all outbound email:
- adam.moreno@terramore.io
  - `components/booking-flow.tsx:702`, `:795` (booking confirmation screen: "calendar invite from adam.moreno@…").
  - `components/manage-booking.tsx:150` (/book manage screen).
  - `lib/notify.ts:52` (`REPLY_TO` default when `EMAIL_REPLY_TO` is unset: Reply-To on every confirmation, booking, report and nurture email), `:48` (`ADMIN_EMAIL` default, internal alert copy), `:546`, `:555`, `:575`, `:576`, `:622` (booking email and SMS copy).
  - `lib/booking-reminders.ts:59` (reminder copy).
  - `lib/email-template.ts:23` ("Replies reach Adam at adam.moreno@terramore.io." in the email footer).
  - `.env.example:27`, `:29` (documented defaults).
  - Copy that sends people to this Reply-To: `components/manage-booking.tsx:69`, `:74`, `:101` ("reply to the confirmation email"); `app/api/nurture/unsubscribe/route.ts:32`, `:37`, `:48` ("Reply to any Terramore email and we will remove you"); `lib/nurture/templates.ts:113` ("Reply to this note").

Sender-only (From) addresses. Not a contact channel, but replies to them go to the Reply-To above:
- no-reply@terramore.io — `lib/notify.ts:50` (default `FROM`).
- reports@terramore.io — `.env.example:24`, `lib/notify.ts:10` (example `RESEND_FROM_EMAIL`).
- noreply@terramore.io — `SUPABASE_SETUP.md:165` (setup doc example only).

## 3. Open items

1. Terms lists support@ and legal@ (`app/terms/page.tsx:224-225`), and monitoring for both is unknown. The DMCA page lists dmca@ (`app/dmca/page.tsx:138`), also unknown.
2. The Privacy Policy says "We may ask you to fill out a request form" (`app/privacy/page.tsx:316-317`). No request form exists on the site. The only route is email to admin@ (footer dialog `components/do-not-sell-popup.tsx:8-9`).
3. "Attention Legal Department" (`app/privacy/page.tsx:344`) may not reflect a real department.
4. "Do not sell" statements (`app/privacy/page.tsx:102`, `:193`; `app/security/page.tsx:26`; `app/resources/page.tsx:58`; `components/home-faq.tsx:25`; `components/security-band.tsx:8`; the footer "Privacy Choices" dialog `components/do-not-sell-popup.tsx:68`) sit alongside GA4 and Google Ads tags (`app/layout.tsx:91`, `lib/analytics.ts:18`, `:24`) and optional Meta and TikTok pixels (`components/ad-pixels.tsx:10-11`, when `NEXT_PUBLIC_META_PIXEL_ID` / `NEXT_PUBLIC_TIKTOK_PIXEL_ID` are set). Whether this counts as a "sale" or "share" under California law is an open question.
5. "CCPA and HIPAA standards" claims need substantiation: `app/security/page.tsx:8`, `:16`, `:21-22`; `app/resources/page.tsx:58`; `components/security-band.tsx:4`; `components/home-faq.tsx:25`; `app/llms.txt/route.ts:15`.
   - Visual V1 (branch `visual/v1-gaps`, 2026-09-29): these marketing assertions were removed until they can be substantiated, with no replacement claim (the `/security` hero, meta description and first card, the home security band's "Compliant." card, the home FAQ, the `/resources` card and `llms.txt`). The Privacy Policy's CCPA sections (`app/privacy/page.tsx:70`, `:309-319`) are legal-policy text and were left unchanged. Whether to reinstate any HIPAA or CCPA positioning is for Adam or counsel.
6. No Global Privacy Control handling. No search hits for GPC or `Sec-GPC`. There is no second request method besides email.
7. No stated response timeline and no described identity-verification or authorized-agent process. `app/privacy/page.tsx:317-319` says only that identity must be verified and to "follow our instructions".
8. The Privacy Policy describes Terramore.io, LLC as "a Sales Training company" (`app/privacy/page.tsx:52`).
9. Conflicting policy dates: "Last Updated September 28, 2026" (`app/privacy/page.tsx:25`) against "drafted on December 11th, 2024, and is effective as of this date" (`app/privacy/page.tsx:326`). The Disclosure and DMCA pages say "Last Updated: February 4, 2025" (`app/disclosure/page.tsx:22`, `app/dmca/page.tsx:22`).
10. Child-age inconsistency: "over the age of 13" (`app/privacy/page.tsx:33`), then "under the age of 13" alongside "under the age of 18" (`app/privacy/page.tsx:289-292`). Terms say under-18 users need a parent or guardian (`app/terms/page.tsx:110`).

## 4. Found in the contact-mechanism review

No fake or simulated contact channel was found. Every booking CTA ("Let's talk", "Talk with us", "Book a demo", "Book a call", "Schedule") opens `BookingFlow` and POSTs to `/api/booking`, which books through the Terra IQ API. The Digital Footprint form POSTs to `/api/report`, which stores the lead in Supabase and runs the report pipeline. The only `mailto:` link is the footer privacy dialog (admin@). The items below depend on configuration that could not be verified from code:

11. Confirmation copy depends on environment configuration. "Confirmation email on the way" (`components/booking-flow.tsx:798`) and "In your inbox in minutes" (`components/report-popup.tsx:147`, `:192`, `components/report-form.tsx:137`) are true only when an email provider key (`RESEND_API_KEY`, `SENDGRID_API_KEY` or `POSTMARK_SERVER_TOKEN`) is set in production. Without one, `lib/notify.ts` skips the send silently. The production configuration was not checked in this audit.
12. Unsubscribe fallback. `lib/nurture/templates.ts:23-47` generates unsubscribe links without a token when no nurture secret is configured, and `app/api/nurture/unsubscribe/route.ts:31-32` then rejects them and tells the person to "Reply to any Terramore email". That makes the adam.moreno@ Reply-To (unknown status) the working opt-out. The Privacy Policy also offers admin@ for opt-out (`app/privacy/page.tsx:279-281`).
13. `app/api/partner-application/route.ts` sends a confirmation email and optional SMS (`:135-138`), but no page or component calls it. It is an orphan endpoint, not a public channel. `DEPLOYMENT_GUIDE.md` still lists "Partner application form", "Course signups" and "contact forms" as things to test. None of these exist as public forms.
