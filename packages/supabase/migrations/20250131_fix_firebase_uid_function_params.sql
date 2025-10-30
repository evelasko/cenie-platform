-- =====================================================
-- Fix Firebase UID Function Parameters
-- Migration: 20250131_fix_firebase_uid_function_params
-- Description: Change database function parameters from uuid to text for Firebase UIDs
-- Reason: Firebase UIDs are base64 strings, not UUID format
-- Related: Follows up on 20250130_fix_firebase_uid_types.sql
-- =====================================================

-- Fix promote_book_to_catalog function
-- Changes user_id parameter from uuid to text
-- First, drop the old function with uuid parameter
DROP FUNCTION IF EXISTS promote_book_to_catalog(uuid, jsonb, uuid);

-- Now create the new function with text parameter
CREATE OR REPLACE FUNCTION promote_book_to_catalog(
  book_uuid uuid,
  catalog_data jsonb,
  user_id text  -- Changed from uuid to text
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
    user_id,  -- Now accepts text (Firebase UID)
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

-- Fix start_translation_check function
-- Changes user_id parameter from uuid to text
-- First, drop the old function with uuid parameter
DROP FUNCTION IF EXISTS start_translation_check(uuid, uuid);

-- Now create the new function with text parameter
CREATE OR REPLACE FUNCTION start_translation_check(book_id uuid, user_id text DEFAULT NULL)
RETURNS void AS $$
BEGIN
  UPDATE books
  SET
    translation_status = 'checking',
    last_checked_at = now(),
    checked_by = user_id  -- Now accepts text (Firebase UID)
  WHERE id = book_id;
END;
$$ LANGUAGE plpgsql;

-- Update function comments
COMMENT ON FUNCTION promote_book_to_catalog IS 'Promotes a book from editorial workspace to public catalog. user_id is a Firebase UID (text format, not UUID)';
COMMENT ON FUNCTION start_translation_check IS 'Starts a translation check for a book. user_id is a Firebase UID (text format, not UUID)';

