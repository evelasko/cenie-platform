# CENIE Editorial - Data Model Reference

## Entity Relationship Overview

```
┌──────────────────────────────────────────────────────────────┐
│                    EDITORIAL WORKSPACE                       │
│                                                              │
│  ┌──────────────┐                                            │
│  │    books     │  ← Discovery & curation of external books  │
│  │              │                                            │
│  │ • Google Ref │  Phase: discovered → selected              │
│  │ • Metadata   │         → in_translation                   │
│  │ • Scores     │         → published                        │
│  │ • Notes      │                                            │
│  └──────┬───────┘                                            │
│         │                                                    │
│         │ promotes to (optional)                             │
│         ↓                                                    │
└─────────┼────────────────────────────────────────────────────┘
          │
          │
┌─────────┼─────────────────────────────────────────────────────┐
│         │            PUBLIC CATALOG                           │
│         ↓                                                     │
│  ┌───────────────────┐                                        │
│  │ catalog_volumes   │  ← Published books (translated,        │
│  │                   │    original, adapted)                  │
│  │ • Spanish Meta    │                                        │
│  │ • Cover (TwicPics)│  Status: draft → published → archived  │
│  │ • Content         │                                        │
│  │ • SEO             │                                        │
│  └────┬──────────────┘                                        │
│       │                                                       │
│       │ has many                                              │
│       ↓                                                       │
│  ┌─────────────────────┐                                      │
│  │ volume_contributors │  ← Links contributors to volumes     │
│  │                     │                                      │
│  │ • role              │  Role: author, translator, editor    │
│  │ • display_order     │                                      │
│  │ • featured          │                                      │
│  └────┬────────────────┘                                      │
│       │                                                       │
└───────┼───────────────────────────────────────────────────────┘
        │
        │ references
        ↓
┌───────────────────────────────────────────────────────────────┐
│               NORMALIZED ENTITIES (Reusable)                  │
│                                                               │
│  ┌──────────────┐      ┌──────────────┐                       │
│  │ contributors │      │  publishers  │                       │
│  │              │      │              │                       │
│  │ • Name       │      │ • Name       │                       │
│  │ • Bio (es/en)│      │ • Country    │                       │
│  │ • Photo (TP) │      │ • Contact    │                       │
│  │ • Role       │      │ • Notes      │                       │
│  └──────────────┘      └──────────────┘                       │
│                                                               │
│  ┌──────────────────────────────────┐                         │
│  │     translation_glossary         │                         │
│  │                                  │                         │
│  │ • term_en → term_es              │  65+ performing arts    │
│  │ • context (theater, dance, etc.) │  terms seeded           │
│  └──────────────────────────────────┘                         │
└───────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────┐
│                    EXTERNAL REFERENCES                        │
│                                                               │
│  ┌──────────────────┐         ┌──────────────────┐            │
│  │ Google Books API │         │     TwicPics     │            │
│  │                  │         │                  │            │
│  │ • Book metadata  │         │ • Cover images   │            │
│  │ • Covers         │         │ • Contributor    │            │
│  │ • Descriptions   │         │   photos (CDN)   │            │
│  └──────────────────┘         └──────────────────┘            │
│                                                               │
│  ┌──────────────────────────────────────┐                     │
│  │  Google Cloud Translation API        │                     │
│  │                                      │                     │
│  │ • Auto-translation                   │                     │
│  │ • Glossary integration (65+ terms)   │                     │
│  └──────────────────────────────────────┘                     │
└───────────────────────────────────────────────────────────────┘
```

## Table Details

### `books` (Editorial Workspace)

**Purpose:** Internal workspace for discovering and preparing books

**Key Fields:**

- `google_books_id` - Reference to Google Books API (unique)
- `status` - Workflow: discovered, under_review, selected, in_translation, published, rejected
- `selected_for_translation` - Boolean flag
- `translated_title` - Spanish title (preparation field)
- `translation_status` - Investigation: not_checked, checking, found, not_found, needs_review
- `promoted_to_catalog` - Whether published to catalog
- `catalog_volume_id` - Link to published volume (if promoted)
- `temp_cover_twicpics_path` - Temporary cover during prep
- `publication_description_es` - Spanish description for catalog

**Relationships:**

- References Google Books API via `google_books_id`
- Optionally promotes to `catalog_volumes` via `catalog_volume_id`

---

### `catalog_volumes` (Public Catalog)

**Purpose:** Published CENIE Editorial volumes visible to public

**Key Fields:**

- `volume_type` - translated | original | adapted
- `publication_status` - draft | published | archived
- `title` - Spanish title (always)
- `description` - Spanish description (always)
- `cover_twicpics_path` - TwicPics image path (e.g., editorial/covers/book-slug.jpg)
- `cover_url` - Generated TwicPics display URL
- `slug` - URL-friendly identifier
- `authors_display` - Denormalized: "García Márquez, Gabriel; Fuentes, Carlos"
- `translator_display` - Denormalized: "Traducido por Julio Cortázar"

**Translation-Specific:**

- `original_title` - English (or source language) title
- `original_google_books_id` - Google Books reference
- `source_book_id` - Link to workspace book (if promoted)
- `translation_year` - When translation published

**Original-Specific:**

- `editorial_team` - JSONB: editors, compilers, contributors

**Common:**

- `table_of_contents` - JSONB structured TOC
- `excerpt` - Sample chapter/section
- `reviews_quotes` - JSONB array of praise
- `categories` - Text array
- `tags` - Text array
- `seo_description`, `seo_keywords` - SEO fields

**Relationships:**

- Has many `volume_contributors`
- References `publishers` via `publisher_id`
- Optionally references `books` via `source_book_id`
- References Google Books via `original_google_books_id`

---

### `contributors` (Normalized People)

**Purpose:** All people involved in publications (authors, translators, editors, etc.)

**Key Fields:**

- `full_name` - Canonical name
- `slug` - URL identifier
- `name_variants` - Alternative spellings
- `primary_role` - author | translator | editor | illustrator | narrator | other
- `bio_es` - Spanish bio
- `bio_en` - English bio (optional)
- `photo_twicpics_path` - TwicPics image path (e.g., editorial/contributors/person-slug.jpg)
- `photo_url` - Generated TwicPics display URL
- `nationality` - Country
- `birth_year`, `death_year` - Dates

**Translator-Specific:**

- `translator_specializations` - ["theater", "poetry"]
- `translator_languages` - ["en-es", "fr-es"]

**Relationships:**

- Linked to `catalog_volumes` via `volume_contributors`

---

### `volume_contributors` (Junction Table)

**Purpose:** Links contributors to catalog volumes with specific roles

**Key Fields:**

- `volume_id` - FK to catalog_volumes
- `contributor_id` - FK to contributors
- `role` - author | translator | editor | illustrator | narrator | foreword | introduction | etc.
- `role_description` - E.g., "Traducido del inglés por"
- `display_order` - For sorting multiple authors
- `is_original_contributor` - True for authors, false for translators

**Constraint:** Unique(volume_id, contributor_id, role)

---

### `publishers` (Normalized Publishers)

**Purpose:** Publisher information with CENIE relationship tracking

**Key Fields:**

- `name` - Publisher name
- `slug` - URL identifier
- `country` - Location
- `website_url` - Publisher website
- `contact_email` - Contact
- `relationship_notes` - CENIE relationship info
- `permissions_contact` - Who to contact for rights

**Relationships:**

- Referenced by `catalog_volumes` via `publisher_id`

---

### `translation_glossary` (Terminology)

**Purpose:** Performing arts terms for consistent auto-translation

**Key Fields:**

- `term_en` - English term (unique)
- `term_es` - Spanish translation
- `context` - theater | dance | music | technical | general
- `category` - Additional categorization
- `usage_count` - Track frequency

**Seeded:** 65+ performing arts terms pre-populated

---

### `user_app_access` (Permissions)

**Purpose:** Firebase user permissions for editorial app

**Key Fields:**

- `user_id` - Firebase UID
- `app_name` - "editorial"
- `role` - admin | editor | viewer
- `is_active` - Boolean

---

## Publication Types

### Type 1: Translated Books

**Workflow:**

```
Google Books API → books (workspace)
  → Investigate translation
  → Mark selected_for_translation
  → Prepare Spanish metadata
  → Upload custom cover
  → Link contributors (author + translator)
  → Promote to catalog_volumes
  → Publish
```

**Key Fields Used:**

- `volume_type = 'translated'`
- `original_title`, `original_google_books_id`
- `source_book_id` (links to workspace)
- Contributor roles: author (original), translator

**Example:**

- Original: "An Actor Prepares" by Stanislavski (English)
- CENIE: "La Preparación del Actor" traducido por Elena Torres
- Catalog shows both original and translation info

---

### Type 2: Original Publications

**Workflow:**

```
Direct to catalog_volumes
  → No Google Books reference
  → Spanish metadata only
  → Upload custom cover
  → Link contributors (author/editor/compiler)
  → Set editorial_team
  → Publish
```

**Key Fields Used:**

- `volume_type = 'original'`
- `editorial_team` (JSONB)
- No `original_*` fields
- No `source_book_id`

**Example:**

- Title: "Técnicas Contemporáneas de Iluminación Teatral"
- Authors: CENIE team or commissioned authors
- No original work reference

---

### Type 3: Adapted Publications

**Workflow:**

```
Optional: books (workspace) reference
  → Direct to catalog_volumes
  → Spanish metadata
  → Reference original loosely
  → Upload custom cover
  → Link contributors (original author + adaptor/editor)
  → Set editorial_team
  → Publish
```

**Key Fields Used:**

- `volume_type = 'adapted'`
- May have `original_title` for reference
- `editorial_team` (who adapted)
- Contributor roles: author (original), editor/compiler (adaptor)

**Example:**

- Original: Classical text on stagecraft
- CENIE: Annotated edition with modern examples
- Shows original attribution + CENIE adaptation info

---

## Data Flow: Discovery to Publication

```
1. DISCOVERY
   ↓
   Search Google Books API
   ↓
   Add to books table (status: discovered)

2. CURATION
   ↓
   Review metadata
   ↓
   Update status: under_review
   ↓
   Investigate translation (check if Spanish version exists)
   ↓
   Evaluate scores (marketability, relevance)
   ↓
   Decision: selected / rejected

3. PREPARATION (if selected_for_translation = true)
   ↓
   Enter "Prepare for Publication" workflow
   ↓
   Auto-translate title, description (with glossary)
   ↓
   Manual refinement
   ↓
   Upload custom cover (Cloudinary)
   ↓
   Create/link contributors (author, translator)
   ↓
   Structure table of contents
   ↓
   Add excerpt

4. PUBLICATION
   ↓
   Validate required fields
   ↓
   Call promote_book_to_catalog() function
   ↓
   Creates catalog_volumes record
   ↓
   Links contributors via volume_contributors
   ↓
   Sets publication_status = 'draft'
   ↓
   Review in catalog management
   ↓
   Change status to 'published'

5. PUBLIC DISPLAY
   ↓
   Appears in /catalogo
   ↓
   Accessible via /catalogo/[slug]
   ↓
   SEO-optimized detail page
   ↓
   Shows contributors, content, reviews
```

---

## Search & Discovery

### Full-Text Search Vectors

**books table:**

- Title (weight A)
- Translated title (weight A)
- Spanish title (weight A)
- Authors (weight B)
- Subtitle (weight C)

**catalog_volumes table:**

- Title (weight A)
- Authors display (weight A)
- Subtitle (weight B)
- Description (weight C)
- Tags (weight C)

**contributors table:**

- Full name (weight A)
- Name variants (weight B)
- Bio (weight C)

### Helper Functions

**Search:**

- `search_books(query, limit)` - Workspace search
- `search_catalog_volumes(query, limit, only_published)` - Catalog search

**Contributors:**

- `get_volume_contributors(volume_id)` - All contributors for a volume
- `generate_contributors_display(volume_id, role)` - Display text
- `update_volume_display_fields(volume_id)` - Refresh denormalized fields

**Workflow:**

- `promote_book_to_catalog(book_id, data, user_id)` - Publish to catalog
- `start_translation_check(book_id, user_id)` - Begin investigation
- `complete_translation_check(...)` - Save investigation results

---

## TwicPics Integration

### Image Storage Pattern

**Files stored in:** `public/images/covers/` and `public/images/contributors/`  
**Deployed to:** `https://editorial.cenie.org/images/...`  
**TwicPics fetches from:** Editorial app deployment  
**TwicPics serves via:** `https://cenie.twic.pics/`

**Contributor Photos:**

```
Local: public/images/contributors/elena-torres.jpg
Database: photo_twicpics_path = "editorial/contributors/elena-torres.jpg"
Display URL: https://cenie.twic.pics/editorial/contributors/elena-torres.jpg?twic=v1/cover=200x200/focus=faces
```

**Catalog Volume Covers:**

```
Local: public/images/covers/stanislavski-actor.jpg
Database: cover_twicpics_path = "editorial/covers/stanislavski-actor.jpg"
Display URL: https://cenie.twic.pics/editorial/covers/stanislavski-actor.jpg?twic=v1/cover=400x600
```

### File Naming Convention

**Slug-based naming:**

- Covers: `{publication-slug}.{ext}` (e.g., `stanislavski-actor-prepares.jpg`)
- Contributors: `{contributor-slug}.{ext}` (e.g., `elena-torres.jpg`)

**Benefits:**

- Human-readable filenames
- Unique per publication/contributor
- Easy to find and manage
- Overwrite behavior (update = replace file)
- Git-friendly

### TwicPics Transformations

**Book Covers:**

- Thumbnail: `?twic=v1/cover=200x300`
- Medium: `?twic=v1/cover=400x600`
- Large: `?twic=v1/cover=800x1200`

**Contributor Photos:**

- Avatar: `?twic=v1/cover=200x200/focus=faces` (circular, face-focused)
- Profile: `?twic=v1/cover=400x400`

**Auto-optimizations:**

- Quality: Automatic
- Format: Auto WebP for modern browsers
- Caching: TwicPics CDN handles caching

---

## Summary

**Total Tables:** 7  
**Total Functions:** 15+  
**Total Indexes:** 30+  
**Glossary Terms:** 65+ (seeded)

**Relationships:**

- 1 book → 0 or 1 catalog_volume
- 1 catalog_volume → many volume_contributors → many contributors
- 1 catalog_volume → 0 or 1 publisher
- 1 contributor → many volume_contributors → many catalog_volumes

**Publication Types:** 3 (translated, original, adapted)  
**Workflow Statuses:** 6 (discovered → published)  
**Catalog Statuses:** 3 (draft → published → archived)

---

**Version:** 1.0 - Production Release  
**Last Updated:** January 31, 2025  
**Schema File:** `20250131_cenie_editorial_initial.sql`  
**Status:** ✅ Production Ready
