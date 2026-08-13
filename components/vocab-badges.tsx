import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import {
  LEVEL_CLASSES,
  TYPE_LABEL,
  type CEFRLevel,
  type WordType,
} from '@/lib/vocab'

export function LevelBadge({
  level,
  className,
}: {
  level: CEFRLevel
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex h-5 shrink-0 items-center justify-center rounded-full px-2 text-xs font-semibold tracking-wide tabular-nums',
        LEVEL_CLASSES[level],
        className,
      )}
    >
      {level}
    </span>
  )
}

export function TypeBadge({
  type,
  className,
}: {
  type: WordType
  className?: string
}) {
  return (
    <Badge variant="outline" className={cn('font-medium', className)}>
      {TYPE_LABEL[type]}
    </Badge>
  )
}
