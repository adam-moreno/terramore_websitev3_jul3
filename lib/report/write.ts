/**
 * Turns observed footprint facts into the four report chapters, in the house voice.
 *
 * Model key (first found wins):
 * - OPENAI_API_KEY      default model gpt-4.1-mini
 * - ANTHROPIC_API_KEY   default model claude-haiku-4-5
 * Override the model id with REPORT_MODEL.
 */

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
}

const CHAPTERS = [
  { kicker: "01 · Digital footprint", title: "Where you already show up." },
  { kicker: "02 · Current audience", title: "Who already looks, and who already buys." },
  { kicker: "03 · Current wins", title: "What already pays." },
  { kicker: "04 · Current openings", title: "Where cash is leaking." },
] as const

export function modelProvider(): { provider: "openai" | "anthropic"; model: string } | null {
  const override = process.env.REPORT_MODEL?.trim()
  if (process.env.OPENAI_API_KEY) return { provider: "openai", model: override || "gpt-4.1-mini" }
  if (process.env.ANTHROPIC_API_KEY) return { provider: "anthropic", model: override || "claude-haiku-4-5" }
  return null
}

const SYSTEM = `You write Digital Footprint reports for Terramore, a growth team for small-business owners.

Voice rules. Short sentences. Plain words an owner reads in one pass. No em dashes anywhere. Never use the word "tiles". Speak to the owner as "you". No hype, no jargon, no filler.

Truth rules. You only get a list of facts we observed on the public web. State only what is in the facts. If a fact is missing, the value is "Not found" and the note says what we could not see and how the owner can show us. Never invent numbers, followers, reviews, revenue, audience sizes, products, or tools. Do not guess who the customer is unless the site text says so. When a chapter has little evidence, say so plainly and keep it short.

Output. Return one JSON object and nothing else, shaped exactly like this:
{
  "headline": "one sentence on the biggest thing we saw",
  "chapters": [
    { "kicker": "01 · Digital footprint", "title": "Where you already show up.", "items": [{ "label": "", "value": "", "note": "" }], "summary": "" },
    { "kicker": "02 · Current audience", "title": "Who already looks, and who already buys.", "items": [...], "summary": "" },
    { "kicker": "03 · Current wins", "title": "What already pays.", "items": [...], "summary": "" },
    { "kicker": "04 · Current openings", "title": "Where cash is leaking.", "items": [...], "summary": "" }
  ],
  "moves": [
    { "window": "Week 1 to 3", "title": "", "body": "" },
    { "window": "Week 4 to 7", "title": "", "body": "" },
    { "window": "Week 8 to 12", "title": "", "body": "" }
  ]
}
Each chapter has 3 to 6 items. Labels are short (Site, Instagram, Google Business, Tracking, Email tool, Checkout, Booking). Values are short facts. Notes are one or two sentences. Summaries are two to four sentences. Moves are what Terramore would do first, in order, grounded in the openings you listed.`

function buildUserPrompt(facts: string, businessName: string): string {
  return `Business: ${businessName || "not given"}\n\nObserved facts:\n${facts}\n\nWrite the report JSON now.`
}

async function callOpenAI(model: string, facts: string, businessName: string): Promise<string> {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      temperature: 0.3,
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
      max_tokens: 3000,
      temperature: 0.3,
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

/** House style guard applied after the model: no em dashes, no "tiles". */
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

export async function writeReport(input: {
  businessName: string
  website: string | null
  facts: string
}): Promise<ReportContent> {
  const chosen = modelProvider()
  if (!chosen) throw new Error("No model key. Set OPENAI_API_KEY or ANTHROPIC_API_KEY.")

  const raw =
    chosen.provider === "openai"
      ? await callOpenAI(chosen.model, input.facts, input.businessName)
      : await callAnthropic(chosen.model, input.facts, input.businessName)

  const parsed = extractJson(raw) as {
    headline?: unknown
    chapters?: Array<{ items?: Array<Record<string, unknown>>; summary?: unknown }>
    moves?: Array<Record<string, unknown>>
  }

  const chapters: ReportChapter[] = CHAPTERS.map((fixed, index) => {
    const source = parsed.chapters?.[index]
    const items = (source?.items || [])
      .slice(0, 6)
      .map((item) => ({
        label: asString(item.label, "Item"),
        value: asString(item.value, "Not found"),
        note: asString(item.note),
      }))
    return {
      kicker: fixed.kicker,
      title: fixed.title,
      items: items.length ? items : [{ label: "Evidence", value: "Not found", note: "We could not see enough on the public web for this chapter." }],
      summary: asString(source?.summary, "Not enough public evidence for this chapter."),
    }
  })

  const moves: ReportMove[] = (parsed.moves || []).slice(0, 3).map((move, index) => ({
    window: asString(move.window, ["Week 1 to 3", "Week 4 to 7", "Week 8 to 12"][index]),
    title: asString(move.title, "Review with the owner"),
    body: asString(move.body),
  }))

  return {
    businessName: input.businessName || input.website || "Your business",
    website: input.website,
    readDate: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "America/Los_Angeles" }),
    headline: asString(parsed.headline, "Here is what we could see from the outside."),
    chapters,
    moves,
    model: `${chosen.provider}:${chosen.model}`,
  }
}

/** Plain text version stored in Supabase and used as the email body fallback. */
export function reportToText(report: ReportContent): string {
  const lines: string[] = [
    `Digital Footprint report: ${report.businessName}`,
    report.website ? `Site: ${report.website}` : "",
    `Read date: ${report.readDate}`,
    "",
    report.headline,
    "",
  ]
  for (const chapter of report.chapters) {
    lines.push(`${chapter.kicker}`, chapter.title, "")
    for (const item of chapter.items) lines.push(`- ${item.label}: ${item.value}${item.note ? `. ${item.note}` : ""}`)
    lines.push("", chapter.summary, "")
  }
  if (report.moves.length) {
    lines.push("05 · Next 90 days", "Three moves, in order.", "")
    for (const move of report.moves) lines.push(`- ${move.window}: ${move.title}${move.body ? `. ${move.body}` : ""}`)
  }
  return lines.filter((line, index, all) => !(line === "" && all[index - 1] === "")).join("\n").trim()
}
