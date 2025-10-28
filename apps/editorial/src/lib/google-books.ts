import type {
  GoogleBookVolume,
  GoogleBooksSearchResponse,
  BookCoverSize,
} from '@/types/books'

/**
 * Google Books API Client
 * Documentation: https://developers.google.com/books/docs/v1/using
 */
export class GoogleBooksAPI {
  private apiKey: string
  private baseUrl = 'https://www.googleapis.com/books/v1'

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('Google Books API key is required')
    }
    this.apiKey = apiKey
  }

  /**
   * Search for books by query
   * @param query - Search query (can include title, author, ISBN, etc.)
   * @param maxResults - Number of results to return (default: 20, max: 40)
   * @param startIndex - Pagination start index (default: 0)
   * @returns Search response with book volumes
   */
  async search(
    query: string,
    maxResults: number = 20,
    startIndex: number = 0
  ): Promise<GoogleBooksSearchResponse> {
    const params = new URLSearchParams({
      q: query,
      maxResults: Math.min(maxResults, 40).toString(),
      startIndex: startIndex.toString(),
      key: this.apiKey,
      langRestrict: 'en', // Focus on English books for translation
      printType: 'books', // Exclude magazines
      orderBy: 'relevance',
    })

    try {
      const response = await fetch(`${this.baseUrl}/volumes?${params}`, {
        next: { revalidate: 3600 }, // Cache for 1 hour
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(`Google Books API error (${response.status}): ${error}`)
      }

      return response.json()
    } catch (error) {
      console.error('Google Books search error:', error)
      throw error
    }
  }

  /**
   * Get a specific book by Google Books volume ID
   * @param volumeId - Google Books volume ID (e.g., "H0lH-JZ8w9sC")
   * @returns Book volume details
   */
  async getBook(volumeId: string): Promise<GoogleBookVolume> {
    const params = new URLSearchParams({ key: this.apiKey })

    try {
      const response = await fetch(`${this.baseUrl}/volumes/${volumeId}?${params}`, {
        next: { revalidate: 86400 }, // Cache for 24 hours
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(`Google Books API error (${response.status}): ${error}`)
      }

      return response.json()
    } catch (error) {
      console.error('Google Books get book error:', error)
      throw error
    }
  }

  /**
   * Search by ISBN
   * @param isbn - ISBN-10 or ISBN-13
   * @returns Search response (typically returns 1 book if found)
   */
  async searchByISBN(isbn: string): Promise<GoogleBooksSearchResponse> {
    return this.search(`isbn:${isbn}`, 1)
  }

  /**
   * Search by title
   * @param title - Book title
   * @param maxResults - Number of results
   * @returns Search response
   */
  async searchByTitle(title: string, maxResults: number = 20): Promise<GoogleBooksSearchResponse> {
    return this.search(`intitle:${title}`, maxResults)
  }

  /**
   * Search by author
   * @param author - Author name
   * @param maxResults - Number of results
   * @returns Search response
   */
  async searchByAuthor(author: string, maxResults: number = 20): Promise<GoogleBooksSearchResponse> {
    return this.search(`inauthor:${author}`, maxResults)
  }

  /**
   * Search by subject/category
   * @param subject - Subject or category
   * @param maxResults - Number of results
   * @returns Search response
   */
  async searchBySubject(
    subject: string,
    maxResults: number = 20
  ): Promise<GoogleBooksSearchResponse> {
    return this.search(`subject:${subject}`, maxResults)
  }

  /**
   * Get cover image URL from book volume
   * @param book - Google Book volume
   * @param size - Image size preference
   * @returns Image URL or null if not available
   */
  getCoverImageUrl(book: GoogleBookVolume, size: BookCoverSize = 'medium'): string | null {
    const imageLinks = book.volumeInfo.imageLinks

    if (!imageLinks) {
      return null
    }

    // Try to get the requested size, fall back to available sizes
    const sizePreference: BookCoverSize[] = [
      size,
      'medium',
      'large',
      'small',
      'thumbnail',
      'smallThumbnail',
    ]

    for (const preferredSize of sizePreference) {
      const url = imageLinks[preferredSize]
      if (url) {
        // Google Books returns HTTP, upgrade to HTTPS for security
        return url.replace('http://', 'https://')
      }
    }

    return null
  }

  /**
   * Extract ISBNs from book volume
   * @param book - Google Book volume
   * @returns Object with isbn10 and isbn13
   */
  getISBNs(book: GoogleBookVolume): { isbn10?: string; isbn13?: string } {
    const identifiers = book.volumeInfo.industryIdentifiers || []
    return {
      isbn10: identifiers.find((id) => id.type === 'ISBN_10')?.identifier,
      isbn13: identifiers.find((id) => id.type === 'ISBN_13')?.identifier,
    }
  }

  /**
   * Format authors array as readable string
   * @param authors - Array of author names
   * @returns Formatted author string
   */
  formatAuthors(authors?: string[]): string {
    if (!authors || authors.length === 0) {
      return 'Unknown Author'
    }

    if (authors.length === 1) {
      return authors[0]
    }

    if (authors.length === 2) {
      return authors.join(' and ')
    }

    const lastAuthor = authors[authors.length - 1]
    const otherAuthors = authors.slice(0, -1).join(', ')
    return `${otherAuthors}, and ${lastAuthor}`
  }

  /**
   * Get the first category from a book
   * @param book - Google Book volume
   * @returns First category or null
   */
  getPrimaryCategory(book: GoogleBookVolume): string | null {
    const categories = book.volumeInfo.categories
    return categories && categories.length > 0 ? categories[0] : null
  }

  /**
   * Check if a book is performing arts related
   * @param book - Google Book volume
   * @returns True if related to performing arts
   */
  isPerformingArtsRelated(book: GoogleBookVolume): boolean {
    const performingArtsKeywords = [
      'theater',
      'theatre',
      'drama',
      'acting',
      'performance',
      'dance',
      'music',
      'opera',
      'performing arts',
      'stagecraft',
      'directing',
      'choreography',
      'playwright',
    ]

    const title = book.volumeInfo.title?.toLowerCase() || ''
    const description = book.volumeInfo.description?.toLowerCase() || ''
    const categories = book.volumeInfo.categories?.map((c) => c.toLowerCase()) || []

    const searchText = [title, description, ...categories].join(' ')

    return performingArtsKeywords.some((keyword) => searchText.includes(keyword))
  }

  /**
   * Build a search query with advanced operators
   * @param options - Search options
   * @returns Formatted query string
   */
  buildAdvancedQuery(options: {
    title?: string
    author?: string
    isbn?: string
    subject?: string
    publisher?: string
  }): string {
    const parts: string[] = []

    if (options.title) parts.push(`intitle:${options.title}`)
    if (options.author) parts.push(`inauthor:${options.author}`)
    if (options.isbn) parts.push(`isbn:${options.isbn}`)
    if (options.subject) parts.push(`subject:${options.subject}`)
    if (options.publisher) parts.push(`inpublisher:${options.publisher}`)

    return parts.join(' ')
  }
}

// Singleton instance for server-side use
let googleBooksInstance: GoogleBooksAPI | null = null

/**
 * Get the Google Books API client instance.
 * Lazily initializes on first access to ensure environment variables are loaded.
 */
export function getGoogleBooksClient(): GoogleBooksAPI {
  if (!googleBooksInstance) {
    const apiKey = process.env.GOOGLE_API_KEY

    if (!apiKey) {
      throw new Error(
        'GOOGLE_API_KEY environment variable is not set. ' +
        'Make sure the .env file is loaded and the variable is defined.'
      )
    }

    googleBooksInstance = new GoogleBooksAPI(apiKey)
  }

  return googleBooksInstance
}

/**
 * Lazy-initialized singleton instance of Google Books API.
 * Uses a Proxy to defer initialization until first method call.
 * This ensures environment variables are loaded before the API key is accessed.
 */
export const googleBooks = new Proxy({} as GoogleBooksAPI, {
  get(_target, prop) {
    const instance = getGoogleBooksClient()
    const value = instance[prop as keyof GoogleBooksAPI]
    return typeof value === 'function' ? value.bind(instance) : value
  },
})
