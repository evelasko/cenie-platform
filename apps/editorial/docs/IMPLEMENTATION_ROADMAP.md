# CENIE Editorial - Implementation Roadmap

## Overview

This document outlines the complete implementation plan for the CENIE Editorial publications management system, from database schema (complete) through public catalog launch.

**Current Status:** ✅ Phase 1 Complete - Database Schema Ready

---

## Phase 1: Database & Core Architecture ✅ COMPLETE

**Duration:** Complete  
**Status:** Ready for deployment

### Deliverables ✅

- [x] Complete database schema migration
- [x] `catalog_volumes` table (published books)
- [x] `contributors` table (authors, translators, editors)
- [x] `volume_contributors` junction table
- [x] `publishers` table (normalized)
- [x] Enhanced `books` table (workspace)
- [x] `translation_glossary` table with seed data
- [x] All indexes and constraints
- [x] Helper functions for workflows
- [x] TypeScript type definitions
- [x] Migration documentation

### Next Action

Deploy migration to Supabase and grant admin access.

---

## Phase 2: Editorial Workflow Tools 🔄 NEXT

**Duration:** 2-3 weeks  
**Goal:** Empower editorial team to prepare publications efficiently

### 2.1 Contributors Management (Week 1)

**UI Components:**

- [ ] Contributors list page (`/dashboard/contributors`)
  - Table view with search/filter
  - Quick create button
  - Edit/delete actions
- [ ] Contributor detail page (`/dashboard/contributors/[id]`)
  - Full profile form
  - Photo upload (Cloudinary)
  - Bio editor (Spanish/English)
  - Translation specializations
- [ ] Contributor autocomplete component
  - Reusable for book/volume forms
  - Create-on-the-fly option
  - Search by name/slug

**API Routes:**

- [ ] `GET /api/contributors` - List with search
- [ ] `POST /api/contributors` - Create new
- [ ] `GET /api/contributors/[id]` - Get details
- [ ] `PATCH /api/contributors/[id]` - Update
- [ ] `DELETE /api/contributors/[id]` - Soft delete
- [ ] `GET /api/contributors/search?q=` - Autocomplete

**Cloudinary Integration:**

- [ ] Upload widget for contributor photos
- [ ] Image transformation templates
- [ ] Storage of public_id in database

### 2.2 "Prepare for Publication" Interface (Week 1-2)

**UI Enhancement:**

- [ ] New "Prepare for Publication" tab on book detail page
  - Available when `selected_for_translation = true`
  - Wizard-style multi-step form

**Step 1: Spanish Metadata**

- [ ] Title translation field with auto-translate button
- [ ] Subtitle translation
- [ ] Description translation (rich text editor)
- [ ] Auto-translate integration (Google Cloud Translation API)
- [ ] Glossary integration (highlight substituted terms)
- [ ] Manual refinement workflow

**Step 2: Contributors Assignment**

- [ ] Original author(s) autocomplete
- [ ] Translator autocomplete
- [ ] Editor/compiler (if applicable)
- [ ] Display order management

**Step 3: Cover & Content**

- [ ] Cover upload (Cloudinary)
- [ ] Table of contents editor (structured JSON)
- [ ] Excerpt upload/editor
- [ ] Preview of catalog display

**Step 4: Publication Details**

- [ ] ISBN assignment
- [ ] Publication year
- [ ] Categories/tags selection
- [ ] SEO metadata (description, keywords)
- [ ] Slug generation (auto from title, editable)

**Step 5: Review & Publish**

- [ ] Validation checklist
- [ ] Preview catalog entry
- [ ] "Publish to Catalog" button
- [ ] Confirmation dialog

**API Routes:**

- [ ] `POST /api/books/[id]/auto-translate` - Auto-translate text
- [ ] `POST /api/books/[id]/promote` - Promote to catalog
- [ ] `POST /api/upload/cover` - Cloudinary cover upload

### 2.3 Auto-Translation System (Week 2)

**Google Cloud Translation API Integration:**

- [ ] Set up Google Cloud project
- [ ] Enable Translation API
- [ ] Configure API credentials
- [ ] Rate limiting implementation

**Glossary Integration:**

- [ ] Load glossary on translation request
- [ ] Pre-process text with glossary terms
- [ ] Post-process API response
- [ ] Highlight glossary-substituted terms in UI
- [ ] Track usage statistics

**Translation Workflow:**

- [ ] Input text → Check glossary → API call → Post-process → Return
- [ ] Show confidence level
- [ ] Allow manual override
- [ ] Save translation to preparation fields

**API Routes:**

- [ ] `POST /api/translate` - Translate text with glossary
- [ ] `GET /api/glossary` - Get all glossary terms
- [ ] `POST /api/glossary` - Add glossary term
- [ ] `PATCH /api/glossary/[id]` - Update term

### 2.4 Cover Management System (Week 2)

**Cloudinary Setup:**

- [ ] Configure Cloudinary account
- [ ] Set upload presets
- [ ] Define transformation templates
  - Thumbnail: 200x300, quality auto
  - Medium: 400x600, quality auto
  - Large: 800x1200, quality auto

**Upload Workflow:**

- [ ] Drag-and-drop upload widget
- [ ] Image preview before save
- [ ] Automatic transformation on upload
- [ ] Store public_id in database
- [ ] Generate display URLs with transformations

**UI Components:**

- [ ] Cover upload component (reusable)
- [ ] Cover preview with multiple sizes
- [ ] Fallback to Google Books thumbnail
- [ ] Replace cover functionality

**Template System (Future):**

- [ ] CENIE branded overlay template
- [ ] Consistent border/style
- [ ] Logo placement options

### 2.5 Catalog Management Dashboard (Week 2-3)

**UI Components:**

- [ ] Catalog volumes list page (`/dashboard/catalog`)
  - Filter by status (draft/published/archived)
  - Filter by type (translated/original/adapted)
  - Search functionality
  - Bulk actions (feature/unfeature, archive)
- [ ] Volume detail/edit page (`/dashboard/catalog/[id]`)
  - Full metadata editing
  - Contributors management
  - Publication status toggle
  - Preview button
- [ ] "Create Original Publication" page
  - Form for CENIE original books
  - No Google Books reference
  - Direct catalog creation workflow

**API Routes:**

- [ ] `GET /api/catalog` - List volumes (admin view)
- [ ] `POST /api/catalog` - Create volume directly
- [ ] `GET /api/catalog/[id]` - Get volume details
- [ ] `PATCH /api/catalog/[id]` - Update volume
- [ ] `DELETE /api/catalog/[id]` - Archive volume
- [ ] `POST /api/catalog/[id]/publish` - Change status to published
- [ ] `POST /api/catalog/[id]/contributors` - Link contributor

### 2.6 Publishers Management (Week 3)

**Simple Implementation:**

- [ ] Publishers list page (`/dashboard/publishers`)
- [ ] Create/edit publisher form
- [ ] Link publisher to volumes
- [ ] Basic contact information

**API Routes:**

- [ ] `GET /api/publishers` - List
- [ ] `POST /api/publishers` - Create
- [ ] `PATCH /api/publishers/[id]` - Update

---

## Phase 3: Public Catalog Frontend 📅 UPCOMING

**Duration:** 1-2 weeks  
**Goal:** Launch public-facing catalog

### 3.1 Catalog Landing Page

**Route:** `/catalogo`

**Features:**

- [ ] Grid layout of published volumes
- [ ] Cover images (Cloudinary optimized)
- [ ] Basic metadata (title, author, year)
- [ ] Filtering sidebar
  - By category
  - By year
  - By type (translated/original)
- [ ] Search bar (full-text)
- [ ] Pagination
- [ ] Featured volumes section
- [ ] Responsive design (mobile-first)

**API Routes:**

- [ ] `GET /api/public/catalog` - List published volumes
- [ ] `GET /api/public/catalog/search?q=` - Search

### 3.2 Volume Detail Pages

**Route:** `/catalogo/[slug]`

**Features:**

- [ ] Hero section with cover
- [ ] Full metadata display
- [ ] Authors/translators with bios
- [ ] Table of contents
- [ ] Excerpt preview
- [ ] Reviews/praise quotes
- [ ] Original work information (if translated)
- [ ] Related volumes section
- [ ] Share buttons
- [ ] Purchase/access CTA

**API Routes:**

- [ ] `GET /api/public/catalog/[slug]` - Volume details
- [ ] `GET /api/public/catalog/[slug]/related` - Related volumes

### 3.3 SEO Optimization

**Implementation:**

- [ ] Dynamic meta tags (title, description)
- [ ] Open Graph tags
- [ ] Twitter Card tags
- [ ] Schema.org structured data (Book schema)
- [ ] Canonical URLs
- [ ] Sitemap generation
- [ ] robots.txt configuration

### 3.4 Performance Optimization

**Implementation:**

- [ ] Image optimization (Cloudinary auto-format)
- [ ] Lazy loading
- [ ] Server-side rendering (SSR)
- [ ] Static generation for stable pages
- [ ] Cache headers
- [ ] CDN integration

---

## Phase 4: Advanced Features 📅 FUTURE

**Duration:** Ongoing  
**Goal:** Enhance functionality and user experience

### 4.1 Author/Translator Pages

**Routes:**

- `/catalogo/autores/[slug]` - Author portfolio
- `/catalogo/traductores/[slug]` - Translator portfolio

**Features:**

- [ ] Contributor bio and photo
- [ ] Complete bibliography
- [ ] Filter by role (author/translator)
- [ ] Social media links

### 4.2 Advanced Search & Filtering

**Features:**

- [ ] Faceted search
- [ ] Multi-category filtering
- [ ] Date range filtering
- [ ] Full-text search with highlighting
- [ ] Search suggestions
- [ ] Recent searches

### 4.3 Related Volumes Algorithm

**Implementation:**

- [ ] Category similarity
- [ ] Author/translator connections
- [ ] Topic modeling
- [ ] Manual curation override

### 4.4 Analytics & Insights

**Dashboard:**

- [ ] Most viewed volumes
- [ ] Popular searches
- [ ] Category distribution
- [ ] Translation pipeline metrics
- [ ] User engagement stats

### 4.5 Reader Reviews System

**Features:**

- [ ] Reader reviews and ratings
- [ ] Moderation workflow
- [ ] Helpful votes
- [ ] Verified purchase badges

### 4.6 Series/Collections Management

**Features:**

- [ ] Series table
- [ ] Volume ordering within series
- [ ] Series pages
- [ ] Auto-navigation (previous/next)

### 4.7 Content Management Enhancements

**Features:**

- [ ] Version history for volumes
- [ ] Draft previews (shareable links)
- [ ] Scheduled publishing
- [ ] Bulk import/export
- [ ] Collaboration tools (comments, assignments)

---

## Technical Stack

### Frontend

- **Framework:** Next.js 14+ (App Router)
- **Styling:** Tailwind CSS
- **UI Components:** Custom components (existing CENIE UI library)
- **State Management:** React hooks, Server Components
- **Forms:** React Hook Form + Zod validation

### Backend

- **Database:** Supabase (PostgreSQL)
- **Auth:** Firebase Auth
- **Storage:** Cloudinary (images)
- **API:** Next.js API Routes (App Router)
- **Translation:** Google Cloud Translation API

### DevOps

- **Hosting:** Vercel
- **Monitoring:** Vercel Analytics
- **Error Tracking:** (TBD)
- **CI/CD:** GitHub Actions + Vercel

---

## Environment Variables Required

### Phase 2 Requirements

```bash
# Existing
GOOGLE_API_KEY=<google-books-api-key>
NEXT_PUBLIC_SUPABASE_URL=<supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<supabase-anon-key>

# New for Phase 2
TWICPICS_DOMAIN=<your-domain>.twic.pics
NEXT_PUBLIC_TWICPICS_DOMAIN=<your-domain>.twic.pics

GOOGLE_CLOUD_TRANSLATION_API_KEY=<google-translation-api-key>
```

---

## Success Metrics

### Phase 2 (Editorial Tools)

- Time to prepare book for publication < 30 minutes
- Auto-translation accuracy > 80% (with glossary)
- Cover upload success rate > 95%
- Zero data loss in promotion workflow

### Phase 3 (Public Catalog)

- Page load time < 2 seconds
- Mobile responsiveness score > 90
- SEO score > 90
- Catalog search results relevance > 85%

### Phase 4 (Advanced Features)

- User engagement time > 5 minutes per session
- Related volumes click-through rate > 15%
- Search success rate > 80%

---

## Risk Mitigation

### Technical Risks

1. **Cloudinary quota limits**
   - Mitigation: Monitor usage, implement fallbacks

2. **Translation API costs**
   - Mitigation: Cache translations, use glossary extensively

3. **Database performance at scale**
   - Mitigation: Proper indexing (done), query optimization

4. **Google Books API rate limits**
   - Mitigation: Aggressive caching, workspace separation

### Process Risks

1. **Data migration errors**
   - Mitigation: Fresh install, thorough testing

2. **User adoption**
   - Mitigation: Clear documentation, training

---

## Next Immediate Steps

1. **Deploy Database Migration**

   ```bash
   # In Supabase SQL Editor
   # Run: packages/supabase/migrations/20250130_cenie_editorial_complete.sql
   ```

2. **Grant Admin Access**

   ```sql
   SELECT grant_editorial_access('your-firebase-uid', 'admin');
   ```

3. **Set Up Cloudinary**
   - Create account
   - Configure upload preset
   - Add credentials to .env

4. **Set Up Google Cloud Translation**
   - Create project
   - Enable Translation API
   - Create API key
   - Add to .env

5. **Begin Phase 2.1: Contributors Management**
   - Create API routes
   - Build UI components
   - Test CRUD operations

---

**Last Updated:** January 30, 2025  
**Current Phase:** Phase 2 Ready to Start  
**Next Milestone:** Contributors Management (1 week)
