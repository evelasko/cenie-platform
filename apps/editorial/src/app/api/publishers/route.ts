import { NextRequest, NextResponse } from 'next/server'
import { createNextServerClient } from '@cenie/supabase/server'
import { requireEditorialAccess, requireRole } from '@/lib/auth-helpers'
import type { PublisherCreateInput } from '@/types/books'

/**
 * GET /api/publishers
 * List publishers with optional filtering
 * Query params:
 * - active: filter by is_active (optional, default: true)
 * - limit: number of results (optional, default: 50)
 */
export async function GET(request: NextRequest) {
  try {
    // Require authentication and editorial access
    const authResult = await requireEditorialAccess()
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const supabase = createNextServerClient()
    const searchParams = request.nextUrl.searchParams

    const activeParam = searchParams.get('active')
    const limit = parseInt(searchParams.get('limit') || '50')

    let query = supabase
      .from('publishers')
      .select('*')
      .order('name', { ascending: true })
      .limit(limit)

    // Filter by active status (default to true)
    const isActive = activeParam !== null ? activeParam === 'true' : true
    query = query.eq('is_active', isActive)

    const { data, error } = await query

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ publishers: data })
  } catch (error) {
    console.error('List publishers error:', error)
    return NextResponse.json(
      {
        error: 'Failed to list publishers',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/publishers
 * Create a new publisher
 * Requires: editor or admin role
 */
export async function POST(request: NextRequest) {
  try {
    // Require editor or admin role
    const authResult = await requireRole('editor')
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { user } = authResult
    const supabase = createNextServerClient()
    const body: PublisherCreateInput = await request.json()

    // Validate required fields
    if (!body.name || !body.slug) {
      return NextResponse.json({ error: 'name and slug are required' }, { status: 400 })
    }

    // Check if slug already exists
    const { data: existingPublisher } = await supabase
      .from('publishers')
      .select('id, name, slug')
      .eq('slug', body.slug)
      .single()

    if (existingPublisher) {
      return NextResponse.json(
        {
          error: 'A publisher with this slug already exists',
          publisher: existingPublisher,
        },
        { status: 409 }
      )
    }

    // Insert publisher
    const { data, error } = await supabase
      .from('publishers')
      .insert({
        name: body.name,
        slug: body.slug,
        country: body.country || null,
        website_url: body.website_url || null,
        contact_email: body.contact_email || null,
        relationship_notes: body.relationship_notes || null,
        permissions_contact: body.permissions_contact || null,
        created_by: user.uid,
        is_active: true,
      } as any)
      .select()
      .single()

    if (error) {
      console.error('Database insert error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ publisher: data }, { status: 201 })
  } catch (error) {
    console.error('Create publisher error:', error)
    return NextResponse.json(
      {
        error: 'Failed to create publisher',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
