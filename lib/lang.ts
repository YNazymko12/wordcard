import { cookies } from 'next/headers'
import { DEFAULT_LANG, TARGET_LANGS, type TargetLang } from '@/lib/vocab'

export const LANG_COOKIE = 'lang'

export async function getLang(): Promise<TargetLang> {
  const store = await cookies()
  const value = store.get(LANG_COOKIE)?.value

  return TARGET_LANGS.includes(value as TargetLang)
    ? (value as TargetLang)
    : DEFAULT_LANG
}
