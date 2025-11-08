// =====================================================
// GOOGLE BOOKS API TYPES
// =====================================================

export interface GoogleBookVolume {
  kind: string
  id: string
  etag?: string
  selfLink?: string
  volumeInfo: GoogleBookVolumeInfo
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

export type BookCoverSize =
  | 'smallThumbnail'
  | 'thumbnail'
  | 'small'
  | 'medium'
  | 'large'
  | 'extraLarge'

// =====================================================
// DATABASE TYPES - BOOKS (Editorial Workspace)
// =====================================================

export type BookStatus =
  | 'discovered'
  | 'under_review'
  | 'selected'
  | 'in_translation'
  | 'published'
  | 'rejected'

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
  added_by?: string | null // Firebase UID (text)
  added_at: string
  updated_at: string
  reviewed_at?: string | null
  reviewed_by?: string | null // Firebase UID (text)

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
  checked_by?: string | null // Firebase UID (text)

  // Promotion to catalog
  promoted_to_catalog: boolean
  catalog_volume_id?: string | null

  // Preparation for publication
  temp_cover_twicpics_path?: string | null
  publication_description_es?: string | null
  publication_excerpt_es?: string | null
  publication_table_of_contents?: TableOfContents | null
  temp_authors?: any[] | null // Temporary author assignments
  temp_translators?: any[] | null // Temporary translator assignments
}

export interface BookCreateInput {
  googleBooksId: string
}

export interface BookUpdateInput {
  status?: BookStatus
  translated_title?: string | null
  selected_for_translation?: boolean
  translation_priority?: number | null
  marketability_score?: number | null
  relevance_score?: number | null
  internal_notes?: string | null
  rejection_reason?: string | null
  publication_description_es?: string | null
  publication_excerpt_es?: string | null
  publication_table_of_contents?: TableOfContents | null
  temp_cover_twicpics_path?: string | null
  temp_authors?: any[] | null
  temp_translators?: any[] | null
}

export interface TranslationInvestigationResult {
  translation_found: boolean
  confidence_score: number
  confidence_breakdown: ConfidenceBreakdown
  investigation_notes?: string
  method?: string
  spanish_book?: {
    title: string
    subtitle?: string
    authors?: string[]
    publisher?: string
    published_date?: string
    isbn_13?: string
    isbn_10?: string
    google_books_id?: string
  }
}

// =====================================================
// DATABASE TYPES - CATALOG VOLUMES (Public Catalog)
// =====================================================

export type VolumeType = 'translated' | 'original' | 'adapted'

export type PublicationStatus = 'draft' | 'published' | 'archived'

export interface TableOfContents {
  chapters: {
    number?: number
    title: string
    page?: number
    sections?: {
      title: string
      page?: number
    }[]
  }[]
}

export interface ReviewQuote {
  text: string
  source: string
  author?: string
  date?: string
}

export interface EditorialTeam {
  editor?: string
  contributors?: string[]
  compiler?: string
  [key: string]: string | string[] | undefined
}

export interface CatalogVolume {
  id: string

  // Type & Status
  volume_type: VolumeType
  publication_status: PublicationStatus

  // Universal Metadata
  title: string
  subtitle?: string | null
  description: string

  // Publishing Info
  publisher_id?: string | null
  publisher_name: string
  publication_year?: number | null
  isbn_13?: string | null
  isbn_10?: string | null
  language: string
  page_count?: number | null

  // Cover Image (TwicPics)
  cover_twicpics_path?: string | null
  cover_url?: string | null
  cover_fallback_url?: string | null

  // Catalog Organization
  categories?: string[] | null
  tags?: string[] | null
  featured: boolean
  display_order?: number | null

  // Content Previews
  table_of_contents?: TableOfContents | null
  excerpt?: string | null
  reviews_quotes?: ReviewQuote[] | null

  // Display Text (denormalized)
  authors_display?: string | null
  translator_display?: string | null

  // Translation-Specific Fields
  original_language?: string | null
  original_title?: string | null
  original_publisher?: string | null
  original_publication_year?: number | null
  original_isbn_13?: string | null
  original_isbn_10?: string | null
  original_google_books_id?: string | null
  source_book_id?: string | null
  translation_year?: number | null
  translation_notes?: string | null

  // Rights Information
  translation_rights_holder?: string | null
  translation_rights_expiry?: string | null
  rights_notes?: string | null

  // Original Publication Fields
  editorial_team?: EditorialTeam | null
  compilation_notes?: string | null

  // SEO
  seo_description?: string | null
  seo_keywords?: string[] | null
  slug?: string | null

  // Tracking
  created_at: string
  published_at?: string | null
  updated_at: string
  created_by?: string | null // Firebase UID (text)
  published_by?: string | null // Firebase UID (text)
}

export interface CatalogVolumeCreateInput {
  volume_type: VolumeType
  title: string
  subtitle?: string
  description: string
  publisher_id?: string
  publisher_name?: string
  publication_year?: number
  isbn_13?: string
  isbn_10?: string
  language?: string
  page_count?: number
  cover_twicpics_path?: string
  cover_fallback_url?: string
  categories?: string[]
  tags?: string[]
  featured?: boolean
  table_of_contents?: TableOfContents
  excerpt?: string
  reviews_quotes?: ReviewQuote[]

  // Translation-specific
  original_language?: string
  original_title?: string
  original_publisher?: string
  original_publication_year?: number
  original_isbn_13?: string
  original_isbn_10?: string
  original_google_books_id?: string
  translation_year?: number
  translation_notes?: string
  translation_rights_holder?: string

  // Original publication
  editorial_team?: EditorialTeam
  compilation_notes?: string

  // SEO
  seo_description?: string
  seo_keywords?: string[]
  slug?: string
}

export interface CatalogVolumeUpdateInput {
  title?: string
  subtitle?: string
  description?: string
  publication_status?: PublicationStatus
  publisher_id?: string
  publisher_name?: string
  publication_year?: number
  isbn_13?: string
  isbn_10?: string
  page_count?: number
  cover_twicpics_path?: string
  cover_url?: string
  categories?: string[]
  tags?: string[]
  featured?: boolean
  table_of_contents?: TableOfContents
  excerpt?: string
  reviews_quotes?: ReviewQuote[]
  translation_notes?: string
  editorial_team?: EditorialTeam
  compilation_notes?: string
  seo_description?: string
  seo_keywords?: string[]
  slug?: string
}

// =====================================================
// DATABASE TYPES - CONTRIBUTORS
// =====================================================

export type ContributorRole =
  | 'author'
  | 'translator'
  | 'editor'
  | 'illustrator'
  | 'narrator'
  | 'other'

export interface SocialMedia {
  twitter?: string
  instagram?: string
  facebook?: string
  linkedin?: string
  website?: string
  [key: string]: string | undefined
}

export interface Contributor {
  id: string
  full_name: string
  slug: string
  name_variants?: string[] | null
  primary_role: ContributorRole

  // Bio
  bio_es?: string | null
  bio_en?: string | null

  // Media (TwicPics)
  photo_twicpics_path?: string | null
  photo_url?: string | null

  // Background
  nationality?: string | null
  birth_year?: number | null
  death_year?: number | null

  // Links
  website_url?: string | null
  social_media?: SocialMedia | null

  // Translator-specific
  translator_specializations?: string[] | null
  translator_languages?: string[] | null

  // SEO
  seo_description?: string | null
  keywords?: string[] | null

  // Metadata
  is_active: boolean
  created_at: string
  updated_at: string
  created_by?: string | null // Firebase UID (text)
}

export interface ContributorCreateInput {
  full_name: string
  slug: string
  name_variants?: string[]
  primary_role: ContributorRole
  bio_es?: string
  bio_en?: string
  photo_twicpics_path?: string
  nationality?: string
  birth_year?: number
  death_year?: number
  website_url?: string
  social_media?: SocialMedia
  translator_specializations?: string[]
  translator_languages?: string[]
  seo_description?: string
  keywords?: string[]
}

export interface ContributorUpdateInput {
  full_name?: string
  slug?: string
  name_variants?: string[]
  primary_role?: ContributorRole
  bio_es?: string
  bio_en?: string
  photo_cloudinary_id?: string
  photo_url?: string
  nationality?: string
  birth_year?: number
  death_year?: number
  website_url?: string
  social_media?: SocialMedia
  translator_specializations?: string[]
  translator_languages?: string[]
  seo_description?: string
  keywords?: string[]
  is_active?: boolean
}

// =====================================================
// DATABASE TYPES - VOLUME CONTRIBUTORS
// =====================================================

export type VolumeContributorRole =
  | 'author'
  | 'translator'
  | 'editor'
  | 'illustrator'
  | 'narrator'
  | 'foreword'
  | 'introduction'
  | 'afterword'
  | 'compiler'
  | 'contributor'

export interface VolumeContributor {
  id: string
  volume_id: string
  contributor_id: string
  role: VolumeContributorRole
  role_description?: string | null
  display_order: number
  featured: boolean
  is_original_contributor: boolean
  created_at: string
}

export interface VolumeContributorCreateInput {
  volume_id: string
  contributor_id: string
  role: VolumeContributorRole
  role_description?: string
  display_order?: number
  featured?: boolean
  is_original_contributor?: boolean
}

export interface VolumeContributorWithDetails extends VolumeContributor {
  contributor: Contributor
}

// =====================================================
// DATABASE TYPES - PUBLISHERS
// =====================================================

export interface Publisher {
  id: string
  name: string
  slug: string
  country?: string | null
  website_url?: string | null
  contact_email?: string | null
  relationship_notes?: string | null
  permissions_contact?: string | null
  is_active: boolean
  created_at: string
  updated_at: string
  created_by?: string | null
}

export interface PublisherCreateInput {
  name: string
  slug: string
  country?: string
  website_url?: string
  contact_email?: string
  relationship_notes?: string
  permissions_contact?: string
}

export interface PublisherUpdateInput {
  name?: string
  slug?: string
  country?: string
  website_url?: string
  contact_email?: string
  relationship_notes?: string
  permissions_contact?: string
  is_active?: boolean
}

// =====================================================
// DATABASE TYPES - TRANSLATION GLOSSARY
// =====================================================

export interface TranslationGlossaryEntry {
  id: string
  term_en: string
  term_es: string
  context?: string | null
  category?: string | null
  notes?: string | null
  usage_count: number
  created_at: string
  updated_at: string
  created_by?: string | null // Firebase UID (text)
}

export interface GlossaryCreateInput {
  term_en: string
  term_es: string
  context?: string
  category?: string
  notes?: string
}

// =====================================================
// EXTENDED TYPES
// =====================================================

export interface BookWithGoogleData extends Book {
  googleData?: GoogleBookVolume
}

export interface CatalogVolumeWithContributors extends CatalogVolume {
  contributors: VolumeContributorWithDetails[]
}

export interface CatalogVolumeWithPublisher extends CatalogVolume {
  publisher?: Publisher
}

export interface CatalogVolumeFull extends CatalogVolume {
  contributors: VolumeContributorWithDetails[]
  publisher?: Publisher
  source_book?: Book
}

// =====================================================
// PUBLICATION WORKFLOW TYPES
// =====================================================

export interface PromoteToCatalogInput {
  volume_type?: VolumeType
  title?: string
  subtitle?: string
  description?: string
  publication_year?: number
  isbn_13?: string
  isbn_10?: string
  cover_cloudinary_id?: string
  cover_fallback_url?: string
  categories?: string[]
  tags?: string[]
  table_of_contents?: TableOfContents
  excerpt?: string
  translation_year?: number
  translation_notes?: string
  slug?: string
}

export interface AutoTranslateRequest {
  text: string
  source_language?: string
  target_language?: string
  use_glossary?: boolean
}

export interface AutoTranslateResponse {
  translated_text: string
  glossary_terms_used: string[]
  confidence?: number
}

// =====================================================
// UTILITY TYPES
// =====================================================

export interface BookSearchParams {
  query?: string
  status?: BookStatus
  selected?: boolean
  limit?: number
}

export interface CatalogSearchParams {
  query?: string
  volume_type?: VolumeType
  categories?: string[]
  tags?: string[]
  featured?: boolean
  limit?: number
}

export interface PaginationParams {
  page?: number
  per_page?: number
}

export interface SearchResult<T> {
  items: T[]
  total: number
  page: number
  per_page: number
  total_pages: number
}

// =====================================================
// BATCH OPERATIONS
// =====================================================

export interface BatchInvestigationProgress {
  total: number
  completed: number
  failed: number
  found: number
  not_found: number
  needs_review: number
  current_book?: string
}
