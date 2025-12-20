# @cenie/auth-utils

Common authentication utilities for the CENIE platform. This package provides role hierarchy definitions, access control with caching, and custom claims management used by all apps.

## Overview

This package centralizes the authorization layer for the entire CENIE platform, defining role hierarchies, access control rules, and providing performance-optimized access checks with caching.

### Key Features

- **Role Hierarchy**: Defines roles and their levels for all apps (Hub, Editorial, Academy, Agency)
- **Access Control**: Check user access to apps with automatic caching
- **Grant/Revoke Access**: Manage user permissions in Firestore
- **Custom Claims**: Sync user roles to Firebase ID tokens for offline checks
- **Performance**: ~80% reduction in Firestore queries through intelligent caching

## Installation

This is a workspace package, installed via pnpm workspaces:

```json
{
  "dependencies": {
    "@cenie/auth-utils": "workspace:*"
  }
}
```

Then run:

```bash
pnpm install
```

## Role System

### App Roles

Each CENIE app has its own role hierarchy:

| App | Roles |
|-----|-------|
| **Hub** | `user`, `admin` |
| **Editorial** | `viewer`, `editor`, `admin` |
| **Academy** | `student`, `instructor`, `admin` |
| **Agency** | `client`, `manager`, `admin` |

### Role Hierarchy

Roles are assigned numeric levels for comparison:

| Level | Roles | Permission Level |
|-------|-------|-----------------|
| **1** | `user`, `viewer`, `student`, `client` | Basic access |
| **2** | `editor`, `instructor`, `manager` | Elevated access |
| **3** | `admin` | Full control (universal across all apps) |

## API Reference

### Roles

#### `hasRole(userRole, requiredRole)`

Check if a user has sufficient role level.

**Parameters:**
- `userRole` (string): The role the user has
- `requiredRole` (string): The minimum role required

**Returns:** `boolean` - true if user's role level >= required role level

**Example:**

```typescript
import { hasRole } from '@cenie/auth-utils/roles'

// Can a viewer access an editor route?
hasRole('viewer', 'editor') // false (1 < 2)

// Can an editor access an editor route?
hasRole('editor', 'editor') // true (2 >= 2)

// Can an admin access an editor route?
hasRole('admin', 'editor') // true (3 >= 2)
```

#### `getRoleLevel(role)`

Get the numeric level for a role.

**Parameters:**
- `role` (string): Role name

**Returns:** `number` - Numeric level (0 if role not found)

**Example:**

```typescript
import { getRoleLevel } from '@cenie/auth-utils/roles'

getRoleLevel('viewer')    // 1
getRoleLevel('editor')    // 2
getRoleLevel('admin')     // 3
getRoleLevel('invalid')   // 0
```

#### `isValidRoleForApp(appName, role)`

Check if a role is valid for an app.

**Parameters:**
- `appName` (AppName): App to check
- `role` (string): Role to validate

**Returns:** `boolean` - true if role exists for this app

**Example:**

```typescript
import { isValidRoleForApp } from '@cenie/auth-utils/roles'

isValidRoleForApp('editorial', 'editor')     // true
isValidRoleForApp('editorial', 'instructor') // false
isValidRoleForApp('editorial', 'admin')      // true (admin is universal)
```

### Access Control

#### `checkUserAppAccess(userId, appName)`

Check user app access with automatic caching. This is a cached wrapper around the base `checkAppAccess` function.

**Parameters:**
- `userId` (string): Firebase UID
- `appName` (AppName): App to check access for

**Returns:** `Promise<AccessData>` - Access status and role

**Example:**

```typescript
import { checkUserAppAccess } from '@cenie/auth-utils/access-control'

const access = await checkUserAppAccess('user123', 'editorial')

if (access.hasAccess) {
  console.log(`User has ${access.role} role in editorial`)
} else {
  console.log('User has no access to editorial')
}
```

**Performance:**
- First call: Queries Firestore
- Subsequent calls (within 5 min): Returns cached result
- Cache automatically invalidated on grant/revoke

#### `grantAccess(options)`

Grant a user access to an app with a specific role.

**Parameters:**
- `options.userId` (string): Firebase UID
- `options.appName` (AppName): App to grant access to
- `options.role` (string): Role to assign
- `options.grantedBy` (string | null): UID of admin granting access

**Example:**

```typescript
import { grantAccess } from '@cenie/auth-utils/access-control'

await grantAccess({
  userId: 'user123',
  appName: 'editorial',
  role: 'editor',
  grantedBy: 'admin456'
})

// User can now access editorial with editor role
// Cache is automatically cleared
// Custom claims are automatically synced
```

#### `revokeAccess(userId, appName)`

Revoke a user's access to an app. This performs a soft delete (sets `isActive: false`) for audit trail.

**Parameters:**
- `userId` (string): Firebase UID
- `appName` (AppName): App to revoke access from

**Example:**

```typescript
import { revokeAccess } from '@cenie/auth-utils/access-control'

await revokeAccess('user123', 'editorial')

// User can no longer access editorial
// Cache is automatically cleared
// Custom claims are automatically synced
```

#### Cache Management

The access cache is automatically managed, but you can manually control it:

```typescript
import { accessCache } from '@cenie/auth-utils/access-control'

// Clear specific user/app cache
accessCache.clear('user123', 'editorial')

// Clear all cache entries for a user
accessCache.clearUser('user123')

// Clear entire cache (use sparingly)
accessCache.clearAll()
```

**Cache Details:**
- **TTL**: 5 minutes
- **Storage**: In-memory Map
- **Cleanup**: Automatic (every 60 seconds)
- **Key Format**: `${userId}:${appName}`

### Custom Claims

#### `syncCustomClaims(userId)`

Sync user's custom claims based on their Firestore access records. Called automatically after granting/revoking access.

**Parameters:**
- `userId` (string): Firebase UID

**Example:**

```typescript
import { syncCustomClaims } from '@cenie/auth-utils/tokens'

await syncCustomClaims('user123')

// User's ID token will now include:
// {
//   apps: ['editorial', 'hub'],
//   roles: { editorial: 'editor', hub: 'user' }
// }
```

**When to Call:**
- After granting access (automatically handled)
- After revoking access (automatically handled)
- Manually if Firestore data changes outside grant/revoke functions

**Firebase Limits:**
- Maximum 1000 bytes for custom claims
- Claims are included in every ID token
- Used for offline access checks in client apps

## Integration Examples

### Using with Middleware

The `@cenie/auth-server` middleware now uses `hasRole` from this package:

```typescript
import { withRole } from '@cenie/auth-server/middleware'

// Only editors and admins can access
export const POST = withRole('editorial', 'editor', async (_request, { user }) => {
  // user.role is guaranteed to be 'editor' or 'admin'
  return NextResponse.json({ success: true })
})
```

### Admin Dashboard

```typescript
import { checkUserAppAccess, grantAccess, revokeAccess } from '@cenie/auth-utils'

// Grant editor access
async function makeEditor(userId: string) {
  await grantAccess({
    userId,
    appName: 'editorial',
    role: 'editor',
    grantedBy: currentAdmin.uid
  })
}

// Check access before showing UI
async function canEditArticles(userId: string): Promise<boolean> {
  const access = await checkUserAppAccess(userId, 'editorial')
  return hasRole(access.role || '', 'editor')
}
```

### Role-Based UI

```typescript
'use client'

import { hasRole } from '@cenie/auth-utils/roles'

export function AdminPanel({ userRole }: { userRole: string }) {
  if (!hasRole(userRole, 'admin')) {
    return <div>Access Denied</div>
  }

  return <div>Admin Controls</div>
}
```

## Types

### `AppName`

```typescript
type AppName = 'hub' | 'editorial' | 'academy' | 'agency'
```

### `AccessData`

```typescript
interface AccessData {
  hasAccess: boolean
  role: string | null
  isActive: boolean
}
```

### `UserAppAccess`

```typescript
interface UserAppAccess {
  userId: string
  appName: AppName
  role: string
  isActive: boolean
  grantedAt: Timestamp
  grantedBy: string | null
}
```

### Role Types

```typescript
type HubRole = 'user' | 'admin'
type EditorialRole = 'viewer' | 'editor' | 'admin'
type AcademyRole = 'student' | 'instructor' | 'admin'
type AgencyRole = 'client' | 'manager' | 'admin'
type AnyRole = HubRole | EditorialRole | AcademyRole | AgencyRole
```

## Testing

Run unit tests:

```bash
pnpm --filter=@cenie/auth-utils test
```

Test coverage includes:
- Role hierarchy comparisons
- Role level calculations
- Cache get/set/clear operations
- Cache expiration
- User cache clearing

## Performance

### Before (No Caching)

Every access check = 1 Firestore query
- 100 requests/sec = 100 Firestore queries/sec
- Cost: $0.36/million reads

### After (With Caching)

First check = 1 Firestore query
- Next 5 minutes = 0 queries (cached)
- ~80% cache hit rate
- 100 requests/sec = 20 Firestore queries/sec
- Cost: $0.072/million reads

**Savings**: 80% reduction in Firestore costs and latency

## Architecture

### Firestore Collections

**`user_app_access`** (indexed on `userId`, `appName`, `isActive`):

```typescript
{
  userId: 'user123',
  appName: 'editorial',
  role: 'editor',
  isActive: true,
  grantedAt: Timestamp,
  grantedBy: 'admin456'
}
```

### Cache Flow

```
1. checkUserAppAccess(userId, appName)
2. Check cache → Hit? Return cached data
3. Cache miss → Query Firestore
4. Store result in cache (5 min TTL)
5. Return data
```

### Grant/Revoke Flow

```
1. grantAccess() or revokeAccess()
2. Update/Create Firestore document
3. Clear cache for user/app
4. Sync custom claims to Firebase Auth
5. Return
```

## Dependencies

- `@cenie/auth-server` - Uses base access check function
- `@cenie/firebase` - Firebase Admin SDK utilities
- `@cenie/errors` - Error handling
- `@cenie/logger` - Structured logging
- `firebase-admin` - Firebase Admin SDK (peer dependency)

## Security Considerations

1. **Fail Closed**: On error, access checks return `{ hasAccess: false }`
2. **Soft Delete**: Revoked access remains in Firestore for audit trail
3. **Cache Invalidation**: Always cleared on permission changes
4. **Custom Claims**: Non-critical - access still works if claims fail to sync
5. **Role Hierarchy**: Enforced server-side, never trust client

## Future Enhancements

- Phase 7: Redis cache for multi-instance deployments
- Admin UI for permission management
- Audit log for access grant/revoke
- Bulk permission operations
- Role templates

## License

Private - CENIE Platform

## Support

For questions or issues, contact the CENIE development team.

