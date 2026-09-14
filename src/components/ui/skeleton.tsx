import { cn } from '@/lib/utils/cn'

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('bg-muted animate-pulse rounded-sm', className)}
      {...props}
    />
  )
}

export { Skeleton }
