-- =====================================================
-- Fix Firebase UID Column Types
-- Migration: 20250130_fix_firebase_uid_types
-- Description: Change Firebase UID columns from uuid to text
-- Reason: Firebase UIDs are base64 strings, not UUID format
-- =====================================================

-- Fix publishers table
ALTER TABLE publishers 
  ALTER COLUMN created_by TYPE text USING created_by::text;

-- Fix contributors table
ALTER TABLE contributors 
  ALTER COLUMN created_by TYPE text USING created_by::text;

-- Fix books table
ALTER TABLE books 
  ALTER COLUMN added_by TYPE text USING added_by::text,
  ALTER COLUMN reviewed_by TYPE text USING reviewed_by::text,
  ALTER COLUMN checked_by TYPE text USING checked_by::text;

-- Fix catalog_volumes table
ALTER TABLE catalog_volumes 
  ALTER COLUMN created_by TYPE text USING created_by::text,
  ALTER COLUMN published_by TYPE text USING published_by::text;

-- Fix translation_glossary table
ALTER TABLE translation_glossary 
  ALTER COLUMN created_by TYPE text USING created_by::text;

-- Update comments to reflect correct type
COMMENT ON COLUMN publishers.created_by IS 'Firebase UID (text format, not UUID)';
COMMENT ON COLUMN contributors.created_by IS 'Firebase UID (text format, not UUID)';
COMMENT ON COLUMN books.added_by IS 'Firebase UID (text format, not UUID)';
COMMENT ON COLUMN books.reviewed_by IS 'Firebase UID (text format, not UUID)';
COMMENT ON COLUMN books.checked_by IS 'Firebase UID (text format, not UUID)';
COMMENT ON COLUMN catalog_volumes.created_by IS 'Firebase UID (text format, not UUID)';
COMMENT ON COLUMN catalog_volumes.published_by IS 'Firebase UID (text format, not UUID)';
COMMENT ON COLUMN translation_glossary.created_by IS 'Firebase UID (text format, not UUID)';

