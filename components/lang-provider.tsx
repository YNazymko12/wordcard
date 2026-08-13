'use client'

import { createContext, useContext } from 'react'
import { DEFAULT_LANG, type TargetLang } from '@/lib/vocab'

const LangContext = createContext<TargetLang>(DEFAULT_LANG)

export function LangProvider({
  lang,
  children,
}: {
  lang: TargetLang
  children: React.ReactNode
}) {
  return <LangContext value={lang}>{children}</LangContext>
}

export function useLang() {
  return useContext(LangContext)
}
