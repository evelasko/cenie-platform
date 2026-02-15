import { verifySession } from '@cenie/auth-server/session'
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import type { Database } from '@cenie/supabase/types/database'
import { logger } from '@/lib/logger'

const publicRoutes = [
  '/',
  '/sign-in',
  '/sign-up',
  '/forgot-password',
  '/verify',
  '/api/health', // Health check endpoint
]

// Routes that require Firebase session authentication
const protectedPaths = ['/dashboard']

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if route requires authentication
  const requiresAuth = protectedPaths.some((path) => pathname.startsWith(path))

  if (requiresAuth) {
    const sessionCookie = request.cookies.get('session')

    if (!sessionCookie) {
      logger.warn('Access to protected route without session cookie', { pathname })
      const signInUrl = new URL('/sign-in', request.url)
      signInUrl.searchParams.set('redirectTo', pathname)
      return NextResponse.redirect(signInUrl)
    }

    const decoded = await verifySession(sessionCookie.value)

    if (!decoded) {
      logger.warn('Access to protected route with invalid session', { pathname })
      const signInUrl = new URL('/sign-in', request.url)
      signInUrl.searchParams.set('redirectTo', pathname)
      return NextResponse.redirect(signInUrl)
    }
  }

  // Create a response object to modify
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Create Supabase client with cookie handling for middleware
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // IMPORTANT: Refresh session if expired - this is crucial for auth to work
  await supabase.auth.getUser()

  // Allow public routes
  if (publicRoutes.some((route) => pathname === route || pathname.startsWith(route + '/'))) {
    return response
  }

  // For protected routes, the auth check happens in the route itself or via RLS
  // Just ensure cookies are properly refreshed
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api (API routes)
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. /favicon.ico (favicon file)
     * 5. Static files (images, etc.)
     */
    '/((?!api|_next|_static|favicon.ico|.*\\.).*)',
  ],
}
