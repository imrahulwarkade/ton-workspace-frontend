'use client'

import { Check, Copy, Star } from 'lucide-react'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'
import { accentTile } from '@/lib/constants/accents'
import { APP_TYPE_LABELS } from '@/lib/constants/appTypes'
import { cn } from '@/lib/utils/cn'
import { CATALOG_ICONS } from '@/modules/catalog/components/catalogIcons'
import type { ResolvedCatalogApp } from '@/modules/catalog/types'
import { useToggleFavorite } from '@/modules/favorites/hooks/useFavorites'

type AppTileProps = {
  app: ResolvedCatalogApp
}

export function AppTile({ app }: AppTileProps) {
  const Icon = CATALOG_ICONS[app.icon]
  const toggleFavorite = useToggleFavorite()
  const { copied, copy } = useCopyToClipboard()

  return (
    <div className="group relative">
      <a
        href={app.href}
        target={app.openInNewTab ? '_blank' : undefined}
        rel={app.openInNewTab ? 'noreferrer' : undefined}
        className="focus-visible:ring-ring flex w-full flex-col items-center gap-2 rounded-sm border border-transparent px-2 py-3 text-center transition-[border-color,background-color,box-shadow] duration-150 hover:border-white/15 hover:bg-white/[0.035] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] focus-visible:ring-2 focus-visible:outline-none"
      >
        <span
          className={cn(
            'flex h-14 w-14 items-center justify-center rounded-sm transition-transform duration-150 group-hover:scale-[1.04]',
            accentTile(app.accentClass)
          )}
        >
          <Icon className="h-6 w-6" aria-hidden />
        </span>
        <span className="group-hover:text-foreground text-[13px] font-medium tracking-[-0.02em] transition-colors duration-150">
          {app.name}
        </span>
        <span className="sr-only">
          {APP_TYPE_LABELS[app.type]}. {app.description}. Opens {app.href}
        </span>
      </a>

      <div className="absolute top-1.5 right-1.5 flex gap-1 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100">
        <button
          type="button"
          className="bg-background/90 text-muted-foreground hover:text-foreground rounded-md p-1"
          aria-label={
            app.isFavorite ? 'Remove from favorites' : 'Add to favorites'
          }
          onClick={() => toggleFavorite.mutate(app.id)}
        >
          <Star
            className={cn(
              'h-3.5 w-3.5',
              app.isFavorite && 'fill-amber-400 text-amber-400'
            )}
          />
        </button>
        <button
          type="button"
          className="bg-background/90 text-muted-foreground hover:text-foreground rounded-md p-1"
          aria-label="Copy URL"
          onClick={() => void copy(app.href)}
        >
          {copied ? (
            <Check className="h-3.5 w-3.5" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </button>
      </div>
    </div>
  )
}
