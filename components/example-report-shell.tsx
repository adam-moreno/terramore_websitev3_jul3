"use client"

import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { ExampleReport } from "@/components/example-report"
import { ExampleReportService } from "@/components/example-report-service"

export type SampleKind = "ecommerce" | "service"

function track(event: string, params?: Record<string, string>) {
  if (typeof window === "undefined") return
  const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag
  if (typeof gtag === "function") gtag("event", event, params)
}

export function ExampleReportShell({
  sent = false,
  initialSample = "ecommerce",
}: {
  sent?: boolean
  initialSample?: SampleKind
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const sampleParam = searchParams.get("sample")
  const sample: SampleKind =
    sampleParam === "service" || sampleParam === "ecommerce" ? sampleParam : initialSample

  const switchSample = (next: SampleKind) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("sample", next)
    if (sent) params.set("sent", "1")
    else params.delete("sent")
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    track("select_content", { content_type: "report_sample", content_id: next })
  }

  return (
    <div className="bg-cream pb-24">
      <div className="page-shell pt-6 md:pt-10">
        {sent ? (
          <div className="mb-6 rounded-2xl bg-white px-5 py-5 shadow-[0_8px_30px_rgba(15,30,46,0.04)]">
            <p className="text-[15px] font-semibold text-ink">Your report is on the way.</p>
            <p className="mt-1.5 text-[15px] leading-relaxed text-ink/70">
              We&apos;re preparing it now. It usually lands in your inbox within a few minutes. This sample shows the
              shape while you wait.
            </p>
            <Link
              href="/book"
              onClick={() => track("schedule", { cta_id: "report_sent_book" })}
              className="mt-4 inline-flex h-10 items-center justify-center rounded-full bg-brand px-5 text-[14px] font-medium text-white hover:bg-brand-hover"
            >
              Talk through my report
            </Link>
          </div>
        ) : null}

        <div
          role="tablist"
          aria-label="Sample report type"
          className="mb-6 inline-flex rounded-full border border-black/[0.08] bg-white p-1 shadow-[0_8px_30px_rgba(15,30,46,0.04)]"
        >
          <button
            type="button"
            role="tab"
            aria-selected={sample === "ecommerce"}
            onClick={() => switchSample("ecommerce")}
            className={`rounded-full px-4 py-2 text-[13px] font-medium transition ${
              sample === "ecommerce" ? "bg-ink text-cream" : "text-ink/55 hover:text-ink"
            }`}
          >
            Ecommerce
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={sample === "service"}
            onClick={() => switchSample("service")}
            className={`rounded-full px-4 py-2 text-[13px] font-medium transition ${
              sample === "service" ? "bg-ink text-cream" : "text-ink/55 hover:text-ink"
            }`}
          >
            Service business
          </button>
        </div>
      </div>

      {sample === "service" ? <ExampleReportService hideDisclosure={sent} /> : <ExampleReport hideDisclosure={sent} />}
    </div>
  )
}
