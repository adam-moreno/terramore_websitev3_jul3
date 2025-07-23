"use client"

import { useState } from "react"

export function useFreeCoursesPopup() {
  const [isOpen, setIsOpen] = useState(false)

  const openPopup = () => setIsOpen(true)
  const closePopup = () => setIsOpen(false)

  return {
    isOpen,
    openPopup,
    closePopup
  }
} 