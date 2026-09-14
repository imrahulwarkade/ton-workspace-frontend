export const APP_TYPES = [
  'dashboard',
  'crm',
  'landing',
  'infra',
  'design',
] as const

export type AppType = (typeof APP_TYPES)[number]

export const APP_TYPE_LABELS: Record<AppType, string> = {
  dashboard: 'Dashboards',
  crm: 'CRM',
  landing: 'Landing pages',
  infra: 'Infra',
  design: 'Design',
}
