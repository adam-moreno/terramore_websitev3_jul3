'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { captureAttributionFromUrl } from '@/lib/attribution'

/**
 * Keeps gclid/UTMs in sessionStorage across client-side navigations.
 * SPA page_view is left to Google Enhanced Measurement / browser-history tracking
 * (gtag bootstrap already configs GA4 + Ads in the root layout).
 */
export function GoogleAnalytics() {
  const pathname = usePathname()

  useEffect(() => {
    // Keep gclid/UTMs for this tab on any landing page (not only when the report form opens),
    // so a later booking from a clean URL still carries the ad context.
    captureAttributionFromUrl()
  }, [pathname])

  return null
}
