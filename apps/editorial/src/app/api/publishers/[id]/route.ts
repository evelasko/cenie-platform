import { NextRequest, NextResponse } from 'next/server'
import { createNextServerClient } from '@cenie/supabase/server'
import { requireEditorialAccess, requireRole } from '@/lib/auth-helpers'
import type { PublisherUpdateInput } from '@/types/books'

/**
 * GET /api/publishers/[id]
 * Get a single publisher by ID
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

    const { data, error } = await supabase.from('publishers').select('*').eq('id', id).single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Publisher not found' }, { status: 404 })
      }
      console.error('Database error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ publisher: data })
  } catch (error) {
    console.error('Get publisher error:', error)
    return NextResponse.json(
      {
        error: 'Failed to get publisher',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/publishers/[id]
 * Update a publisher
 * Requires: editor or admin role
 */
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Require editor or admin role
    const authResult = await requireRole('editor')
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { id } = await params
    const supabase = createNextServerClient()
    const body: PublisherUpdateInput = await request.json()

    // If slug is being changed, check it's unique
    if (body.slug) {
      const { data: existingPublisher } = await supabase
        .from('publishers')
        .select('id')
        .eq('slug', body.slug)
        .neq('id', id)
        .single()

      if (existingPublisher) {
        return NextResponse.json(
          { error: 'A publisher with this slug already exists' },
          { status: 409 }
        )
      }
    }

    // Update publisher
    const { data, error } = await supabase
      .from('publishers')
      // @ts-expect-error - publishers table not in auto-generated types
      .update(body)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Publisher not found' }, { status: 404 })
      }
      console.error('Database update error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ publisher: data })
  } catch (error) {
    console.error('Update publisher error:', error)
    return NextResponse.json(
      {
        error: 'Failed to update publisher',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/publishers/[id]
 * Soft delete a publisher (set is_active = false)
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

    // Soft delete by setting is_active to false
    const { data, error } = await supabase
      .from('publishers')
      // @ts-expect-error - publishers table not in auto-generated types
      .update({ is_active: false })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Publisher not found' }, { status: 404 })
      }
      console.error('Database update error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, publisher: data })
  } catch (error) {
    console.error('Delete publisher error:', error)
    return NextResponse.json(
      {
        error: 'Failed to delete publisher',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
