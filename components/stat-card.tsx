import type { LucideIcon } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export function StatCard({
  icon: Icon,
  value,
  label,
  accent,
}: {
  icon: LucideIcon
  value: number
  label: string
  accent?: boolean
}) {
  return (
    <Card
      className={cn(
        'flex-row items-center gap-3 p-4',
        accent && 'border-primary/20 bg-primary/5',
      )}
    >
      <div
        className={cn(
          'flex size-10 items-center justify-center rounded-xl',
          accent
            ? 'bg-primary text-primary-foreground'
            : 'bg-secondary text-foreground',
        )}
      >
        <Icon className="size-5" />
      </div>
      <div className="leading-tight">
        <p className="font-display text-2xl font-bold tabular-nums">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </Card>
  )
}
