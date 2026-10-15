/**
 * GET /api/booking/prefill?ref=…
 * Verifies a /book?ref= token (lib/booking/prefill-token.ts) and returns what we already know for the booking form:
 * name, email, business name, website and socials. Never the phone. Any bad, expired or missing token, or a lookup
 * failure, returns { prefill: null } with 200, so the form just stays empty and shows no error.
 */

import { NextRequest, NextResponse } from "next/server"
import { verifyPrefillToken } from "@/lib/booking/prefill-token"
import { getServerSupabase } from "@/lib/supabase-server"

export const dynamic = "force-dynamic"

type Prefill = { name: string | null; email: string; business: string | null; website: string | null; socials: string | null }

const NO_STORE = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" }

function text(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null
  const t = value.trim()
  return t && t !== "-" ? t.slice(0, max) : null
}

export async function GET(request: NextRequest) {
  const email = verifyPrefillToken(request.nextUrl.searchParams.get("ref"))
  if (!email) return NextResponse.json({ prefill: null }, { headers: NO_STORE })

  const prefill: Prefill = { name: null, email, business: null, website: null, socials: null }
  const supabase = getServerSupabase()
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("free_courses_signups")
        .select("first_name, last_name, business_name, website, socials")
        .eq("email", email)
        .maybeSingle()
      if (error) console.warn(`[booking-prefill] lookup failed: ${error.message}`)
      if (data) {
        const row = data as Record<string, unknown>
        prefill.name = [text(row.first_name, 60), text(row.last_name, 60)].filter(Boolean).join(" ") || null
        prefill.business = text(row.business_name, 160)
        prefill.website = text(row.website, 300)
        prefill.socials = text(row.socials, 300)
      }
    } catch (error) {
      console.warn(`[booking-prefill] lookup failed: ${error instanceof Error ? error.message : String(error)}`)
    }
  }
  return NextResponse.json({ prefill }, { headers: NO_STORE })
}
