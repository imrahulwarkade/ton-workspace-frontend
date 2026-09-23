'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Plus, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useHydrated } from '@/hooks/useHydrated'
import { useCurrentUser } from '@/modules/auth'
import { useCatalog } from '@/modules/catalog/hooks/useCatalog'
import { CreateDashboardDialog } from '@/modules/dashboard/components/CreateDashboardDialog'
import { useDashboardStore } from '@/modules/dashboard/store'
import { CatalogSkeleton } from '@/modules/catalog/components/CatalogSkeleton'

export function DashboardListPage() {
  const hydrated = useHydrated()
  const router = useRouter()
  const { user } = useCurrentUser()
  const { roleApps } = useCatalog()
  const dashboards = useDashboardStore((state) => state.dashboards)
  const ensureDefault = useDashboardStore((state) => state.ensureDefault)
  const createDashboard = useDashboardStore((state) => state.createDashboard)
  const toggleStar = useDashboardStore((state) => state.toggleStar)
  const [query, setQuery] = useState('')
  const [createOpen, setCreateOpen] = useState(false)

  useEffect(() => {
    if (!hydrated || !user) return
    ensureDefault(roleApps.map((app) => ({ id: app.id, name: app.name })))
  }, [hydrated, user, roleApps, ensureDefault])

  if (!hydrated) return <CatalogSkeleton />

  const filtered = dashboards.filter((dashboard) =>
    dashboard.name.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="page-title">Dashboards</h1>
          <p className="page-subtitle">
            Create canvases, then drag and resize panels the way you work.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4" />
          New dashboard
        </Button>
      </div>

      <Input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search dashboards"
        className="max-w-md"
      />

      <div className="data-table">
        <table className="w-full text-left text-sm">
          <thead>
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="hidden px-4 py-3 font-medium sm:table-cell">
                Panels
              </th>
              <th className="hidden px-4 py-3 font-medium md:table-cell">
                Updated
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((dashboard) => (
              <tr key={dashboard.id}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      aria-label={`Star ${dashboard.name}`}
                      onClick={() => toggleStar(dashboard.id)}
                      className="text-muted-foreground"
                    >
                      <Star
                        className={
                          dashboard.starred
                            ? 'h-4 w-4 fill-amber-400 text-amber-400'
                            : 'h-4 w-4'
                        }
                      />
                    </button>
                    <Link
                      href={`/dashboards/${dashboard.id}`}
                      className="font-medium hover:underline"
                    >
                      {dashboard.name}
                    </Link>
                  </div>
                </td>
                <td className="text-muted-foreground hidden px-4 py-3 sm:table-cell">
                  {dashboard.panels.length}
                </td>
                <td className="text-muted-foreground hidden px-4 py-3 md:table-cell">
                  {new Date(dashboard.updatedAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CreateDashboardDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreate={({ name, description }) => {
          const id = createDashboard(name, description)
          router.push(`/dashboards/${id}`)
        }}
      />
    </div>
  )
}
