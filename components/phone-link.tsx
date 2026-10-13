"use client"

import type { ReactNode } from "react"
import { trackFunnelEvent } from "@/lib/analytics"
import { PHONE_HREF } from "@/lib/contact"
import type { PHONE_PLACEMENTS } from "@/lib/funnel-taxonomy"

/**
 * Terramore's phone number as a link, counted as `phone_click` (GA4 only, never an Ads conversion) with where it sat.
 * The click says which page and spot drove a call; who called comes from the phone line (caller ID → TerraIQ lead).
 */
export function PhoneLink({
  placement,
  className,
  children,
  ariaLabel,
}: {
  placement: (typeof PHONE_PLACEMENTS)[number]
  className?: string
  children: ReactNode
  ariaLabel?: string
}) {
  return (
    <a href={PHONE_HREF} aria-label={ariaLabel} className={className} onClick={() => trackFunnelEvent("phone_click", { placement })}>
      {children}
    </a>
  )
}
