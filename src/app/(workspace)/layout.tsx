import type { ReactNode } from 'react'
import { WorkspaceShell } from '@/components/layout/WorkspaceShell'

export default function WorkspaceLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return <WorkspaceShell>{children}</WorkspaceShell>
}
