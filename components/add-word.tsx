'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { PencilLine, Save, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Spinner } from '@/components/ui/spinner'
import { LevelBadge, TypeBadge } from '@/components/vocab-badges'
import { PronounceButton } from '@/components/pronounce-button'
import { WordGrammar } from '@/components/word-grammar'
import { WordExamples } from '@/components/word-examples'
import { WordNotes } from '@/components/word-notes'
import {
  ARTICLE_COLOR,
  ARTICLE_LABEL,
  translate,
  type TargetLang,
  type Word,
} from '@/lib/vocab'

type Status = 'idle' | 'loading' | 'done'

function fakeGenerate(query: string, words: Word[]): Word | null {
  if (words.length === 0) return null

  const normalized = query.trim().toLowerCase()

  return (
    words.find((word) => word.word.toLowerCase() === normalized) ??
    words[Math.floor(Math.random() * words.length)]
  )
}

export function AddWord({ lang, words }: { lang: TargetLang; words: Word[] }) {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [result, setResult] = useState<Word | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [])

  function generate() {
    if (!query.trim() || status === 'loading') return

    setStatus('loading')
    setResult(null)

    timer.current = setTimeout(() => {
      setResult(fakeGenerate(query, words))
      setStatus('done')
    }, 1500)
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
          Wort hinzufügen
        </h1>
        <p className="text-sm text-muted-foreground">
          Gib ein deutsches Wort ein — die Karte entsteht automatisch.
        </p>
      </div>

      <InputGroup className="h-12 rounded-xl">
        <InputGroupAddon>
          <Sparkles className="text-primary" />
        </InputGroupAddon>
        <InputGroupInput
          placeholder="z. B. warten, das Haus, die Freiheit…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.nativeEvent.isComposing) {
              generate()
            }
          }}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            variant="default"
            size="sm"
            disabled={!query.trim() || status === 'loading'}
            onClick={generate}
          >
            {status === 'loading' ? (
              <Spinner />
            ) : (
              <Sparkles data-icon="inline-start" />
            )}
            Generieren
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>

      {status === 'loading' && <LoadingPreview />}

      {status === 'done' && result && (
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Vorschau
          </p>
          <GeneratedCard
            word={result}
            lang={lang}
            onSave={() =>
              toast.success(`„${result.word}“ ist bereit`, {
                description: 'Speichern folgt mit der Datenbank.',
              })
            }
          />
        </div>
      )}
    </div>
  )
}

function LoadingPreview() {
  return (
    <Card className="overflow-hidden p-0">
      <Skeleton className="aspect-21/9 w-full rounded-none" />
      <CardContent className="flex flex-col gap-4 p-5">
        <div className="flex items-center justify-between">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-5 w-12 rounded-full" />
        </div>
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-20 w-full rounded-xl" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </CardContent>
    </Card>
  )
}

function GeneratedCard({
  word,
  lang,
  onSave,
}: {
  word: Word
  lang: TargetLang
  onSave: () => void
}) {
  return (
    <Card className="overflow-hidden p-0">
      <div className="relative aspect-21/9 bg-secondary">
        <Image
          src={word.image}
          alt={word.word}
          fill
          sizes="(max-width: 768px) 100vw, 640px"
          className="object-cover"
        />
        <div className="absolute top-3 right-3">
          <LevelBadge level={word.level} className="h-6 px-2.5 shadow-sm" />
        </div>
      </div>

      <CardContent className="flex flex-col gap-5 p-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-3xl font-bold tracking-tight">
              {word.article && (
                <span className={ARTICLE_COLOR[word.article]}>
                  {word.article}{' '}
                </span>
              )}
              {word.word}
            </h2>
            <p className="mt-1 text-muted-foreground">
              {translate(word.translations, lang)}
              {word.article && ` · ${ARTICLE_LABEL[word.article]}`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <TypeBadge type={word.type} />
            <PronounceButton text={word.word} />
          </div>
        </div>

        <WordGrammar word={word} />

        <WordExamples examples={word.examples} lang={lang} />

        {word.notes && <WordNotes notes={word.notes} />}

        <Separator />

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            variant="outline"
            onClick={() => toast('Bearbeiten kommt als Nächstes')}
          >
            <PencilLine data-icon="inline-start" />
            Bearbeiten
          </Button>
          <Button onClick={onSave}>
            <Save data-icon="inline-start" />
            In Bibliothek speichern
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
