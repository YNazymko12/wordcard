'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export type AuthState = { error?: string }

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

  const { error } =
    intent === 'signup'
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password })

  if (error) return { error: error.message }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()

  revalidatePath('/', 'layout')
  redirect('/login')
}
