import { EMAIL_BRAND as BRAND, EMAIL_INK as INK, esc } from "@/lib/email-template"
import type { Recommendation } from "@/lib/report/types"

/**
 * The value of the report in the email itself, above the PDF line: the overall score and the top two fixes (ranked as
 * in the PDF), each with one short action and, when the Growth Workspace link is set, "Fix this" to open it.
 * Only what the PDF already shows the owner: no factor scores, ids, evidence or confidence.
 */
export type ReportEmailSummary = { text: string[]; html: string; /** Inbox preview line, or null to keep the default. */ preview: string | null }

/** The first step or sentence of an action, so each fix reads in one line ("Step 1: …" keeps step 1 only). */
export function shortAction(action: string): string {
  const step = action.match(/^\s*Step 1:\s*([\s\S]*?)(?:\s*Step 2:|$)/i)
  const body = (step ? step[1] : action).trim()
  const sentence = body.match(/^[\s\S]*?[.!?](?=\s|$)/)?.[0] ?? body
  return sentence.trim()
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
      const action = shortAction(r.action)
      text.push(`${i + 1}. ${r.finding}`, `   ${action}`)
      if (input.workspaceUrl) text.push(`   Fix this: ${input.workspaceUrl}`)
      items.push(
        `<li style="margin:0 0 12px 0;font-size:15px;line-height:1.6;color:${INK};"><strong>${esc(r.finding)}</strong><br>${esc(action)}${
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
