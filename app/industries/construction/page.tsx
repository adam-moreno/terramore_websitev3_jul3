import type { Metadata } from "next"
import { ConstructionLanding } from "@/components/industries/construction-landing"
import { SiteFooter } from "@/components/site-footer"

export const metadata: Metadata = {
  title: "Construction Marketing & Growth | Terramore",
  description:
    "Terramore helps construction companies connect project content, search visibility, paid acquisition, landing pages and follow-up into one growth system.",
  alternates: { canonical: "https://www.terramore.io/industries/construction" },
  openGraph: {
    title: "Construction Marketing & Growth | Terramore",
    description:
      "Turn completed projects, referrals, search, and follow-up into a connected growth system for contractors and builders.",
    url: "https://www.terramore.io/industries/construction",
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
