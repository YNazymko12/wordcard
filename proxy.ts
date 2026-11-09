import { createServerClient, parseCookieHeader } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const PUBLIC_ROUTES = ['/login']

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request: { headers: request.headers } })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return parseCookieHeader(request.headers.get('cookie') ?? '')
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  const { data } = await supabase.auth.getClaims()
  const signedIn = Boolean(data?.claims)
  const { pathname } = request.nextUrl
  const isPublic = PUBLIC_ROUTES.some((route) => pathname.startsWith(route))

  if (!signedIn && !isPublic) return redirectTo('/login', request, response)
  if (signedIn && isPublic) return redirectTo('/', request, response)

  return response
}

function redirectTo(
  pathname: string,
  request: NextRequest,
  source: NextResponse,
) {
  const url = request.nextUrl.clone()
  url.pathname = pathname

  const redirect = NextResponse.redirect(url)
  source.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie))

  return redirect
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png)$).*)'],
}
