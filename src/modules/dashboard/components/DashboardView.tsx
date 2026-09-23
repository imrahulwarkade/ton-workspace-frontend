'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCurrentUser } from '@/modules/auth'
import { CatalogSkeleton } from '@/modules/catalog/components/CatalogSkeleton'
import { AddPanelDialog } from '@/modules/dashboard/components/AddPanelDialog'
import { DashboardCanvas } from '@/modules/dashboard/components/DashboardCanvas'
import { DashboardToolbar } from '@/modules/dashboard/components/DashboardToolbar'
import { LayoutPicker } from '@/modules/dashboard/components/LayoutPicker'
import {
  useAddDashboardPanel,
  useApplyDashboardPreset,
  useDashboards,
  useDeleteDashboard,
  useRemoveDashboardPanel,
  useResetDashboard,
  useToggleDashboardStar,
  useUpdateDashboardLayout,
} from '@/modules/dashboard/hooks/useDashboards'
import { useDashboardStore } from '@/modules/dashboard/store'

type DashboardViewProps = {
  dashboardId?: string
}

export function DashboardView({ dashboardId }: DashboardViewProps) {
  const router = useRouter()
  const { user, isLoading: userLoading } = useCurrentUser()
  const { dashboards, isLoading } = useDashboards()
  const isEditing = useDashboardStore((state) => state.isEditing)
  const setEditing = useDashboardStore((state) => state.setEditing)
  const updateLayout = useUpdateDashboardLayout()
  const applyPreset = useApplyDashboardPreset()
  const resetDashboard = useResetDashboard()
  const addPanel = useAddDashboardPanel()
  const removePanel = useRemoveDashboardPanel()
  const toggleStar = useToggleDashboardStar()
  const removeDashboard = useDeleteDashboard()
  const [addOpen, setAddOpen] = useState(false)
  const [layoutOpen, setLayoutOpen] = useState(false)

  const dashboard = dashboardId
    ? dashboards.find((item) => item.id === dashboardId)
    : dashboards[0]

  useEffect(() => {
    if (!userLoading && !isLoading && dashboardId && !dashboard) {
      router.replace('/dashboards')
    }
  }, [userLoading, isLoading, dashboardId, dashboard, router])

  if (userLoading || isLoading || !user || !dashboard) {
    return <CatalogSkeleton />
  }

  return (
    <div className="space-y-6">
      <DashboardToolbar
        dashboard={dashboard}
        isEditing={isEditing}
        onToggleEdit={() => setEditing(!isEditing)}
        onAddPanel={() => setAddOpen(true)}
        onToggleStar={() => toggleStar.mutate(dashboard.id)}
        onOpenLayout={() => setLayoutOpen(true)}
        canDelete={dashboards.length > 1}
        onDelete={() => {
          void removeDashboard.mutateAsync(dashboard.id).then(() => {
            setEditing(false)
            router.push('/dashboards')
          })
        }}
      />
      <DashboardCanvas
        dashboard={dashboard}
        isEditing={isEditing}
        onLayoutChange={(layout) =>
          updateLayout.mutate({
            id: dashboard.id,
            layout,
            layoutPreset: 'custom',
          })
        }
        onCustomLayout={() => setEditing(true)}
        onRemovePanel={(panelId) =>
          removePanel.mutate({ id: dashboard.id, panelId })
        }
      />
      <LayoutPicker
        open={layoutOpen}
        current={dashboard.layoutPreset ?? 'compact'}
        onOpenChange={setLayoutOpen}
        onSelectPreset={(preset) =>
          applyPreset.mutate({ id: dashboard.id, layoutPreset: preset })
        }
        onSelectCustom={() => {
          applyPreset.mutate({ id: dashboard.id, layoutPreset: 'custom' })
          setEditing(true)
        }}
        onResetDefault={() => {
          resetDashboard.mutate(dashboard.id)
          setEditing(false)
        }}
      />
      <AddPanelDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onAdd={(panel) => addPanel.mutate({ id: dashboard.id, panel })}
      />
    </div>
  )
}
