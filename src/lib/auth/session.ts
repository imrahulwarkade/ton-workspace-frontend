import {
  ACCESS_TOKEN_COOKIE,
  WORKSPACE_USER_COOKIE,
  getCookie,
  parseWorkspaceUser,
} from '@/lib/auth/authCookies'
import type { WorkspaceUser } from '@/types/user'

export function getBrowserSession(): WorkspaceUser | null {
  const token = getCookie(ACCESS_TOKEN_COOKIE)
  if (!token) return null
  return parseWorkspaceUser(getCookie(WORKSPACE_USER_COOKIE))
}
