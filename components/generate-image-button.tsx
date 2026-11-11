'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { ImagePlus } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { generateWordImage } from '@/lib/actions/images'

export function GenerateImageButton({ wordId }: { wordId: string }) {
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  function generate() {
    startTransition(async () => {
      const result = await generateWordImage(wordId)

      if (!result.ok) {
        toast.error(result.error)
        return
      }

      toast.success('Bild erstellt')
      router.refresh()
    })
  }

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={pending}
      onClick={generate}
      title="Das Erzeugen dauert bis zu einer Minute"
    >
      {pending ? <Spinner /> : <ImagePlus data-icon="inline-start" />}
      {pending ? 'Wird erzeugt…' : 'Bild erzeugen'}
    </Button>
  )
}
