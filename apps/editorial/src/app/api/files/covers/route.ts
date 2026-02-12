import { NextRequest, NextResponse } from 'next/server'
import { requireEditorialAccess } from '@/lib/auth-helpers'
import { getBookCoverUrl } from '@/lib/twicpics'
import { listStorageFiles } from '@/lib/firebase-storage'

/**
 * GET /api/files/covers
 * List all cover images from Firebase Storage (editorial/covers/)
 * Query params:
 * - search: filter by filename (optional)
 * Returns: Array of cover files with TwicPics URLs
 */
export async function GET(request: NextRequest) {
  try {
    // Require authentication and editorial access
    const authResult = await requireEditorialAccess()
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const searchParams = request.nextUrl.searchParams
    const searchQuery = searchParams.get('search')?.toLowerCase()

    // List cover files from Firebase Storage
    const storageFiles = await listStorageFiles('editorial/covers/')

    // Map to response format with TwicPics URLs
    let fileData = storageFiles.map((file) => ({
      filename: file.filename,
      path: file.storagePath,
      thumbnail_url: getBookCoverUrl(file.storagePath, 'thumbnail'),
      medium_url: getBookCoverUrl(file.storagePath, 'medium'),
      full_url: getBookCoverUrl(file.storagePath, 'large'),
      size_bytes: file.sizeBytes,
      size_readable: file.sizeReadable,
      modified: file.modified,
      modified_timestamp: file.modifiedTimestamp,
    }))

    // Apply search filter if provided
    if (searchQuery) {
      fileData = fileData.filter((file) => file.filename.toLowerCase().includes(searchQuery))
    }

    return NextResponse.json({
      files: fileData,
      total_count: fileData.length,
    })
  } catch (error) {
    console.error('List covers error:', error)
    return NextResponse.json(
      {
        error: 'Failed to list cover files',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
