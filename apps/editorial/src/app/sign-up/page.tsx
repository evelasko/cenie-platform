'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { getFirebaseAuth } from '@cenie/firebase/client'
import { useAuth } from '@cenie/firebase/auth'
import Button from '@/components/ui/Button'
import { clsx } from 'clsx'
import { TYPOGRAPHY } from '@/lib/typography'
import { hubAuth } from '../../lib/hub-auth'
import { Loader2 } from 'lucide-react'
import { logger } from '@/lib/logger-client'

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const router = useRouter()
  const { user } = useAuth()

  // Redirect if already authenticated - moved to useEffect to avoid setState during render
  useEffect(() => {
    if (user) {
      router.push('/')
    }
  }, [user, router])

  // Show loading while redirecting
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    )
  }

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      // Create user via Hub API (this handles both Firebase Auth and Firestore profile)
      const response = await hubAuth.signUp({
        email,
        password,
        fullName: fullName.trim() || undefined,
      })

      if (!response.success) {
        throw new Error(response.error || 'Failed to create account')
      }

      setSuccess(
        'Account created successfully! Please check your email for verification instructions.'
      )

      // Optionally redirect to sign-in after a delay
      setTimeout(() => {
        router.push('/sign-in')
      }, 3000)
    } catch (error: any) {
      logger.error('Sign-up error', { error, code: error.code })

      // Handle common Firebase Auth errors
      switch (error.code) {
        case 'auth/email-already-in-use':
          setError('An account with this email already exists.')
          break
        case 'auth/weak-password':
          setError('Password should be at least 6 characters.')
          break
        case 'auth/invalid-email':
          setError('Please enter a valid email address.')
          break
        default:
          setError(error.message || 'An error occurred during sign-up. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const auth = getFirebaseAuth()
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)

      // For Google sign-up, the user is already created in Firebase Auth
      // We need to ensure they have a profile in our system via the Hub API
      const idToken = await result.user.getIdToken()

      // Try to get user profile, if it doesn't exist, the Hub will create it
      const profileResponse = await hubAuth.getUserProfile(idToken)

      if (!profileResponse.success) {
        // If profile doesn't exist, create it
        const signUpResponse = await hubAuth.signUp({
          email: result.user.email!,
          password: '', // Not needed for Google users
          fullName: result.user.displayName || undefined,
        })

        if (!signUpResponse.success) {
          throw new Error(signUpResponse.error || 'Failed to complete account setup')
        }
      }

      router.push('/')
    } catch (error: any) {
      logger.error('Google sign-up error', { error, code: error.code })

      if (error.code !== 'auth/popup-closed-by-user') {
        setError('Failed to sign up with Google. Please try again.')
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
            Create your Editorial account
          </h2>
          <p className={clsx(TYPOGRAPHY.bodyBase, 'mt-2 text-center text-muted-foreground')}>
            Join the Academic Publishing Platform
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleEmailSignUp}>
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-none">
              <p className={clsx(TYPOGRAPHY.bodyBase)}>{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-primary/10 border border-primary/20 text-primary px-4 py-3 rounded-none">
              <p className={clsx(TYPOGRAPHY.bodyBase)}>{success}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label
                htmlFor="fullName"
                className={clsx(TYPOGRAPHY.bodySmall, 'block font-medium text-foreground')}
              >
                Full Name (optional)
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={clsx(
                  TYPOGRAPHY.bodyBase,
                  'mt-1 appearance-none relative block w-full px-3 py-2 border border-border placeholder:text-muted-foreground text-foreground rounded-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                )}
                placeholder="Enter your full name"
              />
            </div>

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
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={clsx(
                  TYPOGRAPHY.bodyBase,
                  'mt-1 appearance-none relative block w-full px-3 py-2 border border-border placeholder:text-muted-foreground text-foreground rounded-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                )}
                placeholder="Create a password (min. 6 characters)"
                minLength={6}
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
              {loading ? 'Creating account...' : 'Create account'}
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

          <div>
            <button
              type="button"
              onClick={handleGoogleSignUp}
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
              Sign up with Google
            </button>
          </div>
        </form>

        <div className="text-center">
          <p className={clsx(TYPOGRAPHY.bodySmall, 'mt-2 text-muted-foreground')}>
            Already have an account?{' '}
            <a
              href="/sign-in"
              className="font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Sign in here
            </a>
          </p>
        </div>

        <div className={clsx(TYPOGRAPHY.caption, 'text-muted-foreground text-center')}>
          <p>By creating an account, you agree to our Terms of Service and Privacy Policy.</p>
        </div>
      </div>
    </div>
  )
}
