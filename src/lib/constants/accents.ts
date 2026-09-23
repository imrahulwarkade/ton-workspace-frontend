export const ACCENT_CLASSES = [
  'bg-emerald-600',
  'bg-sky-600',
  'bg-orange-500',
  'bg-lime-600',
  'bg-teal-600',
  'bg-rose-500',
  'bg-amber-500',
  'bg-violet-600',
  'bg-green-600',
  'bg-red-500',
  'bg-indigo-600',
  'bg-cyan-600',
  'bg-yellow-500',
  'bg-blue-600',
  'bg-zinc-800',
] as const

export type AccentClass = (typeof ACCENT_CLASSES)[number]

const ACCENT_TILE_MAP: Record<string, string> = {
  'bg-emerald-600': 'accent-emerald',
  'bg-emerald-500': 'accent-emerald',
  'bg-sky-600': 'accent-sky',
  'bg-orange-500': 'accent-coral',
  'bg-orange-600': 'accent-flame',
  'bg-lime-600': 'accent-lime',
  'bg-teal-600': 'accent-teal',
  'bg-rose-500': 'accent-rose',
  'bg-amber-500': 'accent-amber',
  'bg-amber-600': 'accent-gold',
  'bg-violet-600': 'accent-violet',
  'bg-green-600': 'accent-green',
  'bg-red-500': 'accent-crimson',
  'bg-indigo-600': 'accent-indigo',
  'bg-cyan-600': 'accent-cyan',
  'bg-yellow-500': 'accent-sun',
  'bg-blue-600': 'accent-blue',
  'bg-zinc-800': 'accent-slate',
  'bg-neutral-800': 'accent-slate',
  'bg-secondary': 'accent-slate',
}

export function accentTile(accentClass?: string): string {
  return `accent-tile ${ACCENT_TILE_MAP[accentClass ?? ''] ?? 'accent-coral'}`
}
