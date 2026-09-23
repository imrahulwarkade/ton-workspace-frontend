import { fetchWithErrorHandling } from '@/lib/api/client'
import { API_CONFIG } from '@/lib/api/config'

export type FavoritesResponse = {
  favoriteIds: string[]
}

export type FavoriteToggleResponse = FavoritesResponse & {
  appId: string
  isFavorite: boolean
}

export function listFavorites(): Promise<FavoritesResponse> {
  return fetchWithErrorHandling<FavoritesResponse>(
    API_CONFIG.ENDPOINTS.Favorites.LIST
  )
}

export function toggleFavorite(appId: string): Promise<FavoriteToggleResponse> {
  return fetchWithErrorHandling<FavoriteToggleResponse, { appId: string }>(
    API_CONFIG.ENDPOINTS.Favorites.TOGGLE,
    'POST',
    { appId }
  )
}
