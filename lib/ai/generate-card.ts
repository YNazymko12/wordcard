import 'server-only'

import Anthropic from '@anthropic-ai/sdk'
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod'
import { CardSchema, type GeneratedCard } from '@/lib/ai/card-schema'

const SYSTEM = `Du bist Lexikograf für Deutsch als Fremdsprache und erstellst Vokabelkarten.

Regeln:
- Nomen bekommen immer einen Artikel (der/die/das) und "type": "noun".
- Verben bekommen alle vier Formen. "perfekt" enthält das Hilfsverb: "hat gewartet", "ist gegangen".
- Verlangt ein Verb eine feste Präposition, fülle "preposition" immer aus — auch bei reflexiven Verben ("sich empören über" + Akkusativ, "warten auf" + Akkusativ).
- Reflexive Verben ("sich empören") sind "type": "verb". Das Reflexivpronomen steht in allen Formen: "empört sich", "empörte sich", "hat sich empört".
- Redewendungen und feste Ausdrücke bekommen "type": "phrase" und "article": null.
  Die Eingabe bleibt in der Grundform, wie sie im Wörterbuch steht ("auf die Folter spannen").
  Enthält die Wendung ein Verb, gib seine Formen in "verb" an, konjugiert im Kontext der Wendung:
  "spannt auf die Folter", "spannte auf die Folter", "hat auf die Folter gespannt".
  Übersetze die Bedeutung der Wendung, nicht Wort für Wort.
  In "notes" erkläre kurz, wann man sie benutzt.
- "verb" ist nur bei Nomen und Adjektiven null.
- Genau 2 Beispielsätze: einer im Präsens, einer im Perfekt. Kurz und alltagsnah.
- "level" nach GER (A1–C2), gemessen an der Alltagshäufigkeit des Wortes.
- "notes": ein bis zwei Sätze auf Deutsch zu Plural, Unregelmäßigkeiten oder Besonderheiten.
- "imageConcept": eine kurze englische Beschreibung EINER KONKRETEN SZENE, die das Wort zeigt — niemals eine Definition und niemals abstrakte Begriffe im Bild.
  Konkrete Wörter: einfach der Gegenstand ("a small cozy house with a red roof").
  Abstrakte Wörter, Gefühle, technische Begriffe: eine Alltagsszene oder Metapher, an der man die Bedeutung erkennt.
  Beispiele:
    "Freiheit" -> "a bird flying out of an open cage"
    "Verantwortung" -> "two hands carefully holding a small green seedling"
    "Schleifpunkt" -> "a foot pressing the clutch pedal while the car starts to roll forward"
    "sich empören" -> "a person with raised hands protesting in front of a crowd"
  Immer 1 bis 2 sichtbare Objekte oder eine Person, nie mehr. Kein Text, keine Buchstaben, keine Symbole wie Pfeile oder Fragezeichen.
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

const SCENE_SYSTEM = `Du beschreibst Szenen für Illustrationen zu deutschen Vokabeln.

Antworte mit EINEM englischen Satz, der eine konkrete sichtbare Szene beschreibt.
Konkrete Wörter: einfach der Gegenstand. Abstrakte Wörter: eine Alltagsszene oder Metapher.
1 bis 2 sichtbare Objekte oder eine Person, nicht mehr.
Nenne niemals das deutsche Wort selbst und keine Schrift im Bild.
Nur der Satz, keine Anführungszeichen, keine Erklärung.`

export async function describeScene(word: string): Promise<string> {
  const response = await client.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 200,
    system: SCENE_SYSTEM,
    messages: [{ role: 'user', content: word }],
  })

  const block = response.content.find((item) => item.type === 'text')

  return block?.type === 'text' ? block.text.trim() : ''
}
