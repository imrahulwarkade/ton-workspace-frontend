import { fetchWithErrorHandling } from '@/lib/api/client'
import { API_CONFIG } from '@/lib/api/config'
import type { LayoutPreset } from '@/modules/dashboard/layouts'
import type {
  DashboardPanel,
  GridItem,
  WorkspaceDashboard,
} from '@/modules/dashboard/types'

export function listDashboards(): Promise<WorkspaceDashboard[]> {
  return fetchWithErrorHandling<WorkspaceDashboard[]>(
    API_CONFIG.ENDPOINTS.Dashboards.LIST
  )
}

export function createDashboard(payload: {
  name: string
  description?: string
}): Promise<WorkspaceDashboard> {
  return fetchWithErrorHandling<
    WorkspaceDashboard,
    { name: string; description?: string }
  >(API_CONFIG.ENDPOINTS.Dashboards.LIST, 'POST', payload)
}

export function patchDashboard(
  id: string,
  payload: Partial<Pick<WorkspaceDashboard, 'name' | 'description' | 'starred'>>
): Promise<WorkspaceDashboard> {
  return fetchWithErrorHandling(
    API_CONFIG.ENDPOINTS.Dashboards.DETAIL(id),
    'PATCH',
    payload
  )
}

export function deleteDashboard(id: string): Promise<void> {
  return fetchWithErrorHandling<void>(
    API_CONFIG.ENDPOINTS.Dashboards.DETAIL(id),
    'DELETE'
  )
}

export function toggleDashboardStar(id: string): Promise<WorkspaceDashboard> {
  return fetchWithErrorHandling<WorkspaceDashboard>(
    API_CONFIG.ENDPOINTS.Dashboards.STAR(id),
    'POST'
  )
}

export function updateDashboardLayout(
  id: string,
  payload: { layout: GridItem[]; layoutPreset?: LayoutPreset }
): Promise<WorkspaceDashboard> {
  return fetchWithErrorHandling(
    API_CONFIG.ENDPOINTS.Dashboards.LAYOUT(id),
    'PUT',
    payload
  )
}

export function applyDashboardPreset(
  id: string,
  layoutPreset: LayoutPreset
): Promise<WorkspaceDashboard> {
  return fetchWithErrorHandling(
    API_CONFIG.ENDPOINTS.Dashboards.PRESET(id),
    'POST',
    { layoutPreset }
  )
}

export function resetDashboard(id: string): Promise<WorkspaceDashboard> {
  return fetchWithErrorHandling<WorkspaceDashboard>(
    API_CONFIG.ENDPOINTS.Dashboards.RESET(id),
    'POST'
  )
}

export function addDashboardPanel(
  id: string,
  panel: Omit<DashboardPanel, 'id'>
): Promise<WorkspaceDashboard> {
  return fetchWithErrorHandling(
    API_CONFIG.ENDPOINTS.Dashboards.PANELS(id),
    'POST',
    panel
  )
}

export function removeDashboardPanel(
  id: string,
  panelId: string
): Promise<WorkspaceDashboard> {
  return fetchWithErrorHandling<WorkspaceDashboard>(
    API_CONFIG.ENDPOINTS.Dashboards.PANEL(id, panelId),
    'DELETE'
  )
}
