# /marketing: current state and approved scope

**Updated:** 2026-10-06.

## Repo and release state

| | Value |
|---|---|
| Repo | `adam-moreno/terramore_websitev3_jul3` (www.terramore.io) |
| Working branch | `feature/marketing-growth-system`, worktree `/Users/adammoreno/Projects/terramore-website-growth-system` |
| Branch head | `736f8d2` pushed (lookup). Local commits added in this pass are listed in `DEVELOPMENT_LOG.md` |
| Production | `origin/main` **597fd49** (copy-only interim hero). Last production deploy 2026-10-06 08:07 UTC |
| Merged to main | **No** |
| Last preview | https://terramore-website-final-btox1skho-terramore-io.vercel.app/marketing (Vercel login required) |

## Approved scope (owner clarification, 2026-10-06)

Nothing else on /marketing is being redesigned. The only intended visual change is the **right-side hero media slot**. It is produced reference-first (see `README.md`, `SCENE_01_*`), and Scene 1 is pending owner selection.

Functional work that is in scope:
- The free business lookup as the primary conversion
- Safety fixes
- Analytics

## Inventory: branch vs production (597fd49)

Classes:
- **A** functional lookup/backend (preserve)
- **B** security/safety fix (preserve)
- **C** analytics/attribution (preserve)
- **D** hero media slot only
- **E** broader visual/content/layout change, **not in the clarified scope**

| File | Class | What changed |
|---|---|---|
| `app/api/lookup/route.ts` | A | Lead-free streaming lookup endpoint, rate limit, cache |
| `lib/lookup/run.ts`, `lib/lookup/types.ts` | A | Lookup runner (reuses report collectors), event types |
| `components/business-lookup.tsx` | A | Reusable `BusinessLookup` + `LookupReportButton` / `LookupBookButton` |
| `components/marketing/primary-action.tsx` | A | The /marketing slot that renders the lookup with literal CTA ids |
| `lib/report/collect/site-experience.ts` | A | Optional `maxExtraPages` (report default unchanged: 5) |
| `scripts/verify-lookup.mjs` | A/B | Lookup verifier (60 checks) |
| `lib/report/duplicates.ts`, `scripts/verify-report-dedupe.mjs` | A | Identity-only dedupe (this pass, local) |
| `lib/report/collect/public-url.ts`, `lib/report/collect/fetch.ts` | B | SSRF guard; redirects re-checked per hop |
| `app/api/report/route.ts` | B | Duplicate log line no longer prints the email (this pass, local) |
| `lib/funnel-taxonomy.ts` | C | `lookup_start`, `lookup_result`, `marketing_closing_*`, `marketing_lookup_*`, `popup_lookup` |
| `components/report-popup.tsx`, `components/report-form.tsx` | C | `entry` override; `started` fires for every direct-style entry |
| `components/marketing/growth-journey.tsx`, `journey-artifacts.tsx`; the `gs-` block in `app/globals.css`; `JOURNEY` in `lib/marketing-system.ts` | D | The current right-side hero media (animated journey board). Placeholder for the Scene 1 film; it is to be replaced after reference selection, so it is not a locked design |
| `app/marketing/page.tsx` | **mixed** | See below |
| `components/marketing/system-leaks.tsx`, `system-map.tsx`, `stage-visuals.tsx`, `next-move-loop.tsx`; `STAGES`/`LEAKS` in `lib/marketing-system.ts` | E | New page sections: problem diagram, dark system band, four chapters, After launch |
| `public/marketing/next-move/*-2x.webp` | E | TerraIQ captures used by the E sections |
| `components/site-header.tsx` | E | Wordmark h-5 below 360 px (affects every page at that width) |
| `DEVELOPMENT_LOG.md` | docs | Entries for each pass |

**`app/marketing/page.tsx`, split by part:**

| Part | Class | Notes |
|---|---|---|
| Hero CTA slot: the report/book buttons replaced by the lookup + "Or book a 30-minute call" | A | Keep |
| Hero right column: renders `GrowthJourney` | D | The media slot |
| Hero left copy: eyebrow "Marketing, built as one system", H1 "Turn attention into customers.", new supporting line | **E** | Production copy: "Software, strategy, and execution" / "We find what your business needs next. Then we get it done." (owner-approved VD-029 copy) |
| Metadata: title "Marketing, built as one growth system", new description, openGraph image restored | E (the OG image restore is B-ish) | |
| Everything below the hero: carousel, ad-fatigue photo, pocket CTA bands, count-up stats, creative tiles, steps, articles and FAQ replaced by leaks → system band → 4 chapters → After launch → two-path CTA → trimmed FAQ → restyled articles; footer dual CTAs off | **E** | Includes removal of the live month-to-month FAQ answer (see `docs/TERMS_COPY_CONFLICT.md`) and of count-up stats that VR-34 forbids |

## Recommended production-safe split (not done; needs owner go-ahead)

Branch from `origin/main` (597fd49) as `marketing/lookup-hero-media`. Then:
1. Cherry-pick the A, B and C files as they are.
2. In the **production** `app/marketing/page.tsx`:
   - replace only the two hero CTAs with `MarketingPrimaryAction` (lookup + "Or book a 30-minute call");
   - add the right-column media slot (the journey board until Scene 1 is approved, or empty);
   - keep the production hero copy and every section below it unchanged.
3. `marketing_closing_report` / `marketing_closing_book` exist only for the redesigned page's closing section.
   - Either keep their usage at the live page's closing CTA, or drop the two ids from the taxonomy (verify-funnel requires every approved id to be used).
4. Leave the E files on `feature/marketing-growth-system` as an unshipped concept.

## Production status

Nothing from this branch is live. Production /marketing is the copy-only hero at 597fd49.
