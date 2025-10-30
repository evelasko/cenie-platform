import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import { requireRole } from '@/lib/auth-helpers'
import { getBookCoverUrl } from '@/lib/twicpics'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

/**
 * POST /api/upload/cover
 * Upload a book cover image (slug-based naming)
 * Body (multipart/form-data):
 * - file: Image file (required)
 * - slug: Publication slug for filename (required)
 * Requires: editor or admin role
 */
export async function POST(request: NextRequest) {
  try {
    // Require editor or admin role
    const authResult = await requireRole('editor')
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const slug = formData.get('slug') as string | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 })
    }

    // Validate slug format (alphanumeric and hyphens only)
    if (!/^[a-z0-9-]+$/.test(slug)) {
      return NextResponse.json(
        { error: 'Invalid slug format. Use only lowercase letters, numbers, and hyphens.' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPG, PNG, and WebP are allowed.' },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds maximum allowed size of 5MB' },
        { status: 400 }
      )
    }

    // Get file extension from uploaded file
    const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg'

    // Generate slug-based filename
    const filename = `${slug}.${extension}`

    // Ensure upload directory exists
    const uploadDir = join(process.cwd(), 'public/images/covers')
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // Check if file already exists (will be overwritten)
    const filepath = join(uploadDir, filename)
    const fileExists = existsSync(filepath)

    // Save file (overwrites if exists)
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filepath, buffer)

    // Generate TwicPics path
    const twicpicsPath = `editorial/covers/${filename}`

    // Generate display URL
    const displayUrl = getBookCoverUrl(twicpicsPath, 'medium')

    return NextResponse.json({
      twicpics_path: twicpicsPath,
      display_url: displayUrl,
      filename,
      overwritten: fileExists,
    })
  } catch (error) {
    console.error('Cover upload error:', error)
    return NextResponse.json(
      {
        error: 'Failed to upload cover image',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
