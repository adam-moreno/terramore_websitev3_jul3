# Free business lookup: open items

**Branches:**
- `feature/marketing-growth-system`: preview only.
- `acquisition/search-first`: local, from production `597fd49`. It carries the lookup to production pages; see `docs/acquisition/SEARCH_FIRST_ROUTE_AUDIT.md`.

**Last updated:** 2026-10-08.

## Launch triage (search-first, 2026-10-08)

| Item | Launch | Owner action |
|---|---|---|
| A. Cloudflare rate limit on `POST /api/lookup` | **Must have.** Paid traffic lands on the lookup, and the in-app limit is per serverless instance. | Cloudflare → Security → WAF → Rate limiting rules. Path `/api/lookup`, method POST, 10 requests per 10 minutes per IP, then Block or Managed Challenge for 10 minutes. |
| B. `GOOGLE_PLACES_API_KEY` (Production + Preview) | Can follow. Without it, Maps shows "Not checked here", which is true but weaker. | Vercel → Settings → Environment Variables, using a key restricted to the Places API (New). The agent configures no secret. |
| C. Duplicate crawl / signed snapshot hand-off | Can follow. It costs crawl time only; the visitor isn't slowed. | Design below; approval to build. |
| D. Identity-only report dedupe | Ships with the lookup (ported). | Merge approval. |
| E. Detection accuracy fixes (`970690f`) | Ships with the lookup (ported). | Merge approval. |
The lookup itself: `POST /api/lookup` (`app/api/lookup/route.ts`, `lib/lookup/*`), `components/business-lookup.tsx`.

## A. Rate limiting (approval: owner, Cloudflare dashboard)

**Today:** in-memory, per serverless instance: 6 lookups per IP per 10 minutes, plus a 15-minute per-domain cache.
New instances start empty, so a determined client can exceed it.

**What's in front of the site:** www.terramore.io is proxied by **Cloudflare** in front of Vercel (`server: cloudflare`,
`cf-ray`, `x-vercel-id` on 2026-10-06).

**Smallest production-safe fix:** a Cloudflare WAF rate-limiting rule on `POST /api/lookup`, keyed by IP. For example,
10 requests per minute, then block or managed challenge for 10 minutes. Recommended order:
1. Confirm which rate-limiting rules your Cloudflare plan includes (Security → WAF → Rate limiting rules).
2. Add one rule for `http.request.uri.path eq "/api/lookup" and http.request.method eq "POST"`.
3. Keep the in-app limit as a second layer.

This adds no code, dependency or vendor.

**Escalation, only if abuse shows up:** Cloudflare Turnstile (invisible mode) on the lookup form. It needs a site key and a secret (owner action), plus a server-side verify call in the route. Not built.

## B. Google Maps in preview (approval: owner, Vercel env)

Previews show "Google Maps listing: Not checked here" because `GOOGLE_PLACES_API_KEY` isn't set for the Preview
environment. To check Maps on previews, add `GOOGLE_PLACES_API_KEY` to Vercel → Settings → Environment Variables →
Preview, using the same key or a separate preview key with an HTTP-referrer or API restriction to the Places API (New).
No code change. Places rating and review count stay in memory either way (`scripts/verify-report-places.mjs`).

## C. Duplicate crawl (design; not built)

**Today:** the lookup reads the homepage plus 2 pages. If the visitor then requests the full report, `/api/report`'s
background pipeline re-crawls the site (homepage plus 5 pages, robots, sitemap, Places). The lookup stores nothing.

**Cleanest reuse without server storage:**
- The lookup's `done` event carries a **signed evidence token**: an HMAC-SHA256 over a compact bundle with these fields:
  - `v`, `host`, `readAt`
  - the parsed page snapshots (no raw HTML)
  - the technical snapshot
  - the directory links
  - the confirmed place ID only
- It is signed with a server secret (`LOOKUP_EVIDENCE_SECRET`, new env).
- The report popup posts the token with the report request. `/api/report` verifies the signature, that the host
  matches the submitted website, and that `readAt` is under 30 minutes old.
- If valid, `collectDiagnostic` starts from those snapshots and only fetches what the lookup didn't (extra pages, catalog).
  If anything fails verification, it falls back to a full crawl.

**Why this shape:**
- No new table, and the lookup still stores nothing.
- The client can't forge evidence (signature).
- Freshness is explicit (`readAt` is kept as the report's read time for the reused parts).
- Provenance stays per snapshot.

**Saving:** about 3–12 seconds of crawl per report, and fewer requests to the prospect's site.

**Cost:** one new secret, token-size limits (the bundle must stay small), and a change inside the report pipeline, which is conversion-critical. Recommend building it only after the lookup has real traffic.

## D. Seven-day domain dedupe (built locally on this branch; not merged)

**Problem:** `findDuplicateReportLead` returned **409 "already requested"** when anyone had requested a report in the
last 7 days with the same **website host**, business name, socials, or full name. With a public website checker,
a second person at the same business (or Terramore staff testing) is blocked, and no conversion is recorded.

**New rule:**

| Check | Window | Blocks |
|---|---|---|
| Email | any time (also the unique column) | 409 |
| Phone | 7 days | 409 |
| Same full name **and** same website host or business name | 7 days | 409 (one person, a new email) |
| Website, business name or socials alone | any | Never |

Abuse moves to rate limiting (A), not identity matching.
- **Files:** `lib/report/duplicates.ts` (the matching extracted into the pure `matchRecentDuplicate`),
  `app/api/report/route.ts`, and `scripts/verify-report-dedupe.mjs` (10 checks).
- **Logging:** the route's duplicate log line no longer prints the requester's email (no emails in logs).
- **Effect on tracking:** fewer false 409s means more `report_submission_success`. The conversion firing rules are
  unchanged (`verify-conversion-tracking`, `verify-funnel` pass).
- **Approval needed:** merge to `main` (production) with the rest of the lookup.

## E. Detection accuracy fixes (built locally on this branch, 2026-10-08; not merged)

**Why:** run against terramore.io, the lookup told us three false things about our own site. It said there was no online booking (`/book` has a live booking flow), it listed tab labels and a demo stepper as calls to action, and it said prices were shown (every amount was in a sample dashboard). All three were general heuristic bugs. None was fixed with a site-specific exception. The full before/after record is in `docs/hero-film/content/SCENE_01_CONTENT_TRUTH_CHECK.md` (on `feature/marketing-growth-system`).

- **Booking** (`lib/report/collect/site-experience.ts` `checkBooking`, `lib/report/collect/fetch.ts`). It now returns a verdict: `found`, `unreachable`, `unconfirmed` or `none`.
  - **found:** a known third-party booking tool is linked or embedded (`isSchedulerUrl`, matched by host and, for Square and Google, by path; scheduler sites are never fetched). Or a same-site page has a scheduling interaction: a date or time input, or scheduling text ("Pick a time", "Available times", "times show in your time zone") plus a control.
  - **Same-site candidates:** booking paths (`/book`, `/appointments`, `/schedule`…) or links labelled "Book…", "Schedule…" or "Reserve…". A candidate counts only once its page is confirmed.
  - **unreachable:** the booking link failed or redirected somewhere the guard blocks. It shows the new gap "A booking link on the site didn't open when we checked it", which can be the first look.
  - **unconfirmed:** a booking link or button exists but no booking step is visible. It shows a note, never the "no way to book" gap.
  - Ordinary copy that says "book" or "schedule" no longer counts.
- **Calls to action:** the label must start with the action. State toggles don't count (tabs, `aria-selected` and `aria-pressed` controls, accordion triggers with `aria-expanded` but no popup), and neither does any run of four or more adjacent buttons (tab, chip, stepper and carousel groups). Added verbs: let's talk, talk to/with, send me, join, apply, enroll, register, free quote/estimate/trial.
- **Prices:** an amount counts only when it's offered as a price ("from $45", "$1,200/month", "$30 per class", price/fee/rate wording) or when there's product offer markup (JSON-LD `price`, `itemprop="price"`, `product:price:amount`). Thousands now parse whole.
- **Contact:** a `mailto:` link counts as an email address. The lookup reports "An email address is listed", and the "no phone number or contact form" gap no longer fires when one exists.
- **Crawl breadth and performance:** unchanged when the booking page is already among the homepage plus 2 linked pages, as it is for terramore.io (run 2 took 2.26 s, versus about 2 s before). Otherwise there is at most **one** extra same-site request, with an 8 s timeout, inside the lookup's 40 s budget. Every hop still passes `assertPublicUrl` through `fetchText`, and links to other origins or private addresses are never followed.
- **Effect on the full report** (`/api/report`, which shares the collector):
  - `ctaTexts` excludes toggles and button groups, so `recommend.ts` and `score/digital-presence.ts` see fewer, truer CTAs.
  - `hasBookingLink` on a page now means a scheduler or a scheduling interaction. The homepage's flag is also true when it links to a confirmed booking page, so the report's "Booking path signal" and the "no booking path" recommendation follow the same verdict.
  - `site.prices` is read only by the lookup.
- **Tests:** `scripts/verify-lookup.mjs` §8, 33 new checks (93 total):
  - booking cases A–F: same-site flow, one extra request, ordinary text, a page without a booking step, a third-party scheduler, lookalike hosts, a broken link, a safe redirect, a private redirect, private targets;
  - CTAs, prices and mailto;
  - the lookup's booking and unreachable findings.
  The new checks fail against the old code.
- **Approval needed:** merge to `main` with the rest of the lookup.
