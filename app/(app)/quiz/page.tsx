import type { Metadata } from 'next'
import { QuizSession } from '@/components/quiz-session'
import { buildQuiz } from '@/lib/quiz'
import { getLang } from '@/lib/lang'
import { getCollection } from '@/lib/words'

export const metadata: Metadata = {
  title: 'Test · Wortkarte',
}

export default async function QuizPage() {
  const lang = await getLang()
  const words = await getCollection()
  const questions = buildQuiz(words, lang)

  return <QuizSession questions={questions} />
}
