-- Migration: Add temporary contributor fields to books table
-- Description: Stores temporary contributor assignments (authors, translators) during publication preparation
-- Date: 2025-02-01

-- Add fields to store temporary contributor assignments
ALTER TABLE books 
ADD COLUMN temp_authors jsonb,
ADD COLUMN temp_translators jsonb;

-- Add comments
COMMENT ON COLUMN books.temp_authors IS 'Temporary author contributor assignments (array of contributor IDs) before publishing to catalog';
COMMENT ON COLUMN books.temp_translators IS 'Temporary translator contributor assignments (array of contributor IDs) before publishing to catalog';

-- Example data format:
-- temp_authors: [{"id": "uuid", "full_name": "Name", "slug": "slug", "primary_role": "author"}]
-- temp_translators: [{"id": "uuid", "full_name": "Name", "slug": "slug", "primary_role": "translator"}]

