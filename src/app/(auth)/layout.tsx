import type { ReactNode } from 'react'

export default function AuthLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <div className="relative flex min-h-dvh w-full flex-1 items-center justify-center px-4 py-8">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(255,77,46,0.12),transparent_55%)]"
      />
      <div className="relative w-full max-w-[420px]">{children}</div>
    </div>
  )
}
