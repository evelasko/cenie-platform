# TASK 2-1: Create Academy Sign-In/Sign-Up Pages

**Phase**: 2 - Academy Authentication  
**Duration**: 1 day  
**Dependencies**: Phase 1A complete (auth packages ready)  
**Next Task**: TASK_22 (Session & Access API Routes)

---

## OBJECTIVE

Create fully functional sign-in and sign-up pages for Academy app with email/password authentication and OAuth (Google + Apple). These pages are the entry point to Academy's authenticated features.

**What You're Building**: User-facing authentication UI with Academy branding.

**Why This Matters**: First impression for students and instructors. Must be polished, functional, and match Academy's educational brand identity.

---

## ARCHITECTURE CONTEXT

### Authentication User Journey

**New User (Student)**:

```
Visit academy.cenie.org
  → Click "Get Started"
  → Sign up page
  → Choose: Email or Google or Apple
  → Create account
  → Auto-grant 'student' role
  → Redirect to student dashboard
```

**Returning User**:

```
Visit academy.cenie.org
  → Click "Sign In"
  → Sign in page
  → Choose: Email or OAuth
  → Authenticate
  → Check Academy access in Firestore
  → Create session cookie
  → Redirect to role-appropriate dashboard
```

**Account Linking** (edge case handled):

```
User signs up with email
  → Later tries Google with same email
  → OAuth error: "account exists"
  → Show linking dialog
  → User signs in with email
  → Links Google account
  → Now can use either method
```

---

## SOURCE FILES TO STUDY

**Primary References** (other apps' auth pages):

1. `apps/editorial/src/app/sign-in/page.tsx`
   - Lines 20-399: Complete sign-in implementation
   - Shows email/password form
   - OAuth integration pattern
   - Access check before redirect
   - Session creation flow
   - **Use this as template structure**

2. `apps/hub/src/app/[locale]/auth/signin/page.tsx`
   - Alternative implementation with i18n
   - More sophisticated (might be overwhelming)
   - Has account linking UI
   - **Reference for OAuth patterns**

3. Current Academy placeholder: `apps/academy/src/app/sign-in/page.tsx`
   - Minimal implementation
   - Will be completely replaced

**Recommended Approach**: Start with Editorial's structure, adapt branding for Academy.

---

## WHAT TO BUILD

### Files to Create/Update

```
apps/academy/src/app/
├── (auth)/                    (NEW - route group for auth pages)
│   ├── sign-in/
│   │   └── page.tsx          (REPLACE existing)
│   ├── sign-up/
│   │   └── page.tsx          (NEW)
│   └── layout.tsx            (NEW - simple layout without main nav)
├── lib/                       (NEW directory)
│   ├── auth.ts               (NEW - Academy-specific auth helpers)
│   └── constants.ts          (NEW - Academy constants)
```

---

## DETAILED REQUIREMENTS

### File 1: Academy Auth Helpers (`src/lib/auth.ts`)

**Purpose**: Academy-specific wrappers for shared auth packages

```typescript
import { withRole } from '@cenie/auth-server/middleware'
import type { AcademyRole } from '@cenie/auth-utils/roles'

/**
 * Require student role or higher for Academy routes
 */
export const requireStudent = () => withRole('academy', 'student')

/**
 * Require instructor role or higher for Academy routes
 */
export const requireInstructor = () => withRole('academy', 'instructor')

/**
 * Require admin role for Academy routes
 */
export const requireAcademyAdmin = () => withRole('academy', 'admin')
```

This provides clean, Academy-specific helpers for API routes.

### File 2: Academy Constants (`src/lib/constants.ts`)

```typescript
export const ACADEMY_CONFIG = {
  appName: 'academy' as const,
  displayName: 'CENIE Academy',
  baseUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002',

  // OAuth redirect URLs
  oauth: {
    redirectTo: '/dashboard',
    signInUrl: '/sign-in',
    signUpUrl: '/sign-up',
  },

  // Session configuration
  session: {
    cookieName: 'session',
    maxAge: 14 * 24 * 60 * 60, // 14 days
  },

  // Role configuration
  defaultRole: 'student' as const,
  roles: {
    student: {
      displayName: 'Student',
      dashboardPath: '/dashboard',
    },
    instructor: {
      displayName: 'Instructor',
      dashboardPath: '/dashboard/courses',
    },
    admin: {
      displayName: 'Administrator',
      dashboardPath: '/dashboard/admin',
    },
  },
}
```

### File 3: Auth Layout (`src/app/(auth)/layout.tsx`)

**Purpose**: Simple layout for auth pages (no navigation, centered content)

```typescript
import { Geist } from 'next/font/google'

const geist = Geist({
  subsets: ['latin'],
})

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 ${geist.className}`}>
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  )
}
```

**Academy branding**: Blue gradient background, centered card layout.

### File 4: Sign-In Page (`src/app/(auth)/sign-in/page.tsx`)

**Purpose**: Complete sign-in page with email/password and OAuth

**Implementation Pattern** (extract from Editorial, adapt branding):

```typescript
'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { getFirebaseAuth } from '@cenie/firebase/client'
import { useOAuth } from '@cenie/oauth-handlers/hooks'
import { OAuthButton, OAuthErrorHandler } from '@cenie/oauth-handlers/components'
import { Button } from '@cenie/ui'
import { LogoAcademy } from '@cenie/ui/graphics'
import { createLogger } from '@cenie/logger'
import { ACADEMY_CONFIG } from '@/lib/constants'
import Link from 'next/link'

const logger = createLogger({ name: 'academy-signin' })

export default function AcademySignInPage() {
  // Form state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || ACADEMY_CONFIG.oauth.redirectTo

  // OAuth hook
  const {
    signInWithGoogle,
    signInWithApple,
    oauthLoading,
    error: oauthError,
    accountLinkingInfo,
    handleLinkAccount,
    handleRetry,
  } = useOAuth({
    redirectTo,
    onSuccess: async (result) => {
      // After successful OAuth, check Academy access
      await checkAccessAndCreateSession(result.user)
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
    } catch (err: any) {
      logger.error('Email sign-in failed', { error: err })
      setError(err.message || 'Sign-in failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Check access and create session
  const checkAccessAndCreateSession = async (user: any) => {
    try {
      // Get ID token
      const idToken = await user.getIdToken()

      // Check Academy access
      const accessResponse = await fetch('/api/users/apps/academy/access', {
        headers: { Authorization: `Bearer ${idToken}` },
      })

      if (!accessResponse.ok) {
        setError('You do not have access to Academy. Please contact support.')
        logger.warn('User has no Academy access', { userId: user.uid })
        return
      }

      const accessData = await accessResponse.json()

      if (!accessData.hasAccess) {
        setError('Academy access not granted. Please contact support.')
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
      const dashboardPath = ACADEMY_CONFIG.roles[accessData.role]?.dashboardPath || '/dashboard'
      router.push(dashboardPath)

    } catch (err) {
      logger.error('Access check or session creation failed', { error: err })
      setError('Authentication failed. Please try again.')
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-xl p-8">
      {/* Logo */}
      <div className="flex justify-center mb-6">
        <LogoAcademy className="h-12 w-auto" />
      </div>

      {/* Heading */}
      <h1 className="text-2xl font-bold text-center mb-2">Welcome Back</h1>
      <p className="text-gray-600 text-center mb-6">
        Sign in to continue your learning journey
      </p>

      {/* Error display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* OAuth error handler */}
      {oauthError && accountLinkingInfo && (
        <OAuthErrorHandler
          error={oauthError}
          accountLinkingInfo={accountLinkingInfo}
          onLinkAccount={handleLinkAccount}
          onRetry={handleRetry}
          onContactSupport={() => router.push('/support')}
        />
      )}

      {/* OAuth buttons */}
      <div className="space-y-3 mb-6">
        <OAuthButton
          provider="google"
          onClick={signInWithGoogle}
          loading={oauthLoading === 'google'}
          className="w-full"
        />

        <OAuthButton
          provider="apple"
          onClick={signInWithApple}
          loading={oauthLoading === 'apple'}
          className="w-full"
        />
      </div>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with email</span>
        </div>
      </div>

      {/* Email/password form */}
      <form onSubmit={handleEmailSignIn} className="space-y-4">
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="••••••••"
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input type="checkbox" className="rounded border-gray-300 text-blue-600" />
            <span className="ml-2 text-sm text-gray-600">Remember me</span>
          </label>

          <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          disabled={loading || !!oauthLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>

      {/* Sign up link */}
      <p className="mt-6 text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <Link href="/sign-up" className="text-blue-600 hover:underline font-medium">
          Sign up
        </Link>
      </p>
    </div>
  )
}
```

### File 5: Sign-Up Page (`src/app/(auth)/sign-up/page.tsx`)

**Purpose**: User registration with email/password or OAuth

**Implementation** (similar to sign-in but with additional fields):

```typescript
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { getFirebaseAuth } from '@cenie/firebase/client'
import { useOAuth } from '@cenie/oauth-handlers/hooks'
import { OAuthButton } from '@cenie/oauth-handlers/components'
import { Button } from '@cenie/ui'
import { LogoAcademy } from '@cenie/ui/graphics'
import { createLogger } from '@cenie/logger'
import { ACADEMY_CONFIG } from '@/lib/constants'
import Link from 'next/link'

const logger = createLogger({ name: 'academy-signup' })

export default function AcademySignUpPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const router = useRouter()

  const {
    signInWithGoogle,
    signInWithApple,
    oauthLoading,
  } = useOAuth({
    redirectTo: ACADEMY_CONFIG.oauth.redirectTo,
    onSuccess: async (result) => {
      // OAuth signup automatically creates user and grants access
      await handlePostSignup(result.user)
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
    } catch (err: any) {
      logger.error('Email signup failed', { error: err })

      if (err.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists. Please sign in.')
      } else if (err.code === 'auth/weak-password') {
        setError('Password is too weak. Please use a stronger password.')
      } else {
        setError(err.message || 'Signup failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handlePostSignup = async (user: any) => {
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
    } catch (err) {
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
      <p className="text-gray-600 text-center mb-6">
        Start your learning journey today
      </p>

      {/* Error display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* OAuth buttons */}
      <div className="space-y-3 mb-6">
        <OAuthButton
          provider="google"
          onClick={signInWithGoogle}
          loading={oauthLoading === 'google'}
          className="w-full"
        />

        <OAuthButton
          provider="apple"
          onClick={signInWithApple}
          loading={oauthLoading === 'apple'}
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
          disabled={loading || !!oauthLoading}
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
```

---

## ACADEMY BRANDING

### Color Scheme (Academy Blue)

```css
/* Add to apps/academy/src/app/globals.css */
:root {
  --academy-primary: #2563eb; /* Blue-600 */
  --academy-primary-hover: #1d4ed8; /* Blue-700 */
  --academy-secondary: #3b82f6; /* Blue-500 */
  --academy-accent: #60a5fa; /* Blue-400 */
  --academy-background: #eff6ff; /* Blue-50 */
}
```

### Typography

Already using Geist font (modern, clean, educational vibe):

```typescript
import { Geist } from 'next/font/google'

const geist = Geist({
  subsets: ['latin'],
})
```

Apply with `className={geist.className}` in layout.

---

## TESTING REQUIREMENTS

### Test 1: Sign-Up Flow

```bash
pnpm --filter=@cenie/academy dev
```

1. Visit <http://localhost:3002/sign-up>
2. Fill in form:
   - Full Name: "Test Student"
   - Email: "<test.student@example.com>"
   - Password: "test123"
   - Confirm: "test123"
3. Submit
4. Should create Firebase user
5. Check terminal logs for success
6. Should attempt to create session (will work after TASK_22)

**Expected**:

- Form validation working
- Password confirmation working
- Firebase user created
- Redirect attempted (might fail if session API not ready)

### Test 2: Google OAuth

1. Visit <http://localhost:3002/sign-in>
2. Click "Continue with Google"
3. Google popup opens
4. Select account
5. Should close popup
6. Should call OAuth success handler
7. Should check Academy access (will work after TASK_22)

**Expected**:

- OAuth popup working
- No JavaScript errors in console
- Success handler called

### Test 3: UI/UX

**Visual checks**:

- [ ] Page centered vertically and horizontally
- [ ] Blue gradient background
- [ ] White card with shadow
- [ ] Logo displays correctly
- [ ] Buttons styled with Academy blue
- [ ] Form fields have focus states
- [ ] Error messages display clearly
- [ ] Responsive on mobile (test at 375px width)

### Test 4: Account Linking (after TASK_22 complete)

1. Sign up with email: <test@example.com>
2. Sign out
3. Try Google OAuth with same email
4. Should show account linking dialog
5. Follow linking flow
6. Should succeed

---

## SUCCESS CRITERIA

- [ ] Sign-in page created and functional
- [ ] Sign-up page created and functional
- [ ] OAuth integration working (Google + Apple)
- [ ] Email/password authentication working
- [ ] Form validation working
- [ ] Academy branding applied (blue theme, Geist font)
- [ ] Error handling comprehensive
- [ ] Account linking UI prepared (will be tested after TASK_22)
- [ ] Responsive design (mobile-friendly)
- [ ] TypeScript strict mode passing
- [ ] Linting clean

---

## COMMON PITFALLS

1. **Don't forget 'use client' directive**: Auth pages need client-side JavaScript

2. **Don't skip validation**: Check password match, email format, etc.

3. **Don't hardcode redirect URLs**: Use ACADEMY_CONFIG constants

4. **Don't test with production OAuth**: Use Firebase test accounts

5. **Don't forget error states**: Loading, success, error all need UI

---

## STYLING NOTES

**Academy Theme**:

- Primary action: Blue-600 (#2563eb)
- Hover states: Blue-700 (#1d4ed8)
- Background: Blue-50 gradient (#eff6ff)
- Text: Gray-900 for headings, Gray-600 for body
- Accent: Blue-400 for links

**Use Tailwind v4** (already configured in Academy):

```bash
# Check Academy has Tailwind configured
cat apps/academy/postcss.config.mjs
```

---

## FIREBASE CONSOLE CONFIGURATION

### Enable OAuth Providers

1. Open Firebase Console → Authentication
2. Sign-in method tab
3. Enable Google:
   - Add authorized domains: academy.cenie.org, localhost
4. Enable Apple:
   - Configure Apple Services ID
   - Add authorized domains

**OAuth Consent Screen**:

- App name: "CENIE Academy"
- App logo: Academy logo
- Support email: <academy@cenie.org>

---

## HANDOFF

When complete:

- [ ] Auth pages functional
- [ ] OAuth providers configured
- [ ] UI polished and branded
- [ ] Ready for session API (TASK_22)

**Next**: TASK_22 will create the server-side session and access APIs that these pages call.

---

**Estimated Time**: 6-8 hours

**Note**: Pages will be fully functional after TASK_22 adds the API routes they depend on. For now, focus on UI/UX and client-side auth flows.
