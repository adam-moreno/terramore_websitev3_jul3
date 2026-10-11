import { ADMIN_EMAIL, postSlack, sendEmail, sendSms } from "@/lib/notify"

/**
 * Readiness answers from the report pop-up (owner decision 2026-10-11) and the hot-lead alert. A prospect who wants
 * results this month and wants it done for them is Hot: the owner is texted (Sendblue when configured, else Twilio)
 * and emailed at once, so the call happens within the hour. Internal only: the prospect never sees a label or score.
 */

export type Readiness = { when: "month" | "quarter" | "exploring" | null; how: "self" | "help" | "done" | null }

export function readinessFromAnswers(raw: Record<string, unknown>): Readiness {
  const when = raw.when === "month" || raw.when === "quarter" || raw.when === "exploring" ? raw.when : null
  const how = raw.how === "self" || raw.how === "help" || raw.how === "done" ? raw.how : null
  return { when, how }
}

/** Hot: results this month, done for them. Warm candidates are sorted later by fit in TerraIQ. */
export function isHotLead(readiness: Readiness): boolean {
  return readiness.when === "month" && readiness.how === "done"
}

export async function alertHotLead(lead: { name: string; email: string; phone: string | null; business: string | null; website: string | null }): Promise<void> {
  const who = lead.business ? `${lead.name} (${lead.business})` : lead.name
  const lines = [
    `Hot lead: ${who} wants results this month and wants it done for them.`,
    lead.website ? `Site: ${lead.website}` : null,
    lead.phone ? `Phone: ${lead.phone}` : "No phone given",
    `Email: ${lead.email}`,
    "Call within the hour.",
  ].filter(Boolean) as string[]
  const text = lines.join("\n")
  const results = await Promise.allSettled([
    sendSms(process.env.HOT_LEAD_ALERT_PHONE, text),
    sendEmail({ to: process.env.HOT_LEAD_ALERT_EMAIL?.trim() || ADMIN_EMAIL, subject: `Hot lead: ${who}`, text }),
    postSlack(text),
  ])
  for (const result of results) if (result.status === "rejected") console.error("[hot-lead] alert failed:", String(result.reason).slice(0, 200))
}
