# Source
Product: Similarweb — Website Traffic Checker
URL: https://www.similarweb.com/website/
Capture date: 2026-10-06 23:27 PDT (2026-10-07 06:27 UTC)
Reference clip: reference-a-input.mp4 (raw 1.50–5.00), reference-b-submit.mp4 (raw 5.00–8.00)
Observed duration: 3.50 s + 3.00 s (raw recording 32.83 s; nothing changes after raw ~5.9 s)

# Literal timeline
Times are clip-relative; raw time in brackets.

reference-a-input.mp4
00.00–00.56 [1.50–2.06]
Static page. White pill-shaped search field with magnifier icon and grey "Enter Website" placeholder, blue "Search" button inside the pill on the right, "3/3" counter outside the pill. Top announcement bar with a horizontal blue-to-orange gradient (static).
00.56–01.46 [2.06–2.96]
Field clicked. A text caret appears before the placeholder. No border, shadow or color change on the field.
01.46–02.83 [2.96–4.33]
"terramore.io" appears one character at a time, about one character per 0.11–0.12 s, left-aligned. Placeholder disappears with the first character. No per-character animation; each character simply appears.
02.83–03.12 [4.33–4.62]
Text complete, nothing else changes.
03.12–03.43 [4.62–4.93]
A white panel opens downward from the bottom of the pill, about 75 px tall, containing one row: a small favicon tile and bold "terramore.io". The pill's lower corners become square where it joins the panel. Grows over about 0.2–0.3 s (approx., frames show it extending), then holds.
03.43–03.50 [4.93–5.00]
Static: field plus open suggestion panel.

reference-b-submit.mp4
00.00–00.40 [5.00–5.40]
Suggestion panel open. The pointer travels to the Search button (the pointer is not rendered in the recording).
00.40–00.63 [5.40–5.63]
Search button shifts to a darker blue (hover).
00.63–00.80 [5.63–5.80]
Click. The button flashes to a lighter, desaturated blue for about one frame-group (~0.1 s). The suggestion panel disappears in one step (no visible collapse); the pill returns to fully rounded.
00.80–00.90 [5.80–5.90]
A single line of small red text "Unable to load data. Please try again." appears under the left edge of the field. The grey "Popular sites to analyze" line below jumps down by about 14 px to make room. The button returns to its standard blue.
00.90–03.00 [5.90–8.00]
Static error state. Counter still reads "3/3".

# Moving elements
- Characters entering the field (discrete, one per keystroke).
- Text caret (blinks; seen at ~2 Hz in the attempt-2 raw frames).
- Suggestion panel opening downward under the field.
- Search button color (hover darken, press lighten).
- "Popular sites" line shifting down when the error line is inserted.

# Static elements
Page heading "Website Traffic Checker", sub-copy, nav bar, gradient announcement bar, promo card below, the "3/3" counter, the field position itself.

# State changes
Empty → focused (caret) → filled → suggestion panel open → hover → pressed → panel closed → inline error. No loading state was shown.

# Motion characteristics
- Typing: discrete steps, ~110–120 ms apart, no easing, no opacity change per character.
- Suggestion panel: downward reveal, about 75 px, about 0.2–0.3 s (approx.); the panel appears to grow from the field's bottom edge (mask or height growth, not a slide of a fixed-size panel); no bounce; opacity looks full throughout (approx.).
- Button hover/press: color change only, no scale or position change, about 0.1 s steps.
- Panel close: discrete (gone within one captured frame).
- Error insert: discrete appearance; the content below reflows down about 14 px within one captured frame (no eased slide visible).
- No rotation, scale, spring or bounce anywhere.

# Transition type
INPUT_PERSISTS_AS_CONTEXT (the typed domain stays in the field while the error appears), TYPE_ON, ADDED FROM OBSERVATION: FIELD_FOCUS_STATE (caret-only variant), ADDED FROM OBSERVATION: BUTTON_TONE_PRESS (color-only hover and press; CLICK_SCALE was not observed), ADDED FROM OBSERVATION: AUTOCOMPLETE_SUGGESTION_DROP, ADDED FROM OBSERVATION: INLINE_VALIDATION_MESSAGE. CTA_PRESS_TO_LOADING was not observed (no loading state).

# What appears first
Caret in the empty field, then the typed characters.

# What appears second
A one-row suggestion panel under the field repeating the typed domain.

# What appears third
After the click, a red inline error line under the field (no result).

# What makes this reference useful
- Shows a quiet input: focus is caret-only, typing is plain, and the domain echoes back in a suggestion row before submission, which reads as the system "recognizing" the entry.
- Shows that a failed submit can resolve in place without leaving the page, with the domain kept in the field.
- Shows real typing cadence on a real field.

# What we should NOT borrow
Similarweb's branding, logo, gradient announcement bar, blue button color, typography, the pill-with-inset-button composition, the "3/3" daily counter and rate-limit concept, the favicon-tile suggestion row as designed, all copy ("Website Traffic Checker", "Unable to load data"), and any traffic-data claims. The error state is not a result and must not be presented as one.
