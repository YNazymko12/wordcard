import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { LevelBadge, TypeBadge } from '@/components/vocab-badges'
import { PronounceButton } from '@/components/pronounce-button'
import { WordGrammar } from '@/components/word-grammar'
import { WordExamples } from '@/components/word-examples'
import { WordNotes } from '@/components/word-notes'
import { getLang } from '@/lib/lang'
import { cn } from '@/lib/utils'
import { getWordById } from '@/lib/words'
import { ARTICLE_COLOR, ARTICLE_LABEL, translate } from '@/lib/vocab'

export async function generateMetadata({
  params,
}: PageProps<'/word/[id]'>): Promise<Metadata> {
  const { id } = await params
  const word = await getWordById(id)

  return { title: word ? `${word.word} · Wortkarte` : 'Wortkarte' }
}

export default async function WordPage({ params }: PageProps<'/word/[id]'>) {
  const { id } = await params
  const word = await getWordById(id)

  if (!word) notFound()

  const lang = await getLang()

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-5">
      <Button
        variant="ghost"
        size="sm"
        className="-ml-2 w-fit"
        nativeButton={false}
        render={<Link href="/" />}
      >
        <ArrowLeft data-icon="inline-start" />
        Zurück zur Bibliothek
      </Button>

      <Card className="overflow-hidden p-0">
        <div className="relative aspect-16/10 bg-secondary">
          <Image
            src={word.image}
            alt={word.word}
            fill
            sizes="(max-width: 768px) 100vw, 640px"
            className="object-cover"
            priority
          />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-black/75 via-black/30 to-transparent" />
          <div className="absolute top-3 right-3">
            <LevelBadge level={word.level} className="h-6 px-2.5 shadow-sm" />
          </div>
          <div className="absolute inset-x-4 bottom-3 flex items-end justify-between gap-3">
            <h1 className="font-display text-3xl font-bold tracking-tight text-white drop-shadow-sm sm:text-4xl">
              {word.article && (
                <span className="opacity-90">{word.article} </span>
              )}
              {word.word}
            </h1>
            <PronounceButton text={word.word} variant="secondary" />
          </div>
        </div>

        <CardContent className="flex flex-col gap-5 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-lg font-medium">
                {translate(word.translations, lang)}
              </p>
              {word.article && (
                <p className={cn('text-sm', ARTICLE_COLOR[word.article])}>
                  {word.article} · {ARTICLE_LABEL[word.article]}
                </p>
              )}
            </div>
            <TypeBadge type={word.type} />
          </div>

          <WordGrammar word={word} />

          <WordExamples examples={word.examples} lang={lang} />

          {word.notes && <WordNotes notes={word.notes} />}
        </CardContent>
      </Card>
    </div>
  )
}
