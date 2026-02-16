import { NextRequest, NextResponse } from 'next/server'
import { createNextServerClient } from '@cenie/supabase/server'
import { requireViewer } from '@/lib/auth'
import { logger } from '@/lib/logger'

/**
 * GET /api/contributors/search
 * Search contributors by name (for autocomplete)
 * Query params:
 * - q: search query (required)
 * - role: filter by role (optional)
 * - limit: number of results (optional, default: 10)
 */
export const GET = requireViewer(async (request: NextRequest) => {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')
    const role = searchParams.get('role')
    const limit = parseInt(searchParams.get('limit') || '10')

    if (!query) {
      return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 })
    }

    const supabase = createNextServerClient()

    let dbQuery = supabase
      .from('contributors')
      .select('id, full_name, slug, primary_role, photo_url, photo_twicpics_path, nationality')
      .eq('is_active', true)
      .or(`full_name.ilike.%${query}%,slug.ilike.%${query}%`)
      .order('full_name', { ascending: true })
      .limit(limit)

    if (role) {
      dbQuery = dbQuery.eq('primary_role', role)
    }

    const { data, error } = await dbQuery

    if (error) {
      logger.error('Search error', { error, query, role })
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ contributors: data })
  } catch (error) {
    logger.error('Search contributors error', { error })
    return NextResponse.json(
      {
        error: 'Failed to search contributors',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
})
