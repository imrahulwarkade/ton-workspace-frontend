import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Inter } from 'next/font/google'
import { AppProviders } from '@/components/providers/AppProviders'
import { env } from '@/lib/env'
import './globals.css'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: env.NEXT_PUBLIC_APP_NAME,
    template: `%s · ${env.NEXT_PUBLIC_APP_NAME}`,
  },
  description:
    'Internal workspace for ToneOp dashboards, CRMs, landing pages, and tools.',
  robots: { index: false, follow: false },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="text-foreground flex min-h-full flex-col">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  )
}
