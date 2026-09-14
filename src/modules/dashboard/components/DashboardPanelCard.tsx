'use client'

import { ExternalLink, GripVertical, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils/cn'
import { accentTile } from '@/lib/constants/accents'
import { CATALOG_ICONS } from '@/modules/catalog/components/catalogIcons'
import { useCatalog } from '@/modules/catalog/hooks/useCatalog'
import {
  CardBody,
  CompactBody,
  ListBody,
} from '@/modules/dashboard/components/DashboardPanelBodies'
import type { PanelDensity } from '@/modules/dashboard/layouts'
import type { DashboardPanel } from '@/modules/dashboard/types'

type DashboardPanelCardProps = {
  panel: DashboardPanel
  density: PanelDensity
  isEditing: boolean
  onRemove: () => void
}

export function DashboardPanelCard({
  panel,
  density,
  isEditing,
  onRemove,
}: DashboardPanelCardProps) {
  const { roleApps, environment } = useCatalog()
  const app = panel.appId
    ? roleApps.find((item) => item.id === panel.appId)
    : undefined
  const href =
    panel.kind === 'custom'
      ? panel.customUrl
      : environment === 'production'
        ? app?.productionUrl
        : app?.stagingUrl
  const description =
    panel.kind === 'custom' ? panel.customDescription : app?.description
  const Icon = app ? CATALOG_ICONS[app.icon] : ExternalLink
  const accent = accentTile(app?.accentClass)
  const overlayHeader = density === 'compact' || density === 'list'
  const showHeader = isEditing || !overlayHeader

  return (
    <article
      className={cn(
        'bg-card border-border surface-panel group relative flex h-full overflow-hidden rounded-sm',
        density === 'compact' &&
          'min-w-0 flex-col items-center justify-center transition-[border-color,background-color,box-shadow] duration-150 hover:border-white/25 hover:bg-white/[0.035] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]',
        density === 'list' && 'flex-row items-center',
        density !== 'compact' && density !== 'list' && 'flex-col',
        isEditing && 'ring-primary/30 ring-1'
      )}
    >
      {showHeader ? (
        <header
          className={cn(
            'flex items-center gap-1',
            overlayHeader
              ? 'absolute top-1 right-1 left-1 z-10'
              : 'border-border w-full border-b px-2 py-1.5'
          )}
        >
          {isEditing ? (
            <span className="panel-drag-handle text-muted-foreground cursor-grab">
              <GripVertical className="h-4 w-4" />
            </span>
          ) : (
            <span className="w-4" />
          )}
          {overlayHeader ? (
            <span className="flex-1" />
          ) : (
            <h3 className="flex-1 truncate text-sm font-medium tracking-[-0.02em]">
              {panel.title}
            </h3>
          )}
          {isEditing ? (
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7"
              aria-label={`Remove ${panel.title}`}
              onClick={onRemove}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          ) : null}
        </header>
      ) : null}

      {density === 'compact' ? (
        <CompactBody
          title={panel.title}
          href={href}
          accent={accent}
          Icon={Icon}
        />
      ) : density === 'list' ? (
        <ListBody
          title={panel.title}
          description={description}
          href={href}
          accent={accent}
          Icon={Icon}
        />
      ) : (
        <CardBody
          density={density}
          description={description}
          href={href}
          openInNewTab={app?.openInNewTab !== false}
          accent={accent}
          Icon={Icon}
        />
      )}
    </article>
  )
}
