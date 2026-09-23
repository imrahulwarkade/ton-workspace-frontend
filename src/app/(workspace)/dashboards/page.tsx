import type { Metadata } from 'next'
import { DashboardListPage } from '@/modules/dashboard'

export const metadata: Metadata = {
  title: 'Dashboards',
}

export default function DashboardsPage() {
  return <DashboardListPage />
}
