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
 *   3. Every inbound text alerts Adam (Slack and email) with who it's from when the number matches a lead.
 *   4. Anything else gets a TerraAI reply, sent right away (TERRAAI_TEXT_MODE=draft holds each one for Adam's OK).
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
import { after } from "next/server"
import { buildTextContext } from "@/lib/sms/terraai/context"
import { draftReply } from "@/lib/sms/terraai/draft"
import { AUTO_REPLY_HOURLY_CAP, createDraft, decideDraft, draftReviewUrl, saveMessage, terraaiRepliesLastHour, textMode } from "@/lib/sms/terraai/store"
import { refFromText } from "@/lib/sms/text-link"
import { claimTextRef, findTextRef } from "@/lib/sms/text-refs"
import { CONTACT_CARD_URL, textFirstReply } from "@/lib/sms/text-first-replies"

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

/** True when this is the first text we've had from this number (the one just logged counts). */
async function firstInboundFrom(phone: string): Promise<boolean> {
  const supabase = getServerSupabase()
  if (!supabase) return false
  const { count } = await supabase.schema("public").from("comms_messages").select("id", { count: "exact", head: true }).eq("channel", "sms").eq("direction", "inbound").eq("counterpart", phone.toLowerCase())
  return (count ?? 0) <= 1
}

/** What the instant reply needs: a report's status, or a booking's time and zone. */
async function lookupRefContext(kind: "report" | "booking", refId: string): Promise<{ reportSent?: boolean; startIso?: string; tz?: string }> {
  const supabase = getServerSupabase()
  if (!supabase) return {}
  if (kind === "report") {
    const { data } = await supabase.schema("website").from("free_courses_signups").select("report_status").eq("id", refId).maybeSingle()
    return { reportSent: (data as { report_status?: string } | null)?.report_status === "sent" }
  }
  const { data } = await supabase.schema("website").from("booking_scheduled_emails").select("start_iso, visitor_tz").eq("booking_id", refId).not("start_iso", "is", null).limit(1).maybeSingle()
  const row = data as { start_iso?: string; visitor_tz?: string } | null
  return row?.start_iso ? { startIso: row.start_iso, tz: row.visitor_tz || "America/Los_Angeles" } : {}
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
  // Full text for TerraAI's view of the conversation (the Comms log keeps only a preview).
  const inboundId = await saveMessage({ phone: from, direction: "inbound", body: content || "(media)", source: "owner", providerId: body.message_handle ?? null })

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
  } else if (keyword === "human") {
    await sendSms(from, SMS_REPLIES.human, { typing: false, stream: "handoff", source: "terraai" })
    action = "ASKED FOR A PERSON"
  } else {
    // "Tap to text us": the pre-filled message carries a ref. One instant reply (with the contact card) per ref, or
    // per number for the general footer text. Once they've texted, links and media are allowed.
    const ref = refFromText(content)
    if (ref) {
      const reply = await textFirstReply(ref, from, { findTextRef, claimTextRef, firstInbound: () => firstInboundFrom(from), lookup: lookupRefContext })
      if (reply) {
        await sendSms(from, reply.text, { typing: false, mediaUrl: CONTACT_CARD_URL, stream: "text_first", source: "terraai" })
        action = reply.label
      }
    }
  }

  // Everything else gets a TerraAI reply. It runs after the response so Sendblue isn't kept waiting. Auto mode (the
  // default) sends it and tells Adam; draft mode (TERRAAI_TEXT_MODE=draft, or a number past the hourly cap) waits for
  // Adam, and the alert carries the review link.
  const wantsDraft = action === "reply" && !(keyword === "stop" || keyword === "start" || keyword === "help" || keyword === "human")

  const alert = async (draftLines: string[], tag = "") => {
    const who = await whoIs(from).catch(() => null)
    const label = who ? `${who} (${from})` : from
    const line = `Text from ${label}${action === "reply" ? "" : `, ${action}`}: "${content.slice(0, 500)}"`
    const text = [line, ...draftLines, "", "Or reply yourself from the Sendblue inbox: https://dashboard.sendblue.com/conversations"].join("\n")
    await Promise.allSettled([
      postSlack(text),
      sendEmail({ to: ADMIN_EMAIL, subject: action === "reply" ? `Text from ${who || from}${tag ? ` (${tag})` : ""}` : `Text ${action}: ${who || from}`, text }),
    ])
  }

  if (wantsDraft) {
    after(async () => {
      const ctx = await buildTextContext(from)
      const draft = await draftReply(ctx, content || "(they sent a photo or file)")
      const draftId = await createDraft({ phone: from, inboundId, draft: draft.reply, intent: draft.intent, handoff: draft.handoff, notes: [draft.handoffReason, draft.notes].filter(Boolean).join(" · ") || null })
      const why = [draft.handoffReason ? `Why: ${draft.handoffReason}` : "", draft.notes ? `Note: ${draft.notes}` : ""]

      const overCap = (await terraaiRepliesLastHour(from)) >= AUTO_REPLY_HOURLY_CAP
      if (textMode() === "auto" && !overCap) {
        const sent = await sendSms(from, draft.reply, { stream: "terraai", source: "terraai" })
        if (sent.ok) {
          if (draftId) await decideDraft(draftId, "sent", draft.reply)
          await alert(
            ["", `TerraAI replied${draft.handoff ? " and handed this one to you" : ""}: "${draft.reply}"`, ...why].filter((x) => x !== ""),
            draft.handoff ? "TerraAI replied, needs you" : "TerraAI replied",
          )
          return
        }
      }

      const review = draftId ? draftReviewUrl(draftId) : null
      await alert(
        [
          "",
          overCap ? `Not sent: ${AUTO_REPLY_HOURLY_CAP} TerraAI texts to this number in the last hour, so this one waits for you.` : "",
          `TerraAI draft${draft.handoff ? " (wants you to take this one)" : ""}: "${draft.reply}"`,
          ...why,
          review ? `Send, edit or discard: ${review}` : "Draft couldn't be saved (run 20261016_terraai_texting.sql).",
        ].filter((x) => x !== ""),
        "TerraAI draft ready",
      )
    })
  } else {
    await alert([])
  }
  return NextResponse.json({ ok: true, action })
}
