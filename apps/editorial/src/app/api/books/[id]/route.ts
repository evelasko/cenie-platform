import { NextRequest, NextResponse } from 'next/server'
import { createNextServerClient } from '@cenie/supabase/server'
import { requireEditorialAccess, requireRole } from '@/lib/auth-helpers'
import type { BookUpdateInput } from '@/types/books'

/**
 * GET /api/books/[id]
 * Get a single book by database ID
 */
export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Require authentication and editorial access
    const authResult = await requireEditorialAccess()
    if (authResult instanceof NextResponse) {
      return authResult
    }

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

/**
 * PATCH /api/books/[id]
 * Update a book's editorial metadata
 * Requires: editor or admin role
 */
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Require editor or admin role
    const authResult = await requireRole('editor')
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { user } = authResult
    const { id } = await params
    const supabase = createNextServerClient()
    const body: BookUpdateInput = await request.json()

    // Prepare update data
    const updateData: any = { ...body }

    // If status is being changed to a reviewed state, track the reviewer
    if (body.status && ['under_review', 'selected', 'rejected'].includes(body.status)) {
      updateData.reviewed_by = user.uid
      updateData.reviewed_at = new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('books')
      // @ts-expect-error - Supabase type limitation with dynamic update objects
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Book not found' }, { status: 404 })
      }
      console.error('Database update error:', error)
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

/**
 * DELETE /api/books/[id]
 * Delete a book from the database
 * Requires: admin role
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Require admin role
    const authResult = await requireRole('admin')
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { id } = await params
    const supabase = createNextServerClient()

    const { error } = await supabase.from('books').delete().eq('id', id)

    if (error) {
      console.error('Database delete error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
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
