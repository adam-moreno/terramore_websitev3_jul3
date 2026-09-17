import { collectCatalog } from "@/lib/report/collect/catalog"
import { collectDirectories } from "@/lib/report/collect/directories"
import { collectLocations } from "@/lib/report/collect/locations"
import { collectCompetitors } from "@/lib/report/collect/competitors"
import { collectMobile } from "@/lib/report/collect/mobile"
import { collectSearch } from "@/lib/report/collect/search"
import { collectSiteExperience } from "@/lib/report/collect/site-experience"
import { collectTechnical } from "@/lib/report/collect/technical"
import { normalizeWebsite } from "@/lib/report/footprint"
import { REPORT_DISCLAIMERS, buildRecommendations } from "@/lib/report/recommend"
import { buildFacts, scoreDigitalPresence } from "@/lib/report/score/digital-presence"
import type { DiagnosticBundle } from "@/lib/report/types"

/**
 * Orchestrates MVP collectors → facts → deterministic scores → recommendations.
 * Extends the existing report pipeline; does not replace lead intake.
 */
export async function collectDiagnostic(businessName: string, rawWebsite: string | null | undefined): Promise<DiagnosticBundle> {
  const website = normalizeWebsite(rawWebsite)
  const readAt = new Date().toISOString()

  const site = await collectSiteExperience(website)
  const technical = await collectTechnical(
    website,
    site.homeHtml,
    site.pages[0]?.status ?? null,
    site.homeFinalUrl || site.pages[0]?.url || null,
  )

  const directories = collectDirectories(site.pageHtml)
  const location = await collectLocations(businessName, website)
  const catalog = await collectCatalog({
    website,
    platform: site.platform,
    hasCheckout: site.hasCheckout,
    servicePageExcerpts: site.pages.map((p) => p.excerpt),
  })
  const competitive = collectCompetitors(site.pages.map((p) => p.excerpt))
  const search = collectSearch()
  const mobile = collectMobile()

  const scores = scoreDigitalPresence({
    pages: site.pages,
    technical,
    directories,
    location,
    catalog,
    hasCheckout: site.hasCheckout,
  })

  const facts = buildFacts({
    businessName,
    website,
    pages: site.pages,
    technical,
    directories,
    location,
    catalog,
    platform: site.platform,
    pixels: site.pixels,
    hasCheckout: site.hasCheckout,
  })

  const { recommendations } = buildRecommendations({
    pages: site.pages,
    technical,
    directories,
    location,
    catalog,
    hasCheckout: site.hasCheckout,
    competitiveAvailable: competitive.available,
  })

  return {
    businessName,
    website,
    readAt,
    pages: site.pages,
    technical,
    directories,
    location,
    catalog,
    competitive,
    search,
    mobile,
    facts,
    scores,
    recommendations,
    disclaimers: REPORT_DISCLAIMERS,
  }
}
