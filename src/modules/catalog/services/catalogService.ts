import { CATALOG_APPS } from '@/modules/catalog/data/apps'
import type { CatalogApp } from '@/modules/catalog/types'

export function slugifyAppId(name: string): string {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  return `custom-${slug || 'app'}-${Date.now().toString(36)}`
}

export function mergeCatalogApps(
  customApps: CatalogApp[],
  overrides: Record<string, Partial<CatalogApp>>,
  hiddenIds: string[]
): CatalogApp[] {
  const hidden = new Set(hiddenIds)
  const seeded = CATALOG_APPS.filter((app) => !hidden.has(app.id)).map(
    (app) => ({
      ...app,
      ...overrides[app.id],
      id: app.id,
      isCustom: false,
    })
  )

  return [...seeded, ...customApps.map((app) => ({ ...app, isCustom: true }))]
}

export function getMergedAppById(
  apps: CatalogApp[],
  id: string
): CatalogApp | undefined {
  return apps.find((app) => app.id === id)
}
