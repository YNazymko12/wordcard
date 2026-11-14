'use client'

import { useTheme } from 'next-themes'
import { Toaster as Sonner, type ToasterProps } from 'sonner'
import {
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
  OctagonXIcon,
  Loader2Icon,
} from 'lucide-react'

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      richColors
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
          '--border-radius': 'var(--radius)',
          '--error-bg':
            'color-mix(in oklab, var(--destructive) 10%, var(--popover))',
          '--error-border':
            'color-mix(in oklab, var(--destructive) 28%, var(--popover))',
          '--error-text':
            'color-mix(in oklab, var(--destructive) 72%, var(--foreground))',
          '--success-bg':
            'color-mix(in oklab, var(--success) 10%, var(--popover))',
          '--success-border':
            'color-mix(in oklab, var(--success) 28%, var(--popover))',
          '--success-text':
            'color-mix(in oklab, var(--success) 72%, var(--foreground))',
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
