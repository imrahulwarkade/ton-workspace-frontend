export const ENVIRONMENTS = ['staging', 'production'] as const

export type WorkspaceEnvironment = (typeof ENVIRONMENTS)[number]
