import type { AppType } from '@/lib/constants/appTypes'
import type { BrandId } from '@/lib/constants/brands'
import type { WorkspaceEnvironment } from '@/types/environment'

export const CATALOG_ICON_IDS = [
  'layoutDashboard',
  'contact',
  'utensils',
  'dumbbell',
  'graduationCap',
  'shoppingBag',
  'globe',
  'leaf',
  'heartPulse',
  'sparkles',
  'penTool',
  'hardDrive',
  'triangle',
  'cloudLightning',
  'activity',
  'kanban',
] as const

export type CatalogIconId = (typeof CATALOG_ICON_IDS)[number]

export type CatalogApp = {
  id: string
  name: string
  description: string
  brand: BrandId
  type: AppType
  icon: CatalogIconId
  accentClass: string
  stagingUrl: string
  productionUrl: string
  openInNewTab: boolean
  isCustom?: boolean
}

export type CatalogTypeFilter = AppType | 'all'

export type ResolvedCatalogApp = CatalogApp & {
  href: string
  environment: WorkspaceEnvironment
  isFavorite: boolean
}

export type CatalogGroup = {
  brand: BrandId
  label: string
  apps: ResolvedCatalogApp[]
}
