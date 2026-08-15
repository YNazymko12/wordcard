import Link from 'next/link'
import { BookOpen, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { StatCard } from '@/components/stat-card'
import { WordLibrary } from '@/components/word-library'
import { getLang } from '@/lib/lang'
import { getCollection } from '@/lib/words'

export default async function LibraryPage() {
  const lang = await getLang()
  const words = await getCollection()

  const dueCount = words.filter((word) => word.dueForReview).length

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
          Bibliothek
        </h1>
        <p className="text-sm text-muted-foreground">
          {words.length} Wörter in deiner Sammlung
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <StatCard icon={Clock} value={dueCount} label="Zu wiederholen" accent />
        <StatCard icon={BookOpen} value={words.length} label="Wörter gesamt" />
      </div>

      {dueCount > 0 && (
        <Card className="flex-row items-center justify-between gap-4 border-primary/20 bg-linear-to-r from-primary/10 to-teal/5 p-4">
          <div>
            <p className="font-display font-semibold">
              {dueCount} Karten warten auf dich
            </p>
            <p className="text-sm text-muted-foreground">
              Halte deinen Rhythmus mit einer kurzen Lernsitzung.
            </p>
          </div>
          <Button nativeButton={false} render={<Link href="/study" />}>
            <BookOpen data-icon="inline-start" />
            Jetzt lernen
          </Button>
        </Card>
      )}

      <WordLibrary words={words} lang={lang} />
    </div>
  )
}
