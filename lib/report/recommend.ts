import type {
  CatalogSnapshot,
  DiagnosticBundle,
  DirectoryProfile,
  Finding,
  PageSnapshot,
  Recommendation,
  TechnicalSnapshot,
} from "@/lib/report/types"
import type { NextStep } from "@/lib/report/collect/next-step"
import { placeholderPages, type PriceAnchor } from "@/lib/report/collect/site-experience"

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
  catalog: CatalogSnapshot
  hasCheckout: boolean
  competitiveAvailable: boolean
  /** Analytics and ad tags found in the homepage code. Omitted means not checked, so no measurement finding. */
  pixels?: string[]
  nextStep?: NextStep
  /** The highest price the site lists, used for scale on the top action ("one more job like that is $3,800"). */
  priceAnchor?: PriceAnchor | null
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
    if (!home.hasPhone && !home.hasEmail && home.formCount === 0 && !home.hasBookingLink && !input.hasCheckout && !input.nextStep?.orderForm && !input.nextStep?.externalForm) {
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
    // Without any measurement the owner can't see where customers come from, or whether that is changing. Benefit
    // first, in two steps with plain effort, so the easy start doesn't read as trivial and the real setup isn't scary.
    if (input.pixels && input.pixels.length === 0) {
      const orderBusiness = input.nextStep?.path === "order"
      findings.push(
        finding("no_measurement", "Conversion", {
          finding: "You can't see where your customers come from.",
          evidence: `${home.url} code: Google Analytics, Google Tag Manager, Google Ads, Meta Pixel and TikTok Pixel not found in sources checked`,
          impact: orderBusiness
            ? "So you can't tell which posts and places bring orders, or notice when orders start slowing down."
            : "So you can't tell which marketing is working, or spot a slowdown in inquiries before it shows up in sales.",
          action: orderBusiness
            ? "Step 1: add a \"How did you hear about us?\" question to your order form. Step 2: share a different link to the form in each place you post it (Instagram bio, Facebook, texts), so every order shows where it came from."
            : "Step 1: ask every new customer how they heard about you and keep a simple tally. Step 2: add Google Analytics, so your website counts calls and quote or contact requests by where each visitor came from.",
          priority: "high",
          confidence: "high",
          effort: orderBusiness
            ? "Step 1: about 5 minutes. Step 2: about 30 minutes."
            : "Step 1: about 10 minutes, and you can start today. Step 2: an afternoon, or we can set it up for you.",
        }),
      )
    }
    // A page that says it isn't finished ("Photos coming soon!") is a dead end at the moment a visitor checks your work.
    for (const page of placeholderPages(input.pages).slice(0, 1)) {
      findings.push(
        finding("placeholder_page", "Trust", {
          finding: `Your "${page.name}" page says "${page.phrase}"`,
          evidence: `Read on ${page.url}`,
          impact: page.isWorkPage
            ? "People who click to see your work find nothing, right when they're deciding whether to trust you."
            : "Visitors who open this page hit a dead end and may leave.",
          action: page.isWorkPage
            ? "Add 6 to 10 photos of finished jobs, each with the town and the type of job."
            : "Finish the page, or remove the link to it until it's ready.",
          priority: "high",
          confidence: "high",
          effort: page.isWorkPage ? "An afternoon with your phone camera." : "About 30 minutes.",
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
  const sorted = [...findings]
    .map((f) => ({ ...f, effort: f.effort ?? EFFORT[f.id] }))
    .sort((a, b) => priorityRank[a.priority] - priorityRank[b.priority])
  const recommendations: Recommendation[] = sorted.slice(0, 5).map((f, index) => ({ ...f, rank: index + 1 }))
  // For scale, on the top action only: the owner's own listed price, never an estimate of what they're losing.
  if (recommendations[0] && input.priceAnchor) {
    const noun = { store: "sale", order: "order", quote: "job", booking: "booking" }[input.nextStep?.path ?? "booking"]
    recommendations[0] = {
      ...recommendations[0],
      impact: `${recommendations[0].impact} For scale: your site lists "${input.priceAnchor.context.replace(/[.!?]$/, "")}".${
        effortPhrase(recommendations[0].effort) ? ` This takes ${effortPhrase(recommendations[0].effort)};` : ""
      } even one more ${noun} like that is ${input.priceAnchor.amount}.`,
    }
  }

  return { findings: sorted, recommendations }
}

/**
 * The effort of the action's main step, as a phrase that fits "This takes …": "an afternoon", "about 15 minutes".
 * Two-step efforts use the last step (the real work); "or we can set it up" is left out of the sentence.
 */
export function effortPhrase(effort: string | undefined): string | null {
  if (!effort) return null
  const steps = effort.split(/Step \d+:/i).map((p) => p.trim()).filter(Boolean)
  const main = (steps.at(-1) ?? effort).toLowerCase()
  const m = main.match(/\b(an afternoon|a day|about \d+ (?:minutes|hours?))\b/)
  return m ? m[1] : null
}

/** Plain effort for each action, so owners can pick the easy wins first. Rules may set their own (measurement). */
const EFFORT: Record<string, string> = {
  site_unreachable: "Needs whoever hosts your website.",
  missing_h1: "About 15 minutes.",
  no_cta: "About 30 minutes.",
  many_ctas: "About 30 minutes.",
  weak_contact: "About 15 minutes.",
  missing_meta: "About 10 minutes.",
  missing_sitemap: "About 15 minutes; often a setting in your site builder.",
  no_social_links: "About 10 minutes.",
  thin_trust: "An afternoon.",
  variant_heavy: "An afternoon.",
  hold_paid: "A decision, not a task.",
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
