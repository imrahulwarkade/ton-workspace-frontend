import type { LayoutPreset } from '@/modules/dashboard/layouts'

export type PanelKind = 'app' | 'custom'

export type DashboardPanel = {
  id: string
  kind: PanelKind
  title: string
  appId?: string
  customUrl?: string
  customDescription?: string
}

export type GridItem = {
  i: string
  x: number
  y: number
  w: number
  h: number
  minW: number
  minH: number
}

export type WorkspaceDashboard = {
  id: string
  name: string
  description: string
  starred: boolean
  panels: DashboardPanel[]
  layout: GridItem[]
  layoutPreset: LayoutPreset
  createdAt: number
  updatedAt: number
}

export const GRID_COLS = 12
export const GRID_ROW_HEIGHT = 36
export const DEFAULT_PANEL_SIZE = {
  w: 2,
  h: 4,
  minW: 2,
  minH: 3,
} as const
