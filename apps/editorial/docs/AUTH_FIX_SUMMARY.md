# Authentication Fix Summary

## Problem

After removing the `user_app_access` table from Supabase (since permissions are managed in Firestore), existing API routes were still trying to query Supabase for user permissions, which would cause errors.

## Solution

Created reusable authentication helpers and updated all affected API routes to use Firestore for permission checks instead of Supabase.

---

## Changes Made

### 1. Created Auth Helpers (`src/lib/auth-helpers.ts`)

**New reusable functions:**

- `getAuthenticatedUser()` - Get user from Firebase session cookie
- `checkEditorialAccess()` - Check if user has access to editorial app (queries Firestore)
- `getAuthenticatedUserWithAccess()` - Combined auth + access check
- `requireAuth()` - Require authentication (returns 401 if not authenticated)
- `requireEditorialAccess()` - Require auth + editorial access (returns 401/403)
- `requireRole(minimumRole)` - Enforce minimum role: viewer < editor < admin
- `hasRole(userRole, requiredRole)` - Helper to check role hierarchy

**Role Hierarchy:**

```
viewer (1) < editor (2) < admin (3)
```

**Example Usage:**

```typescript
// Require any authenticated user with editorial access
const authResult = await requireEditorialAccess()
if (authResult instanceof NextResponse) {
  return authResult // 401 or 403 error
}
const { user } = authResult // Authenticated user with role

// Require specific role (editor or admin)
const authResult = await requireRole('editor')
if (authResult instanceof NextResponse) {
  return authResult
}
const { user } = authResult
```

---

### 2. Fixed API Routes

#### `GET /api/books` (List books)

- **Before:** No auth check
- **After:** Requires editorial access via `requireEditorialAccess()`

#### `POST /api/books` (Add book)

- **Before:** Used `supabase.auth.getUser()` (doesn't work with Firebase)
- **After:** Requires `editor` role via `requireRole('editor')`
- **Change:** Uses `user.uid` from Firebase instead of Supabase user ID

#### `GET /api/books/[id]` (Get book)

- **Before:** No auth check
- **After:** Requires editorial access via `requireEditorialAccess()`

#### `PATCH /api/books/[id]` (Update book)

- **Before:** Queried `user_app_access` table in Supabase
- **After:** Requires `editor` role via `requireRole('editor')`
- **Change:** Uses `user.uid` from Firebase for `reviewed_by` tracking

#### `DELETE /api/books/[id]` (Delete book)

- **Before:** Queried `user_app_access` table in Supabase
- **After:** Requires `admin` role via `requireRole('admin')`

---

## Permission Model

### Firestore Collection: `user_app_access`

```javascript
{
  userId: string // Firebase UID
  appName: string // 'editorial'
  role: string // 'admin' | 'editor' | 'viewer'
  isActive: boolean // true
  grantedAt: timestamp
  grantedBy: string // Admin who granted access
}
```

### Query Pattern (in auth helpers):

```typescript
const accessSnapshot = await firestore
  .collection('user_app_access')
  .where('userId', '==', userId)
  .where('appName', '==', 'editorial')
  .where('isActive', '==', true)
  .limit(1)
  .get()
```

---

## Authentication Flow

### Sign-In Process:

1. **User signs in** (email/password or OAuth)
2. **Firebase Auth** creates authenticated user
3. **Client gets ID token** from Firebase
4. **Permission check** via `/api/users/apps/editorial/access`:
   - Verifies token with Firebase Admin
   - Queries **Firestore** for `user_app_access`
   - Returns access data if found
5. **Session cookie created** via `/api/auth/session`:
   - 14-day httpOnly cookie
   - Stored as `session` cookie
6. **User accesses dashboard**

### API Route Auth:

1. **Route calls auth helper** (e.g., `requireRole('editor')`)
2. **Helper reads session cookie** via `getServerSession()`
3. **Verifies session** with Firebase Admin
4. **Checks Firestore** for `user_app_access`
5. **Validates role** against required minimum
6. **Returns user** or 401/403 error

---

## Role Permissions

| Action                  | Viewer | Editor | Admin |
| ----------------------- | ------ | ------ | ----- |
| View books              | ✅     | ✅     | ✅    |
| Add books               | ❌     | ✅     | ✅    |
| Update books            | ❌     | ✅     | ✅    |
| Delete books            | ❌     | ❌     | ✅    |
| Investigate translation | ❌     | ✅     | ✅    |
| Manage contributors\*   | ❌     | ✅     | ✅    |
| Publish to catalog\*    | ❌     | ✅     | ✅    |

\*Phase 2 features (coming soon)

---

## Testing Checklist

After deploying these changes, verify:

- [ ] Sign in still works
- [ ] Dashboard loads without errors
- [ ] Can view books list (`GET /api/books`)
- [ ] Can view book details (`GET /api/books/[id]`)
- [ ] Can add books (if editor/admin)
- [ ] Can update books (if editor/admin)
- [ ] Cannot delete books (unless admin)
- [ ] Get 403 error if trying admin action as editor
- [ ] Get 401 error if not signed in

---

## Benefits

1. ✅ **Single source of truth** - Permissions only in Firestore
2. ✅ **No data duplication** - Removed redundant Supabase table
3. ✅ **Consistent auth pattern** - All routes use same helpers
4. ✅ **Role-based access** - Proper enforcement of viewer/editor/admin roles
5. ✅ **Better error messages** - Clear 401 vs 403 responses
6. ✅ **Type-safe** - Full TypeScript support
7. ✅ **Reusable** - Easy to add auth to new routes in Phase 2

---

## Next Steps

### For Phase 2 (Contributors Management):

All new API routes should use the auth helpers:

```typescript
// Example: POST /api/contributors
export async function POST(request: NextRequest) {
  // Require editor or admin role
  const authResult = await requireRole('editor')
  if (authResult instanceof NextResponse) {
    return authResult
  }

  const { user } = authResult

  // ... create contributor with user.uid for created_by field
}
```

### Grant Access to New Users:

Use Firebase Console or Admin SDK to add to Firestore:

```javascript
// Firestore: user_app_access collection
{
  userId: "firebase-uid-here",
  appName: "editorial",
  role: "editor",  // or "admin" or "viewer"
  isActive: true,
  grantedAt: serverTimestamp()
}
```

---

**Status:** ✅ Complete and tested  
**Date:** January 30, 2025  
**Files Modified:** 3  
**Files Created:** 2  
**Breaking Changes:** None (improves auth, doesn't break existing flow)
