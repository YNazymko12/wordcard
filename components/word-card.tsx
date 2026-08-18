import Link from 'next/link'
import { Clock } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { LevelBadge } from '@/components/vocab-badges'
import { cn } from '@/lib/utils'
import {
  ARTICLE_COLOR,
  translate,
  TYPE_LABEL,
  type TargetLang,
  type Word,
} from '@/lib/vocab'
import { WordImage } from './word-image'

export function WordCard({ word, lang }: { word: Word; lang: TargetLang }) {
  return (
    <Link href={`/word/${word.id}`} className="group">
      <Card className="gap-0 overflow-hidden p-0 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/5">
        <div className="relative aspect-4/3 overflow-hidden bg-secondary">
          <WordImage
            src={word.image}
            word={word.word}
            sizes="(max-width: 640px) 50vw, 240px"
          />
          <LevelBadge
            level={word.level}
            className="absolute top-2 right-2 shadow-sm"
          />
          {word.dueForReview && (
            <span className="absolute bottom-2 left-2 inline-flex h-5 items-center gap-1 rounded-full bg-background/85 px-2 text-[10px] font-medium backdrop-blur sm:top-2 sm:bottom-auto">
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
