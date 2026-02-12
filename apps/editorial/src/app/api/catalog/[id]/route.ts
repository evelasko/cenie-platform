import { NextResponse } from 'next/server'
import { createNextServerClient } from '@cenie/supabase/server'
import { requireViewer, requireEditor } from '@/lib/auth'
import { getBookCoverUrl } from '@/lib/twicpics'
import type { CatalogVolumeUpdateInput } from '@/types/books'

/**
 * GET /api/catalog/[id]
 * Get a single catalog volume by ID with contributors
 */
export const GET = requireViewer<Promise<{ id: string }>>(
  async (_request, context) => {
    const { params } = context
    if (!params) return NextResponse.json({ error: 'Missing params' }, { status: 400 })
    try {
      // User is authenticated and has viewer role or higher
      const { id } = await params
      const supabase = createNextServerClient()

      // Get volume
      const { data: volume, error: volumeError } = await supabase
        .from('catalog_volumes')
        .select('*')
        .eq('id', id)
        .single()

      if (volumeError) {
        if (volumeError.code === 'PGRST116') {
          return NextResponse.json({ error: 'Volume not found' }, { status: 404 })
        }
        console.error('Database error:', volumeError)
        return NextResponse.json({ error: volumeError.message }, { status: 500 })
      }

      // Get contributors for this volume
      const { data: contributors, error: contributorsError } = await supabase.rpc(
        'get_volume_contributors' as any,
        { volume_uuid: id } as any
      )

      if (contributorsError) {
        console.error('Contributors fetch error:', contributorsError)
        // Don't fail, just return empty array
      }

      return NextResponse.json({
        volume,
        contributors: contributors || [],
      })
    } catch (error) {
      console.error('Get volume error:', error)
      return NextResponse.json(
        {
          error: 'Failed to get volume',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
        { status: 500 }
      )
    }
  }
)

/**
 * PATCH /api/catalog/[id]
 * Update a catalog volume
 * Requires: editor or admin role
 */
export const PATCH = requireEditor<Promise<{ id: string }>>(
  async (request, context) => {
    const { params } = context
    if (!params) return NextResponse.json({ error: 'Missing params' }, { status: 400 })
    try {
      // User is authenticated and has editor role or higher
      const { id } = await params
      const supabase = createNextServerClient()
      const body: CatalogVolumeUpdateInput = await request.json()

      // If slug is being changed, check it's unique
      if (body.slug) {
        const { data: existingVolume, error: checkError } = await supabase
          .from('catalog_volumes')
          .select('id')
          .eq('slug', body.slug)
          .neq('id', id)
          .single()

        if (checkError && checkError.code !== 'PGRST116') {
          console.error('Slug check error:', checkError)
          return NextResponse.json(
            { error: 'Failed to validate slug uniqueness' },
            { status: 500 }
          )
        }

        if (existingVolume) {
          return NextResponse.json(
            {
              error: 'A volume with this slug already exists',
              slug: body.slug,
            },
            { status: 409 }
          )
        }
      }

      // Compute the denormalized cover_url from the TwicPics path
      // This is the URL used by public-facing pages to display the cover
      const coverUrl = body.cover_twicpics_path
        ? getBookCoverUrl(body.cover_twicpics_path, 'medium')
        : null

      // Update the volume
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase.from('catalog_volumes') as any)
        .update({
          title: body.title,
          subtitle: body.subtitle,
          description: body.description,
          publisher_id: body.publisher_id,
          publisher_name: body.publisher_name,
          publication_year: body.publication_year,
          isbn_13: body.isbn_13,
          isbn_10: body.isbn_10,
          language: body.language,
          page_count: body.page_count,
          cover_twicpics_path: body.cover_twicpics_path,
          cover_url: coverUrl,
          cover_fallback_url: body.cover_fallback_url,
          categories: body.categories,
          tags: body.tags,
          featured: body.featured,
          table_of_contents: body.table_of_contents,
          excerpt: body.excerpt,
          reviews_quotes: body.reviews_quotes,
          editorial_team: body.editorial_team,
          compilation_notes: body.compilation_notes,
          seo_description: body.seo_description,
          seo_keywords: body.seo_keywords,
          slug: body.slug,
        })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return NextResponse.json({ error: 'Volume not found' }, { status: 404 })
        }
        console.error('Database error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ volume: data })
    } catch (error) {
      console.error('Update volume error:', error)
      return NextResponse.json(
        {
          error: 'Failed to update volume',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
        { status: 500 }
      )
    }
  }
)

/**
 * DELETE /api/catalog/[id]
 * Delete a catalog volume
 * Requires: editor or admin role
 */
export const DELETE = requireEditor<Promise<{ id: string }>>(
  async (_request, context) => {
    const { params } = context
    if (!params) return NextResponse.json({ error: 'Missing params' }, { status: 400 })
    try {
      // User is authenticated and has editor role or higher
      const { id } = await params
      const supabase = createNextServerClient()

      const { error } = await supabase.from('catalog_volumes').delete().eq('id', id)

      if (error) {
        console.error('Database error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ success: true })
    } catch (error) {
      console.error('Delete volume error:', error)
      return NextResponse.json(
        {
          error: 'Failed to delete volume',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
        { status: 500 }
      )
    }
  }
)
