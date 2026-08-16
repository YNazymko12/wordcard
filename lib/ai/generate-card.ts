import 'server-only'

import Anthropic from '@anthropic-ai/sdk'
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod'
import { CardSchema, type GeneratedCard } from '@/lib/ai/card-schema'

const SYSTEM = `Du bist Lexikograf für Deutsch als Fremdsprache und erstellst Vokabelkarten.

Regeln:
- Nomen bekommen immer einen Artikel (der/die/das) und "type": "noun".
- Verben bekommen alle vier Formen. "perfekt" enthält das Hilfsverb: "hat gewartet", "ist gegangen".
- Bei Verben mit fester Präposition ergänze "preposition" mit dem verlangten Kasus.
- Für Nicht-Verben ist "verb" null, für Verben ohne feste Präposition ist "preposition" null.
- Redewendungen und feste Ausdrücke bekommen "type": "phrase", "article": null und "verb": null.
  Die Eingabe bleibt in der Grundform, wie sie im Wörterbuch steht ("auf die Folter spannen").
  Übersetze die Bedeutung der Wendung, nicht Wort für Wort.
  In "notes" erkläre kurz, wann man sie benutzt.
- Genau 2 Beispielsätze: einer im Präsens, einer im Perfekt. Kurz und alltagsnah.
- "level" nach GER (A1–C2), gemessen an der Alltagshäufigkeit des Wortes.
- "notes": ein bis zwei Sätze auf Deutsch zu Plural, Unregelmäßigkeiten oder Besonderheiten.
- "imageConcept": eine kurze englische Bildbeschreibung des Begriffs, ohne Text im Bild.
- Übersetzungen in alle drei Sprachen, auch bei mehrdeutigen Wörtern die häufigste Bedeutung zuerst.

Korrigiere Tippfehler und Groß-/Kleinschreibung der Eingabe stillschweigend.`

const client = new Anthropic()

export async function generateCard(input: string): Promise<GeneratedCard> {
  const response = await client.messages.parse({
    model: 'claude-haiku-4-5',
    max_tokens: 4096,
    system: SYSTEM,
    messages: [{ role: 'user', content: input }],
    output_config: { format: zodOutputFormat(CardSchema) },
  })

  if (!response.parsed_output) {
    throw new Error('Die Karte konnte nicht erstellt werden.')
  }

  return response.parsed_output
}
