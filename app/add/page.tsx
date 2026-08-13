import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Wort hinzufügen · Wortkarte',
}

export default function AddWordPage() {
  return (
    <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
      Wort hinzufügen
    </h1>
  )
}
