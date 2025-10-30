# @cenie/auth-client - Client Package Specification

**Version**: 2.0.0  
**Package Name**: `@cenie/auth-client`  
**Dependencies**: `react@18+`, `@cenie/auth-core`, `@cenie/auth-providers`

---

## Purpose

Provides React-specific authentication integration including hooks, contexts, and client-side utilities. Handles all client-side auth state management, session persistence, and automatic token refresh.

**Key Characteristics**:

- ✅ React hooks for auth state
- ✅ Automatic session management
- ✅ Cross-tab session synchronization
- ✅ Optimistic UI updates
- ✅ Configurable caching strategies
- ✅ TypeScript-first API

---

## Core Components

### Auth Provider (Context)

```typescript
import type { ProviderId, ProviderConfig } from '@cenie/auth-providers'
import type { AuthState, SessionConfig } from '@cenie/auth-core'

/**
 * Auth context provider configuration
 */
export interface AuthProviderConfig {
  /**
   * Which auth provider to use
   */
  provider: ProviderId

  /**
   * Provider-specific configuration
   */
  providerConfig: ProviderConfig

  /**
   * Session management
   */
  session?: {
    /** Session storage strategy */
    storage?: SessionStorageStrategy

    /** Session configuration */
    config?: Partial<SessionConfig>

    /** Auto-refresh sessions */
    autoRefresh?: boolean

    /** Sync sessions across tabs */
    syncTabs?: boolean
  }

  /**
   * Caching strategy
   */
  cache?: {
    /** Enable caching */
    enabled?: boolean

    /** Cache TTL in milliseconds */
    ttl?: number

    /** Cache storage */
    storage?: 'memory' | 'sessionStorage' | 'localStorage'
  }

  /**
   * Retry configuration
   */
  retry?: {
    /** Enable automatic retries */
    enabled?: boolean

    /** Max retry attempts */
    maxAttempts?: number

    /** Backoff strategy */
    backoff?: 'linear' | 'exponential'

    /** Initial retry delay (ms) */
    initialDelay?: number
  }

  /**
   * Callbacks
   */
  callbacks?: {
    /** Called after successful sign-in */
    onSignIn?: (user: User) => void | Promise<void>

    /** Called after sign-out */
    onSignOut?: () => void | Promise<void>

    /** Called when session expires */
    onSessionExpire?: () => void | Promise<void>

    /** Called on auth error */
    onError?: (error: AuthError) => void | Promise<void>
  }

  /**
   * Routing configuration
   */
  routes?: {
    /** Sign-in page path */
    signIn?: string

    /** Sign-up page path */
    signUp?: string

    /** Redirect after sign-in */
    afterSignIn?: string

    /** Redirect after sign-out */
    afterSignOut?: string
  }

  /**
   * Feature flags
   */
  features?: {
    /** Enable email verification */
    emailVerification?: boolean

    /** Enable MFA */
    mfa?: boolean

    /** Enable device fingerprinting */
    deviceFingerprinting?: boolean
  }
}

/**
 * Auth context provider component
 */
export function AuthProvider({
  children,
  config,
}: {
  children: React.ReactNode
  config: AuthProviderConfig
}): JSX.Element {
  // Implementation
}
```

### Auth Context

```typescript
/**
 * Auth context value
 */
export interface AuthContextValue {
  /**
   * Current authentication state
   */
  state: AuthState

  /**
   * Current user (null if not authenticated)
   */
  user: User | null

  /**
   * Current session (null if no session)
   */
  session: Session | null

  /**
   * Loading state
   */
  loading: boolean

  /**
   * Error state
   */
  error: AuthError | null

  /**
   * Authentication methods
   */
  methods: {
    /**
     * Sign in with email and password
     */
    signInWithEmailPassword(email: string, password: string): Promise<void>

    /**
     * Sign up with email and password
     */
    signUpWithEmailPassword(email: string, password: string, displayName?: string): Promise<void>

    /**
     * Sign in with OAuth
     */
    signInWithOAuth(provider: OAuthProviderId, options?: OAuthOptions): Promise<void>

    /**
     * Sign out
     */
    signOut(): Promise<void>

    /**
     * Refresh session
     */
    refreshSession(): Promise<void>

    /**
     * Update user profile
     */
    updateProfile(profile: UserProfile): Promise<void>

    /**
     * Send password reset email
     */
    resetPassword(email: string): Promise<void>

    /**
     * Update password
     */
    updatePassword(currentPassword: string, newPassword: string): Promise<void>
  }

  /**
   * Utility methods
   */
  utils: {
    /**
     * Get current ID token
     */
    getIdToken(forceRefresh?: boolean): Promise<string | null>

    /**
     * Check if user is authenticated
     */
    isAuthenticated(): boolean

    /**
     * Check if session is valid
     */
    isSessionValid(): boolean

    /**
     * Get time until session expires (ms)
     */
    getTimeToExpiry(): number
  }
}

/**
 * Hook to access auth context
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}
```

---

## React Hooks

### useUser Hook

```typescript
/**
 * Hook to access current user
 */
export function useUser(): {
  user: User | null
  loading: boolean
  error: AuthError | null
} {
  const { user, loading, error } = useAuth()
  return { user, loading, error }
}
```

### useSession Hook

```typescript
/**
 * Hook to access current session
 */
export function useSession(): {
  session: Session | null
  loading: boolean
  isValid: boolean
  timeToExpiry: number
  refresh: () => Promise<void>
} {
  const { session, loading, methods, utils } = useAuth()

  return {
    session,
    loading,
    isValid: utils.isSessionValid(),
    timeToExpiry: utils.getTimeToExpiry(),
    refresh: methods.refreshSession,
  }
}
```

### useSignIn Hook

```typescript
/**
 * Hook for sign-in functionality
 */
export function useSignIn() {
  const { methods, loading } = useAuth()
  const [error, setError] = useState<AuthError | null>(null)
  const [isSigningIn, setIsSigningIn] = useState(false)

  const signIn = useCallback(
    async (email: string, password: string) => {
      setIsSigningIn(true)
      setError(null)

      try {
        await methods.signInWithEmailPassword(email, password)
      } catch (err) {
        setError(err as AuthError)
        throw err
      } finally {
        setIsSigningIn(false)
      }
    },
    [methods]
  )

  const signInWithOAuth = useCallback(
    async (provider: OAuthProviderId) => {
      setIsSigningIn(true)
      setError(null)

      try {
        await methods.signInWithOAuth(provider)
      } catch (err) {
        setError(err as AuthError)
        throw err
      } finally {
        setIsSigningIn(false)
      }
    },
    [methods]
  )

  return {
    signIn,
    signInWithOAuth,
    loading: loading || isSigningIn,
    error,
  }
}
```

### useSignOut Hook

```typescript
/**
 * Hook for sign-out functionality
 */
export function useSignOut() {
  const { methods } = useAuth()
  const [isSigningOut, setIsSigningOut] = useState(false)

  const signOut = useCallback(async () => {
    setIsSigningOut(true)
    try {
      await methods.signOut()
    } finally {
      setIsSigningOut(false)
    }
  }, [methods])

  return { signOut, loading: isSigningOut }
}
```

### useAuthRedirect Hook

```typescript
/**
 * Hook for auth-based redirects
 */
export function useAuthRedirect(options?: {
  requireAuth?: boolean
  redirectTo?: string
  onRedirect?: () => void
}): void {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return

    const shouldRedirect = options?.requireAuth ? !user : !!user

    if (shouldRedirect) {
      options?.onRedirect?.()
      router.push(options?.redirectTo ?? '/')
    }
  }, [user, loading, router, options])
}
```

### useIdToken Hook

```typescript
/**
 * Hook to get current ID token
 */
export function useIdToken(options?: { autoRefresh?: boolean; forceRefresh?: boolean }): {
  token: string | null
  loading: boolean
  error: AuthError | null
  refresh: () => Promise<void>
} {
  const { utils } = useAuth()
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<AuthError | null>(null)

  const refresh = useCallback(async () => {
    try {
      setLoading(true)
      const newToken = await utils.getIdToken(options?.forceRefresh)
      setToken(newToken)
      setError(null)
    } catch (err) {
      setError(err as AuthError)
    } finally {
      setLoading(false)
    }
  }, [utils, options?.forceRefresh])

  useEffect(() => {
    refresh()
  }, [refresh])

  // Auto-refresh if enabled
  useEffect(() => {
    if (!options?.autoRefresh || !token) return

    const interval = setInterval(refresh, 30 * 60 * 1000) // 30 minutes
    return () => clearInterval(interval)
  }, [options?.autoRefresh, token, refresh])

  return { token, loading, error, refresh }
}
```

---

## Higher-Order Components

### withAuth HOC

```typescript
/**
 * HOC to protect components with authentication
 */
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    /** Require authentication */
    requireAuth?: boolean

    /** Redirect if not authenticated */
    redirectTo?: string

    /** Loading component */
    LoadingComponent?: React.ComponentType

    /** Unauthorized component */
    UnauthorizedComponent?: React.ComponentType
  }
): React.ComponentType<P> {
  return function AuthenticatedComponent(props: P) {
    const { user, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
      if (loading) return

      if (options?.requireAuth && !user && options.redirectTo) {
        router.push(options.redirectTo)
      }
    }, [user, loading, router])

    if (loading && options?.LoadingComponent) {
      return <options.LoadingComponent />
    }

    if (options?.requireAuth && !user && options?.UnauthorizedComponent) {
      return <options.UnauthorizedComponent />
    }

    if (options?.requireAuth && !user) {
      return null
    }

    return <Component {...props} />
  }
}
```

### withRequireAuth HOC

```typescript
/**
 * Simplified HOC that requires authentication
 */
export function withRequireAuth<P extends object>(
  Component: React.ComponentType<P>,
  redirectTo = '/sign-in'
): React.ComponentType<P> {
  return withAuth(Component, {
    requireAuth: true,
    redirectTo,
  })
}
```

---

## Client-Side Session Management

### Session Manager

```typescript
/**
 * Client-side session manager
 */
export class ClientSessionManager {
  private storage: Storage
  private config: SessionConfig
  private refreshTimer?: NodeJS.Timeout
  private eventEmitter: AuthEventEmitter

  constructor(storage: Storage, config: SessionConfig) {
    this.storage = storage
    this.config = config
    this.eventEmitter = new AuthEventEmitter()
  }

  /**
   * Save session
   */
  async saveSession(session: Session): Promise<void> {
    await this.storage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session))

    // Set up auto-refresh if enabled
    if (this.config.autoRefresh) {
      this.scheduleRefresh(session)
    }

    this.eventEmitter.emit('session-create', session)
  }

  /**
   * Get current session
   */
  async getSession(): Promise<Session | null> {
    const sessionStr = await this.storage.getItem(STORAGE_KEYS.SESSION)
    if (!sessionStr) return null

    try {
      const session: Session = JSON.parse(sessionStr)

      // Check if expired
      if (TimeUtils.isExpired(session.expiresAt)) {
        await this.clearSession()
        this.eventEmitter.emit('session-expire', session)
        return null
      }

      return session
    } catch {
      await this.clearSession()
      return null
    }
  }

  /**
   * Clear session
   */
  async clearSession(): Promise<void> {
    const session = await this.getSession()
    await this.storage.removeItem(STORAGE_KEYS.SESSION)

    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer)
      this.refreshTimer = undefined
    }

    if (session) {
      this.eventEmitter.emit('session-destroy', { sessionId: session.id })
    }
  }

  /**
   * Refresh session
   */
  async refreshSession(refreshFn: () => Promise<Session>): Promise<Session> {
    const newSession = await refreshFn()
    await this.saveSession(newSession)
    this.eventEmitter.emit('session-refresh', newSession)
    return newSession
  }

  /**
   * Schedule automatic session refresh
   */
  private scheduleRefresh(session: Session): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer)
    }

    const timeToRefresh =
      new Date(session.expiresAt).getTime() - Date.now() - this.config.refreshBefore

    if (timeToRefresh > 0) {
      this.refreshTimer = setTimeout(async () => {
        try {
          // Emit event that triggers refresh in auth provider
          this.eventEmitter.emit('session-refresh', session)
        } catch (error) {
          console.error('Auto-refresh failed:', error)
        }
      }, timeToRefresh)
    }
  }

  /**
   * Listen to session events
   */
  on<T extends AuthEventType>(event: T, handler: AuthEventHandler<T>): UnsubscribeFn {
    return this.eventEmitter.on(event, handler)
  }
}
```

---

## Cross-Tab Synchronization

### Tab Sync Manager

```typescript
/**
 * Synchronize auth state across browser tabs
 */
export class TabSyncManager {
  private channel?: BroadcastChannel
  private storage: Storage
  private onStateChange: (state: AuthState) => void

  constructor(storage: Storage, onStateChange: (state: AuthState) => void) {
    this.storage = storage
    this.onStateChange = onStateChange

    // Use BroadcastChannel for modern browsers
    if ('BroadcastChannel' in window) {
      this.channel = new BroadcastChannel('cenie-auth')
      this.setupBroadcastChannel()
    } else {
      // Fallback to localStorage events
      this.setupStorageListener()
    }
  }

  /**
   * Broadcast auth state change to other tabs
   */
  broadcast(state: AuthState): void {
    if (this.channel) {
      this.channel.postMessage({
        type: 'auth-state-change',
        state,
      })
    } else {
      // Use localStorage as fallback
      const key = '@cenie/auth/sync'
      localStorage.setItem(
        key,
        JSON.stringify({
          state,
          timestamp: Date.now(),
        })
      )
      localStorage.removeItem(key) // Trigger storage event
    }
  }

  /**
   * Set up BroadcastChannel listener
   */
  private setupBroadcastChannel(): void {
    this.channel!.addEventListener('message', (event) => {
      if (event.data.type === 'auth-state-change') {
        this.onStateChange(event.data.state)
      }
    })
  }

  /**
   * Set up storage event listener (fallback)
   */
  private setupStorageListener(): void {
    window.addEventListener('storage', (event) => {
      if (event.key === '@cenie/auth/sync' && event.newValue) {
        const data = JSON.parse(event.newValue)
        this.onStateChange(data.state)
      }
    })
  }

  /**
   * Clean up listeners
   */
  destroy(): void {
    this.channel?.close()
  }
}
```

---

## Caching Strategy

### Auth State Cache

```typescript
/**
 * Cache for auth state and user data
 */
export class AuthStateCache {
  private cache = new Map<string, CacheEntry>()
  private config: CacheConfig

  constructor(config: CacheConfig) {
    this.config = config

    // Set up cleanup interval
    if (config.cleanupInterval) {
      setInterval(() => this.cleanup(), config.cleanupInterval)
    }
  }

  /**
   * Get cached value
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key)

    if (!entry) return null

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key)
      return null
    }

    return entry.value as T
  }

  /**
   * Set cached value
   */
  set<T>(key: string, value: T, ttl?: number): void {
    const expiresAt = Date.now() + (ttl ?? this.config.ttl)

    this.cache.set(key, {
      value,
      expiresAt,
      createdAt: Date.now(),
    })
  }

  /**
   * Remove cached value
   */
  remove(key: string): void {
    this.cache.delete(key)
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear()
  }

  /**
   * Clean up expired entries
   */
  private cleanup(): void {
    const now = Date.now()
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key)
      }
    }
  }
}

interface CacheEntry {
  value: unknown
  expiresAt: number
  createdAt: number
}

interface CacheConfig {
  ttl: number
  cleanupInterval?: number
}
```

---

## Error Boundary

### Auth Error Boundary

```typescript
/**
 * Error boundary for auth-related errors
 */
export class AuthErrorBoundary extends React.Component<
  {
    children: React.ReactNode
    fallback?: React.ComponentType<{ error: Error; reset: () => void }>
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void
  },
  { error: Error | null }
> {
  state = { error: null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.props.onError?.(error, errorInfo)

    // Log to error tracking service
    console.error('Auth Error:', error, errorInfo)
  }

  reset = () => {
    this.setState({ error: null })
  }

  render() {
    if (this.state.error) {
      const FallbackComponent = this.props.fallback

      if (FallbackComponent) {
        return (
          <FallbackComponent
            error={this.state.error}
            reset={this.reset}
          />
        )
      }

      return (
        <div>
          <h2>Authentication Error</h2>
          <p>{this.state.error.message}</p>
          <button onClick={this.reset}>Try Again</button>
        </div>
      )
    }

    return this.props.children
  }
}
```

---

## Package Exports

```typescript
// Context and Provider
export { AuthProvider, useAuth } from './context'

// Hooks
export { useUser, useSession, useSignIn, useSignOut } from './hooks'
export { useAuthRedirect, useIdToken } from './hooks'

// HOCs
export { withAuth, withRequireAuth } from './hoc'

// Session Management
export { ClientSessionManager } from './session'
export { TabSyncManager } from './sync'
export { AuthStateCache } from './cache'

// Components
export { AuthErrorBoundary } from './error-boundary'

// Types
export type { AuthProviderConfig, AuthContextValue } from './types'
```

---

**Next Document**: [04-AUTH-SERVER.md](./04-AUTH-SERVER.md) - Server Package Specification
