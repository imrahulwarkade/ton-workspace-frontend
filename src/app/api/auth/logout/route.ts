import { NextResponse } from 'next/server'
import { clearAuthCookiesOnResponse } from '@/lib/auth/authCookies'

export async function POST() {
  const response = NextResponse.json({ ok: true })
  return clearAuthCookiesOnResponse(response)
}
