# Source: HubSpot Website Grader

| Field | Value |
|---|---|
| Product | HubSpot Website Grader (free public tool, "Powered by Google Lighthouse") |
| URL as visited | https://website.grader.com/ |
| Final URL after submit | https://website.grader.com/ (no navigation; client-side validation blocked submission) |
| Capture date/time | 2026-10-06 23:30 PDT (2026-10-07 06:30 UTC) |
| Viewport | 1280×800, deviceScaleFactor 1 |
| Browser | Google Chrome 154.0.8037.98 (system install, headed), playwright-core 1.47, no login, fresh profile |
| Recording method | CDP `Page.startScreencast`, per-frame CDP timestamps, ffmpeg concat with real durations, 30 fps CFR. Real-time. |
| Cookie banner | HubSpot banner across the top; clicked "Decline All" before recording |
| Typed | `terramore.io` into the "Website" field only. The "Email" field was left empty, as the rules require. |
| Clicked | The Website field, then "Get your score" |

## Steps reached vs blocked

| Step | Status |
|---|---|
| A initial state | Reached |
| B focus | Reached (floating-label rise) |
| C typing | Reached |
| D CTA press | Reached |
| E loading/analyzing | Blocked: the form requires an email address. With the email field empty, pressing "Get your score" showed "Sorry! This doesn't look like a valid email address." and nothing was submitted. |
| F–H result | Not reached. The tool is gated behind entering personal data (email), which is out of bounds. |

Attempts: 1 recon load (screenshot and element list only, nothing typed) plus 3 capture loads. The first two failed in the capture script before typing (my locator problem; nothing typed or submitted). The third is the recording used here.

## Local media (local-only, gitignored)

| File | Duration | Raw range |
|---|---|---|
| `raw-full.mp4` | 14.97 s | 0.00–14.97 |
| `reference-a-input.mp4` | 3.50 s | raw 1.50–5.00 |
| `reference-b-submit.mp4` | 3.00 s | raw 5.00–8.00 |

Event log (raw seconds): focus click 1.94 · typing 2.85–4.20 · "Get your score" click 5.49 · error pill visible ~5.58 · static after ~5.92 until stop at 14.36.

| Still | Raw time | Clip time | What it shows |
|---|---|---|---|
| `frame-a-01.png` | 1.60 | a 0.10 | Initial: "Website" and "Email" labels centered on their underlines |
| `frame-a-02.png` | 2.05 | a 0.55 | "Website" label partway up, caret visible |
| `frame-a-03.png` | 2.40 | a 0.90 | Label settled above the line, centered caret |
| `frame-a-04.png` | 3.50 | a 2.00 | "terram" typed, large bold centered text |
| `frame-a-05.png` | 4.80 | a 3.30 | "terramore.io" complete |
| `frame-b-01.png` | 5.30 | b 0.30 | Before the click (unchanged) |
| `frame-b-02.png` | 5.60 | b 0.60 | Red error pill under Email; Email underline turns red and widens |
| `frame-b-03.png` | 5.90 | b 0.90 | "Website" label dimmed; error settled |
| `frame-b-04.png` | 7.50 | b 2.50 | Static error state |

## Copyright / local-only note

Third-party copyrighted UI captured for internal motion research only. Gitignored, local only, not for publication, not a Terramore asset, not for upload to any generator.
