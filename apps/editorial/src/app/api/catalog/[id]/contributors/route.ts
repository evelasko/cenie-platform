import { NextRequest, NextResponse } from 'next/server'
import { createNextServerClient } from '@cenie/supabase/server'
import { requireEditor } from '@/lib/auth'
import { logger } from '@/lib/logger'

/**
 * POST /api/catalog/[id]/contributors
 * Link contributors to a catalog volume
 * Requires: editor or admin role
 */
export const POST = requireEditor<Promise<{ id: string }>>(
  async (request: NextRequest, context) => {
    const { params } = context
    if (!params) return NextResponse.json({ error: 'Missing params' }, { status: 400 })
    try {
      const { id } = await params
      const supabase = createNextServerClient()
      const body = await request.json()

      // Validate request body
      if (!body.contributors || !Array.isArray(body.contributors)) {
        return NextResponse.json({ error: 'contributors array is required' }, { status: 400 })
      }

      // Insert contributors
      const { error: contributorsError } = await supabase
        .from('volume_contributors')
        .insert(body.contributors as any)

      if (contributorsError) {
        logger.error('Database insert error', { error: contributorsError, volumeId: id })
        return NextResponse.json({ error: contributorsError.message }, { status: 500 })
      }

      // Update display fields (contributor names, etc.)
      const { error: displayError } = await supabase.rpc(
        'update_volume_display_fields' as any,
        {
          volume_uuid: id,
        } as any
      )

      if (displayError) {
        logger.error('Display fields error', { error: displayError, volumeId: id })
        // Don't fail the request, just log the error
      }

      return NextResponse.json({ success: true })
    } catch (error) {
      logger.error('Link contributors error', { error })
      return NextResponse.json(
        {
          error: 'Failed to link contributors',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
        { status: 500 }
      )
    }
  }
)
