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

const PAGE = { width: 612, height: 792 } // US Letter
const MARGIN = 56
const CONTENT_WIDTH = PAGE.width - MARGIN * 2

/** pdf-lib standard fonts only cover WinAnsi. Drop anything they cannot draw. */
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
    if (font.widthOfTextAtSize(candidate, size) <= maxWidth) {
      current = candidate
    } else {
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
  ctx.page.drawText(clean(ctx.footer), { x: MARGIN, y: 30, size: 8.5, font: ctx.regular, color: MUTED })
  const label = `${ctx.pageNumber}`
  ctx.page.drawText(label, {
    x: PAGE.width - MARGIN - ctx.regular.widthOfTextAtSize(label, 8.5),
    y: 30,
    size: 8.5,
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
  if (ctx.y - needed < MARGIN + 20) newPage(ctx)
}

function paragraph(ctx: Ctx, text: string, size: number, font: PDFFont, color = SLATE, width = CONTENT_WIDTH, x = MARGIN, leading = 1.45) {
  const lines = wrap(text, font, size, width)
  for (const line of lines) {
    ensure(ctx, size * leading)
    ctx.page.drawText(line, { x, y: ctx.y - size, size, font, color })
    ctx.y -= size * leading
  }
  return lines.length
}

function cover(ctx: Ctx, report: ReportContent) {
  const page = ctx.page
  page.drawRectangle({ x: 0, y: 0, width: PAGE.width, height: PAGE.height, color: INK })

  page.drawText("TERRAMORE", { x: MARGIN, y: PAGE.height - MARGIN - 10, size: 11, font: ctx.bold, color: CREAM })
  page.drawText("DIGITAL FOOTPRINT REPORT", { x: MARGIN, y: PAGE.height - MARGIN - 28, size: 9, font: ctx.regular, color: CREAM_DIM })

  let y = PAGE.height - 260
  const titleLines = wrap(report.businessName, ctx.bold, 40, CONTENT_WIDTH)
  for (const line of titleLines.slice(0, 3)) {
    page.drawText(line, { x: MARGIN, y, size: 40, font: ctx.bold, color: CREAM })
    y -= 46
  }
  y -= 8
  for (const line of wrap("Digital footprint, current audience, current wins, and the openings we would take first.", ctx.regular, 15, CONTENT_WIDTH - 60)) {
    page.drawText(line, { x: MARGIN, y, size: 15, font: ctx.regular, color: CREAM_DIM })
    y -= 22
  }

  y -= 30
  const facts: Array<[string, string]> = [
    ["SITE", report.website ? report.website.replace(/^https?:\/\//, "").replace(/\/$/, "") : "Not given"],
    ["READ DATE", report.readDate],
  ]
  for (const [label, value] of facts) {
    page.drawText(label, { x: MARGIN, y, size: 8.5, font: ctx.regular, color: CREAM_DIM })
    page.drawText(clean(value).slice(0, 70), { x: MARGIN, y: y - 16, size: 13, font: ctx.regular, color: CREAM })
    y -= 44
  }

  y -= 10
  for (const line of wrap(report.headline, ctx.regular, 13, CONTENT_WIDTH)) {
    page.drawText(line, { x: MARGIN, y, size: 13, font: ctx.regular, color: CREAM })
    y -= 19
  }

  page.drawText("Prepared by Adam Moreno, Terramore. terramore.io", { x: MARGIN, y: 40, size: 9, font: ctx.regular, color: CREAM_DIM })
}

function chapter(ctx: Ctx, kicker: string, title: string, items: Array<{ label: string; value: string; note: string }>, summary: string) {
  newPage(ctx)
  ctx.page.drawText(clean(kicker).toUpperCase(), { x: MARGIN, y: ctx.y - 10, size: 9, font: ctx.regular, color: MUTED })
  ctx.y -= 26
  for (const line of wrap(title, ctx.bold, 24, CONTENT_WIDTH)) {
    ctx.page.drawText(line, { x: MARGIN, y: ctx.y - 24, size: 24, font: ctx.bold, color: INK })
    ctx.y -= 30
  }
  ctx.y -= 14

  for (const item of items) {
    const noteLines = wrap(item.note, ctx.regular, 10.5, CONTENT_WIDTH - 32)
    const valueLines = wrap(item.value, ctx.bold, 13, CONTENT_WIDTH - 32)
    const height = 14 + 12 + valueLines.length * 17 + (noteLines.length ? noteLines.length * 15 + 4 : 0) + 14
    ensure(ctx, height + 8)
    ctx.page.drawRectangle({ x: MARGIN, y: ctx.y - height, width: CONTENT_WIDTH, height, color: CARD })
    let y = ctx.y - 14
    ctx.page.drawText(clean(item.label).toUpperCase(), { x: MARGIN + 16, y: y - 8, size: 8.5, font: ctx.regular, color: MUTED })
    y -= 12 + 8
    for (const line of valueLines) {
      ctx.page.drawText(line, { x: MARGIN + 16, y: y - 13, size: 13, font: ctx.bold, color: INK })
      y -= 17
    }
    y -= 4
    for (const line of noteLines) {
      ctx.page.drawText(line, { x: MARGIN + 16, y: y - 10.5, size: 10.5, font: ctx.regular, color: SLATE })
      y -= 15
    }
    ctx.y -= height + 8
  }

  ctx.y -= 10
  ensure(ctx, 30)
  ctx.page.drawLine({ start: { x: MARGIN, y: ctx.y }, end: { x: MARGIN + CONTENT_WIDTH, y: ctx.y }, thickness: 0.75, color: RULE })
  ctx.y -= 16
  paragraph(ctx, summary, 11.5, ctx.regular, SLATE)
}

function moves(ctx: Ctx, report: ReportContent) {
  if (!report.moves.length) return
  const items = report.moves.map((move) => ({ label: move.window, value: move.title, note: move.body }))
  chapter(ctx, "05 · Next 90 days", "Three moves, in order.", items, "Talk with us and we map the work in a meeting. terramore.io/partner")
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
    footer: `Terramore · Digital Footprint report · ${report.businessName}`,
  }

  cover(ctx, report)
  for (const section of report.chapters) chapter(ctx, section.kicker, section.title, section.items, section.summary)
  moves(ctx, report)

  // Closing page
  newPage(ctx)
  ctx.page.drawText("WANT THIS FIXED?", { x: MARGIN, y: ctx.y - 10, size: 9, font: ctx.regular, color: MUTED })
  ctx.y -= 26
  for (const line of wrap("Talk with us. We map the work in a meeting.", ctx.bold, 24, CONTENT_WIDTH)) {
    ctx.page.drawText(line, { x: MARGIN, y: ctx.y - 24, size: 24, font: ctx.bold, color: INK })
    ctx.y -= 30
  }
  ctx.y -= 10
  paragraph(ctx, "The first call is free. You see the step where you lose sales before you pay to fix it. At day 90 you have a written plan with owners and dates.", 12, ctx.regular, SLATE)
  ctx.y -= 10
  paragraph(ctx, "Book: terramore.io/book", 12, ctx.bold, INK)
  paragraph(ctx, "Reply to this email or write adam.moreno@terramore.io", 12, ctx.regular, SLATE)
  ctx.y -= 24
  paragraph(
    ctx,
    "This report states only what we could see on the public web on the read date. Items marked Not found were not visible to us. Numbers are as shown by the source. No result is promised.",
    9,
    ctx.regular,
    MUTED,
  )

  const bytes = await doc.save()
  return Buffer.from(bytes)
}
