/**
 * TwicPics Helper Functions
 *
 * Utility functions for generating TwicPics CDN URLs with transformations
 * for optimized image delivery.
 */

export const TWICPICS_DOMAIN = 'cenie.twic.pics'

/**
 * TwicPics transformation options
 */
export interface TwicPicsOptions {
  width?: number
  height?: number
  crop?: string // e.g., "2:3" for book covers
  focus?: 'auto' | 'faces'
  quality?: number
}

/**
 * Generate TwicPics URL with transformations
 *
 * @param path - TwicPics path (e.g., "editorial/covers/file.jpg")
 * @param options - Transformation options
 * @returns Full TwicPics URL with transformations
 *
 * @example
 * ```ts
 * getTwicPicsUrl("editorial/covers/book.jpg", { width: 400, height: 600, crop: "2:3" })
 * // Returns: "https://cenie.twic.pics/editorial/covers/book.jpg?twic=v1/cover=400x600"
 * ```
 */
export function getTwicPicsUrl(path: string, options?: TwicPicsOptions): string {
  if (!path) {
    return ''
  }

  const baseUrl = `https://${TWICPICS_DOMAIN}/${path}`

  if (!options) {
    return baseUrl
  }

  const { width, height, crop, focus, quality } = options

  // Build transformation parameters
  const transformations: string[] = []

  if (width || height) {
    if (crop) {
      // Use cover transformation with aspect ratio crop
      const dimensions = width && height ? `${width}x${height}` : width ? `${width}` : `${height}`
      transformations.push(`cover=${dimensions}`)
    } else {
      // Use resize transformation
      const dimensions = width && height ? `${width}x${height}` : width ? `${width}` : `${height}`
      transformations.push(`output=${dimensions}`)
    }
  } else if (crop) {
    // Just crop aspect ratio
    transformations.push(`cover=${crop}`)
  }

  if (focus) {
    transformations.push(`focus=${focus}`)
  }

  if (quality !== undefined) {
    transformations.push(`quality=${quality}`)
  }

  // Build query string
  if (transformations.length > 0) {
    const transformString = transformations.join('/')
    return `${baseUrl}?twic=v1/${transformString}`
  }

  return baseUrl
}

/**
 * Book cover size presets
 */
export const BOOK_COVER_SIZES = {
  thumbnail: { width: 200, height: 300 },
  medium: { width: 400, height: 600 },
  large: { width: 800, height: 1200 },
} as const

export type BookCoverSize = keyof typeof BOOK_COVER_SIZES

/**
 * Get book cover URL (standard 2:3 aspect ratio)
 *
 * @param path - TwicPics path (e.g., "editorial/covers/file.jpg")
 * @param size - Size preset: thumbnail, medium, or large
 * @returns Full TwicPics URL optimized for book covers
 *
 * @example
 * ```ts
 * getBookCoverUrl("editorial/covers/book.jpg", "medium")
 * // Returns: "https://cenie.twic.pics/editorial/covers/book.jpg?twic=v1/cover=400x600"
 * ```
 */
export function getBookCoverUrl(
  path: string | null | undefined,
  size: BookCoverSize = 'medium'
): string {
  if (!path) {
    return ''
  }

  const dimensions = BOOK_COVER_SIZES[size]

  return getTwicPicsUrl(path, {
    width: dimensions.width,
    height: dimensions.height,
    crop: '2:3',
    focus: 'auto',
  })
}

/**
 * Get contributor photo URL (circular, square aspect)
 *
 * @param path - TwicPics path (e.g., "editorial/contributors/file.jpg")
 * @param size - Size in pixels (default: 200)
 * @returns Full TwicPics URL optimized for contributor photos
 *
 * @example
 * ```ts
 * getContributorPhotoUrl("editorial/contributors/person.jpg", 200)
 * // Returns: "https://cenie.twic.pics/editorial/contributors/person.jpg?twic=v1/cover=200x200/focus=faces"
 * ```
 */
export function getContributorPhotoUrl(
  path: string | null | undefined,
  size: number = 200
): string {
  if (!path) {
    return ''
  }

  return getTwicPicsUrl(path, {
    width: size,
    height: size,
    crop: '1:1', // Square crop
    focus: 'faces', // Smart crop focusing on faces
  })
}
