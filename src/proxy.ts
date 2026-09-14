import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import {
  ACCESS_TOKEN_COOKIE,
  WORKSPACE_USER_COOKIE,
  clearAuthCookiesOnResponse,
  parseWorkspaceUser,
} from '@/lib/auth/authCookies'

function isPublicPath(pathname: string): boolean {
  return (
    pathname === '/login' ||
    pathname.startsWith('/api/auth/') ||
    pathname === '/favicon.ico'
  )
}

function hasValidSession(request: NextRequest): boolean {
  const token = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value
  const user = parseWorkspaceUser(
    request.cookies.get(WORKSPACE_USER_COOKIE)?.value
  )
  return Boolean(token && user)
}

function redirectToLogin(request: NextRequest, pathname: string) {
  const loginUrl = new URL('/login', request.url)
  if (pathname !== '/login') {
    loginUrl.searchParams.set('next', pathname)
  }
  const response = NextResponse.redirect(loginUrl)
  return clearAuthCookiesOnResponse(response)
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const signedIn = hasValidSession(request)

  if (!signedIn && !isPublicPath(pathname)) {
    return redirectToLogin(request, pathname)
  }

  if (signedIn && pathname === '/login') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (pathname.startsWith('/admin')) {
    const user = parseWorkspaceUser(
      request.cookies.get(WORKSPACE_USER_COOKIE)?.value
    )
    if (user?.role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
