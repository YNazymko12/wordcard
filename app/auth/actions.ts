'use server'

import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { germanAuthError } from '@/lib/auth-errors'

export type AuthState = { error?: string; notice?: string }

// Works in development and on the deployed site without another variable.
// A forged host cannot send the user anywhere: Supabase only honours a
// redirect that is on its own allow list.
async function siteOrigin() {
  const headerList = await headers()
  const host = headerList.get('x-forwarded-host') ?? headerList.get('host')
  const protocol = headerList.get('x-forwarded-proto') ?? 'http'

  return `${protocol}://${host}`
}

export async function signInWithGoogle() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${await siteOrigin()}/auth/callback` },
  })

  // Same channel the callback uses, so the login page has one place to show
  // what went wrong.
  if (error) {
    redirect(
      `/login?fehler=${encodeURIComponent(error.code ?? 'provider_disabled')}`,
    )
  }

  redirect(data.url)
}

export async function authenticate(
  _previous: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')
  const intent = String(formData.get('intent') ?? 'signin')

  if (!email || !password) {
    return { error: 'E-Mail und Passwort sind erforderlich.' }
  }

  const supabase = await createClient()

  if (intent === 'signup') {
    const { data, error } = await supabase.auth.signUp({ email, password })

    if (error) return { error: germanAuthError(error) }

    // No session means the address still has to be confirmed. Supabase answers
    // the same way for an address that already exists, which keeps the form
    // from telling a stranger who is registered.
    if (!data.session) {
      return {
        notice:
          'Wir haben dir eine E-Mail geschickt. Öffne den Link darin, dann ist dein Konto fertig.',
      }
    }
  } else {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) return { error: germanAuthError(error) }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()

  revalidatePath('/', 'layout')
  redirect('/login')
}
