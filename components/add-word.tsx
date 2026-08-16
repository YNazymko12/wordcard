'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { PencilLine, Save, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { generateCardAction, saveCardAction } from '@/lib/actions/generate'
import type { GeneratedCard } from '@/lib/ai/card-schema'
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

function toPreviewWord(card: GeneratedCard): Word {
  return {
    id: 'preview',
    word: card.word,
    article: card.article ?? undefined,
    type: card.type,
    level: card.level,
    translations: card.translations,
    image: '',
    verb: card.verb ?? undefined,
    preposition: card.preposition ?? undefined,
    examples: card.examples,
    notes: card.notes || undefined,
    dueForReview: false,
  }
}

export function AddWord({ lang }: { lang: TargetLang }) {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [card, setCard] = useState<GeneratedCard | null>(null)
  const [existingId, setExistingId] = useState<string | null>(null)
  const [saving, startSaving] = useTransition()
  const router = useRouter()

  async function generate() {
    if (!query.trim() || status === 'loading') return

    setStatus('loading')
    setCard(null)

    const result = await generateCardAction(query)

    if (!result.ok) {
      setStatus('idle')
      toast.error(result.error)
      return
    }

    setCard(result.card)
    setExistingId(result.existingId)
    setStatus('done')
  }

  function save() {
    if (!card) return

    startSaving(async () => {
      const result = await saveCardAction(card, existingId)

      if (!result.ok) {
        toast.error(result.error)
        return
      }

      toast.success(`„${card.word}“ gespeichert`)
      router.push(`/word/${result.id}`)
    })
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
          Wort hinzufügen
        </h1>
        <p className="text-sm text-muted-foreground">
          Gib ein deutsches Wort oder eine Wendung ein — die Karte entsteht
          automatisch.
        </p>
      </div>

      <InputGroup className="h-12 rounded-xl">
        <InputGroupAddon>
          <Sparkles className="text-primary" />
        </InputGroupAddon>
        <InputGroupInput
          placeholder="z. B. warten, das Haus, auf die Folter spannen…"
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

      {status === 'done' && card && (
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            {existingId ? 'Bereits in der Bibliothek' : 'Vorschau'}
          </p>
          <GeneratedCardView
            card={card}
            lang={lang}
            saving={saving}
            onSave={save}
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

function GeneratedCardView({
  card,
  lang,
  saving,
  onSave,
}: {
  card: GeneratedCard
  lang: TargetLang
  saving: boolean
  onSave: () => void
}) {
  const word = toPreviewWord(card)

  return (
    <Card className="overflow-hidden p-0">
      <div className="relative flex aspect-21/9 items-center justify-center bg-linear-to-br from-primary/15 to-teal/10">
        <span className="font-display text-6xl font-bold text-primary/25">
          {card.word.charAt(0).toUpperCase()}
        </span>
        <LevelBadge
          level={card.level}
          className="absolute top-3 right-3 h-6 px-2.5 shadow-sm"
        />
      </div>

      <CardContent className="flex flex-col gap-5 p-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-3xl font-bold tracking-tight">
              {card.article && (
                <span className={ARTICLE_COLOR[card.article]}>
                  {card.article}{' '}
                </span>
              )}
              {card.word}
            </h2>
            <p className="mt-1 text-muted-foreground">
              {translate(card.translations, lang)}
              {card.article && ` · ${ARTICLE_LABEL[card.article]}`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <TypeBadge type={card.type} />
            <PronounceButton text={card.word} />
          </div>
        </div>

        <WordGrammar word={word} />

        <WordExamples examples={card.examples} lang={lang} />

        {card.notes && <WordNotes notes={card.notes} />}

        <Separator />

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            variant="outline"
            onClick={() => toast('Bearbeiten kommt als Nächstes')}
          >
            <PencilLine data-icon="inline-start" />
            Bearbeiten
          </Button>
          <Button onClick={onSave} disabled={saving}>
            {saving ? <Spinner /> : <Save data-icon="inline-start" />}
            In Bibliothek speichern
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
