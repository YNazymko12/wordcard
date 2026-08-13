import { WORDS } from '@/lib/vocab'

export default function LibraryPage() {
  return (
    <div className="flex flex-col gap-1">
      <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
        Bibliothek
      </h1>
      <p className="text-sm text-muted-foreground">
        {WORDS.length} Wörter in deiner Sammlung
      </p>
    </div>
  )
}
