-- =====================================================
-- Fix Waitlist RLS Policy for Public Access
-- =====================================================
-- Issue: RLS blocking inserts from public API
-- Solution: Update policy to properly allow anonymous inserts
-- =====================================================

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Allow public insert for waitlist" ON waitlist_subscribers;
DROP POLICY IF EXISTS "Allow service role select for waitlist" ON waitlist_subscribers;

-- Create new permissive INSERT policy for anonymous users
CREATE POLICY "Allow anonymous insert for waitlist" 
  ON waitlist_subscribers
  FOR INSERT
  WITH CHECK (true);

-- Allow authenticated admin users to SELECT (for GET endpoint)
CREATE POLICY "Allow authenticated select for waitlist" 
  ON waitlist_subscribers
  FOR SELECT
  TO authenticated
  USING (
    -- This will be checked at API level via Firebase
    -- Just allow any authenticated user here
    true
  );

-- Prevent direct UPDATE/DELETE (must go through API)
CREATE POLICY "Prevent direct updates"
  ON waitlist_subscribers
  FOR UPDATE
  USING (false);

CREATE POLICY "Prevent direct deletes"
  ON waitlist_subscribers
  FOR DELETE
  USING (false);

-- Verify RLS is enabled
ALTER TABLE waitlist_subscribers ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- Verification
-- =====================================================
-- Run this to verify policies are active:
-- SELECT * FROM pg_policies WHERE tablename = 'waitlist_subscribers';
-- =====================================================

