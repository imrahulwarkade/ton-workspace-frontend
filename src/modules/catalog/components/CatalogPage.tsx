'use client'

import { AppGrid } from '@/modules/catalog/components/AppGrid'
import { CatalogEmptyState } from '@/modules/catalog/components/CatalogEmptyState'
import { CatalogSkeleton } from '@/modules/catalog/components/CatalogSkeleton'
import { TypeFilter } from '@/modules/catalog/components/TypeFilter'
import { useCatalog } from '@/modules/catalog/hooks/useCatalog'

export function CatalogPage() {
  const { groups, favorites, isEmpty, isLoading } = useCatalog()

  if (isLoading) {
    return <CatalogSkeleton />
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="page-title">Apps</h1>
          <p className="page-subtitle">
            Library of staging and production URLs. Star the ones you use every
            day, then pin them onto a dashboard.
          </p>
        </div>
        <TypeFilter />
      </div>

      {isEmpty ? <CatalogEmptyState /> : null}

      {!isEmpty && favorites.length > 0 ? (
        <section className="space-y-3">
          <h2 className="section-label">Your favorites</h2>
          <AppGrid apps={favorites} />
        </section>
      ) : null}

      {groups.map((group) => (
        <section key={group.brand} className="space-y-3">
          <h2 className="section-label">{group.label}</h2>
          <AppGrid apps={group.apps} />
        </section>
      ))}
    </div>
  )
}
