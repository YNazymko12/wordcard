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
  image: string
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

export const WORDS: Word[] = [
  {
    id: 'haus',
    word: 'Haus',
    article: 'das',
    type: 'noun',
    level: 'A1',
    translations: { ru: 'дом', uk: 'дім', en: 'house' },
    image: '/images/haus.png',
    examples: [
      {
        de: 'Das Haus ist sehr groß.',
        translations: {
          ru: 'Дом очень большой.',
          uk: 'Дім дуже великий.',
          en: 'The house is very big.',
        },
        tense: 'Präsens',
      },
      {
        de: 'Wir haben ein neues Haus gekauft.',
        translations: {
          ru: 'Мы купили новый дом.',
          uk: 'Ми купили новий дім.',
          en: 'We bought a new house.',
        },
        tense: 'Perfekt',
      },
    ],
    notes:
      'Plural: die Häuser. Häufig in Komposita: das Krankenhaus, das Rathaus.',
    dueForReview: true,
  },
  {
    id: 'hund',
    word: 'Hund',
    article: 'der',
    type: 'noun',
    level: 'A1',
    translations: { ru: 'собака', uk: 'собака', en: 'dog' },
    image: '/images/hund.png',
    examples: [
      {
        de: 'Der Hund spielt im Garten.',
        translations: {
          ru: 'Собака играет в саду.',
          uk: 'Собака грається в саду.',
          en: 'The dog plays in the garden.',
        },
        tense: 'Präsens',
      },
      {
        de: 'Der Hund hat den Ball geholt.',
        translations: {
          ru: 'Собака принесла мяч.',
          uk: "Собака принесла м'яч.",
          en: 'The dog fetched the ball.',
        },
        tense: 'Perfekt',
      },
    ],
    notes: 'Plural: die Hunde. Verkleinerung: das Hündchen.',
    dueForReview: false,
  },
  {
    id: 'katze',
    word: 'Katze',
    article: 'die',
    type: 'noun',
    level: 'A1',
    translations: { ru: 'кошка', uk: 'кішка', en: 'cat' },
    image: '/images/katze.png',
    examples: [
      {
        de: 'Die Katze schläft auf dem Sofa.',
        translations: {
          ru: 'Кошка спит на диване.',
          uk: 'Кішка спить на дивані.',
          en: 'The cat sleeps on the sofa.',
        },
        tense: 'Präsens',
      },
      {
        de: 'Die Katze ist auf den Baum geklettert.',
        translations: {
          ru: 'Кошка залезла на дерево.',
          uk: 'Кішка залізла на дерево.',
          en: 'The cat climbed up the tree.',
        },
        tense: 'Perfekt',
      },
    ],
    notes: 'Plural: die Katzen.',
    dueForReview: true,
  },
  {
    id: 'gehen',
    word: 'gehen',
    type: 'verb',
    level: 'A1',
    translations: {
      ru: 'идти / ходить',
      uk: 'йти / ходити',
      en: 'to go / to walk',
    },
    image: '/images/gehen.png',
    verb: {
      infinitive: 'gehen',
      present3rd: 'geht',
      praeteritum: 'ging',
      perfekt: 'ist gegangen',
    },
    examples: [
      {
        de: 'Ich gehe jeden Morgen zur Arbeit.',
        translations: {
          ru: 'Я каждое утро иду на работу.',
          uk: 'Я щоранку йду на роботу.',
          en: 'I go to work every morning.',
        },
        tense: 'Präsens',
      },
      {
        de: 'Sie ist nach Hause gegangen.',
        translations: {
          ru: 'Она пошла домой.',
          uk: 'Вона пішла додому.',
          en: 'She went home.',
        },
        tense: 'Perfekt',
      },
    ],
    notes: 'Bewegungsverb — Perfekt mit „sein“. Unregelmäßig.',
    dueForReview: false,
  },
  {
    id: 'warten',
    word: 'warten',
    type: 'verb',
    level: 'A2',
    translations: { ru: 'ждать', uk: 'чекати', en: 'to wait' },
    image: '/images/warten.png',
    verb: {
      infinitive: 'warten',
      present3rd: 'wartet',
      praeteritum: 'wartete',
      perfekt: 'hat gewartet',
    },
    preposition: { prep: 'warten auf', case: 'Akkusativ' },
    examples: [
      {
        de: 'Ich warte auf den Bus.',
        translations: {
          ru: 'Я жду автобус.',
          uk: 'Я чекаю на автобус.',
          en: 'I am waiting for the bus.',
        },
        tense: 'Präsens',
      },
      {
        de: 'Wir haben lange auf dich gewartet.',
        translations: {
          ru: 'Мы долго тебя ждали.',
          uk: 'Ми довго на тебе чекали.',
          en: 'We waited for you a long time.',
        },
        tense: 'Perfekt',
      },
    ],
    notes: 'Regelmäßiges Verb. „warten auf“ verlangt den Akkusativ.',
    dueForReview: true,
  },
  {
    id: 'freiheit',
    word: 'Freiheit',
    article: 'die',
    type: 'noun',
    level: 'B2',
    translations: { ru: 'свобода', uk: 'свобода', en: 'freedom / liberty' },
    image: '/images/freiheit.png',
    examples: [
      {
        de: 'Die Freiheit ist ein hohes Gut.',
        translations: {
          ru: 'Свобода — большая ценность.',
          uk: 'Свобода — велика цінність.',
          en: 'Freedom is a precious good.',
        },
        tense: 'Präsens',
      },
      {
        de: 'Sie haben für ihre Freiheit gekämpft.',
        translations: {
          ru: 'Они боролись за свою свободу.',
          uk: 'Вони боролися за свою свободу.',
          en: 'They fought for their freedom.',
        },
        tense: 'Perfekt',
      },
    ],
    notes: 'Abstraktes Nomen. Nachsilbe „-heit“ ist immer feminin.',
    dueForReview: true,
  },
]

export function getWord(id: string): Word | undefined {
  return WORDS.find((w) => w.id === id)
}
