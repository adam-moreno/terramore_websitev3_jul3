/**
 * Expanded duplicate rule (5A): ANY match of email OR phone OR (first+last)
 * OR business name OR website OR socials → already requested.
 *
 * Email: any prior row with that email (unique column).
 * Other fields: match within DUPLICATE_WINDOW_DAYS on report signups.
 */

import { getServerSupabase } from "@/lib/supabase-server"
import {
  normalizeBusinessName,
  normalizeEmail,
  normalizePersonName,
  normalizePhone,
  normalizeSocials,
  normalizeWebsiteHost,
} from "@/lib/report/normalize-lead"

export const DUPLICATE_WINDOW_DAYS = 7

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
  matchedOn: "email" | "phone" | "name" | "business_name" | "website" | "socials"
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

function socialsFromCompany(company: string | null): string {
  if (!company) return ""
  const match = company.match(/socials:([^·]+)/i)
  return match ? normalizeSocials(match[1]) : ""
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
  const socials = normalizeSocials(identity.socials)
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

  for (const row of (recent || []) as Row[]) {
    if (phone) {
      const rowPhone = normalizePhone(row.phone) || phoneFromCompany(row.company)
      if (rowPhone && rowPhone === phone) {
        return { id: String(row.id), matchedOn: "phone" }
      }
    }

    if (first && last && first !== "-" && last !== "-") {
      if (normalizePersonName(row.first_name) === first && normalizePersonName(row.last_name) === last) {
        return { id: String(row.id), matchedOn: "name" }
      }
    }

    if (business) {
      const rowBiz = normalizeBusinessName(row.business_name)
      if (rowBiz && rowBiz === business) {
        return { id: String(row.id), matchedOn: "business_name" }
      }
      // Legacy: business packed into company before business_name column.
      if (!row.business_name && row.company) {
        const legacy = normalizeBusinessName(String(row.company).split(" · ")[0] || "")
        if (legacy && legacy === business && !/^https?:\/\//i.test(legacy) && !legacy.startsWith("socials:")) {
          return { id: String(row.id), matchedOn: "business_name" }
        }
      }
    }

    if (websiteHost) {
      const rowHost = hostOf(row.website) || hostOf((row.company || "").split(" · ").find((p) => /https?:\/\//i.test(p) || p.includes(".")))
      if (rowHost && rowHost === websiteHost) {
        return { id: String(row.id), matchedOn: "website" }
      }
    }

    if (socials) {
      const rowSocials = normalizeSocials(row.socials) || socialsFromCompany(row.company)
      if (rowSocials && rowSocials === socials) {
        return { id: String(row.id), matchedOn: "socials" }
      }
    }
  }

  return null
}
