'use client'

import { LayoutGrid, Pencil, Plus, Star, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useCatalogStore } from '@/modules/catalog/store'
import {
  DEFAULT_LAYOUT_PRESET,
  layoutPresetLabel,
} from '@/modules/dashboard/layouts'
import type { WorkspaceDashboard } from '@/modules/dashboard/types'

type DashboardToolbarProps = {
  dashboard: WorkspaceDashboard
  isEditing: boolean
  onToggleEdit: () => void
  onAddPanel: () => void
  onToggleStar: () => void
  onDelete: () => void
  onOpenLayout: () => void
  canDelete: boolean
}

export function DashboardToolbar({
  dashboard,
  isEditing,
  onToggleEdit,
  onAddPanel,
  onToggleStar,
  onDelete,
  onOpenLayout,
  canDelete,
}: DashboardToolbarProps) {
  const environment = useCatalogStore((state) => state.environment)
  const preset = dashboard.layoutPreset ?? DEFAULT_LAYOUT_PRESET

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="page-title">{dashboard.name}</h1>
          <Badge
            variant={environment === 'production' ? 'production' : 'staging'}
          >
            {environment === 'production' ? 'Production URLs' : 'Staging URLs'}
          </Badge>
          {isEditing ? <Badge variant="outline">Editing layout</Badge> : null}
        </div>
        <p className="page-subtitle">
          {dashboard.description ||
            'Choose a layout preset, or switch to Custom to drag and resize panels.'}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" variant="outline" onClick={onOpenLayout}>
          <LayoutGrid className="h-4 w-4" />
          {layoutPresetLabel(preset)}
          {preset === DEFAULT_LAYOUT_PRESET ? ' · Default' : ''}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={onToggleStar}
          aria-pressed={dashboard.starred}
        >
          <Star
            className={
              dashboard.starred ? 'fill-amber-400 text-amber-400' : undefined
            }
          />
          Star
        </Button>
        {canDelete ? (
          <Button size="sm" variant="outline" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        ) : null}
        {isEditing ? (
          <Button size="sm" variant="outline" onClick={onAddPanel}>
            <Plus className="h-4 w-4" />
            Add panel
          </Button>
        ) : null}
        <Button
          size="sm"
          variant={isEditing ? 'default' : 'outline'}
          onClick={onToggleEdit}
        >
          <Pencil className="h-4 w-4" />
          {isEditing ? 'Done' : 'Edit'}
        </Button>
      </div>
    </div>
  )
}
