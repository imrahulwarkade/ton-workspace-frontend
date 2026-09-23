import { SearchX } from 'lucide-react'

export function CatalogEmptyState() {
  return (
    <div className="border-border flex flex-col items-center justify-center rounded-sm border border-dashed px-6 py-16 text-center">
      <SearchX className="text-muted-foreground mb-3 h-8 w-8" aria-hidden />
      <h2 className="text-base font-medium tracking-[-0.02em]">
        No apps match
      </h2>
      <p className="text-muted-foreground mt-1 max-w-sm text-sm">
        Try another search, switch environment, or clear the type filter.
      </p>
    </div>
  )
}
