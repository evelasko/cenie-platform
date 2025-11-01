-- =====================================================
-- CENIE Platform - Waitlist Subscribers Table
-- =====================================================
-- Purpose: Store email subscriptions for platform launch notifications
-- Created: 2025-02-01
--
-- IMPORTANT: Firebase + Supabase Hybrid Architecture
-- - User permissions (user_app_access) are in FIRESTORE, not Supabase
-- - RLS policies cannot reference Firestore data
-- - Admin authorization handled at API layer (Firebase Admin SDK)
-- - Database functions use SECURITY DEFINER to bypass RLS
-- =====================================================

-- Create waitlist_subscribers table
CREATE TABLE IF NOT EXISTS waitlist_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  source TEXT,
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Constraints
  CONSTRAINT waitlist_subscribers_email_valid 
    CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  CONSTRAINT waitlist_subscribers_full_name_length 
    CHECK (char_length(trim(full_name)) >= 2),
  CONSTRAINT waitlist_subscribers_source_valid
    CHECK (source IS NULL OR source IN ('hub', 'editorial', 'academy', 'agency', 'evelas', 'other'))
);

-- Create unique index on lowercase email to prevent duplicates
CREATE UNIQUE INDEX IF NOT EXISTS waitlist_subscribers_email_unique_idx 
  ON waitlist_subscribers (LOWER(email));

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS waitlist_subscribers_source_idx 
  ON waitlist_subscribers (source) 
  WHERE source IS NOT NULL;

CREATE INDEX IF NOT EXISTS waitlist_subscribers_subscribed_at_idx 
  ON waitlist_subscribers (subscribed_at DESC);

CREATE INDEX IF NOT EXISTS waitlist_subscribers_is_active_idx 
  ON waitlist_subscribers (is_active) 
  WHERE is_active = true;

-- Create composite index for filtering and pagination
CREATE INDEX IF NOT EXISTS waitlist_subscribers_active_date_idx 
  ON waitlist_subscribers (is_active, subscribed_at DESC);

-- =====================================================
-- Row Level Security (RLS) Policies
-- =====================================================

-- Enable RLS
ALTER TABLE waitlist_subscribers ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow public INSERT (anyone can subscribe)
-- Note: This allows unauthenticated users to add themselves to waitlist
CREATE POLICY "Allow public insert for waitlist" 
  ON waitlist_subscribers
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Policy 2: Allow service role to SELECT (for API routes)
-- Note: The API route handles Firebase authentication and admin authorization
-- Direct database access is blocked for regular users
-- Only service role (used by API routes) can SELECT
CREATE POLICY "Allow service role select for waitlist" 
  ON waitlist_subscribers
  FOR SELECT
  TO authenticated
  USING (false);  -- Block direct access; API route uses service role

-- Policy 3: No direct UPDATE or DELETE
-- These operations should be handled through API routes with proper authentication
-- This prevents accidental deletion of subscriber data

-- NOTE: Authorization is handled at the API layer via Firebase Admin SDK
-- The GET /api/waitlist endpoint checks:
--   1. Valid Firebase ID token
--   2. Admin role in Firebase user_app_access collection
-- This approach keeps user management in Firestore as designed

-- =====================================================
-- Helper Functions
-- =====================================================

-- Function: Get waitlist subscribers with search and filtering
CREATE OR REPLACE FUNCTION get_waitlist_subscribers(
  search_query TEXT DEFAULT NULL,
  filter_source TEXT DEFAULT NULL,
  filter_active BOOLEAN DEFAULT true,
  limit_count INTEGER DEFAULT 50,
  offset_count INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  full_name TEXT,
  email TEXT,
  source TEXT,
  subscribed_at TIMESTAMPTZ,
  is_active BOOLEAN,
  metadata JSONB
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ws.id,
    ws.full_name,
    ws.email,
    ws.source,
    ws.subscribed_at,
    ws.is_active,
    ws.metadata
  FROM waitlist_subscribers ws
  WHERE 
    -- Filter by active status
    (filter_active IS NULL OR ws.is_active = filter_active)
    -- Filter by source
    AND (filter_source IS NULL OR ws.source = filter_source)
    -- Search by name or email
    AND (
      search_query IS NULL 
      OR ws.full_name ILIKE '%' || search_query || '%'
      OR ws.email ILIKE '%' || search_query || '%'
    )
  ORDER BY ws.subscribed_at DESC
  LIMIT limit_count
  OFFSET offset_count;
END;
$$;

-- Function: Get waitlist statistics
CREATE OR REPLACE FUNCTION get_waitlist_stats()
RETURNS TABLE (
  total_subscribers BIGINT,
  active_subscribers BIGINT,
  subscribers_by_source JSONB,
  subscribers_last_7_days BIGINT,
  subscribers_last_30_days BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    -- Total subscribers
    COUNT(*) AS total_subscribers,
    
    -- Active subscribers
    COUNT(*) FILTER (WHERE is_active = true) AS active_subscribers,
    
    -- Breakdown by source
    jsonb_object_agg(
      COALESCE(source, 'unknown'),
      count
    ) AS subscribers_by_source,
    
    -- Last 7 days
    COUNT(*) FILTER (
      WHERE subscribed_at >= now() - interval '7 days'
    ) AS subscribers_last_7_days,
    
    -- Last 30 days
    COUNT(*) FILTER (
      WHERE subscribed_at >= now() - interval '30 days'
    ) AS subscribers_last_30_days
    
  FROM (
    SELECT 
      is_active,
      source,
      subscribed_at,
      COUNT(*) as count
    FROM waitlist_subscribers
    GROUP BY is_active, source, subscribed_at
  ) stats;
END;
$$;

-- =====================================================
-- Comments for documentation
-- =====================================================

COMMENT ON TABLE waitlist_subscribers IS 
  'Stores email subscriptions for CENIE platform launch notifications and updates';

COMMENT ON COLUMN waitlist_subscribers.id IS 
  'Unique identifier for the subscriber';

COMMENT ON COLUMN waitlist_subscribers.full_name IS 
  'Subscriber full name (minimum 2 characters)';

COMMENT ON COLUMN waitlist_subscribers.email IS 
  'Subscriber email address (validated format, unique case-insensitive)';

COMMENT ON COLUMN waitlist_subscribers.source IS 
  'Source of subscription: hub, editorial, academy, agency, evelas, or other';

COMMENT ON COLUMN waitlist_subscribers.subscribed_at IS 
  'Timestamp when the subscription was created';

COMMENT ON COLUMN waitlist_subscribers.is_active IS 
  'Whether the subscription is active (for future opt-out functionality)';

COMMENT ON COLUMN waitlist_subscribers.metadata IS 
  'Additional metadata for future expansion (interests, tags, preferences, etc.)';

-- =====================================================
-- Migration Complete
-- =====================================================
-- Tables created: 1 (waitlist_subscribers)
-- Indexes created: 4
-- RLS Policies: 2
-- Functions: 2
-- =====================================================

