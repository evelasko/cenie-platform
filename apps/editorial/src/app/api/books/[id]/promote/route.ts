import { NextResponse } from 'next/server'
import { createNextServerClient } from '@cenie/supabase/server'
import { requireEditor } from '@/lib/auth'
import type { Book, PromoteToCatalogInput } from '@/types/books'
import { logger } from '@/lib/logger'

/**
 * POST /api/books/[id]/promote
 * Promote a book from editorial workspace to public catalog
 * Requires: editor or admin role
 *
 * Body:
 * - catalogData: CatalogVolumeCreateInput data
 * - contributors: Array of {contributor_id, role, display_order}
 */
export const POST = requireEditor<Promise<{ id: string }>>(
  async (request, context) => {
    try {
      // User is authenticated and has editor role or higher
      const { params, user } = context
      if (!params) return NextResponse.json({ error: 'Missing params' }, { status: 400 })
      const { id } = await params
      const supabase = createNextServerClient()

      const body = await request.json()
      const { catalogData, contributors } = body as {
        catalogData: PromoteToCatalogInput
        contributors?: Array<{
          contributor_id: string
          role: string
          display_order: number
          is_original_contributor: boolean
        }>
      }

      // Get the book to verify it exists and is selected for translation
      const { data: book, error: bookError } = await supabase
        .from('books')
        .select('*')
        .eq('id', id)
        .single()

      if (bookError || !book) {
        return NextResponse.json({ error: 'Book not found' }, { status: 404 })
      }

      const typedBook = book as unknown as Book

      if (typedBook.promoted_to_catalog) {
        return NextResponse.json(
          {
            error: 'Book already promoted to catalog',
            catalog_volume_id: typedBook.catalog_volume_id,
          },
          { status: 409 }
        )
      }

      // Call the database function to promote book to catalog
      const { data: volumeIdData, error: promoteError } = await supabase.rpc(
        'promote_book_to_catalog' as any,
        {
          book_uuid: id,
          catalog_data: catalogData,
          user_id: user.uid,
        } as any
      )

      if (promoteError) {
        logger.error('Promote error', { error: promoteError, bookId: id })
        return NextResponse.json(
          { error: 'Failed to promote book to catalog', details: promoteError.message },
          { status: 500 }
        )
      }

      const volumeId = volumeIdData

      // Link contributors if provided
      if (contributors && contributors.length > 0) {
        const contributorInserts = contributors.map((contrib) => ({
          volume_id: volumeId,
          contributor_id: contrib.contributor_id,
          role: contrib.role,
          display_order: contrib.display_order,
          is_original_contributor: contrib.is_original_contributor,
        }))

        const { error: contributorsError } = await supabase
          .from('volume_contributors')
          .insert(contributorInserts as any)

        if (contributorsError) {
          logger.error('Contributors link error', { error: contributorsError, volumeId })
          // Don't fail the whole operation, just log the error
          logger.warn('Volume created but contributors failed to link', { volumeId })
        }

        // Update display fields
        const { error: displayError } = await supabase.rpc(
          'update_volume_display_fields' as any,
          {
            volume_uuid: volumeId,
          } as any
        )

        if (displayError) {
          logger.error('Display fields update error', { error: displayError, volumeId })
          // Non-critical error, continue
        }
      }

      // Fetch the created volume
      const { data: volume, error: volumeError } = await supabase
        .from('catalog_volumes')
        .select('*')
        .eq('id', volumeId)
        .single()

      if (volumeError) {
        logger.error('Volume fetch error', { error: volumeError, volumeId })
      }

      return NextResponse.json({
        success: true,
        volume_id: volumeId,
        volume,
        message: 'Book successfully promoted to catalog',
      })
    } catch (error) {
      logger.error('Promote to catalog error', { error })
      return NextResponse.json(
        {
          error: 'Failed to promote book to catalog',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
        { status: 500 }
      )
    }
  }
)
