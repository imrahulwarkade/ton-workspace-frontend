import {
  ACCESS_TOKEN_COOKIE,
  WORKSPACE_USER_COOKIE,
  serializeWorkspaceUser,
  setBrowserCookie,
} from '@/lib/auth/authCookies'
import type { AuthSessionResponse } from '@/modules/auth/types'

export function persistAuthSession(session: AuthSessionResponse): void {
  setBrowserCookie(ACCESS_TOKEN_COOKIE, session.accessToken)
  setBrowserCookie(WORKSPACE_USER_COOKIE, serializeWorkspaceUser(session.user))
}
