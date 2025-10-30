# Database Deployment Checklist

## Pre-Deployment

- [ ] **Backup any existing data** (if needed)
  - Note: We agreed to start fresh, so this can be skipped

- [ ] **Verify Supabase connection**
  ```bash
  # Test connection in your app
  pnpm dev --filter=@cenie/editorial
  # Should connect without errors
  ```

## Deployment Steps

### 1. Drop Existing Tables (Fresh Start)

Open Supabase SQL Editor and run:

```sql
-- Drop all existing tables for clean slate
DROP TABLE IF EXISTS volume_contributors CASCADE;
DROP TABLE IF EXISTS catalog_volumes CASCADE;
DROP TABLE IF EXISTS contributors CASCADE;
DROP TABLE IF EXISTS publishers CASCADE;
DROP TABLE IF EXISTS book_reviews CASCADE;
DROP TABLE IF EXISTS book_tags CASCADE;
DROP TABLE IF EXISTS books CASCADE;
DROP TABLE IF EXISTS translation_glossary CASCADE;

-- Drop any leftover functions
DROP FUNCTION IF EXISTS promote_book_to_catalog CASCADE;
DROP FUNCTION IF EXISTS search_catalog_volumes CASCADE;
DROP FUNCTION IF EXISTS get_volume_contributors CASCADE;
DROP FUNCTION IF EXISTS generate_contributors_display CASCADE;
DROP FUNCTION IF EXISTS update_volume_display_fields CASCADE;
DROP FUNCTION IF EXISTS search_books CASCADE;
DROP FUNCTION IF EXISTS get_books_by_status CASCADE;
DROP FUNCTION IF EXISTS start_translation_check CASCADE;
DROP FUNCTION IF EXISTS complete_translation_check CASCADE;
DROP FUNCTION IF EXISTS get_translation_stats CASCADE;
DROP FUNCTION IF EXISTS grant_editorial_access CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column CASCADE;
DROP FUNCTION IF EXISTS books_search_vector_update CASCADE;
DROP FUNCTION IF EXISTS catalog_volumes_search_vector_update CASCADE;
DROP FUNCTION IF EXISTS contributors_search_vector_update CASCADE;
```

### 2. Run Migration

Copy and paste the entire contents of:
```
packages/supabase/migrations/20250130_cenie_editorial_complete.sql
```

Into Supabase SQL Editor and execute.

### 3. Verify Installation

Run these verification queries:

```sql
-- Check all tables exist
SELECT tablename 
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;

-- Expected tables:
-- books
-- catalog_volumes
-- contributors
-- publishers
-- translation_glossary
-- volume_contributors

-- Check glossary seeded
SELECT COUNT(*) FROM translation_glossary;
-- Should return ~65

-- Check functions exist
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_type = 'FUNCTION'
ORDER BY routine_name;

-- Check indexes
SELECT indexname 
FROM pg_indexes 
WHERE schemaname = 'public' 
ORDER BY indexname;
```

### 4. Grant Admin Access (via Firestore)

**Note:** User permissions are managed in Firestore, not Supabase.

**Grant yourself admin access via Firebase Console or Admin SDK:**

Option 1 - Firebase Console:
1. Go to Firebase Console → Firestore Database
2. Navigate to `user_app_access` collection
3. Add document:
   ```json
   {
     "user_id": "YOUR-FIREBASE-UID",
     "app_name": "editorial",
     "role": "admin",
     "is_active": true,
     "granted_at": [current timestamp]
   }
   ```

Option 2 - Using Admin SDK (recommended):
```javascript
// scripts/grant-access.js
const admin = require('firebase-admin');
const serviceAccount = require('./firebase-serviceaccount.json');

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

const db = admin.firestore();

async function grantAccess(userId, role = 'admin') {
  await db.collection('user_app_access').add({
    user_id: userId,
    app_name: 'editorial',
    role: role,
    is_active: true,
    granted_at: admin.firestore.FieldValue.serverTimestamp()
  });
  console.log(`Granted ${role} access to ${userId}`);
}

grantAccess('YOUR-FIREBASE-UID').then(() => process.exit());
```

## Post-Deployment Testing

### Test 1: Create a Test Book

```sql
INSERT INTO books (
  google_books_id,
  title,
  authors,
  status,
  selected_for_translation
) VALUES (
  'test-book-001',
  'Test Book: Acting Technique',
  ARRAY['Test Author'],
  'selected',
  true
)
RETURNING *;
```

### Test 2: Create a Test Contributor

```sql
INSERT INTO contributors (
  full_name,
  slug,
  primary_role,
  bio_es
) VALUES (
  'Test Author',
  'test-author',
  'author',
  'Un autor de prueba para verificar el sistema.'
)
RETURNING *;
```

### Test 3: Create a Test Publisher

```sql
INSERT INTO publishers (
  name,
  slug,
  country
) VALUES (
  'CENIE Editorial',
  'cenie-editorial',
  'España'
)
RETURNING *;
```

### Test 4: Create a Test Catalog Volume

```sql
INSERT INTO catalog_volumes (
  volume_type,
  title,
  description,
  publisher_name,
  publication_status,
  slug
) VALUES (
  'original',
  'Test Volume',
  'A test volume to verify the catalog system works.',
  'CENIE Editorial',
  'draft',
  'test-volume'
)
RETURNING *;
```

### Test 5: Link Contributor to Volume

```sql
-- Get IDs from previous tests
WITH test_data AS (
  SELECT 
    (SELECT id FROM catalog_volumes WHERE slug = 'test-volume') as volume_id,
    (SELECT id FROM contributors WHERE slug = 'test-author') as contributor_id
)
INSERT INTO volume_contributors (
  volume_id,
  contributor_id,
  role,
  display_order
)
SELECT volume_id, contributor_id, 'author', 0
FROM test_data
RETURNING *;
```

### Test 6: Update Display Fields

```sql
SELECT update_volume_display_fields(
  (SELECT id FROM catalog_volumes WHERE slug = 'test-volume')
);

-- Verify display text generated
SELECT authors_display, translator_display 
FROM catalog_volumes 
WHERE slug = 'test-volume';
-- Should show: authors_display = 'Test Author'
```

### Test 7: Full-Text Search

```sql
-- Search books
SELECT * FROM search_books('test', 10);

-- Search catalog
SELECT * FROM search_catalog_volumes('test', 10, false);
```

### Test 8: Promote Book to Catalog (Integration Test)

```sql
SELECT promote_book_to_catalog(
  (SELECT id FROM books WHERE google_books_id = 'test-book-001'),
  '{
    "title": "Técnica de Actuación de Prueba",
    "description": "Un libro de prueba traducido",
    "slug": "tecnica-actuacion-prueba",
    "categories": ["teatro", "actuación"],
    "volume_type": "translated"
  }'::jsonb,
  'YOUR-FIREBASE-UID-HERE'
);

-- Verify promotion worked
SELECT * FROM books WHERE google_books_id = 'test-book-001';
-- Should show: promoted_to_catalog = true, catalog_volume_id populated

SELECT * FROM catalog_volumes WHERE slug = 'tecnica-actuacion-prueba';
-- Should exist with source_book_id populated
```

### Clean Up Test Data (Optional)

```sql
-- Remove test data
DELETE FROM volume_contributors WHERE volume_id IN (
  SELECT id FROM catalog_volumes WHERE slug LIKE 'test-%'
);
DELETE FROM catalog_volumes WHERE slug LIKE 'test-%';
DELETE FROM contributors WHERE slug LIKE 'test-%';
DELETE FROM publishers WHERE slug LIKE 'test-%';
DELETE FROM books WHERE google_books_id LIKE 'test-%';
```

## Verification Checklist

- [ ] All 7 tables exist
- [ ] All indexes created
- [ ] All functions available
- [ ] Glossary has ~65 entries
- [ ] Admin access granted
- [ ] Test book created successfully
- [ ] Test contributor created successfully
- [ ] Test publisher created successfully
- [ ] Test catalog volume created successfully
- [ ] Contributor-volume link works
- [ ] Display fields auto-generate
- [ ] Full-text search works
- [ ] Promotion workflow works end-to-end

## Troubleshooting

### Migration Fails
- **Error:** Table already exists
  - **Fix:** Run DROP statements again, ensure all CASCADE

- **Error:** Function already exists
  - **Fix:** Add `OR REPLACE` to function definitions (already in migration)

### Search Returns No Results
- **Issue:** Search vectors not populated
  - **Fix:** Trigger updates
    ```sql
    UPDATE books SET updated_at = now();
    UPDATE catalog_volumes SET updated_at = now();
    UPDATE contributors SET updated_at = now();
    ```

### Functions Not Found
- **Issue:** Functions didn't create
  - **Fix:** Check Supabase logs, re-run migration

## Next Steps After Successful Deployment

1. **Update TypeScript Client**
   - Restart dev server to pick up new types
   - Verify no TypeScript errors

2. **Set Up Cloudinary**
   - Create account at cloudinary.com
   - Note your cloud name
   - Create upload preset
   - Add to `.env`:
     ```
     CLOUDINARY_CLOUD_NAME=your-cloud-name
     CLOUDINARY_API_KEY=your-api-key
     CLOUDINARY_API_SECRET=your-api-secret
     NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your-preset
     ```

3. **Set Up Google Cloud Translation**
   - Go to Google Cloud Console
   - Enable Cloud Translation API
   - Create API key
   - Add to `.env`:
     ```
     GOOGLE_CLOUD_TRANSLATION_API_KEY=your-key
     ```

4. **Begin Phase 2 Development**
   - See `IMPLEMENTATION_ROADMAP.md`
   - Start with Contributors Management

## Support

If you encounter issues:
1. Check Supabase logs in dashboard
2. Verify environment variables
3. Review migration SQL for errors
4. Test individual functions in SQL editor

---

**Deployment Date:** _________________  
**Deployed By:** _________________  
**Verification Status:** [ ] Complete

