import type { Metadata } from 'next'
import { LoginForm } from '@/components/login-form'

export const metadata: Metadata = {
  title: 'Anmelden · Wortkarte',
}

export default function LoginPage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6">
      <div className="flex flex-col items-center gap-1 text-center">
        <h1 className="font-display text-2xl font-bold tracking-tight">
          Willkommen bei Wortkarte
        </h1>
        <p className="text-sm text-muted-foreground">
          Melde dich an, um deine Wörter zu sehen.
        </p>
      </div>

      <LoginForm />
    </div>
  )
}
