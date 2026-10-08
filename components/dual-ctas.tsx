import { BookingLink } from "@/components/booking-popup"
import { CheckMyBusinessLink } from "@/components/business-lookup"
import type { CtaId } from "@/lib/funnel-taxonomy"

/**
 * Search-first pair (docs/acquisition/SEARCH_FIRST_ROUTE_AUDIT.md): "Check my business" leads to the free lookup, and
 * booking stays one line below it. `ctaId` names the spot (lib/funnel-taxonomy.ts).
 */
export function DualCtas({
  ctaId,
  align = "left",
  className = "",
}: {
  ctaId: CtaId
  align?: "left" | "center"
  className?: string
}) {
  return (
    <div
      className={`flex flex-col items-stretch gap-5 sm:flex-row sm:items-center sm:gap-4 ${
        align === "center" ? "sm:justify-center" : ""
      } ${className}`}
    >
      <CheckMyBusinessLink
        ctaId={ctaId}
        className="inline-flex h-11 items-center justify-center rounded-full bg-brand px-5 text-[15px] font-medium text-white hover:bg-brand-hover"
      />
      <BookingLink
        label="Or talk with us"
        className="inline-flex h-11 items-center justify-center px-2 text-[15px] font-medium text-ink/70 underline-offset-4 hover:text-ink hover:underline"
      />
    </div>
  )
}
