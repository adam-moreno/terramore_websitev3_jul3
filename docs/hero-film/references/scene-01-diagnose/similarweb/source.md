# Source: Similarweb — Website Traffic Checker

| Field | Value |
|---|---|
| Product | Similarweb, "Website Traffic Checker" (free public tool) |
| URL as visited | https://www.similarweb.com/website/ |
| Final URL after submit | https://www.similarweb.com/website/ (no navigation; the page stayed put and showed an inline error) |
| Capture date/time | 2026-10-06 23:27 PDT (2026-10-07 06:27 UTC) |
| Viewport | 1280×800, deviceScaleFactor 1 |
| Browser | Google Chrome 154.0.8037.98 (system install, headed), driven by playwright-core 1.47, no login, fresh profile |
| Recording method | CDP `Page.startScreencast` (JPEG q92), each frame saved with its CDP timestamp, assembled with ffmpeg concat using the real inter-frame durations, resampled to 30 fps CFR. Real-time. |
| Cookie banner | Cookiebot banner; clicked "Do Not Sell or Share My Personal Information" (the decline option) before recording started |
| Typed | `terramore.io` (real keystrokes, ~105–125 ms per character as observed; script delay 70–120 ms plus key time) |
| Clicked | The search field (mouse click), then the blue "Search" button (mouse click) |

## Steps reached vs blocked

| Step | Status |
|---|---|
| A initial state | Reached |
| B focus | Reached (caret only; no visible field style change) |
| C typing | Reached; a one-row autocomplete suggestion dropdown opened ~0.3 s after the last keystroke |
| D CTA press | Reached (button tone change visible) |
| E loading/analyzing | Not observed: no spinner or progress appeared |
| F result transition | Blocked: ~0.2 s after the click an inline red error "Unable to load data. Please try again." appeared; the daily counter stayed "3/3" |
| G result reveal | Not reached |
| H immediate expansion | Not reached |

Reason: the data request failed. The page gave no reason. It is plausibly bot or automation detection, a rate limit, or no data for a small domain; this was not investigated and nothing was retried to get round it.

Attempts: 1 recon load (screenshot and element list only, nothing typed) plus 3 capture loads, the allowed maximum: attempt 1 failed in the capture script before typing (no submission); attempt 2 typed the domain but the script clicked the wrong button (a header tab), so nothing was submitted; attempt 3 is the recording used here. Attempt 2's raw frames are kept in the scratchpad only (`hero-film/raw/similarweb-attempt2/`). They show the same autocomplete dropdown and a caret blinking at ~2 Hz.

## Local media (local-only, gitignored)

| File | Duration | Raw range |
|---|---|---|
| `raw-full.mp4` | 32.83 s | 0.00–32.83 (record start = 0) |
| `reference-a-input.mp4` | 3.50 s | raw 1.50–5.00 |
| `reference-b-submit.mp4` | 3.00 s | raw 5.00–8.00 |

Event log (raw seconds): focus click 2.06 · typing 2.96–4.33 · Search click 5.63 · error visible by ~5.85 · no further change until stop at 32.18.

| Still | Raw time | Clip time | What it shows |
|---|---|---|---|
| `frame-a-01.png` | 1.60 | a 0.10 | Initial state: empty field with "Enter Website" placeholder |
| `frame-a-02.png` | 2.50 | a 1.00 | Focused, empty, caret at left |
| `frame-a-03.png` | 3.60 | a 2.10 | Mid-typing: "terram" |
| `frame-a-04.png` | 4.90 | a 3.40 | "terramore.io" typed; suggestion dropdown open below the field with one row "terramore.io" |
| `frame-b-01.png` | 5.20 | b 0.20 | Dropdown still open, pointer travelling to Search |
| `frame-b-02.png` | 5.80 | b 0.80 | Dropdown closed, field back to pill shape, error not yet shown |
| `frame-b-03.png` | 6.20 | b 1.20 | Red error line under the field; "Popular sites" line pushed down |
| `frame-b-04.png` | 7.50 | b 2.50 | Settled error state |

## Copyright / local-only note

Recordings and stills are third-party copyrighted UI captured for internal motion research only. They are gitignored, kept local only, never published, and never used as Terramore assets or as input to a generator. Only this text file and `motion-notes.md` are meant for commit.
