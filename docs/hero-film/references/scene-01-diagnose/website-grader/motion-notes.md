# Source
Product: HubSpot Website Grader
URL: https://website.grader.com/
Capture date: 2026-10-06 23:30 PDT (2026-10-07 06:30 UTC)
Reference clip: reference-a-input.mp4 (raw 1.50–5.00), reference-b-submit.mp4 (raw 5.00–8.00)
Observed duration: 3.50 s + 3.00 s (raw recording 14.97 s)

# Literal timeline
Clip-relative times; raw in brackets.

reference-a-input.mp4
00.00–00.44 [1.50–1.94]
Static dark slate page with large flat colored organic blobs in the top-left and bottom-right corners (static). Centered white heading, two underline-style fields, each with a centered label sitting on the line ("Website", "Email"), privacy text, coral "Get your score" button.
00.44–00.80 [1.94–2.30]
Website field clicked. The "Website" label moves straight up about 10–12 px and gets slightly smaller. A centered caret appears on the line. The rise takes about 0.15–0.2 s (approx.) and decelerates into place.
00.80–01.35 [2.30–2.85]
Static: raised label, blinking caret.
01.35–02.70 [2.85–4.20]
"terramore.io" appears character by character, about 0.11 s per character. Text is large, bold, white and centered, so each new character pushes the text half a character to the left (the string grows from the center outward).
02.70–03.50 [4.20–5.00]
Static, field filled.

reference-b-submit.mp4
00.00–00.49 [5.00–5.49]
Static; the pointer moves to the button (not rendered).
00.49–00.58 [5.49–5.58]
Click. No visible change to the button in the captured frames.
00.58–00.65 [5.58–5.65]
A small rounded dark-red pill with pink text "Sorry! This doesn't look like a valid email address." appears directly under the Email line. At the same moment the Email underline turns dark red and becomes wider than the field (extends about 40 px past each end, approx.). Appearance is effectively instant (within one or two captured frames).
00.65–00.92 [5.65–5.92]
The raised "Website" label fades from white to a dim grey (about 0.25 s, approx.). The Website field loses focus (no caret).
00.92–03.00 [5.92–8.00]
Static error state. Nothing navigates.

# Moving elements
- Floating "Website" label (rise on focus; dims on blur).
- Typed text growing from center.
- Caret.
- Error pill and the Email underline (appear, recolor, widen).

# Static elements
Background blobs, heading, HubSpot "Tools" lockup, privacy paragraph, button, footer links, language and FAQ buttons.

# State changes
Empty → focused (label rises) → filled → submit pressed → validation error on the other field (Email) → Website field blurred (label dims). No loading state, no result.

# Motion characteristics
- Label rise: vertical, upward, about 10–12 px, about 0.15–0.2 s, ease-out (fast start, settles), slight scale-down (approx. 0.9), no opacity change during the rise.
- Typing: discrete, ~110 ms steps, center-anchored growth (text re-centers each step, no easing).
- Error pill: discrete appear, full opacity, no slide or scale observed.
- Underline: color change plus width increase, discrete within ~1–2 frames.
- Label dim on blur: opacity/color fade over about 0.25 s (approx.), linear-looking.
- No rotation, no spring, no bounce.

# Transition type
ADDED FROM OBSERVATION: FLOATING_LABEL_RISE, TYPE_ON, ADDED FROM OBSERVATION: INLINE_VALIDATION_MESSAGE, INPUT_PERSISTS_AS_CONTEXT (the domain stays, large and centered, after the failed submit). ADDED FROM OBSERVATION: GATE_INTERRUPT (email required before any analysis).

# What appears first
The "Website" label lifting off the line, then a centered caret.

# What appears second
The domain growing outward from the center of the line in large bold type.

# What appears third
A red validation pill under the Email field (the gate), not a result.

# What makes this reference useful
- Center-anchored, large typed domain: the input itself becomes the visual subject of the frame.
- A clear, small, decelerating label rise as the only focus feedback.
- Shows where a real tool places its gate (before analysis), which is useful to know when choosing what the film should and should not depict.

# What we should NOT borrow
HubSpot branding, the "Tools" lockup, the organic blob illustration, the slate/coral palette, the font, the underline-field composition as designed, all copy ("Get your score", "Sorry! This doesn't look like a valid email address."), the "Powered by Google Lighthouse" claim, and the email-gate pattern itself (Terramore's film must not imply we collect an email before diagnosing).
