import type { Metadata } from 'next'
import { Geist, Plus_Jakarta_Sans } from 'next/font/google'
import { cn } from '@/lib/utils'
import { getLang } from '@/lib/lang'
import { LangProvider } from '@/components/lang-provider'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const geist = Geist({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-geist',
})

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
})

export const metadata: Metadata = {
  title: 'Wortkarte: Deutsch lernen mit eigenen Vokabelkarten',
  description:
    'Jedes Wort kommt mit seinen Formen, zwei Beispielsätzen und der Übersetzung ins Russische, Ukrainische oder Englische.',
}

export default async function RootLayout({ children }: LayoutProps<'/'>) {
  const lang = await getLang()

  return (
    <html
      lang="de"
      className={cn('font-sans', geist.variable, jakarta.variable)}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LangProvider lang={lang}>
            {children}
            <Toaster position="bottom-right" />
          </LangProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
