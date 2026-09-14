import { fetchWithErrorHandling } from '@/lib/api/client'
import { API_CONFIG } from '@/lib/api/config'
import type { AuthSessionResponse, LoginRequest } from '@/modules/auth/types'

const skipAuthRedirect = {
  headers: { 'X-Skip-Auth-Redirect': 'true' },
}

export function login(payload: LoginRequest): Promise<AuthSessionResponse> {
  return fetchWithErrorHandling<AuthSessionResponse, LoginRequest>(
    API_CONFIG.ENDPOINTS.Auth.LOGIN,
    'POST',
    payload,
    skipAuthRedirect
  )
}

export function loginWithGoogle(): Promise<AuthSessionResponse> {
  return fetchWithErrorHandling<AuthSessionResponse>(
    API_CONFIG.ENDPOINTS.Auth.GOOGLE,
    'POST',
    undefined,
    skipAuthRedirect
  )
}

export function logout(): Promise<{ ok: true }> {
  return fetchWithErrorHandling<{ ok: true }>(
    API_CONFIG.ENDPOINTS.Auth.LOGOUT,
    'POST',
    undefined,
    skipAuthRedirect
  )
}

export function getSession(): Promise<AuthSessionResponse> {
  return fetchWithErrorHandling<AuthSessionResponse>(
    API_CONFIG.ENDPOINTS.Auth.SESSION,
    'GET'
  )
}
