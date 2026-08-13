import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ChevronDown, Lightbulb, Quote } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { LevelBadge, TypeBadge } from '@/components/vocab-badges'
import { getLang } from '@/lib/lang'
import { cn } from '@/lib/utils'
import { ARTICLE_COLOR, ARTICLE_LABEL, getWord, translate } from '@/lib/vocab'

export async function generateMetadata({
  params,
}: PageProps<'/word/[id]'>): Promise<Metadata> {
  const { id } = await params
  const word = getWord(id)

  return { title: word ? `${word.word} · Wortkarte` : 'Wortkarte' }
}

export default async function WordPage({ params }: PageProps<'/word/[id]'>) {
  const { id } = await params
  const word = getWord(id)

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
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
          <div className="absolute top-3 right-3">
            <LevelBadge level={word.level} className="h-6 px-2.5 shadow-sm" />
          </div>
          <h1 className="absolute inset-x-4 bottom-3 font-display text-3xl font-bold tracking-tight text-white drop-shadow-sm sm:text-4xl">
            {word.article && (
              <span className="opacity-90">{word.article} </span>
            )}
            {word.word}
          </h1>
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

          <Collapsible defaultOpen>
            <CollapsibleTrigger className="group flex w-full items-center justify-between rounded-xl bg-secondary/50 px-3 py-2.5 text-sm font-semibold transition-colors hover:bg-secondary">
              Grammatik
              <ChevronDown className="size-4 text-muted-foreground transition-transform group-data-[panel-open]:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent className="flex flex-col gap-3 pt-3">
              {word.verb && (
                <div className="overflow-hidden rounded-xl border border-border">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-secondary/60">
                        <TableHead>Infinitiv</TableHead>
                        <TableHead>Präsens</TableHead>
                        <TableHead>Präteritum</TableHead>
                        <TableHead>Perfekt</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">
                          {word.verb.infinitive}
                        </TableCell>
                        <TableCell>{word.verb.present3rd}</TableCell>
                        <TableCell>{word.verb.praeteritum}</TableCell>
                        <TableCell className="font-medium text-primary">
                          {word.verb.perfekt}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              )}

              {word.preposition && (
                <div className="flex items-center gap-2 rounded-xl border border-teal/30 bg-teal/5 px-3 py-2.5 text-sm">
                  <span className="font-semibold text-teal">
                    {word.preposition.prep}
                  </span>
                  <span className="text-muted-foreground">+</span>
                  <span className="font-medium">{word.preposition.case}</span>
                </div>
              )}

              {!word.verb && !word.preposition && (
                <p className="text-sm text-muted-foreground">
                  {word.article
                    ? `Nomen · ${word.article} (${ARTICLE_LABEL[word.article]})`
                    : 'Keine weiteren grammatischen Hinweise.'}
                </p>
              )}
            </CollapsibleContent>
          </Collapsible>

          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Beispiele
            </p>
            <div className="flex flex-col gap-3">
              {word.examples.map((example) => (
                <figure
                  key={example.de}
                  className="relative rounded-xl border-l-2 border-primary bg-secondary/40 py-3 pr-3 pl-4"
                >
                  <Quote className="absolute top-3 right-3 size-4 text-primary/25" />
                  <blockquote className="leading-snug font-medium">
                    {example.de}
                  </blockquote>
                  <figcaption className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                    <span>{translate(example.translations, lang)}</span>
                    <span className="rounded-full bg-background px-1.5 py-0.5 text-[10px] font-medium">
                      {example.tense}
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>

          {word.notes && (
            <div className="flex gap-3 rounded-xl border border-accent-foreground/15 bg-accent/50 p-3.5">
              <Lightbulb className="size-4 shrink-0 text-accent-foreground" />
              <div className="flex flex-col gap-0.5">
                <p className="text-sm font-semibold text-accent-foreground">
                  Notizen &amp; Besonderheiten
                </p>
                <p className="text-sm text-foreground/80">{word.notes}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
