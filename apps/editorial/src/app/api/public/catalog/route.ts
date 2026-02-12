import { NextRequest, NextResponse } from 'next/server'
import { createNextServerClient } from '@cenie/supabase/server'
import { getBookCoverUrl } from '@/lib/twicpics'

/**
 * Ensure cover_url is populated from cover_twicpics_path if missing.
 * Handles volumes saved before cover_url was computed server-side.
 */
function enrichCoverUrl(volume: Record<string, unknown>): Record<string, unknown> {
  if (!volume.cover_url && volume.cover_twicpics_path) {
    return {
      ...volume,
      cover_url: getBookCoverUrl(volume.cover_twicpics_path as string, 'medium'),
    }
  }
  return volume
}

/**
 * GET /api/public/catalog
 * List published catalog volumes (public access, no auth)
 * Query params:
 * - page: page number (default: 1)
 * - per_page: items per page (default: 20, max: 100)
 * - search: full-text search query (optional)
 * - categories: comma-separated categories filter (optional)
 * - type: volume_type filter (translated|original|adapted) (optional)
 * - featured: only featured volumes (optional)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams

    const page = parseInt(searchParams.get('page') || '1')
    const perPage = Math.min(parseInt(searchParams.get('per_page') || '20'), 100)
    const searchQuery = searchParams.get('search')
    const categoriesParam = searchParams.get('categories')
    const typeParam = searchParams.get('type')
    const featuredParam = searchParams.get('featured')

    const supabase = createNextServerClient()

    // Base query - only published volumes
    let query = supabase
      .from('catalog_volumes')
      .select('*', { count: 'exact' })
      .eq('publication_status', 'published')

    // Filter by featured
    if (featuredParam === 'true') {
      query = query.eq('featured', true)
    }

    // Filter by type
    if (typeParam && ['translated', 'original', 'adapted'].includes(typeParam)) {
      query = query.eq('volume_type', typeParam)
    }

    // Filter by categories
    if (categoriesParam) {
      const categories = categoriesParam
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean)
      if (categories.length > 0) {
        query = query.overlaps('categories', categories)
      }
    }

    // Full-text search
    if (searchQuery) {
      // Use the search_catalog_volumes function
      const { data: searchResults, error: searchError } = await supabase.rpc(
        'search_catalog_volumes' as any,
        {
          search_query: searchQuery,
          limit_count: perPage * 10, // Get more for pagination
          only_published: true,
        } as any
      )

      if (searchError) {
        console.error('Search error:', searchError)
        return NextResponse.json({ error: searchError.message }, { status: 500 })
      }

      // Apply pagination to search results
      const start = (page - 1) * perPage
      const end = start + perPage
      const results = (searchResults as any[]) || []
      const paginatedResults = results.slice(start, end)

      return NextResponse.json({
        volumes: paginatedResults.map(enrichCoverUrl),
        pagination: {
          page,
          per_page: perPage,
          total: results.length,
          total_pages: Math.ceil(results.length / perPage),
        },
      })
    }

    // Regular query with pagination
    const from = (page - 1) * perPage
    const to = from + perPage - 1

    // Order by published date (newest first), or by display_order if featured
    if (featuredParam === 'true') {
      query = query.order('display_order', { ascending: true, nullsFirst: false })
    } else {
      query = query.order('published_at', { ascending: false })
    }

    query = query.range(from, to)

    const { data, error, count } = await query

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      volumes: (data || []).map(enrichCoverUrl),
      pagination: {
        page,
        per_page: perPage,
        total: count || 0,
        total_pages: Math.ceil((count || 0) / perPage),
      },
    })
  } catch (error) {
    console.error('List public catalog error:', error)
    return NextResponse.json(
      {
        error: 'Failed to list catalog volumes',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
