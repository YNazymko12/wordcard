import { PronounceButton } from '@/components/pronounce-button'
import { translate, type ExampleSentence, type TargetLang } from '@/lib/vocab'

export function WordExamples({
  examples,
  lang,
}: {
  examples: ExampleSentence[]
  lang: TargetLang
}) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-label font-semibold text-muted-foreground">
        Beispiele
      </p>
      <div className="flex flex-col gap-3">
        {examples.map((example) => (
          <figure
            key={example.de}
            className="relative rounded-xl border-l-2 border-primary bg-secondary/40 p-4"
          >
            <PronounceButton
              text={example.de}
              className="absolute top-2 right-2"
            />
            <blockquote className="pr-10 text-base leading-snug font-medium">
              {example.de}
            </blockquote>
            <figcaption className="mt-2 flex flex-wrap items-center gap-2 text-base text-muted-foreground">
              <span>{translate(example.translations, lang)}</span>
              <span className="inline-flex h-6 items-center rounded-full bg-background px-2 text-label font-medium">
                {example.tense}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  )
}
