# Free business lookup: open items

**Branch:** `feature/marketing-growth-system` (preview only). **Last updated:** 2026-10-06.
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
