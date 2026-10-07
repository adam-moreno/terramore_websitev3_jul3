# Source
Product: Semrush — SEO Checker (Powered by Semrush Site Audit)
URL: https://www.semrush.com/siteaudit/
Capture date: 2026-10-06 23:33 PDT (2026-10-07 06:33 UTC)
Reference clip: reference-a-input.mp4 (raw 1.50–5.00), reference-b-loading.mp4 (raw 5.00–9.00)
Observed duration: 3.50 s + 4.00 s (raw recording 36.83 s)

# Literal timeline
Clip-relative times; raw in brackets.

reference-a-input.mp4
00.00–00.37 [1.50–1.87]
Pale mint-to-lavender vertical gradient background. Large black "SEO Checker" heading, left-aligned. A white rounded field "Enter a domain or website URL" and a lilac rounded "Analyze Website" button beside it, "1/1" counter under the button, example chips "google.com" and "apple.com". A small reCAPTCHA badge is fixed at the bottom-left.
00.37–00.43 [1.87–1.93]
Field clicked. A light-blue focus ring (approx. 2 px) appears around the field in a single step; caret at the left.
00.43–01.28 [1.93–2.78]
Static focused field, caret blinking (~2 Hz).
01.28–02.52 [2.78–4.02]
"terramore.io" typed character by character, ~0.10–0.11 s apart. With the first character a grey "×" clear icon appears at the right end of the field.
02.52–03.50 [4.02–5.00]
Static, field filled.

reference-b-loading.mp4
00.00–00.33 [5.00–5.33]
Pointer moves to the button (not rendered).
00.33–00.47 [5.33–5.47]
Click.
00.47–00.50 [5.47–5.50]
The button turns flat light grey; its label is replaced by a small dark spinner (rotating arc). The focus ring disappears. A faint pale line "Loading… It may take 2-3 min" appears under the button.
00.50–00.63 [5.50–5.63]
A dark translucent scrim fades in over the whole page while a pale-mint modal with rounded corners fades in near the top centre. In the 5.57 frame the modal is partly transparent and sits about 10–15 px higher than its final position; by 5.63 it is opaque and in place (approx. slide down plus fade, about 0.13 s).
00.63–01.03 [5.63–6.03]
Modal holds: small grey label "Progress 0%", an empty white bar, large black "We're performing your SEO audit…", upsell copy, four check-mark bullets, a black "Try Semrush One" pill button.
01.03–02.06 [6.03–7.06]
The label changes in one step to "Progress 100%". A black rounded bar then grows from the left edge to the full width of the track over about 1.0 s, at a roughly constant rate (approx. linear; about 40% at 6.50, about 90% at 6.90, full at 7.03).
02.06–02.56 [7.06–7.56]
Full bar held.
02.56–02.76 [7.56–7.76]
Modal and scrim fade out together (about 0.2 s, approx.). In the 7.60 frame the modal is semi-transparent. A white tooltip box beside the button, already there behind the modal, becomes visible: "We couldn't verify that you're human. Please try again." The button is back to lilac "Analyze Website".
02.76–04.00 [7.76–9.00]
Static: domain in the field, tooltip beside the button. (Outside the clip, at raw ~21 s, an unrelated upsell modal fades in.)

# Moving elements
- Focus ring (on, then off at submit).
- Typed characters, caret, clear "×" icon.
- Button: label → spinner, color lilac → grey → lilac.
- Spinner rotation (continuous while visible, ~2 s).
- Scrim opacity (in and out).
- Modal (fade plus short downward settle on entry; fade on exit).
- Progress label (discrete 0% → 100% text swap).
- Progress bar fill (left-to-right growth).
- Error tooltip (revealed as the modal leaves).

# Static elements
Header and nav, heading, sub-copy, example chips, "You will see:" checklist, reCAPTCHA badge, gradient background.

# State changes
Idle → focus ring → filled (+ clear icon) → pressed → button loading (spinner + "may take 2-3 min") → scrim + progress modal at 0% → label 100% → bar fills → modal out → error tooltip. No result.

# Motion characteristics
- Focus ring: discrete, no fade observed.
- Typing: discrete, ~105 ms steps.
- Button to loading: discrete color/label swap; spinner is a continuous rotation (approx. one turn per ~0.8–1 s; not measured precisely).
- Modal entry: opacity 0 → 1 with a short downward translate of approx. 10–15 px, about 0.13 s, ease-out, no overshoot.
- Scrim: opacity fade, same timing as the modal.
- Progress label: discrete text swap (says 100% before the bar has filled).
- Progress bar: horizontal scale/width growth from the left, about 1.0 s, approx. linear, no easing at either end visible at 15 fps sampling.
- Modal exit: opacity fade about 0.2 s, no translate observed.
- No scale, spring or bounce on content.

# Transition type
ADDED FROM OBSERVATION: FIELD_FOCUS_STATE, TYPE_ON, CTA_PRESS_TO_LOADING, LOADING_SPINNER, MODAL_REVEAL, ADDED FROM OBSERVATION: PROGRESS_BAR_FILL, AGENT_PROGRESS (closest existing name for "the system says it is working"), ADDED FROM OBSERVATION: GATE_INTERRUPT (the progress modal is also an upsell; the later promo modal), INPUT_PERSISTS_AS_CONTEXT, ADDED FROM OBSERVATION: INLINE_VALIDATION_MESSAGE (the tooltip), ADDED FROM OBSERVATION: BOT_CHECK_INSERT (invisible reCAPTCHA failure).

# What appears first
A blue focus ring and caret, then the typed domain with a clear "×".

# What appears second
The button collapsing to a grey spinner with "Loading… It may take 2-3 min".

# What appears third
A dimmed page with a centred "We're performing your SEO audit…" modal whose bar fills left to right in about 1 s, then the modal fades away (to an error, not a result).

# What makes this reference useful
- The only captured source with a visible "analyzing" beat: button → spinner → progress layer. It has a clear three-step rhythm (press, ~0.15 s; layer in, ~0.13 s; progress, ~1.0 s).
- The modal entry (fade plus a short downward settle, no overshoot) and the linear bar fill are simple and measurable.
- A negative example: the label reads "100%" while the bar is still empty, and the progress keeps animating after verification has already failed. That is progress not tied to real state, which Terramore's doctrine forbids presenting as real.

# What we should NOT borrow
Semrush branding, mint/lavender gradient, lilac button, typography, the left-aligned hero composition, all copy ("We're performing your SEO audit…", "It may take 2-3 min", "Try Semrush One"), the upsell inside a loading state, the promotional modal and its G2 badges, the "1/1" quota counter, any SEO score or issue claims, and progress that is not tied to real work.
