# Source
Product: Wappalyzer — Technology lookup
URL: https://www.wappalyzer.com/lookup/
Capture date: 2026-10-06 23:32 PDT (2026-10-07 06:32 UTC)
Reference clip: reference-a-input.mp4 (raw 1.50–5.00), reference-b-submit.mp4 (raw 5.00–9.00)
Observed duration: 3.50 s + 4.00 s (raw recording 32.13 s)

# Literal timeline
Clip-relative times; raw in brackets.

reference-a-input.mp4
00.00–00.34 [1.50–1.84]
White page, purple top bar, grey heading "Technology lookup", body copy, line-art mascot illustration on the right (static). An expanded panel "Look up a company website" holds an outlined rectangular field with grey label text inside and a magnifier icon at the right.
00.34–00.58 [1.84–2.08]
Pointer hover (not rendered): the field border darkens slightly.
00.58–00.75 [2.08–2.25]
Field clicked. The label text inside the field moves up and to the left and shrinks (approx. 75% size) until it sits in a gap cut into the top border. The border turns purple and thicker; the magnifier turns purple. Duration about 0.15–0.2 s (approx.), decelerating.
00.75–00.90 [2.25–2.40]
Light-grey placeholder "example.com" fades in inside the field (approx. 0.1–0.15 s). Caret at the left.
00.90–01.49 [2.40–2.99]
Static focused field.
01.49–02.82 [2.99–4.32]
"terramore.io" typed character by character, ~0.11 s apart; placeholder disappears with the first character.
02.82–03.50 [4.32–5.00]
Static, field filled.

reference-b-submit.mp4
00.00–00.62 [5.00–5.62]
Static; the pointer moves to the magnifier (not rendered).
00.62–00.71 [5.62–5.71]
Click. No visible press state on the icon.
00.71–00.87 [5.71–5.87]
A grey scrim fades in over the entire page (to roughly 40–50% darkening, approx.). At the same time a white modal fades in near the top centre of the viewport. In the 5.80 frame the modal is semi-transparent (page visible through it). Fully opaque by ~5.87. The fade-in takes about 0.15 s; any scale change is small (approx. under 5%) and was not measurable with confidence.
00.87–01.50 [5.87–6.50]
Modal holds: title "Sign up to continue", a lavender band of purple text, Email and Password fields, a checkbox row, a small loading spinner in an empty band, a disabled "Sign up" button, an "or" divider, "Continue with Google", and a link. Around 6.33 the modal re-lays out (its content shifts and the modal's top edge moves up slightly, approx. 10–15 px) as the empty band grows.
01.50–02.37 [6.50–7.37]
The CAPTCHA band fills in steps: first a bare checkbox outline, then the full "I'm not a robot" reCAPTCHA box with its logo. Discrete steps.
02.37–04.00 [7.37–9.00]
Static modal over the dimmed page. The typed domain is still visible in the field behind the scrim.

# Moving elements
- Floating label (rise, shrink, move into the border notch).
- Field border color and weight.
- Placeholder fade-in.
- Typed characters, caret.
- Scrim (opacity).
- Modal (opacity, small position re-layout).
- CAPTCHA widget (third-party, loads in steps).

# Static elements
Purple top bar, breadcrumb, heading and copy, mascot illustration, chip buttons ("Research in browser", etc.), the "Analyze a list of websites" collapsed panel.

# State changes
Idle → hover → focused (label floats, placeholder shows) → filled → icon pressed → scrim + gate modal → modal re-layout → CAPTCHA loaded. No loading of a lookup, no result.

# Motion characteristics
- Floating label: up about 20 px and left a few px, scale to approx. 0.75, about 0.15–0.2 s, ease-out (Material-style outlined field), no bounce.
- Border: color/weight step at focus start.
- Placeholder: opacity 0 → 1 over approx. 0.1–0.15 s.
- Typing: discrete, ~110 ms steps.
- Scrim: opacity fade-in, approx. 0.15 s, linear-looking.
- Modal: opacity fade-in, approx. 0.15 s, essentially in place (no slide observed); then a discrete re-layout jump when the CAPTCHA area resizes.
- No rotation, spring or bounce.

# Transition type
ADDED FROM OBSERVATION: FLOATING_LABEL_RISE, TYPE_ON, MODAL_REVEAL, ADDED FROM OBSERVATION: GATE_INTERRUPT, ADDED FROM OBSERVATION: BOT_CHECK_INSERT (third-party CAPTCHA loading inside the gate), INPUT_PERSISTS_AS_CONTEXT (the domain stays visible behind the scrim).

# What appears first
The label lifting into the field's top border with a purple outline.

# What appears second
The typed domain in the outlined field.

# What appears third
A page-wide scrim and a centred "Sign up to continue" modal (a gate, not a result).

# What makes this reference useful
- A clean, well-known floating-label focus motion with measurable timing.
- A clear modal reveal (scrim and modal fade together, ~0.15 s) that keeps the input visible underneath, which is a real example of "the query stays as context while a new layer arrives".
- Shows a layout jump caused by late-loading third-party content inside a modal, an example of what to avoid.

# What we should NOT borrow
Wappalyzer branding, purple palette, the mascot illustration, the Material/Vuetify field styling as designed, all copy ("Sign up to continue", "Sign up for free to get 50 technology lookups every month"), the sign-up gate, the CAPTCHA, Google sign-in, and the post-load re-layout jump.
