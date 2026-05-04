import { type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type BadgeVariant = 'signal' | 'depth' | 'muted'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

const variants: Record<BadgeVariant, string> = {
  signal: 'badge badge-signal',
  depth:  'badge badge-depth',
  muted:  'badge badge-muted',
}

export function Badge({ variant = 'signal', className, children, ...props }: BadgeProps) {
  return (
    <span className={cn(variants[variant], className)} {...props}>
      {children}
    </span>
  )
}
