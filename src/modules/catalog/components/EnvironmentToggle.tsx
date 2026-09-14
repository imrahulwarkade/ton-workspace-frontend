'use client'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils/cn'
import { useCatalogStore } from '@/modules/catalog/store'
import type { WorkspaceEnvironment } from '@/types/environment'

const OPTIONS: { value: WorkspaceEnvironment; label: string }[] = [
  { value: 'staging', label: 'Staging' },
  { value: 'production', label: 'Production' },
]

export function EnvironmentToggle() {
  const environment = useCatalogStore((state) => state.environment)
  const setEnvironment = useCatalogStore((state) => state.setEnvironment)

  return (
    <div
      className="surface-glass inline-flex rounded-sm p-0.5"
      role="group"
      aria-label="Environment"
    >
      {OPTIONS.map((option) => {
        const isActive = environment === option.value
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => setEnvironment(option.value)}
            className={cn(
              'rounded-sm px-3 py-1 text-xs font-medium transition-colors',
              isActive
                ? 'bg-background text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}
            aria-pressed={isActive}
          >
            {option.label}
          </button>
        )
      })}
      <Badge
        variant={environment === 'production' ? 'production' : 'staging'}
        className="ml-1 hidden sm:inline-flex"
      >
        {environment === 'production' ? 'Live' : 'STG'}
      </Badge>
    </div>
  )
}
