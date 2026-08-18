'use server'

import { revalidatePath } from 'next/cache'
import { createWordImage } from '@/lib/images/store'
import { describeScene } from '@/lib/ai/generate-card'
import { createClient } from '@/lib/supabase/server'

export async function generateWordImage(wordId: string, concept: string) {
  if (!concept.trim()) return

  await createWordImage(wordId, concept)
}

export type RedrawResult = { ok: boolean; error?: string }

export async function redrawWordImage(wordId: string): Promise<RedrawResult> {
  const supabase = await createClient()
  const { data: auth } = await supabase.auth.getClaims()

  if (!auth?.claims) return { ok: false, error: 'Nicht angemeldet.' }

  const { data: word } = await supabase
    .from('words')
    .select('word, image_concept')
    .eq('id', wordId)
    .maybeSingle()

  if (!word) return { ok: false, error: 'Wort nicht gefunden.' }

  let concept = word.image_concept?.trim() ?? ''

  if (!concept) {
    concept = await describeScene(word.word)

    if (!concept) {
      return { ok: false, error: 'Keine Bildidee gefunden.' }
    }

    await supabase
      .from('words')
      .update({ image_concept: concept })
      .eq('id', wordId)
  }

  const url = await createWordImage(wordId, concept)

  if (!url)
    return { ok: false, error: 'Das Bild konnte nicht erstellt werden.' }

  revalidatePath('/', 'layout')

  return { ok: true }
}
