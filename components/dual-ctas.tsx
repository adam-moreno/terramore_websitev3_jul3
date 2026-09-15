import { BookingLink } from "@/components/booking-popup"
import { ReportPopupLink } from "@/components/report-popup"

export function DualCtas({
  align = "left",
  className = "",
  variant = "dual",
}: {
  align?: "left" | "center"
  className?: string
  variant?: "dual" | "report"
}) {
  // The "report" variant shows a single, visually distinct gold button that opens the report popup.
  // It is the one clear action, used where a "Let's talk" button would compete for attention.
  if (variant === "report") {
    return (
      <div className={`flex ${align === "center" ? "justify-center" : ""} ${className}`}>
        <ReportPopupLink
          label="Get a free Digital Footprint report"
          className="inline-flex h-11 items-center justify-center rounded-full bg-gradient-to-b from-[var(--gold-from)] to-[var(--gold-to)] px-6 text-[15px] font-semibold text-white shadow-[0_10px_24px_-12px_rgba(198,136,9,0.6)] transition hover:brightness-[0.97]"
        />
      </div>
    )
  }

  return (
    <div
      className={`flex flex-col items-stretch gap-5 sm:flex-row sm:items-center sm:gap-4 ${
        align === "center" ? "sm:justify-center" : ""
      } ${className}`}
    >
      <BookingLink
        label="Let's talk"
        className="inline-flex h-11 items-center justify-center rounded-full bg-brand px-5 text-[15px] font-medium text-white hover:bg-brand-hover"
      />
      <ReportPopupLink
        label="Or get a free Digital Footprint report"
        className="inline-flex h-11 items-center justify-center px-2 text-[15px] font-medium text-ink/60 underline-offset-4 hover:text-ink hover:underline"
      />
    </div>
  )
}
