import { createClient } from '@supabase/supabase-js'

import type { Database } from './types/database'

/**
 * Creates a Supabase client for build-time / static generation contexts
 * (e.g. sitemap, generateMetadata) where cookies() from next/headers is unavailable.
 *
 * Uses the anon key only - no session/cookies. Safe for public data that RLS
 * allows anonymous access to (e.g. catalog_volumes, books).
 *
 * Do NOT use for request-scoped server code - use createNextServerClient instead.
 */
export function createStaticClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are required')
  }
  return createClient<Database>(url, key)
}
