import { NextRequest, NextResponse } from 'next/server'
import { createNextServerClient } from '@cenie/supabase/server'
import { requireViewer, requireEditor, requireEditorialAdmin } from '@/lib/auth'
import type { PublisherUpdateInput } from '@/types/books'
import { logger } from '@/lib/logger'

/**
 * GET /api/publishers/[id]
 * Get a single publisher by ID
 */
export const GET = requireViewer<Promise<{ id: string }>>(
  async (_request, context) => {
    const { params } = context
    if (!params) return NextResponse.json({ error: 'Missing params' }, { status: 400 })
    try {
      const { id } = await params
      const supabase = createNextServerClient()

      const { data, error } = await supabase.from('publishers').select('*').eq('id', id).single()

      if (error) {
        if (error.code === 'PGRST116') {
          return NextResponse.json({ error: 'Publisher not found' }, { status: 404 })
        }
        logger.error('Database error', { error, publisherId: id })
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ publisher: data })
    } catch (error) {
      logger.error('Get publisher error', { error })
      return NextResponse.json(
        {
          error: 'Failed to get publisher',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
        { status: 500 }
      )
    }
  }
)

/**
 * PATCH /api/publishers/[id]
 * Update a publisher
 * Requires: editor or admin role
 */
export const PATCH = requireEditor<Promise<{ id: string }>>(
  async (request: NextRequest, context) => {
    const { params } = context
    if (!params) return NextResponse.json({ error: 'Missing params' }, { status: 400 })
    try {
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
        logger.error('Database update error', { error, publisherId: id })
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ publisher: data })
    } catch (error) {
      logger.error('Update publisher error', { error })
      return NextResponse.json(
        {
          error: 'Failed to update publisher',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
        { status: 500 }
      )
    }
  }
)

/**
 * DELETE /api/publishers/[id]
 * Soft delete a publisher (set is_active = false)
 * Requires: admin role
 */
export const DELETE = requireEditorialAdmin<Promise<{ id: string }>>(
  async (_request, context) => {
    const { params } = context
    if (!params) return NextResponse.json({ error: 'Missing params' }, { status: 400 })
    try {
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
        logger.error('Database update error', { error, publisherId: id })
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ success: true, publisher: data })
    } catch (error) {
      logger.error('Delete publisher error', { error })
      return NextResponse.json(
        {
          error: 'Failed to delete publisher',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
        { status: 500 }
      )
    }
  }
)
