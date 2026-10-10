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

## 2026-10-09 — Desktop homepage hero, tool-first layout (owner request; local prototype)

- **Ask.** The desktop hero read as busy. The owner pointed to a public page-speed checker as an example of placement and amount of text: headline, one supporting line, the field and button in one row, then an empty results card. A reference, not a template: none of its colors, imagery, score gauges or red/amber/green scale are used.
- **What changed, md and up only (mobile unchanged).** New lookup `variant="hero"`. The brand line "We find where the business wins today…" is hidden; the lookup label becomes the one supporting line (20 px, balanced). The six-source description stays for screen readers (`aria-describedby`) and is shown visually as a "What the free check looks at" card under the field, each source "Not checked yet". Running the check replaces that card with the streaming results in the same place.
- **Honesty.** The idle card shows no scores, numbers or sample findings (VR-29, VR-30), and no gauges (the Scene 1 spec also excluded them).
- **Open for the owner.** Whether the brand line should come back on desktop (for example under the H1, or lower on the page); whether the integration logo orbit (a V1 constraint) stays in this hero.
- **Checks.** All 8 verifiers pass; TypeScript 16 (unchanged); no horizontal scroll at 1024, 1280, 1440 or 390. A real lookup of terramore.io on localhost filled the card ("Checked terramore.io").

## 2026-10-09 — Website score card and Slack section (owner request; local)

- **Owner ask.** Less visual noise; the Slack demo as its own section rather than overlapping the hero; a roomier "what we check" card that shows zeroes like a score before the check, and makes the two steps obvious: an instant score, then the full report by email.
- **Score (new, `lib/lookup/score.ts`).** A count of basics in place, out of 12 fixed basics the check can see on the public website: clear next step (1); online booking, phone number, form or email (3); analytics or ad tracking (1); page title, search description, sitemap, secure connection, set up for phones (5); social profiles linked (1); Google Maps listing (1). It is a count, never a rating. A basic the check couldn't read (a failed or unavailable source, an unconfirmed booking link) is left out of the count, and the card says how many couldn't be checked. Explained where shown (UX §3.19). Green fill = in place; gray = not checked; no red (VR-03).
- **Findings now name every missing basic.** New gaps `contact.no_phone` and `contact.no_message` (only when `no_contact` doesn't already say it), added to the first-look order after `no_contact`. `social.none` changes from a note to a gap so the score and the findings agree. **Owner to confirm** that "no social profiles linked" should count against the score.
- **Card (hero variant).** Idle (md and up): ring at 0 of 12, six source tiles at 0, and steps "1 Instant score" / "2 Full report by email". Running the check fills the same card; when it finishes, step 1 shows done and "Email me the full report" (existing report popup, unchanged funnel ids) sits under step 2, with "What we found" listing the evidence below. Mobile idle is unchanged; mobile results use the same card.
- **Slack demo** is its own section under the hero (no overlap).
- **Checks.** All 8 verifiers pass (lookup 105 checks, incl. 12 new for the score and named gaps); TypeScript 16 (unchanged); `next build` passes; no horizontal scroll at 320, 390, 768, 1024, 1280 or 1440; real lookup of terramore.io on localhost: "8 of 11 basics in place, 1 couldn't be checked" (Maps: no Places key locally).

## 2026-10-09 — Digital Presence Score teaser, red/orange/green scale (owner decision; local)

- **Reference pass.** Ran terramore.io through the Cloudways page-experience checker (owner request). Observed: four rings (Performance 89 orange, Accessibility 91, Best Practices 96, SEO 100 green), a "Score scale" legend under the card (0–49 / 50–89 / 90–100), a "previous score" line, loading as a thin progress bar on the card's bottom edge, and a Lighthouse error dialog on the apex domain. Its "7 Key Factors" section is static: the same before and after a test, not per-site results.
- **Replaces the 12-basics count** (`lib/lookup/score.ts` removed; "0 of 1" meant little to an owner). The lookup now emits the **full report's own Digital Presence Score** (`scoreDigitalPresence` from `lib/report/score/digital-presence.ts`): overall plus Digital Experience, Discoverability, Trust & Credibility, Conversion Readiness and Technical Health, each 0–100. The lookup adds `collectCatalog` so Conversion uses the same inputs. Only numbers and labels leave the server: no factor evidence, no Places values. The card says how many pages were read, whether Maps was checked, and that the full report reads more pages so its score can differ.
- **Score scale (owner decision, 2026-10-09).** 0–49 red-600, 50–89 orange-600, 90–100 green-600, with a "Score scale" legend; the number always shows inside the ring, so color is never the only signal. **This overrides VR-03 (red for errors only) for score rings on this card.** Needs a VD ledger entry. Graphic contrast on white: red-600 4.8:1, orange-600 3.6:1, green-600 3.3:1 (all at least 3:1).
- **After the check, a new section "What goes into your score":** five factor cards (icon, name, this site's score with its band dot, and "What counts", written from the scoring code), then "What we found" (the findings), then the Slack section. This is per-site, unlike the reference's static tips.
- **Teaser step 2** names what the full report adds, from its real sections: the evidence behind every score, competitive context ("how you compare"), and the top five actions.
- `social.none` returns to a note (the count that needed it is gone). `contact.no_phone` / `contact.no_message` stay. The findings footer now says the check can include the Google listing (Trust uses it when confirmed).
- **Checks.** All 8 verifiers pass (lookup 99, incl. the score shape and no-evidence checks); TypeScript 16 (unchanged); no horizontal scroll at 320–1440. Local lookup of terramore.io: overall 64 (DX 76, Discoverability 58, Trust 44, Conversion 63, Technical 95); Maps not checked locally (no Places key).

## 2026-10-09 — Five equal rings; overall as a summary (owner request; local)

- No Overall ring: the five area rings are one size, idle and after the check. After the check, a summary under the rings gives the overall score (with its band dot and what it weights), the strongest and weakest area, and "Where we'd look first" (moved from the findings list, so it shows once).

## 2026-10-09 — The free journey: socials, advertising, report and workspace; AEO; https:// field (owner request; local)

- **Owner ask.** Replace "Check another website" as the next move with an invitation to add social profiles, re-score, then ask about advertising (where Windsor fits), then the report and Growth Workspace. Add AEO beside SEO. Show "https://" in the field; accept any site with or without www.
- **Journey (hero variant, after the first score).** A "Step N of 4" card under the score, one question at a time, each optional; the four steps also show in the score card with done/current marks (`aria-current="step"`; focus moves to each new question's heading).
  1. Instant score.
  2. "Do you have social media accounts?" Profiles the site already links to show as "found on your site, already counted"; the rest are optional fields (Instagram, Facebook, TikTok, YouTube, LinkedIn) that take a name, "@name" or a pasted profile link. Any subset works (only TikTok, only Instagram, all of them). "Update my score" re-scores; the card says "Your score went up from 64 to 65" and the overall summary shows "(up from 64)". "I don't use social media" skips ahead.
  3. "Have you advertised before?" Google Ads, Facebook & Instagram ads, TikTok ads, somewhere else, or not yet. The answer points to the Growth Workspace as where ad accounts connect.
  4. Full report and free Growth Workspace: the existing "Email me the full report" (report popup → success → Growth Workspace, UX-029), or book a call. **This is the first point that needs an email and an account**: the report is emailed, and connecting ad accounts needs a workspace (consent, and per-tenant grants in the Windsor design).
  "Check another website" stays as a small link under the findings.
- **Re-scoring added profiles.** `POST /api/lookup { website, socials }`. An added profile counts as found, the full report's own rule (+4 Discoverability each, up to 20), so adding profiles can raise the score but never lower it; it's marked "Added by you, not checked" and a gap says the website doesn't link to it. The route keeps the site's scoring inputs in its 15-minute cache, so a re-score on the same instance doesn't read the site again; otherwise it re-reads with the profiles. Handles are parsed to a plain name on the platform's own host (`lib/lookup/socials.ts`); a pasted link to any other host is refused.
- **AEO (`lib/lookup/aeo.ts`).** Search basics is now "Search basics (SEO & AEO)". New findings, listed but not scored (the score stays the report's method): structured data (schema.org types in JSON-LD), whether robots.txt blocks AI answer-engine crawlers (GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended; only a whole-site disallow counts), and an FAQ answer engines can quote.
- **Website field.** "https://" is shown as a fixed prefix; a pasted http(s):// is dropped. With or without www both work: if the address as typed doesn't resolve or returns no pages, the lookup tries the other form (`alternateWww`; subdomains left alone). Placeholder is now "yourbusiness.com" (the earlier sentence placeholder read oddly after "https://"); **owner to confirm**.
- **Not done, needs approval.** (a) Added profiles and the advertising answer don't reach the emailed report or the workspace: the report request path (`report-form`, `/api/report`) is a must-not-change area. (b) No funnel events for the social and advertising steps yet (analytics taxonomy is protected). (c) Step 3's "We'll help you set it up" promises staff help connecting ad accounts; Windsor isn't connected (dashboard `intelligence/windsor-connector`, local only), so **owner to confirm** that promise or soften it.
- **Checks.** All 8 verifiers pass (lookup 117 checks: handle parsing and host refusal, AEO robots parsing, re-score +4 per added profile, linked stays linked, www fallback); TypeScript 16 (unchanged). Browser (headless Chrome, local): www.terramore.io typed with https:// → scored 64; TikTok added → 65 ("up from 64"); advertising → report step; no horizontal scroll at 1280, 390, 320.

## 2026-10-09 — Score card peeks at the fold; scale at top right; orbit settles, no Pause button (owner request; local)

- **Peek.** On desktop the headline block grows with the window (`min-height: clamp(0, 100svh − --hero-peek, 32rem)`, `--hero-peek` 600 px, 572 px under 820 px tall, where the headline is 58 px and the gaps tighter), so the idle score card's rings sit on the fold, about half showing: a cue to scroll. Measured ring visibility: 1024×768 48%, 1280×800 50%, 1366×768 48%, 1440×900 50%, 1536×864 50%, 1680×1050 50%, 1920×1080 50%; 1920×1200 shows the whole card (cap). Phones unchanged.
- **Check starts → the card scrolls up** (`#lookup-score`, `scroll-mt-28`; smooth, or instant under reduced motion), so results don't fill in below the fold.
- **Score scale** moved to the card's top right, under the description and above the area names.
- **Pause button removed (owner).** The orbit looped forever, so removing only the button would fail WCAG 2.2.2 (Level A) and VR-47. Instead the marks drift for the first 5 s the hero is on screen, then stop where they are (one-shot timer, never restarts); reduced motion stays still from the start. `verify-visual` rules `autoplay-has-control` and `hero-logos-visible-arc` now accept motion that stops itself within 5 s (a ≤ 5000 ms `setSettled(true)` timer gating `!settled`); anything longer still needs a Pause control. Needs a VD ledger note beside VD-018.
- **Checks.** All 8 verifiers pass; TypeScript 16 (unchanged); no horizontal scroll 320–1440; the full journey (check → TikTok added, 64 → 65 → advertising → report) still passes at 1280.

## 2026-10-09 — Headline and search grouped and centred; orbit follows the group; logos rest clear after 5 s (owner request; local)

- **Grouping.** The headline is now the lookup's `header` (hero variant), so headline, supporting line, field and booking link are one block, vertically centred in the space above the score card (equal space above and below: 66/60 px at 1440×900, 156/150 at 1920×1080). That space still grows with the window so the idle rings sit half on the fold (44–50% from 1024×768 to 1920×1080).
- **Orbit was following the card.** It centres on `[data-hero-copy]`, which had grown to include the score card; the marker is now on the headline-and-search group only, so the orbit wraps that group again.
- **Settling.** After the 5 s drift the marks dip to half opacity for 300 ms (the reviewed 0.5 floor for the marks, rule `hero-logos-not-desaturated`) and reappear at their resting spots on the visible outer curves, which now avoid the search field as well as the headline. Before, they froze wherever they were, sometimes behind the type.
- **Checks.** All 8 verifiers pass; TypeScript 16; no horizontal scroll 320–1440; full journey passes at 1280.

## 2026-10-09 — Endless orbit restored, with a compact pause control (owner request; local)

- **Why it had stopped.** Removing the labelled Pause button was done by stopping the orbit after 5 s (WCAG 2.2.2 / VR-47: motion longer than 5 s needs a pause control). The owner wants the endless loop, so the loop is back exactly as before (42 s, travelling marks through the mask hole) and the pause control returns in a quieter form.
- **Control.** `MotionToggle` gains `compact`: icon only (Pause/Play), still a 44×44 px target, named "Pause logo animation" / "Play logo animation" with a matching tooltip. It sits in the hero's lower-left corner near the fold (`left-4`/`lg:left-6`, `top: 100svh − 8.5rem`), not top right. Reduced motion: marks rest still, no control.
- **Kept from the settle work:** the resting layout (reduced motion) avoids the search field as well as the headline; `verify-visual` keeps accepting a ≤ 5 s self-stop as an alternative to a control (not used here).
- **Checks.** All 8 verifiers pass; TypeScript 16. Browser: a mark keeps moving at 3 s, 12 s and 13.5 s at 1440×900 and 1024×768; the control pauses it (position unchanged over 2 s) and flips to "Play logo animation".

## 2026-10-09 — Steps explain the value, "level of investment", scroll-lit gold, card higher (owner request; local)

- **Card higher.** Desktop now shows the full idle rings, with the fold cutting the top of the step titles: 1440×900 −12 px, 1680×1050 and 1920×1080 −14 px, 1920×1200 −40 px (title tops above the fold). Laptops nearer 800 px tall show the full rings and the investment row, with titles just under the fold (1280×800 +23, 1536×864 +24, 1366×768 and 1024×768 +55). To make room: headline 72 → 64 px (54 px under 820 px tall), rings 96 → 84 px from lg, single-line area names from lg, tighter card and hero top spacing; `--hero-peek` 470 px, cap 46 rem.
- **Steps.** Each of the four steps has two bullets on why it matters (owner's draft, kept to what's live): (1) how a new customer finds the business and what they see; free, no email. (2) more of where customers find you; connected later, how content brings customers in and keeps them. (3) connect ad accounts and see where spend works and where it doesn't; new to ads, we explain and help past first hurdles. (4) email gets the free in-depth report; free Growth Workspace "where accounts like Shopify, Google Business Profile, Google Ads, Meta, TikTok and Google Analytics will connect". **Owner draft softened:** "We can reduce your spend" → "see where your spend works and where it doesn't" (no savings promise, VD-019); step 4 says accounts *will* connect (future tense), because Windsor isn't connected yet. Change to present tense only when connections are live.
- **Level of investment.** Above the steps, "Your level of investment": a four-bar rising meter per step with what the owner shares ("Your website", "+ Your social profiles", "+ Your ad accounts", "+ Your email"). Bars are decorative; the words carry the meaning.
- **Scroll-lit gold.** Before a check, scrolling lights the steps 1 → 4 (number circle gold-from with ink number and ring; bars gold). Scroll-driven, never plays on its own, colour only (no movement; transitions off under reduced motion). After a check the steps show real progress instead (done green, current blue). Measured at 1440×900: scroll 0 → 1 lit, 120 → 2, 240 → 3, 360 → 4.
- **Headline.** "the business you already built." is all gold-ink (was "business you already built."), the darker gold allowed for large display words (VR-08).
- **Button font.** Every button and button-style link already uses the site's body font, Arial (checked on /, /marketing, /report, /book, /solutions). Nothing changed. Google's own UI fonts (Roboto, Google Sans) would be a new typeface: VR-02 / VD-004, owner decision.
- **Windsor.ai connectors (checked on windsor.ai/data-sources, 2026-10-09):** Shopify, Google My Business (Business Profile), Google Ads, Facebook Ads (Meta), Facebook Page Insights, Instagram Insights, TikTok Ads, TikTok Organic, Google Analytics 4, Google Search Console, YouTube, Microsoft Ads, LinkedIn Ads, Pinterest Ads, Snapchat Ads, Amazon Ads, WooCommerce, Square, Stripe, Klaviyo, Mailchimp, HubSpot. Yelp not seen in the part of the page read.
- **Checks.** All 8 verifiers pass; TypeScript 16; no horizontal scroll 320–1440; full journey passes at 1280 and 390.

## 2026-10-09 — Slower gold sequence; orbit pause control removed (owner exception)

- Gold steps: one step per ~0.175 of the screen height of scrolling (was 0.125), so about 160 px per step at 900 px tall; colour transitions 700 ms (was 300).
- **Owner exception to VR-47 / WCAG 2.2.2 (2026-10-09):** the hero logo orbit loops with no pause control. Kept: the marks rest still under reduced motion, and the loop holds while the hero is off screen or the tab is hidden. Known risk: WCAG 2.2.2 is Level A, and the project's floor is WCAG 2.2 AA, so this is a recorded accessibility failure on desktop. `verify-visual` names it in `MOTION_CONTROL_EXCEPTIONS` (rules `autoplay-has-control`, `hero-logos-visible-arc`); the reduced-motion requirement still applies. Needs a VD ledger entry.

## 2026-10-09 — "What Terramore does for your business" section (owner request; local)

- New section under the hero, above the Slack demo (`components/what-terramore-does.tsx`): eyebrow "How we work with businesses", H2, the owner-approved /marketing line (VD-029), and four stages on one path: Find / See the broken step, Connect / Work inside your tools, Act / Follow up the same day, Measure / Leave a 90-day plan. Stage copy is the existing How-we-work wording (`components/terramore-toolkit.tsx`), shortened; no new claims. "See each step in detail" links to `#how-we-work`.
- Motion: library D3 (path draws with stages settling as the line reaches them), purpose sequence, once on first view (1.4 s path, stages 0.35 s apart), never loops. Drawn at rest when reduced motion is on, when the section is already on screen at load, or without IntersectionObserver. Tokens only (`theme(colors.brand.DEFAULT)`); vertical line on phones.
- Checks: all 8 verifiers pass; TypeScript 16; no horizontal scroll at 1440 or 390; captured mid-draw and settled at both widths.

## 2026-10-10 · Step 06 copy: "Leave with a 90-day plan"

Owner direction: the plan arrives within days, a week at most, and covers the quarter. Step 06 of How we work (`components/terramore-toolkit.tsx`) and the Measure stage (`components/what-terramore-does.tsx`) now read "Leave with a 90-day plan", and the copy says the written plan for the quarter comes within days, a week at most (it previously described a day-90 retrospective).
