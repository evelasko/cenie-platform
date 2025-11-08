# TASK 1A-4: Create @cenie/auth-utils Package

**Phase**: 1A - Auth Packages  
**Duration**: 1 day  
**Dependencies**: None (can run parallel to other tasks)  
**Next Task**: Completes TASK_1A2 and 1A3 dependencies

---

## OBJECTIVE

Create a shared package containing role hierarchy definitions and access control utilities used by all apps. This package defines the "who can do what" rules for the entire platform.

**What You're Building**: The authorization layer that knows about all app roles and how they relate to each other.

**Why This Matters**: Each app has different roles (Editorial has editors, Academy has instructors, Agency has managers), but they need consistent comparison logic. This package centralizes that knowledge.

---

## ARCHITECTURE CONTEXT

### Role System Design

**Per-App Roles**:
- **Hub**: `user`, `admin`
- **Editorial**: `viewer`, `editor`, `admin`
- **Academy**: `student`, `instructor`, `admin`
- **Agency**: `client`, `manager`, `admin`

**Role Hierarchy** (numeric levels):
```
Level 1: user, viewer, student, client (basic access)
Level 2: editor, instructor, manager (elevated access)
Level 3: admin (full control - universal across all apps)
```

**How It's Used**:
```typescript
// Can a 'viewer' access an 'editor' route?
hasRole('viewer', 'editor') // false (1 < 2)

// Can an 'editor' access an 'editor' route?
hasRole('editor', 'editor') // true (2 >= 2)

// Can an 'admin' access an 'editor' route?
hasRole('admin', 'editor') // true (3 >= 2)
```

### Access Control with Caching

This package also handles access control queries to Firestore with caching (reduces database calls by 80%+).

**Cache Strategy**:
- **Key**: `${userId}:${appName}`
- **TTL**: 5 minutes
- **Invalidation**: On grant/revoke access
- **Storage**: In-memory Map (simple, fast)

---

## SOURCE FILES TO STUDY

**Reference for Role Logic**:

1. `apps/editorial/src/lib/auth-helpers.ts`
   - Lines 163-167: Role hierarchy constant (Editorial's 3 roles)
   - Lines 189-197: `hasRole()` function
   - Shows the comparison pattern

2. `apps/hub/src/lib/auth-middleware.ts`
   - Lines 66-98: `requireAdmin()` function
   - Hub's binary admin check (simpler)

**New Code** (not extraction):
- Role definitions for Academy and Agency are new
- Caching logic is new (optimization)
- Access control wrappers are new (generalization)

---

## WHAT TO BUILD

### Package Structure

```
packages/auth-utils/
├── src/
│   ├── roles/
│   │   ├── constants.ts
│   │   ├── hierarchy.ts
│   │   ├── types.ts
│   │   └── index.ts
│   ├── access-control/
│   │   ├── check-access.ts
│   │   ├── grant-access.ts
│   │   ├── revoke-access.ts
│   │   ├── cache.ts
│   │   └── index.ts
│   ├── tokens/
│   │   ├── custom-claims.ts
│   │   ├── sync-claims.ts
│   │   └── index.ts
│   ├── types.ts
│   └── index.ts
├── package.json
├── tsconfig.json
└── README.md
```

---

## DETAILED REQUIREMENTS

### Module 1: Roles (`src/roles/`)

**File: `constants.ts`**

```typescript
/**
 * Role definitions for all CENIE apps
 */
export const APP_ROLES = {
  hub: ['user', 'admin'] as const,
  editorial: ['viewer', 'editor', 'admin'] as const,
  academy: ['student', 'instructor', 'admin'] as const,
  agency: ['client', 'manager', 'admin'] as const,
} as const

/**
 * Role hierarchy - numeric levels for comparison
 * Higher number = more permissions
 */
export const ROLE_HIERARCHY = {
  // Hub
  user: 1,
  
  // Editorial
  viewer: 1,
  editor: 2,
  
  // Academy
  student: 1,
  instructor: 2,
  
  // Agency
  client: 1,
  manager: 2,
  
  // Universal (all apps)
  admin: 3,
} as const

export type RoleLevel = (typeof ROLE_HIERARCHY)[keyof typeof ROLE_HIERARCHY]
```

**File: `hierarchy.ts`**

```typescript
import { ROLE_HIERARCHY } from './constants'

/**
 * Check if user has sufficient role level
 * @param userRole - The role the user has
 * @param requiredRole - The minimum role required
 * @returns true if user's role level >= required role level
 */
export function hasRole(userRole: string, requiredRole: string): boolean {
  const userLevel = ROLE_HIERARCHY[userRole as keyof typeof ROLE_HIERARCHY] || 0
  const requiredLevel = ROLE_HIERARCHY[requiredRole as keyof typeof ROLE_HIERARCHY] || 0
  
  return userLevel >= requiredLevel
}

/**
 * Get numeric level for a role
 * @param role - Role name
 * @returns Numeric level (0 if role not found)
 */
export function getRoleLevel(role: string): number {
  return ROLE_HIERARCHY[role as keyof typeof ROLE_HIERARCHY] || 0
}

/**
 * Check if role is valid for an app
 * @param appName - App to check
 * @param role - Role to validate
 * @returns true if role exists for this app
 */
export function isValidRoleForApp(
  appName: 'hub' | 'editorial' | 'academy' | 'agency',
  role: string
): boolean {
  const { APP_ROLES } = require('./constants')
  return APP_ROLES[appName].includes(role) || role === 'admin'
}
```

**File: `types.ts`**

```typescript
import type { APP_ROLES } from './constants'

export type AppName = 'hub' | 'editorial' | 'academy' | 'agency'

export type HubRole = (typeof APP_ROLES.hub)[number]
export type EditorialRole = (typeof APP_ROLES.editorial)[number]
export type AcademyRole = (typeof APP_ROLES.academy)[number]
export type AgencyRole = (typeof APP_ROLES.agency)[number]

export type AppRole<T extends AppName> = T extends 'hub'
  ? HubRole
  : T extends 'editorial'
    ? EditorialRole
    : T extends 'academy'
      ? AcademyRole
      : T extends 'agency'
        ? AgencyRole
        : never

export type AnyRole = HubRole | EditorialRole | AcademyRole | AgencyRole
```

**File: `index.ts`**

```typescript
export * from './constants'
export * from './hierarchy'
export * from './types'
```

### Module 2: Access Control (`src/access-control/`)

**File: `cache.ts`**

```typescript
import type { AccessData } from '../types'

interface CachedAccess {
  data: AccessData
  expiresAt: number
}

/**
 * In-memory cache for access control data
 * Reduces Firestore queries by ~80%
 */
class AccessCache {
  private cache = new Map<string, CachedAccess>()
  private defaultTTL = 5 * 60 * 1000 // 5 minutes

  /**
   * Get cached access data if not expired
   */
  get(userId: string, appName: string): AccessData | null {
    const key = this.getKey(userId, appName)
    const cached = this.cache.get(key)
    
    if (!cached) {
      return null
    }
    
    // Check expiration
    if (cached.expiresAt < Date.now()) {
      this.cache.delete(key)
      return null
    }
    
    return cached.data
  }

  /**
   * Store access data in cache
   */
  set(userId: string, appName: string, data: AccessData, ttl?: number): void {
    const key = this.getKey(userId, appName)
    const expiresAt = Date.now() + (ttl || this.defaultTTL)
    
    this.cache.set(key, { data, expiresAt })
  }

  /**
   * Clear specific cached entry
   */
  clear(userId: string, appName: string): void {
    const key = this.getKey(userId, appName)
    this.cache.delete(key)
  }

  /**
   * Clear all cached entries for a user (across all apps)
   */
  clearUser(userId: string): void {
    const keysToDelete: string[] = []
    
    for (const key of this.cache.keys()) {
      if (key.startsWith(`${userId}:`)) {
        keysToDelete.push(key)
      }
    }
    
    keysToDelete.forEach(key => this.cache.delete(key))
  }

  /**
   * Clear entire cache (use sparingly)
   */
  clearAll(): void {
    this.cache.clear()
  }

  /**
   * Background cleanup of expired entries
   */
  private cleanup(): void {
    const now = Date.now()
    const keysToDelete: string[] = []
    
    for (const [key, value] of this.cache.entries()) {
      if (value.expiresAt < now) {
        keysToDelete.push(key)
      }
    }
    
    keysToDelete.forEach(key => this.cache.delete(key))
  }

  /**
   * Get cache key
   */
  private getKey(userId: string, appName: string): string {
    return `${userId}:${appName}`
  }

  /**
   * Start periodic cleanup (call once on module load)
   */
  startCleanup(): void {
    // Cleanup expired entries every minute
    setInterval(() => this.cleanup(), 60 * 1000)
  }
}

// Singleton instance
export const accessCache = new AccessCache()

// Start cleanup on module load
if (typeof window === 'undefined') {
  // Server-side only
  accessCache.startCleanup()
}
```

**File: `check-access.ts`**

**Purpose**: Wrapper around `checkAppAccess` from auth-server with caching

```typescript
import { checkAppAccess as checkAppAccessBase } from '@cenie/auth-server/helpers'
import { createLogger } from '@cenie/logger'
import { accessCache } from './cache'
import type { AppName, AccessData } from '../types'

const logger = createLogger({ name: 'access-control' })

/**
 * Check user app access with caching
 * This is a cached wrapper around @cenie/auth-server/helpers/checkAppAccess
 */
export async function checkUserAppAccess(
  userId: string,
  appName: AppName
): Promise<AccessData> {
  // Check cache first
  const cached = accessCache.get(userId, appName)
  
  if (cached) {
    logger.debug('Access check cache hit', { userId, appName })
    return cached
  }
  
  // Cache miss - query Firestore
  logger.debug('Access check cache miss - querying Firestore', { userId, appName })
  const access = await checkAppAccessBase(userId, appName)
  
  // Cache the result
  accessCache.set(userId, appName, access)
  
  return access
}
```

**Note**: This wraps the helper from TASK_1A3 with caching. In Phase 7, we'll optimize this further.

**File: `grant-access.ts`**

**Purpose**: Grant a user access to an app with a specific role

```typescript
import { initializeAdminApp } from '@cenie/firebase/server'
import { createLogger } from '@cenie/logger'
import { DatabaseError } from '@cenie/errors'
import { accessCache } from './cache'
import type { AppName } from '../types'
import { Timestamp } from 'firebase-admin/firestore'

const logger = createLogger({ name: 'grant-access' })

export interface GrantAccessOptions {
  userId: string
  appName: AppName
  role: string
  grantedBy: string | null
}

/**
 * Grant user access to an app
 * Creates record in Firestore user_app_access collection
 */
export async function grantAccess(options: GrantAccessOptions): Promise<void> {
  const { userId, appName, role, grantedBy } = options
  
  try {
    const adminApp = initializeAdminApp()
    const firestore = adminApp.firestore()
    
    // Check if access already exists
    const existingAccess = await firestore
      .collection('user_app_access')
      .where('userId', '==', userId)
      .where('appName', '==', appName)
      .limit(1)
      .get()
    
    if (!existingAccess.empty) {
      // Update existing record
      const docId = existingAccess.docs[0].id
      await firestore.collection('user_app_access').doc(docId).update({
        role,
        isActive: true,
        grantedAt: Timestamp.now(),
        grantedBy,
      })
      
      logger.info('Updated existing access', { userId, appName, role })
    } else {
      // Create new record
      await firestore.collection('user_app_access').add({
        userId,
        appName,
        role,
        isActive: true,
        grantedAt: Timestamp.now(),
        grantedBy,
      })
      
      logger.info('Granted new access', { userId, appName, role })
    }
    
    // Clear cache for this user/app
    accessCache.clear(userId, appName)
    
    // Sync custom claims (will be implemented in tokens/ module)
    const { syncCustomClaims } = await import('../tokens/sync-claims')
    await syncCustomClaims(userId)
    
  } catch (error) {
    logger.error('Failed to grant access', { error, userId, appName, role })
    throw new DatabaseError('Failed to grant access', {
      cause: error,
      metadata: { userId, appName, role },
    })
  }
}
```

**File: `revoke-access.ts`**

```typescript
import { initializeAdminApp } from '@cenie/firebase/server'
import { createLogger } from '@cenie/logger'
import { DatabaseError } from '@cenie/errors'
import { accessCache } from './cache'
import type { AppName } from '../types'
import { Timestamp } from 'firebase-admin/firestore'

const logger = createLogger({ name: 'revoke-access' })

/**
 * Revoke user's access to an app
 * Sets isActive to false (soft delete for audit trail)
 */
export async function revokeAccess(
  userId: string,
  appName: AppName
): Promise<void> {
  try {
    const adminApp = initializeAdminApp()
    const firestore = adminApp.firestore()
    
    // Find access record
    const accessSnapshot = await firestore
      .collection('user_app_access')
      .where('userId', '==', userId)
      .where('appName', '==', appName)
      .limit(1)
      .get()
    
    if (accessSnapshot.empty) {
      logger.warn('No access to revoke', { userId, appName })
      return
    }
    
    // Update record to inactive
    const docId = accessSnapshot.docs[0].id
    await firestore.collection('user_app_access').doc(docId).update({
      isActive: false,
      updatedAt: Timestamp.now(),
    })
    
    logger.info('Access revoked', { userId, appName })
    
    // Clear cache
    accessCache.clear(userId, appName)
    
    // Sync custom claims
    const { syncCustomClaims } = await import('../tokens/sync-claims')
    await syncCustomClaims(userId)
    
  } catch (error) {
    logger.error('Failed to revoke access', { error, userId, appName })
    throw new DatabaseError('Failed to revoke access', {
      cause: error,
      metadata: { userId, appName },
    })
  }
}
```

**File: `index.ts`**

```typescript
export * from './check-access'
export * from './grant-access'
export * from './revoke-access'
export * from './cache'
```

### Module 3: Tokens (`src/tokens/`)

**File: `custom-claims.ts`**

```typescript
import type { Auth } from 'firebase-admin/auth'
import { createLogger } from '@cenie/logger'
import { ValidationError } from '@cenie/errors'

const logger = createLogger({ name: 'custom-claims' })

// Firebase limit: 1000 bytes
const MAX_CLAIMS_SIZE = 1000

/**
 * Update Firebase custom claims for a user
 * Custom claims are included in ID tokens for offline access checks
 */
export async function updateCustomClaims(
  userId: string,
  claims: Record<string, any>,
  auth: Auth
): Promise<void> {
  // Validate claims size (Firebase limit)
  const claimsJson = JSON.stringify(claims)
  const sizeInBytes = new Blob([claimsJson]).size
  
  if (sizeInBytes > MAX_CLAIMS_SIZE) {
    logger.error('Custom claims too large', {
      userId,
      size: sizeInBytes,
      limit: MAX_CLAIMS_SIZE,
    })
    
    throw new ValidationError('Custom claims exceed Firebase limit', {
      metadata: {
        size: sizeInBytes,
        limit: MAX_CLAIMS_SIZE,
      },
    })
  }
  
  try {
    await auth.setCustomUserClaims(userId, claims)
    
    logger.info('Custom claims updated', {
      userId,
      claimKeys: Object.keys(claims),
    })
  } catch (error) {
    logger.error('Failed to update custom claims', { error, userId })
    throw error
  }
}
```

**File: `sync-claims.ts`**

```typescript
import { initializeAdminApp } from '@cenie/firebase/server'
import { createLogger } from '@cenie/logger'
import { updateCustomClaims } from './custom-claims'
import type { AppName } from '../types'

const logger = createLogger({ name: 'sync-claims' })

/**
 * Sync user's custom claims based on their Firestore access records
 * Called after granting/revoking access to update ID token claims
 */
export async function syncCustomClaims(userId: string): Promise<void> {
  try {
    const adminApp = initializeAdminApp()
    const firestore = adminApp.firestore()
    const auth = adminApp.auth()
    
    // Get all active access records for user
    const accessSnapshot = await firestore
      .collection('user_app_access')
      .where('userId', '==', userId)
      .where('isActive', '==', true)
      .get()
    
    // Build custom claims
    const apps: AppName[] = []
    const roles: Record<string, string> = {}
    
    accessSnapshot.forEach((doc) => {
      const data = doc.data()
      apps.push(data.appName as AppName)
      roles[data.appName] = data.role
    })
    
    const claims = {
      apps, // Array: ['hub', 'editorial']
      roles, // Object: { hub: 'user', editorial: 'editor' }
    }
    
    // Update Firebase custom claims
    await updateCustomClaims(userId, claims, auth)
    
    logger.info('Custom claims synced', { userId, apps, roles })
  } catch (error) {
    logger.error('Failed to sync custom claims', { error, userId })
    // Don't throw - this is not critical, access still works via Firestore
  }
}
```

**File: `index.ts`**

```typescript
export * from './custom-claims'
export * from './sync-claims'
```

### Root Files

**File: `src/types.ts`**

```typescript
import type { Timestamp } from 'firebase-admin/firestore'

export type AppName = 'hub' | 'editorial' | 'academy' | 'agency'

export interface AccessData {
  hasAccess: boolean
  role: string | null
  isActive: boolean
}

export interface UserAppAccess {
  userId: string
  appName: AppName
  role: string
  isActive: boolean
  grantedAt: Timestamp
  grantedBy: string | null
}
```

**File: `src/index.ts`**

```typescript
// Roles
export * from './roles'

// Access Control
export * from './access-control'

// Tokens
export * from './tokens'

// Types
export type { AppName, AccessData, UserAppAccess } from './types'
```

### Package Configuration

**File: `package.json`**

```json
{
  "name": "@cenie/auth-utils",
  "version": "0.0.1",
  "private": true,
  "description": "Common authentication utilities for CENIE platform",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts",
    "./roles": "./src/roles/index.ts",
    "./access-control": "./src/access-control/index.ts",
    "./tokens": "./src/tokens/index.ts"
  },
  "scripts": {
    "lint": "eslint . --max-warnings 0",
    "type-check": "tsc --noEmit",
    "clean": "rm -rf .turbo node_modules dist"
  },
  "dependencies": {
    "@cenie/firebase": "workspace:*",
    "@cenie/errors": "workspace:*",
    "@cenie/logger": "workspace:*"
  },
  "peerDependencies": {
    "firebase-admin": "^13.0.0"
  },
  "devDependencies": {
    "@types/node": "^24.0.0",
    "eslint": "^9.38.0",
    "typescript": "^5.9.3"
  }
}
```

**File: `tsconfig.json`**

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

---

## TESTING REQUIREMENTS

### Test 1: Role Hierarchy

Create test file: `packages/auth-utils/src/__tests__/roles.test.ts`

```typescript
import { describe, it, expect } from 'vitest'
import { hasRole, getRoleLevel } from '../roles/hierarchy'

describe('Role Hierarchy', () => {
  it('should correctly compare role levels', () => {
    // Admin can access editor routes
    expect(hasRole('admin', 'editor')).toBe(true)
    
    // Editor can access editor routes
    expect(hasRole('editor', 'editor')).toBe(true)
    
    // Viewer cannot access editor routes
    expect(hasRole('viewer', 'editor')).toBe(false)
    
    // Instructor can access student routes
    expect(hasRole('instructor', 'student')).toBe(true)
  })
  
  it('should return correct role levels', () => {
    expect(getRoleLevel('viewer')).toBe(1)
    expect(getRoleLevel('editor')).toBe(2)
    expect(getRoleLevel('admin')).toBe(3)
    expect(getRoleLevel('invalid')).toBe(0)
  })
})
```

Run:
```bash
pnpm --filter=@cenie/auth-utils test
```

### Test 2: Access Cache

Create test: `packages/auth-utils/src/__tests__/cache.test.ts`

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { accessCache } from '../access-control/cache'

describe('Access Cache', () => {
  beforeEach(() => {
    accessCache.clearAll()
  })
  
  it('should cache and retrieve access data', () => {
    const accessData = {
      hasAccess: true,
      role: 'editor',
      isActive: true,
    }
    
    accessCache.set('user123', 'editorial', accessData)
    
    const cached = accessCache.get('user123', 'editorial')
    expect(cached).toEqual(accessData)
  })
  
  it('should return null for expired cache', async () => {
    const accessData = {
      hasAccess: true,
      role: 'editor',
      isActive: true,
    }
    
    // Set with 100ms TTL
    accessCache.set('user123', 'editorial', accessData, 100)
    
    // Wait for expiration
    await new Promise((resolve) => setTimeout(resolve, 150))
    
    const cached = accessCache.get('user123', 'editorial')
    expect(cached).toBeNull()
  })
  
  it('should clear user cache', () => {
    accessCache.set('user123', 'editorial', { hasAccess: true, role: 'editor', isActive: true })
    accessCache.set('user123', 'hub', { hasAccess: true, role: 'user', isActive: true })
    
    accessCache.clearUser('user123')
    
    expect(accessCache.get('user123', 'editorial')).toBeNull()
    expect(accessCache.get('user123', 'hub')).toBeNull()
  })
})
```

### Test 3: Integration with Editorial

Update `apps/editorial/src/lib/auth-helpers.ts` to use the new package:

```typescript
// Replace checkEditorialAccess function with:
import { checkUserAppAccess } from '@cenie/auth-utils/access-control'

export async function checkEditorialAccess(userId: string) {
  return checkUserAppAccess(userId, 'editorial')
}
```

Test Editorial:
1. Run Editorial: `pnpm --filter=@cenie/editorial dev`
2. Sign in
3. Access dashboard
4. Check browser network tab - access checks should be working
5. Check terminal logs - should see cache hits/misses

### Test 4: Custom Claims (Integration Test)

Test with Firebase Console:
1. Call `syncCustomClaims('YOUR_USER_ID')` from a test route
2. Check Firebase Console → Authentication → Users
3. Find your user → Custom Claims tab
4. Should see: `{ apps: ['editorial'], roles: { editorial: 'editor' } }`

---

## SUCCESS CRITERIA

- [ ] Package structure created correctly
- [ ] All TypeScript files compile without errors
- [ ] Linting passes (zero warnings)
- [ ] Role hierarchy working correctly
- [ ] Access cache working (get, set, clear operations)
- [ ] `grantAccess()` can create Firestore records
- [ ] `revokeAccess()` can update isActive flag
- [ ] `syncCustomClaims()` updates Firebase custom claims
- [ ] Unit tests pass
- [ ] Integration with Editorial successful
- [ ] README.md comprehensive

---

## COMPLETING MIDDLEWARE DEPENDENCY

After this task, **update TASK_1A2's `with-role.ts`**:

Change:
```typescript
const { hasRole } = await import('@cenie/auth-utils/roles')
```

To regular import:
```typescript
import { hasRole } from '@cenie/auth-utils/roles'
```

Now `withRole()` middleware is fully functional!

---

## COMMON PITFALLS

1. **Don't query Firestore in role comparisons**: `hasRole()` is purely numeric comparison, no database

2. **Don't forget cache invalidation**: Always clear cache when granting/revoking access

3. **Don't make custom claims required**: If claims fail to sync, access should still work via Firestore queries

4. **Don't exceed 1KB claims limit**: Validate size before calling Firebase API

5. **Don't forget Timestamp import**: Use `firebase-admin/firestore` Timestamp for Firestore dates

---

## HANDOFF

When complete:
- [ ] Package builds and tests pass
- [ ] Integration with Editorial confirmed
- [ ] `withRole()` from TASK_1A2 now fully functional
- [ ] Custom claims infrastructure ready for use

**Next**: TASK_1A5 will create OAuth handlers package.

---

**Estimated Time**: 5-7 hours

**Critical**: This task unlocks the full functionality of middleware from TASK_1A2 and makes the entire auth system operational.

