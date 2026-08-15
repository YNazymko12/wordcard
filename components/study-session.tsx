'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Check, RotateCcw, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { LevelBadge } from '@/components/vocab-badges'
import { PronounceButton } from '@/components/pronounce-button'
import { cn } from '@/lib/utils'
import {
  ARTICLE_COLOR,
  translate,
  TYPE_LABEL,
  type TargetLang,
  type Word,
} from '@/lib/vocab'

export function StudySession({
  deck,
  lang,
}: {
  deck: Word[]
  lang: TargetLang
}) {
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [known, setKnown] = useState(0)
  const [done, setDone] = useState(false)

  function next(gotIt: boolean) {
    if (gotIt) setKnown((value) => value + 1)

    if (index + 1 >= deck.length) {
      setDone(true)
      return
    }

    setFlipped(false)
    setIndex((value) => value + 1)
  }

  function restart() {
    setIndex(0)
    setFlipped(false)
    setKnown(0)
    setDone(false)
  }

  if (deck.length === 0) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-16 text-center">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-success/15 text-success">
          <Check className="size-8" />
        </div>
        <h1 className="font-display text-2xl font-bold">Alles wiederholt</h1>
        <p className="text-muted-foreground">
          Für heute sind keine Karten fällig.
        </p>
        <Button
          variant="outline"
          nativeButton={false}
          render={<Link href="/" />}
        >
          Zurück zur Bibliothek
        </Button>
      </div>
    )
  }

  if (done) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-6 py-12 text-center">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-success/15 text-success">
          <Check className="size-8" />
        </div>
        <div className="flex flex-col gap-1">
          <h1 className="font-display text-2xl font-bold">Sitzung beendet</h1>
          <p className="text-muted-foreground">
            Du wusstest{' '}
            <span className="font-semibold text-foreground">
              {known} von {deck.length}
            </span>{' '}
            Karten.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            nativeButton={false}
            render={<Link href="/" />}
          >
            Zurück zur Bibliothek
          </Button>
          <Button onClick={restart}>
            <RotateCcw data-icon="inline-start" />
            Nochmal lernen
          </Button>
        </div>
      </div>
    )
  }

  const card = deck[index]
  const progress = ((index + (flipped ? 0.5 : 0)) / deck.length) * 100

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col gap-5">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon-sm"
          nativeButton={false}
          render={<Link href="/" />}
          aria-label="Lernen beenden"
        >
          <X />
        </Button>
        <Progress value={progress} className="h-2 flex-1" />
        <span className="text-sm font-medium text-muted-foreground tabular-nums">
          {index + 1}/{deck.length}
        </span>
      </div>

      <div className="flex flex-1 items-center [perspective:1600px]">
        <button
          type="button"
          onClick={() => setFlipped((value) => !value)}
          className="relative h-96 w-full transition-transform duration-500 [transform-style:preserve-3d]"
          style={{ transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
          aria-label="Karte umdrehen"
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-3xl border border-border bg-card p-8 shadow-lg shadow-primary/5 [backface-visibility:hidden]">
            <div className="absolute top-4 right-4">
              <LevelBadge level={card.level} />
            </div>
            <span className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
              {TYPE_LABEL[card.type]}
            </span>
            <p className="text-center font-display text-4xl font-bold tracking-tight">
              {card.article && (
                <span className={ARTICLE_COLOR[card.article]}>
                  {card.article}{' '}
                </span>
              )}
              {card.word}
            </p>
            <span className="text-xs text-muted-foreground">
              Tippen zum Umdrehen
            </span>
          </div>

          <div className="absolute inset-0 flex [transform:rotateY(180deg)] flex-col items-center justify-center gap-5 rounded-3xl border border-primary/20 bg-linear-to-b from-primary/10 to-teal/5 p-8 [backface-visibility:hidden]">
            <p className="text-center font-display text-3xl font-bold tracking-tight text-primary">
              {translate(card.translations, lang)}
            </p>
            <div className="w-full rounded-2xl border border-border bg-card/70 p-4 text-center">
              <p className="leading-snug font-medium">{card.examples[0].de}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {translate(card.examples[0].translations, lang)}
              </p>
            </div>
          </div>
        </button>
      </div>

      <div className="flex items-center gap-3">
        {flipped && <PronounceButton text={card.word} variant="secondary" />}
        <Button
          variant="outline"
          className={cn(
            'h-12 flex-1 transition-opacity',
            !flipped && 'invisible',
          )}
          onClick={() => next(false)}
        >
          <ArrowLeft data-icon="inline-start" />
          Nochmal
        </Button>
        <Button
          className={cn(
            'h-12 flex-1 transition-opacity',
            !flipped && 'invisible',
          )}
          onClick={() => next(true)}
        >
          Gewusst
          <ArrowRight data-icon="inline-end" />
        </Button>
      </div>
    </div>
  )
}
