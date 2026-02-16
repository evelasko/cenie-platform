import { NextRequest, NextResponse } from 'next/server'
import { withErrorHandling } from '@cenie/errors/next'
import { withLogging } from '@cenie/logger/next'
import { DatabaseError, ValidationError, ConflictError } from '@cenie/errors'
import { createNextServerClient } from '@cenie/supabase/server'
import { requireViewer, requireEditor } from '@/lib/auth'
import { logger } from '@/lib/logger'
import type { PublisherCreateInput } from '@/types/books'

/**
 * GET /api/publishers
 * List publishers with optional filtering
 * Query params:
 * - active: filter by is_active (optional, default: true)
 * - limit: number of results (optional, default: 50)
 */
export const GET = withErrorHandling(
  withLogging(
    requireViewer(async (request: NextRequest) => {
      const supabase = createNextServerClient()
      const searchParams = request.nextUrl.searchParams

      const activeParam = searchParams.get('active')
      const limitParam = searchParams.get('limit')
      const limit = limitParam ? parseInt(limitParam) : 50

      if (limitParam && (isNaN(limit) || limit < 1 || limit > 100)) {
        throw new ValidationError('Invalid limit parameter', {
          userMessage: 'Limit must be between 1 and 100',
          metadata: { limit: limitParam },
        })
      }

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
        throw new DatabaseError('Failed to fetch publishers', {
          cause: error,
          metadata: {
            isActive,
            limit,
          },
        })
      }

      logger.debug('[Publishers] Listed publishers', { count: data?.length, isActive })
      return NextResponse.json({ publishers: data })
    })
  )
)

/**
 * POST /api/publishers
 * Create a new publisher
 * Requires: editor or admin role
 */
export const POST = withErrorHandling(
  withLogging(
    requireEditor(async (request: NextRequest, { user }) => {
      const supabase = createNextServerClient()
      let body: PublisherCreateInput
      try {
        body = await request.json()
      } catch (parseError) {
        throw new ValidationError('Invalid JSON body', {
          cause: parseError,
          userMessage: 'Request body must be valid JSON',
        })
      }

      // Validate required fields
      if (!body.name || !body.slug) {
        throw new ValidationError('Missing required fields', {
          userMessage: 'name and slug are required',
          metadata: {
            hasName: !!body.name,
            hasSlug: !!body.slug,
          },
        })
      }

      // Check if slug already exists
      const { data: existingPublisher, error: checkError } = await supabase
        .from('publishers')
        .select('id, name, slug')
        .eq('slug', body.slug)
        .single()

      if (checkError && checkError.code !== 'PGRST116') {
        // PGRST116 = no rows returned (expected if slug doesn't exist)
        throw new DatabaseError('Failed to check for existing publisher', {
          cause: checkError,
          metadata: { slug: body.slug },
        })
      }

      if (existingPublisher) {
        throw new ConflictError('A publisher with this slug already exists', {
          userMessage: 'A publisher with this slug already exists',
          metadata: {
            slug: body.slug,
            existingPublisherId: (existingPublisher as any).id,
          },
        })
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
        // Handle unique constraint violation (race condition)
        if (error.code === '23505') {
          throw new ConflictError('A publisher with this slug already exists', {
            userMessage: 'A publisher with this slug already exists',
            metadata: {
              slug: body.slug,
              code: error.code,
            },
          })
        }

        throw new DatabaseError('Failed to create publisher', {
          cause: error,
          metadata: {
            slug: body.slug,
            name: body.name,
          },
        })
      }

      logger.info('[Publishers] Created publisher', {
        publisherId: (data as any).id,
        slug: body.slug,
        name: body.name,
        userId: user.uid,
      })

      return NextResponse.json({ publisher: data }, { status: 201 })
    })
  )
)
