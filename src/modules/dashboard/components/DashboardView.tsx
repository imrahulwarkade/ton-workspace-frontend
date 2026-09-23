'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useHydrated } from '@/hooks/useHydrated'
import { useCurrentUser } from '@/modules/auth'
import { useCatalog } from '@/modules/catalog/hooks/useCatalog'
import { AddPanelDialog } from '@/modules/dashboard/components/AddPanelDialog'
import { DashboardCanvas } from '@/modules/dashboard/components/DashboardCanvas'
import { DashboardToolbar } from '@/modules/dashboard/components/DashboardToolbar'
import { LayoutPicker } from '@/modules/dashboard/components/LayoutPicker'
import { useDashboardStore } from '@/modules/dashboard/store'
import { CatalogSkeleton } from '@/modules/catalog/components/CatalogSkeleton'

type DashboardViewProps = {
  dashboardId?: string
}

export function DashboardView({ dashboardId }: DashboardViewProps) {
  const hydrated = useHydrated()
  const router = useRouter()
  const { user, isLoading } = useCurrentUser()
  const { roleApps } = useCatalog()
  const dashboards = useDashboardStore((state) => state.dashboards)
  const activeId = useDashboardStore((state) => state.activeId)
  const isEditing = useDashboardStore((state) => state.isEditing)
  const ensureDefault = useDashboardStore((state) => state.ensureDefault)
  const setActiveId = useDashboardStore((state) => state.setActiveId)
  const setEditing = useDashboardStore((state) => state.setEditing)
  const setLayout = useDashboardStore((state) => state.setLayout)
  const applyLayoutPreset = useDashboardStore(
    (state) => state.applyLayoutPreset
  )
  const markCustomLayout = useDashboardStore((state) => state.markCustomLayout)
  const resetToDefault = useDashboardStore((state) => state.resetToDefault)
  const addPanel = useDashboardStore((state) => state.addPanel)
  const removePanel = useDashboardStore((state) => state.removePanel)
  const toggleStar = useDashboardStore((state) => state.toggleStar)
  const removeDashboard = useDashboardStore((state) => state.removeDashboard)
  const [addOpen, setAddOpen] = useState(false)
  const [layoutOpen, setLayoutOpen] = useState(false)

  useEffect(() => {
    if (!hydrated || !user) return
    ensureDefault(roleApps.map((app) => ({ id: app.id, name: app.name })))
  }, [hydrated, user, roleApps, ensureDefault])

  const id = dashboardId ?? activeId ?? dashboards[0]?.id
  const dashboard = dashboards.find((item) => item.id === id)

  useEffect(() => {
    if (id) setActiveId(id)
  }, [id, setActiveId])

  if (!hydrated || isLoading) {
    return <CatalogSkeleton />
  }

  if (!user || !dashboard) {
    return <CatalogSkeleton />
  }

  return (
    <div className="space-y-6">
      <DashboardToolbar
        dashboard={dashboard}
        isEditing={isEditing}
        onToggleEdit={() => setEditing(!isEditing)}
        onAddPanel={() => setAddOpen(true)}
        onToggleStar={() => toggleStar(dashboard.id)}
        onOpenLayout={() => setLayoutOpen(true)}
        canDelete={dashboards.length > 1}
        onDelete={() => {
          removeDashboard(dashboard.id)
          router.push('/dashboards')
        }}
      />
      <DashboardCanvas
        dashboard={dashboard}
        isEditing={isEditing}
        onLayoutChange={(layout) => setLayout(dashboard.id, layout)}
        onCustomLayout={() => {
          markCustomLayout(dashboard.id)
          setEditing(true)
        }}
        onRemovePanel={(panelId) => removePanel(dashboard.id, panelId)}
      />
      <LayoutPicker
        open={layoutOpen}
        current={dashboard.layoutPreset ?? 'compact'}
        onOpenChange={setLayoutOpen}
        onSelectPreset={(preset) => applyLayoutPreset(dashboard.id, preset)}
        onSelectCustom={() => {
          markCustomLayout(dashboard.id)
          setEditing(true)
        }}
        onResetDefault={() => {
          resetToDefault(
            dashboard.id,
            roleApps.map((app) => ({ id: app.id, name: app.name }))
          )
          setEditing(false)
        }}
      />
      <AddPanelDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onAdd={(panel) => addPanel(dashboard.id, panel)}
      />
    </div>
  )
}
