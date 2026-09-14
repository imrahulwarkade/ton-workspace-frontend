'use client'

import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useCatalogStore } from '@/modules/catalog/store'

export function CatalogSearch() {
  const search = useCatalogStore((state) => state.search)
  const setSearch = useCatalogStore((state) => state.setSearch)

  return (
    <div className="relative">
      <Search
        className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
        aria-hidden
      />
      <Input
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search dashboards, landing pages, tools…"
        aria-label="Search apps"
        className="surface-glass h-10 rounded-sm pl-10"
      />
    </div>
  )
}
