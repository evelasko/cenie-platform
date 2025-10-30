import { NextRequest, NextResponse } from 'next/server'
import { createNextServerClient } from '@cenie/supabase/server'
import { requireEditorialAccess, requireRole } from '@/lib/auth-helpers'
import type { CatalogVolumeUpdateInput } from '@/types/books'

/**
 * GET /api/catalog/[id]
 * Get a single catalog volume by ID with contributors
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Require authentication and editorial access
    const authResult = await requireEditorialAccess()
    if (authResult instanceof NextResponse) {
      return authResult
    }

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
      'get_volume_contributors',
      { volume_uuid: id }
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

/**
 * PATCH /api/catalog/[id]
 * Update a catalog volume
 * Requires: editor or admin role
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Require editor or admin role
    const authResult = await requireRole('editor')
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { id } = await params
    const supabase = createNextServerClient()
    const body: CatalogVolumeUpdateInput = await request.json()

    // If slug is being changed, check it's unique
    if (body.slug) {
      const { data: existingVolume } = await supabase
        .from('catalog_volumes')
        .select('id')
        .eq('slug', body.slug)
        .neq('id', id)
        .single()

      if (existingVolume) {
        return NextResponse.json(
          { error: 'A volume with this slug already exists' },
          { status: 409 }
        )
      }
    }

    // Update volume
    const { data, error } = await supabase
      .from('catalog_volumes')
      .update(body)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Volume not found' }, { status: 404 })
      }
      console.error('Database update error:', error)
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

/**
 * DELETE /api/catalog/[id]
 * Archive a catalog volume (set publication_status = 'archived')
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

    // Archive by setting publication_status to 'archived'
    const { data, error } = await supabase
      .from('catalog_volumes')
      .update({ publication_status: 'archived' })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Volume not found' }, { status: 404 })
      }
      console.error('Database update error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, volume: data })
  } catch (error) {
    console.error('Archive volume error:', error)
    return NextResponse.json(
      {
        error: 'Failed to archive volume',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

