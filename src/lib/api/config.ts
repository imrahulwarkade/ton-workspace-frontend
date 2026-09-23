import { env } from '@/lib/env'

export const API_CONFIG = {
  BASE_URL: env.NEXT_PUBLIC_API_BASE_URL,
  get API_BASE_URL() {
    return this.BASE_URL.endsWith('/') ? this.BASE_URL : `${this.BASE_URL}/`
  },
  ENDPOINTS: {
    Auth: {
      LOGIN: 'auth/login',
      GOOGLE: 'auth/google',
      LOGOUT: 'auth/logout',
      SESSION: 'auth/session',
    },
    Catalog: {
      LIST: 'catalog/apps',
      DETAIL: (id: string) => `catalog/apps/${id}`,
    },
    Favorites: {
      LIST: 'favorites',
      TOGGLE: 'favorites/toggle',
    },
    Dashboards: {
      LIST: 'dashboards',
      DETAIL: (id: string) => `dashboards/${id}`,
      STAR: (id: string) => `dashboards/${id}/star`,
      LAYOUT: (id: string) => `dashboards/${id}/layout`,
      PRESET: (id: string) => `dashboards/${id}/preset`,
      RESET: (id: string) => `dashboards/${id}/reset`,
      PANELS: (id: string) => `dashboards/${id}/panels`,
      PANEL: (id: string, panelId: string) =>
        `dashboards/${id}/panels/${panelId}`,
    },
  },
} as const
