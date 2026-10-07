# Generates docs/hero-film/scene-01-reference-board.html (local comparison page, no external deps).
import html, os
OUT='/Users/adammoreno/Projects/terramore-website-growth-system/docs/hero-film/scene-01-reference-board.html'
R='references/scene-01-diagnose/'
S=[
 dict(id='similarweb',name='Similarweb — Website Traffic Checker',url='https://www.similarweb.com/website/',final='same URL (inline error, no navigation)',
  reached='A initial · B focus · C typing (+ suggestion panel) · D press',blocked='E–H: "Unable to load data. Please try again." ~0.2 s after click; no loading state. Cause not stated by the page.',
  clips=[('reference-a-input.mp4','A · input',3.5,'raw 1.50–5.00',[('frame-a-01.png','1.60'),('frame-a-02.png','2.50'),('frame-a-03.png','3.60'),('frame-a-04.png','4.90')]),
         ('reference-b-submit.mp4','B · submit',3.0,'raw 5.00–8.00',[('frame-b-01.png','5.20'),('frame-b-02.png','5.80'),('frame-b-03.png','6.20'),('frame-b-04.png','7.50')])],
  timeline=[('A 00.00–00.56','Static page, empty pill field "Enter Website", blue Search button.'),('A 00.56–01.46','Click: caret appears; no field style change.'),('A 01.46–02.83','"terramore.io" typed, ~0.11–0.12 s per character, left-aligned.'),('A 03.12–03.43','One-row suggestion panel grows ~75 px down from the field (~0.2–0.3 s).'),('B 00.40–00.63','Button darkens (hover).'),('B 00.63–00.80','Click: button lightens ~0.1 s; panel disappears in one step.'),('B 00.80–00.90','Red error line inserted under field; content below jumps ~14 px.'),('B 00.90–03.00','Static error state; domain kept.')],
  tags=['TYPE_ON','FIELD_FOCUS_STATE*','AUTOCOMPLETE_SUGGESTION_DROP*','BUTTON_TONE_PRESS*','INLINE_VALIDATION_MESSAGE*','INPUT_PERSISTS_AS_CONTEXT'],
  notes='Quiet caret-only focus; system echoes the domain in a suggestion row before submit. Failed submit resolves in place.'),
 dict(id='website-grader',name='HubSpot Website Grader',url='https://website.grader.com/',final='same URL (client-side validation)',
  reached='A initial · B focus · C typing · D press',blocked='E–H: email required. Email left empty by rule; "Sorry! This doesn\'t look like a valid email address." Nothing submitted.',
  clips=[('reference-a-input.mp4','A · input',3.5,'raw 1.50–5.00',[('frame-a-01.png','1.60'),('frame-a-02.png','2.05'),('frame-a-03.png','2.40'),('frame-a-04.png','3.50'),('frame-a-05.png','4.80')]),
         ('reference-b-submit.mp4','B · submit',3.0,'raw 5.00–8.00',[('frame-b-01.png','5.30'),('frame-b-02.png','5.60'),('frame-b-03.png','5.90'),('frame-b-04.png','7.50')])],
  timeline=[('A 00.00–00.44','Static dark page, underline fields with centered labels.'),('A 00.44–00.80','Click: "Website" label rises ~10–12 px, slightly smaller, ~0.15–0.2 s, decelerating.'),('A 01.35–02.70','"terramore.io" typed large, bold, centered — grows outward from center.'),('B 00.49','Click: no visible button change.'),('B 00.58–00.65','Red pill under Email; Email underline turns red and widens.'),('B 00.65–00.92','"Website" label dims (~0.25 s).'),('B 00.92–03.00','Static.')],
  tags=['FLOATING_LABEL_RISE*','TYPE_ON (center-anchored)','INLINE_VALIDATION_MESSAGE*','GATE_INTERRUPT*','INPUT_PERSISTS_AS_CONTEXT'],
  notes='Large centered domain makes the input the subject of the frame. Gate sits before any analysis.'),
 dict(id='ahrefs',name='Ahrefs — Website "Authority" Checker',url='https://ahrefs.com/website-authority-checker',final='…/website-authority-checker/?input=terramore.io',
  reached='A initial · B focus · C typing · D press (URL updated)',blocked='E–H: blocked by bot protection at step E — Cloudflare Turnstile "Verifying…" (~3.9 s after click), then "Verify you are human". Not touched. Brief URL was truncated ("ah-authority-checker"); real page used.',
  clips=[('reference-a-input.mp4','A · input',3.7,'raw 1.50–5.20',[('frame-a-01.png','1.60'),('frame-a-02.png','2.50'),('frame-a-03.png','3.60'),('frame-a-04.png','5.00')]),
         ('reference-b-submit.mp4','B · submit',5.0,'raw 5.20–10.20',[('frame-b-01.png','5.50'),('frame-b-02.png','6.10'),('frame-b-03.png','9.50'),('frame-b-04.png','10.00')])],
  timeline=[('A 00.00–00.44','Dark page, dark field "Enter domain", orange CTA; top banner scrolls left (~30 px/s) throughout.'),('A 00.44–00.50','Click: field swaps to white fill + amber border in one step.'),('A 01.35–02.81','"terramore.io" typed, ~0.12 s per character.'),('B 00.00–00.46','CTA brighter (hover).'),('B 00.46–00.80','Click: URL gets ?input=; field returns to dark style, domain kept.'),('B 00.80–04.40','No visible feedback (~3.6 s).'),('B 04.40–05.00','Cloudflare "Verifying…" widget appears in one step above the CTA.')],
  tags=['FIELD_FOCUS_STATE*','TYPE_ON','BUTTON_TONE_PRESS*','INPUT_PERSISTS_AS_CONTEXT','BOT_CHECK_INSERT*','TEXT_MARQUEE_BANNER*'],
  notes='Highest-contrast focus switch. Also a negative example of a long no-feedback wait.'),
 dict(id='wappalyzer',name='Wappalyzer — Technology lookup',url='https://www.wappalyzer.com/lookup/',final='same URL (modal over page)',
  reached='A initial · B focus · C typing · D press',blocked='E–H: "Sign up to continue" modal (email/password/Google + reCAPTCHA). Nothing entered; CAPTCHA not touched.',
  clips=[('reference-a-input.mp4','A · input',3.5,'raw 1.50–5.00',[('frame-a-01.png','1.60'),('frame-a-02.png','2.15'),('frame-a-03.png','2.60'),('frame-a-04.png','3.60'),('frame-a-05.png','4.80')]),
         ('reference-b-submit.mp4','B · submit',4.0,'raw 5.00–9.00',[('frame-b-01.png','5.50'),('frame-b-02.png','5.80'),('frame-b-03.png','6.00'),('frame-b-04.png','6.50'),('frame-b-05.png','8.50')])],
  timeline=[('A 00.00–00.58','White page, outlined field with label inside, magnifier icon.'),('A 00.58–00.75','Click: label moves up into the border notch, scale ~0.75, ~0.15–0.2 s; border turns purple.'),('A 00.75–00.90','"example.com" placeholder fades in.'),('A 01.49–02.82','"terramore.io" typed, ~0.11 s per character.'),('B 00.62','Icon click: no visible press.'),('B 00.71–00.87','Scrim and modal fade in together (~0.15 s), in place.'),('B 00.87–02.37','Modal re-lays out as reCAPTCHA loads in steps.'),('B 02.37–04.00','Static gate; domain visible behind scrim.')],
  tags=['FLOATING_LABEL_RISE*','TYPE_ON','MODAL_REVEAL','GATE_INTERRUPT*','BOT_CHECK_INSERT*','INPUT_PERSISTS_AS_CONTEXT'],
  notes='Measurable floating-label motion; clean scrim+modal fade keeping the query visible underneath.'),
 dict(id='semrush',name='Semrush — SEO Checker (Site Audit)',url='https://www.semrush.com/siteaudit/',final='same URL (no navigation)',
  reached='A initial · B focus · C typing · D press → loading button · E progress modal (~2.1 s)',blocked='F–H: blocked by bot protection after step E — "We couldn\'t verify that you\'re human. Please try again." (invisible reCAPTCHA). Unrelated promo modal at raw ~21 s.',
  clips=[('reference-a-input.mp4','A · input',3.5,'raw 1.50–5.00',[('frame-a-01.png','1.60'),('frame-a-02.png','2.50'),('frame-a-03.png','3.40'),('frame-a-04.png','4.80')]),
         ('reference-b-loading.mp4','B · loading',4.0,'raw 5.00–9.00',[('frame-b-01.png','5.50'),('frame-b-02.png','6.50'),('frame-b-03.png','7.05'),('frame-b-04.png','7.60'),('frame-b-05.png','8.50')])],
  timeline=[('A 00.37–00.43','Click: light-blue focus ring in one step.'),('A 01.28–02.52','"terramore.io" typed (~0.10–0.11 s per character); clear "×" appears.'),('B 00.33–00.50','Click: button → grey with spinner; "Loading… It may take 2-3 min" appears.'),('B 00.50–00.63','Scrim + modal fade in; modal settles ~10–15 px downward (~0.13 s).'),('B 00.63–01.03','"Progress 0%", empty bar.'),('B 01.03–02.06','Label jumps to "Progress 100%"; bar fills left→right ~1.0 s, approx. linear.'),('B 02.56–02.76','Modal + scrim fade out (~0.2 s); error tooltip beside button.'),('B 02.76–04.00','Static; domain kept.')],
  tags=['FIELD_FOCUS_STATE*','TYPE_ON','CTA_PRESS_TO_LOADING','LOADING_SPINNER','MODAL_REVEAL','PROGRESS_BAR_FILL*','AGENT_PROGRESS','GATE_INTERRUPT*','INLINE_VALIDATION_MESSAGE*','BOT_CHECK_INSERT*','INPUT_PERSISTS_AS_CONTEXT'],
  notes='Only source with a visible "analyzing" beat. Progress is not tied to real state (100% label before fill; runs after check failed).'),
]
e=html.escape
def col(s):
  p=R+s['id']+'/'
  out=[f'<section class="col" id="{s["id"]}"><header><h2>{e(s["name"])}</h2><p class="url"><span>Visited</span> <code>{e(s["url"])}</code></p><p class="url"><span>After submit</span> {e(s["final"])}</p><p class="url"><a href="{p}source.md">source.md</a> · <a href="{p}motion-notes.md">motion-notes.md</a></p></header>']
  for f,label,d,rng,frames in s['clips']:
    out.append(f'<figure class="clip"><figcaption><strong>{e(label)}</strong> <code>{f}</code> · {d:.2f} s · {rng}</figcaption><div class="media" data-src="{p}{f}"><video controls muted loop playsinline preload="metadata"><source src="{p}{f}" type="video/mp4"></video></div><div class="frames">')
    for fn,t in frames:
      out.append(f'<figure class="still"><a class="media img" href="{p}{fn}" title="Open full size"><img src="{p}{fn}" alt="{e(s["name"])} still at raw {t} s" loading="lazy" onerror="missing(this)"></a><figcaption>{fn} · raw {t} s</figcaption></figure>')
    out.append('</div></figure>')
  out.append('<h3>Literal timeline</h3><dl class="tl">'+''.join(f'<dt>{e(a)}</dt><dd>{e(b)}</dd>' for a,b in s['timeline'])+'</dl>')
  out.append('<h3>Taxonomy tags</h3><ul class="tags">'+''.join(f'<li>{e(t)}</li>' for t in s['tags'])+'</ul>')
  out.append(f'<h3>Notes</h3><p>{e(s["notes"])}</p>')
  out.append(f'<h3>Capture limits</h3><p><span class="ok">Reached:</span> {e(s["reached"])}</p><p><span class="no">Blocked:</span> {e(s["blocked"])}</p></section>')
  return ''.join(out)
doc=f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Scene 1 Reference Board</title>
<style>
:root{{--bg:#f6f6f4;--panel:#fff;--ink:#1d1f21;--muted:#5d6166;--line:#d9dad6;--accent:#2a5bd7;--ok:#1d6b3a;--no:#9b2c2c;--ph:#ececea}}
@media (prefers-color-scheme:dark){{:root:not([data-theme="light"]){{--bg:#151617;--panel:#1e2022;--ink:#e9eaeb;--muted:#a3a7ab;--line:#33363a;--accent:#8db0ff;--ok:#7fd19b;--no:#f19b9b;--ph:#26292c}}}}
:root[data-theme="dark"]{{--bg:#151617;--panel:#1e2022;--ink:#e9eaeb;--muted:#a3a7ab;--line:#33363a;--accent:#8db0ff;--ok:#7fd19b;--no:#f19b9b;--ph:#26292c}}
*{{box-sizing:border-box}}
body{{margin:0;background:var(--bg);color:var(--ink);font:14px/1.45 system-ui,-apple-system,"Segoe UI",sans-serif}}
.top{{padding:20px 16px 8px;max-width:1400px}}
.top h1{{font-size:20px;margin:0 0 6px}}
.top p{{margin:4px 0;color:var(--muted);max-width:90ch}}
.warn{{border-left:3px solid var(--no);padding:6px 10px;background:var(--panel);margin:10px 0}}
.board{{display:grid;grid-auto-flow:column;grid-auto-columns:minmax(340px,420px);gap:14px;overflow-x:auto;padding:12px 16px 32px;align-items:start}}
@media (max-width:720px){{.board{{grid-auto-flow:row;grid-auto-columns:auto;overflow-x:visible}}}}
.col{{background:var(--panel);border:1px solid var(--line);border-radius:8px;padding:12px;min-width:0}}
.col h2{{font-size:16px;margin:0 0 6px}}
.col h3{{font-size:13px;margin:14px 0 6px;text-transform:uppercase;letter-spacing:.04em;color:var(--muted)}}
.url{{margin:2px 0;font-size:12px;color:var(--muted);overflow-wrap:anywhere}} .url span{{display:inline-block;min-width:80px}}
a{{color:var(--accent)}} code{{font-size:12px}}
.clip{{margin:12px 0 0;border-top:1px solid var(--line);padding-top:10px}} .clip>figcaption{{font-size:12px;margin-bottom:6px;overflow-wrap:anywhere}}
.media{{background:var(--ph);border-radius:4px;overflow:hidden;aspect-ratio:16/10;display:flex;align-items:center;justify-content:center}}
.media video,.media img{{width:100%;height:100%;object-fit:contain;display:block}}
.placeholder{{padding:10px;text-align:center;font-size:12px;color:var(--muted)}}
.frames{{display:grid;grid-template-columns:repeat(2,1fr);gap:6px;margin-top:6px}}
.still{{margin:0}} .still figcaption{{font-size:11px;color:var(--muted);margin-top:2px}}
.tl{{margin:0;display:grid;grid-template-columns:auto 1fr;gap:3px 8px;font-size:12.5px}} .tl dt{{font-family:ui-monospace,Menlo,monospace;font-size:11.5px;color:var(--muted);white-space:nowrap}} .tl dd{{margin:0}}
.tags{{list-style:none;padding:0;margin:0;display:flex;flex-wrap:wrap;gap:4px}} .tags li{{border:1px solid var(--line);border-radius:3px;padding:1px 6px;font:11.5px ui-monospace,Menlo,monospace}}
.ok{{color:var(--ok);font-weight:600}} .no{{color:var(--no);font-weight:600}}
p{{margin:4px 0}}
</style></head><body>
<div class="top">
<h1>Scene 1 reference board: "We diagnose your business."</h1>
<p>A local comparison page of real-time captures of public domain-lookup tools, recorded on 2026-10-06 (PDT) at 1280×800 in Chrome 154, typing <code>terramore.io</code>. This is research, not a Terramore prototype. Nothing here is selected or ranked; see <a href="SCENE_01_DECISION.md">SCENE_01_DECISION.md</a>.</p>
<p>Times are clip-relative (A = input clip, B = submit/loading clip). Stills list raw-recording seconds; click a still to open it full size. Tags marked * are "ADDED FROM OBSERVATION" in <a href="MOTION_TAXONOMY.md">MOTION_TAXONOMY.md</a>.</p>
<p class="warn">Third-party copyrighted media, kept local only (gitignored) and not for publication or generator upload. No source reached a real result: email gate, sign-up gate, bot protection or data error.</p>
</div>
<main class="board">{''.join(col(s) for s in S)}</main>
<script>
function ph(el,src){{var d=document.createElement('div');d.className='placeholder';d.textContent='local media not present — see source.md ('+src.split('/').pop()+')';el.replaceWith(d);}}
function missing(img){{ph(img,img.getAttribute('src'));}}
document.querySelectorAll('.media[data-src] video').forEach(function(v){{var s=v.querySelector('source');var src=s.getAttribute('src');s.addEventListener('error',function(){{ph(v,src);}});v.addEventListener('error',function(){{ph(v,src);}});}});
</script>
<noscript><p class="top">If media are missing, the players will be empty: local media not present — see each source.md.</p></noscript>
</body></html>
'''
open(OUT,'w').write(doc); print(len(doc))
