import { NextRequest, NextResponse } from "next/server"
import { metroLabelForLocality, placesForLocality } from "@/lib/construction-locality"

export const runtime = "edge"

type IpApiResponse = {
  city?: string
  region?: string
  region_code?: string
  error?: boolean
  reason?: string
}

function visitorIp(req: NextRequest): string | null {
  const forwarded = req.headers.get("x-forwarded-for")
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim()
    if (first) return first
  }
  const real = req.headers.get("x-real-ip")?.trim()
  if (real) return real
  return null
}

function fallbackPayload() {
  const places = placesForLocality(null)
  return {
    place: places[0],
    places,
    metro: metroLabelForLocality(null),
    source: "fallback" as const,
  }
}

/**
 * Visitor locality for illustrative construction inquiry toasts.
 * IP → city/metro (typical accuracy). Neighborhood list is an illustrative
 * high-end + mid-market mix inside that metro for the notification cycle.
 * `metro` is the greater-area label (e.g. Los Angeles) for search/SERP copy.
 */
export async function GET(req: NextRequest) {
  try {
    const ip = visitorIp(req)
    const lookupUrl =
      ip && !isPrivateIp(ip) ? `https://ipapi.co/${encodeURIComponent(ip)}/json/` : "https://ipapi.co/json/"

    const res = await fetch(lookupUrl, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    })
    if (!res.ok) {
      return NextResponse.json(fallbackPayload())
    }
    const data = (await res.json()) as IpApiResponse
    if (data.error || !data.city) {
      return NextResponse.json(fallbackPayload())
    }
    const region = data.region || data.region_code || null
    const places = placesForLocality(data.city, region)
    return NextResponse.json({
      place: places[0],
      places,
      metro: metroLabelForLocality(data.city, region),
      city: data.city,
      region,
      source: "geo",
    })
  } catch {
    return NextResponse.json(fallbackPayload())
  }
}

function isPrivateIp(ip: string): boolean {
  return (
    ip === "::1" ||
    ip.startsWith("127.") ||
    ip.startsWith("10.") ||
    ip.startsWith("192.168.") ||
    /^172\.(1[6-9]|2\d|3[0-1])\./.test(ip)
  )
}
