import { isAxiosError } from 'axios'

export const API_FORBIDDEN_MESSAGE =
  "You don't have permission to access this resource. Please contact your administrator to request access."

type ApiErrorBody = {
  detail?: string
  message?: string
  error?: string
  status_code?: number | string
  errors?:
    | string[]
    | Record<string, string[]>
    | Array<{ message?: string; detail?: string }>
}

export function getApiBodyStatusCode(data: unknown): number | null {
  if (!data || typeof data !== 'object') return null

  const statusCode = (data as ApiErrorBody).status_code
  if (typeof statusCode === 'number' && Number.isFinite(statusCode)) {
    return statusCode
  }
  if (typeof statusCode === 'string') {
    const parsed = Number(statusCode)
    return Number.isFinite(parsed) ? parsed : null
  }

  return null
}

export function isUnauthorizedApiError(err: unknown): boolean {
  if (!isAxiosError(err)) return false
  if (err.response?.status === 401) return true
  return getApiBodyStatusCode(err.response?.data) === 401
}

function extractBodyMessage(data: ApiErrorBody | undefined): string | null {
  if (!data) return null

  if (typeof data.detail === 'string' && data.detail.trim()) {
    return data.detail.trim()
  }
  if (typeof data.message === 'string' && data.message.trim()) {
    return data.message.trim()
  }
  if (typeof data.error === 'string' && data.error.trim()) {
    return data.error.trim()
  }

  if (data.errors) {
    if (Array.isArray(data.errors)) {
      const first = data.errors.find((entry) => {
        if (typeof entry === 'string') return entry.trim()
        if (entry && typeof entry === 'object' && 'message' in entry) {
          return typeof entry.message === 'string' && entry.message.trim()
        }
        return false
      })
      if (typeof first === 'string' && first.trim()) return first.trim()
      if (
        first &&
        typeof first === 'object' &&
        'message' in first &&
        typeof first.message === 'string' &&
        first.message.trim()
      ) {
        return first.message.trim()
      }
    } else if (typeof data.errors === 'object') {
      const first = Object.values(data.errors).flat().find(Boolean)
      if (typeof first === 'string' && first.trim()) return first.trim()
    }
  }

  return null
}

export function isForbiddenError(err: unknown): boolean {
  return (
    isAxiosError(err) &&
    err.response?.status === 403 &&
    !isUnauthorizedApiError(err)
  )
}

export function getApiErrorMessage(
  err: unknown,
  fallback = 'Something went wrong. Please try again.'
): string {
  if (isForbiddenError(err)) {
    return API_FORBIDDEN_MESSAGE
  }

  if (isAxiosError(err)) {
    const bodyMessage = extractBodyMessage(
      err.response?.data as ApiErrorBody | undefined
    )
    if (bodyMessage) return bodyMessage
  }

  if (err instanceof Error && err.message.trim()) {
    const message = err.message.trim()
    if (!message.startsWith('Request failed with status code')) {
      return message
    }
  }

  return fallback
}
