'use client'

import * as React from 'react'
import { Monitor, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

const MODES = [
  { value: 'light', label: 'Hell', icon: Sun },
  { value: 'dark', label: 'Dunkel', icon: Moon },
  { value: 'system', label: 'Automatisch', icon: Monitor },
]

const ACTIVE_ITEM =
  'aria-pressed:bg-primary aria-pressed:text-primary-foreground aria-pressed:hover:bg-primary/90 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground'

const emptySubscribe = () => () => {}

function useMounted() {
  return React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  )
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const mounted = useMounted()

  return (
    <ToggleGroup
      value={mounted ? [theme ?? 'system'] : []}
      onValueChange={(value) => {
        if (value[0]) setTheme(value[0])
      }}
      variant="outline"
      size="sm"
      spacing={0}
      aria-label="Design"
    >
      {MODES.map(({ value, label, icon: Icon }) => (
        <ToggleGroupItem
          key={value}
          value={value}
          aria-label={label}
          title={label}
          className={ACTIVE_ITEM}
        >
          <Icon />
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}
