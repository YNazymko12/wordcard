'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { TARGET_LANGS, type TargetLang } from '@/lib/vocab'
import { LANG_COOKIE } from '@/lib/lang'

const ONE_YEAR = 60 * 60 * 24 * 365

export async function setLang(lang: TargetLang) {
  if (!TARGET_LANGS.includes(lang)) return

  const store = await cookies()
  store.set(LANG_COOKIE, lang, {
    path: '/',
    maxAge: ONE_YEAR,
    sameSite: 'lax',
  })

  revalidatePath('/', 'layout')
}
