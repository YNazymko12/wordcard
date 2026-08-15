import type { Metadata } from 'next'
import { StudySession } from '@/components/study-session'
import { getLang } from '@/lib/lang'
import { WORDS } from '@/lib/vocab'

export const metadata: Metadata = {
  title: 'Lernen · Wortkarte',
}

export default async function StudyPage() {
  const lang = await getLang()
  const due = WORDS.filter((word) => word.dueForReview)

  return <StudySession deck={due.length > 0 ? due : WORDS} lang={lang} />
}
