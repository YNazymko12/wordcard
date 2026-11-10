'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createWordImage } from '@/lib/images/store'
import type { ImageResult } from '@/lib/images/store'

export type { ImageResult }

export async function generateWordImage(wordId: string): Promise<ImageResult> {
  const supabase = await createClient()
  const { data: auth } = await supabase.auth.getClaims()
  const userId = auth?.claims?.sub

  if (!userId) return { ok: false, error: 'Nicht angemeldet.' }

  const { data: word } = await supabase
    .from('words')
    .select('created_by, image_url, image_concept')
    .eq('id', wordId)
    .maybeSingle()

  if (!word) return { ok: false, error: 'Wort nicht gefunden.' }

  if (word.created_by !== userId) {
    return { ok: false, error: 'Keine Berechtigung.' }
  }

  if (word.image_url) {
    return { ok: false, error: 'Dieses Wort hat schon ein Bild.' }
  }

  const concept = word.image_concept?.trim()

  if (!concept) {
    return { ok: false, error: 'Für dieses Wort fehlt die Bildbeschreibung.' }
  }

  const result = await createWordImage(wordId, concept)

  if (result.ok) revalidatePath('/', 'layout')

  return result
}
