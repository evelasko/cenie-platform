# CENIE Editorial - Database Migrations

## Current Schema: `20250130_cenie_editorial_complete.sql`

This is the complete, production-ready schema for the CENIE Editorial publications management system.

## Migration Instructions

### Fresh Installation

1. **Connect to your Supabase project** via SQL Editor or Supabase CLI

2. **Drop existing tables** (if testing data exists):
```sql
DROP TABLE IF EXISTS volume_contributors CASCADE;
DROP TABLE IF EXISTS catalog_volumes CASCADE;
DROP TABLE IF EXISTS contributors CASCADE;
DROP TABLE IF EXISTS publishers CASCADE;
DROP TABLE IF EXISTS book_reviews CASCADE;
DROP TABLE IF EXISTS book_tags CASCADE;
DROP TABLE IF EXISTS books CASCADE;
DROP TABLE IF EXISTS translation_glossary CASCADE;
DROP TABLE IF EXISTS user_app_access CASCADE;
```

3. **Run the migration**:
```bash
# Using Supabase CLI
supabase db reset

# Or manually in SQL Editor
# Copy and paste contents of 20250130_cenie_editorial_complete.sql
```

4. **Verify installation**:
```sql
-- Check tables exist
SELECT tablename FROM pg_tables WHERE schemaname = 'public';

-- Check glossary was seeded
SELECT COUNT(*) FROM translation_glossary;
-- Should return ~65 entries
```

### Grant Access to Admin User

After migration, grant yourself admin access:

```sql
-- Replace 'your-firebase-uid-here' with your actual Firebase UID
SELECT grant_editorial_access('your-firebase-uid-here', 'admin');
```

## Schema Overview

### Core Tables

1. **`books`** - Editorial workspace for discovering and curating books
2. **`catalog_volumes`** - Published books visible in public catalog
3. **`contributors`** - Authors, translators, editors (normalized)
4. **`volume_contributors`** - Junction table linking contributors to volumes
5. **`publishers`** - Publisher information (normalized)
6. **`translation_glossary`** - Performing arts terminology for auto-translation
7. **`user_app_access`** - User permissions

### Key Features

- **Dual-table design**: Separate workspace (books) from catalog (catalog_volumes)
- **Normalized contributors**: One record per person, reusable across volumes
- **Cloudinary-ready**: Image fields for covers and photos
- **Full-text search**: On books, volumes, and contributors
- **Translation workflow**: Investigation and promotion to catalog
- **Three publication types**: Translated, original, adapted
- **SEO-optimized**: Slugs, descriptions, keywords

## Helper Functions

The migration includes several helper functions:

### Books Workspace
- `search_books(query, limit)` - Full-text search
- `get_books_by_status()` - Status counts
- `start_translation_check(book_id, user_id)` - Begin investigation
- `complete_translation_check(...)` - Save investigation results
- `get_translation_stats()` - Translation statistics

### Catalog Volumes
- `search_catalog_volumes(query, limit, only_published)` - Search catalog
- `get_volume_contributors(volume_id)` - Get all contributors for volume
- `generate_contributors_display(volume_id, role)` - Generate display text
- `update_volume_display_fields(volume_id)` - Update denormalized fields
- `promote_book_to_catalog(book_id, catalog_data, user_id)` - Publish to catalog

### User Management
- `grant_editorial_access(user_id, role)` - Grant access to user

## Usage Examples

### Add a Book to Workspace
```typescript
const { data, error } = await supabase
  .from('books')
  .insert({
    google_books_id: 'abc123',
    title: 'Acting Technique',
    authors: ['Stanislavski'],
    status: 'discovered'
  })
```

### Create a Contributor
```typescript
const { data, error } = await supabase
  .from('contributors')
  .insert({
    full_name: 'Constantin Stanislavski',
    slug: 'constantin-stanislavski',
    primary_role: 'author',
    bio_es: 'Maestro del teatro ruso...'
  })
```

### Promote Book to Catalog
```sql
SELECT promote_book_to_catalog(
  'book-uuid',
  '{
    "title": "Técnica de Actuación",
    "description": "Un texto fundamental...",
    "categories": ["teatro", "actuación"],
    "slug": "tecnica-actuacion-stanislavski"
  }'::jsonb,
  'admin-firebase-uid'
);
```

### Link Contributor to Volume
```typescript
const { data, error } = await supabase
  .from('volume_contributors')
  .insert({
    volume_id: 'volume-uuid',
    contributor_id: 'contributor-uuid',
    role: 'author',
    display_order: 0,
    is_original_contributor: true
  })

// Then update display fields
await supabase.rpc('update_volume_display_fields', { 
  volume_uuid: 'volume-uuid' 
})
```

### Search Catalog
```sql
-- Full-text search
SELECT * FROM search_catalog_volumes('stanislavski', 10, true);

-- Filter by type
SELECT * FROM catalog_volumes 
WHERE volume_type = 'translated' 
  AND publication_status = 'published'
ORDER BY published_at DESC;
```

## Cloudinary Integration

Store Cloudinary public IDs in the database:

```typescript
// After uploading to Cloudinary
const cloudinaryId = uploadResult.public_id

// Store in contributor
await supabase
  .from('contributors')
  .update({ 
    photo_cloudinary_id: cloudinaryId,
    photo_url: `https://res.cloudinary.com/${cloud}/image/upload/c_fill,w_200,h_200/${cloudinaryId}`
  })
  .eq('id', contributorId)

// Store in catalog volume
await supabase
  .from('catalog_volumes')
  .update({ 
    cover_cloudinary_id: cloudinaryId,
    cover_url: `https://res.cloudinary.com/${cloud}/image/upload/c_fill,w_400,h_600/${cloudinaryId}`
  })
  .eq('id', volumeId)
```

## Translation Glossary Usage

The glossary is pre-seeded with ~65 performing arts terms. Use it for consistent translations:

```typescript
// Lookup term
const { data } = await supabase
  .from('translation_glossary')
  .select('term_es')
  .eq('term_en', 'stage')
  .single()

// Returns: { term_es: 'escenario' }

// Add new term
await supabase
  .from('translation_glossary')
  .insert({
    term_en: 'backstage',
    term_es: 'entre bastidores',
    context: 'theater',
    category: 'technical'
  })
```

## Troubleshooting

### Function Not Found
If helper functions don't work:
```sql
-- Re-run the migration or specific function definitions
```

### Search Not Working
If full-text search returns no results:
```sql
-- Rebuild search vectors
UPDATE books SET updated_at = now();
UPDATE catalog_volumes SET updated_at = now();
UPDATE contributors SET updated_at = now();
```

### Permissions Issues
Ensure RLS is disabled (it should be by default):
```sql
ALTER TABLE books DISABLE ROW LEVEL SECURITY;
ALTER TABLE catalog_volumes DISABLE ROW LEVEL SECURITY;
-- etc.
```

## Next Steps

After running this migration:

1. Grant yourself admin access (see above)
2. Test basic CRUD operations
3. Add a test book to workspace
4. Create a test contributor
5. Promote book to catalog
6. Verify catalog query works

Then proceed to **Phase 2: Dashboard UI Implementation**

---

**Migration Version:** 20250130_cenie_editorial_complete  
**Schema Status:** Production Ready  
**Last Updated:** January 30, 2025
