import { NextResponse } from 'next/server'
import { createNextServerClient } from '@cenie/supabase/server'
import { getBookCoverUrl } from '@/lib/twicpics'
import { logger } from '@/lib/logger'

/**
 * Ensure cover_url is populated from cover_twicpics_path if missing.
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
 * GET /api/public/catalog/hero
 * Returns the current hero catalog volume (public, no auth required).
 * Returns 404 if no hero is currently set.
 */
export async function GET() {
  try {
    const supabase = createNextServerClient()

    const { data, error } = await supabase
      .from('catalog_volumes')
      .select('*')
      .eq('hero', true)
      .eq('publication_status', 'published')
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned — no hero is set
        return NextResponse.json({ volume: null }, { status: 404 })
      }
      logger.error('[Public Catalog Hero] Database error', { error })
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ volume: enrichCoverUrl(data as Record<string, unknown>) })
  } catch (error) {
    logger.error('[Public Catalog Hero] Unexpected error', { error })
    return NextResponse.json(
      {
        error: 'Failed to fetch hero volume',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
