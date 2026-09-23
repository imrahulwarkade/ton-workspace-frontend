import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosRequestConfig,
} from 'axios'
import { clearAuthCookiesInBrowser, getCookie } from '@/lib/auth/authCookies'
import {
  getApiErrorMessage,
  isUnauthorizedApiError,
} from './getApiErrorMessage'
import { API_CONFIG } from './config'
import { ACCESS_TOKEN_COOKIE } from '@/lib/auth/authCookies'

export const axiosInstance = axios.create({
  baseURL: API_CONFIG.API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = getCookie(ACCESS_TOKEN_COOKIE)
    if (accessToken) {
      config.headers.Authorization = accessToken.startsWith('Bearer ')
        ? accessToken
        : `Bearer ${accessToken}`
    }
    return config
  },
  (error: AxiosError) => Promise.reject(error)
)

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    const headers = (error.config?.headers ?? {}) as Record<string, unknown>
    const skipAuthRedirectRaw =
      headers['X-Skip-Auth-Redirect'] ?? headers['x-skip-auth-redirect']
    const skipAuthRedirect = String(skipAuthRedirectRaw) === 'true'
    const statusCode = error.response?.status

    if (skipAuthRedirect) {
      return Promise.reject(error)
    }

    if (isUnauthorizedApiError(error)) {
      if (typeof window !== 'undefined') {
        clearAuthCookiesInBrowser()
        // Axios interceptors are outside React; a full navigation is required.
        // eslint-disable-next-line @next/next/no-location-assign-relative-destination -- hard redirect after 401
        window.location.assign('/login')
      }
      return Promise.reject(error)
    }

    switch (statusCode) {
      case 403:
        error.message = getApiErrorMessage(error)
        break
      case 404:
      case 500:
      default:
        break
    }

    return Promise.reject(error)
  }
)

export const fetchWithErrorHandling = async <T, D = Record<string, unknown>>(
  url: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' = 'GET',
  data?: D,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    let response

    switch (method) {
      case 'GET':
        response = await axiosInstance.get<T>(url, config)
        break
      case 'POST':
        response = await axiosInstance.post<T>(url, data, config)
        break
      case 'PUT':
        response = await axiosInstance.put<T>(url, data, config)
        break
      case 'PATCH':
        response = await axiosInstance.patch<T>(url, data, config)
        break
      case 'DELETE':
        response = await axiosInstance.delete<T>(url, config)
        break
      default:
        throw new Error(`Unsupported method: ${method}`)
    }

    return response.data
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(`API ${method} request to ${url} failed:`, error.message)
    }
    throw error
  }
}

export default axiosInstance
