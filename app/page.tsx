import { ThemeToggle } from '@/components/theme-toggle'

const SWATCHES = [
  { name: 'primary', className: 'bg-primary text-primary-foreground' },
  { name: 'secondary', className: 'bg-secondary text-secondary-foreground' },
  { name: 'muted', className: 'bg-muted text-muted-foreground' },
  { name: 'accent', className: 'bg-accent text-accent-foreground' },
  { name: 'teal', className: 'bg-teal text-teal-foreground' },
  { name: 'success', className: 'bg-success text-success-foreground' },
  { name: 'destructive', className: 'bg-destructive text-background' },
  { name: 'card', className: 'bg-card text-card-foreground border' },
]

const LEVELS = ['a1', 'a2', 'b1', 'b2', 'c1', 'c2']

const RADII = ['rounded-sm', 'rounded-lg', 'rounded-xl', 'rounded-3xl']

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
        {title}
      </h2>
      {children}
    </section>
  )
}

export default function Home() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-8 p-8">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">
            Wortkarte
          </h1>
          <p className="text-sm text-muted-foreground">Design-Tokens</p>
        </div>
        <ThemeToggle />
      </header>

      <Section title="Farben">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {SWATCHES.map((s) => (
            <div
              key={s.name}
              className={`rounded-xl p-4 text-sm font-medium ${s.className}`}
            >
              {s.name}
            </div>
          ))}
        </div>
      </Section>

      <Section title="CEFR-Niveaus">
        <div className="flex flex-wrap gap-2">
          {LEVELS.map((l) => (
            <span
              key={l}
              className="inline-flex h-6 items-center rounded-full px-3 text-xs font-semibold uppercase"
              style={{
                backgroundColor: `var(--lvl-${l}-bg)`,
                color: `var(--lvl-${l}-fg)`,
              }}
            >
              {l}
            </span>
          ))}
        </div>
      </Section>

      <Section title="Radien">
        <div className="flex flex-wrap gap-2">
          {RADII.map((r) => (
            <div
              key={r}
              className={`bg-secondary px-4 py-3 text-xs font-medium ${r}`}
            >
              {r}
            </div>
          ))}
        </div>
      </Section>

      <Section title="Typografie">
        <div className="flex flex-col gap-2 rounded-xl border p-4">
          <p className="font-display text-2xl font-bold">
            die Freiheit · das Häuschen · groß
          </p>
          <p className="text-sm text-muted-foreground">
            Свобода · домик · большой — проверка кириллицы
          </p>
        </div>
      </Section>
    </main>
  )
}
