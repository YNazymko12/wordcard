import type { Metadata } from 'next'
import { LoginForm } from '@/components/login-form'
import { authMessage } from '@/lib/auth-errors'

export const metadata: Metadata = {
  title: 'Anmelden · Wortkarte',
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { fehler } = await searchParams
  const linkError = typeof fehler === 'string' ? authMessage(fehler) : undefined

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-8 px-4 py-12">
      <div className="flex flex-col items-center gap-1 text-center">
        <h1 className="font-display text-2xl font-bold tracking-tight">
          Willkommen bei Wortkarte
        </h1>
        <p className="text-base text-muted-foreground">
          Melde dich an, um deine Wörter zu sehen.
        </p>
      </div>

      <LoginForm linkError={linkError} />
    </div>
  )
}
