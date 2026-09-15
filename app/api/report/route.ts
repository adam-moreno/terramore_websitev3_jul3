import { NextRequest, NextResponse } from "next/server"
import { after } from "next/server"
import { getServerSupabase, isMissingColumnError, supabaseTableUrl } from "@/lib/supabase-server"
import { confirmLeadToUser, notifyAdminOfLead } from "@/lib/notify"
import { enrollLead } from "@/lib/nurture/enroll"
import { businessTypeFromReportAnswers } from "@/lib/nurture/map-links"
import { runReportPipeline } from "@/lib/report/pipeline"

export const maxDuration = 60

const COURSE_TYPE_MAX = 100

/** Compact qualifier answers for course_type / nurture mapping (`type=` must remain parseable). */
function packAnswers(raw: Record<string, unknown>): string {
  return Object.entries(raw)
    .filter(([, value]) => typeof value === "string" && value)
    .map(([key, value]) => `${key}=${String(value)}`.replace(/[^a-z0-9_=]/gi, ""))
    .join(";")
    .slice(0, 48)
}

/**
 * Fit UTM / click IDs into remaining course_type budget.
 * Priority: gclid → gbraid/wbraid → source → campaign → medium → content → term.
 * Full attribution still goes to Slack via lead details.
 */
function packAttribution(raw: Record<string, unknown>, budget: number): string {
  if (budget < 4) return ""
  const order: Array<[string, string]> = [
    ["gclid", "g"],
    ["gbraid", "gb"],
    ["wbraid", "wb"],
    ["utm_source", "s"],
    ["utm_campaign", "c"],
    ["utm_medium", "m"],
    ["utm_content", "n"],
    ["utm_term", "t"],
  ]
  const parts: string[] = []
  let used = 0
  for (const [full, short] of order) {
    const value = raw[full]
    if (typeof value !== "string" || !value.trim()) continue
    const sep = parts.length ? 1 : 0
    const room = budget - used - sep - short.length - 1
    if (room < 1) continue
    const cleaned = value.trim().replace(/[^a-zA-Z0-9_-]/g, "").slice(0, room)
    if (!cleaned) continue
    const piece = `${short}=${cleaned}`
    parts.push(piece)
    used += sep + piece.length
  }
  return parts.join(";")
}

function packCourseType(answers: Record<string, unknown>, attribution: Record<string, unknown>): string {
  const answerPart = packAnswers(answers)
  const remaining = COURSE_TYPE_MAX - answerPart.length - (answerPart ? 1 : 0)
  const attrPart = packAttribution(attribution, remaining)
  return [answerPart, attrPart].filter(Boolean).join("|").slice(0, COURSE_TYPE_MAX)
}

function attributionForNotify(raw: Record<string, unknown>): string {
  return Object.entries(raw)
    .filter(([, value]) => typeof value === "string" && value)
    .map(([key, value]) => `${key}=${String(value).slice(0, 80)}`)
    .join("; ")
    .slice(0, 400)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const firstName = String(body.firstName || "").trim()
    const lastName = String(body.lastName || "").trim()
    const legacyName = String(body.name || "").trim()
    const name =
      firstName || lastName
        ? `${firstName} ${lastName}`.trim()
        : legacyName
    const email = String(body.email || "").trim().toLowerCase()
    const phone = String(body.phone || "").trim()
    const website = String(body.website || "").trim()
    const socials = String(body.socials || "").trim()
    const businessName = String(body.businessName || "").trim()

    const rawAnswers = body.answers && typeof body.answers === "object" ? (body.answers as Record<string, unknown>) : {}
    const answerSummary = Object.entries(rawAnswers)
      .filter(([, value]) => typeof value === "string" && value)
      .map(([key, value]) => `${key}=${String(value)}`.replace(/[^a-z0-9_=]/gi, ""))
      .join("; ")
      .slice(0, 100)

    const rawAttribution =
      body.attribution && typeof body.attribution === "object" ? (body.attribution as Record<string, unknown>) : {}
    const attributionSummary = attributionForNotify(rawAttribution)
    const courseType = packCourseType(rawAnswers, rawAttribution)

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 })
    }
    if (!website) {
      return NextResponse.json({ error: "Website is required" }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    const [splitFirst, ...rest] = name.split(/\s+/)
    const resolvedFirst = firstName || splitFirst
    const resolvedLast = lastName || rest.join(" ") || "-"
    const company =
      [businessName, website, socials ? `socials:${socials}` : "", phone ? `phone:${phone}` : ""]
        .filter(Boolean)
        .join(" · ") || null

    let rowId: string | null = null
    const supabase = getServerSupabase()
    if (supabase) {
      const { data: existing } = await supabase.from("free_courses_signups").select("id").eq("email", email).maybeSingle()

      if (existing?.id) {
        rowId = String(existing.id)
      } else {
        const { data, error } = await supabase
          .from("free_courses_signups")
          .insert([
            {
              first_name: resolvedFirst,
              last_name: resolvedLast,
              email,
              company,
              email_consent: true,
              signup_source: "digital_footprint_report",
              course_type: courseType || null,
              signup_date: new Date().toISOString(),
              status: "active",
            },
          ])
          .select("id")
          .maybeSingle()

        if (error) {
          console.error("Report signup insert failed:", error)
        } else if (data?.id) {
          rowId = String(data.id)
        }
      }

      if (businessName || website) {
        const { error } = await supabase
          .from("free_courses_signups")
          .update({ business_name: businessName || null, website: website || null })
          .eq("email", email)
        if (error && !isMissingColumnError(error)) console.error("Report signup detail update failed:", error)
      }
    } else {
      console.info("Report lead (no Supabase):", {
        name,
        email,
        phone,
        website,
        socials,
        businessName,
        answers: answerSummary,
        attribution: attributionSummary,
        courseType,
      })
    }

    after(async () => {
      const lead = {
        kind: "report" as const,
        name,
        email,
        phone: phone || null,
        business: businessName || null,
        website: website || null,
        details: {
          Answers: answerSummary || "none",
          Socials: socials || null,
          Attribution: attributionSummary || null,
        },
        rowId,
        tableUrl: supabaseTableUrl("free_courses_signups"),
      }
      await Promise.all([notifyAdminOfLead(lead), confirmLeadToUser(lead)])
      await enrollLead({
        email,
        name,
        source: "report",
        businessType: businessTypeFromReportAnswers(answerSummary),
        businessName: businessName || null,
        website: website || null,
      })
      await runReportPipeline({
        name,
        email,
        businessName,
        website: website || null,
        answers: answerSummary || null,
      })
    })

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    console.error("Report API error:", error)
    return NextResponse.json({ success: true }, { status: 201 })
  }
}
