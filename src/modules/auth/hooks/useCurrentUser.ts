'use client'

import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { clearAuthCookiesInBrowser } from '@/lib/auth/authCookies'
import { getBrowserSession } from '@/lib/auth/session'
import { getSession } from '@/modules/auth/services/authService'
import type { WorkspaceUser } from '@/types/user'

export function useCurrentUser() {
  const query = useQuery({
    queryKey: ['auth', 'session'],
    queryFn: getSession,
    staleTime: 60_000,
    retry: false,
    initialData: () => {
      const user = getBrowserSession()
      if (!user) return undefined
      return { user, accessToken: 'cookie' }
    },
  })

  const user: WorkspaceUser | null = query.data?.user ?? null

  useEffect(() => {
    if (!query.isError) return
    clearAuthCookiesInBrowser()
    if (window.location.pathname !== '/login') {
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination -- session is invalid
      window.location.assign('/login')
    }
  }, [query.isError])

  return {
    user,
    isLoading: query.isLoading,
    isError: query.isError,
  }
}
