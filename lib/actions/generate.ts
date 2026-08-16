'use server'

import { revalidatePath } from 'next/cache'
import { generateCard } from '@/lib/ai/generate-card'
import { createClient } from '@/lib/supabase/server'
import type { GeneratedCard } from '@/lib/ai/card-schema'

export type GenerateResult =
  | { ok: true; card: GeneratedCard; existingId: string | null }
  | { ok: false; error: string }

export type SaveResult = { ok: true; id: string } | { ok: false; error: string }

export async function generateCardAction(
  input: string,
): Promise<GenerateResult> {
  const value = input.trim()

  if (value.length === 0 || value.length > 80) {
    return { ok: false, error: 'Bitte gib ein Wort oder eine Wendung ein.' }
  }

  const supabase = await createClient()
  const { data: auth } = await supabase.auth.getClaims()

  if (!auth?.claims) return { ok: false, error: 'Nicht angemeldet.' }

  const { data: existing } = await supabase
    .from('words')
    .select('*')
    .ilike('word', value)
    .maybeSingle()

  if (existing) {
    return {
      ok: true,
      existingId: existing.id,
      card: {
        word: existing.word,
        article: existing.article as GeneratedCard['article'],
        type: existing.type as GeneratedCard['type'],
        level: existing.level as GeneratedCard['level'],
        translations: existing.translations as GeneratedCard['translations'],
        examples: existing.examples as GeneratedCard['examples'],
        verb: existing.verb as GeneratedCard['verb'],
        preposition: existing.preposition as GeneratedCard['preposition'],
        notes: existing.notes ?? '',
        imageConcept: '',
      },
    }
  }

  try {
    return { ok: true, card: await generateCard(value), existingId: null }
  } catch {
    return { ok: false, error: 'Die Generierung ist fehlgeschlagen.' }
  }
}

export async function saveCardAction(
  card: GeneratedCard,
  existingId: string | null,
): Promise<SaveResult> {
  const supabase = await createClient()
  const { data: auth } = await supabase.auth.getClaims()
  const userId = auth?.claims?.sub

  if (!userId) return { ok: false, error: 'Nicht angemeldet.' }

  let wordId = existingId

  if (!wordId) {
    const { data, error } = await supabase
      .from('words')
      .insert({
        word: card.word,
        article: card.article,
        type: card.type,
        level: card.level,
        translations: card.translations,
        examples: card.examples,
        verb: card.verb,
        preposition: card.preposition,
        notes: card.notes,
        created_by: userId,
      })
      .select('id')
      .single()

    if (error || !data) {
      return { ok: false, error: 'Speichern fehlgeschlagen.' }
    }

    wordId = data.id as string
  }

  const { error } = await supabase
    .from('user_words')
    .insert({ user_id: userId, word_id: wordId })

  if (error && error.code !== '23505') {
    return { ok: false, error: 'Speichern fehlgeschlagen.' }
  }

  revalidatePath('/', 'layout')

  return { ok: true, id: wordId }
}
