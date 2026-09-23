'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  listFavorites,
  toggleFavorite,
} from '@/modules/favorites/services/favoritesService'

export const favoriteKeys = {
  all: ['favorites'] as const,
}

export function useFavoriteIds() {
  const query = useQuery({
    queryKey: favoriteKeys.all,
    queryFn: async () => (await listFavorites()).favoriteIds,
  })

  return {
    favoriteIds: query.data ?? [],
    isLoading: query.isLoading,
  }
}

export function useToggleFavorite() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: toggleFavorite,
    onSuccess: (data) => {
      queryClient.setQueryData(favoriteKeys.all, data.favoriteIds)
    },
  })
}
