'use client'

import { useTransition } from 'react'
import { RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { redrawWordImage } from '@/lib/actions/images'

export function RedrawImageButton({ wordId }: { wordId: string }) {
  const [pending, startTransition] = useTransition()

  return (
    <Button
      variant="secondary"
      size="icon-sm"
      disabled={pending}
      aria-label="Bild neu zeichnen"
      title="Bild neu zeichnen"
      onClick={() =>
        startTransition(async () => {
          const result = await redrawWordImage(wordId)

          if (!result.ok) {
            toast.error(result.error)
            return
          }

          toast.success('Neues Bild erstellt')
        })
      }
    >
      <RefreshCw className={pending ? 'animate-spin' : undefined} />
    </Button>
  )
}
