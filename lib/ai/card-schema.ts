import { z } from 'zod'

const Translations = z.object({
  ru: z.string(),
  uk: z.string(),
  en: z.string(),
})

export const CardSchema = z.object({
  word: z.string(),
  article: z.enum(['der', 'die', 'das']).nullable(),
  type: z.enum(['noun', 'verb', 'adjective', 'phrase']),
  level: z.enum(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']),
  translations: Translations,
  verb: z
    .object({
      infinitive: z.string(),
      present3rd: z.string(),
      praeteritum: z.string(),
      perfekt: z.string(),
    })
    .nullable(),
  preposition: z
    .object({
      prep: z.string(),
      case: z.enum(['Akkusativ', 'Dativ', 'Genitiv']),
    })
    .nullable(),
  examples: z.array(
    z.object({
      de: z.string(),
      tense: z.enum(['Präsens', 'Perfekt']),
      translations: Translations,
    }),
  ),
  notes: z.string(),
  imageConcept: z.string(),
})

export type GeneratedCard = z.infer<typeof CardSchema>
