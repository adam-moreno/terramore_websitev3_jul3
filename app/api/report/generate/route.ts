import { NextRequest, NextResponse } from "next/server"
import { getServerSupabase } from "@/lib/supabase-server"
import { emailFromConfigured, emailProvider, postSlack, slackMode, smsConfigured, smsProvider } from "@/lib/notify"
import { missingReportKeys, runReportPipeline } from "@/lib/report/pipeline"
import { modelProvider } from "@/lib/report/write"

/**
 * Operator endpoint, guarded by REPORT_GENERATE_SECRET (header x-report-secret).
 *
 * GET  → config check: which keys are present, whether both lead tables and their columns are reachable.
 *        ?test=slack posts one short line to the leads channel so Slack can be verified without a form submit.
 * POST → re-run the report pipeline for one lead: { email, name?, businessName?, website? }.
 *        Missing fields are read from the free_courses_signups row.
 */
export const maxDuration = 60

function authorized(request: NextRequest): NextResponse | null {
  const secret = process.env.REPORT_GENERATE_SECRET
  if (!secret) return NextResponse.json({ error: "REPORT_GENERATE_SECRET is not set" }, { status: 503 })
  if (request.headers.get("x-report-secret") !== secret) return NextResponse.json({ error: "Not allowed" }, { status: 401 })
  return null
}

const LEAD_COLUMNS = "id,first_name,last_name,email,phone,company,email_consent,signup_source,course_type,signup_date,status"
const REPORT_COLUMNS = "business_name,website,report_status,report_text,report_sent_at,report_error"
const TALK_COLUMNS = "id,location,business_type,revenue,team_size,goal,timeline,budget,name,email,phone,message,application_date,status"

async function probe(table: string, columns: string): Promise<{ ok: boolean; error?: string }> {
  const supabase = getServerSupabase()
  if (!supabase) return { ok: false, error: "NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing" }
  const { error } = await supabase.from(table).select(columns).limit(0)
  return error ? { ok: false, error: `${error.code || ""} ${error.message}`.trim() } : { ok: true }
}

export async function GET(request: NextRequest) {
  const denied = authorized(request)
  if (denied) return denied

  if (request.nextUrl.searchParams.get("test") === "slack") {
    const mode = slackMode()
    if (mode === "none") return NextResponse.json({ slack: mode, ok: false, error: "Slack is not configured" }, { status: 503 })
    const result = await postSlack("Terramore site connected to Hearth. Lead alerts will land here.")
    return NextResponse.json({ slack: mode, ...result }, { status: result.ok ? 200 : 502 })
  }

  const [leads, reportColumns, talks] = await Promise.all([
    probe("free_courses_signups", LEAD_COLUMNS),
    probe("free_courses_signups", REPORT_COLUMNS),
    probe("partner_applications", TALK_COLUMNS),
  ])

  return NextResponse.json({
    supabase: {
      configured: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY),
      schema: process.env.SUPABASE_SCHEMA || "public",
      free_courses_signups: leads,
      free_courses_signups_report_columns: reportColumns.ok
        ? reportColumns
        : { ...reportColumns, hint: "Run supabase/migrations/20260911_report_pipeline.sql" },
      partner_applications: talks,
    },
    keys: {
      model: modelProvider(),
      email: emailProvider(),
      emailFrom: emailFromConfigured(),
      slack: slackMode(),
      sms: smsConfigured(),
      smsProvider: smsProvider(),
      places: Boolean(process.env.GOOGLE_PLACES_API_KEY),
    },
    reportPipelineReady: missingReportKeys().length === 0,
    missing: missingReportKeys(),
  })
}

export async function POST(request: NextRequest) {
  const denied = authorized(request)
  if (denied) return denied

  const body = await request.json().catch(() => ({}))
  const email = String(body.email || "").trim().toLowerCase()
  if (!email) return NextResponse.json({ error: "email is required" }, { status: 400 })

  let name = String(body.name || "").trim()
  let businessName = String(body.businessName || "").trim()
  let website = String(body.website || "").trim()

  if (!name || !website || !businessName) {
    const supabase = getServerSupabase()
    if (supabase) {
      const { data } = await supabase.from("free_courses_signups").select("first_name,last_name,company").eq("email", email).maybeSingle()
      if (data) {
        if (!name) name = [data.first_name, data.last_name].filter((part) => part && part !== "-").join(" ")
        // company is stored as "Business · https://site" by /api/report
        const [companyName, companySite] = String(data.company || "").split(" · ")
        if (!businessName && companyName && !/^https?:\/\//.test(companyName)) businessName = companyName
        if (!website) website = companySite || (/^https?:\/\//.test(companyName || "") ? companyName : "")
      }
    }
  }

  if (!name) name = "there"
  const result = await runReportPipeline({ name, email, businessName, website: website || null })
  return NextResponse.json(result, { status: result.ok ? 200 : 502 })
}
