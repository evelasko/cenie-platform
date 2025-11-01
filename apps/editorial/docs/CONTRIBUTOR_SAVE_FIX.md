# Contributor Save Fix - Documentation

## Issue

When editing a draft in the "Prepare for Publication" page (`/dashboard/books/[id]/prepare`), the assigned contributors (authors and translators) were **not being saved** when clicking "Save Draft". They were only being used when publishing to the catalog, meaning if you:

1. Assigned contributors
2. Clicked "Save Draft"
3. Navigated away
4. Came back to the page

...the contributor assignments would be lost.

## Root Cause

The `books` table had no fields to store temporary contributor assignments during the publication preparation phase. Contributors are only linked to `catalog_volumes` through the `volume_contributors` junction table, but not to books in the editorial workspace.

## Solution

### 1. Database Migration

Added two new JSONB columns to the `books` table to store temporary contributor assignments:

**File:** `packages/supabase/migrations/20250201_add_temp_contributors.sql`

```sql
ALTER TABLE books
ADD COLUMN temp_authors jsonb,
ADD COLUMN temp_translators jsonb;
```

**Data Format:**

```json
{
  "temp_authors": [
    {
      "id": "uuid",
      "full_name": "Konstantin Stanislavski",
      "slug": "konstantin-stanislavski",
      "primary_role": "author"
    }
  ],
  "temp_translators": [
    {
      "id": "uuid",
      "full_name": "María García",
      "slug": "maria-garcia",
      "primary_role": "translator"
    }
  ]
}
```

### 2. TypeScript Type Updates

Updated `src/types/books.ts`:

**Book interface:**

```typescript
export interface Book {
  // ... other fields
  temp_authors?: any[] | null
  temp_translators?: any[] | null
}
```

**BookUpdateInput interface:**

```typescript
export interface BookUpdateInput {
  // ... other fields
  temp_authors?: any[] | null
  temp_translators?: any[] | null
}
```

### 3. Prepare Page Updates

Updated `src/app/dashboard/books/[id]/prepare/page.tsx`:

**Loading Contributors:**

```typescript
// In fetchBook() - Load saved contributors when page loads
if (bookData.temp_authors) {
  setAuthors(bookData.temp_authors as ContributorSelection[])
}
if (bookData.temp_translators) {
  setTranslators(bookData.temp_translators as ContributorSelection[])
}
```

**Saving Contributors:**

```typescript
// In handleSaveDraft() - Save contributors when saving draft
body: JSON.stringify({
  // ... other fields
  temp_authors: authors.length > 0 ? authors : null,
  temp_translators: translators.length > 0 ? translators : null,
})
```

## How to Apply

### Step 1: Run the Database Migration

**For Local Development (Supabase CLI):**

```bash
cd packages/supabase
supabase migration up
```

**For Production (via Supabase Dashboard):**

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the migration SQL from `packages/supabase/migrations/20250201_add_temp_contributors.sql`
4. Run the migration

**Or via the MCP Supabase tool:**

```typescript
// The migration should be automatically detected
// Check with list_migrations, then apply if needed
```

### Step 2: Restart the Development Server

```bash
# From the project root
pnpm dev
```

## Testing

1. **Navigate to a book detail page** that's selected for translation
2. **Click "Prepare for Publication"**
3. **Assign authors and translators** using the autocomplete fields
4. **Click "Save Draft"** (don't publish yet)
5. **Navigate away** (go back to book list)
6. **Return to the prepare page** for the same book
7. **Verify:** The assigned contributors should still be there! ✓

## Benefits

- ✅ **Persistent Assignments**: Contributors are saved with the draft
- ✅ **No Data Loss**: Can safely navigate away without losing work
- ✅ **Better UX**: Incremental saving supports multi-session editing
- ✅ **Pre-filled Forms**: Returns to the page show previously selected contributors
- ✅ **Clean Workflow**: Separates draft work from final publication

## Implementation Notes

### Why JSONB instead of a junction table?

These are **temporary** assignments that only exist during the preparation phase. Once the book is published to the catalog, the real contributor relationships are created in the `volume_contributors` junction table. Using JSONB for temporary storage:

- Avoids creating temporary junction records
- Keeps the data model clean and simple
- Makes it easy to clear assignments (set to null)
- Doesn't pollute the normalized contributor relationships

### Data Lifecycle

1. **Preparation Phase**: Contributors stored in `temp_authors` and `temp_translators` (JSONB)
2. **Publishing**: Data from temp fields is used to create `volume_contributors` records
3. **After Publishing**: Temp fields can be cleared (optional) or kept for reference

## API Changes

No API route changes were needed! The existing `PATCH /api/books/[id]` endpoint already handles dynamic updates through spread operator:

```typescript
const updateData: any = { ...body }
```

This automatically accepts and saves the new `temp_authors` and `temp_translators` fields.

## Related Files

- `/packages/supabase/migrations/20250201_add_temp_contributors.sql` - Database migration
- `/apps/editorial/src/types/books.ts` - Type definitions
- `/apps/editorial/src/app/dashboard/books/[id]/prepare/page.tsx` - Prepare page
- `/apps/editorial/src/app/api/books/[id]/route.ts` - Books API (no changes needed)

## Version

- **Migration Date:** February 1, 2025
- **Migration File:** `20250201_add_temp_contributors.sql`
- **Status:** ✅ Ready to deploy
