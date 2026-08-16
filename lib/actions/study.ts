'use server'

import { createClient } from '@/lib/supabase/server'
import { schedule } from '@/lib/srs'

export async function reviewWord(wordId: string, remembered: boolean) {
  const supabase = await createClient()

  const { data: current } = await supabase
    .from('user_words')
    .select('repetitions, interval_days, ease_factor')
    .eq('word_id', wordId)
    .maybeSingle()

  if (!current) return

  const next = schedule(
    {
      repetitions: current.repetitions,
      intervalDays: current.interval_days,
      easeFactor: current.ease_factor,
    },
    remembered,
  )

  await supabase
    .from('user_words')
    .update({
      repetitions: next.repetitions,
      interval_days: next.intervalDays,
      ease_factor: next.easeFactor,
      due_at: next.dueAt.toISOString(),
    })
    .eq('word_id', wordId)
}
