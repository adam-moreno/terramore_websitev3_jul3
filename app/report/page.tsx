import type { Metadata } from "next"
import { DigitalFootprintLanding } from "@/components/digital-footprint-landing"

export const metadata: Metadata = {
  title: "Free Digital Footprint report | Terramore",
  description:
    "Get a free written report on your website, socials, ads, and reviews. About a minute to request. In your inbox in minutes.",
}

export default function ReportPage() {
  return (
    <div className="min-h-screen bg-cream">
      <DigitalFootprintLanding />
    </div>
  )
}
