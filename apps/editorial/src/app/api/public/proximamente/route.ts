import { NextRequest, NextResponse } from 'next/server'
import { createNextServerClient } from '@cenie/supabase/server'
import { getBookCoverUrl } from '@/lib/twicpics'

/**
 * GET /api/public/proximamente
 * List draft catalog volumes and books selected for translation (coming soon)
 * Includes:
 * - Draft catalog_volumes (about to be published)
 * - Books with selected_for_translation that are not yet promoted to catalog
 *
 * Query params:
 * - page: page number (default: 1)
 * - per_page: items per page (default: 20, max: 100)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams

    const page = parseInt(searchParams.get('page') || '1')
    const perPage = Math.min(parseInt(searchParams.get('per_page') || '20'), 100)

    const supabase = createNextServerClient()

    const from = (page - 1) * perPage
    const to = from + perPage - 1

    // 1. Draft catalog volumes
    const { data: draftVolumes, error: volumesError } = await supabase
      .from('catalog_volumes')
      .select('*')
      .eq('publication_status', 'draft')
      .order('created_at', { ascending: false })

    if (volumesError) {
      console.error('Proximamente list error:', volumesError)
      return NextResponse.json({ error: volumesError.message }, { status: 500 })
    }

    // 2. Books selected for translation, not yet promoted (future catalog volumes)
    const { data: selectedBooks, error: booksError } = await supabase
      .from('books')
      .select(
        'id, title, subtitle, translated_title, spanish_title, spanish_subtitle, authors, spanish_authors, temp_cover_twicpics_path, publication_description_es, added_at'
      )
      .eq('selected_for_translation', true)
      .eq('promoted_to_catalog', false)
      .order('added_at', { ascending: false })

    if (booksError) {
      console.error('Proximamente books error:', booksError)
      // Non-fatal: continue with volumes only
    }

    // Map books to catalog-volume-like shape for unified display
    const bookItems = (selectedBooks || []).map((b: Record<string, unknown>) => {
      const displayTitle =
        (b.spanish_title as string) || (b.translated_title as string) || (b.title as string)
      const authors = (b.spanish_authors as string[]) || (b.authors as string[])
      const authorsDisplay = authors?.length ? authors.join(', ') : 'CENIE Editorial'
      const coverPath = b.temp_cover_twicpics_path as string | null
      const coverUrl = coverPath ? getBookCoverUrl(coverPath, 'medium') : null

      return {
        id: b.id,
        title: displayTitle,
        subtitle: (b.spanish_subtitle as string) || (b.subtitle as string) || null,
        authors_display: authorsDisplay,
        description: (b.publication_description_es as string) || null,
        cover_url: coverUrl,
        cover_fallback_url: null,
        slug: `book-${b.id}`,
        publication_status: 'draft',
        volume_type: 'translated',
        created_at: b.added_at,
        _source: 'book',
      }
    })

    // Merge and sort by date (newest first)
    const merged = [
      ...(draftVolumes || []).map((v: Record<string, unknown>) => ({ ...v, _source: 'volume' })),
      ...bookItems,
    ].sort((a: Record<string, unknown>, b: Record<string, unknown>) => {
      const dateA = new Date((a.created_at as string) || 0).getTime()
      const dateB = new Date((b.created_at as string) || 0).getTime()
      return dateB - dateA
    })

    // Paginate
    const total = merged.length
    const paginated = merged.slice(from, to + 1)

    return NextResponse.json({
      volumes: paginated,
      pagination: {
        page,
        per_page: perPage,
        total,
        total_pages: Math.ceil(total / perPage),
      },
    })
  } catch (error) {
    console.error('List proximamente error:', error)
    return NextResponse.json(
      {
        error: 'Failed to list upcoming volumes',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
