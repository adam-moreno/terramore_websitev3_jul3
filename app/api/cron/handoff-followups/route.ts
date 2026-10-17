/**
 * GET /api/cron/handoff-followups: every 2 minutes (vercel.json). A TerraAI hand-off nobody has picked up within
 * 10 minutes gets one text to the owner (a booking link, or the next business morning after hours), and Adam's
 * phone hears that it's still waiting (lib/sms/terraai/handoff.ts).
 * Auth: Authorization: Bearer ${CRON_SECRET} (what Vercel Cron sends).
 */

import { timingSafeEqual } from "node:crypto"
import { NextRequest, NextResponse } from "next/server"
import { sendSms } from "@/lib/notify"
import { buildTextContext } from "@/lib/sms/terraai/context"
import { alertPhone, dueFollowups, followupText, touchHandoff } from "@/lib/sms/terraai/handoff"

export const dynamic = "force-dynamic"
export const maxDuration = 60

function authorized(request: NextRequest, secret: string): boolean {
  const given = Buffer.from(request.headers.get("authorization") ?? "")
  const want = Buffer.from(`Bearer ${secret}`)
  return given.length === want.length && timingSafeEqual(given, want)
}

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET?.trim()
  if (!secret) return NextResponse.json({ error: "CRON_SECRET unset" }, { status: 503 })
  if (!authorized(request, secret)) return NextResponse.json({ error: "unauthorized" }, { status: 401 })

  const adam = alertPhone()
  let sent = 0
  for (const handoff of await dueFollowups()) {
    // Claim it first, so a slow run and the next one can't both text the owner.
    await touchHandoff(handoff.id, { followup_sent_at: new Date().toISOString() })
    const ctx = await buildTextContext(handoff.phone)
    const result = await sendSms(handoff.phone, followupText(ctx.links.book), { stream: "handoff", source: "terraai" })
    if (result.ok) sent++
    if (adam) {
      await sendSms(adam, `${handoff.code} is still waiting (10 min). We texted them a booking link. Reply "${handoff.code} your message" to take it.`, { typing: false, stream: "handoff_alert" })
    }
  }
  if (sent) console.info(`[handoff-followups] sent ${sent}`)
  return NextResponse.json({ ok: true, sent })
}
