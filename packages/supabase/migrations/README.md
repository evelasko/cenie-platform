# CENIE Editorial - Database Migrations

## Current Migration: `20250131_cenie_editorial_initial.sql`

**This is the single, production-ready initial migration** for the CENIE Editorial publications management system.

All previous migration iterations have been merged into this clean, comprehensive file.

---

## Migration Overview

### **What's Included:**

- **6 Tables:** publishers, contributors, catalog_volumes, volume_contributors, books, translation_glossary
- **30+ Indexes:** Optimized for search and performance
- **12+ Functions:** Workflow automation and search
- **7 Triggers:** Auto-updates for timestamps and search vectors
- **65 Glossary Terms:** Performing arts terminology seeded
- **Complete Documentation:** Inline comments throughout

### **Schema Version:** 1.0 - Production Release

### **Status:** ✅ Production Ready

---

## Quick Deployment

### Step 1: Drop Existing Data (if any)

```sql
DROP TABLE IF EXISTS volume_contributors CASCADE;
DROP TABLE IF EXISTS catalog_volumes CASCADE;
DROP TABLE IF EXISTS contributors CASCADE;
DROP TABLE IF EXISTS publishers CASCADE;
DROP TABLE IF EXISTS books CASCADE;
DROP TABLE IF EXISTS translation_glossary CASCADE;
```

### Step 2: Run Migration

Copy and paste entire contents of `20250131_cenie_editorial_initial.sql` into Supabase SQL Editor and execute.

### Step 3: Verify

```sql
-- Should return 6 tables
SELECT COUNT(*) FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('books', 'catalog_volumes', 'contributors',
                     'volume_contributors', 'publishers', 'translation_glossary');

-- Should return 65
SELECT COUNT(*) FROM translation_glossary;
```

---

## Schema Documentation

For detailed schema information, see:

- **[DATA_MODEL.md](../DATA_MODEL.md)** - Complete data model reference
- **[PRODUCTION_DEPLOYMENT.md](../PRODUCTION_DEPLOYMENT.md)** - Deployment guide

---

## Key Features

### Dual-Table Architecture:

- `books` - Editorial workspace (internal)
- `catalog_volumes` - Public catalog (external)

### Normalized Entities:

- `contributors` - Reusable across all publications
- `publishers` - Normalized publisher information

### Publication Types:

- **Translated** - Books translated by CENIE
- **Original** - CENIE-authored publications
- **Adapted** - Annotated/compiled editions

### Advanced Features:

- Full-text search (PostgreSQL tsvector)
- Auto-translation support (glossary integration)
- Image CDN ready (TwicPics paths)
- SEO optimized (slug-based URLs)
- Audit trails (created_by, updated_at, etc.)

---

## Firebase Integration

**Important:** User permissions (user_app_access) are managed in **Firestore**, not Supabase.

All `*_by` columns store Firebase UIDs as `text` format:

- `added_by`, `reviewed_by`, `checked_by` (books table)
- `created_by` (all tables)
- `published_by` (catalog_volumes table)

**Firebase UID format:** Base64 string (e.g., `G5OJ6W4a5AhnGz31tadqpmdYvJ93`)  
**NOT UUID format:** ~~`123e4567-e89b-12d3-a456-426614174000`~~

---

## Migration History

| Date             | Migration                                         | Description                                   | Status     |
| ---------------- | ------------------------------------------------- | --------------------------------------------- | ---------- |
| **Jan 31, 2025** | `20250131_cenie_editorial_initial.sql`            | Initial production release (all fixes merged) | ✅ Current |
| ~~Jan 30, 2025~~ | ~~20250130_cenie_editorial_complete.sql~~         | Original schema                               | Superseded |
| ~~Jan 30, 2025~~ | ~~20250130_fix_firebase_uid_types.sql~~           | Firebase UID fix                              | Merged     |
| ~~Jan 31, 2025~~ | ~~20250131_fix_firebase_uid_function_params.sql~~ | Function params fix                           | Merged     |

**Current Strategy:** Single comprehensive migration for clean production deployment.

---

## Support

For detailed information:

- **Deployment:** See [PRODUCTION_DEPLOYMENT.md](../PRODUCTION_DEPLOYMENT.md)
- **Data Model:** See [DATA_MODEL.md](../DATA_MODEL.md)
- **Troubleshooting:** Check Supabase logs and error messages

---

**Last Updated:** January 31, 2025  
**Migration File:** `20250131_cenie_editorial_initial.sql`  
**Schema Version:** 1.0  
**Status:** ✅ Production Ready
