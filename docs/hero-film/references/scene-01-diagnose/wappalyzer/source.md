# Source: Wappalyzer Technology Lookup

| Field | Value |
|---|---|
| Product | Wappalyzer, "Technology lookup", "Look up a company website" panel |
| URL as visited | https://www.wappalyzer.com/lookup/ |
| Final URL after submit | https://www.wappalyzer.com/lookup/ (no navigation; a sign-up modal opened over the page) |
| Capture date/time | 2026-10-06 23:32 PDT (2026-10-07 06:32 UTC) |
| Viewport | 1280×800, deviceScaleFactor 1 |
| Browser | Google Chrome 154.0.8037.98 (system install, headed), playwright-core 1.47, no login, fresh profile |
| Recording method | CDP `Page.startScreencast`, per-frame CDP timestamps, ffmpeg concat with real durations, 30 fps CFR. Real-time. |
| Cookie banner | None shown |
| Typed | `terramore.io` |
| Clicked | The "Enter a company website" field, then the magnifier icon button at the right end of the field |

## Steps reached vs blocked

| Step | Status |
|---|---|
| A initial state | Reached |
| B focus | Reached (outlined-field floating label) |
| C typing | Reached |
| D CTA press | Reached |
| E loading/analyzing | Blocked: the click opened a "Sign up to continue" modal (email, password, Google sign-in, and a reCAPTCHA "I'm not a robot" checkbox). A lookup needs an account. Nothing was entered, nothing was clicked in the modal, and the CAPTCHA was not touched. |
| F–H result | Not reached (account and CAPTCHA gate) |

Attempts: 1 recon load (nothing typed) plus 1 capture load.

## Local media (local-only, gitignored)

| File | Duration | Raw range |
|---|---|---|
| `raw-full.mp4` | 32.13 s | 0.00–32.13 |
| `reference-a-input.mp4` | 3.50 s | raw 1.50–5.00 |
| `reference-b-submit.mp4` | 4.00 s | raw 5.00–9.00 |

Event log (raw seconds): focus click 2.08 · typing 2.99–4.32 · magnifier click 5.62 · scrim starts ~5.71 · modal opaque ~5.87 · reCAPTCHA widget filled in ~6.5–6.9 · last change 7.37 · static until stop 31.51.

| Still | Raw time | Clip time | What it shows |
|---|---|---|---|
| `frame-a-01.png` | 1.60 | a 0.10 | Initial: outlined grey field with "Enter a company website" inside |
| `frame-a-02.png` | 2.15 | a 0.65 | Label moving up into the top border; border turning purple |
| `frame-a-03.png` | 2.60 | a 1.10 | Label settled in a notch in the top border; "example.com" placeholder |
| `frame-a-04.png` | 3.60 | a 2.10 | "terram" typed |
| `frame-a-05.png` | 4.80 | a 3.30 | "terramore.io" complete |
| `frame-b-01.png` | 5.50 | b 0.50 | Before the click (unchanged) |
| `frame-b-02.png` | 5.80 | b 0.80 | Grey scrim over the page; modal partly transparent |
| `frame-b-03.png` | 6.00 | b 1.00 | Modal "Sign up to continue" opaque, small spinner where the CAPTCHA will load |
| `frame-b-04.png` | 6.50 | b 1.50 | Modal re-laid out as the CAPTCHA area loads |
| `frame-b-05.png` | 8.50 | b 3.50 | Settled modal with reCAPTCHA "I'm not a robot" checkbox |

## Copyright / local-only note

Third-party copyrighted UI (including an illustrated mascot and a Google reCAPTCHA widget) captured for internal motion research only. Gitignored, local only, not for publication, not a Terramore asset, not for upload to any generator.
