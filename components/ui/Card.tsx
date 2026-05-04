import { type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type CardVariant = 'depth' | 'void' | 'signal'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant
}

const variants: Record<CardVariant, string> = {
  depth:  'card-depth',
  void:   'card-void',
  signal: 'card-signal',
}

export function Card({ variant = 'depth', className, children, ...props }: CardProps) {
  return (
    <div className={cn(variants[variant], className)} {...props}>
      {children}
    </div>
  )
}

export function CardLabel({ children, className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('section-label mb-3', className)} {...props}>
      {children}
    </p>
  )
}
