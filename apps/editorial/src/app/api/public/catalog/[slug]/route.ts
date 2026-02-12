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
 * GET /api/public/catalog/[slug]
 * Get a single published volume by slug with contributors (public access, no auth)
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const supabase = createNextServerClient()

    // Get volume (only if published)
    const { data: volume, error: volumeError } = await supabase
      .from('catalog_volumes')
      .select('*')
      .eq('slug', slug)
      .eq('publication_status', 'published')
      .single()

    if (volumeError) {
      if (volumeError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Volume not found' }, { status: 404 })
      }
      console.error('Database error:', volumeError)
      return NextResponse.json({ error: volumeError.message }, { status: 500 })
    }

    // Get contributors
    const { data: contributors, error: contributorsError } = await supabase.rpc(
      'get_volume_contributors' as any,
      { volume_uuid: (volume as any).id } as any
    )

    if (contributorsError) {
      console.error('Contributors fetch error:', contributorsError)
      // Don't fail, just return empty
    }

    // Get related volumes (same category, limit 5)
    let relatedVolumes: any[] = []
    if ((volume as any).categories && (volume as any).categories.length > 0) {
      const { data: related } = await supabase
        .from('catalog_volumes')
        .select(
          'id, title, subtitle, slug, authors_display, cover_url, cover_twicpics_path, cover_fallback_url, publication_year, categories'
        )
        .eq('publication_status', 'published')
        .overlaps('categories', (volume as any).categories)
        .neq('id', (volume as any).id)
        .limit(5)

      relatedVolumes = (related || []).map(enrichCoverUrl)
    }

    return NextResponse.json({
      volume: enrichCoverUrl(volume as Record<string, unknown>),
      contributors: contributors || [],
      related: relatedVolumes,
    })
  } catch (error) {
    console.error('Get public volume error:', error)
    return NextResponse.json(
      {
        error: 'Failed to get volume',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
