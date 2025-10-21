import { cn } from '@/lib/utils'

export function Badge({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md bg-white/10 px-2 py-1 text-xs',
        className,
      )}
    >
      {children}
    </span>
  )
}
