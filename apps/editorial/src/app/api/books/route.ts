import { NextRequest, NextResponse } from 'next/server'
import { createNextServerClient } from '@cenie/supabase/server'
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
export async function GET(request: NextRequest) {
  try {
    const supabase = createNextServerClient()
    const searchParams = request.nextUrl.searchParams

    const status = searchParams.get('status')
    const selectedParam = searchParams.get('selected')
    const limit = parseInt(searchParams.get('limit') || '50')

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
      console.error('Database error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ books: data })
  } catch (error) {
    console.error('List books error:', error)
    return NextResponse.json(
      {
        error: 'Failed to list books',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/books
 * Add a book to the database from Google Books
 * Body:
 * - googleBooksId: Google Books volume ID (required)
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createNextServerClient()
    const body: BookCreateInput = await request.json()

    const { googleBooksId } = body

    if (!googleBooksId) {
      return NextResponse.json(
        { error: 'googleBooksId is required' },
        { status: 400 }
      )
    }

    // Check if book already exists
    const { data: existingBook } = await supabase
      .from('books')
      .select('id, title, status')
      .eq('google_books_id', googleBooksId)
      .single()

    if (existingBook) {
      return NextResponse.json(
        {
          error: 'Book already exists in database',
          book: existingBook,
        },
        { status: 409 }
      )
    }

    // Fetch full details from Google Books
    const bookData = await googleBooks.getBook(googleBooksId)
    const isbns = googleBooks.getISBNs(bookData)

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

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
        added_by: user?.id || null,
        status: 'discovered' as const,
      } as any)
      .select()
      .single()

    if (error) {
      console.error('Database insert error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ book: data }, { status: 201 })
  } catch (error) {
    console.error('Add book error:', error)
    return NextResponse.json(
      {
        error: 'Failed to add book',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
