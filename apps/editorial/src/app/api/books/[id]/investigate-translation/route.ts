import { NextRequest, NextResponse } from 'next/server'
import { createNextServerClient } from '@cenie/supabase/server'
import { getServerSession, initializeAdminApp } from '@cenie/firebase/server'
import { findSpanishTranslation } from '@/lib/translation-finder'
import type { Book } from '@/types/books'

/**
 * POST /api/books/[id]/investigate-translation
 * Investigates if a book has a Spanish translation using Google Books API
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Debug: Log request headers
    console.log('=== INVESTIGATE TRANSLATION DEBUG ===')
    console.log('Request headers:', {
      cookie: request.headers.get('cookie'),
      authorization: request.headers.get('authorization'),
    })

    // Authenticate user with Firebase
    const session = await getServerSession()

    // Debug: Log auth result
    console.log('Auth result:', {
      hasSession: !!session,
      userId: session?.uid,
      userEmail: session?.email,
    })

    if (!session) {
      console.error('Authentication failed: No session found')
      return NextResponse.json({
        error: 'Authentication required',
        debug: {
          authError: 'No session found',
          hasCookie: !!request.headers.get('cookie'),
        }
      }, { status: 401 })
    }

    // Check if user has editor/admin role in Firestore
    const adminApp = initializeAdminApp()
    const firestore = adminApp.firestore()

    const accessSnapshot = await firestore
      .collection('user_app_access')
      .where('userId', '==', session.uid)
      .where('appName', '==', 'editorial')
      .where('isActive', '==', true)
      .limit(1)
      .get()

    if (accessSnapshot.empty) {
      return NextResponse.json({ error: 'No access to Editorial app' }, { status: 403 })
    }

    const accessDoc = accessSnapshot.docs[0].data()
    if (!['admin', 'editor'].includes(accessDoc.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    // Use Supabase for database operations
    const supabase = createNextServerClient()

    // Get the book
    const { data: book, error: bookError } = await supabase
      .from('books')
      .select('*')
      .eq('id', id)
      .single()

    if (bookError || !book) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 })
    }

    // Mark as checking
    // @ts-expect-error - RPC function parameters are not typed
    await supabase.rpc('start_translation_check', {
      book_id: id,
      user_id: session.uid,
    })

    // Run the investigation
    const result = await findSpanishTranslation(book as Book)

    // Save results to database
    const spanishData = result.spanish_book
      ? {
          title: result.spanish_book.title,
          subtitle: result.spanish_book.subtitle || null,
          authors: result.spanish_book.authors || [],
          google_books_id: result.spanish_book.google_books_id,
          isbn_13: result.spanish_book.isbn_13 || null,
          isbn_10: result.spanish_book.isbn_10 || null,
          publisher: result.spanish_book.publisher || null,
          published_date: result.spanish_book.published_date || null,
        }
      : null

    // @ts-expect-error - RPC function parameters are not typed
    await supabase.rpc('complete_translation_check', {
      book_id: id,
      found: result.translation_found,
      score: result.confidence_score,
      breakdown: result.confidence_breakdown as any,
      method: result.method,
      notes: result.investigation_notes,
      spanish_data: spanishData as any,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Translation investigation error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to investigate translation',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
