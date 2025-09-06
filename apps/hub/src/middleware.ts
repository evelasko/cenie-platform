import { routing } from './i18n/routing'
import createMiddleware from 'next-intl/middleware'

export default createMiddleware(routing)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
    // For debugging purposes:
    // '/:path*',
  ],
}
