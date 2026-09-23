'use client'

import { useMemo } from 'react'
import { BRAND_LABELS, BRANDS } from '@/lib/constants/brands'
import { canRoleSeeAppType } from '@/lib/constants/roles'
import { useCurrentUser } from '@/modules/auth'
import { useCatalogAppsStore } from '@/modules/catalog/appsStore'
import { mergeCatalogApps } from '@/modules/catalog/services/catalogService'
import { useCatalogStore } from '@/modules/catalog/store'
import type { CatalogGroup, ResolvedCatalogApp } from '@/modules/catalog/types'
import { useFavoritesStore } from '@/modules/favorites'

function matchesSearch(
  app: { name: string; description: string },
  query: string
) {
  if (!query) return true
  const haystack = `${app.name} ${app.description}`.toLowerCase()
  return haystack.includes(query.toLowerCase())
}

export function useCatalog() {
  const { user } = useCurrentUser()
  const environment = useCatalogStore((state) => state.environment)
  const search = useCatalogStore((state) => state.search)
  const typeFilter = useCatalogStore((state) => state.typeFilter)
  const favoriteIds = useFavoritesStore((state) => state.favoriteIds)
  const customApps = useCatalogAppsStore((state) => state.customApps)
  const overrides = useCatalogAppsStore((state) => state.overrides)
  const hiddenIds = useCatalogAppsStore((state) => state.hiddenIds)

  const allApps = useMemo(
    () => mergeCatalogApps(customApps, overrides, hiddenIds),
    [customApps, overrides, hiddenIds]
  )

  const visibleApps = useMemo(() => {
    if (!user) return []

    return allApps
      .filter((app) => canRoleSeeAppType(user.role, app.type))
      .filter((app) => typeFilter === 'all' || app.type === typeFilter)
      .filter((app) => matchesSearch(app, search))
      .map<ResolvedCatalogApp>((app) => ({
        ...app,
        environment,
        href: environment === 'production' ? app.productionUrl : app.stagingUrl,
        isFavorite: favoriteIds.includes(app.id),
      }))
  }, [user, allApps, environment, search, typeFilter, favoriteIds])

  const roleApps = useMemo(() => {
    if (!user) return []
    return allApps.filter((app) => canRoleSeeAppType(user.role, app.type))
  }, [user, allApps])

  const favorites = useMemo(
    () => visibleApps.filter((app) => app.isFavorite),
    [visibleApps]
  )

  const groups = useMemo<CatalogGroup[]>(() => {
    return BRANDS.map((brand) => ({
      brand,
      label: BRAND_LABELS[brand],
      apps: visibleApps.filter((app) => app.brand === brand),
    })).filter((group) => group.apps.length > 0)
  }, [visibleApps])

  return {
    environment,
    search,
    typeFilter,
    allApps,
    roleApps,
    visibleApps,
    favorites,
    groups,
    isEmpty: visibleApps.length === 0,
  }
}
