import { createClient } from '@/lib/supabase/server'
import type {
  Article,
  CEFRLevel,
  ExampleSentence,
  GermanCase,
  Translations,
  VerbForms,
  Word,
  WordType,
} from '@/lib/vocab'

const SELECT = '*, user_words!inner(due_at)'

interface WordRow {
  id: string
  word: string
  article: string | null
  type: string
  level: string
  translations: Translations
  examples: ExampleSentence[]
  verb: VerbForms | null
  preposition: { prep: string; case: GermanCase } | null
  notes: string | null
  image_url: string | null
  user_words: { due_at: string }[]
}

function toWord(row: WordRow): Word {
  const dueAt = row.user_words[0]?.due_at

  return {
    id: row.id,
    word: row.word,
    article: (row.article ?? undefined) as Article | undefined,
    type: row.type as WordType,
    level: row.level as CEFRLevel,
    translations: row.translations,
    image: row.image_url ?? '/images/placeholder.png',
    verb: row.verb ?? undefined,
    preposition: row.preposition ?? undefined,
    examples: row.examples,
    notes: row.notes ?? undefined,
    dueForReview: dueAt ? new Date(dueAt) <= new Date() : false,
  }
}

export async function getCollection(): Promise<Word[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('words')
    .select(SELECT)
    .order('word')

  if (error) throw error

  return (data as unknown as WordRow[]).map(toWord)
}

export async function getWordById(id: string): Promise<Word | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('words')
    .select(SELECT)
    .eq('id', id)
    .maybeSingle()

  if (error) throw error

  return data ? toWord(data as unknown as WordRow) : null
}
