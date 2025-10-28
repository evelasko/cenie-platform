import { NextRequest, NextResponse } from 'next/server'
import { createNextServerClient } from '@cenie/supabase/server'
import type { BookUpdateInput } from '@/types/books'

/**
 * GET /api/books/[id]
 * Get a single book by database ID
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
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
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = createNextServerClient()
    const body: BookUpdateInput = await request.json()

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Check if user has permission (admin or editor)
    if (user) {
      const { data: access, error: accessError } = await supabase
        .from('user_app_access')
        .select('*')
        .eq('user_id', user.id)
        .eq('app_name', 'editorial')
        .eq('is_active', true)
        .maybeSingle()

      if (accessError || !access || !['admin', 'editor'].includes((access as any).role)) {
        return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
      }
    }

    // Prepare update data
    const updateData: any = { ...body }

    // If status is being changed to a reviewed state, track the reviewer
    if (
      body.status &&
      ['under_review', 'selected', 'rejected'].includes(body.status) &&
      user
    ) {
      updateData.reviewed_by = user.id
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
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = createNextServerClient()

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Check if user has admin permission
    if (user) {
      const { data: access, error: accessError } = await supabase
        .from('user_app_access')
        .select('*')
        .eq('user_id', user.id)
        .eq('app_name', 'editorial')
        .eq('is_active', true)
        .maybeSingle()

      if (accessError || !access || (access as any).role !== 'admin') {
        return NextResponse.json({ error: 'Admin permission required' }, { status: 403 })
      }
    }

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
