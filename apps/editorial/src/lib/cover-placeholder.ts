/**
 * Cover placeholder for books/volumes without a cover image.
 * Used across catalog, proximamente, dashboard, and OpenGraph images.
 */
export const COVER_PLACEHOLDER_PATH = '/graphics/placeholders/cover-placeholder.svg'

/**
 * Returns the cover placeholder path for client-side use (Next.js Image, img src).
 */
export function getCoverPlaceholder(): string {
  return COVER_PLACEHOLDER_PATH
}

/**
 * Returns the absolute URL for the cover placeholder.
 * Use for server-side contexts (e.g. OpenGraph ImageResponse) where a full URL is required.
 */
export function getCoverPlaceholderUrl(): string {
  const base = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'
  return new URL(COVER_PLACEHOLDER_PATH, base).toString()
}
