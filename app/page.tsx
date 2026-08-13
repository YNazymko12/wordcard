import { WordCard } from '@/components/word-card'
import { getLang } from '@/lib/lang'
import { WORDS } from '@/lib/vocab'

export default async function LibraryPage() {
  const lang = await getLang()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
          Bibliothek
        </h1>
        <p className="text-sm text-muted-foreground">
          {WORDS.length} Wörter in deiner Sammlung
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {WORDS.map((word) => (
          <WordCard key={word.id} word={word} lang={lang} />
        ))}
      </div>
    </div>
  )
}
