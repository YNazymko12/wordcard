import Image from 'next/image'
import Link from 'next/link'
import { Clock } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { LevelBadge } from '@/components/vocab-badges'
import { cn } from '@/lib/utils'
import {
  translate,
  TYPE_LABEL,
  type Article,
  type TargetLang,
  type Word,
} from '@/lib/vocab'

const ARTICLE_COLOR: Record<Article, string> = {
  der: 'text-primary',
  die: 'text-[var(--chart-5)]',
  das: 'text-teal',
}

export function WordCard({ word, lang }: { word: Word; lang: TargetLang }) {
  return (
    <Link href={`/word/${word.id}`} className="group">
      <Card className="gap-0 overflow-hidden p-0 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/5">
        <div className="relative aspect-4/3 overflow-hidden bg-secondary">
          <Image
            src={word.image}
            alt={word.word}
            fill
            sizes="(max-width: 640px) 50vw, 240px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute top-2 right-2">
            <LevelBadge level={word.level} className="shadow-sm" />
          </div>
          {word.dueForReview && (
            <span className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-background/85 px-2 py-0.5 text-[10px] font-medium backdrop-blur">
              <Clock className="size-3" />
              Fällig
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1 p-3">
          <p className="font-display text-base leading-tight font-semibold">
            {word.article && (
              <span className={cn('font-medium', ARTICLE_COLOR[word.article])}>
                {word.article}{' '}
              </span>
            )}
            {word.word}
          </p>
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-xs text-muted-foreground">
              {translate(word.translations, lang)}
            </p>
            <span className="shrink-0 text-[11px] font-medium text-muted-foreground">
              {TYPE_LABEL[word.type]}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  )
}
