/**
 * Optional HTML render of the diagnostic report (consulting layout).
 * PDF remains the emailed deliverable; this supports preview / future web delivery.
 */
import type { ReportContent } from "@/lib/report/write"

function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

export function renderReportHtml(report: ReportContent): string {
  const factors = report.scoreFactors
    .map((f) => {
      const score = f.available ? `${f.score}/100` : "Not available"
      const bar = f.available && f.score != null ? `<div class="bar"><span style="width:${f.score}%"></span></div>` : ""
      return `<div class="factor"><div class="factor-head"><strong>${esc(f.label)}</strong><span>${esc(score)}</span></div>${bar}<p>${esc(f.evidence.slice(0, 2).join(" · ") || f.unavailableReason || "")}</p></div>`
    })
    .join("")

  const actions = report.recommendations
    .map(
      (r) => `<article class="finding">
  <header>${r.rank}. ${esc(r.priority.toUpperCase())}</header>
  <p><strong>Finding.</strong> ${esc(r.finding)}</p>
  <p><strong>Evidence.</strong> ${esc(r.evidence)}</p>
  <p><strong>Impact.</strong> ${esc(r.impact)}</p>
  <p><strong>Action.</strong> ${esc(r.action)}</p>
</article>`,
    )
    .join("")

  const chapters = report.chapters
    .map((c) => {
      const items = c.items
        .map((i) => `<li><strong>${esc(i.label)}:</strong> ${esc(i.value)} <span>${esc(i.note)}</span></li>`)
        .join("")
      return `<section><h2>${esc(c.kicker)} — ${esc(c.title)}</h2><ul>${items}</ul><p>${esc(c.summary)}</p></section>`
    })
    .join("")

  const appendix = report.evidenceAppendix
    .slice(0, 30)
    .map((r) => `<tr><td>${esc(r.source)}</td><td>${esc(r.observation)}</td><td>${esc(r.date)}</td><td>${esc(r.confidence)}</td></tr>`)
    .join("")

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>Digital Footprint — ${esc(report.businessName)}</title>
<style>
  :root { --ink:#0f1e2e; --cream:#fcf9f8; --slate:#475569; --gold:#b48c46; --card:#f6f3f1; }
  body { margin:0; font:15px/1.45 Georgia, "Times New Roman", serif; color:var(--ink); background:var(--cream); }
  .wrap { max-width:820px; margin:0 auto; padding:48px 24px 80px; }
  h1 { font-size:2.2rem; margin:0 0 8px; }
  h2 { font-size:1.35rem; margin:2rem 0 .75rem; }
  .muted { color:var(--slate); }
  .scores { display:flex; gap:32px; margin:24px 0; }
  .score big { font-size:2.5rem; font-weight:700; }
  .factor { background:var(--card); padding:12px 14px; margin:8px 0; }
  .factor-head { display:flex; justify-content:space-between; }
  .bar { height:6px; background:#e8e4e0; margin:8px 0; }
  .bar span { display:block; height:6px; background:var(--gold); }
  .finding { background:var(--card); padding:14px 16px; margin:10px 0; }
  .finding header { color:var(--gold); font-size:.8rem; letter-spacing:.04em; }
  table { width:100%; border-collapse:collapse; font-size:.85rem; }
  td, th { border-top:1px solid #e5e2de; padding:8px 6px; vertical-align:top; text-align:left; }
  ul { padding-left:1.1rem; }
  li span { display:block; color:var(--slate); font-size:.9rem; }
</style>
</head>
<body>
<main class="wrap">
  <p class="muted">TERRAMORE · DIGITAL FOOTPRINT REPORT</p>
  <h1>${esc(report.businessName)}</h1>
  <p class="muted">${esc(report.website || "Website not given")} · ${esc(report.readDate)}</p>
  <p>${esc(report.headline)}</p>
  <div class="scores">
    <div class="score"><div class="muted">Digital Presence Score</div><big>${report.overallScore ?? "n/a"}</big><span class="muted"> / 100</span></div>
    <div class="score"><div class="muted">Evidence Coverage</div><big>${report.evidenceCoverage}%</big></div>
  </div>
  <h2>Executive summary</h2>
  <p>${esc(report.whatCustomersSee)}</p>
  ${report.working.length ? `<h3>What is working</h3><ul>${report.working.map((w) => `<li>${esc(w)}</li>`).join("")}</ul>` : ""}
  ${report.opportunities.length ? `<h3>Biggest opportunities</h3><ul>${report.opportunities.map((o) => `<li>${esc(o)}</li>`).join("")}</ul>` : ""}
  <h2>Score breakdown</h2>
  ${factors}
  ${chapters}
  <h2>Competitive context</h2>
  <p>${esc(report.competitiveNote)}</p>
  <h2>Top 5 actions</h2>
  ${actions}
  <h2>Evidence appendix</h2>
  <table><thead><tr><th>Source</th><th>Observation</th><th>Date</th><th>Confidence</th></tr></thead><tbody>${appendix}</tbody></table>
  <h2>Disclaimers</h2>
  <ul>${report.disclaimers.map((d) => `<li>${esc(d)}</li>`).join("")}</ul>
</main>
</body>
</html>`
}
