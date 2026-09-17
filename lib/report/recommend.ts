import type {
  CatalogSnapshot,
  DiagnosticBundle,
  DirectoryProfile,
  Finding,
  LocationSnapshot,
  PageSnapshot,
  Recommendation,
  TechnicalSnapshot,
} from "@/lib/report/types"

function finding(
  id: string,
  section: string,
  data: Omit<Finding, "id" | "section">,
): Finding {
  return { id, section, ...data }
}

/**
 * Deterministic recommendation engine.
 * Produces ranked Top 5 actions from observed facts only.
 * LLM may rephrase later; it must not invent new priorities or metrics.
 */
export function buildRecommendations(input: {
  pages: PageSnapshot[]
  technical: TechnicalSnapshot
  directories: DirectoryProfile[]
  location: LocationSnapshot
  catalog: CatalogSnapshot
  hasCheckout: boolean
  competitiveAvailable: boolean
}): { findings: Finding[]; recommendations: Recommendation[] } {
  const home = input.pages[0]
  const findings: Finding[] = []

  if (!home || !(home.status && home.status < 400)) {
    findings.push(
      finding("site_unreachable", "First Impression", {
        finding: "The website was not reachable for analysis.",
        evidence: `Requested URL status: ${home?.status ?? "no response"}`,
        impact: "A potential customer who finds the business online may not be able to evaluate or contact it.",
        action: "Confirm the public URL, HTTPS certificate, and hosting are live, then re-run this report.",
        priority: "critical",
        confidence: "high",
      }),
    )
  } else {
    if (!home.h1.length) {
      findings.push(
        finding("missing_h1", "First Impression", {
          finding: "The homepage does not expose a clear primary heading.",
          evidence: `Title: ${home.title || "Not found"}; H1 count: 0 on ${home.url}`,
          impact: "A first-time visitor may struggle to understand what the business does within seconds.",
          action: "Add one specific H1 that states the primary offer and customer outcome.",
          priority: "high",
          confidence: "high",
        }),
      )
    }
    if (home.ctaTexts.length === 0) {
      findings.push(
        finding("no_cta", "Conversion", {
          finding: "No clear call-to-action controls were detected on the homepage.",
          evidence: `CTA scan on ${home.url}; forms=${home.formCount}`,
          impact: "Visitors who understand the offer still may not know the next step.",
          action: "Place one primary CTA above the fold for the main conversion path (book, quote, shop, or contact).",
          priority: "high",
          confidence: "medium",
        }),
      )
    } else if (home.ctaTexts.length > 4) {
      findings.push(
        finding("many_ctas", "Conversion", {
          finding: "Multiple competing calls to action appear on the homepage.",
          evidence: `Observed CTAs: ${home.ctaTexts.join(", ")}`,
          impact: "Decision friction rises when several next steps compete for attention.",
          action: "Designate one primary CTA and demote secondary actions visually.",
          priority: "medium",
          confidence: "medium",
        }),
      )
    }
    if (!home.hasPhone && !home.hasEmail && home.formCount === 0 && !home.hasBookingLink && !input.hasCheckout) {
      findings.push(
        finding("weak_contact", "Conversion", {
          finding: "Contact and conversion paths are weak on the homepage.",
          evidence: "No phone, email, form, booking, or checkout signal detected on the homepage.",
          impact: "Interested visitors may leave before finding a way to engage.",
          action: "Surface phone or a short contact/booking form in the header and hero.",
          priority: "high",
          confidence: "high",
        }),
      )
    }
    if (!input.technical.description) {
      findings.push(
        finding("missing_meta", "Discoverability", {
          finding: "A meta description was not found on the homepage.",
          evidence: `${home.url} meta description: Not found in sources checked`,
          impact: "Search snippets may be less controlled when a description is missing.",
          action: "Add a concise meta description that states the offer and location or specialty.",
          priority: "medium",
          confidence: "high",
        }),
      )
    }
    if (!input.technical.hasSitemap) {
      findings.push(
        finding("missing_sitemap", "Discoverability", {
          finding: "A public sitemap.xml was not found.",
          evidence: "Fetched /sitemap.xml: Not found or invalid in sources checked",
          impact: "Search engines may discover important pages more slowly without a sitemap.",
          action: "Publish a sitemap.xml and reference it from robots.txt.",
          priority: "low",
          confidence: "high",
        }),
      )
    }
    const linkedSocial = input.directories.filter((d) => d.found)
    if (linkedSocial.length === 0) {
      findings.push(
        finding("no_social_links", "Discoverability", {
          finding: "No major social or directory profiles were linked from the pages checked.",
          evidence: "Instagram, Facebook, TikTok, LinkedIn, YouTube, Yelp: Not found in sources checked",
          impact: "Customers who prefer social proof or messaging channels may not find an official path.",
          action: "Link only real, active profiles from the site footer; do not invent profiles that do not exist.",
          priority: "medium",
          confidence: "high",
        }),
      )
    }
    if (input.location.checked && !input.location.found) {
      findings.push(
        finding("no_places", "Location", {
          finding: "A matching Google Places / Maps listing was not found in sources checked.",
          evidence: input.location.note,
          impact: "Local discovery and review trust signals may be harder for nearby customers to verify.",
          action: "Claim or verify the Google Business Profile and ensure the website URL matches.",
          priority: "high",
          confidence: "medium",
        }),
      )
    } else if (input.location.found && (input.location.reviewCount ?? 0) < 10) {
      findings.push(
        finding("few_reviews", "Trust", {
          finding: "The Places listing has relatively few observable reviews.",
          evidence: `Rating ${input.location.rating ?? "n/a"} from ${input.location.reviewCount ?? 0} reviews`,
          impact: "Thin review volume can make first-time customers hesitate compared with better-evidenced alternatives.",
          action: "Systematically request reviews from recent customers without fabricating ratings.",
          priority: "medium",
          confidence: "medium",
        }),
      )
    }
    const trust = Array.from(new Set(input.pages.flatMap((p) => p.trustSignals)))
    if (trust.length === 0) {
      findings.push(
        finding("thin_trust", "Trust", {
          finding: "On-site trust signals were thin across pages checked.",
          evidence: "Testimonials, case studies, credentials, guarantees, team: Not found in sources checked",
          impact: "Visitors may understand the offer without enough proof to proceed confidently.",
          action: "Add verifiable proof (reviews, named testimonials, credentials, or policies) near primary CTAs.",
          priority: "high",
          confidence: "medium",
        }),
      )
    }
    if (input.catalog.kind === "ecommerce" && input.catalog.available && input.catalog.variantHeavy) {
      findings.push(
        finding("variant_heavy", "Catalog", {
          finding: "The product catalog appears variant-heavy in the public products feed.",
          evidence: input.catalog.note,
          impact: "Shoppers may face decision fatigue before identifying a clear starting product.",
          action: "Feature a small set of hero products on the homepage with clearer differentiation.",
          priority: "medium",
          confidence: "medium",
        }),
      )
    }
    if (input.hasCheckout === false && home.hasBookingLink === false && input.catalog.kind !== "ecommerce") {
      // already covered by weak_contact in many cases
    }
    if (!input.competitiveAvailable) {
      // informational only — not a finding that needs action beyond honesty
    }
  }

  // Paid acquisition dependency rule when offer/conversion weak
  const offerWeak = Boolean(home && (!home.h1.length || home.ctaTexts.length === 0))
  if (offerWeak) {
    findings.push(
      finding("hold_paid", "Recommendations", {
        finding: "Paid acquisition should wait until the primary offer and conversion path are clearer.",
        evidence: `H1 count=${home?.h1.length ?? 0}; CTA count=${home?.ctaTexts.length ?? 0}`,
        impact: "Sending traffic before clarity and a next step is clear wastes spend.",
        action: "Do not prioritize paid acquisition until the primary offer and conversion path are clear.",
        priority: "high",
        confidence: "high",
      }),
    )
  }

  const priorityRank: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 }
  const sorted = [...findings].sort((a, b) => priorityRank[a.priority] - priorityRank[b.priority])
  const recommendations: Recommendation[] = sorted.slice(0, 5).map((f, index) => ({ ...f, rank: index + 1 }))

  return { findings: sorted, recommendations }
}

export const REPORT_DISCLAIMERS = [
  "This report is a snapshot in time based on public sources checked on the read date.",
  "Public-source observations are not permanent rankings.",
  '"Not found in sources checked" does not mean something does not exist.',
  "Market-level demographics are not customer demographics (demographics are not included in this MVP).",
  "No private analytics, revenue, or conversion data was used.",
  "Competitive observations reflect only the public sources analyzed.",
]

/** Compact fact string for LLM — scores and facts only, no invented metrics. */
export function diagnosticToFactsPrompt(bundle: DiagnosticBundle): string {
  const nf = "Not found in sources checked"
  const lines: string[] = [
    `Business: ${bundle.businessName || nf}`,
    `Website: ${bundle.website || nf}`,
    `Read at: ${bundle.readAt}`,
    `Digital Presence Score: ${bundle.scores.overall ?? "n/a"} / 100`,
    `Evidence Coverage: ${bundle.scores.evidenceCoverage}%`,
    `Score redistribution rule: ${bundle.scores.redistributionRule}`,
    "",
    "Score factors (deterministic — do not change these numbers):",
  ]
  for (const f of bundle.scores.factors) {
    lines.push(
      `- ${f.label}: ${f.available ? `${f.score}/100` : `Not available (${f.unavailableReason || ""})`}`,
    )
    for (const e of f.evidence) lines.push(`  evidence: ${e}`)
  }
  lines.push("", "Observed facts:")
  for (const fact of bundle.facts) {
    lines.push(
      `- ${fact.label}: ${fact.available ? String(fact.value) : nf}${fact.note ? ` (${fact.note})` : ""} [${fact.provenance.sourceType}]`,
    )
  }
  lines.push("", "Pages checked:")
  for (const p of bundle.pages) {
    lines.push(
      `- ${p.url} status=${p.status} title=${p.title || nf} h1=${p.h1.join(" | ") || nf} ctas=${p.ctaTexts.join(" | ") || nf} forms=${p.formCount} trust=${p.trustSignals.join(",") || nf}`,
    )
  }
  lines.push("", "Directories:")
  for (const d of bundle.directories) {
    lines.push(`- ${d.platform}: ${d.found ? d.url : nf}`)
  }
  lines.push("", `Location: ${bundle.location.note}`)
  if (bundle.location.found) {
    lines.push(
      `  name=${bundle.location.name} address=${bundle.location.address || nf} rating=${bundle.location.rating ?? nf} reviews=${bundle.location.reviewCount ?? nf}`,
    )
  }
  lines.push("", `Catalog: ${bundle.catalog.note}`)
  if (bundle.catalog.sampleNames.length) lines.push(`  samples: ${bundle.catalog.sampleNames.slice(0, 8).join("; ")}`)
  lines.push("", `Competitive: ${bundle.competitive.note}`)
  lines.push(`Search: ${bundle.search.note}`)
  lines.push(`Mobile: ${bundle.mobile.note}`)
  lines.push("", "Deterministic top recommendations (rephrase only; do not invent new ones or change priority order):")
  for (const r of bundle.recommendations) {
    lines.push(`${r.rank}. [${r.priority}] ${r.finding} → ${r.action}`)
  }
  lines.push("", "Home excerpt:", bundle.pages[0]?.excerpt || nf)
  return lines.join("\n")
}
