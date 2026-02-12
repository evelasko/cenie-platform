import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/auth-helpers'
import { getContributorPhotoUrl } from '@/lib/twicpics'
import { uploadToStorage } from '@/lib/firebase-storage'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

/**
 * POST /api/upload/photo
 * Upload a contributor photo to Firebase Storage
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

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
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

    // Generate unique filename
    const timestamp = Date.now()
    const sanitized = file.name
      .replace(/[^a-z0-9.]/gi, '-')
      .toLowerCase()
      .replace(/^-+|-+$/g, '')
    const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const filename = `${timestamp}-${sanitized.replace(/\.[^.]+$/, '')}.${extension}`

    // Firebase Storage path (also serves as the TwicPics path)
    const storagePath = `editorial/contributors/${filename}`

    // Upload to Firebase Storage
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await uploadToStorage(buffer, storagePath, file.type)

    // Generate display URL via TwicPics CDN (circular, optimized for faces)
    const displayUrl = getContributorPhotoUrl(storagePath, 200)

    return NextResponse.json({
      twicpics_path: storagePath,
      display_url: displayUrl,
    })
  } catch (error) {
    console.error('Photo upload error:', error)
    return NextResponse.json(
      {
        error: 'Failed to upload photo',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
