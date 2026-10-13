'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { WordInputSchema, type WordInput } from '@/lib/ai/card-schema'

export async function removeFromCollection(wordId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('user_words')
    .delete()
    .eq('word_id', wordId)

  if (error) throw error

  revalidatePath('/', 'layout')
  redirect('/')
}

export type UpdateResult =
  { ok: true; id: string } | { ok: false; error: string }

const DUPLICATE = '23505'

function toRow(input: WordInput) {
  const conjugated = input.type === 'verb' || input.type === 'phrase'

  return {
    word: input.word,
    article: input.type === 'noun' ? input.article : null,
    type: input.type,
    level: input.level,
    translations: input.translations,
    examples: input.examples,
    verb: conjugated ? input.verb : null,
    preposition: conjugated ? input.preposition : null,
    notes: input.notes.trim() || null,
  }
}

export async function updateWord(
  wordId: string,
  input: WordInput,
): Promise<UpdateResult> {
  const parsed = WordInputSchema.safeParse(input)

  if (!parsed.success) {
    return { ok: false, error: 'Bitte prüfe die Eingaben.' }
  }

  const supabase = await createClient()
  const { data: auth } = await supabase.auth.getClaims()
  const userId = auth?.claims?.sub

  if (!userId) return { ok: false, error: 'Nicht angemeldet.' }

  const { data: current } = await supabase
    .from('words')
    .select('id, created_by, source_id, image_url, image_concept')
    .eq('id', wordId)
    .maybeSingle()

  if (!current) return { ok: false, error: 'Wort nicht gefunden.' }

  const row = toRow(parsed.data)

  if (current.created_by === userId) {
    const { data, error } = await supabase
      .from('words')
      .update(row)
      .eq('id', wordId)
      .select('id')
      .maybeSingle()

    if (error) {
      return {
        ok: false,
        error:
          error.code === DUPLICATE
            ? 'Dieses Wort gibt es schon.'
            : 'Speichern fehlgeschlagen.',
      }
    }

    if (!data) return { ok: false, error: 'Keine Berechtigung.' }

    revalidatePath('/', 'layout')

    return { ok: true, id: data.id }
  }

  const sourceId = current.source_id ?? current.id

  const { data: copy } = await supabase
    .from('words')
    .select('id')
    .eq('source_id', sourceId)
    .eq('created_by', userId)
    .maybeSingle()

  let copyId = copy?.id

  if (copyId) {
    const { error } = await supabase.from('words').update(row).eq('id', copyId)

    if (error) return { ok: false, error: 'Speichern fehlgeschlagen.' }
  } else {
    const { data, error } = await supabase
      .from('words')
      .insert({
        ...row,
        source_id: sourceId,
        created_by: userId,
        image_url: current.image_url,
        image_concept: current.image_concept,
      })
      .select('id')
      .single()

    if (error || !data) return { ok: false, error: 'Speichern fehlgeschlagen.' }

    copyId = data.id
  }

  const { data: moved } = await supabase
    .from('user_words')
    .update({ word_id: copyId })
    .eq('word_id', wordId)
    .select('word_id')

  if (moved?.length === 0) {
    await supabase
      .from('user_words')
      .insert({ user_id: userId, word_id: copyId })
  }

  revalidatePath('/', 'layout')

  return { ok: true, id: copyId }
}
