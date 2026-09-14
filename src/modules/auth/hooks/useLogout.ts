'use client'

import { useRouter } from 'next/navigation'
import { logout } from '@/modules/auth/services/authService'
import { clearAuthCookiesInBrowser } from '@/lib/auth/authCookies'

export function useLogout() {
  const router = useRouter()

  async function signOut() {
    try {
      await logout()
    } finally {
      clearAuthCookiesInBrowser()
      router.replace('/login')
      router.refresh()
    }
  }

  return { signOut }
}
