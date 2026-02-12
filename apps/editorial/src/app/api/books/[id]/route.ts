import { NextResponse } from 'next/server'
import { createNextServerClient } from '@cenie/supabase/server'
import { requireViewer, requireEditor } from '@/lib/auth'
import type { BookUpdateInput } from '@/types/books'

/**
 * GET /api/books/[id]
 * Get a single book by database ID
 */
export const GET = requireViewer<Promise<{ id: string }>>(
  async (_request, context) => {
    const { params } = context
    if (!params) return NextResponse.json({ error: 'Missing params' }, { status: 400 })
    try {
      // User is authenticated and has viewer role or higher
      const { id } = await params
      const supabase = createNextServerClient()

      const { data, error } = await supabase.from('books').select('*').eq('id', id).single()

      if (error) {
        if (error.code === 'PGRST116') {
          return NextResponse.json({ error: 'Book not found' }, { status: 404 })
        }
        console.error('Database error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ book: data })
    } catch (error) {
      console.error('Get book error:', error)
      return NextResponse.json(
        {
          error: 'Failed to get book',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
        { status: 500 }
      )
    }
  }
)

/**
 * PATCH /api/books/[id]
 * Update a book's editorial metadata
 * Requires: editor or admin role
 */
export const PATCH = requireEditor<Promise<{ id: string }>>(
  async (request, context) => {
    try {
      // User is authenticated and has editor role or higher
      const { params, user } = context
      if (!params) return NextResponse.json({ error: 'Missing params' }, { status: 400 })
      const { id } = await params
      const supabase = createNextServerClient()
      const body: BookUpdateInput = await request.json()

      // Build update payload from allowed fields only (books table has no updated_by column)
      const updatePayload: Record<string, unknown> = {}
      const allowedFields = [
        'title',
        'subtitle',
        'authors',
        'selected_for_translation',
        'status',
        'translated_title',
        'translation_priority',
        'marketability_score',
        'relevance_score',
        'internal_notes',
        'rejection_reason',
        'publication_description_es',
        'publication_excerpt_es',
        'publication_table_of_contents',
        'temp_cover_twicpics_path',
        'temp_authors',
        'temp_translators',
      ] as const

      for (const field of allowedFields) {
        if (field in body && body[field] !== undefined) {
          updatePayload[field] = body[field]
        }
      }

      const { data, error } = await supabase
        .from('books')
        .update(updatePayload)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return NextResponse.json({ error: 'Book not found' }, { status: 404 })
        }
        console.error('Database error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ book: data })
    } catch (error) {
      console.error('Update book error:', error)
      return NextResponse.json(
        {
          error: 'Failed to update book',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
        { status: 500 }
      )
    }
  }
)

/**
 * DELETE /api/books/[id]
 * Delete a book
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

      const { error } = await supabase.from('books').delete().eq('id', id)

      if (error) {
        console.error('Database error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ success: true })
    } catch (error) {
      console.error('Delete book error:', error)
      return NextResponse.json(
        {
          error: 'Failed to delete book',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
        { status: 500 }
      )
    }
  }
)
