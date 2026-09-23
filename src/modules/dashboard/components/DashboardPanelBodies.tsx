import { ExternalLink } from 'lucide-react'
import type { ComponentType } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils/cn'
import type { PanelDensity } from '@/modules/dashboard/layouts'

type IconProp = ComponentType<{ className?: string }>

export function CompactBody({
  title,
  href,
  accent,
  Icon,
}: {
  title: string
  href?: string
  accent: string
  Icon: IconProp
}) {
  const content = (
    <>
      <span
        className={cn(
          'flex h-12 w-12 shrink-0 items-center justify-center rounded-sm transition-transform duration-150 group-hover:scale-[1.04]',
          accent
        )}
      >
        <Icon className="h-5 w-5" />
      </span>
      <span className="text-foreground/90 group-hover:text-foreground w-full min-w-0 px-1 text-center text-[12px] leading-tight font-medium tracking-[-0.02em] [overflow-wrap:anywhere] break-words transition-colors duration-150">
        {title}
      </span>
    </>
  )

  if (!href) {
    return (
      <div className="flex h-full w-full min-w-0 flex-1 flex-col items-center justify-center gap-1.5 self-stretch p-2">
        {content}
      </div>
    )
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="focus-visible:ring-ring flex h-full w-full min-w-0 flex-1 flex-col items-center justify-center gap-1.5 self-stretch p-2 transition-[background-color,transform] duration-150 outline-none focus-visible:ring-2 focus-visible:ring-inset"
    >
      {content}
    </a>
  )
}

export function ListBody({
  title,
  description,
  href,
  accent,
  Icon,
}: {
  title: string
  description?: string
  href?: string
  accent: string
  Icon: IconProp
}) {
  return (
    <div className="flex min-w-0 flex-1 items-center gap-3 px-3">
      <span
        className={cn(
          'flex h-9 w-9 shrink-0 items-center justify-center rounded-sm',
          accent
        )}
      >
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{title}</p>
        <p className="text-muted-foreground truncate text-xs">
          {description || href}
        </p>
      </div>
      {href ? (
        <Button asChild size="sm" variant="outline">
          <a href={href} target="_blank" rel="noreferrer">
            Open
          </a>
        </Button>
      ) : null}
    </div>
  )
}

export function CardBody({
  density,
  description,
  href,
  openInNewTab,
  accent,
  Icon,
}: {
  density: PanelDensity
  description?: string
  href?: string
  openInNewTab: boolean
  accent: string
  Icon: IconProp
}) {
  return (
    <div className="flex flex-1 flex-col gap-3 p-3">
      <div className="flex items-start gap-3">
        <span
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-sm',
            accent
          )}
        >
          <Icon className="h-5 w-5" />
        </span>
        <p className="text-muted-foreground line-clamp-3 text-xs">
          {description || 'Custom shortcut'}
        </p>
      </div>
      {density === 'spacious' && href ? (
        <Button asChild size="sm" className="mt-auto w-full">
          <a
            href={href}
            target={openInNewTab ? '_blank' : undefined}
            rel="noreferrer"
          >
            Open
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </Button>
      ) : href ? (
        <a
          href={href}
          target={openInNewTab ? '_blank' : undefined}
          rel="noreferrer"
          className="text-primary mt-auto text-xs font-medium"
        >
          Open
        </a>
      ) : (
        <p className="text-muted-foreground mt-auto text-xs">
          This app was removed from the catalog.
        </p>
      )}
    </div>
  )
}
