'use client'

import { Volume2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function PronounceButton({
  text,
  variant = 'ghost',
  className,
}: {
  text: string
  variant?: 'ghost' | 'secondary'
  className?: string
}) {
  function speak() {
    const synth = window.speechSynthesis
    if (!synth) return

    synth.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'de-DE'
    utterance.rate = 0.9

    synth.speak(utterance)
  }

  return (
    <Button
      variant={variant}
      size="icon-sm"
      onClick={speak}
      aria-label={`„${text}“ anhören`}
      className={cn('shrink-0', className)}
    >
      <Volume2 />
    </Button>
  )
}
