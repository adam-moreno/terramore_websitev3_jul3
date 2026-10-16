/**
 * The instant reply to an owner's first text from "Tap to text us" (2026-10-16). Once they've texted us, links and
 * media are allowed (Sendblue's first-message rules only bind our texts before a reply), so the reply carries the
 * contact card. One reply per ref; for the general footer text ("Ref WEB"), only to a number's first text.
 * Logic is pure behind its deps, for scripts/verify-sms-replies.mjs.
 */

import type { TextRef } from "@/lib/sms/text-refs"

export const CONTACT_CARD_URL = "https://www.terramore.io/terramore.vcf"
const SITE = "https://www.terramore.io"

export type ReplyDeps = {
  findTextRef(code: string): Promise<TextRef | null>
  claimTextRef(code: string, phone: string): Promise<boolean>
  firstInbound(): Promise<boolean>
  lookup(kind: "report" | "booking", refId: string): Promise<{ reportSent?: boolean; startIso?: string; tz?: string }>
}

function when(startIso: string, tz: string): string {
  const d = new Date(startIso)
  const day = new Intl.DateTimeFormat("en-US", { timeZone: tz, weekday: "long", month: "short", day: "numeric" }).format(d)
  const time = new Intl.DateTimeFormat("en-US", { timeZone: tz, hour: "numeric", minute: "2-digit", timeZoneName: "short" }).format(d)
  return `${day} at ${time}`
}

const CLOSE = "Here's our contact card so our texts and links show up properly. Reply STOP to opt out."

export function reportReply(first: string | null, sent: boolean): string {
  const hi = first ? `Hi ${first}, it's Adam at Terramore.` : "Hi, it's Adam at Terramore."
  const status = sent
    ? "Your Digital Footprint report is in your inbox (check spam if you don't see it)."
    : "Your Digital Footprint report is on its way to your inbox, usually within a few minutes."
  return `${hi} Thanks for texting! ${status} Questions about it? Just reply here. ${CLOSE}`
}

export function bookingReply(first: string | null, time: string | null): string {
  const hi = first ? `Hi ${first}, it's Adam at Terramore.` : "Hi, it's Adam at Terramore."
  const set = time ? `You're all set for ${time}.` : "You're all set for your call."
  return `${hi} ${set} I'll text you a day before, 2 hours before and 30 minutes before, with the join link. Need to move it? Just reply here. ${CLOSE}`
}

export function siteReply(): string {
  return `Hi, it's Adam at Terramore. Thanks for texting! Send me your website and I'll run your free check, or run it yourself in about a minute: ${SITE}/report ${CLOSE}`
}

/** The reply and a label for Adam's alert, or null when no instant reply is due. Never throws. */
export async function textFirstReply(ref: string, phone: string, deps: ReplyDeps): Promise<{ text: string; label: string } | null> {
  try {
    if (ref === "WEB") {
      if (!(await deps.firstInbound())) return null
      return { text: siteReply(), label: "texted from the website (free check)" }
    }
    const found = await deps.findTextRef(ref)
    if (!found) return null
    if (!(await deps.claimTextRef(ref, phone))) return null
    const ctx = await deps.lookup(found.kind, found.ref_id).catch(() => ({}) as { reportSent?: boolean; startIso?: string; tz?: string })
    if (found.kind === "report") return { text: reportReply(found.first_name, ctx.reportSent === true), label: `texted about their report (ref ${ref})` }
    const time = ctx.startIso ? when(ctx.startIso, ctx.tz || "America/Los_Angeles") : null
    return { text: bookingReply(found.first_name, time), label: `asked for call reminders by text (ref ${ref})` }
  } catch (error) {
    console.error(`[text-first] reply failed: ${error instanceof Error ? error.message : String(error)}`)
    return null
  }
}
