# Supabase Migrations - CENIE Editorial Books System

## Quick Start

### 1. Run the Migration

In your Supabase SQL Editor, run:

```sql
-- Copy and paste the contents of: 20250127_books_management_fixed.sql
```

**Or** if using Supabase CLI:

```bash
supabase db push
```

### 2. Grant Access to Users

After the migration completes, grant editorial access to your user:

```sql
-- Replace 'YOUR-USER-UUID' with your actual user UUID from auth.users table
SELECT grant_editorial_access('YOUR-USER-UUID', 'admin');

-- Or for editor role:
SELECT grant_editorial_access('YOUR-USER-UUID', 'editor');
```

### 3. Find Your User UUID

To find your user UUID, run:

```sql
SELECT id, email FROM auth.users;
```

Copy your UUID and use it in the `grant_editorial_access` function above.

## What This Migration Creates

### Tables

1. **`books`** - Main books registry
   - Stores Google Books references
   - Editorial workflow metadata
   - Full-text search capability

2. **`book_tags`** - Categorization system
   - Tag books by category/subject
   - Many-to-many relationship

3. **`book_reviews`** - Editorial assessments
   - Internal reviews by team members
   - Ratings and recommendations

4. **`user_app_access`** - Role-based permissions
   - Controls who can access editorial features
   - Supports admin and editor roles

### Functions

- **`search_books(query, limit)`** - Full-text search in Spanish
- **`get_books_by_status()`** - Get book counts by workflow status
- **`grant_editorial_access(user_id, role)`** - Grant access to users

### Security

- **Row Level Security (RLS)** enabled on all tables
- Public read access (for catalog)
- Authenticated write access (with application-layer role checks)

## Simplified Security Model

This migration uses a **simplified RLS approach**:

- **Database Layer**: Checks if user is authenticated
- **Application Layer**: Checks specific roles (admin/editor)

This approach:
- ✅ Easier to manage and debug
- ✅ More flexible for rapid development
- ✅ Still secure (authenticated users only)
- ✅ Role checks happen in API routes

### Why Simplified?

The original complex RLS policies caused issues during migration because:
1. Cross-table references in policies can be problematic
2. Harder to debug policy failures
3. Application-layer checks are more explicit

**Security is maintained** because:
- Only authenticated users can write
- API routes verify admin/editor roles
- Firebase authentication is still required

## Testing the Migration

After running the migration and granting access:

```sql
-- 1. Check tables were created
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('books', 'book_tags', 'book_reviews', 'user_app_access');

-- 2. Check your access was granted
SELECT * FROM user_app_access WHERE app_name = 'editorial';

-- 3. Test book insertion (should work)
INSERT INTO books (google_books_id, title, status)
VALUES ('test-id-123', 'Test Book', 'discovered')
RETURNING *;

-- 4. Clean up test
DELETE FROM books WHERE google_books_id = 'test-id-123';
```

## Troubleshooting

### Error: "relation already exists"

This is **OK** - it means tables already exist. The migration uses `IF NOT EXISTS` so it's safe to run multiple times.

### Error: "permission denied"

Make sure you're running the migration as a Supabase admin/owner, not as a regular authenticated user.

### Can't insert books

Check that you:
1. Ran the migration successfully
2. Granted yourself editorial access
3. Are signed in with Firebase authentication

### Granting Access to Multiple Users

```sql
-- Get all user IDs
SELECT id, email FROM auth.users;

-- Grant access to specific users
SELECT grant_editorial_access('uuid-1', 'admin');
SELECT grant_editorial_access('uuid-2', 'editor');
SELECT grant_editorial_access('uuid-3', 'editor');
```

## Migration History

- **20250127_books_management_fixed.sql** - Fixed version with simplified RLS
- **20250127_books_management.sql** - Original (had complex RLS policy issues)

Use the **_fixed** version for new installations.

## Next Steps

After successful migration:

1. ✅ Start the editorial app: `pnpm dev --filter=@cenie/editorial`
2. ✅ Navigate to: `http://localhost:3001/dashboard`
3. ✅ Sign in with Firebase
4. ✅ Start searching and adding books!

## Support

If you encounter issues:

1. Check Supabase logs in Dashboard → Database → Logs
2. Verify user is in `auth.users` table
3. Confirm `user_app_access` record exists
4. Review [BOOKS_SYSTEM.md](../../apps/editorial/BOOKS_SYSTEM.md) documentation
