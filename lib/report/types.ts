/**
 * Structured Digital Footprint diagnostic types.
 * Facts are observed only. Scores are deterministic. LLM prose consumes these; it must not invent them.
 */

export type Confidence = "high" | "medium" | "low"
export type Priority = "critical" | "high" | "medium" | "low"
export type SourceType =
  | "website"
  | "products_json"
  | "places"
  | "robots"
  | "sitemap"
  | "directory_link"
  | "meta"
  | "derived"
  | "unavailable"

export type Provenance = {
  sourceUrl: string | null
  sourceType: SourceType
  observedAt: string
  observation: string
  context?: string
  confidence: Confidence
}

export type Fact = {
  key: string
  label: string
  value: string | number | boolean | null
  available: boolean
  note?: string
  provenance: Provenance
}

export type Evidence = {
  id: string
  summary: string
  facts: string[]
  provenance: Provenance[]
}

export type ScoreFactor = {
  id: string
  label: string
  score: number | null
  weight: number
  available: boolean
  unavailableReason?: string
  evidence: string[]
  subfactors?: Array<{ id: string; label: string; score: number | null; note?: string }>
}

export type ScoreBreakdown = {
  overall: number | null
  evidenceCoverage: number
  factors: ScoreFactor[]
  /** When a factor is unavailable, its weight is redistributed across available factors. */
  redistributionRule: string
}

export type Finding = {
  id: string
  section: string
  finding: string
  evidence: string
  impact: string
  action: string
  priority: Priority
  confidence: Confidence
  evidenceIds?: string[]
}

export type Recommendation = Finding & {
  rank: number
}

export type DirectoryProfile = {
  platform: string
  url: string | null
  found: boolean
  linkedFromSite: boolean
  note: string
}

export type CatalogSnapshot = {
  kind: "ecommerce" | "services" | "unknown"
  available: boolean
  productCount: number | null
  sampleNames: string[]
  variantHeavy: boolean
  prices: string[]
  note: string
  sourceUrl: string | null
}

export type PageSnapshot = {
  url: string
  status: number | null
  title: string | null
  h1: string[]
  navLabels: string[]
  ctaTexts: string[]
  formCount: number
  hasPhone: boolean
  hasEmail: boolean
  hasBookingLink: boolean
  trustSignals: string[]
  excerpt: string
}

export type TechnicalSnapshot = {
  https: boolean
  title: string | null
  description: string | null
  canonical: string | null
  hasRobots: boolean
  hasSitemap: boolean
  viewport: boolean
  status: number | null
  note: string
}

export type LocationSnapshot = {
  checked: boolean
  found: boolean
  name: string | null
  address: string | null
  rating: number | null
  reviewCount: number | null
  hasHours: boolean
  mapsUrl: string | null
  note: string
}

export type DiagnosticBundle = {
  businessName: string
  website: string | null
  readAt: string
  pages: PageSnapshot[]
  technical: TechnicalSnapshot
  directories: DirectoryProfile[]
  location: LocationSnapshot
  catalog: CatalogSnapshot
  competitive: { available: boolean; note: string; competitors: Array<{ name: string; note: string }> }
  search: { available: boolean; note: string }
  mobile: { available: boolean; note: string }
  facts: Fact[]
  scores: ScoreBreakdown
  recommendations: Recommendation[]
  disclaimers: string[]
}

export type MvpReportContent = {
  businessName: string
  website: string | null
  readDate: string
  headline: string
  overallScore: number | null
  evidenceCoverage: number
  whatCustomersSee: string
  working: string[]
  opportunities: string[]
  scoreFactors: ScoreFactor[]
  findings: Finding[]
  recommendations: Recommendation[]
  chapters: Array<{ kicker: string; title: string; items: Array<{ label: string; value: string; note: string }>; summary: string }>
  moves: Array<{ window: string; title: string; body: string }>
  evidenceAppendix: Array<{ source: string; observation: string; date: string; confidence: Confidence }>
  competitiveNote: string
  disclaimers: string[]
  model: string
  diagnostic: DiagnosticBundle
}
