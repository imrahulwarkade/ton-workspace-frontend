import type { NextResponse } from 'next/server'
import type { WorkspaceUser } from '@/types/user'

export const ACCESS_TOKEN_COOKIE = 'access_token'
export const WORKSPACE_USER_COOKIE = 'workspace_user'
/** Legacy cookie from the Hub naming; still cleared on logout. */
export const LEGACY_USER_COOKIE = 'hub_user'

export const AUTH_COOKIE_MAX_AGE_SEC = 60 * 60 * 12

const COOKIE_CLEAR_OPTIONS = { path: '/', maxAge: 0 } as const

export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

export function setBrowserCookie(
  name: string,
  value: string,
  maxAgeSec = AUTH_COOKIE_MAX_AGE_SEC
): void {
  if (typeof document === 'undefined') return
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSec}; samesite=lax`
}

export function clearAuthCookiesOnResponse(
  response: NextResponse
): NextResponse {
  response.cookies.set(ACCESS_TOKEN_COOKIE, '', COOKIE_CLEAR_OPTIONS)
  response.cookies.set(WORKSPACE_USER_COOKIE, '', COOKIE_CLEAR_OPTIONS)
  response.cookies.set(LEGACY_USER_COOKIE, '', COOKIE_CLEAR_OPTIONS)
  return response
}

export function clearAuthCookiesInBrowser(): void {
  if (typeof document === 'undefined') return
  document.cookie = `${ACCESS_TOKEN_COOKIE}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`
  document.cookie = `${WORKSPACE_USER_COOKIE}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`
  document.cookie = `${LEGACY_USER_COOKIE}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`
}

export function serializeWorkspaceUser(user: WorkspaceUser): string {
  return JSON.stringify(user)
}

export function parseWorkspaceUser(
  raw: string | undefined | null
): WorkspaceUser | null {
  if (!raw) return null

  try {
    const decoded = raw.includes('%') ? decodeURIComponent(raw) : raw
    const parsed: unknown = JSON.parse(decoded)
    if (!parsed || typeof parsed !== 'object') return null

    const candidate = parsed as Partial<WorkspaceUser>
    if (
      typeof candidate.id !== 'string' ||
      typeof candidate.email !== 'string' ||
      typeof candidate.name !== 'string' ||
      (candidate.role !== 'admin' &&
        candidate.role !== 'engineer' &&
        candidate.role !== 'crm_agent')
    ) {
      return null
    }

    return {
      id: candidate.id,
      email: candidate.email,
      name: candidate.name,
      role: candidate.role,
    }
  } catch {
    return null
  }
}
