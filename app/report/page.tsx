import type { Metadata } from "next"
import { DigitalFootprintLanding } from "@/components/digital-footprint-landing"

export const metadata: Metadata = {
  title: "Free Website Check for Small Businesses | Terramore.io",
  description:
    "Free website check for small business owners: your site, Google Maps listing, social profiles, and reviews. First results in about a minute, full report by email.",
  alternates: { canonical: "/report" },
}

export default function ReportPage() {
  return (
    <div className="min-h-screen bg-cream">
      <DigitalFootprintLanding />
    </div>
  )
}
