# Hero film: motion reference system

This folder holds the research and specs for the Terramore /marketing hero film. Every motion decision starts from a real, captured reference, gets described literally, gets tagged with a shared vocabulary, and is chosen by the owner before anyone builds it.

Nothing in this folder is a Terramore prototype or asset. The reference media are third-party recordings, kept for internal study only.

## Method

REFERENCE → OBSERVE → TAG → SELECT → SPEC → BUILD → REVIEW → LOCK

1. **REFERENCE.** Capture the real behavior of a real product: a real-time screen recording of the live public page, trimmed to 1–5 s clips, plus stills taken straight from the recording. No mockups, recreations or storyboard cards.
2. **OBSERVE.** Write `motion-notes.md` from the frames, literally: what moves, where, how far, how fast, in what order. No intent, no adjectives standing in for measurements.
3. **TAG.** Classify each observed motion with names from `MOTION_TAXONOMY.md`. Add a new name only when nothing fits, and mark it "ADDED FROM OBSERVATION" with its source.
4. **SELECT.** The owner picks candidates per priority point in the scene's decision file (for Scene 1, `SCENE_01_DECISION.md`). Agents list candidates and differences but never pick or rank.
5. **SPEC.** Turn the selection into the scene's motion spec (`SCENE_01_MOTION_SPEC.md`): exact clip and timestamps, what is borrowed, what is not, start and end frames, production method, reduced-motion behavior and framing.
6. **BUILD.** Build only what the spec says, with the production method it names.
7. **REVIEW.** Compare the build against the referenced range, side by side, and against Terramore's UX and visual doctrines (reduced motion, pause controls, transform and opacity only, no fake live data).
8. **LOCK.** The owner approves; the spec is marked locked. Any change after that goes back through SELECT.

## Folder layout

```
docs/hero-film/
  README.md                      this file
  MOTION_TAXONOMY.md             classification library (names, definitions, captured examples)
  SCENE_01_DECISION.md           Scene 1 candidates per priority point; owner selection PENDING
  SCENE_01_MOTION_SPEC.md        Scene 1 spec; WAITING FOR OWNER MOTION SELECTION
  scene-01-reference-board.html  local side-by-side comparison page (open from disk)
  references/
    scene-01-diagnose/
      <source>/
        source.md                capture record (committed)
        motion-notes.md          literal observation (committed)
        raw-full.mp4             full real-time recording (local only)
        reference-a-*.mp4 ...    1–5 s clips (local only)
        frame-a-01.png ...       stills taken from the recording (local only)
```

Scene 1 sources: `similarweb`, `website-grader`, `ahrefs`, `wappalyzer`, `semrush`.

## Local-only media

- Recordings and stills of third-party products are copyrighted. The repo-root `.gitignore` excludes `docs/hero-film/references/**/*.{mp4,webm,png,jpg}`. Only text is committed.
- The media sit next to their notes so the board's relative paths work. A fresh clone has none of them; the board then shows "local media not present — see source.md".
- Recommendation: the owner keeps a copy of the media in a stable local path outside any repo (for example `~/TerramoreMedia/hero-film/references/`) and copies or symlinks it into `docs/hero-film/references/` when reviewing. Never upload them, publish them or feed them to a generator.

### How the media were made (and how to regenerate)

The capture scripts are committed in `docs/hero-film/capture/` (`recon.mjs`, `capture.mjs`, `assemble.mjs`, `cut.sh`, `board.py`, `boardshot.mjs`). They use a local working folder set by `HERO_FILM_WORKDIR` (default `/tmp/hero-film-work`). It holds `pw/` (`npm i playwright-core` there) and the raw screencast frames; nothing in it is committed.
Re-run them with the same procedure: real-time screencast only, no re-timing, and the safety rules below. Finished clips and stills go into each source folder and are git-ignored.

### Capture rules

- Public, unauthenticated pages only. Never log in, sign up, or enter an email, name, phone or payment details.
- Type only `terramore.io` (the owner authorized this) and press only the tool's own analyze button.
- Never solve, bypass or work around a CAPTCHA, Cloudflare or Turnstile check, or bot detection. Record what is visible, write "blocked by bot protection at step X", and stop.
- Decline non-essential cookies with the most privacy-preserving option.
- 1–3 attempts per source, no scraping.

## How to add a source

1. Confirm it directly shows the scene's job (for Scene 1: domain or query → software response → result) on a public page you can actually capture.
2. Create `references/<scene>/<source>/`.
3. Capture (steps A–H for Scene 1: initial, focus, typing, CTA press, loading, result transition, result reveal, immediate expansion) as far as publicly possible.
4. Cut 1–5 s clips named `reference-a-<what>.mp4`, `reference-b-<what>.mp4` …, and pull 3–5 stills per clip (`frame-a-01.png` …) from the recording, recording each raw and clip timestamp.
5. Write `source.md` (URLs before and after submit, date and time, viewport, browser, what was typed and clicked, steps reached vs blocked with reasons, media list with durations and frame timestamps, copyright note).
6. Write `motion-notes.md` with the template used by the existing sources, from dense frames (10–30 fps) of each transition.
7. Tag with `MOTION_TAXONOMY.md`, add the source to the board and to the decision file's candidate lists. Do not rank.

## Tool decision rules

**Deterministic UI motion.** Use React/CSS, Remotion, a recorded browser interaction, or (later) After Effects for anything that must be exact: typing, buttons, fields, cards, charts, numbers, labels and any readable UI or text.

**Generative video (Higgsfield or similar)** is only for cinematic footage, camera movement, organic or human motion, image-to-video and motion transfer. **Never** use it for exact website text, domain strings, chart labels or any readable UI. Generated text and UI are unreliable and would misrepresent the product.

Generative use is also bound by the Terramore Visual Doctrine's AI boundaries and the Higgsfield decision record. At the time of writing, no generator is integrated (VD-010); generate only from the prompt-library templates; upload no client material, personal data or unreleased Terramore material to a tool that trains on inputs (VR-61). Third-party reference recordings from this folder must not be uploaded to a generator.

### Higgsfield reference modes

Use these instruction texts exactly.

- **A. MOTION REFERENCE:** "Use REFERENCE_VIDEO only as the motion reference. Borrow movement timing, direction, camera behavior and easing. Do not copy branding, colors, composition, UI or text."
- **B. STYLE REFERENCE:** "Use this only as a visual-style reference. Do not borrow motion, composition or branding."
- **C. START/END CONTROL:** "Begin on START_FRAME. End on END_FRAME. Use REFERENCE_VIDEO only for the movement connecting those states."

## Claude / Cursor motion hand-off format

Every motion hand-off to an implementing agent uses this block, filled from a locked spec:

```
MOTION: <taxonomy name(s)>
REFERENCE: <source folder / clip file>
REFERENCE RANGE: <start–end in clip seconds (raw seconds)>
BORROW: <timing, direction, distance, easing, order — measured values>
DO NOT BORROW: <branding, colors, type, composition, copy, UI, claims>
START FRAME: <Terramore start state, described or linked>
END FRAME: <Terramore end state, described or linked>
NO OTHER MOTION MAY BE INTRODUCED WITHOUT APPROVAL.
```

**Rule:** never write "make it feel like <product>". Name the taxonomy entry, the clip, the range and the measured properties instead.
