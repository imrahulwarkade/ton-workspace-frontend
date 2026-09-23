'use client'

import { create } from 'zustand'

type DashboardUiState = {
  isEditing: boolean
  setEditing: (isEditing: boolean) => void
}

export const useDashboardStore = create<DashboardUiState>((set) => ({
  isEditing: false,
  setEditing: (isEditing) => set({ isEditing }),
}))
