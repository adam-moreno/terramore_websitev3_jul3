/**
 * /api/booking/manage
 * GET  ?token=                      booking details for the manage page
 * POST { token, action: "cancel" }  or { token, action: "reschedule", startIso }
 */

import { NextRequest, NextResponse } from "next/server"
import { after } from "next/server"
import { bookingApi, type BookingRecord } from "@/lib/booking-api"
import { postSlack } from "@/lib/notify"

export const dynamic = "force-dynamic"

type Wrapped = { ok: boolean; booking: BookingRecord }

function pt(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(new Date(iso))
}

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token")?.trim()
  if (!token) return NextResponse.json({ error: "invalid_token" }, { status: 400 })
  const result = await bookingApi<Wrapped>(`/api/public/booking/manage?token=${encodeURIComponent(token)}`)
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: result.status >= 500 ? 503 : result.status })
  return NextResponse.json(result.data.booking, { headers: { "Cache-Control": "no-store" } })
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as { token?: string; action?: string; startIso?: string } | null
  const token = body?.token?.trim()
  if (!token) return NextResponse.json({ error: "invalid_token" }, { status: 400 })

  if (body?.action === "cancel") {
    const result = await bookingApi<Wrapped>("/api/public/booking/cancel", { method: "POST", body: { manageToken: token } })
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: result.status >= 500 ? 503 : result.status })
    const b = result.data.booking
    after(() => postSlack(`Call canceled: ${b.name || b.email} (${b.email}), was ${pt(b.startIso)}.`))
    return NextResponse.json(b)
  }

  if (body?.action === "reschedule" && typeof body.startIso === "string") {
    const result = await bookingApi<Wrapped>("/api/public/booking/reschedule", {
      method: "POST",
      body: { manageToken: token, startIso: body.startIso },
    })
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: result.status >= 500 ? 503 : result.status })
    const b = result.data.booking
    after(() => postSlack(`Call moved: ${b.name || b.email} (${b.email}), now ${pt(b.startIso)}.`))
    return NextResponse.json(b)
  }

  return NextResponse.json({ error: "invalid_input" }, { status: 400 })
}
