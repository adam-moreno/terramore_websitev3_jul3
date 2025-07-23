"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"

export function useSchedulePopup() {
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    // Reset popup state when navigating to a new page
    setIsPopupOpen(false)

    // Auto-open popup after 5.5 seconds on any page load or navigation
    const timer = setTimeout(() => {
      setIsPopupOpen(true)
    }, 5500)

    return () => clearTimeout(timer)
  }, [pathname]) // Trigger effect when pathname changes

  return {
    isPopupOpen,
    setIsPopupOpen,
  }
}
