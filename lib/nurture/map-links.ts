import {
  CAPABILITIES,
  capabilityPath,
  getCapability,
  getOffering,
  offeringPath,
} from "@/lib/capabilities"
import type { NurtureLink } from "./types"

const SITE = "https://www.terramore.io"

/** Resolve a hub slug or "hub/offering" into a labelled absolute link. Skips unknown paths. */
function resolve(ref: string): NurtureLink | null {
  const parts = ref.split("/").filter(Boolean)
  if (parts.length === 1) {
    const cap = getCapability(parts[0])
    if (!cap) return null
    return { label: cap.title, href: `${SITE}${capabilityPath(cap.slug)}` }
  }
  if (parts.length === 2) {
    const found = getOffering(parts[0], parts[1])
    if (!found) return null
    return {
      label: found.offering.title,
      href: `${SITE}${offeringPath(parts[0], parts[1])}`,
    }
  }
  return null
}

function pick(refs: string[], fallback: string[] = DEFAULT_REFS): NurtureLink[] {
  const out: NurtureLink[] = []
  const seen = new Set<string>()
  for (const ref of [...refs, ...fallback]) {
    const link = resolve(ref)
    if (!link || seen.has(link.href)) continue
    seen.add(link.href)
    out.push(link)
    if (out.length === 3) break
  }
  if (out.length < 3) {
    for (const cap of CAPABILITIES) {
      const link = resolve(cap.slug)
      if (!link || seen.has(link.href)) continue
      seen.add(link.href)
      out.push(link)
      if (out.length === 3) break
    }
  }
  return out.slice(0, 3)
}

const DEFAULT_REFS = [
  "artificial-intelligence",
  "marketing-and-sales",
  "digital-technology-and-data",
]

function norm(value: string | null | undefined): string {
  return (value || "").trim().toLowerCase()
}

/**
 * Pick three capability pages from job and/or business type.
 * Job wins when present; business type fills gaps; hubs are the default.
 */
export function pickNurtureLinks(job?: string | null, businessType?: string | null): NurtureLink[] {
  const j = norm(job)
  const t = norm(businessType)

  const isOnline = /online\s*store|e-?comm/.test(t) || t === "online_store"
  const isClinic = /clinic|practice/.test(t) || t === "clinic"
  const isService = /service\s*business|local\s*shop|^local$/.test(t) || t === "local"
  const isCreator = /creator|brand/.test(t)

  if (/cart|checkout|do not finish|don'?t finish/.test(j)) {
    return pick([
      "marketing-and-sales/e-commerce",
      "marketing-and-sales/digital-marketing",
      "marketing-and-sales/personalization",
      "artificial-intelligence/deploy-ai",
    ])
  }

  if (/appointment|gaps|book has|fill the book/.test(j)) {
    return pick([
      "operations/service-operations",
      "marketing-and-sales/digital-sales",
      "artificial-intelligence/agentic-ai",
    ])
  }

  if (/unanswered|calls and messages|missed call|after.?hours/.test(j)) {
    // No "communications" offering exists; reshape-workflows is the closest path.
    return pick([
      "artificial-intelligence/agentic-ai",
      "operations/service-operations",
      "artificial-intelligence/reshape-workflows",
    ])
  }

  if (/find us online|cannot find|can'?t find|get found|discover/.test(j)) {
    return pick([
      "discoverability",
      "discoverability/search-and-seo",
      "discoverability/google-maps",
      "marketing-and-sales/digital-marketing",
    ])
  }

  if (/ads|wrong people|reach the wrong|targeting/.test(j)) {
    return pick([
      "marketing-and-sales/digital-marketing",
      "customer-insights/customer-demand",
      "marketing-and-sales/sales-channel-strategy",
    ])
  }

  if (/launch|something new|new product|new offer/.test(j)) {
    return pick([
      "innovation-strategy-and-delivery/innovation-strategy",
      "innovation-strategy-and-delivery/innovation-delivery",
      "innovation-strategy-and-delivery/business-and-scale-up",
    ])
  }

  if (/come back|return|repeat|refill/.test(j)) {
    return pick([
      "marketing-and-sales/personalization",
      "customer-insights/customer-experience",
      "marketing-and-sales/digital-marketing",
    ])
  }

  // No clear job: lean on business type.
  if (isOnline) {
    return pick([
      "marketing-and-sales/e-commerce",
      "marketing-and-sales/digital-marketing",
      "marketing-and-sales/personalization",
      "artificial-intelligence/deploy-ai",
    ])
  }

  if (isClinic || isService) {
    return pick([
      "operations/service-operations",
      "marketing-and-sales/digital-sales",
      "artificial-intelligence/agentic-ai",
    ])
  }

  if (isCreator) {
    return pick(["audience", "marketing-and-sales/digital-marketing", "artificial-intelligence/deploy-ai"])
  }

  return pick(DEFAULT_REFS)
}

/** Map report popup `type=` answer values onto Talk-style business type labels. */
export function businessTypeFromReportAnswers(answers: string | null | undefined): string | null {
  if (!answers) return null
  const match = answers.match(/(?:^|;\s*)type=([a-z0-9_]+)/i)
  if (!match) return null
  const value = match[1].toLowerCase()
  if (value === "online_store") return "Online store"
  if (value === "local") return "Local shop"
  if (value === "clinic") return "Clinic or practice"
  if (value === "other") return "Other"
  return value
}
