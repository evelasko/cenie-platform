'use client'

import { Button, LogoAcademy } from '@cenie/ui'
import { createLogger } from '@cenie/logger'
import { getFirebaseAuth } from '@cenie/firebase/client'
import { useOAuth } from '@cenie/oauth-handlers/hooks'
import { OAuthButton, OAuthErrorHandler } from '@cenie/oauth-handlers/components'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { ACADEMY_CONFIG } from '@/lib/constants'

const logger = createLogger({ name: 'academy:signup' })

export default function AcademySignUpPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const router = useRouter()

  const oauth = useOAuth({
    redirectTo: ACADEMY_CONFIG.oauth.redirectTo,
    onSuccess: async (result) => {
      // OAuth signup automatically creates user and grants access
      await handlePostSignup(result.user)
    },
    onError: (err) => {
      logger.error('OAuth error', { error: err })
    },
  })

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validation
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    try {
      const auth = getFirebaseAuth()

      // Create Firebase user
      const result = await createUserWithEmailAndPassword(auth, email, password)

      // Update profile with full name
      if (fullName) {
        await updateProfile(result.user, { displayName: fullName })
      }

      logger.info('User created successfully', { userId: result.user.uid })

      await handlePostSignup(result.user)
    } catch (err: unknown) {
      logger.error('Email signup failed', { error: err })

      if (err && typeof err === 'object' && 'code' in err) {
        if (err.code === 'auth/email-already-in-use') {
          setError('An account with this email already exists. Please sign in.')
        } else if (err.code === 'auth/weak-password') {
          setError('Password is too weak. Please use a stronger password.')
        } else if (err.code === 'auth/invalid-email') {
          setError('Invalid email address.')
        } else {
          setError('Signup failed. Please try again.')
        }
      } else {
        setError('Signup failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handlePostSignup = async (user: { uid: string; getIdToken: () => Promise<string> }) => {
    try {
      const idToken = await user.getIdToken()

      // Call server to grant Academy access and create profile
      const response = await fetch('/api/auth/oauth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          appName: 'academy',
          role: ACADEMY_CONFIG.defaultRole, // 'student'
          isNewUser: true,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to complete signup')
      }

      // Create session
      const sessionResponse = await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      })

      if (!sessionResponse.ok) {
        throw new Error('Failed to create session')
      }

      // Success - redirect to student dashboard
      router.push('/dashboard')
    } catch (err: unknown) {
      logger.error('Post-signup processing failed', { error: err })
      setError('Account created but setup failed. Please try signing in.')
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-xl p-8">
      {/* Logo */}
      <div className="flex justify-center mb-6">
        <LogoAcademy className="h-12 w-auto" />
      </div>

      {/* Heading */}
      <h1 className="text-2xl font-bold text-center mb-2">Join Academy</h1>
      <p className="text-gray-600 text-center mb-6">Start your learning journey today</p>

      {/* Error display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* OAuth error handler */}
      <OAuthErrorHandler
        error={oauth.error}
        accountLinkingInfo={oauth.accountLinkingInfo}
        onLinkAccount={() => oauth.linkAccount()}
        onRetry={oauth.clearError}
        onContactSupport={() => router.push('/support')}
      />

      {/* OAuth buttons */}
      <div className="space-y-3 mb-6">
        <OAuthButton
          provider="google"
          onClick={() => oauth.signInWithProvider('google')}
          loading={oauth.oauthLoading === 'google'}
          className="w-full"
        />

        <OAuthButton
          provider="apple"
          onClick={() => oauth.signInWithProvider('apple')}
          loading={oauth.oauthLoading === 'apple'}
          className="w-full"
        />
      </div>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or sign up with email</span>
        </div>
      </div>

      {/* Signup form */}
      <form onSubmit={handleEmailSignUp} className="space-y-4">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="student@example.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="At least 6 characters"
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Repeat password"
          />
        </div>

        <Button
          type="submit"
          disabled={loading || !!oauth.oauthLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </Button>
      </form>

      {/* Terms */}
      <p className="mt-4 text-xs text-gray-500 text-center">
        By signing up, you agree to our{' '}
        <Link href="/terms" className="text-blue-600 hover:underline">
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link href="/privacy" className="text-blue-600 hover:underline">
          Privacy Policy
        </Link>
      </p>

      {/* Sign in link */}
      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link href="/sign-in" className="text-blue-600 hover:underline font-medium">
          Sign in
        </Link>
      </p>
    </div>
  )
}

