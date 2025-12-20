import { verifySession } from '@cenie/auth-server/session'
import { NextRequest, NextResponse } from 'next/server'

// Use Node.js runtime instead of Edge Runtime for Firebase Admin SDK
export const runtime = 'nodejs'

// Public routes that don't require authentication
const publicRoutes = [
  '/',
  '/sign-in',
  '/sign-up',
  '/courses',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
  '/forgot-password',
]

// Routes that require authentication
const protectedPaths = ['/dashboard', '/my-courses', '/profile']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if path is public
  const isPublicPath = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  )

  // Allow public paths
  if (isPublicPath) {
    return NextResponse.next()
  }

  // Check if path requires authentication
  const requiresAuth = protectedPaths.some((path) => pathname.startsWith(path))

  if (!requiresAuth) {
    return NextResponse.next()
  }

  // Verify session for protected paths
  const sessionCookie = request.cookies.get('session')

  if (!sessionCookie) {
    // No session - redirect to sign-in
    const signInUrl = new URL('/sign-in', request.url)
    signInUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(signInUrl)
  }

  // Verify session is valid
  const decoded = await verifySession(sessionCookie.value)

  if (!decoded) {
    // Invalid session - redirect to sign-in
    const signInUrl = new URL('/sign-in', request.url)
    signInUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(signInUrl)
  }

  // Session valid - allow request
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public files (images, etc.)
     * - api routes (protected separately)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|api).*)',
  ],
}

