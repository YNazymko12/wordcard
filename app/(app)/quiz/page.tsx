import type { Metadata } from 'next'
import { QuizSession } from '@/components/quiz-session'
import { buildQuiz } from '@/lib/quiz'
import { getLang } from '@/lib/lang'
import { WORDS } from '@/lib/vocab'

export const metadata: Metadata = {
  title: 'Test · Wortkarte',
}

export default async function QuizPage() {
  const lang = await getLang()
  const questions = buildQuiz(WORDS, lang)

  return <QuizSession questions={questions} />
}
