# Search-first acquisition: route audit and launch record

**Date:** 2026-10-08.
**Branch:** `acquisition/search-first`, worktree `/Users/adammoreno/Projects/terramore-website-search-first`, branched from `origin/main` `597fd49` (production).
**Status:** local only. Not pushed, not merged, not deployed. No Google Ads change.

**Goal:** cold visitors start with the free business lookup ("Check my business") instead of deciding whether to book a call. The flow is LAND → ENTER WEBSITE → LOOKUP → USEFUL RESULT → FULL REPORT (email) → NEXT MOVE → BOOK. Booking stays available everywhere as the secondary action.

**Why a new branch.** The lookup only existed on `feature/marketing-growth-system`, which also holds the out-of-scope /marketing redesign (class E in `docs/hero-film/CURRENT_STATE.md` on that branch).
- **Ported:** the lookup, the safety fixes and analytics (classes A/B/C), including the `970690f` detection fix and the identity-only report dedupe.
- **Not ported:** none of E, none of the hero film (D), and none of the hero-film docs.

---

## 1. Route audit (production `597fd49`, before this change)

The audit came from the rendered HTML of a local production build (`next build && next start`). For each page it records the H1, the brand-filled primary CTA, the secondary CTA and the header CTA. Every page's header was "Let's talk". **No page had a lookup.**

Ad traffic sources come from repo history (`DEVELOPMENT_LOG.md` 2026-09-18 "Commercial pages for Google Ads": `/marketing`, `/solutions` and `/book` were made the ad destinations; `/book` is described as the Ads landing page for a call). They were not checked in the Google Ads account.

| Route | Class | H1 (current) | Primary CTA (before) | Secondary (before) | Lookup before | Paid / organic (from repo) | Treatment | Why |
|---|---|---|---|---|---|---|---|---|
| `/` | A Acquisition | Unlock more from the business you already built. | Let's talk (booking) | "Or click here for a Digital Footprint report" | No | Organic, brand | **FULL** | #1 entry; the first viewport must start the diagnosis |
| `/marketing` | A Acquisition | We find what your business needs next. Then we get it done. | Book a demo | See your free Digital Footprint | No | **Paid** (ad destination) | **FULL** | Main marketing ad landing |
| `/report` | A Acquisition | See what a potential customer sees before they call you. | Get my free Digital Footprint report (email form) | — | No | Report intent | **FULL** | The Digital Footprint acquisition page; it was email-first |
| `/solutions` | A/B | Marketing that connects all the way to revenue. | See my Digital Footprint (its own website form → email popup) | Book a call → | A **fork** of a website field | **Paid** (sitelink) | **COMPACT** | Deciding relevance; its separate form is replaced by the canonical lookup |
| `/solutions/[slug]` (11 capability pages) | B Education | e.g. Marketing and Sales | Let's talk (closing) | Or get a free report | No | Organic | **COMPACT** (closing) | Service pages where a visitor decides whether Terramore fits |
| `/solutions/[slug]/[offering]` (30) | B | e.g. Digital Marketing | Let's talk (closing) | Or get a free report | No | Organic | **COMPACT** (closing) | Same template as the capability pages |
| `/industries/construction` | A | Turn the work you're already doing into your next job. | See Your Digital Footprint (email) | Let's Talk | No | Industry landing | **COMPACT recommended, deferred** | The hero is a dark photo overlay on phones; the lookup is light-surface only. A dark variant needs a visual decision. Unchanged in this pass. |
| `/integrations`, `/integrations/[slug]` (7), `/integrations/[slug]/[tool]` (15) | B | Integrations / Advertising / Google Ads… | Let's talk (closing) | Or get a free report | No | Organic | **CTA-ONLY** | Informational |
| `/articles/*` (3) | B | Article titles | Book a demo | — | No | Organic | **CTA-ONLY** | Articles link to the lookup; no form inside articles |
| `/about` | B | Big brands pay a team to find out why people do not buy… | Let's talk | Or get a free report | No | Organic | **CTA-ONLY** | Informational |
| `/resources`, `/security` | B | Start here… / Private and in your control. | Let's talk | Or get a free report | No | Organic | **CTA-ONLY** | Informational (`LindyPage`) |
| `/pricing` | C Conversion | Talk first. Pay when we start. | Book the free call | Or get a free report | No | Organic | **CTA-ONLY (booking stays primary)** | The H1 is about the call; the lookup is secondary |
| `/enterprise` | C | A growth team that can sit next to yours. | Let's talk | Or get a free report | No | Organic | **CTA-ONLY (booking stays primary)** | Enterprise buyers want a call |
| `/report/example` | D Result (sample) | Northline Atelier | Let's talk (closing) | Or get a free report | No | Organic | **CTA-ONLY** | Sample report; the closing CTA leads to the lookup |
| `/book` | C Conversion | Let's figure out what's actually holding your growth back. | Book a 30-minute conversation | See your digital footprint | No | **Paid** (ad destination, sitelink) | **NONE** | Already at the booking stage. The page is unchanged and the header keeps "Let's talk" primary. |
| `/book/manage` | C | Your call | — | — | No | — | **NONE** | Managing a booking |
| `/schedule` | C | Pick a time… | — | — | No | Report email follow-up | **NONE** | Booking stage; the header keeps "Let's talk" primary |
| `/privacy`, `/terms`, `/disclosure`, `/dmca` | E Legal | — | — | — | No | — | **NONE** | Legal pages. The header and footer still offer "Check my business". |
| Report sent / duplicate screens (popup states) | D | — | Book (report_sent_book) | — | — | — | **NONE** | Post-submission states, unchanged |
| `dashboard.terramore.io` | F Authenticated | — | — | — | — | — | **NONE** | Not in this repo; "Log in" links unchanged |

Error pages: there's no custom `not-found` page in `app/`; the Next default is unchanged (**NONE**).

## 2. What was built (one canonical lookup)

The canonical component is `components/business-lookup.tsx`, with the same endpoint, validation, analytics, dedupe hand-off and report popup everywhere. Its variants change layout only:
- `variant="full" | "compact"`: label and helper size, width.
- `align="start" | "center"`.
- `anchor`: the page's one `#check-my-business` target.

`CheckMyBusinessLink` (CTA-ONLY) scrolls to and focuses the page's lookup, or opens `/#check-my-business` and focuses the homepage lookup.

| Treatment | Exact pages |
|---|---|
| **FULL** | `/` (hero), `/marketing` (hero), `/report` (hero) |
| **COMPACT** | `/solutions` (hero; the forked `HeroWebsiteInput` now renders the canonical lookup), every `/solutions/[slug]` and `/solutions/[slug]/[offering]` (41 pages, closing `StoryCta mode="lookup"`) |
| **CTA-ONLY** | every `/integrations*` page (23, closing), the 3 `/articles/*`, `/about`, `/resources`, `/security`, `/report/example`, the homepage report band and FAQ, the `/report` mid and closing CTAs, the standard footer on every page that shows it; `/pricing` and `/enterprise` with booking still primary |
| **NONE** | `/book`, `/book/manage`, `/schedule`, legal pages, report success/duplicate states, client areas, `/industries/construction` (deferred, above) |

## 3. CTA hierarchy, before → after

| Place | Before | After |
|---|---|---|
| Header (public pages) | **Let's talk** | **Check my business** (filled) + Let's talk (outlined). On phones, "Check my business" is in the bar and "Let's talk" in the menu. Below 375 px the bar has no room, so "Check my business" leads the menu. |
| Header on `/book`, `/book/*`, `/schedule` | Let's talk | Let's talk (unchanged) |
| Report funnel header (`/report*`) | Let's talk | **Check my business** + Let's talk (from 640 px) |
| Homepage hero | **Let's talk** · "Free 30-minute call." · "Or click here for a Digital Footprint report" | **[described website field] [Check my business]** · "Free · No email needed to see the first results" · "Or book a free 30-minute call" |
| /marketing hero | **Book a demo** · See your free Digital Footprint | **[described website field] [Check my business]** · helper · "Or book a demo" |
| /report hero | **Get my free Digital Footprint report** (email form) | **[described website field] [Check my business]** · "Free · No login · No email needed to see the first results" |
| /solutions hero | Own form → email popup · Book a call → | Canonical compact lookup · "Rather talk it through? Book a call →" |
| Service-page closing (41) | **Let's talk** · Or get a free report | Compact lookup · "Or talk with us" |
| Info / integration / footer closing | **Let's talk** · Or get a free report | **Check my business** · "Or talk with us" |
| Articles | **Book a demo** | **Check my business** · "Or book a demo" |
| Pricing / Enterprise hero | **Book the free call / Let's talk** · Or get a free report | **Book the free call / Let's talk** (kept) · "Or check your business first, free" |
| Floating Schedule button | Always visible | Below `lg` it hides while the page's lookup is on screen (so it never covers the field); otherwise unchanged |

Copy: headlines, supporting copy and sections are unchanged. New copy is limited to the helper lines, "Check my business", "Or talk with us" / "Or book…", and the network-error message.

## 4. Lookup → report → booking flow (as built; tested in a headless browser)

1. **Land.** gclid/gbraid/wbraid/fbclid/ttclid/utm_* are captured to `sessionStorage.tm_report_attribution` on every route (existing `lib/attribution.ts`, unchanged).
2. **Lookup** (no email, about 2 s for terramore.io). It streams "Checking {domain}: N of 6 done", then "Checked {domain}", the business name, six source rows with findings, "Where we'd look first" (only when the lookup returns one) and the scope line.
3. **Next steps** under the result: **Email me the full report** (primary) and **Or book a 30-minute call**.
4. **Lead capture.** The existing report popup opens (`entry=popup_lookup`, direct), with the website prefilled. It asks for name, email and consent, and only here. The submit and conversions are unchanged: `generate_lead`, `report_submission_success`, the Ads report conversion, and the identity-only dedupe.
5. **Report.** The background pipeline crawls again (homepage + 5 pages), writes, and emails the PDF.
6. **Next move / booking.** From the result ("Or book a 30-minute call"), the report success screen, the header or the floating button. The booking flow and `meeting_booked` are unchanged.

| Check | Result |
|---|---|
| Value before email | **Yes.** The findings show before any email field. |
| Email requested | Only after "Email me the full report" |
| Same site crawled twice | **Yes**: the lookup (home + 2 pages), then the report pipeline (home + 5). No visitor friction; cost only. See `LOOKUP_OPEN_ITEMS.md` §C (can follow). |
| Lookup findings carried into the report | Not as data; the report re-collects them with the same collectors, so the facts agree. Snapshot hand-off is §C. |
| UTM/gclid survive lookup → report → booking | **Yes, tested.** Landing on `/marketing?gclid=…&utm_source=…&utm_medium=…&utm_campaign=…&utm_content=…&utm_term=…`, the storage was intact after the lookup, the report popup and the booking dialog. The report form and booking flow read it (unchanged code; `verify-attribution-merge`, `verify-conversion-tracking` pass). |
| Continue without starting over | **Yes.** The website is prefilled in the report popup; "Check another website" resets the lookup. |
| Obvious breaks fixed | The `/solutions` fork (a second website form with its own report hand-off) now uses the canonical lookup. The report band and `/report` CTAs no longer skip the lookup. A network failure no longer says "something went wrong on our side". |
| Known gap, not fixed here | **MC-08:** the report email's "Talk through my report" goes to `/book` with no UTM (report pipeline code; needs separate approval). |

## 5. Analytics event map

All events go through the existing V2A gate (`trackFunnelEvent`, `lib/funnel-taxonomy.ts`). They're sent to GA4 only on `www.terramore.io` / `terramore.io` and are debug-only elsewhere. The privacy filter drops anything that isn't in the taxonomy, so no domain, email or free text is ever sent. Existing conversion events are unchanged (`verify-funnel` enforces this).

| Owner's step | Event (existing name where one existed) | Parameters |
|---|---|---|
| LANDING VIEW | GA4 `page_view` (existing gtag) + `primary_cta_view` for the lookup when it's actually seen (≥ 50 % for 1 s) | `cta_id` (e.g. `home_hero_report`), `placement` |
| lookup_input_focus | **`lookup_input_focus`** (new) | `cta_id` |
| lookup_started | `primary_cta_click` (host CTA) + **`lookup_start`** | `cta_id` |
| lookup_completed / lookup_failed | **`lookup_result`** | `outcome`: `complete`, `partial`, `invalid_website`, `blocked`, `unreachable`, `rate_limited`, **`network`** (new), `error`; `lookup_id` (random) |
| next_move_viewed | `primary_cta_view` on `marketing_lookup_report` / `marketing_lookup_book` (placement `confirmation`) | |
| report_continue_clicked | `primary_cta_click` on `marketing_lookup_report` | |
| lead_capture_viewed | `report_view` (`entry=popup_lookup`), then `report_progress` (`details_shown`, `required_complete`, `submit_attempt`) | |
| lead_submitted | `generate_lead` + `report_submission_success` + the Ads report conversion (existing, unchanged) | |
| report_viewed | **Not measurable on site.** The report is an emailed PDF; opens aren't tracked. | gap |
| booking_started | `primary_cta_click` on a booking CTA (dialog open), then `booking_start` on the first answer (existing V2A rule), then `booking_progress` | `source`, `entry`, `flow` |
| meeting_booked | `meeting_booked` (existing, unchanged) | |

Measured order in the headless test on `/marketing`: `primary_cta_view` → `lookup_input_focus` → `primary_cta_click` → `lookup_start` → `lookup_result(complete)` → `primary_cta_view(marketing_lookup_report, marketing_lookup_book)` → `primary_cta_click(marketing_lookup_report)` → `report_view(popup_lookup)` → `report_progress(details_shown)` → `primary_cta_click(marketing_lookup_book)`.

New CTA ids: `header_report`, `report_header_report`, `home_closing_report`, `footer_closing_report`, `service_closing_report`, `service_closing_book`, `infopage_closing_report`, `article_closing_report`. Ported with the lookup: `marketing_lookup_report`, `marketing_lookup_book` (used on every page that hosts the lookup). The legacy `/report` events `report_cta_click` / `cta_click` (`report_primary`) still fire on the `/report` lookup submit and on its mid and closing CTAs.

## 6. Google Ads landing (no Ads change made)

| | Page |
|---|---|
| **Current landing target** (repo history; not verified in the Ads account) | `/marketing` as the destination, with `/solutions` and `/book` sitelinks. `/book` is described as "the Ads landing page for a 30-minute call". |
| **Recommended** | **`/marketing`** for marketing-intent queries: a FULL lookup in the first viewport, copy that matches the ads, booking one line below. **`/report`** for audit, grader or "Digital Footprint" intent ad groups. Keep **`/book`** as a sitelink ("Book a call"), not the main final URL. Leave the homepage to brand and organic. |
| **Why** | The lowest-friction valuable action for cold search traffic is the free check: a website field, about 2 s, findings before any email. `/book` asks a cold visitor for the highest-commitment action first. |

Owner actions in Google Ads (not done here):
1. Set the final URL(s) as above.
2. Optionally add a secondary conversion from GA4 `lookup_result` with `outcome=complete`, so bidding can learn from lookups as well as report requests. That's a separate decision; the primary conversion stays the report request.

## 7. Mobile (measured, headless Chrome, production build)

The lookup field (48 px) and its button (48 px, full width on phones) are in the **first viewport** on `/`, `/marketing`, `/report` and `/solutions` at 375×667, 390×844, 430×932, 768×1024 and 1440×900. At 320×568 the field is visible, so the visitor can start typing, and the button sits just below. No horizontal scroll at any width. On phones the lookup comes before the hero media, and the floating button steps aside while the lookup is on screen. Errors show inline (`role="alert"`, `aria-invalid`, focus back to the field), and the network failure has its own message. Screenshots are in `docs/acquisition/review/` (local).

## 8. Performance (single local runs, production build; mobile = 390×844, 4× CPU, 1.6 Mbps / 150 ms)

| Page | LCP before → after (mobile throttled) | CLS before → after | Transfer before → after | Lookup interactive (mobile throttled / desktop) |
|---|---|---|---|---|
| `/` | 1056 → 952 ms | 0 → 0 (desktop 0.085 → 0.085, pre-existing) | 2736 → 2739 KB | 3.56 s / 0.28 s |
| `/marketing` | 864 → 872 ms | 0 → 0 | 2209 → 2212 KB | 2.16 s / 0.14 s |
| `/report` | 1368 → 992 ms | 0 → 0 | 420 → 423 KB | 2.22 s / 0.11 s |
| `/solutions` | 868 → 860 ms | 0 → 0 | 316 → 318 KB | 2.00 s / 0.13 s |

First-load JS: `/` 191 → 193 kB, `/marketing` 154 → 157 kB, `/report` 128 → 131 kB, `/solutions` 154 → 156 kB.

The lookup never waits for media. Interactivity means hydration, and on the homepage that's delayed by the page's existing hero scripts. Follow-up: the homepage's 2.7 MB transfer (logo orbit, floating marks, hero analytics) delays hydration on slow phones, and a submit before hydration reloads the page. Trimming that is a separate homepage performance pass.

## 9. Funnel tests (headless Chrome against the production build, `scripts`-free; fixtures in the session record)

| | Test | Result |
|---|---|---|
| A | Valid domain (terramore.io) on `/marketing` (mobile) | Streams, then "Checked terramore.io", 6 sources, verified findings, next steps |
| B | Malformed ("not a website") | Inline alert, `aria-invalid="true"`, focus stays; no click, start or result events |
| C | Duplicate, same user | The second lookup of the same domain returns from the 15-minute cache in 3 ms with identical findings and a new `lookup_id`. Report-request dedupe: identity-only rules, `verify-report-dedupe` (10 checks). |
| D | Second user, same domain | Not blocked: report dedupe is identity-only (email, phone, name + site), so a different person can check the same business (`verify-report-dedupe`). The lookup rate limit is per IP (`verify-lookup` §7). |
| E | Some source unavailable | Google Maps "Not checked here" (no Places key locally, as on the Preview); `outcome=complete` |
| F | Mobile | §7 |
| G | Keyboard only | Tab order on `/`: nav → Log in → Let's talk → Check my business → Pause → website field, with a visible focus ring on each. Enter submits. On `/about`, the header "Check my business" via keyboard opens `/#check-my-business` with the field focused. On `/marketing` it focuses the page's own lookup. |
| H | Reduced motion | 0 running animations on `/`, including during a check (the spinner is `motion-safe`) |
| I | Network failure (offline) | "We couldn't connect. Check your internet connection, then try again." `outcome=network`, "Check another website" offered |
| J | Attribution through report | gclid + 5 UTMs intact after the lookup, the report popup (website prefilled) and the booking dialog |
| K | Booking hand-off | "Or book a 30-minute call" opens the booking dialog (`primary_cta_click marketing_lookup_book`) |

Verifiers: `verify-lookup` 93, `verify-report-dedupe` 10, `verify-funnel` 79 (26 mutations caught), `verify-conversion-tracking`, `verify-attribution-merge`, `verify-report-places`, `verify-visual` 65, `verify-v1-release`: all pass. `tsc`: the same 16 errors as production `597fd49` (file and code). `next build` passes.

## 10. Launch blockers and manual steps

**Must have for launch**
1. **Owner review** of this branch, then push for a Vercel preview, then review, then merge to `main`. Nothing is pushed yet.
2. **Cloudflare rate limit on `POST /api/lookup`** (`LOOKUP_OPEN_ITEMS.md` §A). The in-app limit (6 per IP per 10 minutes) is per serverless instance. Owner: Cloudflare dashboard → Security → WAF → Rate limiting rules. Match path `/api/lookup` and method POST; 10 requests per 10 minutes per IP; action Block (or Managed Challenge) for 10 minutes.
3. **`/report` hero copy decision (MK-02).** The hero says "We review your website, Google presence, socials, reviews, and ads". The lookup directly beneath it says "Search rankings, ad activity and reviews aren't part of it", and the full report doesn't analyze ads or reviews either (MK-02). The copy wasn't changed here, because it's an owner-approved claim. A proposed truthful line: "We review your website, contact options, tracking, search basics, social links and Google listing, then show what's working, what's missing, and where we'd look first." Not applied.

**Can follow after launch**
- `GOOGLE_PLACES_API_KEY` on Production and Preview (§B), so the Maps row checks instead of "Not checked here". Vercel → Settings → Environment Variables. The owner must supply the key; no secret was configured.
- One crawl for lookup and report: the signed snapshot hand-off (§C).
- GA4: register event-scoped custom dimensions `cta_id`, `outcome`, `placement`, `destination`, `entry` (Admin → Custom definitions) if V2A hasn't already, so the funnel can be read in reports.
- Google Ads final URLs (§6) and an optional `lookup_result` secondary conversion.
- MC-08 (the report email link to `/book` without UTM).
- `/industries/construction`: a dark-surface lookup variant (visual decision).
- Homepage hydration weight (§8).

**Production or manual steps still required (not done by the agent):** the Cloudflare rule, the Places key, GA4 custom dimensions, Google Ads final URLs, and push/preview/merge on owner approval.

## 11. Doctrine and ledger notes

- UX decision and visual decision recorded on the ledger branch `docs/marketing-growth-system` (UX: search-first hierarchy; VD: the header wordmark steps down to 20 px under 400 px so the primary CTA fits).
- Floating button: it hides only while the lookup is on screen, below `lg`, which reduces fixed bottom layers rather than adding one.
- Reduced motion: no new animation; the scroll on the "Check my business" link is instant under reduced motion.
- No new colors, fonts or radii; existing tokens (`bg-brand`, `ink`, `slate`) only.

## 2026-10-09 — Lookup field copy (owner request)

- The label "Your website" became a described field. Label: "Enter your website to check how customers find and reach your business." Description, tied to the input with `aria-describedby`: "See what's working and what's missing across search basics, contact and booking, analytics and ad tags, social profiles, and your Google Maps listing."
- Placeholder: "Enter your business's website here" (was "yourbusiness.com"). The visible label still names the field; the placeholder is never the label.
- The owner's model sentence mentioned performance, Core Web Vitals and loading speed. The lookup measures none of these (its six sources are listed above), so the description names what it actually checks. If speed checks are added to the lookup later, the copy can say so.
- Checks: all 8 verifiers pass; `next build` passes; DevTools emulation at 320×700 and 390×844 on `/`, `/solutions`, `/marketing`: no horizontal scroll. At 390 the field and button sit in the first viewport. At 320 the placeholder's last word is clipped and the button sits just below a 700 px viewport.
