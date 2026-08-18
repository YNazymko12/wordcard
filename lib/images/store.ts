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
    const path = `${wordId}-${Date.now()}.jpg`

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, image, { contentType: 'image/jpeg', upsert: true })

    if (uploadError) {
      console.error('[image] upload failed:', uploadError.message)
      return null
    }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)

    const { error: updateError } = await supabase
      .from('words')
      .update({ image_url: data.publicUrl })
      .eq('id', wordId)

    if (updateError) {
      console.error('[image] db update failed:', updateError.message)
      return null
    }

    return data.publicUrl
  } catch (error) {
    console.error('[image] generation failed:', error)
    return null
  }
}
