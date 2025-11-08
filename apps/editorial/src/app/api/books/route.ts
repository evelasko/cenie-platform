import { NextRequest, NextResponse } from 'next/server'
import { withErrorHandling } from '@cenie/errors/next'
import { withLogging } from '@cenie/logger/next'
import { DatabaseError, ValidationError, ConflictError, APIError } from '@cenie/errors'
import { createNextServerClient } from '@cenie/supabase/server'
import { requireEditorialAccess, requireRole } from '@/lib/auth-helpers'
import { logger } from '@/lib/logger'
import { googleBooks } from '@/lib/google-books'
import type { BookCreateInput } from '@/types/books'

/**
 * GET /api/books
 * List books from database with optional filtering
 * Query params:
 * - status: filter by status (optional)
 * - selected: filter selected for translation (optional)
 * - limit: number of results (optional, default: 50)
 */
export const GET = withErrorHandling(
  withLogging(async (request: NextRequest) => {
    // Require authentication and editorial access
    const authResult = await requireEditorialAccess()
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const supabase = createNextServerClient()
    const searchParams = request.nextUrl.searchParams

    const status = searchParams.get('status')
    const selectedParam = searchParams.get('selected')
    const limitParam = searchParams.get('limit')
    const limit = limitParam ? parseInt(limitParam) : 50

    if (limitParam && (isNaN(limit) || limit < 1 || limit > 100)) {
      throw new ValidationError('Invalid limit parameter', {
        userMessage: 'Limit must be between 1 and 100',
        metadata: { limit: limitParam },
      })
    }

    let query = supabase
      .from('books')
      .select('*')
      .order('added_at', { ascending: false })
      .limit(limit)

    if (status) {
      query = query.eq('status', status)
    }

    if (selectedParam !== null) {
      const selected = selectedParam === 'true'
      query = query.eq('selected_for_translation', selected)
    }

    const { data, error } = await query

    if (error) {
      throw new DatabaseError('Failed to fetch books', {
        cause: error,
        metadata: {
          status,
          selectedParam,
          limit,
        },
      })
    }

    logger.debug('[Books] Listed books', { count: data?.length, status, selectedParam })
    return NextResponse.json({ books: data })
  })
)

/**
 * POST /api/books
 * Add a book to the database from Google Books
 * Body:
 * - googleBooksId: Google Books volume ID (required)
 * Requires: editor or admin role
 */
export const POST = withErrorHandling(
  withLogging(async (request: NextRequest) => {
    // Require editor or admin role
    const authResult = await requireRole('editor')
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { user } = authResult
    const supabase = createNextServerClient()
    let body: BookCreateInput
    try {
      body = await request.json()
    } catch (parseError) {
      throw new ValidationError('Invalid JSON body', {
        cause: parseError,
        userMessage: 'Request body must be valid JSON',
      })
    }

    const { googleBooksId } = body

    if (!googleBooksId) {
      throw new ValidationError('Missing required field', {
        userMessage: 'googleBooksId is required',
        metadata: { hasGoogleBooksId: false },
      })
    }

    // Check if book already exists
    const { data: existingBook, error: checkError } = await supabase
      .from('books')
      .select('id, title, status')
      .eq('google_books_id', googleBooksId)
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      // PGRST116 = no rows returned (expected if book doesn't exist)
      throw new DatabaseError('Failed to check for existing book', {
        cause: checkError,
        metadata: { googleBooksId },
      })
    }

    if (existingBook) {
      throw new ConflictError('Book already exists in database', {
        userMessage: 'This book is already in the database',
        metadata: {
          googleBooksId,
          existingBookId: (existingBook as any).id,
        },
      })
    }

    // Fetch full details from Google Books
    let bookData
    try {
      bookData = await googleBooks.getBook(googleBooksId)
    } catch (googleError) {
      throw new APIError('google-books', 'Failed to fetch book from Google Books', {
        cause: googleError,
        userMessage: 'Could not retrieve book information from Google Books',
        metadata: { googleBooksId },
      })
    }

    const isbns = googleBooks.getISBNs(bookData)

    // Insert book into database
    const { data, error } = await supabase
      .from('books')
      .insert({
        google_books_id: bookData.id,
        title: bookData.volumeInfo.title,
        subtitle: bookData.volumeInfo.subtitle || null,
        authors: bookData.volumeInfo.authors || null,
        published_date: bookData.volumeInfo.publishedDate || null,
        language: bookData.volumeInfo.language || null,
        isbn_13: isbns.isbn13 || null,
        isbn_10: isbns.isbn10 || null,
        added_by: user.uid,
        status: 'discovered' as const,
      } as any)
      .select()
      .single()

    if (error) {
      // Handle unique constraint violation (race condition)
      if (error.code === '23505') {
        throw new ConflictError('Book already exists in database', {
          userMessage: 'This book is already in the database',
          metadata: {
            googleBooksId,
            code: error.code,
          },
        })
      }

      throw new DatabaseError('Failed to add book', {
        cause: error,
        metadata: {
          googleBooksId,
          title: bookData.volumeInfo.title,
        },
      })
    }

    logger.info('[Books] Added book', {
      bookId: (data as any).id,
      googleBooksId,
      title: bookData.volumeInfo.title,
      userId: user.uid,
    })

    return NextResponse.json({ book: data }, { status: 201 })
  })
)
