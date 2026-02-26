'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

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
