# Source: Semrush SEO Checker (Site Audit)

| Field | Value |
|---|---|
| Product | Semrush "SEO Checker — Powered by Semrush Site Audit" (free public tool) |
| URL as visited | https://www.semrush.com/siteaudit/ |
| Final URL after submit | https://www.semrush.com/siteaudit/ (no navigation) |
| Capture date/time | 2026-10-06 23:33 PDT (2026-10-07 06:33 UTC) |
| Viewport | 1280×800, deviceScaleFactor 1 |
| Browser | Google Chrome 154.0.8037.98 (system install, headed), playwright-core 1.47, no login, fresh profile |
| Recording method | CDP `Page.startScreencast`, per-frame CDP timestamps, ffmpeg concat with real durations, 30 fps CFR. Real-time. |
| Cookie banner | Clicked "Do not sell or share my personal information" (the non-consent option); "Allow all cookies" was not clicked. The banner was gone during recording. |
| Typed | `terramore.io` |
| Clicked | The domain field, then "Analyze Website" |
| Page variant | The recon load showed a centred hero; the capture load showed a left-aligned hero with the same elements. Probably a page variant; not investigated. |

## Steps reached vs blocked

| Step | Status |
|---|---|
| A initial state | Reached |
| B focus | Reached (blue focus ring) |
| C typing | Reached (a clear "×" appears in the field) |
| D CTA press | Reached: the button turns grey with a spinner, and a faint "Loading… It may take 2-3 min" line appears under it |
| E loading/analyzing | Reached, partially: a modal "We're performing your SEO audit…" with a "Progress 100%" label and a filling bar appeared for about 2.1 s |
| F result transition | Blocked by bot protection: the modal faded out and a tooltip "We couldn't verify that you're human. Please try again." sat next to the button (an invisible reCAPTCHA Enterprise check is on the page). Not retried, nothing bypassed. |
| G result reveal | Not reached |
| H immediate expansion | Not reached. At raw ~21 s an unrelated promotional modal ("Don't get left behind again", AI Visibility Toolkit upsell) opened over the page; it is in `raw-full.mp4` but not clipped. |

Note: the "We couldn't verify…" tooltip is already visible behind the progress modal at raw 6.5 s, so the progress modal kept animating after the check had failed.

Attempts: 1 recon load (nothing typed) plus 1 capture load.

## Local media (local-only, gitignored)

| File | Duration | Raw range |
|---|---|---|
| `raw-full.mp4` | 36.83 s | 0.00–36.83 |
| `reference-a-input.mp4` | 3.50 s | raw 1.50–5.00 |
| `reference-b-loading.mp4` | 4.00 s | raw 5.00–9.00 |

Event log (raw seconds): focus click 1.87 · typing 2.78–4.02 · click 5.33 · button loading ~5.47 · scrim/modal in ~5.50–5.63 · bar fills ~6.03–7.06 · modal out ~7.56–7.76 · promo modal ~20.98–22.12 · stop 36.26.

| Still | Raw time | Clip time | What it shows |
|---|---|---|---|
| `frame-a-01.png` | 1.60 | a 0.10 | Initial: rounded field "Enter a domain or website URL", lilac "Analyze Website" button |
| `frame-a-02.png` | 2.50 | a 1.00 | Focus: blue ring around the field, caret |
| `frame-a-03.png` | 3.40 | a 1.90 | "terram" typed; clear "×" at the right of the field |
| `frame-a-04.png` | 4.80 | a 3.30 | "terramore.io" complete |
| `frame-b-01.png` | 5.50 | b 0.50 | Button greyed with spinner; "Loading… It may take 2-3 min" under it |
| `frame-b-02.png` | 6.50 | b 1.50 | Progress modal over a dark scrim; label "Progress 100%"; bar about 40% filled |
| `frame-b-03.png` | 7.05 | b 2.05 | Bar fully filled |
| `frame-b-04.png` | 7.60 | b 2.60 | Modal and scrim fading out; error tooltip visible beside the button |
| `frame-b-05.png` | 8.50 | b 3.50 | Settled: domain in field, button back to lilac, tooltip "We couldn't verify that you're human. Please try again." |

## Copyright / local-only note

Third-party copyrighted UI (including G2 badges inside the later promo modal) captured for internal motion research only. Gitignored, local only, not for publication, not a Terramore asset, not for upload to any generator.
