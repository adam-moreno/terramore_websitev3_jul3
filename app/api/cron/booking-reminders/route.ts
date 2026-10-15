/**
 * GET /api/cron/booking-reminders: every 5 minutes (vercel.json), sends the pre-call reminders that are due, each
 * only if its call is still on (lib/booking/send-reminders.ts).
 * Auth: Authorization: Bearer ${CRON_SECRET} (what Vercel Cron sends).
 */

import { timingSafeEqual } from "node:crypto"
import { NextRequest, NextResponse } from "next/server"
import { sendDueReminders } from "@/lib/booking/send-reminders"

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
  const result = await sendDueReminders()
  if (result.claimed) console.info(`[booking-reminders] ${JSON.stringify(result)}`)
  return NextResponse.json({ ok: true, ...result })
}
