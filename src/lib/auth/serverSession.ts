import { cookies } from 'next/headers'
import {
  ACCESS_TOKEN_COOKIE,
  WORKSPACE_USER_COOKIE,
  parseWorkspaceUser,
} from '@/lib/auth/authCookies'
import type { WorkspaceUser } from '@/types/user'

export async function getServerSession(): Promise<WorkspaceUser | null> {
  const store = await cookies()
  const token = store.get(ACCESS_TOKEN_COOKIE)?.value
  if (!token) return null
  return parseWorkspaceUser(store.get(WORKSPACE_USER_COOKIE)?.value)
}
