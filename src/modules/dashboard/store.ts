'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  DEFAULT_LAYOUT_PRESET,
  layoutFromPreset,
  type LayoutPreset,
  type NamedLayoutPreset,
} from '@/modules/dashboard/layouts'
import {
  buildDefaultDashboard,
  createDashboardId,
  createPanelId,
  nextLayoutItem,
} from '@/modules/dashboard/services/dashboardService'
import type {
  DashboardPanel,
  GridItem,
  WorkspaceDashboard,
} from '@/modules/dashboard/types'

type AppSeed = { id: string; name: string }

type DashboardState = {
  dashboards: WorkspaceDashboard[]
  activeId: string | null
  isEditing: boolean
  setEditing: (isEditing: boolean) => void
  setActiveId: (id: string) => void
  ensureDefault: (apps: AppSeed[]) => void
  createDashboard: (name: string, description?: string) => string
  renameDashboard: (id: string, name: string) => void
  toggleStar: (id: string) => void
  removeDashboard: (id: string) => void
  setLayout: (id: string, layout: GridItem[]) => void
  applyLayoutPreset: (id: string, preset: NamedLayoutPreset) => void
  markCustomLayout: (id: string) => void
  resetToDefault: (id: string, apps: AppSeed[]) => void
  addPanel: (dashboardId: string, panel: Omit<DashboardPanel, 'id'>) => void
  removePanel: (dashboardId: string, panelId: string) => void
}

function touch(
  dashboard: WorkspaceDashboard,
  patch: Partial<WorkspaceDashboard>
): WorkspaceDashboard {
  return { ...dashboard, ...patch, updatedAt: Date.now() }
}

function withPreset(dashboard: WorkspaceDashboard): WorkspaceDashboard {
  if (dashboard.layoutPreset) return dashboard
  return {
    ...dashboard,
    layoutPreset: DEFAULT_LAYOUT_PRESET,
    layout: layoutFromPreset(
      dashboard.panels.map((panel) => panel.id),
      DEFAULT_LAYOUT_PRESET
    ),
  }
}

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set, get) => ({
      dashboards: [],
      activeId: null,
      isEditing: false,
      setEditing: (isEditing) => set({ isEditing }),
      setActiveId: (id) => set({ activeId: id }),
      ensureDefault: (apps) => {
        const current = get().dashboards
        if (current.length > 0) {
          const needsMigrate = current.some(
            (dashboard) => !dashboard.layoutPreset
          )
          if (needsMigrate) {
            set({ dashboards: current.map(withPreset) })
          }
          if (!get().activeId) {
            set({ activeId: get().dashboards[0]?.id ?? null })
          }
          return
        }
        const dashboard = buildDefaultDashboard(apps)
        set({ dashboards: [dashboard], activeId: dashboard.id })
      },
      createDashboard: (name, description = '') => {
        const now = Date.now()
        const dashboard: WorkspaceDashboard = {
          id: createDashboardId(),
          name,
          description,
          starred: false,
          panels: [],
          layout: [],
          layoutPreset: DEFAULT_LAYOUT_PRESET,
          createdAt: now,
          updatedAt: now,
        }
        set({
          dashboards: [...get().dashboards, dashboard],
          activeId: dashboard.id,
        })
        return dashboard.id
      },
      renameDashboard: (id, name) => {
        set({
          dashboards: get().dashboards.map((dashboard) =>
            dashboard.id === id ? touch(dashboard, { name }) : dashboard
          ),
        })
      },
      toggleStar: (id) => {
        set({
          dashboards: get().dashboards.map((dashboard) =>
            dashboard.id === id
              ? touch(dashboard, { starred: !dashboard.starred })
              : dashboard
          ),
        })
      },
      removeDashboard: (id) => {
        const remaining = get().dashboards.filter(
          (dashboard) => dashboard.id !== id
        )
        const activeId =
          get().activeId === id ? (remaining[0]?.id ?? null) : get().activeId
        set({ dashboards: remaining, activeId })
      },
      setLayout: (id, layout) => {
        set({
          dashboards: get().dashboards.map((dashboard) =>
            dashboard.id === id ? touch(dashboard, { layout }) : dashboard
          ),
        })
      },
      applyLayoutPreset: (id, preset) => {
        set({
          dashboards: get().dashboards.map((dashboard) => {
            if (dashboard.id !== id) return dashboard
            return touch(dashboard, {
              layoutPreset: preset,
              layout: layoutFromPreset(
                dashboard.panels.map((panel) => panel.id),
                preset
              ),
            })
          }),
        })
      },
      markCustomLayout: (id) => {
        set({
          dashboards: get().dashboards.map((dashboard) =>
            dashboard.id === id
              ? touch(dashboard, {
                  layoutPreset: 'custom' satisfies LayoutPreset,
                })
              : dashboard
          ),
        })
      },
      resetToDefault: (id, apps) => {
        const fresh = buildDefaultDashboard(apps)
        set({
          dashboards: get().dashboards.map((dashboard) => {
            if (dashboard.id !== id) return dashboard
            if (dashboard.id === fresh.id) {
              return touch(dashboard, {
                panels: fresh.panels,
                layout: fresh.layout,
                layoutPreset: DEFAULT_LAYOUT_PRESET,
              })
            }
            return touch(dashboard, {
              layoutPreset: DEFAULT_LAYOUT_PRESET,
              layout: layoutFromPreset(
                dashboard.panels.map((panel) => panel.id),
                DEFAULT_LAYOUT_PRESET
              ),
            })
          }),
        })
      },
      addPanel: (dashboardId, panel) => {
        const newId = createPanelId()
        set({
          dashboards: get().dashboards.map((dashboard) => {
            if (dashboard.id !== dashboardId) return dashboard
            const nextPanel: DashboardPanel = { ...panel, id: newId }
            const preset =
              dashboard.layoutPreset === 'custom'
                ? DEFAULT_LAYOUT_PRESET
                : dashboard.layoutPreset
            return touch(dashboard, {
              panels: [...dashboard.panels, nextPanel],
              layout: [
                ...dashboard.layout,
                nextLayoutItem(dashboard.layout, newId, preset),
              ],
            })
          }),
        })
      },
      removePanel: (dashboardId, panelId) => {
        set({
          dashboards: get().dashboards.map((dashboard) => {
            if (dashboard.id !== dashboardId) return dashboard
            return touch(dashboard, {
              panels: dashboard.panels.filter((panel) => panel.id !== panelId),
              layout: dashboard.layout.filter((item) => item.i !== panelId),
            })
          }),
        })
      },
    }),
    {
      name: 'toneop-workspace-dashboards',
      version: 2,
      migrate: (persistedState, version) => {
        const state = persistedState as {
          dashboards?: WorkspaceDashboard[]
          activeId?: string | null
        }
        const dashboards = state.dashboards ?? []
        if (version < 2) {
          return {
            dashboards: dashboards.map((dashboard) => ({
              ...dashboard,
              layoutPreset: DEFAULT_LAYOUT_PRESET,
              layout: layoutFromPreset(
                dashboard.panels.map((panel) => panel.id),
                DEFAULT_LAYOUT_PRESET
              ),
            })),
            activeId: state.activeId ?? null,
          }
        }
        return {
          dashboards,
          activeId: state.activeId ?? null,
        }
      },
      partialize: (state) => ({
        dashboards: state.dashboards,
        activeId: state.activeId,
      }),
    }
  )
)
