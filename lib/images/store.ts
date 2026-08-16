import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { imageProvider } from '@/lib/images/provider'

const BUCKET = 'word-images'

export async function createWordImage(
  wordId: string,
  concept: string,
): Promise<string | null> {
  try {
    const image = await imageProvider.generate(concept)
    const supabase = await createClient()
    const path = `${wordId}.jpg`

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(path, image, { contentType: 'image/jpeg', upsert: true })

    if (error) return null

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)

    await supabase
      .from('words')
      .update({ image_url: data.publicUrl })
      .eq('id', wordId)

    return data.publicUrl
  } catch {
    return null
  }
}
