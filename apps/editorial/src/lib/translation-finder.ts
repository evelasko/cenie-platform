import { compareTwoStrings } from 'string-similarity'
import { logger } from './logger'
import { googleBooks } from './google-books'
import type {
  Book,
  GoogleBookVolume,
  ConfidenceBreakdown,
  TranslationInvestigationResult,
} from '@/types/books'

// Known Spanish performing arts publishers (can be extended easily)
const SPANISH_PUBLISHERS = [
  'Editorial Fundamentos',
  'ADE Teatro',
  'Paso de Gato',
  'Asociación de Directores de Escena',
  'Instituto del Teatro',
  'Ediciones Artezblai',
  'Ñaque Editora',
  'Ediciones Irreverentes',
]

interface ScoredMatch {
  book: GoogleBookVolume
  confidence: number
  breakdown: ConfidenceBreakdown
  notes: string[]
}

/**
 * Main function to find Spanish translation of a book
 * Uses Google Books API with intelligent search and scoring
 */
export async function findSpanishTranslation(
  originalBook: Book
): Promise<TranslationInvestigationResult> {
  const startTime = Date.now()
  const notes: string[] = []

  try {
    notes.push(`Starting investigation for: "${originalBook.title}"`)

    // Strategy 1: Search by ISBN (highest confidence if found)
    let candidates: GoogleBookVolume[] = []
    if (originalBook.isbn_13 || originalBook.isbn_10) {
      const isbn = originalBook.isbn_13 || originalBook.isbn_10!
      notes.push(`Tier 1: Searching by ISBN: ${isbn}`)
      candidates = await searchByISBN(isbn)
      notes.push(`Found ${candidates.length} results via ISBN search`)
    }

    // Strategy 2: Exact title + author search
    if (candidates.length === 0 && originalBook.authors && originalBook.authors.length > 0) {
      notes.push(`Tier 2: Searching by exact title + author`)
      const titleAuthorResults = await searchByTitleAuthor(originalBook.title, originalBook.authors)
      candidates = [...candidates, ...titleAuthorResults]
      notes.push(`Found ${titleAuthorResults.length} results via title+author search`)
    }

    // Strategy 3: Fuzzy keyword search with "traducción"
    if (candidates.length === 0) {
      notes.push(`Tier 3: Fuzzy keyword search with "traducción"`)
      const fuzzyResults = await searchFuzzy(originalBook)
      candidates = [...candidates, ...fuzzyResults]
      notes.push(`Found ${fuzzyResults.length} results via fuzzy search`)
    }

    // Filter to Spanish books only
    const spanishCandidates = filterSpanishBooks(candidates)
    notes.push(`Filtered to ${spanishCandidates.length} Spanish language books`)

    if (spanishCandidates.length === 0) {
      notes.push('No Spanish translations found')
      return {
        translation_found: false,
        confidence_score: 0,
        confidence_breakdown: createEmptyBreakdown(),
        investigation_notes: notes.join('\n'),
        method: 'google_books_auto',
      }
    }

    // Score and rank all candidates
    const scoredMatches = rankMatches(originalBook, spanishCandidates)
    const bestMatch = scoredMatches[0]

    notes.push(`Best match: "${bestMatch.book.volumeInfo.title}"`)
    notes.push(`Confidence: ${bestMatch.confidence}%`)
    notes.push(...bestMatch.notes)

    const isbns = googleBooks.getISBNs(bestMatch.book)
    const duration = ((Date.now() - startTime) / 1000).toFixed(2)
    notes.push(`Investigation completed in ${duration}s`)

    return {
      translation_found: true,
      confidence_score: bestMatch.confidence,
      confidence_breakdown: bestMatch.breakdown,
      spanish_book: {
        google_books_id: bestMatch.book.id,
        title: bestMatch.book.volumeInfo.title,
        subtitle: bestMatch.book.volumeInfo.subtitle,
        authors: bestMatch.book.volumeInfo.authors,
        publisher: bestMatch.book.volumeInfo.publisher,
        published_date: bestMatch.book.volumeInfo.publishedDate,
        isbn_13: isbns.isbn13,
        isbn_10: isbns.isbn10,
      },
      investigation_notes: notes.join('\n'),
      method: 'google_books_auto',
    }
  } catch (error) {
    notes.push(
      `Error during investigation: ${error instanceof Error ? error.message : 'Unknown error'}`
    )

    return {
      translation_found: false,
      confidence_score: 0,
      confidence_breakdown: createEmptyBreakdown(),
      investigation_notes: notes.join('\n'),
      method: 'google_books_auto',
    }
  }
}

/**
 * Search by ISBN with Spanish language filter
 */
async function searchByISBN(isbn: string): Promise<GoogleBookVolume[]> {
  try {
    const results = await googleBooks.search(`isbn:${isbn} language:es`, 10)
    return results.items || []
  } catch (error) {
    logger.error('[TranslationFinder] ISBN search error', { error, isbn })
    return []
  }
}

/**
 * Search by exact title and author with Spanish filter
 */
async function searchByTitleAuthor(title: string, authors: string[]): Promise<GoogleBookVolume[]> {
  try {
    const author = authors[0] // Use first author for search
    // Try with "traducción" keyword
    const query = `intitle:"${title}" inauthor:"${author}" language:es subject:traducción`
    const results = await googleBooks.search(query, 15)

    // Also try without traducción subject filter (broader)
    const query2 = `intitle:"${title}" inauthor:"${author}" language:es`
    const results2 = await googleBooks.search(query2, 15)

    const combined = [...(results.items || []), ...(results2.items || [])]
    // Deduplicate by volume ID
    return Array.from(new Map(combined.map((book) => [book.id, book])).values())
  } catch (error) {
    logger.error('[TranslationFinder] Title+Author search error', { error, title, authors })
    return []
  }
}

/**
 * Fuzzy keyword search when exact searches fail
 */
async function searchFuzzy(originalBook: Book): Promise<GoogleBookVolume[]> {
  try {
    // Extract key words from title (remove common words)
    const titleKeywords = originalBook.title
      .toLowerCase()
      .replace(/\b(the|a|an|and|or|of|for|in|on|at|to)\b/g, '')
      .trim()
      .split(' ')
      .slice(0, 3) // Take first 3 significant words
      .join(' ')

    const author = originalBook.authors?.[0]?.split(' ').pop() || '' // Last name

    const query = `${titleKeywords} ${author} traducción language:es`
    const results = await googleBooks.search(query, 20)

    return results.items || []
  } catch (error) {
    logger.error('[TranslationFinder] Fuzzy search error', { error, title: originalBook.title })
    return []
  }
}

/**
 * Filter results to Spanish language books only
 */
function filterSpanishBooks(books: GoogleBookVolume[]): GoogleBookVolume[] {
  return books.filter((book) => {
    const lang = book.volumeInfo.language?.toLowerCase()
    return lang === 'es' || lang === 'spa' || lang === 'spanish'
  })
}

/**
 * Rank and score all candidate matches
 */
function rankMatches(original: Book, candidates: GoogleBookVolume[]): ScoredMatch[] {
  const scored = candidates.map((candidate) => {
    const { confidence, breakdown, notes } = calculateConfidence(original, candidate)
    return {
      book: candidate,
      confidence,
      breakdown,
      notes,
    }
  })

  // Sort by confidence descending
  return scored.sort((a, b) => b.confidence - a.confidence)
}

/**
 * Calculate confidence score with detailed breakdown
 * Returns score 0-100 with explanation of each factor
 */
function calculateConfidence(
  original: Book,
  candidate: GoogleBookVolume
): { confidence: number; breakdown: ConfidenceBreakdown; notes: string[] } {
  const breakdown: ConfidenceBreakdown = {
    authorMatch: 0,
    titleSimilarity: 0,
    publisherKnown: 0,
    isbnLinked: 0,
    categoryMatch: 0,
    dateReasonable: 0,
    total: 0,
  }
  const notes: string[] = []

  // Factor 1: Author Match (40 points max)
  if (original.authors && original.authors.length > 0) {
    const originalAuthors = original.authors.map((a) => a.toLowerCase())
    const candidateAuthors = (candidate.volumeInfo.authors || []).map((a) => a.toLowerCase())

    // Check for any author match
    const hasExactMatch = originalAuthors.some((oa) => candidateAuthors.some((ca) => ca === oa))

    if (hasExactMatch) {
      breakdown.authorMatch = 40
      notes.push('✓ Exact author match (+40 pts)')
    } else {
      // Check for last name match
      const originalLastNames = originalAuthors.map((a) => a.split(' ').pop())
      const candidateLastNames = candidateAuthors.map((a) => a.split(' ').pop())
      const hasLastNameMatch = originalLastNames.some((oln) =>
        candidateLastNames.some((cln) => cln === oln)
      )

      if (hasLastNameMatch) {
        breakdown.authorMatch = 25
        notes.push('✓ Last name match (+25 pts)')
      } else {
        notes.push('✗ No author match (0 pts)')
      }
    }
  }

  // Factor 2: Title Similarity (40 points max)
  const originalTitle = original.title.toLowerCase()
  const candidateTitle = candidate.volumeInfo.title.toLowerCase()
  const similarity = compareTwoStrings(originalTitle, candidateTitle)

  if (similarity > 0.9) {
    breakdown.titleSimilarity = 40
    notes.push(`✓ Very high title similarity: ${(similarity * 100).toFixed(1)}% (+40 pts)`)
  } else if (similarity > 0.7) {
    breakdown.titleSimilarity = 30
    notes.push(`✓ High title similarity: ${(similarity * 100).toFixed(1)}% (+30 pts)`)
  } else if (similarity > 0.5) {
    breakdown.titleSimilarity = 20
    notes.push(`~ Medium title similarity: ${(similarity * 100).toFixed(1)}% (+20 pts)`)
  } else {
    // Check for keyword overlap
    const originalWords = new Set(originalTitle.split(' '))
    const candidateWords = new Set(candidateTitle.split(' '))
    const commonWords = [...originalWords].filter((word) => candidateWords.has(word))

    if (commonWords.length >= 2) {
      breakdown.titleSimilarity = 10
      notes.push(`~ Some keyword overlap (+10 pts)`)
    } else {
      notes.push(`✗ Low title similarity: ${(similarity * 100).toFixed(1)}% (0 pts)`)
    }
  }

  // Factor 3: Publisher Known (10 points)
  const publisher = candidate.volumeInfo.publisher || ''
  if (SPANISH_PUBLISHERS.some((sp) => publisher.includes(sp))) {
    breakdown.publisherKnown = 10
    notes.push(`✓ Known Spanish publisher: ${publisher} (+10 pts)`)
  }

  // Factor 4: ISBN Linked (10 points bonus)
  // This would be set externally if found via ISBN search
  // For now, we'll leave it at 0 and set it in the search function if applicable

  // Factor 5: Category Match (5 points)
  const originalHasPerformingArts = googleBooks.isPerformingArtsRelated({
    ...candidate,
    volumeInfo: { ...candidate.volumeInfo, title: original.title },
  })
  const candidateHasPerformingArts = googleBooks.isPerformingArtsRelated(candidate)

  if (originalHasPerformingArts && candidateHasPerformingArts) {
    breakdown.categoryMatch = 5
    notes.push('✓ Performing arts category match (+5 pts)')
  }

  // Factor 6: Date Reasonable (5 points)
  const originalYear = original.published_date
    ? parseInt(original.published_date.substring(0, 4))
    : null
  const candidateYear = candidate.volumeInfo.publishedDate
    ? parseInt(candidate.volumeInfo.publishedDate.substring(0, 4))
    : null

  if (originalYear && candidateYear) {
    if (candidateYear >= originalYear) {
      breakdown.dateReasonable = 5
      notes.push(`✓ Published after original (${candidateYear} >= ${originalYear}) (+5 pts)`)
    } else if (candidateYear === originalYear - 1) {
      breakdown.dateReasonable = 3
      notes.push(`~ Published same year as original (+3 pts)`)
    } else {
      notes.push(`✗ Published before original (${candidateYear} < ${originalYear}) (0 pts)`)
    }
  }

  // Calculate total (cap at 100)
  breakdown.total = Math.min(
    100,
    breakdown.authorMatch +
      breakdown.titleSimilarity +
      breakdown.publisherKnown +
      breakdown.isbnLinked +
      breakdown.categoryMatch +
      breakdown.dateReasonable
  )

  return {
    confidence: breakdown.total,
    breakdown,
    notes,
  }
}

/**
 * Create empty breakdown (for not found cases)
 */
function createEmptyBreakdown(): ConfidenceBreakdown {
  return {
    authorMatch: 0,
    titleSimilarity: 0,
    publisherKnown: 0,
    isbnLinked: 0,
    categoryMatch: 0,
    dateReasonable: 0,
    total: 0,
  }
}

/**
 * Export for easy addition of publishers
 */
export function addSpanishPublisher(publisher: string): void {
  if (!SPANISH_PUBLISHERS.includes(publisher)) {
    SPANISH_PUBLISHERS.push(publisher)
  }
}

/**
 * Get list of known publishers (for admin UI)
 */
export function getKnownPublishers(): string[] {
  return [...SPANISH_PUBLISHERS]
}
