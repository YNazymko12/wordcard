'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { WordCard } from '@/components/word-card'
import {
  LEVELS,
  TYPES,
  TYPE_LABEL,
  translate,
  type TargetLang,
  type Word,
  type WordType,
} from '@/lib/vocab'

export function WordLibrary({
  words,
  lang,
}: {
  words: Word[]
  lang: TargetLang
}) {
  const [query, setQuery] = useState('')
  const [levels, setLevels] = useState<string[]>([])
  const [type, setType] = useState<WordType | 'all'>('all')

  const search = query.trim().toLowerCase()

  const filtered = words.filter((word) => {
    const matchesQuery =
      !search ||
      word.word.toLowerCase().includes(search) ||
      translate(word.translations, lang).toLowerCase().includes(search)
    const matchesLevel = levels.length === 0 || levels.includes(word.level)
    const matchesType = type === 'all' || word.type === type

    return matchesQuery && matchesLevel && matchesType
  })

  return (
    <div className="flex flex-col gap-4">
      <InputGroup className="h-10 rounded-xl">
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
        <InputGroupInput
          placeholder="Wörter oder Übersetzungen suchen…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </InputGroup>

      <div className="flex flex-wrap items-center gap-3">
        <ToggleGroup
          value={levels}
          onValueChange={setLevels}
          variant="outline"
          size="sm"
          className="flex-wrap"
          aria-label="Niveau filtern"
        >
          {LEVELS.map((level) => (
            <ToggleGroupItem key={level} value={level}>
              {level}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>

        <Select
          value={type}
          onValueChange={(value) => setType(value as WordType | 'all')}
        >
          <SelectTrigger className="h-8" size="sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle Wortarten</SelectItem>
            {TYPES.map((wordType) => (
              <SelectItem key={wordType} value={wordType}>
                {TYPE_LABEL[wordType]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <Empty className="rounded-2xl border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Search />
            </EmptyMedia>
            <EmptyTitle>Keine Wörter gefunden</EmptyTitle>
            <EmptyDescription>
              Ändere die Suche oder setze die Filter zurück.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((word) => (
            <WordCard key={word.id} word={word} lang={lang} />
          ))}
        </div>
      )}
    </div>
  )
}
