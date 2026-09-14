'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CatalogTypeFilter } from '@/modules/catalog/types'
import type { WorkspaceEnvironment } from '@/types/environment'

type CatalogUiState = {
  environment: WorkspaceEnvironment
  search: string
  typeFilter: CatalogTypeFilter
  setEnvironment: (environment: WorkspaceEnvironment) => void
  setSearch: (search: string) => void
  setTypeFilter: (typeFilter: CatalogTypeFilter) => void
}

export const useCatalogStore = create<CatalogUiState>()(
  persist(
    (set) => ({
      environment: 'staging',
      search: '',
      typeFilter: 'all',
      setEnvironment: (environment) => set({ environment }),
      setSearch: (search) => set({ search }),
      setTypeFilter: (typeFilter) => set({ typeFilter }),
    }),
    {
      name: 'toneop-workspace-catalog-ui',
      partialize: (state) => ({ environment: state.environment }),
    }
  )
)
