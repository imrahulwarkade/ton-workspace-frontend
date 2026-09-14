import type { WorkspaceUser } from '@/types/user'

export type LoginRequest = {
  email: string
  password: string
}

export type AuthSessionResponse = {
  user: WorkspaceUser
  accessToken: string
}
