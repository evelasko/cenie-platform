import { NextRequest, NextResponse } from 'next/server'
import { createNextServerClient } from '@cenie/supabase/server'
import { requireEditorialAccess, requireRole } from '@/lib/auth-helpers'
import type { ContributorUpdateInput } from '@/types/books'

/**
 * GET /api/contributors/[id]
 * Get a single contributor by ID
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

    const { data, error } = await supabase.from('contributors').select('*').eq('id', id).single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Contributor not found' }, { status: 404 })
      }
      console.error('Database error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ contributor: data })
  } catch (error) {
    console.error('Get contributor error:', error)
    return NextResponse.json(
      {
        error: 'Failed to get contributor',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/contributors/[id]
 * Update a contributor
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
    const body: ContributorUpdateInput = await request.json()

    // If slug is being changed, check it's unique
    if (body.slug) {
      const { data: existingContributor } = await supabase
        .from('contributors')
        .select('id')
        .eq('slug', body.slug)
        .neq('id', id)
        .single()

      if (existingContributor) {
        return NextResponse.json(
          { error: 'A contributor with this slug already exists' },
          { status: 409 }
        )
      }
    }

    // Update contributor
    const { data, error } = await supabase
      .from('contributors')
      // @ts-expect-error - contributors table not in auto-generated types
      .update(body)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Contributor not found' }, { status: 404 })
      }
      console.error('Database update error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ contributor: data })
  } catch (error) {
    console.error('Update contributor error:', error)
    return NextResponse.json(
      {
        error: 'Failed to update contributor',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/contributors/[id]
 * Soft delete a contributor (set is_active = false)
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
      .from('contributors')
      // @ts-expect-error - contributors table not in auto-generated types
      .update({ is_active: false })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Contributor not found' }, { status: 404 })
      }
      console.error('Database update error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, contributor: data })
  } catch (error) {
    console.error('Delete contributor error:', error)
    return NextResponse.json(
      {
        error: 'Failed to delete contributor',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
