import type { Metadata } from 'next'
import { AdminGate } from '@/components/layout/AdminGate'
import { ManageAppsPage } from '@/modules/catalog'

export const metadata: Metadata = {
  title: 'Manage URLs',
}

export default function AdminAppsPage() {
  return (
    <AdminGate>
      <ManageAppsPage />
    </AdminGate>
  )
}
