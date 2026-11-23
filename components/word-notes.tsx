import { Lightbulb } from 'lucide-react'

export function WordNotes({ notes }: { notes: string }) {
  return (
    <div className="flex gap-3 rounded-xl border border-accent-foreground/15 bg-accent/50 p-4">
      <Lightbulb className="size-4 shrink-0 text-accent-foreground" />
      <div className="flex flex-col gap-1">
        <p className="text-base font-semibold text-accent-foreground">
          Notizen &amp; Besonderheiten
        </p>
        <p className="text-base text-foreground/80">{notes}</p>
      </div>
    </div>
  )
}
