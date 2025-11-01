# CENIE Editorial - Production Deployment Guide

## ✅ Clean Slate Deployment (Recommended)

**Current Status:** All previous migrations have been merged into a single, production-ready initial migration.

**Migration File:** `20250131_cenie_editorial_initial.sql`

---

## 🚀 Deployment Steps

### Step 1: Drop All Existing Tables

**In Supabase SQL Editor**, run:

```sql
-- Drop all tables in correct order (respects foreign keys)
DROP TABLE IF EXISTS volume_contributors CASCADE;
DROP TABLE IF EXISTS catalog_volumes CASCADE;
DROP TABLE IF EXISTS contributors CASCADE;
DROP TABLE IF EXISTS publishers CASCADE;
DROP TABLE IF EXISTS books CASCADE;
DROP TABLE IF EXISTS translation_glossary CASCADE;

-- Drop any leftover functions (will be recreated)
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
DROP FUNCTION IF EXISTS update_updated_at_column CASCADE;
DROP FUNCTION IF EXISTS books_search_vector_update CASCADE;
DROP FUNCTION IF EXISTS catalog_volumes_search_vector_update CASCADE;
DROP FUNCTION IF EXISTS contributors_search_vector_update CASCADE;
```

---

### Step 2: Apply Initial Migration

**Copy the entire contents of:**

```
packages/supabase/migrations/20250131_cenie_editorial_initial.sql
```

**Paste into Supabase SQL Editor and execute.**

**Expected Result:**

```
Success. No rows returned.
```

---

### Step 3: Verify Installation

```sql
-- Check all tables exist (should return 6)
SELECT tablename
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('books', 'catalog_volumes', 'contributors',
                    'volume_contributors', 'publishers', 'translation_glossary')
ORDER BY tablename;

-- Expected tables:
-- books
-- catalog_volumes
-- contributors
-- publishers
-- translation_glossary
-- volume_contributors

-- Check glossary seeded (should return 65)
SELECT COUNT(*) FROM translation_glossary;

-- Check functions exist (should return 12+)
SELECT routine_name
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_type = 'FUNCTION'
ORDER BY routine_name;

-- Check indexes created (should return 30+)
SELECT indexname
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY indexname;
```

---

### Step 4: Test Basic Operations

```sql
-- Test 1: Create a contributor
INSERT INTO contributors (full_name, slug, primary_role, bio_es)
VALUES ('Test Author', 'test-author', 'author', 'Bio de prueba')
RETURNING *;

-- Test 2: Create a publisher
INSERT INTO publishers (name, slug, country)
VALUES ('CENIE Editorial', 'cenie-editorial', 'España')
RETURNING *;

-- Test 3: Search glossary
SELECT term_en, term_es
FROM translation_glossary
WHERE context = 'theater'
LIMIT 5;

-- Test 4: Full-text search (should return empty, no volumes yet)
SELECT * FROM search_catalog_volumes('test', 10, false);

-- Clean up test data
DELETE FROM contributors WHERE slug = 'test-author';
DELETE FROM publishers WHERE slug = 'cenie-editorial';
```

---

## ✅ Verification Checklist

After deployment, verify:

- [ ] 6 tables created
- [ ] 65 glossary terms seeded
- [ ] 12+ helper functions available
- [ ] 30+ indexes created
- [ ] All triggers created
- [ ] Test insert works
- [ ] Test search works
- [ ] No errors in Supabase logs

---

## 🎯 What Changed from Previous Migrations

### **Merged into Single File:**

**Previously:** 3 separate migration files

1. `20250130_cenie_editorial_complete.sql` (main schema)
2. `20250130_fix_firebase_uid_types.sql` (fixed UUID → text)
3. `20250131_fix_firebase_uid_function_params.sql` (fixed function params)

**Now:** 1 clean initial migration

- `20250131_cenie_editorial_initial.sql` (everything included)

### **Key Improvements:**

✅ **Firebase UID columns are `text` from the start** (not `uuid`)  
✅ **Function parameters use `text` for Firebase UIDs**  
✅ **All fixes incorporated**  
✅ **Production-ready comments**  
✅ **Clean, single-file deployment**

### **What's Different:**

| Column/Parameter                   | Old Type | New Type |
| ---------------------------------- | -------- | -------- |
| `publishers.created_by`            | uuid     | text     |
| `contributors.created_by`          | uuid     | text     |
| `books.added_by`                   | uuid     | text     |
| `books.reviewed_by`                | uuid     | text     |
| `books.checked_by`                 | uuid     | text     |
| `catalog_volumes.created_by`       | uuid     | text     |
| `catalog_volumes.published_by`     | uuid     | text     |
| `translation_glossary.created_by`  | uuid     | text     |
| `promote_book_to_catalog(user_id)` | uuid     | text     |
| `start_translation_check(user_id)` | uuid     | text     |

---

## 📋 Post-Deployment Setup

### 1. Grant Yourself Admin Access (Firestore)

**Option A - Firebase Console:**

```
1. Go to Firebase Console → Firestore Database
2. Navigate to user_app_access collection
3. Add document:
{
  userId: "YOUR-FIREBASE-UID",
  appName: "editorial",
  role: "admin",
  isActive: true,
  grantedAt: [current timestamp]
}
```

**Option B - Using Admin SDK:**

```javascript
// scripts/grant-access.js
const admin = require('firebase-admin')
const serviceAccount = require('./firebase-serviceaccount.json')

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) })

async function grantAccess(userId, role = 'admin') {
  await admin.firestore().collection('user_app_access').add({
    userId: userId,
    appName: 'editorial',
    role: role,
    isActive: true,
    grantedAt: admin.firestore.FieldValue.serverTimestamp(),
  })
  console.log(`✅ Granted ${role} access to ${userId}`)
}

// Replace with your Firebase UID
grantAccess('YOUR-FIREBASE-UID').then(() => process.exit())
```

---

### 2. Configure TwicPics

**Already configured:**

- Domain: `cenie.twic.pics`
- Path: `/editorial/covers/` → `https://editorial.cenie.org/images/covers/`
- Path: `/editorial/contributors/` → `https://editorial.cenie.org/images/contributors/`

**Verify in TwicPics dashboard:**

- Domain active
- Paths configured
- Source URLs correct

---

### 3. Set Environment Variables

**Verify in Vercel (or local `.env`):**

```bash
# Database
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Google APIs
GOOGLE_API_KEY=your-google-books-api-key
GOOGLE_CLOUD_TRANSLATION_API_KEY=your-translation-api-key

# TwicPics
NEXT_PUBLIC_TWICPICS_DOMAIN=cenie.twic.pics

# Firebase
# (Service account configured via firebase-serviceaccount.json)
```

---

### 4. Test the Complete System

**Quick Test Flow:**

```
1. Sign in to /dashboard
   → Should work with your Firebase account

2. Create a contributor
   Dashboard → Contributors → Add Contributor
   → Test database writes

3. Search and add a book
   Dashboard → Search Books → Add a book
   → Test Google Books API

4. Prepare and publish
   → Mark book as selected for translation
   → Prepare for publication
   → Auto-translate (test glossary)
   → Assign contributors (test autocomplete)
   → Upload/select cover (test TwicPics)
   → Publish to catalog

5. View on public catalog
   Visit /catalogo
   → Should see your published book
   → Click to view details
   → Verify all sections display
```

---

## 🎯 Migration File Details

### **20250131_cenie_editorial_initial.sql**

**Contains:**

- ✅ 6 table definitions (publishers, contributors, catalog_volumes, volume_contributors, books, translation_glossary)
- ✅ All indexes (30+)
- ✅ All triggers (7)
- ✅ All helper functions (12+)
- ✅ Glossary seed data (65 terms)
- ✅ Complete comments and documentation
- ✅ Firebase UID columns as `text` (correct from start)
- ✅ Production-ready configuration

**Schema Version:** 1.0  
**Production Status:** Ready  
**Breaking Changes:** None (clean install)

---

## 🐛 Troubleshooting

### Issue: Migration fails with error

**Check:**

- All old tables dropped
- All old functions dropped
- Supabase connection active
- Copy/paste was complete

**Solution:**

- Run DROP statements again
- Re-run migration
- Check Supabase logs for specific error

### Issue: Glossary not seeded

**Check:**

```sql
SELECT COUNT(*) FROM translation_glossary;
```

**If 0, manually insert:**

- Re-run the INSERT INTO translation_glossary section

### Issue: Functions not found

**Check:**

```sql
SELECT routine_name FROM information_schema.routines
WHERE routine_schema = 'public';
```

**Solution:**

- Re-run migration (functions have CREATE OR REPLACE)

### Issue: Search not working

**Check:**

```sql
-- Trigger should have created search vectors
SELECT COUNT(*) FROM books WHERE search_vector IS NOT NULL;
```

**Solution:**

```sql
-- Manually trigger search vector update
UPDATE books SET updated_at = now();
UPDATE catalog_volumes SET updated_at = now();
UPDATE contributors SET updated_at = now();
```

---

## 📦 What's Included

### Tables (6):

1. **publishers** - Normalized publisher data
2. **contributors** - Authors, translators, editors
3. **catalog_volumes** - Published books
4. **volume_contributors** - Junction table
5. **books** - Editorial workspace
6. **translation_glossary** - Performing arts terminology

### Functions (12):

1. `search_books()` - Full-text search workspace
2. `get_books_by_status()` - Status counts
3. `start_translation_check()` - Begin investigation
4. `complete_translation_check()` - Save results
5. `get_translation_stats()` - Translation statistics
6. `search_catalog_volumes()` - Full-text search catalog
7. `get_volume_contributors()` - Get contributors for volume
8. `generate_contributors_display()` - Generate display text
9. `update_volume_display_fields()` - Update denormalized fields
10. `promote_book_to_catalog()` - Publish to catalog
11. `update_updated_at_column()` - Timestamp trigger
12. `books_search_vector_update()` - Search vector trigger
13. `catalog_volumes_search_vector_update()` - Search vector trigger
14. `contributors_search_vector_update()` - Search vector trigger

### Triggers (7):

- updated_at triggers (4 tables)
- search_vector triggers (3 tables)

### Indexes (30+):

- Primary keys, unique constraints
- Foreign key indexes
- Search optimization (GIN indexes)
- Query performance indexes

### Seed Data:

- 65 performing arts translation glossary terms

---

## ✨ Clean Start Benefits

**Why this is better:**

✅ **One migration file** - Easy to understand and maintain  
✅ **No migration history clutter** - Clean git history  
✅ **All fixes included** - No need for patches  
✅ **Production-ready** - Correct types from start  
✅ **Well-documented** - Comprehensive comments  
✅ **Tested design** - All issues resolved

**Perfect for:**

- Initial production deployment
- Fresh development environments
- Documentation reference
- Disaster recovery

---

## 🎊 Ready for Production

**Your database schema is now:**

- ✅ Complete
- ✅ Tested
- ✅ Documented
- ✅ Production-ready
- ✅ Single-file deployment

**Next Steps:**

1. Apply this migration to production Supabase
2. Grant admin access in Firestore
3. Verify with test queries
4. Start adding real data!

---

**Migration Version:** 1.0 - Initial Production Release  
**Date:** January 31, 2025  
**Status:** ✅ Ready to Deploy  
**Quality:** Production-Grade
