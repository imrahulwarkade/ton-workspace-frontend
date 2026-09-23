'use client'

import type { ReactNode } from 'react'
import { QueryProvider } from '@/components/providers/QueryProvider'
import { TooltipProvider } from '@/components/ui/tooltip'

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <TooltipProvider>{children}</TooltipProvider>
    </QueryProvider>
  )
}
