import { cookies } from 'next/headers'
import {
  ACCESS_TOKEN_COOKIE,
  WORKSPACE_USER_COOKIE,
  parseWorkspaceUser,
} from '@/lib/auth/authCookies'

export async function GET() {
  const store = await cookies()
  const accessToken = store.get(ACCESS_TOKEN_COOKIE)?.value
  const user = parseWorkspaceUser(store.get(WORKSPACE_USER_COOKIE)?.value)

  if (!accessToken || !user) {
    return Response.json({ message: 'Not authenticated' }, { status: 401 })
  }

  return Response.json({ user, accessToken })
}
