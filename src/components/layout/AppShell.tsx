import type { ReactNode } from 'react'
import { Separator } from '@/components/ui/separator'

type AppShellProps = {
  brand: ReactNode
  search?: ReactNode
  actions?: ReactNode
  children: ReactNode
}

export function AppShell({ brand, search, actions, children }: AppShellProps) {
  return (
    <div className="flex min-h-full flex-col">
      <header className="border-border bg-background/90 sticky top-0 z-20 border-b backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:gap-6">
          <div className="flex items-center justify-between gap-3">
            {brand}
            <div className="flex items-center gap-2 md:hidden">{actions}</div>
          </div>
          <div className="min-w-0 flex-1">{search}</div>
          <div className="hidden items-center gap-2 md:flex">{actions}</div>
        </div>
      </header>
      <Separator />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-8">
        {children}
      </main>
    </div>
  )
}
