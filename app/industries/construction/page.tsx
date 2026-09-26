import type { Metadata } from "next"
import { ConstructionLanding } from "@/components/industries/construction-landing"
import { SiteFooter } from "@/components/site-footer"

const TITLE = "Contractor & Construction Marketing | Terramore"
const DESCRIPTION =
  "Terramore helps general contractors, remodelers, and builders turn finished projects and referrals into more inquiries, estimates, and booked work."
const URL = "https://www.terramore.io/industries/construction"
const OG_IMAGE = "/share/terramore-share-v2-og.png"

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: "construction marketing, contractor marketing, general contractor marketing, remodeling marketing",
  alternates: { canonical: URL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: URL,
    siteName: "Terramore.io",
    locale: "en_US",
    type: "website",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Terramore" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
}

export default function ConstructionIndustryPage() {
  return (
    <div className="min-h-screen bg-cream">
      <ConstructionLanding />
      <SiteFooter
        tagline="Your next project starts with the system behind it."
        showDualCtas={false}
      />
    </div>
  )
}
