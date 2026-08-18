export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'
export type WordType = 'noun' | 'verb' | 'adjective' | 'phrase'
export type Article = 'der' | 'die' | 'das'
export type GermanCase = 'Akkusativ' | 'Dativ' | 'Genitiv'
export type Tense = 'Präsens' | 'Perfekt'

export type TargetLang = 'ru' | 'uk' | 'en'

export type Translations = Partial<Record<TargetLang, string>>

export interface VerbForms {
  infinitive: string
  present3rd: string
  praeteritum: string
  perfekt: string
}

export interface ExampleSentence {
  de: string
  translations: Translations
  tense: Tense
}

export interface Word {
  id: string
  word: string
  article?: Article
  type: WordType
  level: CEFRLevel
  translations: Translations
  image: string | null
  verb?: VerbForms
  preposition?: { prep: string; case: GermanCase }
  examples: ExampleSentence[]
  notes?: string
  dueForReview: boolean
}

export const LEVELS: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
export const TYPES: WordType[] = ['noun', 'verb', 'adjective', 'phrase']

export const TARGET_LANGS: TargetLang[] = ['ru', 'uk', 'en']
export const DEFAULT_LANG: TargetLang = 'ru'

export const LANG_LABEL: Record<TargetLang, string> = {
  ru: 'Russisch',
  uk: 'Ukrainisch',
  en: 'Englisch',
}

export function translate(t: Translations, lang: TargetLang): string {
  return t[lang] ?? t.en ?? t.ru ?? t.uk ?? ''
}

// Tailwind scans source as text — class names must be complete literals
export const LEVEL_CLASSES: Record<CEFRLevel, string> = {
  A1: 'bg-[var(--lvl-a1-bg)] text-[var(--lvl-a1-fg)]',
  A2: 'bg-[var(--lvl-a2-bg)] text-[var(--lvl-a2-fg)]',
  B1: 'bg-[var(--lvl-b1-bg)] text-[var(--lvl-b1-fg)]',
  B2: 'bg-[var(--lvl-b2-bg)] text-[var(--lvl-b2-fg)]',
  C1: 'bg-[var(--lvl-c1-bg)] text-[var(--lvl-c1-fg)]',
  C2: 'bg-[var(--lvl-c2-bg)] text-[var(--lvl-c2-fg)]',
}

export const ARTICLE_LABEL: Record<Article, string> = {
  der: 'maskulin',
  die: 'feminin',
  das: 'neutral',
}

export const ARTICLE_COLOR: Record<Article, string> = {
  der: 'text-primary',
  die: 'text-[var(--chart-5)]',
  das: 'text-teal',
}

export const TYPE_LABEL: Record<WordType, string> = {
  noun: 'Nomen',
  verb: 'Verb',
  adjective: 'Adjektiv',
  phrase: 'Wendung',
}
