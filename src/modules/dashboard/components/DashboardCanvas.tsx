'use client'

import GridLayout, { useContainerWidth } from 'react-grid-layout'
import { useHydrated } from '@/hooks/useHydrated'
import { DashboardPanelCard } from '@/modules/dashboard/components/DashboardPanelCard'
import { densityForItem, layoutsEqual } from '@/modules/dashboard/layouts'
import {
  GRID_COLS,
  GRID_ROW_HEIGHT,
  DEFAULT_PANEL_SIZE,
} from '@/modules/dashboard/types'
import type { GridItem, WorkspaceDashboard } from '@/modules/dashboard/types'
import 'react-grid-layout/css/styles.css'

type LayoutLike = ReadonlyArray<{
  i: string
  x: number
  y: number
  w: number
  h: number
  minW?: number
  minH?: number
}>

type DashboardCanvasProps = {
  dashboard: WorkspaceDashboard
  isEditing: boolean
  onLayoutChange: (layout: GridItem[]) => void
  onCustomLayout: () => void
  onRemovePanel: (panelId: string) => void
}

function toGridItems(next: LayoutLike): GridItem[] {
  return next.map((item) => ({
    i: item.i,
    x: item.x,
    y: item.y,
    w: item.w,
    h: item.h,
    minW: item.minW ?? DEFAULT_PANEL_SIZE.minW,
    minH: item.minH ?? DEFAULT_PANEL_SIZE.minH,
  }))
}

export function DashboardCanvas({
  dashboard,
  isEditing,
  onLayoutChange,
  onCustomLayout,
  onRemovePanel,
}: DashboardCanvasProps) {
  const hydrated = useHydrated()
  const { width, containerRef, mounted } = useContainerWidth()
  const canResize = isEditing && dashboard.layoutPreset === 'custom'

  const persistUserLayout = (next: LayoutLike, markCustom: boolean) => {
    const mapped = toGridItems(next)
    const changed = !layoutsEqual(mapped, dashboard.layout)
    if (changed) onLayoutChange(mapped)
    if (markCustom && changed && dashboard.layoutPreset !== 'custom') {
      onCustomLayout()
    }
  }

  if (!hydrated) {
    return (
      <div className="bg-muted/30 min-h-[320px] animate-pulse rounded-sm" />
    )
  }

  if (dashboard.panels.length === 0) {
    return (
      <div className="border-border flex min-h-[280px] items-center justify-center rounded-sm border border-dashed px-6 text-center">
        <p className="text-muted-foreground max-w-sm text-sm">
          This dashboard is empty. Turn on Edit and add a panel from the catalog
          or a custom URL.
        </p>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="min-h-[280px] w-full">
      {mounted && width > 0 ? (
        <GridLayout
          width={width}
          layout={dashboard.layout}
          gridConfig={{
            cols: GRID_COLS,
            rowHeight: GRID_ROW_HEIGHT,
            margin: [10, 10],
            containerPadding: [0, 0],
            maxRows: Number.POSITIVE_INFINITY,
          }}
          dragConfig={{
            enabled: isEditing,
            bounded: false,
            handle: '.panel-drag-handle',
            threshold: 3,
          }}
          resizeConfig={{
            enabled: canResize,
            handles: ['se'],
          }}
          onDragStop={(next) => persistUserLayout(next, true)}
          onResizeStop={(next) => persistUserLayout(next, true)}
        >
          {dashboard.panels.map((panel) => {
            const item = dashboard.layout.find((entry) => entry.i === panel.id)
            return (
              <div key={panel.id} className="h-full min-w-0">
                <DashboardPanelCard
                  panel={panel}
                  density={densityForItem(
                    dashboard.layoutPreset ?? 'compact',
                    item
                  )}
                  isEditing={isEditing}
                  onRemove={() => onRemovePanel(panel.id)}
                />
              </div>
            )
          })}
        </GridLayout>
      ) : null}
    </div>
  )
}
