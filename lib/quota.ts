import 'server-only'

import { createClient } from '@/lib/supabase/server'

export const GUEST_LIMIT = 5

export type Quota =
  { unlimited: true } | { unlimited: false; used: number; left: number }

export async function getQuota(userId: string): Promise<Quota> {
  const owner = process.env.OWNER_USER_ID

  if (!owner) {
    console.warn('[quota] OWNER_USER_ID is not set — everyone is a guest')
  }

  if (owner && userId === owner) return { unlimited: true }

  const supabase = await createClient()

  const { count } = await supabase
    .from('generations')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)

  const used = count ?? 0

  return { unlimited: false, used, left: Math.max(0, GUEST_LIMIT - used) }
}

export const QUOTA_REACHED = `Du hast dein Kontingent von ${GUEST_LIMIT} neuen Wörtern aufgebraucht. Wörter aus der gemeinsamen Bibliothek kannst du weiterhin hinzufügen.`
