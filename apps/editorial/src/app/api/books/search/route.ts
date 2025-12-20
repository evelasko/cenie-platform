import { NextRequest, NextResponse } from 'next/server'
import { requireViewer } from '@/lib/auth'
import { googleBooks } from '@/lib/google-books'

/**
 * GET /api/books/search
 * Search Google Books API
 * Query params:
 * - q: search query (required)
 * - maxResults: number of results (optional, default: 20)
 * - startIndex: pagination start index (optional, default: 0)
 */
export const GET = requireViewer(async (request: NextRequest) => {
  try {
    // User is authenticated and has viewer role or higher
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')
    const maxResults = parseInt(searchParams.get('maxResults') || '20')
    const startIndex = parseInt(searchParams.get('startIndex') || '0')

    if (!query) {
      return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 })
    }

    const results = await googleBooks.search(query, maxResults, startIndex)

    return NextResponse.json(results)
  } catch (error) {
    console.error('Book search error:', error)
    return NextResponse.json(
      {
        error: 'Failed to search books',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
})
