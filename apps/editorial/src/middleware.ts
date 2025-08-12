import { NextRequest, NextResponse } from 'next/server'

const publicRoutes = [
  '/',
  '/sign-in',
  '/sign-up',
  '/forgot-password',
  '/verify',
  '/api/health', // Health check endpoint
]

const apiRoutes = [
  '/api'
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public routes
  if (publicRoutes.some(route => pathname === route || pathname.startsWith(route + '/'))) {
    return NextResponse.next()
  }

  // Handle API routes
  if (apiRoutes.some(route => pathname.startsWith(route))) {
    // API routes handle their own auth
    return NextResponse.next()
  }

  // For now, allow all routes - client-side auth will handle protection
  // In production, you might want to implement session cookie checking here
  return NextResponse.next()
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