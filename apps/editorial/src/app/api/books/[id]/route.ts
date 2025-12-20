import { NextRequest, NextResponse } from 'next/server'
import { createNextServerClient } from '@cenie/supabase/server'
import { requireViewer, requireEditor } from '@/lib/auth'
import type { BookUpdateInput } from '@/types/books'

/**
 * GET /api/books/[id]
 * Get a single book by database ID
 */
export const GET = requireViewer(
  async (_request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
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
export const PATCH = requireEditor(
  async (request: NextRequest, context: { params: Promise<{ id: string }>; user: any }) => {
    try {
      // User is authenticated and has editor role or higher
      const { params, user } = context
      const { id } = await params
      const supabase = createNextServerClient()
      const body: BookUpdateInput = await request.json()

      const { data, error } = await supabase
        .from('books')
        .update({
          title: body.title,
          subtitle: body.subtitle,
          authors: body.authors,
          selected_for_translation: body.selected_for_translation,
          status: body.status,
          source_language: body.source_language,
          target_language: body.target_language,
          translation_notes: body.translation_notes,
          updated_by: user.uid,
        })
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
export const DELETE = requireEditor(
  async (_request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
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
