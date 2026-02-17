-- Add translation_slug column to books table for SEO-friendly URLs on /proximamente
-- This stores a slug generated from the Spanish title (e.g., "el-titulo-en-espanol")
-- instead of using the generic "book-{uuid}" format.

ALTER TABLE books ADD COLUMN translation_slug TEXT UNIQUE;

-- Index for fast lookups by translation_slug
CREATE INDEX idx_books_translation_slug ON books (translation_slug) WHERE translation_slug IS NOT NULL;
