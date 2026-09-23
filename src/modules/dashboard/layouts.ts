import type { GridItem } from '@/modules/dashboard/types'

export const LAYOUT_PRESET_IDS = [
  'compact',
  'comfortable',
  'spacious',
  'list',
] as const

export type NamedLayoutPreset = (typeof LAYOUT_PRESET_IDS)[number]
export type LayoutPreset = NamedLayoutPreset | 'custom'
export type PanelDensity = NamedLayoutPreset

export const DEFAULT_LAYOUT_PRESET: NamedLayoutPreset = 'compact'

type LayoutPresetConfig = {
  id: NamedLayoutPreset
  label: string
  description: string
  isDefault?: boolean
  columns: number
  w: number
  h: number
  minW: number
  minH: number
}

export const LAYOUT_PRESETS: Record<NamedLayoutPreset, LayoutPresetConfig> = {
  compact: {
    id: 'compact',
    label: 'Compact',
    description: 'Small icon tiles, 6 per row — default',
    isDefault: true,
    columns: 6,
    w: 2,
    h: 4,
    minW: 2,
    minH: 3,
  },
  comfortable: {
    id: 'comfortable',
    label: 'Comfortable',
    description: 'Medium tiles with a short description, 4 per row',
    columns: 4,
    w: 3,
    h: 4,
    minW: 2,
    minH: 3,
  },
  spacious: {
    id: 'spacious',
    label: 'Spacious',
    description: 'Large cards with an Open button, 3 per row',
    columns: 3,
    w: 4,
    h: 5,
    minW: 3,
    minH: 4,
  },
  list: {
    id: 'list',
    label: 'List',
    description: 'Full-width rows for scanning names and URLs',
    columns: 1,
    w: 12,
    h: 3,
    minW: 6,
    minH: 2,
  },
}

export function layoutPresetLabel(preset: LayoutPreset): string {
  if (preset === 'custom') return 'Custom'
  return LAYOUT_PRESETS[preset].label
}

export function layoutFromPreset(
  panelIds: string[],
  preset: NamedLayoutPreset
): GridItem[] {
  const config = LAYOUT_PRESETS[preset]
  return panelIds.map((id, index) => ({
    i: id,
    x: (index % config.columns) * config.w,
    y: Math.floor(index / config.columns) * config.h,
    w: config.w,
    h: config.h,
    minW: config.minW,
    minH: config.minH,
  }))
}

export function layoutsEqual(left: GridItem[], right: GridItem[]): boolean {
  if (left.length !== right.length) return false
  const serialize = (items: GridItem[]) =>
    [...items]
      .map((item) => `${item.i}:${item.x}:${item.y}:${item.w}:${item.h}`)
      .sort()
      .join('|')
  return serialize(left) === serialize(right)
}

export function densityForItem(
  preset: LayoutPreset,
  item: GridItem | undefined
): PanelDensity {
  if (preset !== 'custom') return preset
  if (!item) return 'comfortable'
  if (item.w >= 10) return 'list'
  if (item.w <= 2 || item.h <= 3) return 'compact'
  if (item.w <= 3) return 'comfortable'
  return 'spacious'
}
