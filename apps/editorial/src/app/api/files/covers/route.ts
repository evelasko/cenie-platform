import { NextRequest, NextResponse } from 'next/server'
import { readdir, stat } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import { requireEditorialAccess } from '@/lib/auth-helpers'
import { getBookCoverUrl } from '@/lib/twicpics'

/**
 * GET /api/files/covers
 * List all cover images in public/images/covers/
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

    const coversDir = join(process.cwd(), 'public/images/covers')

    // Check if directory exists
    if (!existsSync(coversDir)) {
      return NextResponse.json({ files: [], total_count: 0 })
    }

    // Read directory
    const files = await readdir(coversDir)

    // Filter for image files only
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp']
    const imageFiles = files.filter((file) =>
      imageExtensions.some((ext) => file.toLowerCase().endsWith(ext))
    )

    // Get file stats and build response
    const fileDataPromises = imageFiles.map(async (filename) => {
      const filepath = join(coversDir, filename)
      const stats = await stat(filepath)

      const twicpicsPath = `editorial/covers/${filename}`

      return {
        filename,
        path: twicpicsPath,
        thumbnail_url: getBookCoverUrl(twicpicsPath, 'thumbnail'),
        medium_url: getBookCoverUrl(twicpicsPath, 'medium'),
        full_url: getBookCoverUrl(twicpicsPath, 'large'),
        size_bytes: stats.size,
        size_readable: formatFileSize(stats.size),
        modified: stats.mtime.toISOString(),
        modified_timestamp: stats.mtime.getTime(),
      }
    })

    let fileData = await Promise.all(fileDataPromises)

    // Apply search filter if provided
    if (searchQuery) {
      fileData = fileData.filter((file) => file.filename.toLowerCase().includes(searchQuery))
    }

    // Sort by modified date (newest first)
    fileData.sort((a, b) => b.modified_timestamp - a.modified_timestamp)

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

/**
 * Format file size to human-readable format
 */
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

