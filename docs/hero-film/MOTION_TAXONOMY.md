# Motion taxonomy

A classification library: shared names for motions so references, notes, decisions and specs can point at the same thing. **It is not a set of instructions.** An entry existing here does not mean it may be used on a Terramore surface.

Each entry gives:

- **Definition**: what is literally on screen.
- **When observed**: where the pattern usually appears.
- **Captured examples**: only sources captured in this pack (`references/scene-01-diagnose/<source>/`), with clip and clip-relative range. "Not yet captured" means none of our recordings show it.
- **Communicates**: what a viewer reads from it.
- **Method**: best-suited production method: **deterministic UI** (React/CSS, Remotion, recorded browser interaction, After Effects later), **motion design** (designed 2D/graphic animation, still deterministic), or **cinematic AI** (generative video; never for readable text or UI).
- **Risks / misuse**.

Pack status (2026-10-06): five Scene 1 sources captured. None reached a real result, because each was stopped by an email gate, a sign-up gate, bot protection or a data error. So every result-reveal entry is "Not yet captured".

## Doctrine constraints on any eventual use

Terramore's UX Doctrine and Visual Doctrine (`docs/UX_DOCTRINE.md`, `docs/VISUAL_DOCTRINE.md` §4 in the TerraIQ repo) constrain every entry below when it reaches a Terramore surface, including the hero film where it plays on the site:

- Every motion names its purpose (feedback, orientation, hierarchy, sequence, progress, cause and effect).
- `prefers-reduced-motion` is honored: no infinite animation, no autoplaying video (poster instead), and content that would animate in is simply present.
- Anything that moves for more than 5 seconds alongside other content stops by itself or has a visible, keyboard-reachable pause control.
- UI motion animates `transform` and `opacity` only; no springs, overshoot or bounce on content.
- No fake live events (notifications, typing indicators, counters presented as real) and no count-ups of claims.
- Pulsing dots, shimmer, confetti and sparkle are forbidden.
- At most one continuously moving region per marketing viewport. Nothing moves behind or beside the H1 or the primary CTA.
- Mocks that show people or numbers carry a visible "Illustrative" label.

**Restricted on Terramore surfaces**: METRIC_COUNT_UP, REVENUE_COUNT_UP, NUMBER_FLIP on claims, STATUS_PULSE, SKELETON_SHIMMER, TRANSACTION_FEED, KPI_REFRESH presented as live, LOGO_ORBIT and LOGO_MARQUEE or TEXT_MARQUEE_BANNER without a pause control, and anything that implies live data that isn't live. Entries marked ⚠ below carry one of these restrictions.

---

## SCENE 1 / SOFTWARE INTERACTIONS

| Name | Definition | When observed | Captured examples | Communicates | Method | Risks / misuse |
|---|---|---|---|---|---|---|
| INPUT_TO_RESULT | A query typed into a field is followed, in the same flow, by a visible result for that query | Free lookup tools, search, calculators | Not yet captured (all five stopped before a result) | "Give it something, it gives you an answer" | Deterministic UI | Showing a result we don't produce; implying instant results when real analysis takes longer |
| CTA_PRESS_TO_LOADING | Pressing the submit control turns it (or the area near it) into a loading state | Any async submit | semrush `reference-b-loading.mp4` 00.33–00.50 (button → grey with spinner, "Loading…" line) | "Your request was accepted and is in progress" | Deterministic UI | Loading with no end or real progress; a disabled look that reads as an error |
| INPUT_PERSISTS_AS_CONTEXT | After submit, the typed query stays visible while the next state arrives | Search and lookup tools | similarweb `b` 00.80–03.00; website-grader `b` 00.58–03.00; ahrefs `b` 00.46–05.00 (also in the URL `?input=`); wappalyzer `b` 00.71–04.00 (behind the scrim); semrush `b` 02.56–04.00 | "This result/state is about what you entered" | Deterministic UI | The query becomes hidden or illegible behind overlays |
| PRIMARY_RESULT_REVEAL | The main result (a score, headline finding or summary) appears as the focal element | Report tools | Not yet captured | "Here is the answer" | Deterministic UI | Fake scores; a result that looks more certain than the data allows |
| PROGRESSIVE_FINDINGS | Findings appear one after another as a list or set | Audits, scans | Not yet captured | "The system is finding things step by step" | Deterministic UI / motion design | Implying live scanning that isn't happening; findings invented for show |
| COMPACT_TO_DETAILED | A compact summary expands into a fuller view | Dashboards, reports | Not yet captured | "There's more depth behind this" | Deterministic UI | Expansions that animate layout properties (width and height) against doctrine |
| SUBMIT_TO_NEW_VIEW | Submitting navigates to, or swaps in, a separate results view | Tools with dedicated report pages | Not yet captured (ahrefs updated the URL query but showed no new view) | "You've moved from asking to reading" | Deterministic UI | Losing the user's context in the swap |

## SYSTEM / INTEGRATION

| Name | Definition | When observed | Captured examples | Communicates | Method | Risks / misuse |
|---|---|---|---|---|---|---|
| LOGO_ORBIT ⚠ | Logos circle around a central mark | Integration sections | Not yet captured | "Everything connects to this hub" | Motion design | Continuous loop with no pause; implying partnerships that don't exist; forbidden beside the H1/CTA |
| MANY_TO_ONE_CONVERGENCE | Several elements move inward and merge into one | System and consolidation stories | Not yet captured | "Scattered things become one" | Motion design | Overclaiming consolidation |
| NODE_PATH_DRAW | A line draws between nodes | Workflow diagrams | Not yet captured | "This leads to that" | Motion design | Paths that imply automation that doesn't exist |
| NODE_CASCADE | Nodes appear in sequence along a graph | Workflow diagrams | Not yet captured | Order and dependency | Motion design | Over-long staggers |
| DATA_PACKET_TRAVEL | Small marks travel along connectors | Integration and data-flow graphics | Not yet captured | "Data flows here" | Motion design | Reads as live traffic; a continuous loop |
| LOGO_MARQUEE ⚠ | A row of logos scrolls horizontally in a loop | Social-proof strips | Not yet captured as logos (see TEXT_MARQUEE_BANNER) | "Many companies use or relate to this" | Deterministic UI | Fabricated logos or clients; loop over 5 s with no pause control |
| CARD_GRID_ASSEMBLY | Cards fly or fade into a grid | Feature overviews | Not yet captured | "These parts make a whole" | Deterministic UI / motion design | Busy entrances; layout animation |
| STACK_TO_SINGLE_SYSTEM | A stack of separate tool cards resolves into one panel | Consolidation stories | Not yet captured | "Replace many tools with one" | Motion design | Claims of replacing tools we don't replace |
| IDENTITY_UNIFICATION | Several identity markers (names, avatars, logos) merge into one identity | Brand or CRM unification | Not yet captured | "One consistent identity" | Motion design | Using real people's or clients' identities |

## INTELLIGENCE

| Name | Definition | When observed | Captured examples | Communicates | Method | Risks / misuse |
|---|---|---|---|---|---|---|
| PROMPT_TO_RESULT | A natural-language prompt produces a generated answer | AI assistants | Not yet captured | "Ask in plain words, get an answer" | Deterministic UI | Showing AI output that isn't real product output |
| SOURCE_GATHERING | Sources or inputs are visibly collected before an answer | Research and AI tools | Not yet captured | "The answer is grounded in sources" | Deterministic UI | Fake citations |
| EVIDENCE_ATTACH | A finding gets its supporting evidence attached | Audits, AI answers | Not yet captured | "This claim has proof" | Deterministic UI | Evidence that is decorative, not real |
| ITERATIVE_REFINEMENT | A result visibly updates in passes | Generators, editors | Not yet captured | "It improves with each pass" | Deterministic UI | Fake iteration |
| CONTEXTUAL_DASHBOARD_RECONFIGURE | Dashboard modules rearrange to fit a question or context | Analytics | Not yet captured | "The view adapts to you" | Deterministic UI | Layout-property animation; disorientation |
| AGENT_TOOL_CALL | An agent visibly invokes a tool or step ("calling X…") | Agent UIs | Not yet captured | "The system is doing real work" | Deterministic UI | Theatre steps that don't correspond to real work |
| AGENT_PROGRESS | A visible indicator that the system is working through a task | Agents, long jobs | semrush `b` 01.03–02.06 (closest match: "We're performing your SEO audit…" with a filling bar) | "Work is underway" | Deterministic UI | Progress not tied to real state (the semrush bar reads "100%" before it fills and keeps going after the check failed) |
| AI_TO_HUMAN_REVIEW | An AI output is handed to a person for review or approval | Human-in-the-loop products | Not yet captured | "A person checks this" | Deterministic UI / motion design | Implying human review that doesn't happen; fictional reviewers |
| MANY_SIGNALS_TO_ONE_DECISION | Many inputs feed one recommendation or decision | Decision tools | Not yet captured | "All this evidence leads to one action" | Motion design | Overstating certainty |

## CINEMATIC

| Name | Definition | When observed | Captured examples | Communicates | Method | Risks / misuse |
|---|---|---|---|---|---|---|
| STILL_TO_MOTION | A still image begins to move | Image-to-video openers | Not yet captured | "This scene comes alive" | Cinematic AI | Uncanny motion; provenance must be kept |
| DOLLY_IN | Camera moves physically toward the subject | Film, product video | Not yet captured | Focus, intimacy | Cinematic AI / motion design | Motion sickness if fast |
| DOLLY_OUT | Camera moves away from the subject | Reveals of context | Not yet captured | "Here's the bigger picture" | Cinematic AI / motion design | Same as above |
| ZOOM_IN | Lens magnification increases (no camera travel) | UI films, documentaries | Not yet captured | Emphasis | Deterministic UI (UI zoom) / cinematic AI (footage) | Scaling readable UI past legibility |
| PAN | Camera rotates horizontally | Establishing shots | Not yet captured | Scanning a space | Cinematic AI | Fast pans are hard to read |
| TILT | Camera rotates vertically | Reveals of height | Not yet captured | Scale, reveal | Cinematic AI | — |
| HANDHELD_MICRO_MOTION | Small irregular camera drift | Documentary feel | Not yet captured | Realness, presence | Cinematic AI | Vestibular discomfort; must stop under reduced motion |
| RACK_FOCUS | Focus shifts from one plane to another | Film | Not yet captured | Shift of attention | Cinematic AI | Animating blur on UI breaks the transform/opacity rule |
| PARALLAX_DOLLY | Layers at different depths move at different speeds | Hero sections, film | Not yet captured | Depth | Motion design / cinematic AI | Scroll-jacking; reduced-motion failure |
| TRACK_SUBJECT | Camera follows a moving subject | Film | Not yet captured | Following a person's journey | Cinematic AI | Fictional people presented as real |
| SLOW_PRODUCT_REVEAL | Slow movement gradually exposes a product | Product launches | Not yet captured | Premium, deliberate | Cinematic AI / motion design | Hiding the product too long |
| CAMERA_ORBIT | Camera circles a subject | Product hero shots | Not yet captured | Dimensionality | Cinematic AI | — |
| REFERENCE_MOTION_TRANSFER | Motion from a reference clip is applied to new content | Generative video | Not yet captured | (production technique) | Cinematic AI | Copying a reference's composition or branding; uploading third-party clips to a generator that trains on inputs |
| FRAME_TO_FRAME_TRANSITION | Generated motion between a given start frame and end frame | Generative video | Not yet captured | Continuity between two states | Cinematic AI | Garbled text or UI in between frames |

## ADS

| Name | Definition | When observed | Captured examples | Communicates | Method | Risks / misuse |
|---|---|---|---|---|---|---|
| ASSET_TO_PLACEMENT | One creative moves into an ad placement frame | Ad tools | Not yet captured | "Your asset goes live here" | Deterministic UI / motion design | Showing placements we don't buy |
| FORMAT_MULTIPLICATION | One creative splits into several sizes or formats | Ad tools | Not yet captured | "One input, many formats" | Motion design | — |
| CHANNEL_FAN_OUT | One item fans out to several channel icons | Multichannel marketing | Not yet captured | Reach across channels | Motion design | Platform logos used without permission |
| CAMPAIGN_ROW_POPULATE | Rows of a campaign table fill in | Ad dashboards | Not yet captured | "Campaigns being set up" | Deterministic UI | Fake numbers without an "Illustrative" label |
| METRIC_COUNT_UP ⚠ | A number animates upward to its value | Marketing stats | Not yet captured | "Growth, scale" | Deterministic UI | **Restricted**: count-ups of claims are forbidden on Terramore surfaces |
| BAR_GROW | Bars of a chart grow from the baseline | Charts | Not yet captured | Comparison, magnitude | Deterministic UI | Fake data; growth on unlabeled axes |
| CREATIVE_PLUS_METRICS | An ad creative appears with its performance numbers | Ad reporting | Not yet captured | "This creative performs" | Deterministic UI | Invented performance |
| TOP_PERFORMER_HIGHLIGHT | One item in a set is highlighted as best | Reports | Not yet captured | "This is the winner" | Deterministic UI | Implied results |
| BEFORE_AFTER_OPTIMIZE | A before state changes to an improved after state | Optimization pitches | Not yet captured | Improvement | Deterministic UI / motion design | Unsubstantiated improvement claims |

## DATA / REVENUE

| Name | Definition | When observed | Captured examples | Communicates | Method | Risks / misuse |
|---|---|---|---|---|---|---|
| LINE_CHART_DRAW | A line draws left to right across a chart | Analytics | Not yet captured | Trend over time | Deterministic UI | Fake trend data |
| REVENUE_COUNT_UP ⚠ | A revenue figure counts upward | Revenue marketing | Not yet captured | Money made | Deterministic UI | **Restricted**: a count-up of a claim |
| TRANSACTION_FEED ⚠ | A list of transactions streams in | Payment products | Not yet captured | Live business | Deterministic UI | **Restricted**: a fake live event |
| KPI_REFRESH ⚠ | KPI tiles update their values | Dashboards | Not yet captured | Freshness | Deterministic UI | Restricted when it implies live data that isn't live |
| SOURCE_TO_REVENUE | Traffic or lead sources visibly connect to revenue | Attribution | Not yet captured | "This channel makes money" | Motion design | Attribution claims we can't support |
| PERIOD_DELTA | A comparison of a period vs a prior period appears (± change) | Reports | Not yet captured | Change over time | Deterministic UI | Cherry-picked deltas |
| METRIC_DRILL_DOWN | A metric opens into its components | Analytics | Not yet captured | Depth, explanation | Deterministic UI | — |

## HUMAN / PARTNERSHIP

| Name | Definition | When observed | Captured examples | Communicates | Method | Risks / misuse |
|---|---|---|---|---|---|---|
| HUMAN_CUTAWAY | Cut from UI to a person | Product films | Not yet captured | "Real people behind this" | Cinematic AI / live footage | Fictional team members (forbidden); likeness without consent |
| OTS_WORKING_SHOT | Over-the-shoulder shot of someone working at a screen | Product films | Not yet captured | Real work happening | Live footage / cinematic AI (no readable screen) | Generated screens with garbled UI; implied staff |
| TEAM_COLLABORATION | Several people working together | Brand films | Not yet captured | Partnership | Live footage / cinematic AI | Fictional teams presented as Terramore |
| UI_TO_REALITY_MATCH_CUT | A UI element cuts to a matching real-world object or shape | Brand films | Not yet captured | "Software affects the real world" | Motion design + footage | Implying real clients' outcomes |
| HUMAN_TRACKING_SHOT | Camera follows a person moving | Brand films | Not yet captured | Journey | Cinematic AI / live footage | Same as HUMAN_CUTAWAY |

## BRAND

| Name | Definition | When observed | Captured examples | Communicates | Method | Risks / misuse |
|---|---|---|---|---|---|---|
| FADE_UP_TEXT | Text fades in while moving up a short distance | Headlines | Not yet captured | Calm arrival | Deterministic UI | Text hidden with JavaScript off or under reduced motion |
| WORD_SEQUENCE | Words appear one after another | Taglines | Not yet captured | Rhythm, emphasis | Deterministic UI | Slow reading; screen readers getting fragments |
| TEXT_MASK_REVEAL | Text revealed by a moving mask edge | Titles | Not yet captured | Precision | Deterministic UI / motion design | Clip-path animation cost |
| LOGO_RESOLVE | A logo forms or settles at the end | Endings | Not yet captured | Sign-off | Motion design | — |
| BRAND_SUFFIX_APPEND | A brand word appends to a line ("… with Terramore") | Taglines | Not yet captured | Attribution | Deterministic UI | — |

## TRANSITIONS

| Name | Definition | When observed | Captured examples | Communicates | Method | Risks / misuse |
|---|---|---|---|---|---|---|
| HARD_CUT | Instant change from one shot or state to another | Film, UI state swaps | Not yet captured as a shot change. Several UI state changes in the captures are discrete (e.g. ahrefs focus swap), logged under FIELD_FOCUS_STATE | Directness | Any | Disorientation without continuity |
| CROSSFADE | One shot fades out while the next fades in | Film, UI | Not yet captured | Soft continuity | Any | Muddy midpoint with text |
| PUSH_TRANSITION | The new view pushes the old one off screen | Mobile UI, film | Not yet captured | Forward progress | Deterministic UI / motion design | — |
| SCALE_THROUGH | Camera scales into an element, which becomes the next view | UI films | Not yet captured | Drilling in | Deterministic UI / motion design | Scaling readable UI |
| MATCH_CUT | Cut between matching shapes or positions | Film | Not yet captured | Continuity of idea | Motion design / footage | — |
| MASK_WIPE | A shaped mask wipes the next scene in | Film, motion graphics | Not yet captured | Change of chapter | Motion design | — |
| ELEMENT_CARRYOVER | An element persists across the cut into the next scene | UI films | Not yet captured across scenes (within a scene see INPUT_PERSISTS_AS_CONTEXT) | Continuity of subject | Deterministic UI | — |
| DIRECTIONAL_CONTINUITY | Motion direction is kept across cuts | Film | Not yet captured | Coherent flow | Any | — |
| WHIP_PAN | A very fast pan with motion blur between shots | Film | Not yet captured | Energy | Cinematic AI / motion design | Vestibular discomfort |
| ZOOM_THROUGH | Zoom through an element into the next scene | Film, UI films | Not yet captured | Going deeper | Motion design | Same as above |

## TYPOGRAPHY

| Name | Definition | When observed | Captured examples | Communicates | Method | Risks / misuse |
|---|---|---|---|---|---|---|
| TYPE_ON | Text appears character by character as if typed | Inputs, terminals, titles | similarweb `a` 01.46–02.83 (left-aligned); website-grader `a` 01.35–02.70 (center-anchored: the string grows outward from the center); ahrefs `a` 01.35–02.81; wappalyzer `a` 01.49–02.82; semrush `a` 01.28–02.52. All: discrete, ~0.10–0.12 s per character, no per-character easing | "Someone is entering this now" | Deterministic UI (never generative: the domain must be exact) | Presented as a live typing indicator (forbidden as a fake live event) |
| LINE_REVEAL | Lines of text reveal one by one | Headlines, lists | Not yet captured | Structure | Deterministic UI | — |
| WORD_STAGGER | Words enter with a small stagger | Headlines | Not yet captured | Rhythm | Deterministic UI | Stagger over 60 ms per item exceeds doctrine |
| NUMBER_FLIP ⚠ | Digits flip like a split-flap display | Counters | Not yet captured | Change, live-ness | Deterministic UI | Restricted on claims |
| TEXT_HIGHLIGHT_SWEEP | A highlight sweeps across text | Emphasis | Not yet captured | Importance | Deterministic UI | Shimmer-like sweeps are forbidden |
| UNDERLINE_DRAW | An underline draws under text | Links, emphasis | Not yet captured (website-grader's underline recolors and widens discretely, not a draw) | Emphasis | Deterministic UI | — |

## MICRO INTERACTIONS

| Name | Definition | When observed | Captured examples | Communicates | Method | Risks / misuse |
|---|---|---|---|---|---|---|
| CARD_HOVER_LIFT | A card rises slightly or gains shadow on hover | Card grids | Not yet captured | Clickability | Deterministic UI | Animating box-shadow (doctrine: transform and opacity only) |
| CLICK_SCALE | A pressed control scales down briefly | Buttons | Not yet captured (presses in the captures are color-only; see BUTTON_TONE_PRESS) | Press feedback | Deterministic UI | Bouncy scale (no springs) |
| LOADING_SPINNER | A rotating indicator shows waiting | Async actions | semrush `b` 00.47 onward (spinner replaces the button label); wappalyzer `b` 00.87–01.50 (small spinner in the modal while the CAPTCHA loads); ahrefs `b` 04.40–05.00 (third-party Turnstile spinner) | "Wait, working" | Deterministic UI | In-product infinite animation must have text (doctrine) |
| SKELETON_SHIMMER ⚠ | Placeholder blocks with a moving sheen | Content loading | Not yet captured | Content coming | Deterministic UI | **Restricted**: shimmer is forbidden |
| CHECK_DRAW | A check mark draws itself | Success states | Not yet captured | Done | Deterministic UI | — |
| STATUS_PULSE ⚠ | A dot or badge pulses repeatedly | Live status | Not yet captured | "Live/active" | Deterministic UI | **Restricted**: pulsing dots forbidden; implies live data |
| TOOLTIP_FADE | A tooltip fades in near its anchor | Help, errors | Not yet captured as its own fade (semrush's error tooltip became visible as the modal faded out, see INLINE_VALIDATION_MESSAGE) | Extra info | Deterministic UI | — |
| SIDE_PANEL_SLIDE | A panel slides in from an edge | Detail views | Not yet captured | More detail without leaving | Deterministic UI | — |
| MODAL_REVEAL | A scrim dims the page and a dialog appears above it | Dialogs, gates | wappalyzer `b` 00.71–00.87 (scrim and modal fade in together, ~0.15 s, in place); semrush `b` 00.50–00.63 (fade plus approx. 10–15 px downward settle, ~0.13 s) and exit 02.56–02.76 (fade, ~0.2 s) | "Something needs your attention" | Deterministic UI | Gates and upsells disguised as progress |
| TAB_CONTENT_SWAP | Content swaps when a tab changes | Tabbed UIs | Not yet captured | Switching views | Deterministic UI | — |
| ACCORDION_OPEN | A collapsed section expands | FAQs, panels | Not yet captured (wappalyzer's panel was already open) | Disclosure | Deterministic UI | Animating height (doctrine) |

## ADDED FROM OBSERVATION

New patterns seen in this pack's captures that the seed list did not name.

| Name | Definition | When observed | Captured examples | Communicates | Method | Risks / misuse |
|---|---|---|---|---|---|---|
| FIELD_FOCUS_STATE (ADDED FROM OBSERVATION) | On focus, the field's fill, border or ring changes, usually in one discrete step | Every input | ahrefs `a` 00.44–00.50 (dark → white fill, grey → amber border, one step); semrush `a` 00.37–00.43 (light-blue ring, one step); similarweb `a` 00.56 (caret only, no style change) | "The field is ready for you" | Deterministic UI | Invisible focus (fails keyboard accessibility) |
| FLOATING_LABEL_RISE (ADDED FROM OBSERVATION) | A label sitting inside or on a field moves up (and shrinks) on focus | Form fields | website-grader `a` 00.44–00.80 (up ~10–12 px, ~0.15–0.2 s, ease-out); wappalyzer `a` 00.58–00.90 (up ~20 px into a border notch, scale ~0.75, ~0.15–0.2 s, then placeholder fade-in) | "This field is active; here's what it wants" | Deterministic UI | Label too small to read once raised |
| AUTOCOMPLETE_SUGGESTION_DROP (ADDED FROM OBSERVATION) | A suggestion panel grows down from under the field, echoing or completing the query | Search fields | similarweb `a` 03.12–03.43 (~75 px, ~0.2–0.3 s, ~0.3 s after the last keystroke) | "The system recognizes what you typed" | Deterministic UI | Suggesting matches that don't exist |
| BUTTON_TONE_PRESS (ADDED FROM OBSERVATION) | Hover and press shown only by a change of button color or tone, no scale | Buttons | similarweb `b` 00.40–00.90 (darker on hover, lighter for ~0.1 s on press); ahrefs `b` 00.00–00.46 (brighter on hover) | Press and hover feedback | Deterministic UI | Too subtle to perceive at film size |
| INLINE_VALIDATION_MESSAGE (ADDED FROM OBSERVATION) | An error or validation message appears next to a field after submit, in place | Forms | similarweb `b` 00.80–00.90 (red line; content below reflows ~14 px); website-grader `b` 00.58–00.65 (red pill plus red, widened underline); semrush `b` 02.56–02.76 (tooltip revealed beside the button) | "That didn't work; here's why" | Deterministic UI | Not a result. Must not appear in a "diagnose" film as if it were one |
| PROGRESS_BAR_FILL (ADDED FROM OBSERVATION) | A horizontal bar fills left to right to show progress | Long tasks | semrush `b` 01.03–02.06 (~1.0 s, approx. linear, label already reads 100%) | "This much is done" | Deterministic UI | Progress not tied to real work; label and bar disagreeing |
| GATE_INTERRUPT (ADDED FROM OBSERVATION) | Between submit and result, the flow is interrupted by a requirement (email, sign-up, upsell) | Freemium tools | website-grader `b` 00.58 onward (email required); wappalyzer `b` 00.71 onward ("Sign up to continue"); semrush progress modal doubles as upsell, plus a promo modal at raw ~21 s | "You have to give something first" | (Observed only, not for production) | Implying Terramore gates its diagnosis; never borrow |
| BOT_CHECK_INSERT (ADDED FROM OBSERVATION) | A third-party human-verification widget appears or silently fails after submit | Protected tools | ahrefs `b` 04.40–05.00 (Cloudflare Turnstile "Verifying…", then "Verify you are human" at raw ~14 s); wappalyzer `b` 01.50–02.37 (reCAPTCHA inside the gate); semrush (invisible reCAPTCHA leading to "We couldn't verify that you're human") | "Prove you're human" | (Observed only, not for production) | Never depict, imitate or borrow |
| TEXT_MARQUEE_BANNER (ADDED FROM OBSERVATION) ⚠ | A strip of announcement text and graphics scrolls continuously across the top of the page | Promo banners | ahrefs, whole recording (leftward, approx. 30 px/s, constant, looping) | "Announcement" | Deterministic UI | Continuous motion over 5 s with no pause control (restricted); competes with the H1 |
