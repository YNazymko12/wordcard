import type { Metadata } from 'next'
import { StudySession } from '@/components/study-session'
import { getLang } from '@/lib/lang'
import { getCollection } from '@/lib/words'
import { shuffle } from '@/lib/shuffle'

export const metadata: Metadata = {
  title: 'Lernen · Wortkarte',
}

export default async function StudyPage() {
  const lang = await getLang()
  const words = await getCollection()
  const due = words.filter((word) => word.dueForReview)

  return (
    <StudySession deck={shuffle(due.length > 0 ? due : words)} lang={lang} />
  )
}
