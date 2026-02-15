import { NextResponse } from 'next/server'
import { createNextServerClient } from '@cenie/supabase/server'
import { logger } from '@/lib/logger'

/**
 * GET /api/public/categories
 * Get all unique categories from published volumes (public access, no auth)
 */
export async function GET() {
  try {
    const supabase = createNextServerClient()

    // Get all published volumes with categories
    const { data: volumes, error } = await supabase
      .from('catalog_volumes')
      .select('categories')
      .eq('publication_status', 'published')

    if (error) {
      logger.error('Database error', { error })
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Extract unique categories
    const categoriesSet = new Set<string>()
    volumes?.forEach((volume: any) => {
      if (volume.categories && Array.isArray(volume.categories)) {
        volume.categories.forEach((cat: string) => categoriesSet.add(cat))
      }
    })

    const categories = Array.from(categoriesSet).sort()

    return NextResponse.json({ categories })
  } catch (error) {
    logger.error('Get categories error', { error })
    return NextResponse.json(
      {
        error: 'Failed to get categories',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
