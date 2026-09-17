/**
 * Digital Footprint MVP QA fixtures — ~10 public-business categories.
 * Purpose: detect fabricated findings, bad scores, collector failures.
 * Run: npx tsx scripts/report-qa/run-qa.ts
 *
 * Gold standards are intentionally conservative. Match = automated output
 * does not invent unsupported claims and captures the expected signal.
 */

export type QaFixture = {
  id: string
  category: string
  businessName: string
  website: string
  /** Manual gold: what we expect the collector/scorer to observe or correctly mark unavailable */
  expected: Array<{
    finding: string
    /** Keys or substrings that should appear in facts/evidence/recommendations */
    mustIncludeAny?: string[]
    /** Phrases that must NOT appear (fabrication detectors) */
    mustNotInclude?: string[]
  }>
}

export const QA_FIXTURES: QaFixture[] = [
  {
    id: "local-service",
    category: "Local service",
    businessName: "Mike's Plumbing",
    website: "https://www.mikesplumbing.com",
    expected: [
      {
        finding: "Homepage analyzed or unreachable marked honestly",
        mustIncludeAny: ["home_reachable", "HTTPS", "pages_checked"],
        mustNotInclude: ["conversion rate", "revenue", "your customers are mostly"],
      },
    ],
  },
  {
    id: "restaurant",
    category: "Restaurant",
    businessName: "The French Laundry",
    website: "https://www.thomaskeller.com/tfl",
    expected: [
      {
        finding: "Site or Places evidence without inventing rankings",
        mustNotInclude: ["#1 restaurant", "wins more customers", "higher conversion"],
      },
    ],
  },
  {
    id: "professional",
    category: "Professional services",
    businessName: "Wilson Sonsini",
    website: "https://www.wsgr.com",
    expected: [
      {
        finding: "No fabricated competitor winners",
        mustNotInclude: ["Competitor X is the best", "is winning", "gets more customers"],
      },
    ],
  },
  {
    id: "construction",
    category: "Construction",
    businessName: "Turner Construction",
    website: "https://www.turnerconstruction.com",
    expected: [
      {
        finding: "Trust language uses Not found when missing",
        mustNotInclude: ["does not have reviews", "has zero Instagram followers"],
      },
    ],
  },
  {
    id: "ecommerce",
    category: "Ecommerce",
    businessName: "Allbirds",
    website: "https://www.allbirds.com",
    expected: [
      {
        finding: "Checkout or products.json attempt without inventing product counts if unavailable",
        mustIncludeAny: ["checkout", "catalog", "Shopify", "products"],
        mustNotInclude: ["conversion rate", "AOV"],
      },
    ],
  },
  {
    id: "healthcare",
    category: "Healthcare/public-facing",
    businessName: "Cleveland Clinic",
    website: "https://my.clevelandclinic.org",
    expected: [
      {
        finding: "No invented demographics",
        mustNotInclude: ["your patients are mostly", "median income of your customers"],
      },
    ],
  },
  {
    id: "home-services",
    category: "Home services",
    businessName: "TaskRabbit",
    website: "https://www.taskrabbit.com",
    expected: [
      {
        finding: "CTA/contact observations are evidence-tied",
        mustNotInclude: ["invented booking volume"],
      },
    ],
  },
  {
    id: "b2b",
    category: "B2B",
    businessName: "Stripe",
    website: "https://stripe.com",
    expected: [
      {
        finding: "Technical basics collected",
        mustIncludeAny: ["https", "title", "robots", "sitemap"],
        mustNotInclude: ["SERP rank #1", "outranks"],
      },
    ],
  },
  {
    id: "retail",
    category: "Retail",
    businessName: "REI",
    website: "https://www.rei.com",
    expected: [
      {
        finding: "Multi-channel presence only if linked",
        mustNotInclude: ["assumed Instagram", "must have TikTok"],
      },
    ],
  },
  {
    id: "multi-location",
    category: "Multi-location",
    businessName: "Starbucks",
    website: "https://www.starbucks.com",
    expected: [
      {
        finding: "Does not claim only one location merely because one Places hit",
        mustNotInclude: ["only one location", "single location business"],
      },
    ],
  },
]
