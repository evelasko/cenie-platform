// =====================================================
// GOOGLE BOOKS API TYPES
// =====================================================

export interface GoogleBookVolume {
  kind: string
  id: string
  etag?: string
  selfLink?: string
  volumeInfo: GoogleBookVolumeInfo
  saleInfo?: GoogleBookSaleInfo
  accessInfo?: GoogleBookAccessInfo
}

export interface GoogleBookVolumeInfo {
  title: string
  subtitle?: string
  authors?: string[]
  publisher?: string
  publishedDate?: string
  description?: string
  industryIdentifiers?: GoogleBookIdentifier[]
  readingModes?: {
    text: boolean
    image: boolean
  }
  pageCount?: number
  printType?: string
  categories?: string[]
  averageRating?: number
  ratingsCount?: number
  maturityRating?: string
  allowAnonLogging?: boolean
  contentVersion?: string
  panelizationSummary?: {
    containsEpubBubbles: boolean
    containsImageBubbles: boolean
  }
  imageLinks?: GoogleBookImageLinks
  language?: string
  previewLink?: string
  infoLink?: string
  canonicalVolumeLink?: string
}

export interface GoogleBookIdentifier {
  type: 'ISBN_10' | 'ISBN_13' | 'ISSN' | 'OTHER'
  identifier: string
}

export interface GoogleBookImageLinks {
  smallThumbnail?: string
  thumbnail?: string
  small?: string
  medium?: string
  large?: string
  extraLarge?: string
}

export interface GoogleBookSaleInfo {
  country?: string
  saleability?: string
  isEbook?: boolean
  listPrice?: {
    amount: number
    currencyCode: string
  }
  retailPrice?: {
    amount: number
    currencyCode: string
  }
  buyLink?: string
}

export interface GoogleBookAccessInfo {
  country?: string
  viewability?: string
  embeddable?: boolean
  publicDomain?: boolean
  textToSpeechPermission?: string
  epub?: {
    isAvailable: boolean
    acsTokenLink?: string
  }
  pdf?: {
    isAvailable: boolean
    acsTokenLink?: string
  }
  webReaderLink?: string
  accessViewStatus?: string
  quoteSharingAllowed?: boolean
}

export interface GoogleBooksSearchResponse {
  kind: string
  totalItems: number
  items?: GoogleBookVolume[]
}

// =====================================================
// DATABASE TYPES
// =====================================================

export type BookStatus =
  | 'discovered'
  | 'under_review'
  | 'selected'
  | 'in_translation'
  | 'published'
  | 'rejected'

export type ReviewRecommendation = 'strong_yes' | 'yes' | 'maybe' | 'no' | 'strong_no'

export type TranslationStatus = 'not_checked' | 'checking' | 'found' | 'not_found' | 'needs_review'

export type InvestigationMethod = 'google_books_auto' | 'manual' | 'llm_assisted'

export interface ConfidenceBreakdown {
  authorMatch: number
  titleSimilarity: number
  publisherKnown: number
  isbnLinked: number
  categoryMatch: number
  dateReasonable: number
  total: number
}

export interface Book {
  id: string
  google_books_id: string
  title: string
  subtitle?: string | null
  authors?: string[] | null
  published_date?: string | null
  language?: string | null
  isbn_13?: string | null
  isbn_10?: string | null
  status: BookStatus
  translated_title?: string | null
  selected_for_translation: boolean
  translation_priority?: number | null
  marketability_score?: number | null
  relevance_score?: number | null
  internal_notes?: string | null
  rejection_reason?: string | null
  added_by?: string | null
  added_at: string
  updated_at: string
  reviewed_at?: string | null
  reviewed_by?: string | null
  // Translation tracking
  translation_status: TranslationStatus
  spanish_title?: string | null
  spanish_subtitle?: string | null
  spanish_authors?: string[] | null
  spanish_google_books_id?: string | null
  spanish_isbn_13?: string | null
  spanish_isbn_10?: string | null
  spanish_publisher?: string | null
  spanish_published_date?: string | null
  confidence_score?: number | null
  confidence_breakdown?: ConfidenceBreakdown | null
  investigation_method?: InvestigationMethod | null
  investigation_notes?: string | null
  last_checked_at?: string | null
  checked_by?: string | null
}

export interface BookTag {
  id: string
  book_id: string
  tag: string
  created_at: string
}

export interface BookReview {
  id: string
  book_id: string
  reviewer_id: string
  rating?: number | null
  review_text?: string | null
  recommendation?: ReviewRecommendation | null
  created_at: string
  updated_at: string
}

// =====================================================
// FORM INPUT TYPES
// =====================================================

export interface BookCreateInput {
  googleBooksId: string
}

export interface BookUpdateInput {
  status?: BookStatus
  translated_title?: string
  selected_for_translation?: boolean
  translation_priority?: number
  marketability_score?: number
  relevance_score?: number
  internal_notes?: string
  rejection_reason?: string
}

export interface BookReviewInput {
  book_id: string
  rating?: number
  review_text?: string
  recommendation?: ReviewRecommendation
}

export interface BookTagInput {
  book_id: string
  tag: string
}

// =====================================================
// EXTENDED TYPES (Book + Google Data)
// =====================================================

export interface BookWithGoogleData extends Book {
  googleData?: GoogleBookVolume
}

export interface BookWithReviews extends Book {
  reviews: BookReview[]
}

export interface BookWithTags extends Book {
  tags: BookTag[]
}

export interface BookFull extends Book {
  googleData?: GoogleBookVolume
  reviews: BookReview[]
  tags: BookTag[]
}

// =====================================================
// UTILITY TYPES
// =====================================================

export interface BookSearchParams {
  query?: string
  status?: BookStatus
  selected?: boolean
  limit?: number
  offset?: number
}

export interface BookStats {
  status: BookStatus
  count: number
}

// Image size options for book covers
export type BookCoverSize = 'smallThumbnail' | 'thumbnail' | 'small' | 'medium' | 'large' | 'extraLarge'

// =====================================================
// TRANSLATION INVESTIGATION TYPES
// =====================================================

export interface TranslationInvestigationResult {
  success: boolean
  translation_found: boolean
  confidence_score: number
  confidence_breakdown: ConfidenceBreakdown
  spanish_book?: {
    google_books_id: string
    title: string
    subtitle?: string
    authors?: string[]
    publisher?: string
    published_date?: string
    isbn_13?: string
    isbn_10?: string
    preview_link?: string
  }
  investigation_notes: string
  checked_at: string
  method: InvestigationMethod
}

export interface BatchInvestigationProgress {
  total: number
  completed: number
  found: number
  not_found: number
  needs_review: number
  failed: number
  current_book?: string
}

export interface SpanishTranslationData {
  title: string
  subtitle?: string
  authors?: string[]
  google_books_id: string
  isbn_13?: string
  isbn_10?: string
  publisher?: string
  published_date?: string
}
