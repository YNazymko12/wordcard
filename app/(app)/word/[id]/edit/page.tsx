import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { BackButton } from '@/components/back-button'
import { EditWord } from '@/components/edit-word'
import { WordImage } from '@/components/word-image'
import { createClient } from '@/lib/supabase/server'
import { getWordById, toWordInput } from '@/lib/words'
import { ARTICLE_COLOR } from '@/lib/vocab'

export async function generateMetadata({
  params,
}: PageProps<'/word/[id]/edit'>): Promise<Metadata> {
  const { id } = await params
  const word = await getWordById(id)

  return { title: word ? `${word.word} bearbeiten` : 'Wortkarte' }
}

export default async function EditWordPage({
  params,
}: PageProps<'/word/[id]/edit'>) {
  const { id } = await params
  const word = await getWordById(id)

  if (!word) notFound()

  const supabase = await createClient()
  const { data: auth } = await supabase.auth.getClaims()

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-5">
      <BackButton href={`/word/${word.id}`} label="Zurück zum Wort" />

      <div className="flex items-center gap-4">
        <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-secondary">
          <WordImage src={word.image} word={word.word} sizes="64px" />
        </div>
        <div className="flex flex-col gap-1">
          <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
            Wort bearbeiten
          </h1>
          <p className="text-sm text-muted-foreground">
            {word.article && (
              <span className={ARTICLE_COLOR[word.article]}>
                {word.article}{' '}
              </span>
            )}
            {word.word}
          </p>
        </div>
      </div>

      <EditWord
        wordId={word.id}
        initial={toWordInput(word)}
        isAuthor={word.createdBy === auth?.claims?.sub}
      />
    </div>
  )
}
