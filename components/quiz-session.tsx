'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Check, RotateCcw, Trophy, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { LevelBadge } from '@/components/vocab-badges'
import { cn } from '@/lib/utils'
import type { Question } from '@/lib/quiz'

export function QuizSession({ questions }: { questions: Question[] }) {
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)

  function choose(option: string) {
    if (selected !== null) return

    setSelected(option)
    if (option === questions[index].answer) setScore((value) => value + 1)
  }

  function next() {
    if (index + 1 >= questions.length) {
      setDone(true)
      return
    }

    setSelected(null)
    setIndex((value) => value + 1)
  }

  function restart() {
    setIndex(0)
    setSelected(null)
    setScore(0)
    setDone(false)
  }

  if (questions.length === 0) {
    return (
      <div className="mx-auto flex max-w-md flex-1 flex-col items-center justify-center text-center">
        <h1 className="font-display text-2xl font-bold">Noch keine Fragen</h1>
        <p className="mt-2 text-muted-foreground">
          Füge ein paar Wörter hinzu, dann entsteht der Test automatisch.
        </p>
        <Button
          className="mt-12"
          nativeButton={false}
          render={<Link href="/add" />}
        >
          Wort hinzufügen
        </Button>
      </div>
    )
  }

  if (done) {
    const percent = Math.round((score / questions.length) * 100)

    return (
      <div className="mx-auto flex max-w-md flex-1 flex-col items-center justify-center text-center">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/15 text-primary">
          <Trophy className="size-8" />
        </div>
        <h1 className="mt-8 font-display text-2xl font-bold">Test beendet</h1>
        <p className="mt-2 text-muted-foreground">
          <span className="font-semibold text-foreground">
            {score} von {questions.length}
          </span>{' '}
          richtig ({percent} %)
        </p>
        <div className="mt-12 flex gap-3">
          <Button
            variant="outline"
            nativeButton={false}
            render={<Link href="/" />}
          >
            Zurück zur Bibliothek
          </Button>
          <Button onClick={restart}>
            <RotateCcw data-icon="inline-start" />
            Nochmal
          </Button>
        </div>
      </div>
    )
  }

  const question = questions[index]
  const answered = selected !== null
  const isCorrect = selected === question.answer

  return (
    <div className="mx-auto flex max-w-md flex-1 flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon-sm"
          nativeButton={false}
          render={<Link href="/" />}
          aria-label="Test beenden"
        >
          <X />
        </Button>
        <Progress
          value={(index / questions.length) * 100}
          className="h-2 flex-1"
        />
        <span className="text-sm font-medium text-muted-foreground tabular-nums">
          {index + 1}/{questions.length}
        </span>
      </div>

      <div className="flex flex-1 flex-col justify-center gap-6">
        <Card className="gap-0 p-0">
          <CardContent className="flex flex-col items-center gap-3 p-8 text-center">
            <div className="flex items-center gap-2">
              <span className="text-label font-medium text-muted-foreground">
                {question.prompt}
              </span>
              <LevelBadge level={question.level} />
            </div>
            <p className="font-display text-3xl font-bold tracking-tight">
              {question.subject}
            </p>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-3">
          {question.options.map((option) => {
            const isAnswer = option === question.answer
            const isPicked = option === selected

            return (
              <button
                key={option}
                type="button"
                onClick={() => choose(option)}
                disabled={answered}
                className={cn(
                  'flex min-h-12 items-center justify-between rounded-2xl border px-4 py-3 text-left font-medium transition-all disabled:cursor-default',
                  !answered &&
                    'border-border bg-card hover:border-primary/40 hover:bg-secondary',
                  answered &&
                    isAnswer &&
                    'border-success/40 bg-success/10 text-success',
                  answered &&
                    isPicked &&
                    !isAnswer &&
                    'border-destructive/40 bg-destructive/10 text-destructive',
                  answered && !isAnswer && !isPicked && 'opacity-50',
                )}
              >
                {option}
                {answered && isAnswer && <Check className="size-5" />}
                {answered && isPicked && !isAnswer && <X className="size-5" />}
              </button>
            )
          })}
        </div>

        <div className="mt-2 flex items-center justify-between gap-4">
          <p
            className={cn(
              'text-base font-medium',
              !answered && 'invisible',
              isCorrect ? 'text-success' : 'text-destructive',
            )}
          >
            {isCorrect ? 'Richtig!' : `Antwort: ${question.answer}`}
          </p>
          <Button className="h-11 px-6" disabled={!answered} onClick={next}>
            {index + 1 >= questions.length ? 'Beenden' : 'Weiter'}
            <ArrowRight data-icon="inline-end" />
          </Button>
        </div>
      </div>
    </div>
  )
}
