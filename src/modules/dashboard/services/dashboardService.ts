import {
  DEFAULT_LAYOUT_PRESET,
  LAYOUT_PRESETS,
  layoutFromPreset,
  type NamedLayoutPreset,
} from '@/modules/dashboard/layouts'
import {
  DEFAULT_PANEL_SIZE,
  type DashboardPanel,
  type GridItem,
  type WorkspaceDashboard,
} from '@/modules/dashboard/types'

export function createPanelId(): string {
  return `panel-${crypto.randomUUID()}`
}

export function createDashboardId(): string {
  return `dash-${crypto.randomUUID()}`
}

export function nextLayoutItem(
  layout: GridItem[],
  panelId: string,
  preset: NamedLayoutPreset | 'custom' = DEFAULT_LAYOUT_PRESET
): GridItem {
  const config =
    preset === 'custom' ? DEFAULT_PANEL_SIZE : LAYOUT_PRESETS[preset]
  const maxY = layout.reduce((max, item) => Math.max(max, item.y + item.h), 0)
  return {
    i: panelId,
    x: 0,
    y: maxY,
    w: config.w,
    h: config.h,
    minW: config.minW,
    minH: config.minH,
  }
}

export function buildDefaultDashboard(
  apps: Array<{ id: string; name: string }>
): WorkspaceDashboard {
  const panels: DashboardPanel[] = apps.map((app) => ({
    id: app.id,
    kind: 'app',
    title: app.name,
    appId: app.id,
  }))
  const now = Date.now()

  return {
    id: 'my-workspace',
    name: 'My Workspace',
    description: 'Your ToneOp tools, arranged the way you work.',
    starred: true,
    panels,
    layout: layoutFromPreset(
      apps.map((app) => app.id),
      DEFAULT_LAYOUT_PRESET
    ),
    layoutPreset: DEFAULT_LAYOUT_PRESET,
    createdAt: now,
    updatedAt: now,
  }
}
