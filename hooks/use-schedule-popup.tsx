"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"

export function useSchedulePopup() {
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setIsPopupOpen(false)
  }, [pathname])

  return {
    isPopupOpen,
    setIsPopupOpen,
  }
}
