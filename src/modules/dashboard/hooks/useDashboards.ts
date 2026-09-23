'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  addDashboardPanel,
  applyDashboardPreset,
  createDashboard,
  deleteDashboard,
  listDashboards,
  removeDashboardPanel,
  resetDashboard,
  toggleDashboardStar,
  updateDashboardLayout,
} from '@/modules/dashboard/services/dashboardApi'
import type { LayoutPreset } from '@/modules/dashboard/layouts'
import type {
  DashboardPanel,
  GridItem,
  WorkspaceDashboard,
} from '@/modules/dashboard/types'

export const dashboardKeys = {
  all: ['dashboards'] as const,
}

function setDashboards(
  queryClient: ReturnType<typeof useQueryClient>,
  dashboard: WorkspaceDashboard
) {
  queryClient.setQueryData<WorkspaceDashboard[]>(
    dashboardKeys.all,
    (current) => {
      if (!current) return [dashboard]
      return current.map((item) =>
        item.id === dashboard.id ? dashboard : item
      )
    }
  )
}

export function useDashboards() {
  const query = useQuery({
    queryKey: dashboardKeys.all,
    queryFn: listDashboards,
  })

  return {
    dashboards: query.data ?? [],
    isLoading: query.isLoading || query.isPending,
    isError: query.isError,
  }
}

export function useCreateDashboard() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createDashboard,
    onSuccess: (dashboard) => {
      queryClient.setQueryData<WorkspaceDashboard[]>(
        dashboardKeys.all,
        (current) => [...(current ?? []), dashboard]
      )
    },
  })
}

export function useToggleDashboardStar() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: toggleDashboardStar,
    onSuccess: (dashboard) => setDashboards(queryClient, dashboard),
  })
}

export function useDeleteDashboard() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteDashboard,
    onSuccess: (_void, id) => {
      queryClient.setQueryData<WorkspaceDashboard[]>(
        dashboardKeys.all,
        (current) => (current ?? []).filter((item) => item.id !== id)
      )
    },
  })
}

export function useUpdateDashboardLayout() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      layout,
      layoutPreset,
    }: {
      id: string
      layout: GridItem[]
      layoutPreset?: LayoutPreset
    }) => updateDashboardLayout(id, { layout, layoutPreset }),
    onSuccess: (dashboard) => setDashboards(queryClient, dashboard),
  })
}

export function useApplyDashboardPreset() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      layoutPreset,
    }: {
      id: string
      layoutPreset: LayoutPreset
    }) => applyDashboardPreset(id, layoutPreset),
    onSuccess: (dashboard) => setDashboards(queryClient, dashboard),
  })
}

export function useResetDashboard() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: resetDashboard,
    onSuccess: (dashboard) => setDashboards(queryClient, dashboard),
  })
}

export function useAddDashboardPanel() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      panel,
    }: {
      id: string
      panel: Omit<DashboardPanel, 'id'>
    }) => addDashboardPanel(id, panel),
    onSuccess: (dashboard) => setDashboards(queryClient, dashboard),
  })
}

export function useRemoveDashboardPanel() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, panelId }: { id: string; panelId: string }) =>
      removeDashboardPanel(id, panelId),
    onSuccess: (dashboard) => setDashboards(queryClient, dashboard),
  })
}
