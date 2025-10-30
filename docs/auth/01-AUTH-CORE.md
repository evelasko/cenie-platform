# @cenie/auth-core - Core Package Specification

**Version**: 2.0.0  
**Package Name**: `@cenie/auth-core`  
**Dependencies**: None (Pure TypeScript)

---

## Purpose

Provides framework-agnostic, provider-agnostic authentication primitives. This is the foundation for all other auth packages.

**Key Characteristics**:

- ✅ Zero runtime dependencies
- ✅ Pure TypeScript (can run in Node, browser, React Native)
- ✅ No framework coupling
- ✅ Fully tree-shakeable
- ✅ <5KB gzipped

---

## Core Types

### User Types

```typescript
/**
 * Minimal user representation - what every provider must support
 */
export interface BaseUser {
  /** Unique user identifier */
  id: string

  /** User's email address */
  email: string | null

  /** User's display name */
  displayName: string | null

  /** URL to user's avatar/photo */
  photoURL: string | null

  /** Whether email is verified */
  emailVerified: boolean

  /** ISO 8601 timestamp of account creation */
  createdAt: string

  /** ISO 8601 timestamp of last sign-in */
  lastSignInAt: string | null

  /** Provider-specific metadata */
  metadata?: Record<string, unknown>
}

/**
 * Extended user with app-specific data
 */
export interface User extends BaseUser {
  /** User's phone number */
  phoneNumber: string | null

  /** Whether phone is verified */
  phoneVerified: boolean

  /** User's preferred locale */
  locale: string | null

  /** User's timezone */
  timezone: string | null

  /** Custom user claims/attributes */
  customClaims?: Record<string, unknown>
}

/**
 * User profile (editable fields)
 */
export interface UserProfile {
  displayName?: string | null
  photoURL?: string | null
  phoneNumber?: string | null
  locale?: string | null
  timezone?: string | null
}
```

### Session Types

```typescript
/**
 * Session state machine states
 */
export enum SessionState {
  /** No session exists */
  UNAUTHENTICATED = 'unauthenticated',

  /** Authentication in progress */
  AUTHENTICATING = 'authenticating',

  /** Valid session exists */
  AUTHENTICATED = 'authenticated',

  /** Session expired, refresh needed */
  EXPIRED = 'expired',

  /** Session invalid, re-auth required */
  INVALID = 'invalid',

  /** User explicitly signed out */
  SIGNED_OUT = 'signed_out',
}

/**
 * Session data structure
 */
export interface Session {
  /** Unique session identifier */
  id: string

  /** User associated with session */
  userId: string

  /** Current session state */
  state: SessionState

  /** ISO 8601 timestamp of session creation */
  createdAt: string

  /** ISO 8601 timestamp of last activity */
  lastActivityAt: string

  /** ISO 8601 timestamp of expiration */
  expiresAt: string

  /** Device/client information */
  device?: DeviceInfo

  /** Session metadata */
  metadata?: Record<string, unknown>
}

/**
 * Device/client information
 */
export interface DeviceInfo {
  /** Device type */
  type: 'desktop' | 'mobile' | 'tablet' | 'unknown'

  /** Operating system */
  os: string

  /** Browser or client name */
  client: string

  /** IP address (last seen) */
  ipAddress?: string

  /** Geolocation (if available) */
  location?: {
    country?: string
    region?: string
    city?: string
  }
}

/**
 * Session configuration
 */
export interface SessionConfig {
  /** Session duration in milliseconds */
  duration: number

  /** Whether to auto-refresh sessions */
  autoRefresh: boolean

  /** Time before expiry to trigger refresh (ms) */
  refreshBefore: number

  /** Whether to remember device */
  rememberDevice: boolean

  /** Session storage strategy */
  storage: SessionStorageStrategy
}

export type SessionStorageStrategy =
  | 'httpOnly' // HTTP-only cookie (most secure)
  | 'cookie' // Regular cookie
  | 'localStorage' // Browser localStorage
  | 'sessionStorage' // Browser sessionStorage
  | 'memory' // In-memory only
  | 'custom' // Custom storage adapter
```

### Token Types

```typescript
/**
 * Authentication token
 */
export interface AuthToken {
  /** The actual token string */
  token: string

  /** Token type (Bearer, etc.) */
  type: TokenType

  /** ISO 8601 timestamp of creation */
  issuedAt: string

  /** ISO 8601 timestamp of expiration */
  expiresAt: string

  /** Scopes/permissions this token grants */
  scopes?: string[]
}

export type TokenType = 'id' | 'access' | 'refresh' | 'session' | 'custom'

/**
 * Token pair (access + refresh)
 */
export interface TokenPair {
  /** Access token (short-lived) */
  accessToken: AuthToken

  /** Refresh token (long-lived) */
  refreshToken: AuthToken
}

/**
 * Decoded token payload
 */
export interface TokenPayload {
  /** Subject (user ID) */
  sub: string

  /** Issuer */
  iss: string

  /** Audience */
  aud: string | string[]

  /** Issued at (Unix timestamp) */
  iat: number

  /** Expires at (Unix timestamp) */
  exp: number

  /** Custom claims */
  [key: string]: unknown
}
```

### Auth State Types

```typescript
/**
 * Complete authentication state
 */
export interface AuthState {
  /** Current user (null if not authenticated) */
  user: User | null

  /** Current session (null if no session) */
  session: Session | null

  /** Authentication status */
  status: AuthStatus

  /** Loading state */
  loading: boolean

  /** Error state */
  error: AuthError | null
}

export type AuthStatus =
  | 'loading' // Initial load, determining state
  | 'authenticated' // User is authenticated
  | 'unauthenticated' // User is not authenticated
  | 'error' // Error occurred

/**
 * Auth state change event
 */
export interface AuthStateChange {
  /** Previous state */
  previous: AuthState

  /** New state */
  current: AuthState

  /** Trigger for change */
  trigger: AuthStateTrigger

  /** ISO 8601 timestamp */
  timestamp: string
}

export type AuthStateTrigger =
  | 'sign-in'
  | 'sign-out'
  | 'session-refresh'
  | 'session-expire'
  | 'token-refresh'
  | 'user-update'
  | 'error'
```

### Error Types

```typescript
/**
 * Base auth error
 */
export class AuthError extends Error {
  constructor(
    message: string,
    public code: AuthErrorCode,
    public details?: Record<string, unknown>
  ) {
    super(message)
    this.name = 'AuthError'
  }
}

/**
 * Comprehensive error codes
 */
export enum AuthErrorCode {
  // Authentication errors
  INVALID_CREDENTIALS = 'auth/invalid-credentials',
  USER_NOT_FOUND = 'auth/user-not-found',
  WRONG_PASSWORD = 'auth/wrong-password',
  EMAIL_ALREADY_EXISTS = 'auth/email-already-exists',
  WEAK_PASSWORD = 'auth/weak-password',
  TOO_MANY_REQUESTS = 'auth/too-many-requests',
  USER_DISABLED = 'auth/user-disabled',

  // Session errors
  SESSION_EXPIRED = 'auth/session-expired',
  SESSION_INVALID = 'auth/session-invalid',
  SESSION_NOT_FOUND = 'auth/session-not-found',

  // Token errors
  TOKEN_EXPIRED = 'auth/token-expired',
  TOKEN_INVALID = 'auth/token-invalid',
  TOKEN_REFRESH_FAILED = 'auth/token-refresh-failed',

  // Access control errors
  UNAUTHORIZED = 'auth/unauthorized',
  FORBIDDEN = 'auth/forbidden',
  INSUFFICIENT_PERMISSIONS = 'auth/insufficient-permissions',

  // Network errors
  NETWORK_ERROR = 'auth/network-error',
  TIMEOUT = 'auth/timeout',

  // Provider errors
  PROVIDER_ERROR = 'auth/provider-error',
  PROVIDER_NOT_CONFIGURED = 'auth/provider-not-configured',

  // Configuration errors
  INVALID_CONFIG = 'auth/invalid-config',
  MISSING_CONFIG = 'auth/missing-config',

  // Generic errors
  UNKNOWN_ERROR = 'auth/unknown-error',
  INTERNAL_ERROR = 'auth/internal-error',
}

/**
 * Specific error types
 */
export class SessionError extends AuthError {
  constructor(message: string, code: AuthErrorCode, details?: Record<string, unknown>) {
    super(message, code, details)
    this.name = 'SessionError'
  }
}

export class TokenError extends AuthError {
  constructor(message: string, code: AuthErrorCode, details?: Record<string, unknown>) {
    super(message, code, details)
    this.name = 'TokenError'
  }
}

export class AccessError extends AuthError {
  constructor(message: string, code: AuthErrorCode, details?: Record<string, unknown>) {
    super(message, code, details)
    this.name = 'AccessError'
  }
}
```

### OAuth Types

```typescript
/**
 * OAuth provider configuration
 */
export interface OAuthProvider {
  /** Provider identifier */
  id: OAuthProviderId

  /** Provider display name */
  name: string

  /** OAuth scopes to request */
  scopes?: string[]

  /** Custom parameters */
  customParameters?: Record<string, string>

  /** Redirect URI */
  redirectUri?: string
}

export type OAuthProviderId =
  | 'google'
  | 'apple'
  | 'microsoft'
  | 'github'
  | 'facebook'
  | 'twitter'
  | 'custom'

/**
 * OAuth sign-in result
 */
export interface OAuthSignInResult {
  /** Authenticated user */
  user: User

  /** Provider used */
  provider: OAuthProviderId

  /** Whether this is a new user */
  isNewUser: boolean

  /** Provider-specific data */
  providerData?: Record<string, unknown>

  /** OAuth tokens */
  tokens?: {
    accessToken?: string
    refreshToken?: string
    idToken?: string
  }
}
```

---

## Core Utilities

### Session State Machine

```typescript
/**
 * Session state machine
 */
export class SessionStateMachine {
  /**
   * Transition to new state
   */
  transition(current: SessionState, event: SessionEvent): SessionState {
    // Implementation of state transitions
    // Validates allowed transitions
    // Returns new state
  }

  /**
   * Check if transition is valid
   */
  canTransition(from: SessionState, to: SessionState): boolean {
    // Returns true if transition is allowed
  }

  /**
   * Get allowed next states
   */
  getAllowedTransitions(state: SessionState): SessionState[] {
    // Returns array of valid next states
  }
}

export type SessionEvent = 'sign-in' | 'sign-out' | 'refresh' | 'expire' | 'invalidate' | 'validate'
```

### Token Manager

```typescript
/**
 * Token management utilities
 */
export class TokenManager {
  /**
   * Decode JWT token
   */
  decode(token: string): TokenPayload {
    // Decodes token without verification
  }

  /**
   * Check if token is expired
   */
  isExpired(token: AuthToken | string): boolean {
    // Returns true if token is expired
  }

  /**
   * Get time until expiration (ms)
   */
  getTimeToExpiry(token: AuthToken | string): number {
    // Returns milliseconds until expiry
    // Returns 0 if already expired
  }

  /**
   * Check if token needs refresh
   */
  needsRefresh(token: AuthToken | string, refreshBefore: number): boolean {
    // Returns true if token should be refreshed
  }

  /**
   * Extract token type from string
   */
  getTokenType(token: string): TokenType | null {
    // Returns token type or null if invalid
  }
}
```

### Event Emitter

```typescript
/**
 * Type-safe event emitter for auth events
 */
export class AuthEventEmitter {
  /**
   * Listen to auth events
   */
  on<T extends AuthEventType>(event: T, handler: AuthEventHandler<T>): UnsubscribeFn

  /**
   * Listen to event once
   */
  once<T extends AuthEventType>(event: T, handler: AuthEventHandler<T>): UnsubscribeFn

  /**
   * Emit auth event
   */
  emit<T extends AuthEventType>(event: T, data: AuthEventData<T>): void

  /**
   * Remove all listeners
   */
  clear(): void
}

/**
 * Auth event types
 */
export type AuthEventType =
  | 'state-change'
  | 'sign-in'
  | 'sign-out'
  | 'session-create'
  | 'session-refresh'
  | 'session-expire'
  | 'session-destroy'
  | 'token-refresh'
  | 'user-update'
  | 'error'

/**
 * Event data mapping
 */
export interface AuthEventData {
  'state-change': AuthStateChange
  'sign-in': { user: User; session: Session }
  'sign-out': { userId: string }
  'session-create': Session
  'session-refresh': Session
  'session-expire': Session
  'session-destroy': { sessionId: string }
  'token-refresh': { token: AuthToken }
  'user-update': User
  error: AuthError
}

export type AuthEventHandler<T extends AuthEventType> = (
  data: AuthEventData[T]
) => void | Promise<void>

export type UnsubscribeFn = () => void
```

### Validators

```typescript
/**
 * Common validation utilities
 */
export class Validators {
  /**
   * Validate email format
   */
  static isValidEmail(email: string): boolean

  /**
   * Validate password strength
   */
  static isStrongPassword(password: string, requirements?: PasswordRequirements): PasswordStrength

  /**
   * Validate phone number
   */
  static isValidPhone(phone: string, region?: string): boolean

  /**
   * Validate URL format
   */
  static isValidURL(url: string): boolean

  /**
   * Validate session duration
   */
  static isValidDuration(duration: number): boolean
}

export interface PasswordRequirements {
  minLength?: number
  maxLength?: number
  requireUppercase?: boolean
  requireLowercase?: boolean
  requireNumbers?: boolean
  requireSpecialChars?: boolean
  forbiddenPasswords?: string[]
}

export interface PasswordStrength {
  isValid: boolean
  score: number // 0-100
  feedback: string[]
  violations: string[]
}
```

### Time Utilities

```typescript
/**
 * Time-related utilities
 */
export class TimeUtils {
  /**
   * Parse duration string to milliseconds
   */
  static parseDuration(duration: string): number
  // Examples: '1h', '30m', '7d', '2w'

  /**
   * Format duration for display
   */
  static formatDuration(ms: number): string

  /**
   * Check if timestamp is expired
   */
  static isExpired(expiresAt: string | number): boolean

  /**
   * Get ISO 8601 timestamp
   */
  static now(): string

  /**
   * Add duration to timestamp
   */
  static addDuration(timestamp: string | number, duration: number): string
}
```

---

## Storage Abstractions

```typescript
/**
 * Generic storage interface
 */
export interface Storage {
  /**
   * Get item from storage
   */
  getItem(key: string): Promise<string | null>

  /**
   * Set item in storage
   */
  setItem(key: string, value: string): Promise<void>

  /**
   * Remove item from storage
   */
  removeItem(key: string): Promise<void>

  /**
   * Clear all items
   */
  clear(): Promise<void>

  /**
   * Get all keys
   */
  keys(): Promise<string[]>
}

/**
 * In-memory storage implementation
 */
export class MemoryStorage implements Storage {
  // Implementation for testing and SSR
}

/**
 * Storage with encryption
 */
export class EncryptedStorage implements Storage {
  constructor(
    private storage: Storage,
    private encryptionKey: string
  )

  // Encrypts data before storage
  // Decrypts data on retrieval
}

/**
 * Storage with expiration
 */
export class ExpiringStorage implements Storage {
  constructor(private storage: Storage)

  // Supports TTL per item
  // Auto-cleanup of expired items
}
```

---

## Configuration System

```typescript
/**
 * Base configuration for all auth features
 */
export interface AuthConfig {
  /**
   * App identifier
   */
  appId: string

  /**
   * Environment
   */
  env: 'development' | 'staging' | 'production'

  /**
   * Session configuration
   */
  session?: Partial<SessionConfig>

  /**
   * Token configuration
   */
  tokens?: {
    /** Access token duration */
    accessTokenDuration?: string

    /** Refresh token duration */
    refreshTokenDuration?: string

    /** Whether to auto-refresh tokens */
    autoRefresh?: boolean
  }

  /**
   * Security settings
   */
  security?: {
    /** Require email verification */
    requireEmailVerification?: boolean

    /** Enable MFA */
    enableMFA?: boolean

    /** Password requirements */
    passwordRequirements?: PasswordRequirements
  }

  /**
   * Logging configuration
   */
  logging?: {
    /** Log level */
    level: 'debug' | 'info' | 'warn' | 'error' | 'none'

    /** Whether to log to console */
    console?: boolean

    /** Custom logger */
    logger?: Logger
  }
}

/**
 * Logger interface
 */
export interface Logger {
  debug(message: string, ...args: unknown[]): void
  info(message: string, ...args: unknown[]): void
  warn(message: string, ...args: unknown[]): void
  error(message: string, ...args: unknown[]): void
}
```

---

## Constants

```typescript
/**
 * Default values
 */
export const DEFAULT_SESSION_DURATION = 14 * 24 * 60 * 60 * 1000 // 14 days
export const DEFAULT_REFRESH_BEFORE = 60 * 60 * 1000 // 1 hour
export const DEFAULT_TOKEN_DURATION = '1h'
export const DEFAULT_REFRESH_TOKEN_DURATION = '30d'

/**
 * Storage keys
 */
export const STORAGE_KEYS = {
  SESSION: '@cenie/auth/session',
  USER: '@cenie/auth/user',
  TOKEN: '@cenie/auth/token',
  REFRESH_TOKEN: '@cenie/auth/refresh-token',
  STATE: '@cenie/auth/state',
} as const

/**
 * Cookie names
 */
export const COOKIE_NAMES = {
  SESSION: 'cenie_session',
  CSRF: 'cenie_csrf',
  DEVICE: 'cenie_device',
} as const
```

---

## Export Structure

```typescript
// Main exports
export * from './types'
export * from './errors'
export * from './utils'
export * from './storage'
export * from './constants'

// Default export (optional, for convenience)
export default {
  SessionStateMachine,
  TokenManager,
  AuthEventEmitter,
  Validators,
  TimeUtils,
  MemoryStorage,
  EncryptedStorage,
  ExpiringStorage,
}
```

---

## Testing Support

```typescript
/**
 * Factory functions for tests
 */
export const TestFactories = {
  /**
   * Create mock user
   */
  createUser(overrides?: Partial<User>): User

  /**
   * Create mock session
   */
  createSession(overrides?: Partial<Session>): Session

  /**
   * Create mock token
   */
  createToken(overrides?: Partial<AuthToken>): AuthToken

  /**
   * Create mock auth state
   */
  createAuthState(overrides?: Partial<AuthState>): AuthState
}
```

---

## Performance Considerations

1. **Bundle Size**: Core package must be <5KB gzipped
2. **Tree Shaking**: All exports must be tree-shakeable
3. **Type Inference**: Minimal type computation for fast IDE performance
4. **Zero Runtime**: Type-only exports don't add to bundle

---

## Migration Path

Since this is a new package, no breaking changes. Apps gradually adopt types and utilities.

**Phase 1**: Define types, validate with team
**Phase 2**: Implement utilities, write tests
**Phase 3**: Use in other packages
**Phase 4**: Apps import types as needed

---

**Next Document**: [02-AUTH-PROVIDERS.md](./02-AUTH-PROVIDERS.md) - Providers Package Specification
