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
    <div className="flex flex-col gap-2">
      <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
        Beispiele
      </p>
      <div className="flex flex-col gap-3">
        {examples.map((example) => (
          <figure
            key={example.de}
            className="relative rounded-xl border-l-2 border-primary bg-secondary/40 py-3 pr-3 pl-4"
          >
            <PronounceButton
              text={example.de}
              className="absolute top-1.5 right-1.5"
            />
            <blockquote className="pr-9 leading-snug font-medium">
              {example.de}
            </blockquote>
            <figcaption className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <span>{translate(example.translations, lang)}</span>
              <span className="rounded-full bg-background px-1.5 py-0.5 text-[10px] font-medium">
                {example.tense}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  )
}
