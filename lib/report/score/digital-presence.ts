import type {
  CatalogSnapshot,
  DirectoryProfile,
  Fact,
  LocationSnapshot,
  PageSnapshot,
  Provenance,
  ScoreBreakdown,
  ScoreFactor,
  TechnicalSnapshot,
} from "@/lib/report/types"

const WEIGHTS = {
  digitalExperience: 0.25,
  discoverability: 0.25,
  trust: 0.2,
  conversion: 0.2,
  technical: 0.1,
} as const

function clamp(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)))
}

function nowIso(): string {
  return new Date().toISOString()
}

function fact(
  key: string,
  label: string,
  value: string | number | boolean | null,
  available: boolean,
  provenance: Provenance,
  note?: string,
): Fact {
  return { key, label, value, available, note, provenance }
}

function prov(sourceUrl: string | null, sourceType: Provenance["sourceType"], observation: string, confidence: Provenance["confidence"] = "high"): Provenance {
  return { sourceUrl, sourceType, observedAt: nowIso(), observation, confidence }
}

export function buildFacts(input: {
  businessName: string
  website: string | null
  pages: PageSnapshot[]
  technical: TechnicalSnapshot
  directories: DirectoryProfile[]
  location: LocationSnapshot
  catalog: CatalogSnapshot
  platform: string | null
  pixels: string[]
  hasCheckout: boolean
}): Fact[] {
  const home = input.pages[0]
  const homeUrl = home?.url || input.website
  const facts: Fact[] = [
    fact("business_name", "Business name given", input.businessName || null, Boolean(input.businessName), prov(null, "derived", "Lead form input")),
    fact("website", "Website", input.website, Boolean(input.website), prov(input.website, "website", "Lead form / normalized URL")),
    fact("home_reachable", "Homepage reachable", Boolean(home && home.status && home.status < 400), Boolean(home), prov(homeUrl, "website", `HTTP ${home?.status ?? "n/a"}`)),
    fact("title", "Page title", home?.title ?? null, Boolean(home?.title), prov(homeUrl, "meta", "Homepage <title>")),
    fact("h1_count", "H1 count", home?.h1.length ?? 0, Boolean(home), prov(homeUrl, "website", home?.h1.join(" | ") || "No H1")),
    fact("nav_count", "Nav labels observed", home?.navLabels.length ?? 0, Boolean(home), prov(homeUrl, "website", home?.navLabels.slice(0, 8).join(", ") || "None")),
    fact("cta_count", "CTA-like controls", home?.ctaTexts.length ?? 0, Boolean(home), prov(homeUrl, "website", home?.ctaTexts.slice(0, 6).join(", ") || "None")),
    fact("form_count", "Forms on homepage", home?.formCount ?? 0, Boolean(home), prov(homeUrl, "website", "Counted <form> tags")),
    fact("phone", "Phone on homepage", home?.hasPhone ?? false, Boolean(home), prov(homeUrl, "website", "Phone pattern match")),
    fact("email", "Email on homepage", home?.hasEmail ?? false, Boolean(home), prov(homeUrl, "website", "Email pattern match")),
    fact("booking", "Booking path signal", home?.hasBookingLink ?? false, Boolean(home), prov(homeUrl, "website", "Booking vendor / copy pattern")),
    fact("checkout", "Checkout / cart signal", input.hasCheckout, Boolean(home), prov(homeUrl, "website", "Cart/checkout pattern")),
    fact("pages_checked", "Pages checked", input.pages.length, input.pages.length > 0, prov(homeUrl, "website", input.pages.map((p) => p.url).join("; "))),
    fact("https", "HTTPS", input.technical.https, true, prov(homeUrl, "website", input.technical.note)),
    fact("meta_description", "Meta description", input.technical.description, Boolean(input.technical.description), prov(homeUrl, "meta", "meta description")),
    fact("robots", "robots.txt", input.technical.hasRobots, true, prov(homeUrl, "robots", "Fetched /robots.txt")),
    fact("sitemap", "sitemap.xml", input.technical.hasSitemap, true, prov(homeUrl, "sitemap", "Fetched /sitemap.xml")),
    fact("platform", "Platform", input.platform, Boolean(input.platform), prov(homeUrl, "website", "HTML fingerprint")),
    fact("pixels", "Tracking pixels", input.pixels.join(", ") || null, input.pixels.length > 0, prov(homeUrl, "website", "Script fingerprints")),
    fact(
      "social_linked",
      "Social/directory profiles linked",
      input.directories.filter((d) => d.found).map((d) => d.platform).join(", ") || null,
      input.directories.some((d) => d.found),
      prov(homeUrl, "directory_link", "Links extracted from pages checked"),
    ),
    fact(
      "places_found",
      "Google Places listing",
      input.location.found,
      input.location.checked,
      prov(input.location.mapsUrl, "places", input.location.note),
      input.location.checked ? undefined : "Places not checked",
    ),
    fact(
      "places_rating",
      "Places rating",
      input.location.rating,
      input.location.rating != null,
      prov(input.location.mapsUrl, "places", `${input.location.rating ?? "n/a"} from ${input.location.reviewCount ?? 0} reviews`),
    ),
    fact(
      "catalog",
      "Catalog / services snapshot",
      input.catalog.available ? `${input.catalog.kind}:${input.catalog.productCount ?? "n/a"}` : null,
      input.catalog.available,
      prov(input.catalog.sourceUrl, input.catalog.kind === "ecommerce" ? "products_json" : "website", input.catalog.note),
    ),
  ]
  return facts
}

function scoreDigitalExperience(home: PageSnapshot | undefined, pages: PageSnapshot[]): ScoreFactor {
  if (!home || !(home.status && home.status < 400)) {
    return {
      id: "digital_experience",
      label: "Digital Experience",
      score: null,
      weight: WEIGHTS.digitalExperience,
      available: false,
      unavailableReason: "Homepage not reachable in sources checked",
      evidence: [],
    }
  }
  let score = 40
  const evidence: string[] = []
  if (home.h1.length === 1) {
    score += 12
    evidence.push("Single clear H1")
  } else if (home.h1.length > 1) {
    score += 4
    evidence.push("Multiple H1s")
  } else {
    score -= 8
    evidence.push("No H1 found")
  }
  if (home.title) {
    score += 8
    evidence.push(`Title: ${home.title}`)
  }
  if (home.navLabels.length >= 3 && home.navLabels.length <= 10) {
    score += 10
    evidence.push(`Navigation labels: ${home.navLabels.length}`)
  } else if (home.navLabels.length > 10) {
    score += 2
    evidence.push(`Large navigation set: ${home.navLabels.length}`)
  } else {
    evidence.push("Sparse navigation labels")
  }
  if (home.ctaTexts.length === 1 || home.ctaTexts.length === 2) {
    score += 12
    evidence.push(`Focused CTAs: ${home.ctaTexts.join(", ")}`)
  } else if (home.ctaTexts.length > 4) {
    score -= 6
    evidence.push(`Many competing CTAs: ${home.ctaTexts.length}`)
  } else if (home.ctaTexts.length === 0) {
    score -= 10
    evidence.push("No CTA-like controls detected")
  } else {
    score += 6
    evidence.push(`CTAs: ${home.ctaTexts.join(", ")}`)
  }
  if (pages.length >= 3) {
    score += 8
    evidence.push(`Key pages checked: ${pages.length}`)
  }
  return {
    id: "digital_experience",
    label: "Digital Experience",
    score: clamp(score),
    weight: WEIGHTS.digitalExperience,
    available: true,
    evidence,
    subfactors: [
      { id: "first_impression", label: "First Impression", score: clamp(home.h1.length && home.title ? 70 : 40), note: home.h1[0] || "No H1" },
      { id: "navigation", label: "Navigation", score: clamp(home.navLabels.length ? Math.min(90, 30 + home.navLabels.length * 6) : 25) },
      { id: "offer_clarity", label: "Offer Clarity", score: clamp(home.h1.length ? 65 : 35), note: "Based on H1/title presence only" },
      { id: "decision_friction", label: "Decision Friction", score: clamp(home.ctaTexts.length > 4 ? 40 : home.ctaTexts.length ? 70 : 35) },
      { id: "mobile", label: "Mobile Experience", score: null, note: "Not available in this report version" },
    ],
  }
}

function scoreDiscoverability(
  technical: TechnicalSnapshot,
  directories: DirectoryProfile[],
  location: LocationSnapshot,
  home: PageSnapshot | undefined,
): ScoreFactor {
  if (!home) {
    return {
      id: "discoverability",
      label: "Discoverability",
      score: null,
      weight: WEIGHTS.discoverability,
      available: false,
      unavailableReason: "No website pages checked",
      evidence: [],
    }
  }
  let score = 25
  const evidence: string[] = []
  if (technical.title) {
    score += 10
    evidence.push("Title present")
  }
  if (technical.description) {
    score += 10
    evidence.push("Meta description present")
  } else evidence.push("Meta description: Not found in sources checked")
  if (technical.hasRobots) {
    score += 5
    evidence.push("robots.txt present")
  }
  if (technical.hasSitemap) {
    score += 8
    evidence.push("sitemap.xml present")
  }
  const linked = directories.filter((d) => d.found)
  score += Math.min(20, linked.length * 4)
  evidence.push(linked.length ? `Linked profiles: ${linked.map((d) => d.platform).join(", ")}` : "Social/directory links: Not found in sources checked")
  if (location.checked && location.found) {
    score += 15
    evidence.push(`Places listing found${location.rating != null ? ` (${location.rating}★ / ${location.reviewCount ?? 0})` : ""}`)
  } else if (location.checked) {
    evidence.push("Places listing: Not found in sources checked")
  } else {
    evidence.push("Places: not checked")
  }
  // SERP unavailable — do not invent; coverage handles missing weight elsewhere via factor availability
  return {
    id: "discoverability",
    label: "Discoverability",
    score: clamp(score),
    weight: WEIGHTS.discoverability,
    available: true,
    evidence,
    subfactors: [
      { id: "search_meta", label: "Search / metadata basics", score: clamp((technical.title ? 40 : 0) + (technical.description ? 40 : 0) + 20) },
      { id: "maps", label: "Maps / Places", score: location.checked ? (location.found ? 80 : 20) : null, note: location.checked ? undefined : "Not checked" },
      { id: "social", label: "Social footprint", score: clamp(linked.length * 15) },
      { id: "serp", label: "SERP ranking", score: null, note: "Not available in this report version" },
    ],
  }
}

function scoreTrust(home: PageSnapshot | undefined, pages: PageSnapshot[], location: LocationSnapshot): ScoreFactor {
  if (!home) {
    return {
      id: "trust",
      label: "Trust & Credibility",
      score: null,
      weight: WEIGHTS.trust,
      available: false,
      unavailableReason: "No website pages checked",
      evidence: [],
    }
  }
  const signals = Array.from(new Set(pages.flatMap((p) => p.trustSignals)))
  let score = 30
  const evidence: string[] = []
  score += Math.min(35, signals.length * 7)
  evidence.push(signals.length ? `Trust indicators: ${signals.join(", ")}` : "On-site trust indicators: Not found in sources checked")
  if (location.found && location.rating != null) {
    const reviewBoost = Math.min(25, Math.round((location.rating - 3) * 10) + Math.min(15, Math.floor((location.reviewCount || 0) / 20)))
    score += Math.max(0, reviewBoost)
    evidence.push(`Places reviews: ${location.rating}★ from ${location.reviewCount ?? 0} reviews`)
  } else if (location.checked) {
    evidence.push("Places reviews: Not found in sources checked")
  }
  if (location.found && location.address) {
    score += 8
    evidence.push(`Address listed: ${location.address}`)
  }
  return {
    id: "trust",
    label: "Trust & Credibility",
    score: clamp(score),
    weight: WEIGHTS.trust,
    available: true,
    evidence,
  }
}

function scoreConversion(home: PageSnapshot | undefined, hasCheckout: boolean, catalog: CatalogSnapshot): ScoreFactor {
  if (!home) {
    return {
      id: "conversion",
      label: "Conversion Readiness",
      score: null,
      weight: WEIGHTS.conversion,
      available: false,
      unavailableReason: "No website pages checked",
      evidence: [],
    }
  }
  let score = 25
  const evidence: string[] = []
  if (home.ctaTexts.length) {
    score += 15
    evidence.push(`CTA present: ${home.ctaTexts.slice(0, 3).join(", ")}`)
  } else evidence.push("CTA: Not found in sources checked")
  if (home.hasPhone || home.hasEmail || home.formCount > 0) {
    score += 15
    evidence.push(`Contact path: phone=${home.hasPhone} email=${home.hasEmail} forms=${home.formCount}`)
  } else evidence.push("Contact path weak: phone/email/form not found on homepage")
  if (home.hasBookingLink) {
    score += 15
    evidence.push("Booking path signal found")
  } else evidence.push("Booking path: Not found in sources checked")
  if (hasCheckout) {
    score += 15
    evidence.push("Checkout/cart signal found")
  }
  if (catalog.available && catalog.kind === "ecommerce" && (catalog.productCount || 0) > 0) {
    score += 10
    evidence.push(`Catalog visible: ${catalog.productCount} products in products.json sample`)
  } else if (catalog.available && catalog.kind === "services") {
    score += 8
    evidence.push("Service-oriented content found")
  }
  if (home.ctaTexts.length > 5) {
    score -= 8
    evidence.push("Many competing CTAs may dilute the next step")
  }
  return {
    id: "conversion",
    label: "Conversion Readiness",
    score: clamp(score),
    weight: WEIGHTS.conversion,
    available: true,
    evidence,
  }
}

function scoreTechnical(technical: TechnicalSnapshot, home: PageSnapshot | undefined): ScoreFactor {
  if (!home) {
    return {
      id: "technical",
      label: "Technical Health",
      score: null,
      weight: WEIGHTS.technical,
      available: false,
      unavailableReason: "No website response to score",
      evidence: [],
    }
  }
  let score = 40
  const evidence: string[] = []
  if (technical.https) {
    score += 20
    evidence.push("HTTPS")
  } else {
    score -= 20
    evidence.push("Not HTTPS")
  }
  if (technical.title) score += 10
  if (technical.description) score += 8
  if (technical.canonical) {
    score += 5
    evidence.push("Canonical present")
  }
  if (technical.hasRobots) score += 5
  if (technical.hasSitemap) score += 7
  if (technical.viewport) {
    score += 5
    evidence.push("Viewport meta present")
  }
  if (technical.status && technical.status >= 400) {
    score = 10
    evidence.push(`HTTP ${technical.status}`)
  }
  return {
    id: "technical",
    label: "Technical Health",
    score: clamp(score),
    weight: WEIGHTS.technical,
    available: true,
    evidence,
  }
}

/**
 * Deterministic Digital Presence Score + Evidence Coverage.
 * Missing factors are marked unavailable; their weight is redistributed across available factors.
 * Evidence Coverage = share of scoring model with observable evidence (available weight / total weight).
 */
export function scoreDigitalPresence(input: {
  pages: PageSnapshot[]
  technical: TechnicalSnapshot
  directories: DirectoryProfile[]
  location: LocationSnapshot
  catalog: CatalogSnapshot
  hasCheckout: boolean
}): ScoreBreakdown {
  const home = input.pages[0]
  const factors: ScoreFactor[] = [
    scoreDigitalExperience(home, input.pages),
    scoreDiscoverability(input.technical, input.directories, input.location, home),
    scoreTrust(home, input.pages, input.location),
    scoreConversion(home, input.hasCheckout, input.catalog),
    scoreTechnical(input.technical, home),
  ]

  const totalWeight = factors.reduce((sum, f) => sum + f.weight, 0)
  const availableWeight = factors.filter((f) => f.available && f.score != null).reduce((sum, f) => sum + f.weight, 0)
  const evidenceCoverage = totalWeight === 0 ? 0 : Math.round((availableWeight / totalWeight) * 100)

  let overall: number | null = null
  if (availableWeight > 0) {
    const weighted = factors
      .filter((f) => f.available && f.score != null)
      .reduce((sum, f) => sum + (f.score as number) * (f.weight / availableWeight), 0)
    overall = clamp(weighted)
  }

  return {
    overall,
    evidenceCoverage,
    factors,
    redistributionRule:
      "If a factor is unavailable, its weight is excluded from the overall score and remaining available weights are renormalized to 100%. Evidence Coverage is available_weight / total_weight.",
  }
}
