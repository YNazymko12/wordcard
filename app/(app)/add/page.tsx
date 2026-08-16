import type { Metadata } from 'next'
import { AddWord } from '@/components/add-word'
import { getLang } from '@/lib/lang'

export const metadata: Metadata = {
  title: 'Wort hinzufügen · Wortkarte',
}

export default async function AddWordPage() {
  const lang = await getLang()

  return <AddWord lang={lang} />
}
