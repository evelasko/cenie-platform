'use client'

import { Button } from '@cenie/ui'
import { LogoAgency } from '@cenie/ui/graphics'
import { createLogger } from '@cenie/logger'
import { getFirebaseAuth } from '@cenie/firebase/client'
import { useOAuth } from '@cenie/oauth-handlers/hooks'
import { OAuthButton, OAuthErrorHandler } from '@cenie/oauth-handlers/components'
import { signInWithEmailAndPassword } from 'firebase/auth'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'

import { AGENCY_CONFIG } from '@/lib/constants'

const logger = createLogger({ name: 'agency:signin' })

export default function AgencySignInPage() {
  return (
    <Suspense fallback={<div className="text-center text-slate-300 p-8">Loading...</div>}>
      <AgencySignInContent />
    </Suspense>
  )
}

function AgencySignInContent() {
  // Form state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || AGENCY_CONFIG.oauth.redirectTo

  // OAuth hook
  const oauth = useOAuth({
    redirectTo,
    onSuccess: async (result) => {
      // After successful OAuth, check Agency access
      await checkAccessAndCreateSession(result.user)
    },
    onError: (err) => {
      logger.error('OAuth error', { error: err })
    },
  })

  // Email/password sign-in
  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const auth = getFirebaseAuth()
      const result = await signInWithEmailAndPassword(auth, email, password)

      await checkAccessAndCreateSession(result.user)
    } catch (err: unknown) {
      logger.error('Email sign-in failed', { error: err })
      const errorMessage =
        err && typeof err === 'object' && 'code' in err
          ? err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found'
            ? 'Invalid email or password'
            : err.code === 'auth/too-many-requests'
              ? 'Too many failed attempts. Please try again later.'
              : 'Sign-in failed. Please try again.'
          : 'Sign-in failed. Please try again.'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Check access and create session
  const checkAccessAndCreateSession = async (user: { uid: string; getIdToken: () => Promise<string> }) => {
    try {
      // Get ID token
      const idToken = await user.getIdToken()

      // Check Agency access
      const accessResponse = await fetch('/api/users/apps/agency/access', {
        headers: { Authorization: `Bearer ${idToken}` },
      })

      if (!accessResponse.ok) {
        setError('You do not have access to Agency. Please contact support.')
        logger.warn('User has no Agency access', { userId: user.uid })
        return
      }

      const accessData = await accessResponse.json()

      if (!accessData.hasAccess) {
        setError('Agency access not granted. Please contact support.')
        return
      }

      // Create session
      const sessionResponse = await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      })

      if (!sessionResponse.ok) {
        setError('Failed to create session. Please try again.')
        return
      }

      // Success - redirect to role-appropriate dashboard
      const dashboardPath =
        AGENCY_CONFIG.roles[accessData.role as keyof typeof AGENCY_CONFIG.roles]
          ?.dashboardPath || '/dashboard'
      router.push(dashboardPath)
    } catch (err: unknown) {
      logger.error('Access check or session creation failed', { error: err })
      setError('Authentication failed. Please try again.')
    }
  }

  return (
    <div className="bg-slate-800 rounded-lg shadow-2xl p-8 border border-slate-700">
      {/* Logo */}
      <div className="flex justify-center mb-6">
        <LogoAgency className="h-12 w-auto" />
      </div>

      {/* Heading */}
      <h1 className="text-2xl font-bold text-center mb-2 text-white uppercase tracking-wide">
        Welcome to Agency
      </h1>
      <p className="text-slate-300 text-center mb-6">Access your automation solutions</p>

      {/* Error display */}
      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded mb-4">
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
          <div className="w-full border-t border-slate-600" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-slate-800 text-slate-400">Or continue with email</span>
        </div>
      </div>

      {/* Email/password form */}
      <form onSubmit={handleEmailSignIn} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">
            EMAIL
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-white placeholder-slate-400"
            placeholder="client@company.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1">
            PASSWORD
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-white placeholder-slate-400"
            placeholder="••••••••"
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input type="checkbox" className="rounded border-slate-600 text-sky-500 bg-slate-700" />
            <span className="ml-2 text-sm text-slate-300">Remember me</span>
          </label>

          <Link href="/forgot-password" className="text-sm text-sky-400 hover:underline">
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          disabled={loading || !!oauth.oauthLoading}
          className="w-full bg-slate-700 hover:bg-slate-600 text-white uppercase tracking-wide font-bold"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>

      {/* Sign up link */}
      <p className="mt-6 text-center text-sm text-slate-400">
        Don&apos;t have an account?{' '}
        <Link href="/sign-up" className="text-sky-400 hover:underline font-medium">
          Sign up
        </Link>
      </p>
    </div>
  )
}

