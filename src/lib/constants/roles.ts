import type { AppType } from '@/lib/constants/appTypes'
import type { WorkspaceRole } from '@/types/user'

export const ALLOWED_EMAIL_DOMAINS = [
  'toneopfit.com',
  'toneop.com',
  'appofit.com',
] as const

export const WORKSPACE_ROLES = ['admin', 'engineer', 'crm_agent'] as const

export const ROLE_LABELS: Record<WorkspaceRole, string> = {
  admin: 'Admin',
  engineer: 'Engineer',
  crm_agent: 'CRM Agent',
}

export const ROLE_VISIBLE_TYPES: Record<
  WorkspaceRole,
  readonly AppType[] | 'all'
> = {
  admin: 'all',
  engineer: 'all',
  crm_agent: ['dashboard', 'crm', 'landing'],
}

export function canRoleSeeAppType(role: WorkspaceRole, type: AppType): boolean {
  const allowed = ROLE_VISIBLE_TYPES[role]
  return allowed === 'all' || allowed.includes(type)
}
