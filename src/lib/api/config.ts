import { env } from '@/lib/env'

export const API_CONFIG = {
  BASE_URL: env.NEXT_PUBLIC_API_BASE_URL,
  // BASE_URL: 'https://hub.toneop.net/api',
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
    },
    Favorites: {
      LIST: 'favorites',
      TOGGLE: 'favorites/toggle',
    },
  },
} as const
