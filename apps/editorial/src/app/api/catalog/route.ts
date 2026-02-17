import { NextRequest, NextResponse } from 'next/server'
import { withErrorHandling } from '@cenie/errors/next'
import { withLogging } from '@cenie/logger/next'
import { DatabaseError, ValidationError, ConflictError } from '@cenie/errors'
import { createNextServerClient } from '@cenie/supabase/server'
import { requireViewer, requireEditor } from '@/lib/auth'
import { logger } from '@/lib/logger'
import { getBookCoverUrl } from '@/lib/twicpics'
import { generateSlug } from '@/lib/slug'
import type { CatalogVolumeCreateInput } from '@/types/books'

/**
 * GET /api/catalog
 * List catalog volumes (admin view - includes drafts and books selected for translation)
 * Query params:
 * - status: filter by publication_status (optional)
 * - type: filter by volume_type (optional)
 * - limit: number of results (optional, default: 50)
 *
 * Books selected for translation (not yet promoted) appear as future catalog volumes
 * when status is 'all' or 'draft' and type is 'all' or 'translated'.
 */
export const GET = withErrorHandling(
  withLogging(
    requireViewer(async (request: NextRequest) => {
      const supabase = createNextServerClient()
      const searchParams = request.nextUrl.searchParams

      const status = searchParams.get('status')
      const type = searchParams.get('type')
      const limitParam = searchParams.get('limit')
      const limit = limitParam ? parseInt(limitParam) : 50

      if (limitParam && (isNaN(limit) || limit < 1 || limit > 100)) {
        throw new ValidationError('Invalid limit parameter', {
          userMessage: 'Limit must be between 1 and 100',
          metadata: { limit: limitParam },
        })
      }

      let query = supabase
        .from('catalog_volumes')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit)

      if (status) {
        query = query.eq('publication_status', status)
      }

      if (type) {
        query = query.eq('volume_type', type)
      }

      const { data: volumesData, error } = await query

      if (error) {
        throw new DatabaseError('Failed to fetch catalog volumes', {
          cause: error,
          metadata: {
            status,
            type,
            limit,
          },
        })
      }

      let volumes = (volumesData || []) as Record<string, unknown>[]

      // Include books selected for translation (future catalog volumes) when filters allow
      const includeBooks =
        (!status || status === 'all' || status === 'draft') &&
        (!type || type === 'all' || type === 'translated')

      if (includeBooks) {
        const { data: selectedBooks, error: booksError } = await supabase
          .from('books')
          .select(
            'id, title, subtitle, translated_title, spanish_title, spanish_subtitle, authors, spanish_authors, temp_cover_twicpics_path, publication_description_es, translation_slug, added_at'
          )
          .eq('selected_for_translation', true)
          .eq('promoted_to_catalog', false)
          .order('added_at', { ascending: false })

        if (!booksError && selectedBooks?.length) {
          const bookItems = selectedBooks.map((b: Record<string, unknown>) => {
            const displayTitle =
              (b.spanish_title as string) || (b.translated_title as string) || (b.title as string)
            const authors = (b.spanish_authors as string[]) || (b.authors as string[])
            const authorsDisplay = authors?.length ? authors.join(', ') : null
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
              slug: (b.translation_slug as string) || `book-${b.id}`,
              publication_status: 'draft',
              volume_type: 'translated',
              publisher_name: 'CENIE Editorial',
              created_at: b.added_at,
              _source: 'book',
            }
          })

          volumes = [...volumes, ...bookItems].sort((a, b) => {
            const dateA = new Date((a.created_at as string) || 0).getTime()
            const dateB = new Date((b.created_at as string) || 0).getTime()
            return dateB - dateA
          })

          volumes = volumes.slice(0, limit)
        }
      }

      logger.debug('[Catalog] Listed volumes', {
        count: volumes.length,
        status,
        type,
        includesBooks: includeBooks,
      })
      return NextResponse.json({ volumes })
    })
  )
)

/**
 * POST /api/catalog
 * Create a new catalog volume (for original publications)
 * Requires: editor or admin role
 */
export const POST = withErrorHandling(
  withLogging(
    requireEditor(async (request: NextRequest, { user }) => {
      // User is authenticated and has editor role or higher
      const supabase = createNextServerClient()
    let body: CatalogVolumeCreateInput
    try {
      body = await request.json()
    } catch (parseError) {
      throw new ValidationError('Invalid JSON body', {
        cause: parseError,
        userMessage: 'Request body must be valid JSON',
      })
    }

    // Validate required fields
    if (!body.title || !body.description) {
      throw new ValidationError('Missing required fields', {
        userMessage: 'title and description are required',
        metadata: {
          hasTitle: !!body.title,
          hasDescription: !!body.description,
        },
      })
    }

    // Generate slug if not provided
    const slug = body.slug || generateSlug(body.title)

    // Check if slug already exists
    const { data: existingVolume, error: checkError } = await supabase
      .from('catalog_volumes')
      .select('id, title, slug')
      .eq('slug', slug)
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      // PGRST116 = no rows returned (expected if slug doesn't exist)
      throw new DatabaseError('Failed to check for existing volume', {
        cause: checkError,
        metadata: { slug },
      })
    }

    if (existingVolume) {
      throw new ConflictError('A volume with this slug already exists', {
        userMessage: 'A volume with this slug already exists',
        metadata: {
          slug,
          existingVolumeId: (existingVolume as any).id,
        },
      })
    }

    // Compute the denormalized cover_url from the TwicPics path
    // This is the URL used by public-facing pages to display the cover
    const coverUrl = body.cover_twicpics_path
      ? getBookCoverUrl(body.cover_twicpics_path, 'medium')
      : null

    // Insert catalog volume
    const { data, error } = await supabase
      .from('catalog_volumes')
      .insert({
        volume_type: body.volume_type,
        title: body.title,
        subtitle: body.subtitle || null,
        description: body.description,
        publisher_id: body.publisher_id || null,
        publisher_name: body.publisher_name || 'CENIE Editorial',
        publication_year: body.publication_year || null,
        isbn_13: body.isbn_13 || null,
        isbn_10: body.isbn_10 || null,
        language: body.language || 'es',
        page_count: body.page_count || null,
        cover_twicpics_path: body.cover_twicpics_path || null,
        cover_url: coverUrl,
        cover_fallback_url: body.cover_fallback_url || null,
        categories: body.categories || null,
        tags: body.tags || null,
        featured: body.featured || false,
        table_of_contents: body.table_of_contents || null,
        excerpt: body.excerpt || null,
        reviews_quotes: body.reviews_quotes || null,
        editorial_team: body.editorial_team || null,
        compilation_notes: body.compilation_notes || null,
        seo_description: body.seo_description || null,
        seo_keywords: body.seo_keywords || null,
        slug,
        created_by: user.uid,
        publication_status: 'draft',
      } as any)
      .select()
      .single()

    if (error) {
      // Handle unique constraint violation (race condition)
      if (error.code === '23505') {
        throw new ConflictError('A volume with this slug already exists', {
          userMessage: 'A volume with this slug already exists',
          metadata: {
            slug,
            code: error.code,
          },
        })
      }

      throw new DatabaseError('Failed to create catalog volume', {
        cause: error,
        metadata: {
          slug,
          title: body.title,
        },
      })
    }

      logger.info('[Catalog] Created volume', {
        volumeId: (data as any).id,
        slug,
        title: body.title,
        userId: user.uid,
      })

      return NextResponse.json({ volume: data }, { status: 201 })
    })
  )
)
