"use client"

import { create } from "zustand"

interface RoadmapModalStore {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

export const useRoadmapModal = create<RoadmapModalStore>((set: any) => ({
  isOpen: false,
  setIsOpen: (isOpen: boolean) => set({ isOpen }),
})) 