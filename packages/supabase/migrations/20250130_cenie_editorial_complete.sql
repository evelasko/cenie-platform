-- =====================================================
-- CENIE Editorial - Complete Publications Management System
-- Migration: 20250130_cenie_editorial_complete
-- Description: Complete schema for managing editorial workspace and public catalog
-- Note: RLS disabled - authorization handled at application layer via Firebase Auth
-- =====================================================

-- =====================================================
-- EXTENSIONS
-- =====================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For fuzzy text search

-- =====================================================
-- NOTE: User permissions are managed in Firestore
-- =====================================================
-- user_app_access is stored in Firestore (Firebase)
-- Authorization checks happen at API layer via Firestore queries
-- This keeps a single source of truth for permissions

-- =====================================================
-- PUBLISHERS TABLE
-- =====================================================
-- Stores publisher information (normalized)
CREATE TABLE IF NOT EXISTS publishers (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Identity
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  
  -- Contact & Info
  country text,
  website_url text,
  contact_email text,
  
  -- CENIE relationship metadata (for future use)
  relationship_notes text,
  permissions_contact text,
  
  -- Metadata
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid  -- Firebase UID
);

CREATE INDEX idx_publishers_slug ON publishers(slug);
CREATE INDEX idx_publishers_active ON publishers(is_active) WHERE is_active = true;

COMMENT ON TABLE publishers IS 'Normalized publisher information with CENIE relationship metadata';

-- =====================================================
-- CONTRIBUTORS TABLE
-- =====================================================
-- Stores all people involved in publications (authors, translators, editors, etc.)
CREATE TABLE IF NOT EXISTS contributors (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Identity
  full_name text NOT NULL,
  slug text UNIQUE NOT NULL,
  name_variants text[],  -- Alternative spellings/formats
  
  -- Type & Specialization
  primary_role text NOT NULL CHECK (
    primary_role IN ('author', 'translator', 'editor', 'illustrator', 'narrator', 'other')
  ),
  
  -- Bio (multilingual support)
  bio_es text,  -- Spanish bio (primary)
  bio_en text,  -- English bio (if available)
  
  -- Media (TwicPics)
  photo_twicpics_path text,
  photo_url text,  -- Generated TwicPics URL
  
  -- Background
  nationality text,
  birth_year integer,
  death_year integer,  -- Nullable for living contributors
  
  -- External Links
  website_url text,
  social_media jsonb,  -- {"twitter": "@user", "instagram": "@user"}
  
  -- For Translators (specific fields)
  translator_specializations text[],  -- ["theater", "poetry", "literary fiction"]
  translator_languages text[],  -- ["en-es", "fr-es"] (source-target pairs)
  
  -- SEO & Discovery
  seo_description text,
  keywords text[],
  
  -- Metadata
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid,  -- Firebase UID
  
  -- Full-text search
  search_vector tsvector
);

-- Indexes for contributors
CREATE INDEX idx_contributors_slug ON contributors(slug);
CREATE INDEX idx_contributors_role ON contributors(primary_role);
CREATE INDEX idx_contributors_active ON contributors(is_active) WHERE is_active = true;
CREATE INDEX idx_contributors_search ON contributors USING GIN(search_vector);

COMMENT ON TABLE contributors IS 'All people involved in publications: authors, translators, editors, etc.';
COMMENT ON COLUMN contributors.photo_twicpics_path IS 'TwicPics image path for contributor photo';
COMMENT ON COLUMN contributors.translator_languages IS 'Language pairs in format: source-target (e.g., en-es, fr-es)';

-- =====================================================
-- CATALOG VOLUMES TABLE
-- =====================================================
-- Published CENIE Editorial volumes visible in public catalog
CREATE TABLE IF NOT EXISTS catalog_volumes (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Publication Type
  volume_type text NOT NULL DEFAULT 'translated' CHECK (
    volume_type IN ('translated', 'original', 'adapted')
  ),
  publication_status text NOT NULL DEFAULT 'draft' CHECK (
    publication_status IN ('draft', 'published', 'archived')
  ),
  
  -- Universal Metadata (always present)
  title text NOT NULL,  -- Spanish title
  subtitle text,  -- Spanish subtitle
  description text NOT NULL,  -- Public-facing description (Spanish)
  
  -- Publishing Info
  publisher_id uuid REFERENCES publishers(id) ON DELETE SET NULL,  -- CENIE or other publisher
  publisher_name text DEFAULT 'CENIE Editorial',  -- Denormalized for display
  publication_year integer,
  isbn_13 varchar(13),
  isbn_10 varchar(10),
  language varchar(10) DEFAULT 'es',
  page_count integer,
  
  -- Cover Image (TwicPics)
  cover_twicpics_path text,  -- TwicPics image path
  cover_url text,  -- Generated TwicPics URL
  cover_fallback_url text,  -- Fallback (e.g., Google Books for translated)
  
  -- Catalog Organization
  categories text[],  -- Performing arts categories
  tags text[],  -- Searchable keywords
  featured boolean DEFAULT false,
  display_order integer,  -- For manual ordering
  
  -- Content Previews
  table_of_contents jsonb,  -- Structured TOC
  excerpt text,  -- Sample chapter/section
  reviews_quotes jsonb,  -- Array of praise/reviews: [{"text": "...", "source": "..."}]
  
  -- Display Text (denormalized for performance)
  authors_display text,  -- Generated: "García Márquez, Gabriel; Fuentes, Carlos"
  translator_display text,  -- Generated: "Traducido por Julio Cortázar"
  
  -- Translation-Specific Fields (when volume_type = 'translated')
  original_language varchar(10),
  original_title text,
  original_publisher text,
  original_publication_year integer,
  original_isbn_13 varchar(13),
  original_isbn_10 varchar(10),
  original_google_books_id varchar(255),  -- Reference to Google Books
  
  -- Reference to workspace book (if originated there)
  source_book_id uuid,  -- FK to books table (nullable - allows direct catalog creation)
  
  -- Translation Credits
  translation_year integer,
  translation_notes text,
  
  -- Rights Information (for translated works)
  translation_rights_holder text,
  translation_rights_expiry date,
  rights_notes text,
  
  -- Original Publication Fields (when volume_type = 'original')
  editorial_team jsonb,  -- {"editor": "...", "contributors": [...]}
  compilation_notes text,
  
  -- SEO & Discovery
  seo_description text,
  seo_keywords text[],
  slug text UNIQUE,  -- URL-friendly identifier
  
  -- Tracking & Timestamps
  created_at timestamptz DEFAULT now(),
  published_at timestamptz,  -- When status changed to 'published'
  updated_at timestamptz DEFAULT now(),
  created_by uuid,  -- Firebase UID
  published_by uuid,  -- Firebase UID
  
  -- Full-text search
  search_vector tsvector
);

-- Indexes for catalog_volumes
CREATE INDEX idx_catalog_volumes_type ON catalog_volumes(volume_type);
CREATE INDEX idx_catalog_volumes_status ON catalog_volumes(publication_status);
CREATE INDEX idx_catalog_volumes_published ON catalog_volumes(published_at DESC) 
  WHERE publication_status = 'published';
CREATE INDEX idx_catalog_volumes_featured ON catalog_volumes(featured) WHERE featured = true;
CREATE INDEX idx_catalog_volumes_slug ON catalog_volumes(slug);
CREATE INDEX idx_catalog_volumes_categories ON catalog_volumes USING GIN(categories);
CREATE INDEX idx_catalog_volumes_tags ON catalog_volumes USING GIN(tags);
CREATE INDEX idx_catalog_volumes_search ON catalog_volumes USING GIN(search_vector);
CREATE INDEX idx_catalog_volumes_source_book ON catalog_volumes(source_book_id);
CREATE INDEX idx_catalog_volumes_original_google ON catalog_volumes(original_google_books_id);
CREATE INDEX idx_catalog_volumes_publisher ON catalog_volumes(publisher_id);

COMMENT ON TABLE catalog_volumes IS 'Published CENIE Editorial volumes visible in public catalog';
COMMENT ON COLUMN catalog_volumes.volume_type IS 'translated: books translated by CENIE; original: CENIE original publications; adapted: adapted/annotated editions';
COMMENT ON COLUMN catalog_volumes.source_book_id IS 'Reference to books table if this volume originated from editorial workspace';
COMMENT ON COLUMN catalog_volumes.cover_twicpics_path IS 'TwicPics image path for book cover';
COMMENT ON COLUMN catalog_volumes.authors_display IS 'Denormalized author names for display and search performance';
COMMENT ON COLUMN catalog_volumes.translator_display IS 'Denormalized translator attribution for display';

-- =====================================================
-- VOLUME CONTRIBUTORS JUNCTION TABLE
-- =====================================================
-- Links contributors to catalog volumes with role specificity
CREATE TABLE IF NOT EXISTS volume_contributors (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- References
  volume_id uuid NOT NULL REFERENCES catalog_volumes(id) ON DELETE CASCADE,
  contributor_id uuid NOT NULL REFERENCES contributors(id) ON DELETE RESTRICT,
  
  -- Role in this specific volume
  role text NOT NULL CHECK (
    role IN ('author', 'translator', 'editor', 'illustrator', 'narrator', 
             'foreword', 'introduction', 'afterword', 'compiler', 'contributor')
  ),
  role_description text,  -- E.g., "Traducido del inglés por", "Prólogo de"
  
  -- Display
  display_order integer DEFAULT 0,  -- For sorting multiple authors
  featured boolean DEFAULT false,  -- Highlight this contributor
  
  -- Attribution Context
  is_original_contributor boolean DEFAULT true,  -- False for translators of translated works
  
  -- Metadata
  created_at timestamptz DEFAULT now(),
  
  UNIQUE(volume_id, contributor_id, role)  -- Same person can have multiple roles, but not duplicate roles
);

-- Indexes for volume_contributors
CREATE INDEX idx_volume_contributors_volume ON volume_contributors(volume_id);
CREATE INDEX idx_volume_contributors_contributor ON volume_contributors(contributor_id);
CREATE INDEX idx_volume_contributors_role ON volume_contributors(role);

COMMENT ON TABLE volume_contributors IS 'Junction table linking contributors to catalog volumes with specific roles';
COMMENT ON COLUMN volume_contributors.is_original_contributor IS 'True for original authors, false for translators/editors';

-- =====================================================
-- BOOKS TABLE (Editorial Workspace)
-- =====================================================
-- Internal workspace for discovering, curating, and preparing books
CREATE TABLE IF NOT EXISTS books (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Google Books reference
  google_books_id varchar(255) UNIQUE NOT NULL,

  -- Essential cached metadata (for admin readability & search)
  title text NOT NULL,
  subtitle text,
  authors text[],
  published_date varchar(50),
  language varchar(10),
  isbn_13 varchar(13),
  isbn_10 varchar(10),

  -- Editorial workflow status
  status text NOT NULL DEFAULT 'discovered' CHECK (
    status IN ('discovered', 'under_review', 'selected', 'in_translation', 'published', 'rejected')
  ),

  -- Editorial metadata
  translated_title text,
  selected_for_translation boolean DEFAULT false,
  translation_priority integer CHECK (translation_priority >= 1 AND translation_priority <= 5),
  marketability_score integer CHECK (marketability_score >= 1 AND marketability_score <= 10),
  relevance_score integer CHECK (relevance_score >= 1 AND relevance_score <= 10),

  -- Editorial notes
  internal_notes text,
  rejection_reason text,

  -- Translation investigation status
  translation_status varchar(20) DEFAULT 'not_checked'
    CHECK (translation_status IN ('not_checked', 'checking', 'found', 'not_found', 'needs_review')),

  -- Spanish translation metadata (from investigation)
  spanish_title text,
  spanish_subtitle text,
  spanish_authors text[],
  spanish_google_books_id varchar(255),
  spanish_isbn_13 varchar(13),
  spanish_isbn_10 varchar(10),
  spanish_publisher text,
  spanish_published_date varchar(50),

  -- Investigation metadata
  confidence_score integer CHECK (confidence_score >= 0 AND confidence_score <= 100),
  confidence_breakdown jsonb,
  investigation_method varchar(30), -- 'google_books_auto', 'manual', 'llm_assisted'
  investigation_notes text,
  last_checked_at timestamptz,
  checked_by uuid, -- Firebase UID

  -- Promotion to Catalog
  promoted_to_catalog boolean DEFAULT false,
  catalog_volume_id uuid REFERENCES catalog_volumes(id) ON DELETE SET NULL,
  
  -- Preparation for Publication (temporary workspace fields)
  temp_cover_twicpics_path text,  -- Temporary cover upload before publishing
  publication_description_es text,  -- Spanish description for catalog
  publication_excerpt_es text,  -- Spanish excerpt for catalog
  publication_table_of_contents jsonb,  -- Structured TOC for catalog

  -- Tracking
  added_by uuid, -- Firebase UID
  added_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  reviewed_at timestamptz,
  reviewed_by uuid, -- Firebase UID

  -- Full-text search vector
  search_vector tsvector
);

-- Indexes for books table
CREATE INDEX idx_books_google_id ON books(google_books_id);
CREATE INDEX idx_books_status ON books(status);
CREATE INDEX idx_books_selected ON books(selected_for_translation) WHERE selected_for_translation = true;
CREATE INDEX idx_books_search ON books USING GIN(search_vector);
CREATE INDEX idx_books_added_at ON books(added_at DESC);
CREATE INDEX idx_books_authors ON books USING GIN(authors);
CREATE INDEX idx_books_translation_status ON books(translation_status);
CREATE INDEX idx_books_spanish_google_id ON books(spanish_google_books_id);
CREATE INDEX idx_books_last_checked ON books(last_checked_at DESC);
CREATE INDEX idx_books_promoted ON books(promoted_to_catalog) WHERE promoted_to_catalog = true;
CREATE INDEX idx_books_catalog_volume ON books(catalog_volume_id);

COMMENT ON TABLE books IS 'Editorial workspace for discovering, curating, and preparing books for publication';
COMMENT ON COLUMN books.promoted_to_catalog IS 'Whether this book has been published to catalog_volumes';
COMMENT ON COLUMN books.catalog_volume_id IS 'Reference to published catalog volume if promoted';
COMMENT ON COLUMN books.temp_cover_twicpics_path IS 'Temporary cover upload during preparation phase';

-- =====================================================
-- TRANSLATION GLOSSARY TABLE
-- =====================================================
-- Stores performing arts terminology for consistent auto-translation
CREATE TABLE IF NOT EXISTS translation_glossary (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Terms
  term_en text UNIQUE NOT NULL,
  term_es text NOT NULL,
  
  -- Context
  context text,  -- 'theater', 'dance', 'music', 'technical', 'general'
  category text,  -- Additional categorization
  
  -- Metadata
  notes text,
  usage_count integer DEFAULT 0,  -- Track how often term is used
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid  -- Firebase UID
);

-- Indexes
CREATE INDEX idx_glossary_term_en ON translation_glossary(term_en);
CREATE INDEX idx_glossary_context ON translation_glossary(context);
CREATE INDEX idx_glossary_category ON translation_glossary(category);
CREATE INDEX idx_glossary_search_en ON translation_glossary USING GIN(to_tsvector('english', term_en));

COMMENT ON TABLE translation_glossary IS 'Performing arts terminology for consistent auto-translation';

-- =====================================================
-- TRIGGER FUNCTIONS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update search_vector for books
CREATE OR REPLACE FUNCTION books_search_vector_update() 
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('spanish', coalesce(NEW.title, '')), 'A') ||
    setweight(to_tsvector('spanish', coalesce(NEW.translated_title, '')), 'A') ||
    setweight(to_tsvector('spanish', coalesce(NEW.spanish_title, '')), 'A') ||
    setweight(to_tsvector('spanish', coalesce(array_to_string(NEW.authors, ' '), '')), 'B') ||
    setweight(to_tsvector('spanish', coalesce(NEW.subtitle, '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update search_vector for catalog_volumes
CREATE OR REPLACE FUNCTION catalog_volumes_search_vector_update()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('spanish', coalesce(NEW.title, '')), 'A') ||
    setweight(to_tsvector('spanish', coalesce(NEW.authors_display, '')), 'A') ||
    setweight(to_tsvector('spanish', coalesce(NEW.subtitle, '')), 'B') ||
    setweight(to_tsvector('spanish', coalesce(NEW.description, '')), 'C') ||
    setweight(to_tsvector('spanish', coalesce(array_to_string(NEW.tags, ' '), '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update search_vector for contributors
CREATE OR REPLACE FUNCTION contributors_search_vector_update()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('spanish', coalesce(NEW.full_name, '')), 'A') ||
    setweight(to_tsvector('spanish', coalesce(array_to_string(NEW.name_variants, ' '), '')), 'B') ||
    setweight(to_tsvector('spanish', coalesce(NEW.bio_es, '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Updated_at triggers
DROP TRIGGER IF EXISTS books_updated_at_trigger ON books;
CREATE TRIGGER books_updated_at_trigger
  BEFORE UPDATE ON books
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS catalog_volumes_updated_at_trigger ON catalog_volumes;
CREATE TRIGGER catalog_volumes_updated_at_trigger
  BEFORE UPDATE ON catalog_volumes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS contributors_updated_at_trigger ON contributors;
CREATE TRIGGER contributors_updated_at_trigger
  BEFORE UPDATE ON contributors
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS publishers_updated_at_trigger ON publishers;
CREATE TRIGGER publishers_updated_at_trigger
  BEFORE UPDATE ON publishers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Search vector triggers
DROP TRIGGER IF EXISTS books_search_vector_trigger ON books;
CREATE TRIGGER books_search_vector_trigger
  BEFORE INSERT OR UPDATE OF title, subtitle, authors, translated_title, spanish_title
  ON books
  FOR EACH ROW
  EXECUTE FUNCTION books_search_vector_update();

DROP TRIGGER IF EXISTS catalog_volumes_search_vector_trigger ON catalog_volumes;
CREATE TRIGGER catalog_volumes_search_vector_trigger
  BEFORE INSERT OR UPDATE OF title, subtitle, description, authors_display, tags
  ON catalog_volumes
  FOR EACH ROW
  EXECUTE FUNCTION catalog_volumes_search_vector_update();

DROP TRIGGER IF EXISTS contributors_search_vector_trigger ON contributors;
CREATE TRIGGER contributors_search_vector_trigger
  BEFORE INSERT OR UPDATE OF full_name, name_variants, bio_es
  ON contributors
  FOR EACH ROW
  EXECUTE FUNCTION contributors_search_vector_update();

-- =====================================================
-- HELPER FUNCTIONS - Books Workspace
-- =====================================================

-- Function to search books with full-text search
CREATE OR REPLACE FUNCTION search_books(search_query text, limit_count integer DEFAULT 20)
RETURNS SETOF books AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM books
  WHERE search_vector @@ plainto_tsquery('spanish', search_query)
  ORDER BY ts_rank(search_vector, plainto_tsquery('spanish', search_query)) DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Function to get books by status with counts
CREATE OR REPLACE FUNCTION get_books_by_status()
RETURNS TABLE(status text, count bigint) AS $$
BEGIN
  RETURN QUERY
  SELECT b.status, COUNT(*)::bigint
  FROM books b
  GROUP BY b.status
  ORDER BY b.status;
END;
$$ LANGUAGE plpgsql;

-- Function to start translation check
CREATE OR REPLACE FUNCTION start_translation_check(book_id uuid, user_id uuid DEFAULT NULL)
RETURNS void AS $$
BEGIN
  UPDATE books
  SET
    translation_status = 'checking',
    last_checked_at = now(),
    checked_by = user_id
  WHERE id = book_id;
END;
$$ LANGUAGE plpgsql;

-- Function to complete translation check
CREATE OR REPLACE FUNCTION complete_translation_check(
  book_id uuid,
  found boolean,
  score integer,
  breakdown jsonb,
  method varchar(30),
  notes text DEFAULT NULL,
  spanish_data jsonb DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  UPDATE books
  SET
    translation_status = CASE
      WHEN found = true AND score >= 70 THEN 'found'
      WHEN found = true AND score < 70 THEN 'needs_review'
      ELSE 'not_found'
    END,
    confidence_score = score,
    confidence_breakdown = breakdown,
    investigation_method = method,
    investigation_notes = notes,
    last_checked_at = now()
  WHERE id = book_id;

  IF found = true AND spanish_data IS NOT NULL THEN
    UPDATE books
    SET
      spanish_title = spanish_data->>'title',
      spanish_subtitle = spanish_data->>'subtitle',
      spanish_authors = ARRAY(SELECT jsonb_array_elements_text(spanish_data->'authors')),
      spanish_google_books_id = spanish_data->>'google_books_id',
      spanish_isbn_13 = spanish_data->>'isbn_13',
      spanish_isbn_10 = spanish_data->>'isbn_10',
      spanish_publisher = spanish_data->>'publisher',
      spanish_published_date = spanish_data->>'published_date'
    WHERE id = book_id;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to get translation statistics
CREATE OR REPLACE FUNCTION get_translation_stats()
RETURNS TABLE(
  status varchar(20),
  count bigint,
  avg_confidence numeric
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    b.translation_status as status,
    COUNT(*)::bigint as count,
    ROUND(AVG(b.confidence_score), 2) as avg_confidence
  FROM books b
  WHERE b.translation_status != 'not_checked'
  GROUP BY b.translation_status
  ORDER BY
    CASE b.translation_status
      WHEN 'found' THEN 1
      WHEN 'needs_review' THEN 2
      WHEN 'not_found' THEN 3
      WHEN 'checking' THEN 4
      ELSE 5
    END;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- HELPER FUNCTIONS - Catalog Volumes
-- =====================================================

-- Function to search catalog volumes
CREATE OR REPLACE FUNCTION search_catalog_volumes(
  search_query text,
  limit_count integer DEFAULT 20,
  only_published boolean DEFAULT true
)
RETURNS SETOF catalog_volumes AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM catalog_volumes
  WHERE 
    search_vector @@ plainto_tsquery('spanish', search_query)
    AND (NOT only_published OR publication_status = 'published')
  ORDER BY ts_rank(search_vector, plainto_tsquery('spanish', search_query)) DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Function to get contributors for a volume
CREATE OR REPLACE FUNCTION get_volume_contributors(volume_uuid uuid)
RETURNS TABLE(
  contributor_id uuid,
  full_name text,
  role text,
  role_description text,
  display_order integer,
  photo_url text,
  bio_es text
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.full_name,
    vc.role,
    vc.role_description,
    vc.display_order,
    c.photo_url,
    c.bio_es
  FROM volume_contributors vc
  JOIN contributors c ON vc.contributor_id = c.id
  WHERE vc.volume_id = volume_uuid
  ORDER BY vc.display_order, c.full_name;
END;
$$ LANGUAGE plpgsql;

-- Function to generate contributors display text
CREATE OR REPLACE FUNCTION generate_contributors_display(
  volume_uuid uuid,
  contributor_role text DEFAULT 'author'
)
RETURNS text AS $$
DECLARE
  result text;
BEGIN
  SELECT string_agg(c.full_name, '; ' ORDER BY vc.display_order, c.full_name)
  INTO result
  FROM volume_contributors vc
  JOIN contributors c ON vc.contributor_id = c.id
  WHERE vc.volume_id = volume_uuid AND vc.role = contributor_role;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to update volume display fields (call after updating contributors)
CREATE OR REPLACE FUNCTION update_volume_display_fields(volume_uuid uuid)
RETURNS void AS $$
BEGIN
  UPDATE catalog_volumes
  SET
    authors_display = generate_contributors_display(volume_uuid, 'author'),
    translator_display = CASE
      WHEN generate_contributors_display(volume_uuid, 'translator') IS NOT NULL
      THEN 'Traducido por ' || generate_contributors_display(volume_uuid, 'translator')
      ELSE NULL
    END
  WHERE id = volume_uuid;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- HELPER FUNCTIONS - Publication Workflow
-- =====================================================

-- Function to promote book to catalog
CREATE OR REPLACE FUNCTION promote_book_to_catalog(
  book_uuid uuid,
  catalog_data jsonb,
  user_id uuid
)
RETURNS uuid AS $$
DECLARE
  new_volume_id uuid;
  book_record books%ROWTYPE;
BEGIN
  -- Get book data
  SELECT * INTO book_record FROM books WHERE id = book_uuid;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Book not found: %', book_uuid;
  END IF;
  
  -- Create catalog volume
  INSERT INTO catalog_volumes (
    volume_type,
    title,
    subtitle,
    description,
    publication_year,
    isbn_13,
    isbn_10,
    cover_twicpics_path,
    cover_fallback_url,
    categories,
    tags,
    table_of_contents,
    excerpt,
    original_language,
    original_title,
    original_publication_year,
    original_isbn_13,
    original_google_books_id,
    source_book_id,
    translation_year,
    translation_notes,
    publication_status,
    created_by,
    slug
  )
  VALUES (
    COALESCE(catalog_data->>'volume_type', 'translated'),
    COALESCE(catalog_data->>'title', book_record.translated_title, book_record.title),
    catalog_data->>'subtitle',
    COALESCE(catalog_data->>'description', book_record.publication_description_es, ''),
    COALESCE((catalog_data->>'publication_year')::integer, EXTRACT(YEAR FROM now())::integer),
    catalog_data->>'isbn_13',
    catalog_data->>'isbn_10',
    COALESCE(catalog_data->>'cover_twicpics_path', book_record.temp_cover_twicpics_path),
    catalog_data->>'cover_fallback_url',
    COALESCE(ARRAY(SELECT jsonb_array_elements_text(catalog_data->'categories')), ARRAY[]::text[]),
    COALESCE(ARRAY(SELECT jsonb_array_elements_text(catalog_data->'tags')), ARRAY[]::text[]),
    COALESCE(catalog_data->'table_of_contents', book_record.publication_table_of_contents),
    COALESCE(catalog_data->>'excerpt', book_record.publication_excerpt_es),
    book_record.language,
    book_record.title,
    EXTRACT(YEAR FROM TO_DATE(book_record.published_date, 'YYYY-MM-DD'))::integer,
    book_record.isbn_13,
    book_record.google_books_id,
    book_uuid,
    COALESCE((catalog_data->>'translation_year')::integer, EXTRACT(YEAR FROM now())::integer),
    catalog_data->>'translation_notes',
    'draft',  -- Start as draft
    user_id,
    catalog_data->>'slug'
  )
  RETURNING id INTO new_volume_id;
  
  -- Update book record
  UPDATE books
  SET
    promoted_to_catalog = true,
    catalog_volume_id = new_volume_id,
    status = 'published'
  WHERE id = book_uuid;
  
  RETURN new_volume_id;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- NOTE: User Management
-- =====================================================
-- User permissions are managed in Firestore
-- Use Firebase Admin SDK to grant/revoke access
-- No helper functions needed in Supabase

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================
-- RLS is DISABLED for all tables
-- Authorization is handled at the application layer using Firebase Auth

ALTER TABLE books DISABLE ROW LEVEL SECURITY;
ALTER TABLE catalog_volumes DISABLE ROW LEVEL SECURITY;
ALTER TABLE contributors DISABLE ROW LEVEL SECURITY;
ALTER TABLE volume_contributors DISABLE ROW LEVEL SECURITY;
ALTER TABLE publishers DISABLE ROW LEVEL SECURITY;
ALTER TABLE translation_glossary DISABLE ROW LEVEL SECURITY;

-- =====================================================
-- SEED DATA - Translation Glossary
-- =====================================================
-- Pre-populate with performing arts terminology

INSERT INTO translation_glossary (term_en, term_es, context, category) VALUES
-- Theater General
('theater', 'teatro', 'theater', 'general'),
('theatre', 'teatro', 'theater', 'general'),
('stage', 'escenario', 'theater', 'technical'),
('performance', 'función', 'theater', 'general'),
('actor', 'actor', 'theater', 'general'),
('actress', 'actriz', 'theater', 'general'),
('director', 'director', 'theater', 'general'),
('playwright', 'dramaturgo', 'theater', 'general'),
('script', 'guion', 'theater', 'technical'),
('rehearsal', 'ensayo', 'theater', 'technical'),
('audition', 'audición', 'theater', 'technical'),
('cast', 'elenco', 'theater', 'general'),
('scene', 'escena', 'theater', 'technical'),
('act', 'acto', 'theater', 'technical'),
('monologue', 'monólogo', 'theater', 'technical'),
('dialogue', 'diálogo', 'theater', 'technical'),

-- Theater Production
('lighting', 'iluminación', 'theater', 'technical'),
('set design', 'escenografía', 'theater', 'technical'),
('costume', 'vestuario', 'theater', 'technical'),
('makeup', 'maquillaje', 'theater', 'technical'),
('props', 'utilería', 'theater', 'technical'),
('backdrop', 'telón de fondo', 'theater', 'technical'),
('curtain', 'telón', 'theater', 'technical'),
('wings', 'bastidores', 'theater', 'technical'),
('backstage', 'entre bastidores', 'theater', 'technical'),
('stage manager', 'director de escena', 'theater', 'technical'),

-- Acting Techniques
('method acting', 'actuación de método', 'theater', 'technique'),
('improvisation', 'improvisación', 'theater', 'technique'),
('blocking', 'marcación', 'theater', 'technique'),
('character development', 'desarrollo del personaje', 'theater', 'technique'),
('voice projection', 'proyección de voz', 'theater', 'technique'),
('stage presence', 'presencia escénica', 'theater', 'technique'),

-- Dance
('choreography', 'coreografía', 'dance', 'general'),
('choreographer', 'coreógrafo', 'dance', 'general'),
('ballet', 'ballet', 'dance', 'general'),
('modern dance', 'danza moderna', 'dance', 'general'),
('contemporary dance', 'danza contemporánea', 'dance', 'general'),

-- Music & Opera
('opera', 'ópera', 'music', 'general'),
('musical', 'musical', 'music', 'general'),
('composer', 'compositor', 'music', 'general'),
('conductor', 'director de orquesta', 'music', 'general'),
('orchestra', 'orquesta', 'music', 'general'),
('aria', 'aria', 'music', 'technical'),
('libretto', 'libreto', 'music', 'technical'),

-- Performance Spaces
('auditorium', 'auditorio', 'theater', 'venue'),
('amphitheater', 'anfiteatro', 'theater', 'venue'),
('proscenium', 'proscenio', 'theater', 'technical'),
('black box theater', 'teatro de caja negra', 'theater', 'venue'),

-- Administrative
('box office', 'taquilla', 'theater', 'administrative'),
('ticket', 'entrada', 'theater', 'administrative'),
('intermission', 'entreacto', 'theater', 'general'),
('premiere', 'estreno', 'theater', 'general'),
('opening night', 'noche de estreno', 'theater', 'general'),
('matinee', 'función de tarde', 'theater', 'general'),

-- Critical Terms
('review', 'reseña', 'general', 'critical'),
('critic', 'crítico', 'general', 'critical'),
('standing ovation', 'ovación de pie', 'theater', 'general'),
('audience', 'público', 'general', 'general'),
('applause', 'aplauso', 'general', 'general')

ON CONFLICT (term_en) DO NOTHING;

-- =====================================================
-- FINAL COMMENTS
-- =====================================================

COMMENT ON FUNCTION promote_book_to_catalog IS 'Promotes a book from editorial workspace to public catalog';
COMMENT ON FUNCTION get_volume_contributors IS 'Returns all contributors for a specific catalog volume';
COMMENT ON FUNCTION generate_contributors_display IS 'Generates display text for volume contributors (e.g., "García Márquez, Gabriel; Fuentes, Carlos)"';
COMMENT ON FUNCTION update_volume_display_fields IS 'Updates denormalized authors_display and translator_display fields';
COMMENT ON FUNCTION search_catalog_volumes IS 'Full-text search across catalog volumes';

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================
-- Database is now ready for CENIE Editorial Phase 2 implementation

