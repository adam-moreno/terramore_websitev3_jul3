/**
 * Hands a report request with call consent to TerraIQ's 5-minute follow-up (dashboard
 * lib/intake/follow-up-model.ts): the owner is texted at once and, if nobody calls within 3 minutes during the
 * prospect's calling hours, the AI assistant calls. Only with the "Call me about my report" box ticked
 * (lib/consent/call-consent.ts). Never throws; never logs the phone or name.
 *
 * Env: TERRAMORE_FOLLOW_UP_SECRET (same value in the dashboard project), optional TERRAMORE_FOLLOW_UP_URL.
 */
export async function requestFollowUp(input: {
  signupId: string
  firstName: string
  name: string
  phone: string
  business: string | null
  website: string | null
  timeZone: string | null
  consentVersion: string
  consentAt: string
}): Promise<void> {
  const secret = process.env.TERRAMORE_FOLLOW_UP_SECRET?.trim()
  if (!secret) {
    console.warn("[follow-up] not configured: TERRAMORE_FOLLOW_UP_SECRET missing")
    return
  }
  const url = process.env.TERRAMORE_FOLLOW_UP_URL?.trim() || "https://dashboard.terramore.io/api/internal/report-follow-up"
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${secret}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        signup_id: input.signupId,
        first_name: input.firstName,
        name: input.name,
        phone: input.phone,
        business: input.business,
        website: input.website,
        time_zone: input.timeZone,
        consent_version: input.consentVersion,
        consent_at: input.consentAt,
      }),
      signal: AbortSignal.timeout(10_000),
    })
    if (!response.ok) console.warn("[follow-up] not accepted", { status: response.status })
  } catch {
    console.warn("[follow-up] TerraIQ unreachable")
  }
}
