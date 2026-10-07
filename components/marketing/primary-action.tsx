import { BookingLink } from "@/components/booking-popup"
import { ReportPopupLink } from "@/components/report-popup"
import type { CtaId } from "@/lib/funnel-taxonomy"

/**
 * The /marketing primary action, one slot used by the hero and the closing section.
 *
 * Today: the free Digital Footprint report (filled). The hero adds "Or book a 30-minute call" as a child
 * (`MarketingSecondaryAction`). Next: the site-wide business lookup ("[Enter your website] [Check my business]")
 * replaces `PrimaryControl` only, taking the same `ctaId`. The slot is already sized for it: full width up to 36rem,
 * the control row wraps, and below `sm` the controls stack. Section layouts, the secondary action, the helper line and
 * the CTA ids stay as they are. Callers pass literal ids (`ctaId="marketing_hero_report"`) so verify-funnel can see them.
 */

const PRIMARY =
  "inline-flex min-h-12 w-full items-center justify-center rounded-full bg-brand px-6 text-[16px] font-medium text-white transition-colors hover:bg-brand-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 sm:w-auto"

/** The control the business lookup will replace. */
function PrimaryControl({ ctaId }: { ctaId: CtaId }) {
  return (
    <ReportPopupLink direct ctaId={ctaId} className={PRIMARY}>
      {/* Under 360 px the full label wraps inside the pill; the short form still names the destination. */}
      <span className="min-[360px]:hidden">Get my free report</span>
      <span className="hidden min-[360px]:inline">Get my free Digital Footprint report</span>
    </ReportPopupLink>
  )
}

export function MarketingPrimaryAction({
  ctaId,
  helper,
  children,
}: {
  /** Report destination id: `marketing_<placement>_report`. */
  ctaId: CtaId
  /** One reassurance line under the controls. */
  helper?: string
  /** The secondary action, if any (MarketingSecondaryAction). */
  children?: React.ReactNode
}) {
  return (
    <div className="w-full max-w-xl">
      <div className="flex flex-col items-stretch gap-x-5 gap-y-2 sm:flex-row sm:flex-wrap sm:items-center">
        <PrimaryControl ctaId={ctaId} />
        {children}
      </div>
      {helper ? <p className="mt-3 text-center text-[14px] text-slate-600 sm:text-left">{helper}</p> : null}
    </div>
  )
}

/** "Or book a 30-minute call": the text-link secondary beside the primary. */
export function MarketingSecondaryAction({ ctaId }: { ctaId: CtaId }) {
  return (
    <BookingLink
      source="marketing"
      ctaId={ctaId}
      className="inline-flex min-h-11 items-center justify-center text-[16px] font-medium text-ink underline underline-offset-4 hover:text-brand"
    >
      Or book a 30-minute call
    </BookingLink>
  )
}
