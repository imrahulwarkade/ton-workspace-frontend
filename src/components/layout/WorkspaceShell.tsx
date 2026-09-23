'use client'

import { useState, type ReactNode } from 'react'
import { CatalogSearch, EnvironmentToggle } from '@/modules/catalog'
import { UserMenu } from '@/modules/auth'
import { WorkspaceSidebar } from '@/components/layout/WorkspaceSidebar'

export function WorkspaceShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="flex min-h-screen">
      <WorkspaceSidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((value) => !value)}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="workspace-header sticky top-0 z-20 flex items-center gap-3 px-4 py-3">
          <div className="min-w-0 flex-1">
            <CatalogSearch />
          </div>
          <EnvironmentToggle />
          <UserMenu />
        </header>
        <main className="flex-1 overflow-auto px-4 py-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  )
}
