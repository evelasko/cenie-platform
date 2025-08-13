import { type NextRequest, NextResponse } from 'next/server'

import { verifySessionCookie } from './server'

export async function withAuth(
  request: NextRequest,
  handler?: (request: NextRequest, user: unknown) => NextResponse | Promise<NextResponse>
) {
  const sessionCookie = request.cookies.get('session')
  
  if (!sessionCookie) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  const decodedClaims = await verifySessionCookie(sessionCookie.value)
  
  if (!decodedClaims) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  if (handler) {
    return handler(request, decodedClaims)
  }
  
  return NextResponse.next()
}

export function createAuthMiddleware(config?: {
  publicPaths?: string[]
  loginPath?: string
}) {
  const publicPaths = config?.publicPaths || ['/login', '/signup', '/reset-password']
  const loginPath = config?.loginPath || '/login'
  
  return async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname
    
    // Check if path is public
    const isPublicPath = publicPaths.some(publicPath => 
      path === publicPath || path.startsWith(`${publicPath  }/`)
    )
    
    if (isPublicPath) {
      return NextResponse.next()
    }
    
    // Check authentication
    const sessionCookie = request.cookies.get('session')
    
    if (!sessionCookie) {
      return NextResponse.redirect(new URL(loginPath, request.url))
    }
    
    const decodedClaims = await verifySessionCookie(sessionCookie.value)
    
    if (!decodedClaims) {
      return NextResponse.redirect(new URL(loginPath, request.url))
    }
    
    // Add user info to headers for downstream use
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-user-id', decodedClaims.uid)
    requestHeaders.set('x-user-email', decodedClaims.email || '')
    
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }
}