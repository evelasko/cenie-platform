import { NextRequest, NextResponse } from 'next/server'
import { createNextServerClient } from '@cenie/supabase/server'
import { requireEditorialAccess, requireRole } from '@/lib/auth-helpers'
import type { ContributorCreateInput } from '@/types/books'

/**
 * GET /api/contributors
 * List contributors with optional filtering
 * Query params:
 * - role: filter by primary role (optional)
 * - active: filter by is_active (optional, default: true)
 * - search: search by name (optional)
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

    const role = searchParams.get('role')
    const activeParam = searchParams.get('active')
    const searchQuery = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '50')

    let query = supabase
      .from('contributors')
      .select('*')
      .order('full_name', { ascending: true })
      .limit(limit)

    // Filter by role if provided
    if (role) {
      query = query.eq('primary_role', role)
    }

    // Filter by active status (default to true)
    const isActive = activeParam !== null ? activeParam === 'true' : true
    query = query.eq('is_active', isActive)

    // Search by name if query provided
    if (searchQuery) {
      query = query.or(
        `full_name.ilike.%${searchQuery}%,slug.ilike.%${searchQuery}%`
      )
    }

    const { data, error } = await query

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ contributors: data })
  } catch (error) {
    console.error('List contributors error:', error)
    return NextResponse.json(
      {
        error: 'Failed to list contributors',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/contributors
 * Create a new contributor
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
    const body: ContributorCreateInput = await request.json()

    // Validate required fields
    if (!body.full_name || !body.slug || !body.primary_role) {
      return NextResponse.json(
        { error: 'full_name, slug, and primary_role are required' },
        { status: 400 }
      )
    }

    // Check if slug already exists
    const { data: existingContributor } = await supabase
      .from('contributors')
      .select('id, full_name, slug')
      .eq('slug', body.slug)
      .single()

    if (existingContributor) {
      return NextResponse.json(
        {
          error: 'A contributor with this slug already exists',
          contributor: existingContributor,
        },
        { status: 409 }
      )
    }

    // Insert contributor
    const { data, error } = await supabase
      .from('contributors')
      .insert({
        full_name: body.full_name,
        slug: body.slug,
        name_variants: body.name_variants || null,
        primary_role: body.primary_role,
        bio_es: body.bio_es || null,
        bio_en: body.bio_en || null,
        photo_twicpics_path: body.photo_twicpics_path || null,
        nationality: body.nationality || null,
        birth_year: body.birth_year || null,
        death_year: body.death_year || null,
        website_url: body.website_url || null,
        social_media: body.social_media || null,
        translator_specializations: body.translator_specializations || null,
        translator_languages: body.translator_languages || null,
        seo_description: body.seo_description || null,
        keywords: body.keywords || null,
        created_by: user.uid,
        is_active: true,
      })
      .select()
      .single()

    if (error) {
      console.error('Database insert error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ contributor: data }, { status: 201 })
  } catch (error) {
    console.error('Create contributor error:', error)
    return NextResponse.json(
      {
        error: 'Failed to create contributor',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

