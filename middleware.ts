import { NextResponse, type NextRequest } from 'next/server'

// Lightweight guard: protect /dashboard and selected private paths
const protectedPaths = [/^\/dashboard(\/.*)?$/]

export function middleware(req: NextRequest) {
  const { nextUrl, cookies } = req
  const path = nextUrl.pathname
  const isProtected = protectedPaths.some((re) => re.test(path))
  if (!isProtected) return NextResponse.next()

  // Supabase sets a cookie 'sb' (prefix); check presence as a heuristic
  const hasSession = Array.from(cookies.getAll()).some((c) =>
    c.name.startsWith('sb'),
  )
  if (hasSession) return NextResponse.next()

  const url = req.nextUrl.clone()
  url.pathname = '/sign-in'
  url.searchParams.set('redirect', path)
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/((?!_next|api|static|.*\\..*).*)'],
}
