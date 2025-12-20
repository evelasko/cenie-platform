import { NextRequest, NextResponse } from 'next/server'
import { createLogger } from '@cenie/logger'

const logger = createLogger({ name: 'agency:middleware' })

// Public routes that don't require authentication
const publicRoutes = [
  '/',
  '/sign-in',
  '/sign-up',
  '/templates', // Browse templates (public)
  '/about',
  '/contact',
  '/privacy',
  '/terms',
  '/forgot-password',
]

// Protected paths that require authentication
const protectedPaths = ['/dashboard', '/projects', '/my-templates']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Check if the route is public
  const isPublicRoute = publicRoutes.some((route) => {
    if (route === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(route)
  })

  // If public route, allow access
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Check if the route is protected
  const isProtectedRoute = protectedPaths.some((path) => pathname.startsWith(path))

  if (isProtectedRoute) {
    // Check for session cookie
    const sessionCookie = request.cookies.get('session')

    if (!sessionCookie) {
      logger.debug('Redirecting to sign-in - no session', { pathname })
      
      // Redirect to sign-in with return URL
      const signInUrl = new URL('/sign-in', request.url)
      signInUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(signInUrl)
    }

    // Session exists, allow access
    logger.debug('Protected route accessed with session', { pathname })
    return NextResponse.next()
  }

  // Default: allow access
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, etc.
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}

