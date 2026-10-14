'use client'

import { useState } from 'react'
import { Save } from 'lucide-react'
import type { WordInput } from '@/lib/ai/card-schema'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'
import { Textarea } from '@/components/ui/textarea'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import {
  LANG_LABEL,
  LEVELS,
  TARGET_LANGS,
  TYPES,
  TYPE_LABEL,
  type Article,
  type CEFRLevel,
  type TargetLang,
  type WordType,
} from '@/lib/vocab'

const ARTICLES: Article[] = ['der', 'die', 'das']

export function WordForm({
  initial,
  pending,
  submitLabel = 'Speichern',
  note,
  onSubmit,
  onCancel,
}: {
  initial: WordInput
  pending?: boolean
  submitLabel?: string
  note?: string
  onSubmit: (values: WordInput) => void
  onCancel: () => void
}) {
  const [values, setValues] = useState(initial)
  const [showErrors, setShowErrors] = useState(false)

  const wordError = values.word.trim().length === 0

  function patch(changes: Partial<WordInput>) {
    setValues((current) => ({ ...current, ...changes }))
  }

  function patchTranslation(lang: TargetLang, value: string) {
    patch({ translations: { ...values.translations, [lang]: value } })
  }

  function submit(event: React.FormEvent) {
    event.preventDefault()

    if (wordError) {
      setShowErrors(true)
      return
    }

    onSubmit(values)
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <Card className="p-0">
        <CardContent className="flex flex-col gap-6 p-5">
          <FieldSet>
            <FieldLegend variant="label">Grundform</FieldLegend>
            <FieldGroup className="gap-4">
              <Field data-invalid={showErrors && wordError}>
                <FieldLabel htmlFor="word">Wort</FieldLabel>
                <Input
                  id="word"
                  value={values.word}
                  onChange={(event) => patch({ word: event.target.value })}
                  aria-invalid={showErrors && wordError}
                />
                {showErrors && wordError && (
                  <FieldError>Bitte gib ein Wort ein.</FieldError>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="type">Wortart</FieldLabel>
                <Select
                  value={values.type}
                  onValueChange={(value) => patch({ type: value as WordType })}
                >
                  <SelectTrigger id="type">
                    <SelectValue>
                      {(value: WordType) => TYPE_LABEL[value]}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {TYPE_LABEL[type]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              {values.type === 'noun' && (
                <Field>
                  <FieldLabel>Artikel</FieldLabel>
                  <ToggleGroup
                    value={values.article ? [values.article] : []}
                    onValueChange={(value) =>
                      patch({ article: (value[0] as Article) ?? null })
                    }
                    variant="outline"
                    spacing={0}
                    className="w-fit"
                    aria-label="Artikel"
                  >
                    {ARTICLES.map((article) => (
                      <ToggleGroupItem key={article} value={article}>
                        {article}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </Field>
              )}

              <Field>
                <FieldLabel htmlFor="level">Niveau</FieldLabel>
                <Select
                  value={values.level}
                  onValueChange={(value) =>
                    patch({ level: value as CEFRLevel })
                  }
                >
                  <SelectTrigger id="level" className="w-28">
                    <SelectValue>{(value: CEFRLevel) => value}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {LEVELS.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </FieldGroup>
          </FieldSet>

          <FieldSeparator />

          <FieldSet>
            <FieldLegend variant="label">Übersetzungen</FieldLegend>
            <FieldGroup className="gap-4">
              {TARGET_LANGS.map((lang) => (
                <Field key={lang}>
                  <FieldLabel htmlFor={`translation-${lang}`}>
                    {LANG_LABEL[lang]}
                  </FieldLabel>
                  <Input
                    id={`translation-${lang}`}
                    value={values.translations[lang] ?? ''}
                    onChange={(event) =>
                      patchTranslation(lang, event.target.value)
                    }
                  />
                </Field>
              ))}
            </FieldGroup>
          </FieldSet>

          <FieldSeparator />

          <FieldSet>
            <FieldLegend variant="label">Notizen</FieldLegend>
            <Field>
              <Textarea
                id="notes"
                rows={3}
                value={values.notes}
                onChange={(event) => patch({ notes: event.target.value })}
              />
            </Field>
          </FieldSet>
        </CardContent>
      </Card>

      {note && <p className="text-sm text-muted-foreground">{note}</p>}

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Abbrechen
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? <Spinner /> : <Save data-icon="inline-start" />}
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
