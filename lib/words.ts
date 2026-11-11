import { createClient } from '@/lib/supabase/server'
import type { WordInput } from '@/lib/ai/card-schema'
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
  image_concept: string | null
  created_by: string | null
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
    image: row.image_url,
    verb: row.verb ?? undefined,
    preposition: row.preposition ?? undefined,
    examples: row.examples,
    notes: row.notes ?? undefined,
    dueForReview: dueAt ? new Date(dueAt) <= new Date() : false,
    createdBy: row.created_by,
    hasImageConcept: Boolean(row.image_concept?.trim()),
  }
}

export function toWordInput(word: Word): WordInput {
  return {
    word: word.word,
    article: word.article ?? null,
    type: word.type,
    level: word.level,
    translations: {
      ru: word.translations.ru ?? '',
      uk: word.translations.uk ?? '',
      en: word.translations.en ?? '',
    },
    verb: word.verb ?? null,
    preposition: word.preposition ?? null,
    examples: word.examples.map((example) => ({
      de: example.de,
      tense: example.tense,
      translations: {
        ru: example.translations.ru ?? '',
        uk: example.translations.uk ?? '',
        en: example.translations.en ?? '',
      },
    })),
    notes: word.notes ?? '',
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
