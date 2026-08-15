import type { Metadata } from 'next'
import { AddWord } from '@/components/add-word'
import { getLang } from '@/lib/lang'
import { getCollection } from '@/lib/words'

export const metadata: Metadata = {
  title: 'Wort hinzufügen · Wortkarte',
}

export default async function AddWordPage() {
  const lang = await getLang()
  const words = await getCollection()

  return <AddWord lang={lang} words={words} />
}
