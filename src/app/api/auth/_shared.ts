import { NextResponse } from 'next/server'
import {
  ACCESS_TOKEN_COOKIE,
  AUTH_COOKIE_MAX_AGE_SEC,
  WORKSPACE_USER_COOKIE,
  serializeWorkspaceUser,
} from '@/lib/auth/authCookies'
import { loginSchema } from '@/modules/auth/schemas/loginSchema'
import type { WorkspaceRole, WorkspaceUser } from '@/types/user'

export function roleFromEmail(email: string): WorkspaceRole {
  const localPart = email.split('@')[0]?.toLowerCase() ?? ''
  if (localPart.includes('admin')) return 'admin'
  if (localPart.includes('crm')) return 'crm_agent'
  return 'engineer'
}

export function displayNameFromEmail(email: string): string {
  const localPart = email.split('@')[0] ?? 'Staff'
  return localPart
    .replace(/[._-]+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

export function createMockUser(email: string, name?: string): WorkspaceUser {
  return {
    id: email.toLowerCase(),
    email: email.toLowerCase(),
    name: name ?? displayNameFromEmail(email),
    role: roleFromEmail(email),
  }
}

export function sessionResponse(user: WorkspaceUser) {
  const accessToken = `mock.${Buffer.from(user.email).toString('base64url')}`
  const response = NextResponse.json({ user, accessToken })

  response.cookies.set(ACCESS_TOKEN_COOKIE, accessToken, {
    path: '/',
    maxAge: AUTH_COOKIE_MAX_AGE_SEC,
    sameSite: 'lax',
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
  })
  response.cookies.set(WORKSPACE_USER_COOKIE, serializeWorkspaceUser(user), {
    path: '/',
    maxAge: AUTH_COOKIE_MAX_AGE_SEC,
    sameSite: 'lax',
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
  })

  return response
}

export function parseLoginBody(body: unknown) {
  return loginSchema.safeParse(body)
}
