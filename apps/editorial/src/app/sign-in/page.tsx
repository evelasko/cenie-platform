'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from '@cenie/firebase/auth'
import { useAuth } from '@cenie/firebase/auth'
import { useOAuth } from '@cenie/oauth-handlers/hooks'
import { OAuthButton, OAuthErrorHandler } from '@cenie/oauth-handlers/components'
import { logger } from '@/lib/logger-client'
import Button from '@/components/ui/Button'
import { clsx } from 'clsx'
import { TYPOGRAPHY } from '@/lib/typography'
import { Loader2 } from 'lucide-react'

function SignInForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailLoading, setEmailLoading] = useState(false)
  const [emailError, setEmailError] = useState('')

  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/dashboard'
  const { user } = useAuth()

  // OAuth hook from shared package - handles Google/Apple sign-in,
  // redirect results, account linking, and mobile detection
  const oauth = useOAuth({
    redirectTo,
    onError: (error) => {
      logger.error('[OAuth] Error from shared hook', { error })
    },
  })

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      router.push(redirectTo)
    }
  }, [user, router, redirectTo])

  // Show loading while redirecting
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    )
  }

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setEmailLoading(true)
    setEmailError('')

    try {
      // Use shared signIn helper from @cenie/firebase/auth
      const user = await signIn(email, password)

      // Get ID token and create server-side session
      // The session endpoint also verifies editorial app access
      const idToken = await user.getIdToken()

      const sessionResponse = await fetch('/api/auth/session', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      })

      const sessionData = await sessionResponse.json()

      if (!sessionResponse.ok) {
        if (sessionData.code === 'NO_APP_ACCESS') {
          setEmailError(sessionData.error)
          return
        }
        throw new Error(sessionData.error || 'Failed to create session')
      }

      logger.info('[Email Sign-In] Session created successfully', { redirectTo })
      router.push(redirectTo)
    } catch (error: unknown) {
      logger.error('[Email Sign-In] Error', { error })

      if (error instanceof Object && 'code' in error) {
        const firebaseError = error as { code: string }
        switch (firebaseError.code) {
          case 'auth/user-not-found':
          case 'auth/wrong-password':
          case 'auth/invalid-credential':
            setEmailError('Invalid email or password.')
            break
          case 'auth/too-many-requests':
            setEmailError('Too many failed attempts. Please try again later.')
            break
          case 'auth/user-disabled':
            setEmailError('This account has been disabled.')
            break
          default:
            setEmailError('An error occurred during sign-in. Please try again.')
        }
      } else if (error instanceof Error) {
        setEmailError(error.message)
      } else {
        setEmailError('An error occurred during sign-in. Please try again.')
      }
    } finally {
      setEmailLoading(false)
    }
  }

  const isAnyLoading = emailLoading || oauth.isLoading

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full space-y-8 p-8 bg-card rounded-none shadow-lg border border-border">
        <div>
          <h2 className={clsx(TYPOGRAPHY.display1, 'mt-6 text-center text-foreground')}>
            Sign in to Editorial
          </h2>
          <p className={clsx(TYPOGRAPHY.bodyBase, 'mt-2 text-center text-muted-foreground')}>
            Academic Publishing Platform
          </p>
        </div>

        {/* Error display using shared OAuthErrorHandler for OAuth errors */}
        {oauth.error && (
          <OAuthErrorHandler
            error={oauth.error}
            accountLinkingInfo={oauth.accountLinkingInfo}
            onLinkAccount={() => oauth.linkAccount({ email, password })}
            onRetry={oauth.clearError}
          />
        )}

        {/* Email-specific error display */}
        {emailError && !oauth.error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-none">
            <p className={clsx(TYPOGRAPHY.bodyBase)}>{emailError}</p>
          </div>
        )}

        {/* OAuth success message */}
        {oauth.successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-none">
            <p className={clsx(TYPOGRAPHY.bodyBase)}>{oauth.successMessage}</p>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleEmailSignIn}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className={clsx(TYPOGRAPHY.bodySmall, 'block font-medium text-foreground')}
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={clsx(
                  TYPOGRAPHY.bodyBase,
                  'mt-1 appearance-none relative block w-full px-3 py-2 border border-border placeholder:text-muted-foreground text-foreground rounded-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                )}
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className={clsx(TYPOGRAPHY.bodySmall, 'block font-medium text-foreground')}
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={clsx(
                  TYPOGRAPHY.bodyBase,
                  'mt-1 appearance-none relative block w-full px-3 py-2 border border-border placeholder:text-muted-foreground text-foreground rounded-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                )}
                placeholder="Enter your password"
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              disabled={isAnyLoading}
              variant="primary"
              fullWidth
              leadingIcon={emailLoading ? Loader2 : undefined}
            >
              {emailLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center">
              <span className={clsx(TYPOGRAPHY.bodySmall, 'px-2 bg-card text-muted-foreground')}>
                Or continue with
              </span>
            </div>
          </div>

          {/* OAuth buttons using shared components */}
          <div className="space-y-3">
            <OAuthButton
              provider="google"
              onClick={() => oauth.signInWithProvider('google')}
              loading={oauth.oauthLoading === 'google'}
              disabled={isAnyLoading}
              className="w-full rounded-none"
            />

            <OAuthButton
              provider="apple"
              onClick={() => oauth.signInWithProvider('apple')}
              loading={oauth.oauthLoading === 'apple'}
              disabled={isAnyLoading}
              className="w-full rounded-none"
            />
          </div>
        </form>

        <div className="text-center">
          <p className={clsx(TYPOGRAPHY.bodySmall, 'mt-2 text-muted-foreground')}>
            Don&apos;t have an account?{' '}
            <a
              href="/sign-up"
              className="font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Sign up here
            </a>
          </p>
          <p className={clsx(TYPOGRAPHY.bodySmall, 'mt-2 text-muted-foreground')}>
            <a
              href="/forgot-password"
              className="font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Forgot your password?
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <p className={clsx(TYPOGRAPHY.bodyBase, 'text-muted-foreground')}>Loading...</p>
        </div>
      }
    >
      <SignInForm />
    </Suspense>
  )
}
