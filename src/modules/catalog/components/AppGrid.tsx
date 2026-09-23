import { AppTile } from '@/modules/catalog/components/AppTile'
import type { ResolvedCatalogApp } from '@/modules/catalog/types'

type AppGridProps = {
  apps: ResolvedCatalogApp[]
}

export function AppGrid({ apps }: AppGridProps) {
  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
      {apps.map((app) => (
        <AppTile key={app.id} app={app} />
      ))}
    </div>
  )
}
