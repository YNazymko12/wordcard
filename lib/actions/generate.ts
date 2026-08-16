'use server'

import { generateCard } from '@/lib/ai/generate-card'
import { createClient } from '@/lib/supabase/server'
import type { GeneratedCard } from '@/lib/ai/card-schema'

export type GenerateResult =
  { ok: true; card: GeneratedCard } | { ok: false; error: string }

export async function generateCardAction(
  input: string,
): Promise<GenerateResult> {
  const value = input.trim()

  if (value.length === 0 || value.length > 80) {
    return { ok: false, error: 'Bitte gib ein Wort oder eine Wendung ein.' }
  }

  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()

  if (!data?.claims) {
    return { ok: false, error: 'Nicht angemeldet.' }
  }

  try {
    return { ok: true, card: await generateCard(value) }
  } catch {
    return { ok: false, error: 'Die Generierung ist fehlgeschlagen.' }
  }
}
