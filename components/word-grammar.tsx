import { ChevronDown } from 'lucide-react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ARTICLE_LABEL, type Word } from '@/lib/vocab'

export function WordGrammar({ word }: { word: Word }) {
  return (
    <Collapsible defaultOpen>
      <CollapsibleTrigger className="group flex w-full items-center justify-between rounded-xl bg-secondary/50 px-3 py-2.5 text-sm font-semibold transition-colors hover:bg-secondary">
        Grammatik
        <ChevronDown className="size-4 text-muted-foreground transition-transform group-data-panel-open:rotate-180" />
      </CollapsibleTrigger>
      <CollapsibleContent className="flex flex-col gap-3 pt-3">
        {word.verb && (
          <div className="overflow-hidden rounded-xl border border-border">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary/60">
                  <TableHead>Infinitiv</TableHead>
                  <TableHead>Präsens</TableHead>
                  <TableHead>Präteritum</TableHead>
                  <TableHead>Perfekt</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">
                    {word.verb.infinitive}
                  </TableCell>
                  <TableCell>{word.verb.present3rd}</TableCell>
                  <TableCell>{word.verb.praeteritum}</TableCell>
                  <TableCell className="font-medium text-primary">
                    {word.verb.perfekt}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        )}

        {word.preposition && (
          <div className="flex items-center gap-2 rounded-xl border border-teal/30 bg-teal/5 px-3 py-2.5 text-sm">
            <span className="font-semibold text-teal">
              {word.preposition.prep}
            </span>
            <span className="text-muted-foreground">+</span>
            <span className="font-medium">{word.preposition.case}</span>
          </div>
        )}

        {!word.verb && !word.preposition && (
          <p className="text-sm text-muted-foreground">
            {word.article
              ? `Nomen · ${word.article} (${ARTICLE_LABEL[word.article]})`
              : 'Keine weiteren grammatischen Hinweise.'}
          </p>
        )}
      </CollapsibleContent>
    </Collapsible>
  )
}
