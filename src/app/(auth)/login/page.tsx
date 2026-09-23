import type { Metadata } from 'next'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { WorkspaceBrand } from '@/components/layout/WorkspaceBrand'
import { LoginForm } from '@/modules/auth/components/LoginForm'

export const metadata: Metadata = {
  title: 'Sign in',
}

export default function LoginPage() {
  return (
    <Card className="border-border/80 w-full shadow-[0_24px_80px_-32px_rgba(0,0,0,0.85)]">
      <CardHeader className="space-y-6 pb-2">
        <WorkspaceBrand />
        <div className="space-y-1.5">
          <CardTitle className="text-[1.35rem]">Sign in</CardTitle>
          <CardDescription className="text-[13px] leading-relaxed">
            Access your ToneOp dashboards and internal tools.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="pb-8">
        <LoginForm />
      </CardContent>
    </Card>
  )
}
