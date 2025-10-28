-- CENIE Editorial - Books Management System (Complete)
-- Migration: 20250128_books_management_complete
-- Description: Complete schema for managing books with translation tracking
-- Note: RLS disabled - authorization handled at application layer via Firebase Auth

-- =====================================================
-- EXTENSIONS
-- =====================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- USER APP ACCESS TABLE
-- =====================================================
-- Stores user permissions for different apps
-- Used for application-layer authorization checks
CREATE TABLE IF NOT EXISTS user_app_access (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,  -- Firebase UID stored here
  app_name text NOT NULL,
  role text NOT NULL CHECK (role IN ('admin', 'editor', 'viewer')),
  is_active boolean DEFAULT true,
  granted_at timestamptz DEFAULT now(),
  granted_by uuid,
  UNIQUE(user_id, app_name)
);

CREATE INDEX IF NOT EXISTS idx_user_app_access_user_app ON user_app_access(user_id, app_name);
CREATE INDEX IF NOT EXISTS idx_user_app_access_active ON user_app_access(is_active) WHERE is_active = true;

COMMENT ON TABLE user_app_access IS 'Stores user permissions for different apps - user_id contains Firebase UID';
COMMENT ON COLUMN user_app_access.user_id IS 'Firebase UID (not Supabase auth.users)';

-- =====================================================
-- BOOKS TABLE
-- =====================================================
-- Stores book references and editorial metadata
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

  -- Spanish translation metadata
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

  -- Tracking
  added_by uuid, -- Firebase UID
  added_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  reviewed_at timestamptz,
  reviewed_by uuid, -- Firebase UID

  -- Full-text search vector
  search_vector tsvector
);

-- Create indexes for books table
CREATE INDEX IF NOT EXISTS idx_books_google_id ON books(google_books_id);
CREATE INDEX IF NOT EXISTS idx_books_status ON books(status);
CREATE INDEX IF NOT EXISTS idx_books_selected ON books(selected_for_translation) WHERE selected_for_translation = true;
CREATE INDEX IF NOT EXISTS idx_books_search ON books USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_books_added_at ON books(added_at DESC);
CREATE INDEX IF NOT EXISTS idx_books_authors ON books USING GIN(authors);
CREATE INDEX IF NOT EXISTS idx_books_translation_status ON books(translation_status);
CREATE INDEX IF NOT EXISTS idx_books_spanish_google_id ON books(spanish_google_books_id);
CREATE INDEX IF NOT EXISTS idx_books_last_checked ON books(last_checked_at DESC);

-- Function to update search_vector automatically
CREATE OR REPLACE FUNCTION books_search_vector_update() RETURNS trigger AS $$
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

-- Trigger to update search_vector on insert/update
DROP TRIGGER IF EXISTS books_search_vector_trigger ON books;
CREATE TRIGGER books_search_vector_trigger
  BEFORE INSERT OR UPDATE OF title, subtitle, authors, translated_title, spanish_title
  ON books
  FOR EACH ROW
  EXECUTE FUNCTION books_search_vector_update();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on books table
DROP TRIGGER IF EXISTS books_updated_at_trigger ON books;
CREATE TRIGGER books_updated_at_trigger
  BEFORE UPDATE ON books
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- BOOK TAGS TABLE
-- =====================================================
-- Stores categorization tags for books
CREATE TABLE IF NOT EXISTS book_tags (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  book_id uuid REFERENCES books(id) ON DELETE CASCADE NOT NULL,
  tag text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(book_id, tag)
);

-- Indexes for book_tags
CREATE INDEX IF NOT EXISTS idx_book_tags_book ON book_tags(book_id);
CREATE INDEX IF NOT EXISTS idx_book_tags_tag ON book_tags(tag);

-- =====================================================
-- BOOK REVIEWS TABLE
-- =====================================================
-- Stores editorial assessments and reviews
CREATE TABLE IF NOT EXISTS book_reviews (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  book_id uuid REFERENCES books(id) ON DELETE CASCADE NOT NULL,
  reviewer_id uuid NOT NULL, -- Firebase UID

  rating integer CHECK (rating >= 1 AND rating <= 5),
  review_text text,
  recommendation text CHECK (
    recommendation IN ('strong_yes', 'yes', 'maybe', 'no', 'strong_no')
  ),

  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes for book_reviews
CREATE INDEX IF NOT EXISTS idx_book_reviews_book ON book_reviews(book_id);
CREATE INDEX IF NOT EXISTS idx_book_reviews_reviewer ON book_reviews(reviewer_id);

-- Trigger to update updated_at on book_reviews table
DROP TRIGGER IF EXISTS book_reviews_updated_at_trigger ON book_reviews;
CREATE TRIGGER book_reviews_updated_at_trigger
  BEFORE UPDATE ON book_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================
-- RLS is DISABLED for all tables
-- Authorization is handled at the application layer using Firebase Auth
-- and checked against the user_app_access table

-- Ensure RLS is disabled (default, but explicit for clarity)
ALTER TABLE books DISABLE ROW LEVEL SECURITY;
ALTER TABLE book_tags DISABLE ROW LEVEL SECURITY;
ALTER TABLE book_reviews DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_app_access DISABLE ROW LEVEL SECURITY;

-- =====================================================
-- HELPER FUNCTIONS - Books Search
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

-- =====================================================
-- HELPER FUNCTIONS - Translation Tracking
-- =====================================================

-- Function to start translation check (marks book as "checking")
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

-- Function to complete translation check (saves results)
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
  -- Base update
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

  -- Update Spanish translation data if found
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
-- HELPER FUNCTIONS - User Management
-- =====================================================

-- Function to grant editorial access to a user
-- Usage: SELECT grant_editorial_access('firebase-uid-here', 'admin');
CREATE OR REPLACE FUNCTION grant_editorial_access(
  target_user_id uuid,
  user_role text DEFAULT 'editor'
)
RETURNS void AS $$
BEGIN
  INSERT INTO user_app_access (user_id, app_name, role, is_active)
  VALUES (target_user_id, 'editorial', user_role, true)
  ON CONFLICT (user_id, app_name)
  DO UPDATE SET
    role = EXCLUDED.role,
    is_active = true,
    granted_at = now();
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- COMMENTS FOR DOCUMENTATION
-- =====================================================

COMMENT ON TABLE books IS 'Stores book references from Google Books API with editorial and translation metadata';
COMMENT ON TABLE book_tags IS 'Categorization tags for books';
COMMENT ON TABLE book_reviews IS 'Editorial assessments and reviews for books';

COMMENT ON COLUMN books.google_books_id IS 'Unique identifier from Google Books API';
COMMENT ON COLUMN books.status IS 'Editorial workflow status: discovered, under_review, selected, in_translation, published, rejected';
COMMENT ON COLUMN books.translation_priority IS 'Priority ranking from 1 (highest) to 5 (lowest)';
COMMENT ON COLUMN books.marketability_score IS 'Commercial potential score from 1-10';
COMMENT ON COLUMN books.relevance_score IS 'Academic/field relevance score from 1-10';
COMMENT ON COLUMN books.translation_status IS 'Translation investigation status: not_checked, checking, found, not_found, needs_review';
COMMENT ON COLUMN books.confidence_score IS 'Confidence score 0-100 for translation match accuracy';
COMMENT ON COLUMN books.confidence_breakdown IS 'JSON breakdown of confidence factors (author_match, title_similarity, etc.)';
COMMENT ON COLUMN books.investigation_method IS 'Method used: google_books_auto, manual, llm_assisted';
COMMENT ON COLUMN books.spanish_google_books_id IS 'Google Books volume ID for Spanish translation';
COMMENT ON COLUMN books.added_by IS 'Firebase UID of user who added the book';
COMMENT ON COLUMN books.reviewed_by IS 'Firebase UID of user who reviewed the book';
COMMENT ON COLUMN books.checked_by IS 'Firebase UID of user who checked translation';

COMMENT ON FUNCTION grant_editorial_access IS 'Grant editorial access to a Firebase user. Role can be "admin", "editor", or "viewer".';
COMMENT ON FUNCTION start_translation_check IS 'Marks a book as "checking" translation status';
COMMENT ON FUNCTION complete_translation_check IS 'Saves translation investigation results';
COMMENT ON FUNCTION get_translation_stats IS 'Returns statistics about translation investigation results';