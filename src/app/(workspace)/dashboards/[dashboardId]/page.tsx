import { DashboardView } from '@/modules/dashboard'

type DashboardRouteProps = {
  params: Promise<{ dashboardId: string }>
}

export default async function DashboardDetailPage({
  params,
}: DashboardRouteProps) {
  const { dashboardId } = await params
  return <DashboardView dashboardId={dashboardId} />
}
