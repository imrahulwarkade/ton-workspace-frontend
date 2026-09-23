'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  FolderKanban,
  LayoutDashboard,
  LayoutGrid,
  Link2,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils/cn'
import { useCurrentUser } from '@/modules/auth'
import { WorkspaceBrand } from '@/components/layout/WorkspaceBrand'

const NAV = [
  { href: '/', label: 'Home', icon: LayoutDashboard },
  { href: '/dashboards', label: 'Dashboards', icon: FolderKanban },
  { href: '/apps', label: 'Apps', icon: LayoutGrid },
] as const

type WorkspaceSidebarProps = {
  collapsed: boolean
  onToggle: () => void
}

export function WorkspaceSidebar({
  collapsed,
  onToggle,
}: WorkspaceSidebarProps) {
  const pathname = usePathname()
  const { user } = useCurrentUser()

  return (
    <aside
      className={cn(
        'workspace-sidebar sticky top-0 flex h-screen shrink-0 flex-col transition-[width]',
        collapsed ? 'w-[72px]' : 'w-[232px]'
      )}
    >
      <div className="flex items-center justify-between gap-2 px-3 py-5">
        <Link href="/" className="min-w-0">
          <WorkspaceBrand compact={collapsed} />
        </Link>
        <Button
          size="icon"
          variant="ghost"
          className="shrink-0"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          onClick={onToggle}
        >
          {collapsed ? (
            <PanelLeftOpen className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
        </Button>
      </div>
      <nav className="flex flex-1 flex-col gap-1 px-2">
        {NAV.map((item) => {
          const active =
            item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              data-active={active}
              className={cn(
                'nav-link flex items-center gap-3 rounded-sm px-2.5 py-2',
                !active && 'hover:text-foreground hover:bg-white/5'
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {collapsed ? null : item.label}
            </Link>
          )
        })}
        {user?.role === 'admin' ? (
          <Link
            href="/admin/apps"
            title="Manage URLs"
            data-active={pathname.startsWith('/admin/apps')}
            className={cn(
              'nav-link flex items-center gap-3 rounded-sm px-2.5 py-2',
              !pathname.startsWith('/admin/apps') &&
                'hover:text-foreground hover:bg-white/5'
            )}
          >
            <Link2 className="h-4 w-4 shrink-0" />
            {collapsed ? null : 'Manage URLs'}
          </Link>
        ) : null}
      </nav>
    </aside>
  )
}
