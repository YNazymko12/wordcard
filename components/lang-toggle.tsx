'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Languages } from 'lucide-react'
import { setLang } from '@/app/actions'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { LANG_LABEL, TARGET_LANGS, type TargetLang } from '@/lib/vocab'
import { useLang } from '@/components/lang-provider'

const ACTIVE_ITEM =
  'aria-pressed:bg-primary aria-pressed:text-primary-foreground aria-pressed:hover:bg-primary/90 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground'

export function LangToggle() {
  const lang = useLang()
  const router = useRouter()
  const [, startTransition] = useTransition()

  return (
    <div className="flex items-center gap-2">
      <Languages className="size-4 shrink-0 text-muted-foreground" />
      <ToggleGroup
        value={[lang]}
        onValueChange={(value) => {
          const next = value[0] as TargetLang | undefined
          if (!next) return

          startTransition(async () => {
            await setLang(next)
            router.refresh()
          })
        }}
        variant="outline"
        size="sm"
        spacing={0}
        aria-label="Übersetzungssprache"
      >
        {TARGET_LANGS.map((code) => (
          <ToggleGroupItem
            key={code}
            value={code}
            title={LANG_LABEL[code]}
            className={ACTIVE_ITEM}
          >
            {code.toUpperCase()}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  )
}
