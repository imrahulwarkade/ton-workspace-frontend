import { z } from 'zod'
import { ALLOWED_EMAIL_DOMAINS } from '@/lib/constants/roles'

export const emailSchema = z
  .string()
  .trim()
  .min(1, 'Email is required')
  .refine(
    (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    'Enter a valid email address'
  )

export const orgEmailSchema = emailSchema.refine((value) => {
  const domain = value.split('@')[1]?.toLowerCase()
  return Boolean(
    domain && (ALLOWED_EMAIL_DOMAINS as readonly string[]).includes(domain)
  )
}, 'Use your ToneOp work email')

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
