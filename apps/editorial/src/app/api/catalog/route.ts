import { NextRequest, NextResponse } from 'next/server'
import { createNextServerClient } from '@cenie/supabase/server'
import { requireEditorialAccess, requireRole } from '@/lib/auth-helpers'
import type { CatalogVolumeCreateInput } from '@/types/books'

/**
 * GET /api/catalog
 * List catalog volumes (admin view - includes drafts)
 * Query params:
 * - status: filter by publication_status (optional)
 * - type: filter by volume_type (optional)
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

    const status = searchParams.get('status')
    const type = searchParams.get('type')
    const limit = parseInt(searchParams.get('limit') || '50')

    let query = supabase
      .from('catalog_volumes')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (status) {
      query = query.eq('publication_status', status)
    }

    if (type) {
      query = query.eq('volume_type', type)
    }

    const { data, error } = await query

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ volumes: data })
  } catch (error) {
    console.error('List catalog volumes error:', error)
    return NextResponse.json(
      {
        error: 'Failed to list catalog volumes',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/catalog
 * Create a new catalog volume (for original publications)
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
    const body: CatalogVolumeCreateInput = await request.json()

    // Validate required fields
    if (!body.title || !body.description) {
      return NextResponse.json(
        { error: 'title and description are required' },
        { status: 400 }
      )
    }

    // Generate slug if not provided
    const slug =
      body.slug ||
      body.title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')

    // Check if slug already exists
    const { data: existingVolume } = await supabase
      .from('catalog_volumes')
      .select('id, title, slug')
      .eq('slug', slug)
      .single()

    if (existingVolume) {
      return NextResponse.json(
        {
          error: 'A volume with this slug already exists',
          volume: existingVolume,
        },
        { status: 409 }
      )
    }

    // Insert catalog volume
    const { data, error } = await supabase
      .from('catalog_volumes')
      .insert({
        volume_type: body.volume_type,
        title: body.title,
        subtitle: body.subtitle || null,
        description: body.description,
        publisher_id: body.publisher_id || null,
        publisher_name: body.publisher_name || 'CENIE Editorial',
        publication_year: body.publication_year || null,
        isbn_13: body.isbn_13 || null,
        isbn_10: body.isbn_10 || null,
        language: body.language || 'es',
        page_count: body.page_count || null,
        cover_twicpics_path: body.cover_twicpics_path || null,
        cover_fallback_url: body.cover_fallback_url || null,
        categories: body.categories || null,
        tags: body.tags || null,
        featured: body.featured || false,
        table_of_contents: body.table_of_contents || null,
        excerpt: body.excerpt || null,
        reviews_quotes: body.reviews_quotes || null,
        editorial_team: body.editorial_team || null,
        compilation_notes: body.compilation_notes || null,
        seo_description: body.seo_description || null,
        seo_keywords: body.seo_keywords || null,
        slug,
        created_by: user.uid,
        publication_status: 'draft',
      })
      .select()
      .single()

    if (error) {
      console.error('Database insert error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ volume: data }, { status: 201 })
  } catch (error) {
    console.error('Create catalog volume error:', error)
    return NextResponse.json(
      {
        error: 'Failed to create catalog volume',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

