/**
 * POST /api/sms/sendblue — Sendblue webhooks for the Terramore line (+1 612 356 8558).
 *
 * Auth: SENDBLUE_WEBHOOK_SECRET, either as ?key= on the webhook URL or in any request header (Sendblue sends its
 * signing secret in a header but doesn't document which), compared in constant time.
 *
 * Inbound text (is_outbound false):
 *   1. Logged to the Comms page (public.comms_messages). A retry of the same message_handle stops here, so nothing
 *      below happens twice.
 *   2. STOP / UNSUBSCRIBE / CANCEL / END / QUIT / STOPALL: the number is opted out first (website.sms_opt_outs), then
 *      one confirmation text. START / UNSTOP: opted back in, with a confirmation, only if they were opted out.
 *      HELP / INFO: one help text.
 *   3. Every inbound text alerts Adam (Slack and email) with who it's from when the number matches a lead, so a real
 *      reply never sits unanswered. Replies to owners are written by a person, from the Sendblue inbox.
 * Outbound status (is_outbound true, if that webhook is turned on): failures are logged to the Comms page.
 * Always answers 200 once authorised, so Sendblue doesn't retry a message we've already handled.
 */

import { NextRequest, NextResponse } from "next/server"
import { ADMIN_EMAIL, normalizePhone, postSlack, sendEmail, sendSms } from "@/lib/notify"
import { smsKeyword, SMS_REPLIES } from "@/lib/sms/keywords"
import { clearOptOut, isOptedOut, recordOptOut } from "@/lib/sms/opt-outs"
import { logText } from "@/lib/sms/comms-log"
import { getServerSupabase } from "@/lib/supabase-server"
import { authorised } from "@/lib/sms/webhook-auth"

export const dynamic = "force-dynamic"
export const maxDuration = 30

type SendbluePayload = {
  content?: string | null
  is_outbound?: boolean
  status?: string | null
  error_message?: string | null
  message_handle?: string | null
  from_number?: string | null
  number?: string | null
  to_number?: string | null
  opted_out?: boolean
}

/** Who a number belongs to, from the report and booking leads (name and business only). */
async function whoIs(phone: string): Promise<string | null> {
  const supabase = getServerSupabase()
  if (!supabase) return null
  const digits = phone.replace(/\D/g, "").slice(-10)
  const { data } = await supabase
    .schema("website")
    .from("free_courses_signups")
    .select("first_name,last_name,business_name,phone")
    .ilike("phone", `%${digits.slice(-4)}%`)
    .limit(25)
  const row = (data ?? []).find((r) => String(r.phone ?? "").replace(/\D/g, "").endsWith(digits))
  if (!row) return null
  const name = [row.first_name, row.last_name].filter((x) => x && x !== "-").join(" ")
  return [name, row.business_name].filter(Boolean).join(", ") || null
}

export async function POST(request: NextRequest) {
  if (!authorised(request, process.env.SENDBLUE_WEBHOOK_SECRET)) return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  const body = (await request.json().catch(() => null)) as SendbluePayload | null
  if (!body) return NextResponse.json({ ok: true, ignored: "no body" })

  if (body.is_outbound) {
    const to = normalizePhone(body.number || body.to_number)
    const status = String(body.status || "").toUpperCase()
    if (to && /FAIL|ERROR|UNDELIVER/.test(status)) {
      await logText({ direction: "outbound", phone: to, status: `failed_${status}`, text: body.error_message || "Delivery failed", providerId: body.message_handle ? `${body.message_handle}:status` : null, stream: "website" })
    }
    return NextResponse.json({ ok: true })
  }

  const from = normalizePhone(body.from_number || body.number)
  const content = String(body.content ?? "")
  if (!from) return NextResponse.json({ ok: true, ignored: "no sender" })

  const logged = await logText({ direction: "inbound", phone: from, status: "received", text: content || "(media)", providerId: body.message_handle ?? null, stream: "reply" })
  if (logged === "duplicate") return NextResponse.json({ ok: true, duplicate: true })

  const keyword = smsKeyword(content)
  let action = "reply"
  if (keyword === "stop") {
    await recordOptOut(from, content.trim().toUpperCase())
    await sendSms(from, SMS_REPLIES.stop, { typing: false, force: true, stream: "opt_out" })
    action = "opted out"
  } else if (keyword === "start") {
    if (await isOptedOut(from)) {
      await clearOptOut(from)
      await sendSms(from, SMS_REPLIES.start, { typing: false, stream: "opt_in" })
      action = "opted back in"
    }
  } else if (keyword === "help") {
    await sendSms(from, SMS_REPLIES.help, { typing: false, force: true, stream: "help" })
    action = "asked for help"
  }

  const who = await whoIs(from).catch(() => null)
  const label = who ? `${who} (${from})` : from
  const line = `Text from ${label}${action === "reply" ? "" : `, ${action}`}: "${content.slice(0, 500)}"`
  await Promise.allSettled([
    postSlack(`${line}\nReply from the Sendblue inbox: https://dashboard.sendblue.com/conversations`),
    sendEmail({
      to: ADMIN_EMAIL,
      subject: action === "reply" ? `Text reply from ${who || from}` : `Text ${action}: ${who || from}`,
      text: `${line}\n\nReply from the Sendblue inbox: https://dashboard.sendblue.com/conversations`,
    }),
  ])
  return NextResponse.json({ ok: true, action })
}
