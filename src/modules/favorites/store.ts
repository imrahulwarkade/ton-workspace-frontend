'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type FavoritesState = {
  favoriteIds: string[]
  toggleFavorite: (appId: string) => void
  isFavorite: (appId: string) => boolean
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favoriteIds: [],
      toggleFavorite: (appId) => {
        const current = get().favoriteIds
        const next = current.includes(appId)
          ? current.filter((id) => id !== appId)
          : [...current, appId]
        set({ favoriteIds: next })
      },
      isFavorite: (appId) => get().favoriteIds.includes(appId),
    }),
    { name: 'toneop-workspace-favorites' }
  )
)
