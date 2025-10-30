'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
} from 'firebase/auth'
import { getFirebaseAuth } from '@cenie/firebase/client'
import { useAuth } from '@cenie/firebase/auth'
import Button from '@/components/ui/Button'
import { clsx } from 'clsx'
import { TYPOGRAPHY } from '@/lib/typography'
import { hubAuth } from '../../lib/hub-auth'
import { Loader2 } from 'lucide-react'

function SignInForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/'
  const { user } = useAuth()

  // Redirect if already authenticated - moved to useEffect to avoid setState during render
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
    setLoading(true)
    setError('')

    try {
      const auth = getFirebaseAuth()
      const result = await signInWithEmailAndPassword(auth, email, password)

      // Get ID token and check app access
      const idToken = await result.user.getIdToken()
      console.log('🔐 [Email Sign-In] Got Firebase ID token, length:', idToken.length)
      console.log('🔐 [Email Sign-In] Checking app access...')

      const hasAccess = await hubAuth.checkAppAccess(idToken, 'editorial')
      console.log('🔐 [Email Sign-In] App access check result:', hasAccess)

      if (!hasAccess) {
        console.error('❌ [Email Sign-In] User does not have access to Editorial app')
        setError('You do not have access to the Editorial app. Please contact your administrator.')
        return
      }

      // Create server-side session cookie
      console.log('🔐 [Email Sign-In] Access granted! Creating session cookie...')
      console.log('🔐 [Email Sign-In] ID token length:', idToken.length)

      const sessionResponse = await fetch('/api/auth/session', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      })

      console.log('🔐 [Email Sign-In] Session API response status:', sessionResponse.status)
      const sessionData = await sessionResponse.json()
      console.log('🔐 [Email Sign-In] Session API response data:', sessionData)

      if (!sessionResponse.ok) {
        console.error('❌ [Email Sign-In] Failed to create session:', sessionData)
        throw new Error(`Failed to create session: ${sessionData.error || 'Unknown error'}`)
      }

      console.log('✅ [Email Sign-In] Session created successfully!')
      console.log('✅ [Email Sign-In] Redirecting to:', redirectTo)
      router.push(redirectTo)
    } catch (error: any) {
      console.error('❌ [Email Sign-In] Error occurred:', error)
      console.error('❌ [Email Sign-In] Error stack:', error?.stack)

      switch (error.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          setError('Invalid email or password.')
          break
        case 'auth/too-many-requests':
          setError('Too many failed attempts. Please try again later.')
          break
        case 'auth/user-disabled':
          setError('This account has been disabled.')
          break
        default:
          setError('An error occurred during sign-in. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError('')

    try {
      const auth = getFirebaseAuth()
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)

      // Get ID token and check app access
      const idToken = await result.user.getIdToken()
      console.log('🔐 [Google Sign-In] Got Firebase ID token, length:', idToken.length)
      console.log('🔐 [Google Sign-In] User ID:', result.user.uid)
      console.log('🔐 [Google Sign-In] User Email:', result.user.email)
      console.log('🔐 [Google Sign-In] Checking app access...')

      const hasAccess = await hubAuth.checkAppAccess(idToken, 'editorial')
      console.log('🔐 [Google Sign-In] App access check result:', hasAccess)

      if (!hasAccess) {
        console.error('❌ [Google Sign-In] User does not have access to Editorial app')
        setError('You do not have access to the Editorial app. Please contact your administrator.')
        return
      }

      // Create server-side session cookie
      console.log('🔐 [Google Sign-In] Access granted! Creating session cookie...')
      const sessionResponse = await fetch('/api/auth/session', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      })

      console.log('🔐 [Google Sign-In] Session API response status:', sessionResponse.status)
      const sessionData = await sessionResponse.json()
      console.log('🔐 [Google Sign-In] Session API response data:', sessionData)

      if (!sessionResponse.ok) {
        console.error('❌ [Google Sign-In] Failed to create session:', sessionData)
        throw new Error(`Failed to create session: ${sessionData.error || 'Unknown error'}`)
      }

      console.log('✅ [Google Sign-In] Session created successfully, redirecting to:', redirectTo)
      router.push(redirectTo)
    } catch (error: any) {
      console.error('❌ [Google Sign-In] Error:', error)

      if (error.code !== 'auth/popup-closed-by-user') {
        setError('Failed to sign in with Google. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleAppleSignIn = async () => {
    setLoading(true)
    setError('')

    try {
      const auth = getFirebaseAuth()
      const provider = new OAuthProvider('apple.com')
      const result = await signInWithPopup(auth, provider)

      // Get ID token and check app access
      const idToken = await result.user.getIdToken()
      console.log('🔐 [Apple Sign-In] Got Firebase ID token, length:', idToken.length)
      console.log('🔐 [Apple Sign-In] Checking app access...')

      const hasAccess = await hubAuth.checkAppAccess(idToken, 'editorial')
      console.log('🔐 [Apple Sign-In] App access check result:', hasAccess)

      if (!hasAccess) {
        console.error('❌ [Apple Sign-In] User does not have access to Editorial app')
        setError('You do not have access to the Editorial app. Please contact your administrator.')
        return
      }

      // Create server-side session cookie
      console.log('🔐 [Apple Sign-In] Access granted! Creating session cookie...')
      const sessionResponse = await fetch('/api/auth/session', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      })

      console.log('🔐 [Apple Sign-In] Session API response status:', sessionResponse.status)
      const sessionData = await sessionResponse.json()
      console.log('🔐 [Apple Sign-In] Session API response data:', sessionData)

      if (!sessionResponse.ok) {
        console.error('❌ [Apple Sign-In] Failed to create session:', sessionData)
        throw new Error(`Failed to create session: ${sessionData.error || 'Unknown error'}`)
      }

      console.log('✅ [Apple Sign-In] Session created successfully, redirecting to:', redirectTo)
      router.push(redirectTo)
    } catch (error: any) {
      console.error('❌ [Apple Sign-In] Error:', error)

      if (error.code !== 'auth/popup-closed-by-user') {
        setError('Failed to sign in with Apple. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

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

        <form className="mt-8 space-y-6" onSubmit={handleEmailSignIn}>
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-none">
              <p className={clsx(TYPOGRAPHY.bodyBase)}>{error}</p>
            </div>
          )}

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
              disabled={loading}
              variant="primary"
              fullWidth
              leadingIcon={loading ? Loader2 : undefined}
            >
              {loading ? 'Signing in...' : 'Sign in'}
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

          <div className="space-y-3">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className={clsx(
                TYPOGRAPHY.bodyBase,
                'group relative w-full flex justify-center items-center gap-2 py-2 px-4 border border-border text-foreground bg-card hover:bg-muted rounded-none focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
              )}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
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
              Sign in with Google
            </button>

            <button
              type="button"
              onClick={handleAppleSignIn}
              disabled={loading}
              className={clsx(
                TYPOGRAPHY.bodyBase,
                'group relative w-full flex justify-center items-center gap-2 py-2 px-4 border border-border text-foreground bg-card hover:bg-muted rounded-none focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
              )}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              Sign in with Apple
            </button>
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
