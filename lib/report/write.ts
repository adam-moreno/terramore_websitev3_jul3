/**
 * Turns observed diagnostic facts + deterministic scores into consulting prose.
 * The LLM must not invent scores, competitors, rankings, demographics, or metrics.
 *
 * Model key (first found wins):
 * - OPENAI_API_KEY      default model gpt-4.1-mini
 * - ANTHROPIC_API_KEY   default model claude-haiku-4-5
 * Override the model id with REPORT_MODEL.
 */

import { diagnosticToFactsPrompt } from "@/lib/report/recommend"
import type { DiagnosticBundle, Finding, Recommendation, ScoreFactor } from "@/lib/report/types"

export type ReportItem = { label: string; value: string; note: string }
export type ReportChapter = { kicker: string; title: string; items: ReportItem[]; summary: string }
export type ReportMove = { window: string; title: string; body: string }

export type ReportContent = {
  businessName: string
  website: string | null
  readDate: string
  headline: string
  chapters: ReportChapter[]
  moves: ReportMove[]
  model: string
  /** MVP diagnostic fields */
  overallScore: number | null
  evidenceCoverage: number
  whatCustomersSee: string
  working: string[]
  opportunities: string[]
  scoreFactors: ScoreFactor[]
  findings: Finding[]
  recommendations: Recommendation[]
  evidenceAppendix: Array<{ source: string; observation: string; date: string; confidence: "high" | "medium" | "low" }>
  competitiveNote: string
  disclaimers: string[]
  diagnostic: DiagnosticBundle
}

const CHAPTERS = [
  { kicker: "01 · First impression", title: "What a customer understands first." },
  { kicker: "02 · Trust & credibility", title: "What makes the business believable." },
  { kicker: "03 · Discoverability", title: "Where the business shows up publicly." },
  { kicker: "04 · Catalog & conversion", title: "Offer clarity and the next step." },
] as const

export function modelProvider(): { provider: "openai" | "anthropic"; model: string } | null {
  const override = process.env.REPORT_MODEL?.trim()
  if (process.env.OPENAI_API_KEY) return { provider: "openai", model: override || "gpt-4.1-mini" }
  if (process.env.ANTHROPIC_API_KEY) return { provider: "anthropic", model: override || "claude-haiku-4-5" }
  return null
}

const SYSTEM = `You write Digital Footprint diagnostic reports for Terramore.

Voice. Consulting-oriented. Short sentences. Plain words. No em dashes. Never use the word "tiles". Speak to the owner as "you". No hype, no "in today's digital landscape", no filler.

Truth rules (critical):
- You receive OBSERVED FACTS and DETERMINISTIC SCORES.
- You must NOT invent or change any score numbers.
- You must NOT invent competitors, rankings, demographics, reviews, locations, revenue, conversion rates, or follower counts.
- If something is missing, write exactly: Not found in sources checked
- Never say "This business does not have X." Say it was not found in sources checked.
- Rephrase the provided Top recommendations; do not reorder priorities or invent new top actions.

Output. Return one JSON object only:
{
  "headline": "one sentence on the biggest evidence-backed finding",
  "whatCustomersSee": "2-4 sentences: what a stranger can currently understand",
  "working": ["up to 5 short strengths grounded in facts"],
  "opportunities": ["up to 5 short opportunities grounded in facts"],
  "chapters": [
    { "kicker": "01 · First impression", "title": "What a customer understands first.", "items": [{ "label": "", "value": "", "note": "" }], "summary": "" },
    { "kicker": "02 · Trust & credibility", "title": "What makes the business believable.", "items": [...], "summary": "" },
    { "kicker": "03 · Discoverability", "title": "Where the business shows up publicly.", "items": [...], "summary": "" },
    { "kicker": "04 · Catalog & conversion", "title": "Offer clarity and the next step.", "items": [...], "summary": "" }
  ],
  "recommendationCopy": [
    { "rank": 1, "finding": "", "evidence": "", "impact": "", "action": "" }
  ],
  "moves": [
    { "window": "Week 1 to 3", "title": "", "body": "" },
    { "window": "Week 4 to 7", "title": "", "body": "" },
    { "window": "Week 8 to 12", "title": "", "body": "" }
  ]
}
Each chapter has 3 to 6 items. recommendationCopy must align 1:1 with the deterministic top recommendations provided (same rank order).`

function buildUserPrompt(facts: string, businessName: string): string {
  return `Business: ${businessName || "not given"}\n\n${facts}\n\nWrite the report JSON now. Do not invent scores or metrics.`
}

async function callOpenAI(model: string, facts: string, businessName: string): Promise<string> {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      temperature: 0.25,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: buildUserPrompt(facts, businessName) },
      ],
    }),
  })
  if (!response.ok) throw new Error(`OpenAI ${response.status}: ${(await response.text()).slice(0, 300)}`)
  const data = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> }
  const content = data.choices?.[0]?.message?.content
  if (!content) throw new Error("OpenAI returned no content")
  return content
}

async function callAnthropic(model: string, facts: string, businessName: string): Promise<string> {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": process.env.ANTHROPIC_API_KEY as string,
      "anthropic-version": "2023-06-01",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      max_tokens: 4000,
      temperature: 0.25,
      system: SYSTEM,
      messages: [{ role: "user", content: buildUserPrompt(facts, businessName) }],
    }),
  })
  if (!response.ok) throw new Error(`Anthropic ${response.status}: ${(await response.text()).slice(0, 300)}`)
  const data = (await response.json()) as { content?: Array<{ type: string; text?: string }> }
  const text = data.content?.find((part) => part.type === "text")?.text
  if (!text) throw new Error("Anthropic returned no content")
  return text
}

export function houseStyle(value: string): string {
  return value
    .replace(/\s*[—–]\s*/g, ", ")
    .replace(/\btiles?\b/gi, (match) => (match.toLowerCase() === "tiles" ? "cards" : "card"))
    .replace(/\s+,/g, ",")
    .trim()
}

function extractJson(raw: string): unknown {
  const start = raw.indexOf("{")
  const end = raw.lastIndexOf("}")
  if (start === -1 || end === -1) throw new Error("Model output had no JSON object")
  return JSON.parse(raw.slice(start, end + 1))
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? houseStyle(value) : fallback
}

function asStringList(value: unknown, max = 5): string[] {
  if (!Array.isArray(value)) return []
  return value.map((v) => asString(v)).filter(Boolean).slice(0, max)
}

function buildAppendix(diagnostic: DiagnosticBundle) {
  return diagnostic.facts
    .filter((f) => f.available || f.provenance.sourceType !== "derived")
    .slice(0, 40)
    .map((f) => ({
      source: f.provenance.sourceUrl || f.provenance.sourceType,
      observation: `${f.label}: ${f.available ? String(f.value) : "Not found in sources checked"}${f.note ? ` — ${f.note}` : ""}`,
      date: f.provenance.observedAt.slice(0, 10),
      confidence: f.provenance.confidence,
    }))
}

/**
 * Preferred entry: write from structured diagnostic (scores already fixed).
 */
export async function writeReportFromDiagnostic(diagnostic: DiagnosticBundle): Promise<ReportContent> {
  const chosen = modelProvider()
  if (!chosen) throw new Error("No model key. Set OPENAI_API_KEY or ANTHROPIC_API_KEY.")

  const facts = diagnosticToFactsPrompt(diagnostic)
  const raw =
    chosen.provider === "openai"
      ? await callOpenAI(chosen.model, facts, diagnostic.businessName)
      : await callAnthropic(chosen.model, facts, diagnostic.businessName)

  const parsed = extractJson(raw) as {
    headline?: unknown
    whatCustomersSee?: unknown
    working?: unknown
    opportunities?: unknown
    chapters?: Array<{ items?: Array<Record<string, unknown>>; summary?: unknown }>
    recommendationCopy?: Array<Record<string, unknown>>
    moves?: Array<Record<string, unknown>>
  }

  const chapters: ReportChapter[] = CHAPTERS.map((fixed, index) => {
    const source = parsed.chapters?.[index]
    const items = (source?.items || [])
      .slice(0, 6)
      .map((item) => ({
        label: asString(item.label, "Item"),
        value: asString(item.value, "Not found in sources checked"),
        note: asString(item.note),
      }))
    return {
      kicker: fixed.kicker,
      title: fixed.title,
      items: items.length
        ? items
        : [{ label: "Evidence", value: "Not found in sources checked", note: "Not enough public evidence for this section." }],
      summary: asString(source?.summary, "Not enough public evidence for this section."),
    }
  })

  const recommendations: Recommendation[] = diagnostic.recommendations.map((rec, index) => {
    const copy = parsed.recommendationCopy?.[index]
    return {
      ...rec,
      finding: asString(copy?.finding, rec.finding),
      evidence: asString(copy?.evidence, rec.evidence),
      impact: asString(copy?.impact, rec.impact),
      action: asString(copy?.action, rec.action),
    }
  })

  const moves: ReportMove[] = (parsed.moves || []).slice(0, 3).map((move, index) => ({
    window: asString(move.window, ["Week 1 to 3", "Week 4 to 7", "Week 8 to 12"][index]),
    title: asString(move.title, recommendations[index]?.action || "Review with the owner"),
    body: asString(move.body, recommendations[index]?.impact || ""),
  }))

  return {
    businessName: diagnostic.businessName || diagnostic.website || "Your business",
    website: diagnostic.website,
    readDate: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "America/Los_Angeles" }),
    headline: asString(parsed.headline, "Here is what we could see from the outside."),
    chapters,
    moves,
    model: `${chosen.provider}:${chosen.model}`,
    overallScore: diagnostic.scores.overall,
    evidenceCoverage: diagnostic.scores.evidenceCoverage,
    whatCustomersSee: asString(
      parsed.whatCustomersSee,
      "A first-time visitor can see only what was publicly observable in the sources checked.",
    ),
    working: asStringList(parsed.working),
    opportunities: asStringList(parsed.opportunities),
    scoreFactors: diagnostic.scores.factors,
    findings: diagnostic.recommendations,
    recommendations,
    evidenceAppendix: buildAppendix(diagnostic),
    competitiveNote: diagnostic.competitive.note,
    disclaimers: diagnostic.disclaimers,
    diagnostic,
  }
}

/** @deprecated Prefer writeReportFromDiagnostic. Kept for any direct callers. */
export async function writeReport(input: {
  businessName: string
  website: string | null
  facts: string
}): Promise<ReportContent> {
  const { collectDiagnostic } = await import("@/lib/report/diagnostic")
  const diagnostic = await collectDiagnostic(input.businessName, input.website)
  return writeReportFromDiagnostic(diagnostic)
}

export function reportToText(report: ReportContent): string {
  const lines: string[] = [
    `Digital Footprint report: ${report.businessName}`,
    report.website ? `Site: ${report.website}` : "",
    `Read date: ${report.readDate}`,
    `Digital Presence Score: ${report.overallScore ?? "n/a"} / 100`,
    `Evidence Coverage: ${report.evidenceCoverage}%`,
    "",
    report.headline,
    "",
    "What customers can currently understand",
    report.whatCustomersSee,
    "",
  ]
  if (report.working.length) {
    lines.push("What is working", ...report.working.map((w) => `- ${w}`), "")
  }
  if (report.opportunities.length) {
    lines.push("Biggest opportunities", ...report.opportunities.map((o) => `- ${o}`), "")
  }
  lines.push("Score breakdown")
  for (const f of report.scoreFactors) {
    lines.push(
      `- ${f.label}: ${f.available ? `${f.score}/100` : `Not available (${f.unavailableReason || ""})`}`,
    )
  }
  lines.push("")
  for (const chapter of report.chapters) {
    lines.push(`${chapter.kicker}`, chapter.title, "")
    for (const item of chapter.items) lines.push(`- ${item.label}: ${item.value}${item.note ? `. ${item.note}` : ""}`)
    lines.push("", chapter.summary, "")
  }
  if (report.recommendations.length) {
    lines.push("Top 5 actions", "")
    for (const r of report.recommendations) {
      lines.push(`${r.rank}. [${r.priority}] ${r.finding}`)
      lines.push(`   Evidence: ${r.evidence}`)
      lines.push(`   Impact: ${r.impact}`)
      lines.push(`   Action: ${r.action}`)
      lines.push("")
    }
  }
  lines.push("Competitive context", report.competitiveNote, "")
  if (report.evidenceAppendix.length) {
    lines.push("Evidence appendix")
    for (const row of report.evidenceAppendix.slice(0, 25)) {
      lines.push(`- [${row.date}] ${row.source}: ${row.observation} (${row.confidence})`)
    }
    lines.push("")
  }
  lines.push("Disclaimers", ...report.disclaimers.map((d) => `- ${d}`))
  return lines.filter((line, index, all) => !(line === "" && all[index - 1] === "")).join("\n").trim()
}
