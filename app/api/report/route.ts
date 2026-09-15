import { NextRequest, NextResponse } from "next/server"
import { after } from "next/server"
import { getServerSupabase, isMissingColumnError, supabaseTableUrl } from "@/lib/supabase-server"
import { confirmLeadToUser, notifyAdminOfLead } from "@/lib/notify"
import { enrollLead } from "@/lib/nurture/enroll"
import { businessTypeFromReportAnswers } from "@/lib/nurture/map-links"
import { findDuplicateReportLead } from "@/lib/report/duplicates"
import { ATTR_KEYS, normalizeEmail, normalizePhone, pickAttribution } from "@/lib/report/normalize-lead"
import { runReportPipeline } from "@/lib/report/pipeline"
import { sendReportAcceptSms } from "@/lib/report/sms"

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
 * Fit UTM / click IDs into remaining course_type budget (legacy packed field).
 * Full attribution also lands in real columns when the migration has run.
 */
function packAttribution(raw: Record<string, unknown>, budget: number): string {
  if (budget < 4) return ""
  const order: Array<[string, string]> = [
    ["gclid", "g"],
    ["gbraid", "gb"],
    ["wbraid", "wb"],
    ["fbclid", "fb"],
    ["ttclid", "tt"],
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

function isUniqueViolation(error: { code?: string; message?: string } | null | undefined): boolean {
  if (!error) return false
  return error.code === "23505" || /duplicate key|unique constraint/i.test(error.message || "")
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
    const email = normalizeEmail(body.email)
    const phoneRaw = String(body.phone || "").trim()
    const phone = normalizePhone(phoneRaw) || phoneRaw || ""
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
    const attribution = pickAttribution(rawAttribution)
    const attributionSummary = attributionForNotify(attribution)
    const courseType = packCourseType(rawAnswers, attribution)

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

    const duplicate = await findDuplicateReportLead({
      email,
      phone: phone || null,
      firstName: resolvedFirst,
      lastName: resolvedLast,
      businessName: businessName || null,
      website: website || null,
      socials: socials || null,
    })

    if (duplicate) {
      console.info(`[report] already requested (${duplicate.matchedOn}) for ${email}`)
      return NextResponse.json(
        { alreadyRequested: true, matchedOn: duplicate.matchedOn },
        { status: 409 },
      )
    }

    let rowId: string | null = null
    const supabase = getServerSupabase()
    if (supabase) {
      const attrColumns: Record<string, string | null> = {}
      for (const key of ATTR_KEYS) {
        attrColumns[key] = attribution[key] || null
      }

      const fullRow = {
        first_name: resolvedFirst,
        last_name: resolvedLast,
        email,
        company,
        phone: phone || null,
        socials: socials || null,
        business_name: businessName || null,
        website: website || null,
        email_consent: true,
        signup_source: "digital_footprint_report",
        course_type: courseType || null,
        signup_date: new Date().toISOString(),
        status: "active",
        ...attrColumns,
      }

      const { data, error } = await supabase.from("free_courses_signups").insert([fullRow]).select("id").maybeSingle()

      if (error && isUniqueViolation(error)) {
        console.info(`[report] unique violation → already requested for ${email}`)
        return NextResponse.json({ alreadyRequested: true, matchedOn: "email" }, { status: 409 })
      }

      if (error && isMissingColumnError(error)) {
        console.warn(
          "[report] attribution/phone/socials columns missing. Run supabase/migrations/20260915_report_attribution.sql. Falling back to legacy insert.",
        )
        const legacy = {
          first_name: resolvedFirst,
          last_name: resolvedLast,
          email,
          company,
          email_consent: true,
          signup_source: "digital_footprint_report",
          course_type: courseType || null,
          signup_date: new Date().toISOString(),
          status: "active",
        }
        const fallback = await supabase.from("free_courses_signups").insert([legacy]).select("id").maybeSingle()
        if (fallback.error && isUniqueViolation(fallback.error)) {
          return NextResponse.json({ alreadyRequested: true, matchedOn: "email" }, { status: 409 })
        }
        if (fallback.error) {
          console.error("Report signup insert failed:", fallback.error)
          return NextResponse.json({ error: "Could not save the request" }, { status: 500 })
        }
        if (fallback.data?.id) rowId = String(fallback.data.id)

        if (businessName || website) {
          const { error: detailError } = await supabase
            .from("free_courses_signups")
            .update({ business_name: businessName || null, website: website || null })
            .eq("email", email)
          if (detailError && !isMissingColumnError(detailError)) {
            console.error("Report signup detail update failed:", detailError)
          }
        }
      } else if (error) {
        console.error("Report signup insert failed:", error)
        return NextResponse.json({ error: "Could not save the request" }, { status: 500 })
      } else if (data?.id) {
        rowId = String(data.id)
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
      await sendReportAcceptSms({ email, name, phone: phone || null })
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
        phone: phone || null,
        businessName,
        website: website || null,
        answers: answerSummary || null,
      })
    })

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    console.error("Report API error:", error)
    return NextResponse.json({ error: "Could not save the request" }, { status: 500 })
  }
}
