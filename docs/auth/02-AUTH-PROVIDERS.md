# @cenie/auth-providers - Providers Package Specification

**Version**: 2.0.0  
**Package Name**: `@cenie/auth-providers`  
**Dependencies**: `@cenie/auth-core`, Provider SDKs (peer)

---

## Purpose

Provides pluggable authentication provider implementations using the adapter pattern. Each provider implements a common interface while supporting provider-specific features.

**Key Characteristics**:

- ✅ Provider-agnostic interface
- ✅ Firebase, Supabase, and custom implementations
- ✅ Easy to add new providers
- ✅ Provider-specific features exposed via extensions
- ✅ Type-safe provider selection

---

## Provider Interface

### Base Provider Contract

```typescript
import type { User, AuthToken, Session, AuthError } from '@cenie/auth-core'

/**
 * Base interface all providers must implement
 */
export interface IAuthProvider {
  /**
   * Provider identifier
   */
  readonly id: ProviderId

  /**
   * Provider name for display
   */
  readonly name: string

  /**
   * Initialize provider
   */
  initialize(config: ProviderConfig): Promise<void>

  /**
   * Sign in with email and password
   */
  signInWithEmailPassword(email: string, password: string): Promise<SignInResult>

  /**
   * Sign up with email and password
   */
  signUpWithEmailPassword(
    email: string,
    password: string,
    displayName?: string
  ): Promise<SignInResult>

  /**
   * Sign in with OAuth provider
   */
  signInWithOAuth(provider: OAuthProviderId, options?: OAuthOptions): Promise<OAuthSignInResult>

  /**
   * Sign out current user
   */
  signOut(): Promise<void>

  /**
   * Get current user
   */
  getCurrentUser(): Promise<User | null>

  /**
   * Get current session
   */
  getCurrentSession(): Promise<Session | null>

  /**
   * Refresh authentication token
   */
  refreshToken(refreshToken: string): Promise<AuthToken>

  /**
   * Verify ID token (server-side)
   */
  verifyIdToken(idToken: string): Promise<TokenPayload>

  /**
   * Create session cookie (server-side)
   */
  createSessionCookie(idToken: string, options?: SessionCookieOptions): Promise<string>

  /**
   * Verify session cookie (server-side)
   */
  verifySessionCookie(sessionCookie: string): Promise<TokenPayload>

  /**
   * Listen to auth state changes
   */
  onAuthStateChange(callback: (user: User | null) => void): UnsubscribeFn
}

export type ProviderId = 'firebase' | 'supabase' | 'custom'

export interface ProviderConfig {
  /** Provider-specific configuration */
  [key: string]: unknown
}

export interface SignInResult {
  user: User
  session: Session
  token: AuthToken
}

export interface SessionCookieOptions {
  expiresIn: number
  httpOnly?: boolean
  secure?: boolean
  sameSite?: 'strict' | 'lax' | 'none'
  domain?: string
  path?: string
}
```

---

## Firebase Provider

### Configuration

```typescript
/**
 * Firebase provider configuration
 */
export interface FirebaseProviderConfig extends ProviderConfig {
  /**
   * Firebase client config (for client-side)
   */
  clientConfig?: {
    apiKey: string
    authDomain: string
    projectId: string
    storageBucket?: string
    messagingSenderId?: string
    appId: string
    measurementId?: string
  }

  /**
   * Firebase Admin config (for server-side)
   */
  adminConfig?: {
    /** Path to service account JSON */
    serviceAccountPath?: string

    /** Service account object */
    serviceAccount?: {
      projectId: string
      clientEmail: string
      privateKey: string
    }

    /** Project ID (if using env vars) */
    projectId?: string
  }

  /**
   * Session cookie settings
   */
  sessionCookie?: {
    /** Session duration in milliseconds */
    expiresIn?: number

    /** Cookie options */
    cookieOptions?: Omit<SessionCookieOptions, 'expiresIn'>
  }
}
```

### Implementation

```typescript
/**
 * Firebase authentication provider
 */
export class FirebaseAuthProvider implements IAuthProvider {
  readonly id = 'firebase' as const
  readonly name = 'Firebase Authentication'

  private clientAuth?: FirebaseAuth
  private adminAuth?: Admin.auth.Auth
  private config?: FirebaseProviderConfig

  /**
   * Initialize Firebase provider
   */
  async initialize(config: FirebaseProviderConfig): Promise<void> {
    this.config = config

    // Initialize client if config provided
    if (config.clientConfig) {
      const app = initializeApp(config.clientConfig)
      this.clientAuth = getAuth(app)
    }

    // Initialize admin if config provided
    if (config.adminConfig) {
      const adminApp = this.initializeAdmin(config.adminConfig)
      this.adminAuth = adminApp.auth()
    }
  }

  /**
   * Sign in with email and password
   */
  async signInWithEmailPassword(email: string, password: string): Promise<SignInResult> {
    if (!this.clientAuth) {
      throw new AuthError('Firebase client not initialized', AuthErrorCode.PROVIDER_NOT_CONFIGURED)
    }

    try {
      const credential = await signInWithEmailAndPassword(this.clientAuth, email, password)

      return this.mapFirebaseUserToResult(credential.user)
    } catch (error) {
      throw this.mapFirebaseError(error)
    }
  }

  // ... other method implementations

  /**
   * Firebase-specific extensions
   */
  readonly extensions = {
    /**
     * Send email verification
     */
    sendEmailVerification: async (user: FirebaseUser): Promise<void> => {
      await sendEmailVerification(user)
    },

    /**
     * Send password reset email
     */
    sendPasswordResetEmail: async (email: string): Promise<void> => {
      if (!this.clientAuth) throw new Error('Not initialized')
      await sendPasswordResetEmail(this.clientAuth, email)
    },

    /**
     * Update user profile
     */
    updateProfile: async (
      user: FirebaseUser,
      profile: { displayName?: string; photoURL?: string }
    ): Promise<void> => {
      await updateProfile(user, profile)
    },

    /**
     * Link with OAuth credential
     */
    linkWithOAuth: async (user: FirebaseUser, providerId: OAuthProviderId): Promise<void> => {
      const provider = this.getOAuthProvider(providerId)
      await linkWithPopup(user, provider)
    },

    /**
     * Get Firebase user object
     */
    getFirebaseUser: (): FirebaseUser | null => {
      return this.clientAuth?.currentUser ?? null
    },

    /**
     * Get Firebase Admin instance
     */
    getAdminAuth: (): Admin.auth.Auth => {
      if (!this.adminAuth) {
        throw new Error('Firebase Admin not initialized')
      }
      return this.adminAuth
    },
  }

  // Private helper methods
  private mapFirebaseUserToResult(firebaseUser: FirebaseUser): SignInResult {
    // Map Firebase user to our User type
  }

  private mapFirebaseError(error: any): AuthError {
    // Map Firebase errors to our AuthError
  }

  private initializeAdmin(config: FirebaseProviderConfig['adminConfig']) {
    // Initialize Firebase Admin SDK
  }
}
```

### Error Mapping

```typescript
/**
 * Map Firebase error codes to our error codes
 */
export const FIREBASE_ERROR_MAP: Record<string, AuthErrorCode> = {
  'auth/invalid-email': AuthErrorCode.INVALID_CREDENTIALS,
  'auth/user-disabled': AuthErrorCode.USER_DISABLED,
  'auth/user-not-found': AuthErrorCode.USER_NOT_FOUND,
  'auth/wrong-password': AuthErrorCode.WRONG_PASSWORD,
  'auth/email-already-in-use': AuthErrorCode.EMAIL_ALREADY_EXISTS,
  'auth/weak-password': AuthErrorCode.WEAK_PASSWORD,
  'auth/too-many-requests': AuthErrorCode.TOO_MANY_REQUESTS,
  'auth/network-request-failed': AuthErrorCode.NETWORK_ERROR,
  'auth/id-token-expired': AuthErrorCode.TOKEN_EXPIRED,
  'auth/id-token-revoked': AuthErrorCode.TOKEN_INVALID,
  // ... more mappings
}
```

---

## Supabase Provider

### Configuration

```typescript
/**
 * Supabase provider configuration
 */
export interface SupabaseProviderConfig extends ProviderConfig {
  /**
   * Supabase URL
   */
  url: string

  /**
   * Supabase anonymous key (client-side)
   */
  anonKey: string

  /**
   * Supabase service role key (server-side)
   */
  serviceRoleKey?: string

  /**
   * Session configuration
   */
  session?: {
    /** Auto-refresh sessions */
    autoRefreshToken?: boolean

    /** Persist session */
    persistSession?: boolean

    /** Detect session in URL */
    detectSessionInUrl?: boolean
  }

  /**
   * Cookie options (for SSR)
   */
  cookieOptions?: {
    name?: string
    lifetime?: number
    domain?: string
    path?: string
    sameSite?: 'strict' | 'lax' | 'none'
  }
}
```

### Implementation

```typescript
/**
 * Supabase authentication provider
 */
export class SupabaseAuthProvider implements IAuthProvider {
  readonly id = 'supabase' as const
  readonly name = 'Supabase Authentication'

  private client?: SupabaseClient
  private config?: SupabaseProviderConfig

  async initialize(config: SupabaseProviderConfig): Promise<void> {
    this.config = config
    this.client = createClient(config.url, config.anonKey, {
      auth: config.session,
    })
  }

  async signInWithEmailPassword(email: string, password: string): Promise<SignInResult> {
    if (!this.client) throw new Error('Not initialized')

    const { data, error } = await this.client.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw this.mapSupabaseError(error)
    if (!data.user || !data.session) {
      throw new AuthError('Invalid response', AuthErrorCode.UNKNOWN_ERROR)
    }

    return this.mapSupabaseSession(data.user, data.session)
  }

  // ... other implementations

  /**
   * Supabase-specific extensions
   */
  readonly extensions = {
    /**
     * Sign in with magic link
     */
    signInWithMagicLink: async (email: string): Promise<void> => {
      if (!this.client) throw new Error('Not initialized')
      await this.client.auth.signInWithOtp({ email })
    },

    /**
     * Sign in with phone OTP
     */
    signInWithPhone: async (phone: string): Promise<void> => {
      if (!this.client) throw new Error('Not initialized')
      await this.client.auth.signInWithOtp({ phone })
    },

    /**
     * Verify OTP
     */
    verifyOtp: async (phone: string, token: string): Promise<SignInResult> => {
      if (!this.client) throw new Error('Not initialized')
      const { data, error } = await this.client.auth.verifyOtp({
        phone,
        token,
        type: 'sms',
      })
      if (error) throw this.mapSupabaseError(error)
      return this.mapSupabaseSession(data.user!, data.session!)
    },

    /**
     * Get Supabase client
     */
    getClient: (): SupabaseClient => {
      if (!this.client) throw new Error('Not initialized')
      return this.client
    },
  }

  private mapSupabaseSession(user: SupabaseUser, session: SupabaseSession): SignInResult {
    // Map to our types
  }

  private mapSupabaseError(error: AuthApiError): AuthError {
    // Map Supabase errors
  }
}
```

---

## Custom Provider

### Base Class

```typescript
/**
 * Base class for custom providers
 */
export abstract class BaseAuthProvider implements IAuthProvider {
  abstract readonly id: ProviderId
  abstract readonly name: string

  protected config?: ProviderConfig
  protected initialized = false

  async initialize(config: ProviderConfig): Promise<void> {
    this.config = config
    await this.onInitialize(config)
    this.initialized = true
  }

  /**
   * Override to implement custom initialization
   */
  protected abstract onInitialize(config: ProviderConfig): Promise<void>

  /**
   * Helper to ensure provider is initialized
   */
  protected ensureInitialized(): void {
    if (!this.initialized) {
      throw new AuthError('Provider not initialized', AuthErrorCode.PROVIDER_NOT_CONFIGURED)
    }
  }

  // Default implementations that throw "not implemented"
  async signInWithEmailPassword(): Promise<SignInResult> {
    throw new Error('Not implemented')
  }

  async signUpWithEmailPassword(): Promise<SignInResult> {
    throw new Error('Not implemented')
  }

  // ... other methods with default implementations
}
```

### Example: Custom JWT Provider

```typescript
/**
 * Example custom JWT-based provider
 */
export class JWTAuthProvider extends BaseAuthProvider {
  readonly id = 'custom' as const
  readonly name = 'JWT Authentication'

  private apiUrl?: string

  protected async onInitialize(config: JWTProviderConfig): Promise<void> {
    this.apiUrl = config.apiUrl
  }

  async signInWithEmailPassword(email: string, password: string): Promise<SignInResult> {
    this.ensureInitialized()

    const response = await fetch(`${this.apiUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      throw new AuthError('Login failed', AuthErrorCode.INVALID_CREDENTIALS)
    }

    const data = await response.json()
    return this.mapJWTResponse(data)
  }

  // ... other implementations
}

export interface JWTProviderConfig extends ProviderConfig {
  apiUrl: string
  tokenKey?: string
  refreshTokenKey?: string
}
```

---

## Provider Factory

### Factory Pattern

```typescript
/**
 * Provider factory for creating provider instances
 */
export class ProviderFactory {
  private static providers = new Map<ProviderId, () => IAuthProvider>()

  /**
   * Register a provider
   */
  static register(id: ProviderId, factory: () => IAuthProvider): void {
    this.providers.set(id, factory)
  }

  /**
   * Create provider instance
   */
  static create(id: ProviderId): IAuthProvider {
    const factory = this.providers.get(id)
    if (!factory) {
      throw new AuthError(`Provider ${id} not registered`, AuthErrorCode.PROVIDER_NOT_CONFIGURED)
    }
    return factory()
  }

  /**
   * Get all registered providers
   */
  static getRegistered(): ProviderId[] {
    return Array.from(this.providers.keys())
  }
}

// Register built-in providers
ProviderFactory.register('firebase', () => new FirebaseAuthProvider())
ProviderFactory.register('supabase', () => new SupabaseAuthProvider())
```

---

## Provider Manager

### Multi-Provider Support

```typescript
/**
 * Manage multiple providers simultaneously
 */
export class ProviderManager {
  private providers = new Map<ProviderId, IAuthProvider>()
  private activeProvider?: ProviderId

  /**
   * Add a provider
   */
  async addProvider(id: ProviderId, config: ProviderConfig): Promise<void> {
    const provider = ProviderFactory.create(id)
    await provider.initialize(config)
    this.providers.set(id, provider)

    // Set as active if first provider
    if (!this.activeProvider) {
      this.activeProvider = id
    }
  }

  /**
   * Get active provider
   */
  getActive(): IAuthProvider {
    if (!this.activeProvider) {
      throw new AuthError('No active provider', AuthErrorCode.PROVIDER_NOT_CONFIGURED)
    }
    return this.getProvider(this.activeProvider)
  }

  /**
   * Get specific provider
   */
  getProvider(id: ProviderId): IAuthProvider {
    const provider = this.providers.get(id)
    if (!provider) {
      throw new AuthError(`Provider ${id} not found`, AuthErrorCode.PROVIDER_NOT_CONFIGURED)
    }
    return provider
  }

  /**
   * Set active provider
   */
  setActive(id: ProviderId): void {
    if (!this.providers.has(id)) {
      throw new AuthError(`Provider ${id} not found`, AuthErrorCode.PROVIDER_NOT_CONFIGURED)
    }
    this.activeProvider = id
  }

  /**
   * Get all providers
   */
  getAll(): Map<ProviderId, IAuthProvider> {
    return new Map(this.providers)
  }
}
```

---

## Provider-Specific Features

### Type-Safe Extensions

```typescript
/**
 * Get provider with typed extensions
 */
export function getProviderWithExtensions<T extends IAuthProvider>(provider: IAuthProvider): T {
  return provider as T
}

// Usage example
const firebaseProvider = getProviderWithExtensions<FirebaseAuthProvider>(provider)
await firebaseProvider.extensions.sendEmailVerification(user)
```

### Feature Detection

```typescript
/**
 * Check if provider supports a feature
 */
export function supportsFeature(provider: IAuthProvider, feature: ProviderFeature): boolean {
  switch (feature) {
    case 'email-password':
      return true // All providers must support

    case 'oauth':
      return 'signInWithOAuth' in provider

    case 'magic-link':
      return (
        provider.id === 'supabase' ||
        ('extensions' in provider && 'signInWithMagicLink' in provider.extensions)
      )

    case 'phone-auth':
      return provider.id === 'supabase' || provider.id === 'firebase'

    case 'session-cookies':
      return 'createSessionCookie' in provider

    default:
      return false
  }
}

export type ProviderFeature =
  | 'email-password'
  | 'oauth'
  | 'magic-link'
  | 'phone-auth'
  | 'mfa'
  | 'session-cookies'
  | 'passwordless'
```

---

## Testing Utilities

### Mock Provider

```typescript
/**
 * Mock provider for testing
 */
export class MockAuthProvider implements IAuthProvider {
  readonly id = 'mock' as const
  readonly name = 'Mock Provider'

  // Configurable responses
  public mockUser: User | null = null
  public mockSession: Session | null = null
  public mockError: AuthError | null = null

  async initialize(): Promise<void> {
    // No-op
  }

  async signInWithEmailPassword(): Promise<SignInResult> {
    if (this.mockError) throw this.mockError
    if (!this.mockUser || !this.mockSession) {
      throw new AuthError('Not configured', AuthErrorCode.INTERNAL_ERROR)
    }

    return {
      user: this.mockUser,
      session: this.mockSession,
      token: TestFactories.createToken(),
    }
  }

  // ... other methods with mock implementations

  /**
   * Reset mock state
   */
  reset(): void {
    this.mockUser = null
    this.mockSession = null
    this.mockError = null
  }
}
```

---

## Package Exports

```typescript
// Provider interfaces
export * from './interfaces/provider'

// Provider implementations
export * from './providers/firebase'
export * from './providers/supabase'
export * from './providers/base'

// Provider management
export * from './factory'
export * from './manager'

// Utilities
export * from './utils/error-mapping'
export * from './utils/feature-detection'

// Testing
export * from './testing/mock-provider'

// Default export
export {
  ProviderFactory,
  ProviderManager,
  FirebaseAuthProvider,
  SupabaseAuthProvider,
  BaseAuthProvider,
  MockAuthProvider,
}
```

---

## Migration from Current Code

### Editorial App Migration

**Current**:

```typescript
// Scattered Firebase code
import { getFirebaseAuth } from '@cenie/firebase/client'
import { initializeAdminApp } from '@cenie/firebase/server'

const auth = getFirebaseAuth()
const result = await signInWithEmailAndPassword(auth, email, password)
```

**New**:

```typescript
// Use provider interface
import { ProviderFactory } from '@cenie/auth-providers'

const provider = ProviderFactory.create('firebase')
await provider.initialize(firebaseConfig)
const result = await provider.signInWithEmailPassword(email, password)
```

### Hub App Migration

**Current**:

```typescript
// Different pattern
import { signInWithGoogle } from '@cenie/firebase/auth'

const result = await signInWithGoogle()
```

**New**:

```typescript
// Same pattern as editorial
const provider = ProviderFactory.create('firebase')
const result = await provider.signInWithOAuth('google')
```

---

**Next Document**: [03-AUTH-CLIENT.md](./03-AUTH-CLIENT.md) - Client Package Specification
