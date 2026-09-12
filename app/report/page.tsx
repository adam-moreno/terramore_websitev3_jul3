import type { Metadata } from "next"
import { ReportBand } from "@/components/report-band"
import { SiteFooter } from "@/components/site-footer"

export const metadata: Metadata = {
  title: "Free Digital Footprint report | Terramore",
  description:
    "We read your site, ads, Maps, and listings and write what is working, what is leaking, and what we would fix first. Free. In your inbox in two to three business days.",
}

export default function ReportPage() {
  return (
    <div className="min-h-screen bg-cream">
      <ReportBand />
      <SiteFooter />
    </div>
  )
}
