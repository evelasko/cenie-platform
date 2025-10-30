import { NextRequest, NextResponse } from 'next/server'
import { createNextServerClient } from '@cenie/supabase/server'
import { requireRole } from '@/lib/auth-helpers'

/**
 * POST /api/catalog/[id]/publish
 * Change publication status to 'published'
 * Requires: editor or admin role
 */
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Require editor or admin role
    const authResult = await requireRole('editor')
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { user } = authResult
    const { id } = await params
    const supabase = createNextServerClient()

    // Update publication_status to 'published' and set published_at/published_by
    const { data, error } = await supabase
      .from('catalog_volumes')
      .update({
        publication_status: 'published',
        published_at: new Date().toISOString(),
        published_by: user.uid,
      })
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
    console.error('Publish volume error:', error)
    return NextResponse.json(
      {
        error: 'Failed to publish volume',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

