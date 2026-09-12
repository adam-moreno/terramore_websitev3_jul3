import type { Metadata } from "next"
import { ExampleReport } from "@/components/example-report"
import { SiteFooter } from "@/components/site-footer"

export const metadata: Metadata = {
  title: "Sample Digital Footprint report | Terramore",
  description:
    "A full sample report for Northline Atelier, a small apparel brand. Names and numbers changed. See what your free report would look like.",
}

export default async function ExampleReportPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string }>
}) {
  const params = await searchParams

  return (
    <div className="min-h-screen bg-cream">
      <ExampleReport sent={params.sent === "1"} />
      <SiteFooter />
    </div>
  )
}
