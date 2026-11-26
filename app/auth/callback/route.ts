import type { EmailOtpType } from '@supabase/supabase-js'
import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Where the user lands after a Google sign-in or an e-mail link. Supabase
// sends either a PKCE code or a token hash, never both.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const next = safeNext(searchParams.get('next'), origin)

  if (searchParams.get('error')) {
    return failure(origin, 'provider_denied')
  }

  const code = searchParams.get('code')
  const tokenHash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null

  if (!code && !(tokenHash && type)) {
    return failure(origin, 'link_invalid')
  }

  const supabase = await createClient()

  const { error } = code
    ? await supabase.auth.exchangeCodeForSession(code)
    : await supabase.auth.verifyOtp({ type: type!, token_hash: tokenHash! })

  if (error) return failure(origin, error.code ?? 'link_invalid')

  return NextResponse.redirect(new URL(next, origin))
}

// Only our own paths, so a crafted link cannot bounce the user off-site.
// Checking the resolved origin also catches a backslash, which the URL parser
// turns into a slash: /\evil.com would otherwise resolve to http://evil.com.
function safeNext(value: string | null, origin: string) {
  if (!value?.startsWith('/')) return '/'

  const target = new URL(value, origin)

  return target.origin === origin ? target.pathname + target.search : '/'
}

// The code is looked up in a fixed dictionary before it is shown, so nothing
// a provider sends is rendered as is.
function failure(origin: string, code: string) {
  const url = new URL('/login', origin)
  url.searchParams.set('fehler', code)

  return NextResponse.redirect(url)
}
