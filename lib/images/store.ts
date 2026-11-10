import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { imageProvider } from '@/lib/images/provider'
import { detectFormat } from '@/lib/images/format'

const BUCKET = 'word-images'

export type ImageResult =
  { ok: true; url: string } | { ok: false; error: string }

export async function createWordImage(
  wordId: string,
  concept: string,
): Promise<ImageResult> {
  const supabase = await createClient()

  let image: Buffer

  try {
    image = await imageProvider.generate(concept)
  } catch (error) {
    console.error(`[image] ${imageProvider.name} failed:`, error)
    return { ok: false, error: 'Das Bild konnte nicht erzeugt werden.' }
  }

  const format = detectFormat(image)
  const path = `${wordId}-${Date.now()}.${format.ext}`

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, image, { contentType: format.contentType, upsert: true })

  if (uploadError) {
    console.error('[image] upload failed:', uploadError.message)
    return { ok: false, error: 'Das Bild konnte nicht gespeichert werden.' }
  }

  const { data: url } = supabase.storage.from(BUCKET).getPublicUrl(path)

  const { data: updated, error: updateError } = await supabase
    .from('words')
    .update({ image_url: url.publicUrl })
    .eq('id', wordId)
    .select('id')
    .maybeSingle()

  if (updateError || !updated) {
    console.error(
      '[image] db update failed:',
      updateError?.message ?? 'no row updated',
    )

    await supabase.storage.from(BUCKET).remove([path])

    return { ok: false, error: 'Das Bild konnte nicht zugeordnet werden.' }
  }

  return { ok: true, url: url.publicUrl }
}
