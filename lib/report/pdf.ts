import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib"
import type { ReportContent } from "@/lib/report/write"

/* Brand colors from tailwind.config.ts */
const INK = rgb(15 / 255, 30 / 255, 46 / 255)
const CREAM = rgb(252 / 255, 249 / 255, 248 / 255)
const CREAM_DIM = rgb(0.78, 0.78, 0.8)
const SLATE = rgb(71 / 255, 85 / 255, 105 / 255)
const MUTED = rgb(0.55, 0.58, 0.62)
const CARD = rgb(0.965, 0.955, 0.95)
const RULE = rgb(0.9, 0.9, 0.9)
const GOLD = rgb(180 / 255, 140 / 255, 70 / 255)

const PAGE = { width: 612, height: 792 }
const MARGIN = 48
const CONTENT_WIDTH = PAGE.width - MARGIN * 2

function clean(value: string): string {
  return value
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/\u2026/g, "...")
    .replace(/[^\x20-\x7E\xA0-\xFF\u2022]/g, "")
    .replace(/\s+/g, " ")
    .trim()
}

function wrap(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const words = clean(text).split(" ").filter(Boolean)
  const lines: string[] = []
  let current = ""
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word
    if (font.widthOfTextAtSize(candidate, size) <= maxWidth) current = candidate
    else {
      if (current) lines.push(current)
      current = word
    }
  }
  if (current) lines.push(current)
  return lines
}

type Ctx = {
  doc: PDFDocument
  page: PDFPage
  y: number
  regular: PDFFont
  bold: PDFFont
  pageNumber: number
  footer: string
}

function footer(ctx: Ctx) {
  ctx.page.drawText(clean(ctx.footer), { x: MARGIN, y: 28, size: 8, font: ctx.regular, color: MUTED })
  const label = `${ctx.pageNumber}`
  ctx.page.drawText(label, {
    x: PAGE.width - MARGIN - ctx.regular.widthOfTextAtSize(label, 8),
    y: 28,
    size: 8,
    font: ctx.regular,
    color: MUTED,
  })
}

function newPage(ctx: Ctx) {
  ctx.page = ctx.doc.addPage([PAGE.width, PAGE.height])
  ctx.page.drawRectangle({ x: 0, y: 0, width: PAGE.width, height: PAGE.height, color: CREAM })
  ctx.pageNumber += 1
  ctx.y = PAGE.height - MARGIN
  footer(ctx)
}

function ensure(ctx: Ctx, needed: number) {
  if (ctx.y - needed < MARGIN + 24) newPage(ctx)
}

function paragraph(ctx: Ctx, text: string, size: number, font: PDFFont, color = SLATE, width = CONTENT_WIDTH, x = MARGIN, leading = 1.4) {
  const lines = wrap(text, font, size, width)
  for (const line of lines) {
    ensure(ctx, size * leading)
    ctx.page.drawText(line, { x, y: ctx.y - size, size, font, color })
    ctx.y -= size * leading
  }
  return lines.length
}

function sectionTitle(ctx: Ctx, kicker: string, title: string) {
  ensure(ctx, 56)
  ctx.page.drawText(clean(kicker).toUpperCase(), { x: MARGIN, y: ctx.y - 10, size: 8.5, font: ctx.regular, color: MUTED })
  ctx.y -= 24
  for (const line of wrap(title, ctx.bold, 20, CONTENT_WIDTH)) {
    ensure(ctx, 24)
    ctx.page.drawText(line, { x: MARGIN, y: ctx.y - 18, size: 20, font: ctx.bold, color: INK })
    ctx.y -= 24
  }
  ctx.y -= 8
}

function scoreBar(ctx: Ctx, label: string, score: number | null, note?: string) {
  const h = note ? 36 : 28
  ensure(ctx, h + 6)
  ctx.page.drawText(clean(label), { x: MARGIN, y: ctx.y - 12, size: 10, font: ctx.bold, color: INK })
  const value = score == null ? "N/A" : `${score}`
  ctx.page.drawText(value, {
    x: PAGE.width - MARGIN - ctx.bold.widthOfTextAtSize(value, 11),
    y: ctx.y - 12,
    size: 11,
    font: ctx.bold,
    color: INK,
  })
  const barX = MARGIN
  const barY = ctx.y - 22
  const barW = CONTENT_WIDTH
  ctx.page.drawRectangle({ x: barX, y: barY, width: barW, height: 6, color: RULE })
  if (score != null) {
    ctx.page.drawRectangle({
      x: barX,
      y: barY,
      width: Math.max(2, (barW * Math.min(100, Math.max(0, score))) / 100),
      height: 6,
      color: GOLD,
    })
  }
  ctx.y -= 28
  if (note) {
    paragraph(ctx, note, 9, ctx.regular, MUTED)
    ctx.y -= 4
  }
}

function bulletList(ctx: Ctx, items: string[]) {
  for (const item of items) {
    const lines = wrap(`• ${item}`, ctx.regular, 10.5, CONTENT_WIDTH)
    ensure(ctx, lines.length * 15 + 2)
    for (const line of lines) {
      ctx.page.drawText(line, { x: MARGIN, y: ctx.y - 10.5, size: 10.5, font: ctx.regular, color: SLATE })
      ctx.y -= 15
    }
  }
}

function findingCard(
  ctx: Ctx,
  rank: number,
  priority: string,
  finding: string,
  evidence: string,
  impact: string,
  action: string,
) {
  const blocks = [
    `FINDING  ${finding}`,
    `EVIDENCE  ${evidence}`,
    `IMPACT  ${impact}`,
    `ACTION  ${action}`,
  ]
  const lineSets = blocks.map((b) => wrap(b, ctx.regular, 10, CONTENT_WIDTH - 28))
  const height = 22 + lineSets.reduce((s, ls) => s + ls.length * 13, 0) + 16
  ensure(ctx, height + 8)
  ctx.page.drawRectangle({ x: MARGIN, y: ctx.y - height, width: CONTENT_WIDTH, height, color: CARD })
  let y = ctx.y - 14
  ctx.page.drawText(clean(`${rank}. ${priority.toUpperCase()}`), {
    x: MARGIN + 14,
    y: y - 8,
    size: 8.5,
    font: ctx.bold,
    color: GOLD,
  })
  y -= 18
  for (const lines of lineSets) {
    for (const line of lines) {
      ctx.page.drawText(line, { x: MARGIN + 14, y: y - 10, size: 10, font: ctx.regular, color: SLATE })
      y -= 13
    }
    y -= 2
  }
  ctx.y -= height + 8
}

function cover(ctx: Ctx, report: ReportContent) {
  const page = ctx.page
  page.drawRectangle({ x: 0, y: 0, width: PAGE.width, height: PAGE.height, color: INK })

  page.drawText("TERRAMORE", { x: MARGIN, y: PAGE.height - MARGIN - 10, size: 11, font: ctx.bold, color: CREAM })
  page.drawText("DIGITAL FOOTPRINT REPORT", {
    x: MARGIN,
    y: PAGE.height - MARGIN - 28,
    size: 9,
    font: ctx.regular,
    color: CREAM_DIM,
  })

  let y = PAGE.height - 220
  for (const line of wrap(report.businessName, ctx.bold, 36, CONTENT_WIDTH).slice(0, 3)) {
    page.drawText(line, { x: MARGIN, y, size: 36, font: ctx.bold, color: CREAM })
    y -= 42
  }
  y -= 8
  page.drawText("Public digital presence, examined as a first-time customer would see it.", {
    x: MARGIN,
    y,
    size: 12,
    font: ctx.regular,
    color: CREAM_DIM,
  })
  y -= 40

  const scoreLabel = report.overallScore == null ? "n/a" : `${report.overallScore}`
  page.drawText("DIGITAL PRESENCE SCORE", { x: MARGIN, y, size: 8.5, font: ctx.regular, color: CREAM_DIM })
  page.drawText(scoreLabel, { x: MARGIN, y: y - 28, size: 32, font: ctx.bold, color: CREAM })
  page.drawText("/ 100", { x: MARGIN + ctx.bold.widthOfTextAtSize(scoreLabel, 32) + 8, y: y - 20, size: 12, font: ctx.regular, color: CREAM_DIM })

  page.drawText("EVIDENCE COVERAGE", { x: MARGIN + 220, y, size: 8.5, font: ctx.regular, color: CREAM_DIM })
  page.drawText(`${report.evidenceCoverage}%`, { x: MARGIN + 220, y: y - 28, size: 32, font: ctx.bold, color: CREAM })

  y -= 70
  page.drawText("SITE", { x: MARGIN, y, size: 8, font: ctx.regular, color: CREAM_DIM })
  page.drawText(
    clean(report.website ? report.website.replace(/^https?:\/\//, "").replace(/\/$/, "") : "Not given").slice(0, 70),
    { x: MARGIN, y: y - 16, size: 12, font: ctx.regular, color: CREAM },
  )
  y -= 44
  page.drawText("READ DATE", { x: MARGIN, y, size: 8, font: ctx.regular, color: CREAM_DIM })
  page.drawText(clean(report.readDate), { x: MARGIN, y: y - 16, size: 12, font: ctx.regular, color: CREAM })
  y -= 50
  for (const line of wrap(report.headline, ctx.regular, 12, CONTENT_WIDTH)) {
    page.drawText(line, { x: MARGIN, y, size: 12, font: ctx.regular, color: CREAM })
    y -= 17
  }
  page.drawText("Prepared by Terramore · terramore.io", { x: MARGIN, y: 40, size: 9, font: ctx.regular, color: CREAM_DIM })
}

function chapter(ctx: Ctx, kicker: string, title: string, items: Array<{ label: string; value: string; note: string }>, summary: string) {
  sectionTitle(ctx, kicker, title)
  for (const item of items) {
    const noteLines = wrap(item.note, ctx.regular, 10, CONTENT_WIDTH - 28)
    const valueLines = wrap(item.value, ctx.bold, 12, CONTENT_WIDTH - 28)
    const height = 12 + 10 + valueLines.length * 15 + (noteLines.length ? noteLines.length * 13 + 2 : 0) + 12
    ensure(ctx, height + 6)
    ctx.page.drawRectangle({ x: MARGIN, y: ctx.y - height, width: CONTENT_WIDTH, height, color: CARD })
    let y = ctx.y - 12
    ctx.page.drawText(clean(item.label).toUpperCase(), { x: MARGIN + 14, y: y - 8, size: 8, font: ctx.regular, color: MUTED })
    y -= 18
    for (const line of valueLines) {
      ctx.page.drawText(line, { x: MARGIN + 14, y: y - 12, size: 12, font: ctx.bold, color: INK })
      y -= 15
    }
    y -= 2
    for (const line of noteLines) {
      ctx.page.drawText(line, { x: MARGIN + 14, y: y - 10, size: 10, font: ctx.regular, color: SLATE })
      y -= 13
    }
    ctx.y -= height + 6
  }
  ctx.y -= 6
  paragraph(ctx, summary, 10.5, ctx.regular, SLATE)
  ctx.y -= 8
}

export async function renderReportPdf(report: ReportContent): Promise<Buffer> {
  const doc = await PDFDocument.create()
  doc.setTitle(`Digital Footprint report: ${clean(report.businessName)}`)
  doc.setAuthor("Terramore")
  doc.setProducer("Terramore")
  doc.setCreationDate(new Date())

  const ctx: Ctx = {
    doc,
    page: doc.addPage([PAGE.width, PAGE.height]),
    y: PAGE.height - MARGIN,
    regular: await doc.embedFont(StandardFonts.Helvetica),
    bold: await doc.embedFont(StandardFonts.HelveticaBold),
    pageNumber: 1,
    footer: `Terramore · Digital Footprint · ${report.businessName}`,
  }

  cover(ctx, report)

  // Executive summary
  newPage(ctx)
  sectionTitle(ctx, "Executive summary", "Score, coverage, and priorities.")
  paragraph(ctx, report.whatCustomersSee, 11, ctx.regular, SLATE)
  ctx.y -= 10
  if (report.working.length) {
    ensure(ctx, 20)
    ctx.page.drawText("WHAT IS WORKING", { x: MARGIN, y: ctx.y - 10, size: 8.5, font: ctx.bold, color: MUTED })
    ctx.y -= 18
    bulletList(ctx, report.working)
    ctx.y -= 8
  }
  if (report.opportunities.length) {
    ensure(ctx, 20)
    ctx.page.drawText("BIGGEST OPPORTUNITIES", { x: MARGIN, y: ctx.y - 10, size: 8.5, font: ctx.bold, color: MUTED })
    ctx.y -= 18
    bulletList(ctx, report.opportunities)
    ctx.y -= 8
  }

  sectionTitle(ctx, "Digital Presence Score", "Deterministic factors from observed evidence.")
  paragraph(
    ctx,
    `Overall ${report.overallScore ?? "n/a"} / 100 with ${report.evidenceCoverage}% evidence coverage. Missing factors are marked Not available; their weight is redistributed across measured factors.`,
    10,
    ctx.regular,
    SLATE,
  )
  ctx.y -= 8
  for (const factor of report.scoreFactors) {
    scoreBar(
      ctx,
      factor.label,
      factor.available ? factor.score : null,
      factor.available ? factor.evidence.slice(0, 2).join(" · ") : factor.unavailableReason,
    )
  }

  for (const section of report.chapters) {
    newPage(ctx)
    chapter(ctx, section.kicker, section.title, section.items, section.summary)
  }

  newPage(ctx)
  sectionTitle(ctx, "Competitive context", "Public sources only.")
  paragraph(ctx, report.competitiveNote, 11, ctx.regular, SLATE)
  ctx.y -= 12

  sectionTitle(ctx, "Top 5 actions", "Prioritized from evidence.")
  for (const r of report.recommendations) {
    findingCard(ctx, r.rank, r.priority, r.finding, r.evidence, r.impact, r.action)
  }

  if (report.moves.length) {
    ctx.y -= 6
    sectionTitle(ctx, "Next 90 days", "Three moves, in order.")
    for (const move of report.moves) {
      ensure(ctx, 40)
      ctx.page.drawText(clean(move.window).toUpperCase(), { x: MARGIN, y: ctx.y - 10, size: 8, font: ctx.regular, color: MUTED })
      ctx.y -= 18
      paragraph(ctx, move.title, 12, ctx.bold, INK)
      paragraph(ctx, move.body, 10.5, ctx.regular, SLATE)
      ctx.y -= 8
    }
  }

  newPage(ctx)
  sectionTitle(ctx, "Evidence appendix", "Traceable observations.")
  for (const row of report.evidenceAppendix.slice(0, 18)) {
    const line = `${row.date} · ${row.source} · ${row.observation} (${row.confidence})`
    paragraph(ctx, line, 8.5, ctx.regular, SLATE)
    ctx.y -= 2
  }

  ctx.y -= 12
  sectionTitle(ctx, "Disclaimers", "How to read this report.")
  for (const d of report.disclaimers) {
    paragraph(ctx, `• ${d}`, 9, ctx.regular, MUTED)
  }
  ctx.y -= 16
  paragraph(ctx, "Talk through this report: terramore.io/book", 11, ctx.bold, INK)
  paragraph(ctx, "Prepared by Terramore. No private analytics or revenue data was used.", 9, ctx.regular, MUTED)

  const bytes = await doc.save()
  return Buffer.from(bytes)
}
