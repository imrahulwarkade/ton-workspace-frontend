import { z } from 'zod'
import { orgEmailSchema, passwordSchema } from '@/lib/validation/common'

export const loginSchema = z.object({
  email: orgEmailSchema,
  password: passwordSchema,
})

export type LoginFormValues = z.infer<typeof loginSchema>
