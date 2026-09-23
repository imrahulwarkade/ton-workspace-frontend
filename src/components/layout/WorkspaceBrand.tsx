import { LayoutGrid } from 'lucide-react'
import { env } from '@/lib/env'

export function WorkspaceBrand({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="brand-mark text-primary-foreground flex h-9 w-9 shrink-0 items-center justify-center rounded-sm">
        <LayoutGrid className="h-4 w-4" aria-hidden />
      </span>
      {compact ? null : (
        <div className="leading-tight">
          <p className="text-[15px] font-medium tracking-[-0.03em]">
            {env.NEXT_PUBLIC_APP_NAME}
          </p>
          <p className="text-muted-foreground mt-0.5 text-[11px] font-medium tracking-[0.08em]">
            Staff workspace
          </p>
        </div>
      )}
    </div>
  )
}
