import { EMAIL_BRAND as BRAND, EMAIL_INK as INK, esc } from "@/lib/email-template"
import type { Recommendation } from "@/lib/report/types"

/**
 * The value of the report in the email itself, above the PDF line: the overall score and the top two fixes (ranked as
 * in the PDF), each with one short action and, when the Growth Workspace link is set, "Fix this" to open it.
 * Only what the PDF already shows the owner: no factor scores, ids, evidence or confidence.
 */
export type ReportEmailSummary = { text: string[]; html: string; /** Inbox preview line, or null to keep the default. */ preview: string | null }

/** Owners don't speak web jargon: the report's wording is translated before it reaches their inbox. */
const JARGON: [RegExp, string][] = [
  [/\bH1s?\b/g, "main headline"],
  [/\bprimary (?:CTAs?|buttons?)\b/gi, "main button"],
  [/\bCTAs?\b/g, "button"],
  [/\bcalls? to action\b/gi, "button"],
  [/\bmeta descriptions?\b/gi, "search description"],
  [/\bSEO\b/g, "search"],
  [/\babove the fold\b/gi, "at the top of the page"],
  [/\bconversion paths?\b/gi, "way customers reach you"],
  [/\bsitemap\.xml\b/gi, "sitemap"],
]

/**
 * What the check saw and the first step, in owner words, keyed by fix id. Kept in step with the dashboard's
 * lib/report-fixes/plain-words.ts (PLAIN_FINDING, PLAIN_STEP), so the report email, the series and the workspace say
 * the same thing. Ids not listed fall back to the report's text with the jargon swapped.
 */
const PLAIN_FINDING: Record<string, string> = {
  missing_h1: "Your homepage doesn't have one clear headline that says what you do.",
  no_cta: "We didn't find a clear button on your homepage, like Book now or Get a quote.",
  many_ctas: "Your homepage has several buttons asking for attention at once.",
  missing_meta: "Your homepage has no search description, the two lines Google can show under your name.",
  missing_sitemap: "We didn't find the page list (a sitemap) that helps Google find all your pages.",
  no_social_links: "We didn't find links to your social media pages on your website.",
  weak_contact: "Your phone number or a way to contact you is hard to find on your homepage.",
  thin_trust: "We found few reviews, photos of your work or guarantees on the pages we checked.",
  site_unreachable: "We couldn't open your website when we checked it.",
}

const PLAIN_STEP: Record<string, string> = {
  missing_h1: "Write one sentence at the top of your homepage that says what you do and where, like \"Roof repair in Sacramento\".",
  no_cta: "Put one button near the top of your homepage for the thing you most want visitors to do: call, book, get a quote or shop.",
  many_ctas: "Keep one main button near the top of your homepage and turn the others into plain links.",
  missing_meta: "Write one sentence on what you do and where, and add it as your homepage's search description in your website builder's page settings.",
  missing_sitemap: "Turn on the sitemap in your website builder's settings, or ask your web person to publish one.",
  weak_contact: "Put your phone number and a short contact form at the top of your homepage.",
  no_social_links: "Add links to your real, active social media pages in your website's footer.",
  thin_trust: "Add a few customer reviews, your license and insurance, or photos of your work near your main button.",
  site_unreachable: "Check that your web address works and your hosting is paid up, then run the check again.",
}

export function plainFinding(r: Pick<Recommendation, "id" | "finding">): string {
  return PLAIN_FINDING[r.id] ?? plainWords(r.finding)
}

export function plainStep(r: Pick<Recommendation, "id" | "action">): string {
  return PLAIN_STEP[r.id] ?? plainWords(shortAction(r.action))
}

export function plainWords(text: string): string {
  return JARGON.reduce((t, [re, w]) => t.replace(re, w), text)
}

/** The first step or sentence of an action, so each fix reads in one line ("Step 1: …" keeps step 1 only). */
export function shortAction(action: string): string {
  const step = action.match(/^\s*Step 1:\s*([\s\S]*?)(?:\s*Step 2:|$)/i)
  const body = (step ? step[1] : action).trim()
  const sentence = (body.match(/^[\s\S]*?[.!?](?=\s|$)/)?.[0] ?? body).trim()
  // "Step 1: ask every new customer…" starts mid-sentence; the email shows it as its own sentence.
  return sentence.charAt(0).toUpperCase() + sentence.slice(1)
}

export function reportEmailSummary(input: {
  businessName: string
  overallScore: number | null | undefined
  recommendations: Recommendation[]
  /** The Growth Workspace link (source=report_email); null hides "Fix this". */
  workspaceUrl: string | null
}): ReportEmailSummary {
  const text: string[] = []
  const html: string[] = []
  const score = typeof input.overallScore === "number" && Number.isFinite(input.overallScore) ? Math.round(input.overallScore) : null
  if (score !== null) {
    const line = `${input.businessName} scored ${score} out of 100 for what customers can see and do online.`
    text.push(line, "")
    html.push(`<p style="margin:0 0 14px 0;font-size:15px;line-height:1.6;color:${INK};"><strong>${esc(line)}</strong></p>`)
  }

  const top = [...input.recommendations].sort((a, b) => a.rank - b.rank).slice(0, 2)
  if (top.length) {
    const intro = top.length === 1 ? "The fix to start with:" : "The two fixes to start with:"
    text.push(intro)
    html.push(`<p style="margin:0 0 8px 0;font-size:15px;line-height:1.6;color:${INK};">${esc(intro)}</p>`)
    const items: string[] = []
    top.forEach((r, i) => {
      const action = plainStep(r)
      const finding = plainFinding(r)
      text.push(`${i + 1}. ${finding}`, `   ${action}`)
      if (input.workspaceUrl) text.push(`   Fix this: ${input.workspaceUrl}`)
      items.push(
        `<li style="margin:0 0 12px 0;font-size:15px;line-height:1.6;color:${INK};"><strong>${esc(finding)}</strong><br>${esc(action)}${
          input.workspaceUrl
            ? `<br><a href="${esc(input.workspaceUrl)}" target="_blank" style="color:${BRAND};text-decoration:underline;">Fix this</a>`
            : ""
        }</li>`,
      )
    })
    text.push("")
    html.push(`<ol style="margin:0 0 14px 0;padding-left:22px;">${items.join("")}</ol>`)
  }
  const preview =
    score !== null
      ? `${input.businessName} scored ${score} out of 100.${top.length ? ` ${top.length === 1 ? "The fix" : "The two fixes"} to start with are inside.` : ""}`
      : null
  return { text, html: html.join(""), preview }
}
