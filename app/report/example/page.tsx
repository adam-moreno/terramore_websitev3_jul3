import type { Metadata } from "next"
import { Suspense } from "react"
import { ExampleReportShell, type SampleKind } from "@/components/example-report-shell"

export const metadata: Metadata = {
  title: "Sample Digital Footprint report | Terramore",
  description:
    "Sample Digital Footprint reports for ecommerce (Northline Atelier) and a service business (Ridgeview Home Services). Illustrative demos — not live client files.",
}

export default async function ExampleReportPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string; sample?: string }>
}) {
  const params = await searchParams
  const initialSample: SampleKind = params.sample === "service" ? "service" : "ecommerce"

  return (
    <div className="min-h-screen bg-cream">
      <Suspense
        fallback={
          <div className="page-shell pt-6 md:pt-10">
            <p className="text-[14px] text-ink/50">Loading sample…</p>
          </div>
        }
      >
        <ExampleReportShell sent={params.sent === "1"} initialSample={initialSample} />
      </Suspense>
    </div>
  )
}
