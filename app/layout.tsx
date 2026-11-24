import type { Metadata, Viewport } from 'next'
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

const TITLE = 'Wortkarte: Deutsch lernen mit eigenen Vokabelkarten'
const DESCRIPTION =
  'Jedes Wort kommt mit seinen Formen, zwei Beispielsätzen und der Übersetzung ins Russische, Ukrainische oder Englische.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  applicationName: 'Wortkarte',
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    siteName: 'Wortkarte',
    locale: 'de_DE',
    type: 'website',
  },
  twitter: { card: 'summary', title: TITLE, description: DESCRIPTION },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8fafe' },
    { media: '(prefers-color-scheme: dark)', color: '#0c0f18' },
  ],
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
