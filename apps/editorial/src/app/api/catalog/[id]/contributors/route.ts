import { NextRequest, NextResponse } from 'next/server'
import { createNextServerClient } from '@cenie/supabase/server'
import { requireEditorialAccess } from '@/lib/auth-helpers'

/**
 * POST /api/catalog/[id]/contributors
 * Link contributors to a catalog volume
 * Requires: editorial access
 */
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Require authentication and editorial access
    const authResult = await requireEditorialAccess()
    if (authResult instanceof NextResponse) {
      return authResult
    }

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
      console.error('Database insert error:', contributorsError)
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
      console.error('Display fields error:', displayError)
      // Don't fail the request, just log the error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Link contributors error:', error)
    return NextResponse.json(
      {
        error: 'Failed to link contributors',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
