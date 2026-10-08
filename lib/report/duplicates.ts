/**
 * "Already requested" means the same PERSON asked before, not the same business or website.
 * The free business lookup makes the website public input: a teammate, a partner or Terramore staff may check the
 * same domain, and each is a legitimate separate lead. Abuse is handled by rate limits, not by identity matches.
 *
 * Blocks (409):
 * - Email: any prior row with that email (also the unique column).
 * - Phone: a report signup in the last DUPLICATE_WINDOW_DAYS with the same phone.
 * - Same full name AND same website host or business name in the window (one person, a new email).
 * Never blocks on website, business name or socials alone.
 */

import { getServerSupabase } from "@/lib/supabase-server"
import {
  normalizeBusinessName,
  normalizeEmail,
  normalizePersonName,
  normalizePhone,
  normalizeWebsiteHost,
} from "@/lib/report/normalize-lead"

export const DUPLICATE_WINDOW_DAYS = 7

export type { Row as RecentReportRow }

export type ReportLeadIdentity = {
  email: string
  phone?: string | null
  firstName: string
  lastName: string
  businessName?: string | null
  website?: string | null
  socials?: string | null
}

export type DuplicateMatch = {
  id: string
  matchedOn: "email" | "phone" | "name"
}

type Row = {
  id: string
  email: string | null
  phone: string | null
  first_name: string | null
  last_name: string | null
  business_name: string | null
  website: string | null
  socials: string | null
  company: string | null
  signup_date: string | null
}

function cutoffIso(days: number): string {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()
}

function hostOf(raw: string | null | undefined): string {
  return normalizeWebsiteHost(raw)
}

function phoneFromCompany(company: string | null): string | null {
  if (!company) return null
  const match = company.match(/phone:([+\d().\-\s]+)/i)
  return match ? normalizePhone(match[1]) : null
}

type NormalizedIdentity = { phone: string; first: string; last: string; business: string; websiteHost: string }

function rowWebsiteHost(row: Row): string {
  return hostOf(row.website) || hostOf((row.company || "").split(" · ").find((p) => /https?:\/\//i.test(p) || p.includes(".")))
}

function rowBusinessName(row: Row): string {
  const named = normalizeBusinessName(row.business_name)
  if (named) return named
  // Legacy: business packed into company before the business_name column.
  if (!row.company) return ""
  const legacy = normalizeBusinessName(String(row.company).split(" · ")[0] || "")
  return legacy && !/^https?:\/\//i.test(legacy) && !legacy.startsWith("socials:") ? legacy : ""
}

/** Pure matcher over recent report rows (exported for scripts/verify-report-dedupe.mjs). */
export function matchRecentDuplicate(identity: NormalizedIdentity, rows: Row[]): DuplicateMatch | null {
  const { phone, first, last, business, websiteHost } = identity
  const hasName = Boolean(first && last && first !== "-" && last !== "-")
  for (const row of rows) {
    if (phone) {
      const rowPhone = normalizePhone(row.phone) || phoneFromCompany(row.company)
      if (rowPhone && rowPhone === phone) return { id: String(row.id), matchedOn: "phone" }
    }
    if (hasName && normalizePersonName(row.first_name) === first && normalizePersonName(row.last_name) === last) {
      if (websiteHost && rowWebsiteHost(row) === websiteHost) return { id: String(row.id), matchedOn: "name" }
      if (business && rowBusinessName(row) === business) return { id: String(row.id), matchedOn: "name" }
    }
  }
  return null
}

/**
 * Returns the first matching prior lead, or null if this identity is new.
 * Fail-open on Supabase errors (returns null) so a lookup blip does not block ads traffic;
 * unique(email) still prevents a second email row.
 */
export async function findDuplicateReportLead(identity: ReportLeadIdentity): Promise<DuplicateMatch | null> {
  const supabase = getServerSupabase()
  if (!supabase) return null

  const email = normalizeEmail(identity.email)
  if (!email) return null

  const phone = normalizePhone(identity.phone)
  const first = normalizePersonName(identity.firstName)
  const last = normalizePersonName(identity.lastName)
  const business = normalizeBusinessName(identity.businessName)
  const websiteHost = hostOf(identity.website)
  const since = cutoffIso(DUPLICATE_WINDOW_DAYS)

  // 1) Email — any prior row (unique).
  {
    const { data, error } = await supabase
      .from("free_courses_signups")
      .select("id,email")
      .eq("email", email)
      .maybeSingle()
    if (error) {
      console.error("[report] duplicate email lookup failed:", error.message)
    } else if (data?.id) {
      return { id: String(data.id), matchedOn: "email" }
    }
  }

  // 2) Recent report rows for non-email identity matches.
  const { data: recent, error: recentError } = await supabase
    .from("free_courses_signups")
    .select("id,email,phone,first_name,last_name,business_name,website,socials,company,signup_date")
    .eq("signup_source", "digital_footprint_report")
    .gte("signup_date", since)
    .limit(200)

  if (recentError) {
    console.error("[report] duplicate window lookup failed:", recentError.message)
    return null
  }

  return matchRecentDuplicate({ phone, first, last, business, websiteHost }, (recent || []) as Row[])
}
