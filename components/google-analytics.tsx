'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { captureAttributionFromUrl } from '@/lib/attribution'

declare global {
  interface Window {
    dataLayer: unknown[]
    gtag: (...args: unknown[]) => void
  }
}

/**
 * Sends page_view to GA4 on client-side route change only. Initial page view is sent by gtag('config') in head.
 * This gives GA4 one page_view per page and understanding of each route.
 */
export function GoogleAnalytics() {
  const pathname = usePathname()
  const isFirstRun = useRef(true)

  useEffect(() => {
    // Keep gclid/UTMs for this tab on any landing page (not only when the report form opens),
    // so a later booking from a clean URL still carries the ad context. Runs before the gtag guard on purpose.
    captureAttributionFromUrl()
    if (typeof window === 'undefined' || !window.gtag) return
    if (isFirstRun.current) {
      isFirstRun.current = false
      return
    }
    window.gtag('event', 'page_view', {
      page_path: pathname || '/',
      page_title: document.title,
    })
  }, [pathname])

  return null
}
