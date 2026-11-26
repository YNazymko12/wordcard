'use client'

import { useActionState, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { Eye, EyeOff, LogIn, MailCheck, UserPlus } from 'lucide-react'
import {
  authenticate,
  signInWithGoogle,
  type AuthState,
} from '@/app/auth/actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const INITIAL: AuthState = {}

// Google's own mark; their branding rules ask for it on the sign-in button.
function GoogleMark(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" {...props}>
      <path
        fill="#ea4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z"
      />
      <path
        fill="#4285f4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65Z"
      />
      <path
        fill="#fbbc05"
        d="M10.53 28.59a14.3 14.3 0 0 1 0-9.18l-7.98-6.19a23.99 23.99 0 0 0 0 21.56l7.98-6.19Z"
      />
      <path
        fill="#34a853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.46-9.9l-7.98 6.19C6.51 42.62 14.62 48 24 48Z"
      />
    </svg>
  )
}

// Its own component so useFormStatus can read the Google form it sits in.
function GoogleButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      variant="outline"
      className="w-full"
      disabled={disabled || pending}
    >
      <GoogleMark data-icon="inline-start" />
      Mit Google anmelden
    </Button>
  )
}

export function LoginForm({ linkError }: { linkError?: string }) {
  const [state, formAction, pending] = useActionState(authenticate, INITIAL)
  const [passwordVisible, setPasswordVisible] = useState(false)

  if (state.notice) {
    return (
      <Card className="w-full max-w-sm">
        <CardContent className="flex flex-col items-center gap-4 text-center">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-success/15 text-success">
            <MailCheck className="size-6" />
          </div>
          <p className="text-base">{state.notice}</p>
        </CardContent>
      </Card>
    )
  }

  const error = state.error ?? linkError

  return (
    <Card className="w-full max-w-sm">
      <CardContent className="flex flex-col gap-4">
        <form action={signInWithGoogle}>
          <GoogleButton disabled={pending} />
        </form>

        <div className="flex items-center gap-3">
          <span className="h-px flex-1 bg-border" />
          <span className="text-label text-muted-foreground">oder</span>
          <span className="h-px flex-1 bg-border" />
        </div>

        <form action={formAction} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">E-Mail</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="du@beispiel.de"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Passwort</Label>
            <InputGroup>
              <InputGroupInput
                id="password"
                name="password"
                type={passwordVisible ? 'text' : 'password'}
                autoComplete="current-password"
                minLength={6}
                required
              />
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => setPasswordVisible((visible) => !visible)}
                  aria-label={
                    passwordVisible ? 'Passwort verbergen' : 'Passwort anzeigen'
                  }
                >
                  {passwordVisible ? <EyeOff /> : <Eye />}
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          </div>

          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}

          <div className="flex flex-col gap-2">
            <Button
              type="submit"
              name="intent"
              value="signin"
              disabled={pending}
            >
              <LogIn data-icon="inline-start" />
              Anmelden
            </Button>
            <Button
              type="submit"
              name="intent"
              value="signup"
              variant="outline"
              disabled={pending}
            >
              <UserPlus data-icon="inline-start" />
              Konto erstellen
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
