/**
 * Firebase Storage Helper Functions
 *
 * Server-side utilities for uploading, listing, and managing images
 * in Firebase Storage via the Admin SDK.
 *
 * Architecture:
 *   Upload → Firebase Storage → TwicPics CDN (proxy) → User
 *
 * Firebase Storage serves as the persistent origin for images.
 * TwicPics fetches originals from Storage's public URL and applies
 * real-time transformations (resize, crop, format conversion).
 */

import { initializeAdminApp } from '@cenie/firebase/server'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface StorageUploadResult {
  /** Storage path (e.g. "editorial/covers/slug.jpg") */
  storagePath: string
  /** Public URL for direct access (Firebase Storage) */
  publicUrl: string
  /** Content type of the uploaded file */
  contentType: string
  /** Size in bytes */
  size: number
}

export interface StorageFileInfo {
  /** Filename only (e.g. "slug.jpg") */
  filename: string
  /** Full storage path (e.g. "editorial/covers/slug.jpg") */
  storagePath: string
  /** Public download URL */
  publicUrl: string
  /** Content type */
  contentType: string
  /** Size in bytes */
  sizeBytes: number
  /** Human-readable size */
  sizeReadable: string
  /** Last modified ISO string */
  modified: string
  /** Last modified timestamp (ms) */
  modifiedTimestamp: number
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function getStorageBucket() {
  const app = initializeAdminApp()
  return app.storage().bucket()
}

/**
 * Build the public URL for a Firebase Storage object.
 *
 * Format: https://storage.googleapis.com/{bucket}/{encodedPath}
 *
 * This URL is publicly accessible when storage rules allow reads on the path.
 * TwicPics will use this URL as its origin to fetch and transform images.
 */
export function getPublicStorageUrl(storagePath: string): string {
  const bucket = getStorageBucket()
  const encodedPath = encodeURIComponent(storagePath)
  return `https://storage.googleapis.com/${bucket.name}/${encodedPath}`
}

/**
 * Format bytes to human-readable string
 */
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

// ---------------------------------------------------------------------------
// Upload
// ---------------------------------------------------------------------------

/**
 * Upload a buffer to Firebase Storage.
 *
 * @param buffer    - The file contents
 * @param storagePath - Destination path in the bucket (e.g. "editorial/covers/slug.jpg")
 * @param contentType - MIME type (e.g. "image/jpeg")
 * @returns Upload result with public URL and metadata
 */
export async function uploadToStorage(
  buffer: Buffer,
  storagePath: string,
  contentType: string
): Promise<StorageUploadResult> {
  const bucket = getStorageBucket()
  const file = bucket.file(storagePath)

  await file.save(buffer, {
    metadata: {
      contentType,
      cacheControl: 'public, max-age=31536000', // 1 year cache (TwicPics handles versioning)
    },
  })

  // Make the file publicly readable (belt-and-suspenders alongside storage rules)
  await file.makePublic()

  const publicUrl = getPublicStorageUrl(storagePath)

  return {
    storagePath,
    publicUrl,
    contentType,
    size: buffer.length,
  }
}

// ---------------------------------------------------------------------------
// Check existence
// ---------------------------------------------------------------------------

/**
 * Check if a file exists in Firebase Storage.
 */
export async function fileExistsInStorage(storagePath: string): Promise<boolean> {
  const bucket = getStorageBucket()
  const file = bucket.file(storagePath)
  const [exists] = await file.exists()
  return exists
}

// ---------------------------------------------------------------------------
// Delete
// ---------------------------------------------------------------------------

/**
 * Delete a file from Firebase Storage.
 */
export async function deleteFromStorage(storagePath: string): Promise<void> {
  const bucket = getStorageBucket()
  const file = bucket.file(storagePath)
  const [exists] = await file.exists()
  if (exists) {
    await file.delete()
  }
}

// ---------------------------------------------------------------------------
// List files
// ---------------------------------------------------------------------------

/**
 * List image files under a given prefix in Firebase Storage.
 *
 * @param prefix - Storage path prefix (e.g. "editorial/covers/")
 * @returns Array of file info objects sorted by modification date (newest first)
 */
export async function listStorageFiles(prefix: string): Promise<StorageFileInfo[]> {
  const bucket = getStorageBucket()

  const [files] = await bucket.getFiles({ prefix })

  const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp']

  const fileInfos: StorageFileInfo[] = []

  for (const file of files) {
    const name = file.name
    // Skip "directory" markers and non-image files
    if (name.endsWith('/')) continue
    const ext = name.substring(name.lastIndexOf('.')).toLowerCase()
    if (!imageExtensions.includes(ext)) continue

    const [metadata] = await file.getMetadata()

    const filename = name.split('/').pop() || name
    const sizeBytes = Number(metadata.size) || 0
    const modified = metadata.updated || metadata.timeCreated || new Date().toISOString()

    fileInfos.push({
      filename,
      storagePath: name,
      publicUrl: getPublicStorageUrl(name),
      contentType: (metadata.contentType as string) || 'image/jpeg',
      sizeBytes,
      sizeReadable: formatFileSize(sizeBytes),
      modified: new Date(modified).toISOString(),
      modifiedTimestamp: new Date(modified).getTime(),
    })
  }

  // Sort by modified date, newest first
  fileInfos.sort((a, b) => b.modifiedTimestamp - a.modifiedTimestamp)

  return fileInfos
}
