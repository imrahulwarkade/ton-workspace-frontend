'use client'

import type { ReactNode } from 'react'
import { useCurrentUser } from '@/modules/auth'

export function AdminGate({ children }: { children: ReactNode }) {
  const { user, isLoading } = useCurrentUser()

  if (isLoading) {
    return (
      <p className="text-muted-foreground text-sm">Checking permissions…</p>
    )
  }

  if (user?.role !== 'admin') {
    return (
      <div className="border-border rounded-sm border border-dashed px-6 py-16 text-center">
        <h1 className="text-lg font-semibold">Admins only</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Managing catalog URLs is limited to the Workspace admin role.
        </p>
      </div>
    )
  }

  return children
}
