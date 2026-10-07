# Source: Ahrefs Website Authority Checker

| Field | Value |
|---|---|
| Product | Ahrefs, "Website 'Authority' Checker" (free public tool) |
| URL note | The owner's brief gave a truncated "ah-authority-checker". The real Ahrefs page used here is https://ahrefs.com/website-authority-checker |
| URL as visited | https://ahrefs.com/website-authority-checker |
| Final URL after submit | https://ahrefs.com/website-authority-checker/?input=terramore.io (the query is added to the URL with no visible page reload) |
| Capture date/time | 2026-10-06 23:35 PDT (2026-10-07 06:35 UTC) |
| Viewport | 1280×800, deviceScaleFactor 1 |
| Browser | Google Chrome 154.0.8037.98 (system install, headed), playwright-core 1.47, no login, fresh profile |
| Recording method | CDP `Page.startScreencast`, per-frame CDP timestamps, ffmpeg concat with real durations, 30 fps CFR. Real-time. |
| Cookie banner | CookieYes notice; clicked "Do Not Sell or Share My Personal Information", ticked the opt-out box, then "Save My Preferences" (privacy-preserving). The script waited for the dialog to close before recording. |
| Typed | `terramore.io` |
| Clicked | The domain field, then "Check Authority" |

## Steps reached vs blocked

| Step | Status |
|---|---|
| A initial state | Reached |
| B focus | Reached (field turns white with an amber border) |
| C typing | Reached |
| D CTA press | Reached (URL gains `?input=terramore.io`) |
| E loading/analyzing | Blocked by bot protection: ~3.9 s after the click a Cloudflare Turnstile widget ("Verifying…" with a spinner) appeared above the CTA; at ~14.0 s raw it switched to a "Verify you are human" checkbox. It was not clicked, solved or bypassed. |
| F–H result | Not reached ("blocked by bot protection at step E") |

Attempts: 1 recon load (screenshot and element list only, nothing typed) plus 3 capture loads. Capture 1 failed in the script before typing (nothing typed or submitted). In capture 2 the opt-out dialog was still open while typing and the "Check Authority" click landed on the dialog, so nothing was submitted (raw kept in scratchpad only, `hero-film/raw/ahrefs-attempt1/`). Capture 3 is the recording used here. No further attempt was made after the challenge appeared.

## Local media (local-only, gitignored)

| File | Duration | Raw range |
|---|---|---|
| `raw-full.mp4` | 32.33 s | 0.00–32.33 |
| `reference-a-input.mp4` | 3.70 s | raw 1.50–5.20 |
| `reference-b-submit.mp4` | 5.00 s | raw 5.20–10.20 |

Event log (raw seconds): focus click 1.94 · typing 2.85–4.31 · click 5.66 · URL change 5.86 · field loses focus ~6.0 · Turnstile "Verifying…" visible ~9.6 · "Verify you are human" ~14.0 · stop 31.71. A conference announcement marquee scrolls across the top for the whole recording.

| Still | Raw time | Clip time | What it shows |
|---|---|---|---|
| `frame-a-01.png` | 1.60 | a 0.10 | Initial: dark field, grey border, "Enter domain" |
| `frame-a-02.png` | 2.50 | a 1.00 | Focused: white field, amber border, caret |
| `frame-a-03.png` | 3.60 | a 2.10 | "terra" typed |
| `frame-a-04.png` | 5.00 | a 3.50 | "terramore.io" complete |
| `frame-b-01.png` | 5.50 | b 0.30 | CTA in hover (brighter orange) before the click |
| `frame-b-02.png` | 6.10 | b 0.90 | After the click: field back to dark (blurred), domain kept |
| `frame-b-03.png` | 9.50 | b 4.30 | Still waiting; no visible loading indicator |
| `frame-b-04.png` | 10.00 | b 4.80 | Cloudflare "Verifying…" widget above the CTA |

## Copyright / local-only note

Third-party copyrighted UI (and a third-party Cloudflare widget) captured for internal motion research only. Gitignored, local only, not for publication, not a Terramore asset, not for upload to any generator.
