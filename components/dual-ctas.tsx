import Link from "next/link"
import { ReportPopupLink } from "@/components/report-popup"

export function DualCtas({
  align = "left",
  className = "",
}: {
  align?: "left" | "center"
  className?: string
}) {
  return (
    <div
      className={`flex flex-col items-stretch gap-5 sm:flex-row sm:items-center sm:gap-4 ${
        align === "center" ? "sm:justify-center" : ""
      } ${className}`}
    >
      <Link
        href="/partner"
        className="inline-flex h-11 items-center justify-center rounded-full bg-brand px-5 text-[15px] font-medium text-white hover:bg-brand-hover"
      >
        Let&apos;s talk
      </Link>
      <ReportPopupLink
        label="Or get a free Digital Footprint report"
        className="inline-flex h-11 items-center justify-center px-2 text-[15px] font-medium text-ink/60 underline-offset-4 hover:text-ink hover:underline"
      />
    </div>
  )
}
