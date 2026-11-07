'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { WordForm } from '@/components/word-form'
import { updateWord } from '@/lib/actions/words'
import type { WordInput } from '@/lib/ai/card-schema'

export function EditWord({
  wordId,
  initial,
  isAuthor,
}: {
  wordId: string
  initial: WordInput
  isAuthor: boolean
}) {
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  function save(values: WordInput) {
    startTransition(async () => {
      const result = await updateWord(wordId, values)

      if (!result.ok) {
        toast.error(result.error)
        return
      }

      toast.success('Änderungen gespeichert')
      router.push(`/word/${result.id}`)
    })
  }

  return (
    <WordForm
      initial={initial}
      pending={pending}
      note={
        isAuthor
          ? undefined
          : 'Dieses Wort stammt aus der gemeinsamen Bibliothek. Beim Speichern entsteht deine eigene Kopie.'
      }
      onSubmit={save}
      onCancel={() => router.push(`/word/${wordId}`)}
    />
  )
}
