import {
  translate,
  type CEFRLevel,
  type TargetLang,
  type Word,
} from '@/lib/vocab'

export interface Question {
  id: string
  prompt: string
  subject: string
  level: CEFRLevel
  options: string[]
  answer: string
}

const ARTICLES = ['der', 'die', 'das']

function shuffle<T>(items: T[]): T[] {
  const result = [...items]

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }

  return result
}

export function buildQuiz(
  words: Word[],
  lang: TargetLang,
  size = 5,
): Question[] {
  const questions: Question[] = []

  for (const word of words) {
    if (word.article) {
      questions.push({
        id: `${word.id}-article`,
        prompt: 'Wähle den richtigen Artikel',
        subject: `___ ${word.word}`,
        level: word.level,
        options: ARTICLES,
        answer: word.article,
      })
    }

    if (word.verb) {
      questions.push({
        id: `${word.id}-auxiliary`,
        prompt: 'Perfekt mit haben oder sein?',
        subject: word.word,
        level: word.level,
        options: ['haben', 'sein'],
        answer: word.verb.perfekt.startsWith('ist') ? 'sein' : 'haben',
      })
    }

    const answer = translate(word.translations, lang)
    const distractors = words
      .filter((other) => other.id !== word.id)
      .map((other) => translate(other.translations, lang))
      .filter((text) => text.length > 0 && text !== answer)

    if (answer.length > 0 && distractors.length >= 3) {
      questions.push({
        id: `${word.id}-meaning`,
        prompt: 'Was bedeutet das Wort?',
        subject: word.word,
        level: word.level,
        options: shuffle([answer, ...shuffle(distractors).slice(0, 3)]),
        answer,
      })
    }
  }

  return shuffle(questions).slice(0, size)
}
