import { NextRequest, NextResponse } from 'next/server'
import { createNextServerClient } from '@cenie/supabase/server'
import { getBookCoverUrl } from '@/lib/twicpics'
import { logger } from '@/lib/logger'

/**
 * GET /api/public/proximamente/[slug]
 * Get a single draft volume or book by slug (public access, no auth)
 * - catalog_volumes: slug = volume slug
 * - books: slug = "book-{id}"
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const supabase = createNextServerClient()

    // Books selected for translation: slug format "book-{uuid}"
    if (slug.startsWith('book-')) {
      const bookId = slug.replace(/^book-/, '')
      const { data: book, error: bookError } = await supabase
        .from('books')
        .select('*')
        .eq('id', bookId)
        .eq('selected_for_translation', true)
        .eq('promoted_to_catalog', false)
        .single()

      if (bookError || !book) {
        return NextResponse.json({ error: 'Book not found' }, { status: 404 })
      }

      const b = book as Record<string, unknown>
      const displayTitle =
        (b.spanish_title as string) || (b.translated_title as string) || (b.title as string)
      const authors = (b.spanish_authors as string[]) || (b.authors as string[])
      const authorsDisplay = authors?.length ? authors.join(', ') : 'CENIE Editorial'
      const coverPath = b.temp_cover_twicpics_path as string | null
      const coverUrl = coverPath ? getBookCoverUrl(coverPath, 'medium') : null

      const volume = {
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
        original_title: b.title as string,
        original_language: (b.language as string) || 'en',
        original_publisher: null,
        original_publication_year: b.published_date
          ? parseInt(String(b.published_date).slice(0, 4))
          : null,
        table_of_contents: b.publication_table_of_contents as object | null,
        excerpt: b.publication_excerpt_es as string | null,
        _source: 'book',
      }

      return NextResponse.json({
        volume,
        contributors: [],
        related: [],
      })
    }

    // Catalog volume (draft)
    const { data: volume, error: volumeError } = await supabase
      .from('catalog_volumes')
      .select('*')
      .eq('slug', slug)
      .eq('publication_status', 'draft')
      .single()

    if (volumeError) {
      if (volumeError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Volume not found' }, { status: 404 })
      }
      logger.error('Database error', { error: volumeError, slug })
      return NextResponse.json({ error: volumeError.message }, { status: 500 })
    }

    // Get contributors
    const { data: contributors, error: contributorsError } = await supabase.rpc(
      'get_volume_contributors' as any,
      { volume_uuid: (volume as any).id } as any
    )

    if (contributorsError) {
      logger.error('Contributors fetch error', { error: contributorsError, volumeId: (volume as any).id })
      // Don't fail, just return empty
    }

    // Get related drafts (same category, limit 5)
    let relatedVolumes: any[] = []
    if ((volume as any).categories && (volume as any).categories.length > 0) {
      const { data: related } = await supabase
        .from('catalog_volumes')
        .select(
          'id, title, subtitle, slug, authors_display, cover_url, cover_fallback_url, publication_year, categories'
        )
        .eq('publication_status', 'draft')
        .overlaps('categories', (volume as any).categories)
        .neq('id', (volume as any).id)
        .limit(5)

      relatedVolumes = related || []
    }

    return NextResponse.json({
      volume: { ...(volume as Record<string, unknown>), _source: 'volume' },
      contributors: contributors || [],
      related: relatedVolumes,
    })
  } catch (error) {
    logger.error('Get proximamente volume error', { error })
    return NextResponse.json(
      {
        error: 'Failed to get volume',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
