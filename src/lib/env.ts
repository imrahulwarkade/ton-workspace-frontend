import { z } from 'zod'

const envSchema = z.object({
  NEXT_PUBLIC_API_BASE_URL: z
    .string()
    .min(1, 'NEXT_PUBLIC_API_BASE_URL is required')
    .refine(
      (value) => value.startsWith('/') || /^https?:\/\//.test(value),
      'NEXT_PUBLIC_API_BASE_URL must be an absolute URL or a same-origin path like /api'
    ),
  NEXT_PUBLIC_ASSETS_URL: z.string().optional(),
  NEXT_PUBLIC_APP_NAME: z.string().default('ToneOp Workspace'),
})

function readEnv() {
  const parsed = envSchema.safeParse({
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    NEXT_PUBLIC_ASSETS_URL: process.env.NEXT_PUBLIC_ASSETS_URL,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  })

  if (!parsed.success) {
    const details = parsed.error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join('; ')
    throw new Error(`Invalid environment variables. ${details}`)
  }

  return parsed.data
}

export const env = readEnv()
