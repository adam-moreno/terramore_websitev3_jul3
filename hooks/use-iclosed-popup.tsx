"use client"

import { useState } from "react"

export function useIClosedPopup() {
  const [isOpen, setIsOpen] = useState(false)

  const openPopup = () => setIsOpen(true)
  const closePopup = () => setIsOpen(false)

  return {
    isOpen,
    openPopup,
    closePopup
  }
} 