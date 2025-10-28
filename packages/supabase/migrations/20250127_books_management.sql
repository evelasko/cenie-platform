-- CENIE Editorial - Books Management System
-- Migration: 20250127_books_management
-- Description: Creates tables for managing books from Google Books API

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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

  -- Tracking
  added_by uuid REFERENCES auth.users(id),
  added_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  reviewed_at timestamptz,
  reviewed_by uuid REFERENCES auth.users(id),

  -- Full-text search vector
  search_vector tsvector
);

-- Create indexes for books table
CREATE INDEX idx_books_google_id ON books(google_books_id);
CREATE INDEX idx_books_status ON books(status);
CREATE INDEX idx_books_selected ON books(selected_for_translation) WHERE selected_for_translation = true;
CREATE INDEX idx_books_search ON books USING GIN(search_vector);
CREATE INDEX idx_books_added_at ON books(added_at DESC);
CREATE INDEX idx_books_authors ON books USING GIN(authors);

-- Function to update search_vector automatically
CREATE OR REPLACE FUNCTION books_search_vector_update() RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('spanish', coalesce(NEW.title, '')), 'A') ||
    setweight(to_tsvector('spanish', coalesce(NEW.translated_title, '')), 'A') ||
    setweight(to_tsvector('spanish', coalesce(array_to_string(NEW.authors, ' '), '')), 'B') ||
    setweight(to_tsvector('spanish', coalesce(NEW.subtitle, '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update search_vector on insert/update
CREATE TRIGGER books_search_vector_trigger
  BEFORE INSERT OR UPDATE OF title, subtitle, authors, translated_title
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
CREATE INDEX idx_book_tags_book ON book_tags(book_id);
CREATE INDEX idx_book_tags_tag ON book_tags(tag);

-- =====================================================
-- BOOK REVIEWS TABLE
-- =====================================================
-- Stores editorial assessments and reviews
CREATE TABLE IF NOT EXISTS book_reviews (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  book_id uuid REFERENCES books(id) ON DELETE CASCADE NOT NULL,
  reviewer_id uuid REFERENCES auth.users(id) NOT NULL,

  rating integer CHECK (rating >= 1 AND rating <= 5),
  review_text text,
  recommendation text CHECK (
    recommendation IN ('strong_yes', 'yes', 'maybe', 'no', 'strong_no')
  ),

  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes for book_reviews
CREATE INDEX idx_book_reviews_book ON book_reviews(book_id);
CREATE INDEX idx_book_reviews_reviewer ON book_reviews(reviewer_id);

-- Trigger to update updated_at on book_reviews table
CREATE TRIGGER book_reviews_updated_at_trigger
  BEFORE UPDATE ON book_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_reviews ENABLE ROW LEVEL SECURITY;

-- Books table policies
-- Anyone can view books (for public catalog)
CREATE POLICY "Anyone can view books"
  ON books FOR SELECT
  USING (true);

-- Only editors/admins can insert books
CREATE POLICY "Editors can insert books"
  ON books FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_app_access
      WHERE user_id = auth.uid()
        AND app_name = 'editorial'
        AND role IN ('admin', 'editor')
        AND is_active = true
    )
  );

-- Only editors/admins can update books
CREATE POLICY "Editors can update books"
  ON books FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_app_access
      WHERE user_id = auth.uid()
        AND app_name = 'editorial'
        AND role IN ('admin', 'editor')
        AND is_active = true
    )
  );

-- Only admins can delete books
CREATE POLICY "Admins can delete books"
  ON books FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_app_access
      WHERE user_id = auth.uid()
        AND app_name = 'editorial'
        AND role = 'admin'
        AND is_active = true
    )
  );

-- Book tags policies
CREATE POLICY "Anyone can view book tags"
  ON book_tags FOR SELECT
  USING (true);

CREATE POLICY "Editors can manage book tags"
  ON book_tags FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_app_access
      WHERE user_id = auth.uid()
        AND app_name = 'editorial'
        AND role IN ('admin', 'editor')
        AND is_active = true
    )
  );

-- Book reviews policies
CREATE POLICY "Anyone can view book reviews"
  ON book_reviews FOR SELECT
  USING (true);

CREATE POLICY "Users can create their own reviews"
  ON book_reviews FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = reviewer_id AND
    EXISTS (
      SELECT 1 FROM user_app_access
      WHERE user_id = auth.uid()
        AND app_name = 'editorial'
        AND is_active = true
    )
  );

CREATE POLICY "Users can update their own reviews"
  ON book_reviews FOR UPDATE
  TO authenticated
  USING (auth.uid() = reviewer_id);

CREATE POLICY "Admins can delete any review"
  ON book_reviews FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_app_access
      WHERE user_id = auth.uid()
        AND app_name = 'editorial'
        AND role = 'admin'
        AND is_active = true
    )
  );

-- =====================================================
-- HELPER FUNCTIONS
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
-- COMMENTS FOR DOCUMENTATION
-- =====================================================

COMMENT ON TABLE books IS 'Stores book references from Google Books API with editorial metadata';
COMMENT ON TABLE book_tags IS 'Categorization tags for books';
COMMENT ON TABLE book_reviews IS 'Editorial assessments and reviews for books';

COMMENT ON COLUMN books.google_books_id IS 'Unique identifier from Google Books API';
COMMENT ON COLUMN books.status IS 'Editorial workflow status: discovered, under_review, selected, in_translation, published, rejected';
COMMENT ON COLUMN books.translation_priority IS 'Priority ranking from 1 (highest) to 5 (lowest)';
COMMENT ON COLUMN books.marketability_score IS 'Commercial potential score from 1-10';
COMMENT ON COLUMN books.relevance_score IS 'Academic/field relevance score from 1-10';
