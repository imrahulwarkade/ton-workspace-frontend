import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils/cn'

const badgeVariants = cva(
  'inline-flex items-center rounded-sm border px-2 py-0.5 text-xs font-medium',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-secondary text-secondary-foreground',
        outline: 'border-white/15 text-foreground',
        staging: 'border-amber-500/30 bg-amber-500/15 text-amber-200',
        production: 'border-emerald-500/30 bg-emerald-500/15 text-emerald-200',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<'span'> & VariantProps<typeof badgeVariants>) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}
