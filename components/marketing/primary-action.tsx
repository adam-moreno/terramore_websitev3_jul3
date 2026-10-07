import { BookingLink } from "@/components/booking-popup"
import { BusinessLookup, LookupBookButton, LookupReportButton } from "@/components/business-lookup"
import type { CtaId } from "@/lib/funnel-taxonomy"

/**
 * The /marketing primary action, one slot used by the hero and the closing section: the free business lookup
 * ("Your website [ … ] [Check my business]"), then the secondary action passed as children. The lookup's own next
 * steps (full report by email, or a call) carry the marketing_lookup_* ids. Callers pass literal CTA ids
 * (`ctaId="marketing_hero_report"`) so verify-funnel can see them.
 */
export function MarketingPrimaryAction({
  ctaId,
  helper,
  children,
}: {
  /** The lookup's CTA id (report destination): `marketing_<placement>_report`. */
  ctaId: CtaId
  /** One reassurance line under the field. */
  helper?: string
  /** The secondary action, if any (MarketingSecondaryAction). */
  children?: React.ReactNode
}) {
  return (
    <div className="w-full max-w-xl">
      <BusinessLookup
        ctaId={ctaId}
        source="marketing"
        helper={helper}
        secondary={children}
        next={
          <>
            <LookupReportButton ctaId="marketing_lookup_report" />
            <LookupBookButton ctaId="marketing_lookup_book" />
          </>
        }
      />
    </div>
  )
}

/** "Or book a 30-minute call": the text-link secondary under the lookup. */
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
