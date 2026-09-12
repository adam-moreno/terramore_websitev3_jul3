/**
 * GET /api/booking/availability?from=&to=&tz=
 * Proxies Terra IQ with the secret header. The browser never sees BOOKING_API_SECRET.
 */

import { NextRequest, NextResponse } from "next/server"
import { bookingApi } from "@/lib/booking-api"

export const dynamic = "force-dynamic"

type Availability = { slots: string[]; ownerTz: string; slotMinutes: number }

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams
  const query = new URLSearchParams()
  for (const key of ["from", "to", "tz"]) {
    const value = params.get(key)
    if (value) query.set(key, value)
  }

  const result = await bookingApi<Availability>(`/api/public/booking/availability?${query.toString()}`)
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: result.status >= 500 ? 503 : result.status })
  return NextResponse.json(result.data, { headers: { "Cache-Control": "no-store" } })
}
