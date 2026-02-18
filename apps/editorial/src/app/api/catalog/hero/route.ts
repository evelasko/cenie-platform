import { NextRequest, NextResponse } from 'next/server'
import { withErrorHandling } from '@cenie/errors/next'
import { withLogging } from '@cenie/logger/next'
import { DatabaseError, NotFoundError, ValidationError } from '@cenie/errors'
import { createNextServerClient } from '@cenie/supabase/server'
import { requireViewer, requireEditor } from '@/lib/auth'
import { logger } from '@/lib/logger'
import { getBookCoverUrl } from '@/lib/twicpics'

/**
 * Ensure cover_url is populated from cover_twicpics_path if missing.
 */
function enrichCoverUrl(volume: Record<string, unknown>): Record<string, unknown> {
  if (!volume.cover_url && volume.cover_twicpics_path) {
    return {
      ...volume,
      cover_url: getBookCoverUrl(volume.cover_twicpics_path as string, 'medium'),
    }
  }
  return volume
}

/**
 * GET /api/catalog/hero
 * Returns the current hero catalog volume (requires viewer role).
 */
export const GET = withErrorHandling(
  withLogging(
    requireViewer(async (_request: NextRequest) => {
      const supabase = createNextServerClient()

      const { data, error } = await supabase
        .from('catalog_volumes')
        .select('*')
        .eq('hero', true)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return NextResponse.json({ volume: null })
        }
        throw new DatabaseError('Failed to fetch hero volume', { cause: error })
      }

      logger.debug('[Catalog Hero] Fetched hero volume', { volumeId: (data as any).id })
      return NextResponse.json({ volume: enrichCoverUrl(data as Record<string, unknown>) })
    })
  )
)

/**
 * PUT /api/catalog/hero
 * Set a published catalog volume as the hero (requires editor role).
 * Body: { volume_id: string }
 */
export const PUT = withErrorHandling(
  withLogging(
    requireEditor(async (request: NextRequest, { user }) => {
      const supabase = createNextServerClient()

      let body: { volume_id: string }
      try {
        body = await request.json()
      } catch (parseError) {
        throw new ValidationError('Invalid JSON body', {
          cause: parseError,
          userMessage: 'Request body must be valid JSON',
        })
      }

      if (!body.volume_id) {
        throw new ValidationError('Missing required field: volume_id', {
          userMessage: 'volume_id is required',
        })
      }

      // Call the atomic RPC function to set the hero
      const { error: rpcError } = await supabase.rpc('set_hero_volume' as any, {
        volume_uuid: body.volume_id,
      } as any)

      if (rpcError) {
        throw new DatabaseError('Failed to set hero volume', {
          cause: rpcError,
          metadata: { volume_id: body.volume_id },
        })
      }

      // Return the updated volume
      const { data, error } = await supabase
        .from('catalog_volumes')
        .select('*')
        .eq('id', body.volume_id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          throw new NotFoundError('Volume not found', {
            userMessage: 'The specified volume was not found',
            metadata: { volume_id: body.volume_id },
          })
        }
        throw new DatabaseError('Failed to fetch updated hero volume', {
          cause: error,
          metadata: { volume_id: body.volume_id },
        })
      }

      logger.info('[Catalog Hero] Set hero volume', {
        volumeId: body.volume_id,
        userId: user.uid,
      })

      return NextResponse.json({ volume: enrichCoverUrl(data as Record<string, unknown>) })
    })
  )
)

/**
 * DELETE /api/catalog/hero
 * Clears the current hero without setting a new one (requires editor role).
 */
export const DELETE = withErrorHandling(
  withLogging(
    requireEditor(async (_request: NextRequest, { user }) => {
      const supabase = createNextServerClient()

      const { error } = await supabase.rpc('clear_hero_volume' as any)

      if (error) {
        throw new DatabaseError('Failed to clear hero volume', { cause: error })
      }

      logger.info('[Catalog Hero] Cleared hero volume', { userId: user.uid })

      return NextResponse.json({ success: true })
    })
  )
)
