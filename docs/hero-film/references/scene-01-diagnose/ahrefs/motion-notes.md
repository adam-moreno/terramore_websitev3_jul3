# Source
Product: Ahrefs — Website "Authority" Checker
URL: https://ahrefs.com/website-authority-checker (owner's brief had a truncated "ah-authority-checker")
Capture date: 2026-10-06 23:35 PDT (2026-10-07 06:35 UTC)
Reference clip: reference-a-input.mp4 (raw 1.50–5.20), reference-b-submit.mp4 (raw 5.20–10.20)
Observed duration: 3.70 s + 5.00 s (raw recording 32.33 s)

# Literal timeline
Clip-relative times; raw in brackets.

reference-a-input.mp4
00.00–00.44 [1.50–1.94]
Dark charcoal page. Large white display heading "Website 'Authority' Checker", breadcrumb tabs with the active one underlined in amber, a dark rectangular field with a thin grey border and "Enter domain" placeholder, a flat orange "Check Authority" button flush to its right. Across the very top, a conference banner (gradient strip with logos, pills and text) scrolls continuously to the left.
00.44–00.50 [1.94–2.00]
Field clicked. In a single step the field fill switches from dark to white and the border from grey to amber; caret appears. No fade observed.
00.50–01.35 [2.00–2.85]
Static field, caret.
01.35–02.81 [2.85–4.31]
"terramore.io" appears one character at a time, ~0.12 s apart, left-aligned, dark text on white.
02.81–03.70 [4.31–5.20]
Static, field filled. Banner keeps scrolling.

reference-b-submit.mp4
00.00–00.30 [5.20–5.50]
Pointer moves to the button (not rendered). Button turns a brighter orange (hover).
00.30–00.46 [5.50–5.66]
Hover held.
00.46–00.80 [5.66–6.00]
Click. The address bar URL gains "?input=terramore.io" (not visible in the viewport). The field switches back to its dark unfocused style in one step; the domain text stays in it.
00.80–04.40 [6.00–9.60]
No visible change in the page content: no spinner, skeleton or progress. Only the top banner moves.
04.40–05.00 [9.60–10.20]
A white Cloudflare Turnstile box appears in one step, overlapping the breadcrumb row just above the right end of the field and the button, with a small dotted spinner and "Verifying…". (After the clip, at raw ~14.0 s, it changes to a "Verify you are human" checkbox and stays.)

# Moving elements
- Top conference marquee: continuous leftward scroll, approx. 30 px/s, constant speed, loops.
- Field fill and border (focus on, focus off).
- Typed characters, caret.
- CTA hover color.
- Turnstile widget spinner (third-party).

# Static elements
Heading, breadcrumb tabs, nav, the blue "Free Domain Rating API" promo block below with a code snippet, help "?" bubble.

# State changes
Unfocused dark → focused white/amber → filled → hover → submitted (URL updated, field blurred, domain kept) → idle wait (~3.9 s, no feedback) → bot-check widget. No result.

# Motion characteristics
- Focus: discrete swap of fill and border color, no transition visible (< 1 frame at 30 fps).
- Typing: discrete, ~120 ms steps.
- CTA hover: color step, no scale.
- Blur after submit: discrete.
- Marquee: linear, constant velocity (approx. 30 px/s leftward), infinite loop, no easing, no pause control visible.
- Turnstile insert: discrete appearance, no fade or slide.
- No scale, rotation, spring or bounce in the product UI.

# Transition type
ADDED FROM OBSERVATION: FIELD_FOCUS_STATE, TYPE_ON, ADDED FROM OBSERVATION: BUTTON_TONE_PRESS (hover), INPUT_PERSISTS_AS_CONTEXT, ADDED FROM OBSERVATION: BOT_CHECK_INSERT (observed, not a pattern to use), ADDED FROM OBSERVATION: TEXT_MARQUEE_BANNER (top banner; related to LOGO_MARQUEE).

# What appears first
The field switching to white with an amber border (focus).

# What appears second
The domain typed into the white field.

# What appears third
After the click, the field returning to dark with the domain kept, then a long idle wait and a third-party "Verifying…" widget (not a result).

# What makes this reference useful
- The most legible high-contrast focus switch of the set (a single-step dark-to-white swap clearly says "you are entering something now").
- The domain-in-the-URL behavior (`?input=`) shows the submitted query becoming the page's state.
- A negative example: about 4 s of no feedback after a click reads as "nothing happened", which is what a diagnostic scene must avoid.

# What we should NOT borrow
Ahrefs branding, the orange/amber and charcoal palette, the display typeface, the heading treatment, the breadcrumb-tab composition, the "Authority"/Domain Rating concept and any metric names, the conference marquee (also restricted by Terramore's motion doctrine: continuous motion with no pause control), the Cloudflare widget, and the idle no-feedback wait.
