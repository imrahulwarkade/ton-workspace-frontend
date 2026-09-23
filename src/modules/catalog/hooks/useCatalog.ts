'use client'

import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { BRAND_LABELS, BRANDS } from '@/lib/constants/brands'
import { canRoleSeeAppType } from '@/lib/constants/roles'
import { useCurrentUser } from '@/modules/auth'
import { listCatalogApps } from '@/modules/catalog/services/catalogApi'
import { useCatalogStore } from '@/modules/catalog/store'
import type { CatalogGroup, ResolvedCatalogApp } from '@/modules/catalog/types'
import { useFavoriteIds } from '@/modules/favorites/hooks/useFavorites'

function matchesSearch(
  app: { name: string; description: string },
  query: string
) {
  if (!query) return true
  const haystack = `${app.name} ${app.description}`.toLowerCase()
  return haystack.includes(query.toLowerCase())
}

export const catalogKeys = {
  apps: ['catalog', 'apps'] as const,
}

export function useCatalog() {
  const { user } = useCurrentUser()
  const environment = useCatalogStore((state) => state.environment)
  const search = useCatalogStore((state) => state.search)
  const typeFilter = useCatalogStore((state) => state.typeFilter)
  const { favoriteIds } = useFavoriteIds()
  const appsQuery = useQuery({
    queryKey: catalogKeys.apps,
    queryFn: listCatalogApps,
    enabled: Boolean(user),
  })

  const allApps = useMemo(() => appsQuery.data ?? [], [appsQuery.data])

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
    isEmpty: !appsQuery.isLoading && visibleApps.length === 0,
    isLoading: appsQuery.isLoading || appsQuery.isPending,
  }
}
