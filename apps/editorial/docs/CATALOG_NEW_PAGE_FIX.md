# Catalog New Page - Server Import Fix

## Error

```
You're importing a component that needs "next/headers". 
That only works in a Server Component which is not supported in the pages/ directory.

Import traces:
  ./packages/supabase/src/server.ts [Client Component Browser]
  ./apps/editorial/src/app/dashboard/catalog/new/page.tsx [Client Component Browser]
```

## Root Cause

The catalog new page (`/dashboard/catalog/new/page.tsx`) is a **client component** (has `'use client'` at the top), but it was trying to use server-side Supabase functions:

```typescript
// Line 168 - PROBLEMATIC CODE
const { createNextServerClient } = await import('@cenie/supabase/server')
const supabase = createNextServerClient()
```

Even though this was a dynamic import, the `@cenie/supabase/server` module imports `next/headers` at the top level, which is not allowed in client components.

## Solution

Moved the server-side database operations to a new API route instead of doing them directly from the client.

### Changes Made

1. **Updated Client Component** (`apps/editorial/src/app/dashboard/catalog/new/page.tsx`)
   - Removed direct Supabase server import
   - Changed to use API endpoint for linking contributors

**Before:**
```typescript
const { createNextServerClient } = await import('@cenie/supabase/server')
const supabase = createNextServerClient()

const { error } = await supabase
  .from('volume_contributors')
  .insert(contributorsData)
```

**After:**
```typescript
const contributorsResponse = await fetch(`/api/catalog/${volumeId}/contributors`, {
  method: 'POST',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ contributors: contributorsData }),
})
```

2. **Created New API Route** (`apps/editorial/src/app/api/catalog/[id]/contributors/route.ts`)
   - Handles linking contributors to catalog volumes
   - Uses server-side Supabase client (allowed in API routes)
   - Updates display fields after linking

## Files Changed

- ✅ `apps/editorial/src/app/dashboard/catalog/new/page.tsx` - Removed server import
- ✅ `apps/editorial/src/app/api/catalog/[id]/contributors/route.ts` - New API endpoint

## Testing

1. Navigate to `/dashboard/catalog/new`
2. Fill out the form to create an original publication
3. Assign authors and/or editors
4. Click "Create Publication"
5. Verify:
   - No error about `next/headers`
   - Volume is created successfully
   - Contributors are linked properly
   - Redirects to catalog detail page

## Key Takeaway

**Client components cannot import server modules**, even with dynamic imports. The module's top-level imports (like `next/headers`) are evaluated before the dynamic import happens.

**Solution Pattern:**
- Client Component → API Route → Server Code ✅
- Client Component → Server Module ❌

## Status

✅ **Fixed** - Error resolved, API endpoint created, functionality maintained

