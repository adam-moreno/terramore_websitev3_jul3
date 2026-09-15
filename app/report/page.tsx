import type { Metadata } from "next"
import { DigitalFootprintLanding } from "@/components/digital-footprint-landing"
import { SiteFooter } from "@/components/site-footer"

export const metadata: Metadata = {
  title: "Free Digital Footprint report | Terramore",
  description:
    "Get a free written report on your website, socials, ads, and reviews. About a minute to request. In your inbox in under 5 minutes.",
}

export default function ReportPage() {
  return (
    <div className="min-h-screen bg-cream">
      <DigitalFootprintLanding />
      <SiteFooter />
    </div>
  )
}
