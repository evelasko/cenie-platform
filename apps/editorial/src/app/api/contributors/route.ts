import { NextRequest, NextResponse } from 'next/server'
import { withErrorHandling } from '@cenie/errors/next'
import { withLogging } from '@cenie/logger/next'
import { DatabaseError, ValidationError, ConflictError } from '@cenie/errors'
import { createNextServerClient } from '@cenie/supabase/server'
import { requireViewer, requireEditor } from '@/lib/auth'
import { logger } from '@/lib/logger'
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
export const GET = withErrorHandling(
  withLogging(
    requireViewer(async (request: NextRequest) => {
      const supabase = createNextServerClient()
      const searchParams = request.nextUrl.searchParams

      const role = searchParams.get('role')
      const activeParam = searchParams.get('active')
      const searchQuery = searchParams.get('search')
      const limitParam = searchParams.get('limit')
      const limit = limitParam ? parseInt(limitParam) : 50

      if (limitParam && (isNaN(limit) || limit < 1 || limit > 100)) {
        throw new ValidationError('Invalid limit parameter', {
          userMessage: 'Limit must be between 1 and 100',
          metadata: { limit: limitParam },
        })
      }

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
        query = query.or(`full_name.ilike.%${searchQuery}%,slug.ilike.%${searchQuery}%`)
      }

      const { data, error } = await query

      if (error) {
        throw new DatabaseError('Failed to fetch contributors', {
          cause: error,
          metadata: {
            role,
            isActive,
            searchQuery,
            limit,
          },
        })
      }

      logger.debug('[Contributors] Listed contributors', {
        count: data?.length,
        role,
        isActive,
        hasSearch: !!searchQuery,
      })
      return NextResponse.json({ contributors: data })
    })
  )
)

/**
 * POST /api/contributors
 * Create a new contributor
 * Requires: editor or admin role
 */
export const POST = withErrorHandling(
  withLogging(
    requireEditor(async (request: NextRequest, { user }) => {
      const supabase = createNextServerClient()
      let body: ContributorCreateInput
      try {
        body = await request.json()
      } catch (parseError) {
        throw new ValidationError('Invalid JSON body', {
          cause: parseError,
          userMessage: 'Request body must be valid JSON',
        })
      }

      // Validate required fields
      if (!body.full_name || !body.slug || !body.primary_role) {
        throw new ValidationError('Missing required fields', {
          userMessage: 'full_name, slug, and primary_role are required',
          metadata: {
            hasFullName: !!body.full_name,
            hasSlug: !!body.slug,
            hasPrimaryRole: !!body.primary_role,
          },
        })
      }

      // Check if slug already exists
      const { data: existingContributor, error: checkError } = await supabase
        .from('contributors')
        .select('id, full_name, slug')
        .eq('slug', body.slug)
        .single()

      if (checkError && checkError.code !== 'PGRST116') {
        // PGRST116 = no rows returned (expected if slug doesn't exist)
        throw new DatabaseError('Failed to check for existing contributor', {
          cause: checkError,
          metadata: { slug: body.slug },
        })
      }

      if (existingContributor) {
        throw new ConflictError('A contributor with this slug already exists', {
          userMessage: 'A contributor with this slug already exists',
          metadata: {
            slug: body.slug,
            existingContributorId: (existingContributor as any).id,
          },
        })
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
        } as any)
        .select()
        .single()

      if (error) {
        // Handle unique constraint violation (race condition)
        if (error.code === '23505') {
          throw new ConflictError('A contributor with this slug already exists', {
            userMessage: 'A contributor with this slug already exists',
            metadata: {
              slug: body.slug,
              code: error.code,
            },
          })
        }

        throw new DatabaseError('Failed to create contributor', {
          cause: error,
          metadata: {
            slug: body.slug,
            fullName: body.full_name,
          },
        })
      }

      logger.info('[Contributors] Created contributor', {
        contributorId: (data as any).id,
        slug: body.slug,
        fullName: body.full_name,
        userId: user.uid,
      })

      return NextResponse.json({ contributor: data }, { status: 201 })
    })
  )
)
