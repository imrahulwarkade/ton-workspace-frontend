'use client'

import { APP_TYPE_LABELS, APP_TYPES } from '@/lib/constants/appTypes'
import { cn } from '@/lib/utils/cn'
import { useCatalogStore } from '@/modules/catalog/store'
import type { CatalogTypeFilter } from '@/modules/catalog/types'

const FILTERS: { value: CatalogTypeFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  ...APP_TYPES.map((type) => ({
    value: type,
    label: APP_TYPE_LABELS[type],
  })),
]

export function TypeFilter() {
  const typeFilter = useCatalogStore((state) => state.typeFilter)
  const setTypeFilter = useCatalogStore((state) => state.setTypeFilter)

  return (
    <div className="flex flex-wrap gap-2" role="tablist" aria-label="App type">
      {FILTERS.map((filter) => {
        const isActive = typeFilter === filter.value
        return (
          <button
            key={filter.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => setTypeFilter(filter.value)}
            className={cn(
              'rounded-sm border px-3 py-1.5 text-xs font-medium transition-colors',
              isActive
                ? 'border-primary bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground border-white/12 hover:border-white/25'
            )}
          >
            {filter.label}
          </button>
        )
      })}
    </div>
  )
}
