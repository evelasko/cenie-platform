'use client'

import { useEffect } from 'react'

import { getOAuthRedirectResult } from '../providers/redirect'

import type { UseOAuthOptions } from './use-oauth'
import { useOAuth } from './use-oauth'

/**
 * OAuth hook that checks for redirect results on mount
 *
 * Use this instead of useOAuth when you need to handle OAuth redirects.
 * It automatically checks for redirect results on component mount and processes them.
 *
 * @param options - OAuth options (redirectTo, callbacks)
 * @returns useOAuth hook result with redirect handling
 *
 * @example
 * ```typescript
 * function SignInPage() {
 *   const oauth = useOAuthRedirect({ redirectTo: '/dashboard' })
 *
 *   return (
 *     <button onClick={() => oauth.signInWithProvider('google')}>
 *       Sign in with Google
 *     </button>
 *   )
 * }
 * ```
 */
export function useOAuthRedirect(options?: UseOAuthOptions) {
  const oauth = useOAuth(options)

  useEffect(() => {
    async function checkRedirect() {
      try {
        const result = await getOAuthRedirectResult()

        if (result) {
          // Process OAuth result through the hook's success handler
          // This is handled internally by useOAuth's useEffect
        }
      } catch (error: unknown) {
        // Errors are also handled by useOAuth's useEffect
        // This is just a safety net
        console.error('OAuth redirect check error:', error)
      }
    }

    checkRedirect()
  }, [])

  return oauth
}

