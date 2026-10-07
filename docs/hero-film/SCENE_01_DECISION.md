# Scene 1 — motion decision

Candidates only. Clip ranges are clip-relative seconds, with raw-recording seconds in brackets. Files live in `references/scene-01-diagnose/<source>/` (media local-only). Nothing here is chosen or ranked.

Capture limits that apply to every point: no source reached a real result. Website Grader stopped at an email requirement, Wappalyzer at a sign-up modal with a CAPTCHA, Ahrefs at a Cloudflare Turnstile check, Semrush at a failed reCAPTCHA after a short progress modal, and Similarweb at "Unable to load data".

## TEXT

"We diagnose your business."

## PRIORITY POINT 1 — Domain/input interaction

Candidates:
- similarweb `reference-a-input.mp4` 00.56–03.43 [2.06–4.93]: FIELD_FOCUS_STATE (caret only), TYPE_ON (left-aligned), AUTOCOMPLETE_SUGGESTION_DROP
- website-grader `reference-a-input.mp4` 00.44–02.70 [1.94–4.20]: FLOATING_LABEL_RISE, TYPE_ON (center-anchored)
- ahrefs `reference-a-input.mp4` 00.44–02.81 [1.94–4.31]: FIELD_FOCUS_STATE (one-step dark → white), TYPE_ON
- wappalyzer `reference-a-input.mp4` 00.58–02.82 [2.08–4.32]: FLOATING_LABEL_RISE (into the border notch), placeholder fade, TYPE_ON
- semrush `reference-a-input.mp4` 00.37–02.52 [1.87–4.02]: FIELD_FOCUS_STATE (ring), TYPE_ON (with a clear icon appearing)

Differences:
All five type at about the same cadence (~0.10–0.12 s per character, discrete, no per-character easing). They differ in focus feedback and placement. Similarweb shows only a caret. Ahrefs and Semrush change style in one discrete step (a fill swap; a ring). Grader and Wappalyzer move a label with a short decelerating rise (~0.15–0.2 s). Grader's text is large and grows from the center; the others are left-aligned body-size text. Similarweb alone adds a system response before submit: a one-row suggestion panel that grows down ~0.3 s after typing stops.

Owner selection: PENDING

## PRIORITY POINT 2 — Submit interaction

Candidates:
- similarweb `reference-b-submit.mp4` 00.40–00.80 [5.40–5.80]: BUTTON_TONE_PRESS (hover darker, press lighter ~0.1 s), suggestion panel closes discretely
- ahrefs `reference-b-submit.mp4` 00.00–00.80 [5.20–6.00]: BUTTON_TONE_PRESS (hover), field returns to unfocused style, query added to URL
- semrush `reference-b-loading.mp4` 00.33–00.50 [5.33–5.50]: CTA_PRESS_TO_LOADING (button → grey with spinner, "Loading…" line)
- website-grader `reference-b-submit.mp4` 00.49–00.58 [5.49–5.58]: press with no visible button change (followed by validation)
- wappalyzer `reference-b-submit.mp4` 00.62–00.71 [5.62–5.71]: icon press with no visible change (followed by a modal)

Differences:
Similarweb and Ahrefs show the press only as a button color change. Semrush is the only one where the button itself becomes the loading indicator (label replaced by a spinner, plus an expectation line about duration). Grader and Wappalyzer show no press feedback on the control; the next visible change comes from elsewhere on the page ~0.1 s later. Ahrefs is the only one where the field visibly drops focus right after the press.

Owner selection: PENDING

## PRIORITY POINT 3 — Analyzing/loading response

Candidates:
- semrush `reference-b-loading.mp4` 00.47–02.76 [5.47–7.76]: CTA_PRESS_TO_LOADING, LOADING_SPINNER, MODAL_REVEAL (fade plus ~10–15 px settle, ~0.13 s), PROGRESS_BAR_FILL (~1.0 s, linear), AGENT_PROGRESS, modal exit fade (~0.2 s)
- wappalyzer `reference-b-submit.mp4` 00.71–00.87 [5.71–5.87]: MODAL_REVEAL (scrim and modal fade, ~0.15 s). Note: this is a sign-up gate, not analysis
- ahrefs `reference-b-submit.mp4` 00.80–04.40 [6.00–9.60]: no visible loading feedback for ~3.6 s, then BOT_CHECK_INSERT (third-party). Recorded as a negative example

Differences:
Only Semrush shows an "analyzing" beat, and its progress is not tied to real state: the label reads 100% before the bar fills, and the error tooltip is already present behind the modal. Wappalyzer's modal motion is comparable in timing but its content is a gate. Ahrefs shows what an absent loading state looks like: a long static wait. Similarweb and Grader went straight from press to an error with no loading state.

Owner selection: PENDING

## PRIORITY POINT 4 — Primary result reveal

Candidates:
- None captured. No source reached a result (see capture limits above). The taxonomy entries PRIMARY_RESULT_REVEAL, PROGRESSIVE_FINDINGS, COMPACT_TO_DETAILED and SUBMIT_TO_NEW_VIEW are "Not yet captured".
- For reference only (not results): the in-place post-submit responses: similarweb `b` 00.80–00.90 [5.80–5.90] INLINE_VALIDATION_MESSAGE (discrete insert, content below reflows ~14 px); website-grader `b` 00.58–00.92 [5.58–5.92] INLINE_VALIDATION_MESSAGE plus label dim; semrush `b` 02.56–02.76 [7.56–7.76] modal fade-out revealing a tooltip.

Differences:
No result reveals to compare. The in-place responses differ in whether surrounding content reflows (Similarweb, yes) or the message overlays without shifting layout (Semrush tooltip; Grader pill shifts nothing visible). All are discrete or very short (≤ 0.2 s).

Owner selection: PENDING

## PRIORITY POINT 5 — End state / transition-ready state

Candidates:
- similarweb `reference-b-submit.mp4` 00.90–03.00 [5.90–8.00]: INPUT_PERSISTS_AS_CONTEXT (domain in field, static)
- website-grader `reference-b-submit.mp4` 00.92–03.00 [5.92–8.00]: INPUT_PERSISTS_AS_CONTEXT (large centered domain, static)
- ahrefs `reference-b-submit.mp4` 00.46–04.40 [5.66–9.60]: INPUT_PERSISTS_AS_CONTEXT (domain in field and in URL), with TEXT_MARQUEE_BANNER still moving at the top
- wappalyzer `reference-b-submit.mp4` 02.37–04.00 [7.37–9.00]: INPUT_PERSISTS_AS_CONTEXT behind a MODAL_REVEAL scrim
- semrush `reference-b-loading.mp4` 02.76–04.00 [7.76–9.00]: INPUT_PERSISTS_AS_CONTEXT, static

Differences:
Every source ends with the typed domain still visible, so the query persists as context in all of them. They differ in what surrounds it. Grader and Similarweb end on a fully static page. Ahrefs never becomes fully static because of its looping banner. Wappalyzer ends dimmed under a modal. Semrush returns to its pre-submit layout plus a tooltip. None ends on a result frame that a next scene could carry over.

Owner selection: PENDING
