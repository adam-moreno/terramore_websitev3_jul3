import { NextRequest, NextResponse } from "next/server"
import { timingSafeEqual } from "node:crypto"
import { getServerSupabase } from "@/lib/supabase-server"
import { collectDiagnostic } from "@/lib/report/diagnostic"
import { siteManagerFrom } from "@/lib/report/recommend"

/**
 * POST /api/report/recheck { email } → the lead's website checked again, scored the same deterministic way as the
 * report: { ok, score, recommendations: [{ id, rank, finding, action }], platform }.
 * For the dashboard's report-lead emails (every 30 days, "we re-ran your website check"). No model call, no PDF, no
 * email, nothing stored. Guarded by REPORT_GENERATE_SECRET (header x-report-secret), like /api/report/generate.
 */
export const runtime = "nodejs"
export const maxDuration = 60

function allowed(request: NextRequest): NextResponse | null {
  const secret = process.env.REPORT_GENERATE_SECRET
  if (!secret) return NextResponse.json({ ok: false, error: "REPORT_GENERATE_SECRET is not set" }, { status: 503 })
  const given = Buffer.from(request.headers.get("x-report-secret") ?? "")
  const want = Buffer.from(secret)
  if (given.length !== want.length || !timingSafeEqual(given, want)) return NextResponse.json({ ok: false, error: "Not allowed" }, { status: 401 })
  return null
}

export async function POST(request: NextRequest) {
  const denied = allowed(request)
  if (denied) return denied
  const body = await request.json().catch(() => ({}))
  const email = String((body as { email?: unknown }).email || "").trim().toLowerCase()
  if (!email) return NextResponse.json({ ok: false, error: "email is required" }, { status: 400 })

  const supabase = getServerSupabase()
  if (!supabase) return NextResponse.json({ ok: false, error: "Supabase isn't configured" }, { status: 503 })
  const { data, error } = await supabase
    .from("free_courses_signups")
    .select("business_name,website,company,course_type")
    .eq("email", email)
    .maybeSingle()
  if (error) return NextResponse.json({ ok: false, error: "Lead couldn't be read" }, { status: 502 })
  if (!data) return NextResponse.json({ ok: false, error: "No such lead" }, { status: 404 })

  // Same fallbacks as /api/report/generate: older rows packed "Business · https://site" into company.
  const [companyName, companySite] = String(data.company || "").split(" · ")
  const businessName = String(data.business_name || (companyName && !/^https?:\/\//.test(companyName) ? companyName : "") || "")
  const website = String(data.website || companySite || (/^https?:\/\//.test(companyName || "") ? companyName : "") || "")
  if (!website) return NextResponse.json({ ok: false, error: "The lead has no website" }, { status: 422 })

  try {
    const diagnostic = await collectDiagnostic(businessName, website, { siteManager: siteManagerFrom(data.course_type) })
    return NextResponse.json({
      ok: true,
      score: diagnostic.scores.overall,
      platform: diagnostic.tools?.platform ?? null,
      recommendations: diagnostic.recommendations.map((r) => ({ id: r.id, rank: r.rank, finding: r.finding, action: r.action })),
    })
  } catch (e) {
    console.error("[recheck] failed:", e instanceof Error ? e.message : "unknown")
    return NextResponse.json({ ok: false, error: "The check couldn't run" }, { status: 502 })
  }
}
