import { Lightbulb } from 'lucide-react'

export function WordNotes({ notes }: { notes: string }) {
  return (
    <div className="flex gap-3 rounded-xl border border-accent-foreground/15 bg-accent/50 p-3.5">
      <Lightbulb className="size-4 shrink-0 text-accent-foreground" />
      <div className="flex flex-col gap-0.5">
        <p className="text-sm font-semibold text-accent-foreground">
          Notizen &amp; Besonderheiten
        </p>
        <p className="text-sm text-foreground/80">{notes}</p>
      </div>
    </div>
  )
}
