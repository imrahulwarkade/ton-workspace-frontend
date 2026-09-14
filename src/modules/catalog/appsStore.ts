'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CATALOG_APPS } from '@/modules/catalog/data/apps'
import { mergeCatalogApps } from '@/modules/catalog/services/catalogService'
import type { CatalogApp } from '@/modules/catalog/types'

type CatalogAppsState = {
  customApps: CatalogApp[]
  overrides: Record<string, Partial<CatalogApp>>
  hiddenIds: string[]
  addApp: (app: CatalogApp) => void
  updateApp: (id: string, patch: Partial<CatalogApp>) => void
  removeApp: (id: string) => void
}

export const useCatalogAppsStore = create<CatalogAppsState>()(
  persist(
    (set, get) => ({
      customApps: [],
      overrides: {},
      hiddenIds: [],
      addApp: (app) =>
        set({ customApps: [...get().customApps, { ...app, isCustom: true }] }),
      updateApp: (id, patch) => {
        const custom = get().customApps
        if (custom.some((app) => app.id === id)) {
          set({
            customApps: custom.map((app) =>
              app.id === id ? { ...app, ...patch, id: app.id } : app
            ),
          })
          return
        }
        set({
          overrides: {
            ...get().overrides,
            [id]: { ...get().overrides[id], ...patch },
          },
        })
      },
      removeApp: (id) => {
        if (get().customApps.some((app) => app.id === id)) {
          set({ customApps: get().customApps.filter((app) => app.id !== id) })
          return
        }
        set({ hiddenIds: [...new Set([...get().hiddenIds, id])] })
      },
    }),
    { name: 'toneop-workspace-catalog-apps' }
  )
)

export function listManagedCatalogApps(): CatalogApp[] {
  const { customApps, overrides, hiddenIds } = useCatalogAppsStore.getState()
  return mergeCatalogApps(customApps, overrides, hiddenIds)
}

export function isSeedApp(id: string): boolean {
  return CATALOG_APPS.some((app) => app.id === id)
}
