export type WorkspaceRole = 'admin' | 'engineer' | 'crm_agent'

export type WorkspaceUser = {
  id: string
  email: string
  name: string
  role: WorkspaceRole
}
