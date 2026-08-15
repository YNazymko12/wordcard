'use client'

import { useActionState, useState } from 'react'
import { Eye, EyeOff, LogIn, UserPlus } from 'lucide-react'
import { authenticate, type AuthState } from '@/app/auth/actions'
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

export function LoginForm() {
  const [state, formAction, pending] = useActionState(authenticate, INITIAL)
  const [passwordVisible, setPasswordVisible] = useState(false)

  return (
    <Card className="w-full max-w-sm">
      <CardContent className="flex flex-col gap-4">
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

          {state.error && (
            <p className="text-sm text-destructive">{state.error}</p>
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
