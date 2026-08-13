import { notFound } from 'next/navigation'
import { getWord, translate } from '@/lib/vocab'
import { getLang } from '@/lib/lang'

export default async function WordPage({ params }: PageProps<'/word/[id]'>) {
  const { id } = await params
  const word = getWord(id)

  if (!word) notFound()

  const lang = await getLang()

  return (
    <div className="flex flex-col gap-2">
      <h1 className="font-display text-3xl font-bold tracking-tight">
        {word.article && <span className="opacity-70">{word.article} </span>}
        {word.word}
      </h1>
      <p className="text-muted-foreground">
        {translate(word.translations, lang)}
      </p>
    </div>
  )
}
