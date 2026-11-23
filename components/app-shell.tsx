'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  BookOpen,
  ClipboardList,
  LayoutGrid,
  LogOut,
  Plus,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ThemeToggle } from '@/components/theme-toggle'
import { LangToggle } from '@/components/lang-toggle'
import { signOut } from '@/app/auth/actions'
import { Button } from '@/components/ui/button'

const NAV = [
  { href: '/', label: 'Bibliothek', icon: LayoutGrid },
  { href: '/add', label: 'Hinzufügen', icon: Plus },
  { href: '/study', label: 'Lernen', icon: BookOpen },
  { href: '/quiz', label: 'Test', icon: ClipboardList },
]

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm shadow-primary/30">
        <Sparkles className="size-5" />
      </div>
      <div className="hidden leading-tight sm:block">
        <p className="font-display text-lg font-bold tracking-tight">
          Wortkarte
        </p>
        <p className="text-label text-muted-foreground">Deutsch-Trainer</p>
      </div>
    </div>
  )
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  function isActive(href: string) {
    if (href === '/') return pathname === '/' || pathname.startsWith('/word/')
    return pathname.startsWith(href)
  }

  return (
    <div className="min-h-svh bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-border bg-sidebar px-4 py-6 lg:flex">
        <div className="px-2">
          <Logo />
        </div>

        <nav
          aria-label="Hauptnavigation"
          className="mt-8 flex flex-1 flex-col gap-1"
        >
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors',
                isActive(href)
                  ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/30'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
              )}
            >
              <Icon className="size-5" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <span className="px-1 text-label font-medium text-muted-foreground">
              Übersetzung
            </span>
            <LangToggle />
          </div>
          <div className="flex flex-col gap-2">
            <span className="px-1 text-label font-medium text-muted-foreground">
              Design
            </span>
            <ThemeToggle />
          </div>

          <form action={signOut}>
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              className="w-full justify-start text-muted-foreground"
            >
              <LogOut data-icon="inline-start" />
              Abmelden
            </Button>
          </form>
        </div>
      </aside>

      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-background/80 px-4 py-3 backdrop-blur lg:hidden">
        <Logo />
        <div className="flex items-center gap-2">
          <LangToggle />
          <ThemeToggle />
        </div>
      </header>

      <main className="lg:pl-64">
        <div className="mx-auto w-full max-w-5xl px-4 pt-8 pb-24 sm:px-6 lg:px-12 lg:pt-12 lg:pb-16">
          {children}
        </div>
      </main>

      <nav
        aria-label="Hauptnavigation"
        className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-border bg-background/90 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
      >
        {NAV.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex h-16 flex-col items-center justify-center gap-1 text-label font-medium transition-colors',
              isActive(href) ? 'text-primary' : 'text-muted-foreground',
            )}
          >
            <Icon className="size-5" />
            {label}
          </Link>
        ))}
      </nav>
    </div>
  )
}
