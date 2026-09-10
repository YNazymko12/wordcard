'use server'

import { createWordImage } from '@/lib/images/store'

export async function generateWordImage(wordId: string, concept: string) {
  if (!concept.trim()) return

  await createWordImage(wordId, concept)
}
