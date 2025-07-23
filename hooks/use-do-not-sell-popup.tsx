"use client"

import { useState } from "react"

export function useDoNotSellPopup() {
  const [isOpen, setIsOpen] = useState(false)

  const openPopup = () => setIsOpen(true)
  const closePopup = () => setIsOpen(false)

  return {
    isOpen,
    openPopup,
    closePopup
  }
} 