'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  signIn,
  signInWithGoogle,
  signInWithApple,
  getOAuthRedirectResult,
  handleAccountExistsError,
  linkPendingCredential,
  OAuthError,
  AuthCredential,
  User,
} from '@cenie/firebase/auth'
import { Button } from '@cenie/ui'
import Link from 'next/link'
import { logger } from '@/lib/logger-client'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState<'google' | 'apple' | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [accountLinkingInfo, setAccountLinkingInfo] = useState<{
    email: string
    existingProviders: string[]
    pendingCredential: AuthCredential | null
  } | null>(null)
  const router = useRouter()

  const handleOAuthSuccess = useCallback(
    async (user: User, isNewUser: boolean, provider: string) => {
      try {
        // Get ID token to authenticate with our API
        const idToken = await user.getIdToken()

        // Call our OAuth API endpoint
        const response = await fetch('/api/auth/oauth', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({
            provider: provider === 'google.com' ? 'google' : 'apple',
            isNewUser,
            userData: {
              email: user.email,
              fullName: user.displayName,
              photoURL: user.photoURL,
              providerId: provider,
            },
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to complete OAuth sign-in')
        }

        router.push('/dashboard')
      } catch (error: unknown) {
        logger.error('OAuth success handling error', error)
        setError('Failed to complete sign-in. Please try again.')
      }
    },
    [router]
  )

  const handleOAuthSignIn = async (provider: 'google' | 'apple') => {
    try {
      setOauthLoading(provider)
      setError(null)
      setAccountLinkingInfo(null)

      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )

      let result
      if (provider === 'google') {
        result = await signInWithGoogle(isMobile)
      } else {
        result = await signInWithApple(isMobile)
      }

      await handleOAuthSuccess(
        result.user,
        result.isNewUser,
        result.additionalUserInfo?.providerId || provider + '.com'
      )
    } catch (error: unknown) {
      logger.error(`${provider} sign-in error`, error)

      // Handle account exists with different credential error
      if (
        error instanceof Object &&
        'code' in error &&
        error.code === 'auth/account-exists-with-different-credential'
      ) {
        try {
          const linkingInfo = await handleAccountExistsError(error as OAuthError)
          setAccountLinkingInfo(linkingInfo)
          setError(
            `An account already exists with this email. You can sign in with: ${linkingInfo.existingProviders.join(', ')}`
          )
        } catch (linkError: unknown) {
          setError('Account linking failed. Please try signing in with your original method.')
        }
      } else {
        setError(error instanceof Error ? error.message : `${provider} sign-in failed`)
      }
    } finally {
      setOauthLoading(null)
    }
  }

  const handleAccountLinking = async () => {
    if (!accountLinkingInfo) return

    try {
      setLoading(true)
      setError(null)

      // If user has email/password, they need to sign in first
      if (accountLinkingInfo.existingProviders.includes('password')) {
        if (!email || !password) {
          setError('Please enter your email and password to link accounts')
          return
        }

        // Sign in with email/password first
        await signIn(email, password)

        // Then link the pending credential
        if (accountLinkingInfo.pendingCredential) {
          await linkPendingCredential(accountLinkingInfo.pendingCredential)
        }

        router.push('/dashboard')
      } else {
        setError(
          'Please sign in with one of your existing providers first, then link the new account.'
        )
      }
    } catch (error: unknown) {
      setError(
        'Account linking failed: ' + (error instanceof Error ? error.message : 'Please try again')
      )
    } finally {
      setLoading(false)
    }
  }

  // Check for OAuth redirect results on component mount
  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getOAuthRedirectResult()
        if (result) {
          await handleOAuthSuccess(
            result.user,
            result.isNewUser,
            result.additionalUserInfo?.providerId || 'oauth'
          )
        }
      } catch (error: unknown) {
        logger.error('OAuth redirect error', error)
        setError(error instanceof Error ? error.message : 'OAuth sign-in failed')
      }
    }

    handleRedirectResult().catch((error) => logger.error('OAuth redirect error', error))
  }, [handleOAuthSuccess])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      setError('Please enter both email and password')
      return
    }

    setLoading(true)
    setError(null)

    try {
      await signIn(email, password)
      router.push('/dashboard')
    } catch (error: unknown) {
      logger.error('Sign in error', error)

      let errorMessage = 'Sign in failed'
      if (error instanceof Object && 'code' in error) {
        if (error.code === 'auth/invalid-credential') {
          errorMessage = 'Invalid email or password'
        } else if (error.code === 'auth/user-not-found') {
          errorMessage = 'No account found with this email'
        } else if (error.code === 'auth/wrong-password') {
          errorMessage = 'Incorrect password'
        } else if (error.code === 'auth/too-many-requests') {
          errorMessage = 'Too many failed attempts. Please try again later'
        }
      }
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to CENIE
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Link href="/auth/signup" className="font-medium text-blue-600 hover:text-blue-500">
              Sign up here
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link
                href="/auth/reset-password"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Forgot your password?
              </Link>
            </div>
          </div>

          <div>
            <Button
              type="submit"
              disabled={loading || oauthLoading !== null}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </div>

          {accountLinkingInfo && (
            <div className="mt-4">
              <Button
                onClick={handleAccountLinking}
                disabled={loading}
                className="w-full py-2 px-4 border border-orange-300 text-sm font-medium rounded-md text-orange-700 bg-orange-50 hover:bg-orange-100"
              >
                Link accounts
              </Button>
            </div>
          )}
        </form>

        {/* OAuth Sign-In Section */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3">
            {/* Google Sign-In Button */}
            <Button
              onClick={() => handleOAuthSignIn('google')}
              disabled={loading || oauthLoading !== null}
              variant="outline"
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              {oauthLoading === 'google' ? 'Signing in...' : 'Continue with Google'}
            </Button>

            {/* Apple Sign-In Button */}
            <Button
              onClick={() => handleOAuthSignIn('apple')}
              disabled={loading || oauthLoading !== null}
              variant="outline"
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-black text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
              </svg>
              {oauthLoading === 'apple' ? 'Signing in...' : 'Continue with Apple'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
