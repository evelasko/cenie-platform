'use client'

import { useEffect, useState } from 'react'
import { use } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Loader2,
  AlertCircle,
  Book as BookIcon,
  ExternalLink,
  Save,
  ArrowLeft,
  Calendar,
  User,
  Globe,
  Hash,
  Search,
  RefreshCw,
  FileEdit,
  Building2,
  Star,
} from 'lucide-react'
import Button from '@/components/ui/Button'
import { clsx } from 'clsx'
import { TYPOGRAPHY } from '@/lib/typography'
import type {
  Book,
  BookStatus,
  GoogleBookVolume,
  TranslationInvestigationResult,
} from '@/types/books'
import { googleBooks } from '@/lib/google-books'
import { ConfidenceBreakdownComponent } from '@/components/dashboard/ConfidenceBreakdown'
import { useToast } from '@/components/ui/ToastContainer'
import AddContributorModal from '@/components/dashboard/AddContributorModal'
import { Plus } from 'lucide-react'
import { logger } from '@/lib/logger-client'

const statusOptions: { value: BookStatus; label: string }[] = [
  { value: 'discovered', label: 'Discovered' },
  { value: 'under_review', label: 'Under Review' },
  { value: 'selected', label: 'Selected' },
  { value: 'in_translation', label: 'In Translation' },
  { value: 'published', label: 'Published' },
  { value: 'rejected', label: 'Rejected' },
]

export default function BookDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const toast = useToast()
  const [book, setBook] = useState<Book | null>(null)
  const [googleData, setGoogleData] = useState<GoogleBookVolume | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [investigating, setInvestigating] = useState(false)
  const [translationResult, setTranslationResult] = useState<TranslationInvestigationResult | null>(
    null
  )
  const [existingContributors, setExistingContributors] = useState<
    Map<string, { id: string; slug: string }>
  >(new Map())
  const [showAddContributorModal, setShowAddContributorModal] = useState(false)
  const [selectedAuthor, setSelectedAuthor] = useState<string | null>(null)

  // Form state
  const [status, setStatus] = useState<BookStatus>('discovered')
  const [translatedTitle, setTranslatedTitle] = useState('')
  const [selectedForTranslation, setSelectedForTranslation] = useState(false)
  const [translationPriority, setTranslationPriority] = useState<number | null>(null)
  const [marketabilityScore, setMarketabilityScore] = useState<number | null>(null)
  const [relevanceScore, setRelevanceScore] = useState<number | null>(null)
  const [internalNotes, setInternalNotes] = useState('')
  const [rejectionReason, setRejectionReason] = useState('')

  useEffect(() => {
    fetchBook()
  }, [resolvedParams.id])

  // Check existing contributors whenever book authors change
  useEffect(() => {
    if (book?.authors && book.authors.length > 0) {
      checkExistingContributors()
    }
  }, [book?.authors])

  const fetchBook = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/books/${resolvedParams.id}`, {
        credentials: 'include',
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch book')
      }

      const bookData: Book = data.book
      setBook(bookData)

      // Set form values
      setStatus(bookData.status)
      setTranslatedTitle(bookData.translated_title || '')
      setSelectedForTranslation(bookData.selected_for_translation)
      setTranslationPriority(bookData.translation_priority ?? null)
      setMarketabilityScore(bookData.marketability_score ?? null)
      setRelevanceScore(bookData.relevance_score ?? null)
      setInternalNotes(bookData.internal_notes || '')
      setRejectionReason(bookData.rejection_reason || '')

      // Fetch Google Books data
      try {
        const googleBookData = await googleBooks.getBook(bookData.google_books_id)
        setGoogleData(googleBookData)
      } catch (err) {
        logger.error('Failed to fetch Google Books data', { error: err })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch book')
    } finally {
      setLoading(false)
    }
  }

  const checkExistingContributors = async () => {
    const authors = book?.authors
    if (!authors || authors.length === 0) return

    try {
      // Check each author against the contributors database
      const checks = await Promise.all(
        authors.map(async (authorName) => {
          const response = await fetch(
            `/api/contributors/search?q=${encodeURIComponent(authorName)}&role=author&limit=1`,
            { credentials: 'include' }
          )
          const data = await response.json()

          // Check if there's an exact match (case-insensitive)
          const exactMatch = data.contributors?.find(
            (c: any) => c.full_name.toLowerCase() === authorName.toLowerCase()
          )

          return {
            authorName,
            contributor: exactMatch ? { id: exactMatch.id, slug: exactMatch.slug } : null,
          }
        })
      )

      const existing = new Map(
        checks.filter((c) => c.contributor !== null).map((c) => [c.authorName, c.contributor!])
      )
      setExistingContributors(existing)
    } catch (err) {
      logger.error('Failed to check existing contributors', { error: err })
    }
  }

  const handleAddContributor = (authorName: string) => {
    setSelectedAuthor(authorName)
    setShowAddContributorModal(true)
  }

  const handleContributorAdded = () => {
    toast.success('Contributor added successfully!')
    // Refresh the list of existing contributors
    checkExistingContributors()
  }

  const handleSave = async () => {
    setSaving(true)

    try {
      const response = await fetch(`/api/books/${resolvedParams.id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          translated_title: translatedTitle || null,
          selected_for_translation: selectedForTranslation,
          translation_priority: translationPriority,
          marketability_score: marketabilityScore,
          relevance_score: relevanceScore,
          internal_notes: internalNotes || null,
          rejection_reason: rejectionReason || null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save book')
      }

      setBook(data.book)
      toast.success('Book updated successfully!')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save book')
    } finally {
      setSaving(false)
    }
  }

  const handleInvestigateTranslation = async () => {
    setInvestigating(true)

    try {
      const response = await fetch(`/api/books/${resolvedParams.id}/investigate-translation`, {
        method: 'POST',
        credentials: 'include',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to investigate translation')
      }

      setTranslationResult(data)

      // Refresh book data to get updated translation status
      await fetchBook()

      if (data.translation_found) {
        toast.success(`Translation found! Confidence: ${data.confidence_score}%`, 7000)
      } else {
        toast.info('No translation found', 5000)
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to investigate translation')
    } finally {
      setInvestigating(false)
    }
  }

  const coverUrl =
    googleData?.volumeInfo.imageLinks?.thumbnail?.replace('http://', 'https://') || null

  if (loading) {
    return (
      <div className="bg-card rounded-none shadow-sm border border-border p-12 text-center">
        <Loader2 className="h-12 w-12 text-primary mx-auto mb-4 animate-spin" />
        <p className={clsx(TYPOGRAPHY.bodyBase, 'text-muted-foreground')}>Loading book...</p>
      </div>
    )
  }

  if (error || !book) {
    return (
      <div className="space-y-4">
        <Link href="/dashboard/books">
          <Button variant="outlined" size="sm" leadingIcon={ArrowLeft}>
            Back to Books
          </Button>
        </Link>
        <div className="bg-destructive/10 border border-destructive/20 rounded-none p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
          <div>
            <h3 className={clsx(TYPOGRAPHY.h5, 'font-medium text-destructive')}>
              Error Loading Book
            </h3>
            <p className={clsx(TYPOGRAPHY.bodySmall, 'text-destructive/80 mt-1')}>
              {error || 'Book not found'}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <AddContributorModal
        isOpen={showAddContributorModal}
        onClose={() => setShowAddContributorModal(false)}
        authorName={selectedAuthor || ''}
        onSuccess={handleContributorAdded}
      />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link href="/dashboard/books">
            <Button variant="outlined" size="sm" leadingIcon={ArrowLeft}>
              Back to Books
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            {book.selected_for_translation && (
              <Link href={`/dashboard/books/${resolvedParams.id}/prepare`}>
                <Button variant="outlined" leadingIcon={FileEdit}>
                  Prepare for Publication
                </Button>
              </Link>
            )}
            <Button onClick={handleSave} disabled={saving} variant="primary" leadingIcon={Save}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>

        {/* Book Info */}
        <div className="bg-card rounded-none shadow-sm border border-border p-6">
          <div className="flex gap-6">
            {/* Cover */}
            <div className="shrink-0">
              {coverUrl ? (
                <Image
                  src={coverUrl}
                  alt={book.title}
                  width={160}
                  height={240}
                  className="rounded-none shadow-lg"
                  unoptimized
                />
              ) : (
                <div className="w-40 h-60 bg-muted rounded-none flex items-center justify-center">
                  <BookIcon className="h-16 w-16 text-muted-foreground" />
                </div>
              )}
            </div>

            {/* Details */}
            <div className="flex-1">
              <h1 className={clsx(TYPOGRAPHY.display1, 'leading-12! text-foreground mb-6')}>
                {book.title}
              </h1>
              {book.subtitle && (
                <p className={clsx(TYPOGRAPHY.h4, 'text-muted-foreground mb-4')}>{book.subtitle}</p>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {book.authors && book.authors.length > 0 && (
                  <div className={clsx(TYPOGRAPHY.bodyBase, 'flex items-start text-foreground')}>
                    <User className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground shrink-0" />
                    <div className="flex-1 flex flex-wrap items-center gap-2">
                      {(book.authors || []).map((author, index, arr) => {
                        const contributor = existingContributors.get(author)
                        return (
                          <span key={author} className="inline-flex items-center gap-1">
                            {contributor ? (
                              <Link
                                href={`/dashboard/contributors/${contributor.id}`}
                                className="text-primary hover:text-primary/80 underline decoration-primary/30 hover:decoration-primary/60 underline-offset-2 transition-colors"
                              >
                                {author}
                              </Link>
                            ) : (
                              <span>{author}</span>
                            )}
                            {!contributor && (
                              <button
                                onClick={() => handleAddContributor(author)}
                                className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
                                title={`Add ${author} as contributor`}
                                aria-label={`Add ${author} as contributor`}
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            )}
                            {index < arr.length - 1 && <span className="mr-1">,</span>}
                          </span>
                        )
                      })}
                    </div>
                  </div>
                )}
                {book.published_date && (
                  <div className={clsx(TYPOGRAPHY.bodyBase, 'flex items-center text-foreground')}>
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{book.published_date}</span>
                  </div>
                )}
                {book.language && (
                  <div className={clsx(TYPOGRAPHY.bodyBase, 'flex items-center text-foreground')}>
                    <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{book.language.toUpperCase()}</span>
                  </div>
                )}
                {(book.isbn_13 || book.isbn_10) && (
                  <div className={clsx(TYPOGRAPHY.bodyBase, 'flex items-center text-foreground')}>
                    <Hash className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{book.isbn_13 || book.isbn_10}</span>
                  </div>
                )}
                {googleData?.volumeInfo?.publisher && (
                  <div className={clsx(TYPOGRAPHY.bodyBase, 'flex items-center text-foreground')}>
                    <Building2 className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{googleData?.volumeInfo?.publisher}</span>
                  </div>
                )}
                {googleData?.volumeInfo?.averageRating && (
                  <div className={clsx(TYPOGRAPHY.bodyBase, 'flex items-center text-foreground')}>
                    <Star className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{googleData?.volumeInfo?.averageRating.toFixed(1)}</span>
                  </div>
                )}
              </div>

              {googleData?.volumeInfo.description && (
                <div className="mb-4">
                  <h3 className={clsx(TYPOGRAPHY.h5, 'font-semibold text-foreground mb-2')}>
                    Description
                  </h3>
                  <p
                    className={clsx(
                      TYPOGRAPHY.bodyBase,
                      'text-muted-foreground leading-relaxed line-clamp-4'
                    )}
                  >
                    {googleData.volumeInfo.description}
                  </p>
                </div>
              )}

              {googleData?.volumeInfo.previewLink && (
                <div className="flex justify-end">
                  <a
                    href={googleData.volumeInfo.previewLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={clsx(
                      TYPOGRAPHY.bodySmall,
                      'inline-flex items-center text-primary hover:text-primary/80 transition-colors gap-1'
                    )}
                  >
                    View on Google Books
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Editorial Form */}
        <div className="bg-card rounded-none shadow-sm border border-border p-6">
          <h2 className={clsx(TYPOGRAPHY.h3, 'text-foreground mb-6')}>Editorial Information</h2>

          <div className="space-y-6">
            {/* Status */}
            <div>
              <label
                className={clsx(TYPOGRAPHY.bodySmall, 'block font-medium text-foreground mb-2')}
              >
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as BookStatus)}
                className={clsx(
                  TYPOGRAPHY.bodyBase,
                  'w-full px-3 py-2 border border-border rounded-none focus:outline-none focus:ring-2 focus:ring-primary'
                )}
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Translated Title */}
            <div>
              <label
                className={clsx(TYPOGRAPHY.bodySmall, 'block font-medium text-foreground mb-2')}
              >
                Translated Title (Spanish)
              </label>
              <input
                type="text"
                value={translatedTitle}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setTranslatedTitle(e.target.value)
                }
                placeholder="Enter Spanish title..."
                className={clsx(
                  TYPOGRAPHY.bodyBase,
                  'w-full px-3 py-2 border border-border rounded-none focus:outline-none focus:ring-2 focus:ring-primary'
                )}
              />
            </div>

            {/* Selected for Translation */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="selected"
                checked={selectedForTranslation}
                onChange={(e) => setSelectedForTranslation(e.target.checked)}
                className="h-4 w-4 text-primary focus:ring-primary border-border rounded-none"
              />
              <label
                htmlFor="selected"
                className={clsx(TYPOGRAPHY.bodyBase, 'ml-2 block text-foreground')}
              >
                Selected for Translation
              </label>
            </div>

            {/* Priority */}
            <div>
              <label
                className={clsx(TYPOGRAPHY.bodySmall, 'block font-medium text-foreground mb-2')}
              >
                Translation Priority (1-5)
              </label>
              <input
                type="number"
                min="1"
                max="5"
                value={translationPriority || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setTranslationPriority(e.target.value ? parseInt(e.target.value) : null)
                }
                placeholder="1 = highest, 5 = lowest"
                className={clsx(
                  TYPOGRAPHY.bodyBase,
                  'w-full px-3 py-2 border border-border rounded-none focus:outline-none focus:ring-2 focus:ring-primary'
                )}
              />
            </div>

            {/* Scores */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  className={clsx(TYPOGRAPHY.bodySmall, 'block font-medium text-foreground mb-2')}
                >
                  Marketability Score (1-10)
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={marketabilityScore || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setMarketabilityScore(e.target.value ? parseInt(e.target.value) : null)
                  }
                  className={clsx(
                    TYPOGRAPHY.bodyBase,
                    'w-full px-3 py-2 border border-border rounded-none focus:outline-none focus:ring-2 focus:ring-primary'
                  )}
                />
              </div>
              <div>
                <label
                  className={clsx(TYPOGRAPHY.bodySmall, 'block font-medium text-foreground mb-2')}
                >
                  Relevance Score (1-10)
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={relevanceScore || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setRelevanceScore(e.target.value ? parseInt(e.target.value) : null)
                  }
                  className={clsx(
                    TYPOGRAPHY.bodyBase,
                    'w-full px-3 py-2 border border-border rounded-none focus:outline-none focus:ring-2 focus:ring-primary'
                  )}
                />
              </div>
            </div>

            {/* Internal Notes */}
            <div>
              <label
                className={clsx(TYPOGRAPHY.bodySmall, 'block font-medium text-foreground mb-2')}
              >
                Internal Notes
              </label>
              <textarea
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                rows={4}
                className={clsx(
                  TYPOGRAPHY.bodyBase,
                  'w-full px-3 py-2 border border-border rounded-none focus:outline-none focus:ring-2 focus:ring-primary'
                )}
                placeholder="Add internal notes, observations, or comments..."
              />
            </div>

            {/* Rejection Reason */}
            {status === 'rejected' && (
              <div>
                <label
                  className={clsx(TYPOGRAPHY.bodySmall, 'block font-medium text-foreground mb-2')}
                >
                  Rejection Reason
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={3}
                  className={clsx(
                    TYPOGRAPHY.bodyBase,
                    'w-full px-3 py-2 border border-border rounded-none focus:outline-none focus:ring-2 focus:ring-primary'
                  )}
                  placeholder="Why was this book rejected?"
                />
              </div>
            )}
          </div>
        </div>

        {/* Translation Investigation */}
        <div className="bg-card rounded-none shadow-sm border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className={clsx(TYPOGRAPHY.h3, 'text-foreground')}>
              Spanish Translation Investigation
            </h2>
            <Button
              onClick={handleInvestigateTranslation}
              disabled={investigating || book.translation_status === 'checking'}
              variant="outlined"
              leadingIcon={investigating ? RefreshCw : Search}
            >
              {investigating
                ? 'Investigating...'
                : book.translation_status === 'not_checked'
                  ? 'Check for Translation'
                  : 'Re-check Translation'}
            </Button>
          </div>

          {/* Current Status */}
          {book.translation_status !== 'not_checked' && (
            <div className="mb-4">
              <div
                className={clsx(
                  TYPOGRAPHY.bodyBase,
                  'inline-flex items-center px-3 py-1 rounded-full',
                  book.translation_status === 'found' && 'bg-green-100 text-green-800',
                  book.translation_status === 'not_found' && 'bg-gray-100 text-gray-800',
                  book.translation_status === 'needs_review' && 'bg-yellow-100 text-yellow-800',
                  book.translation_status === 'checking' && 'bg-blue-100 text-blue-800'
                )}
              >
                {book.translation_status === 'found' && '✓ Translation Found'}
                {book.translation_status === 'not_found' && '✗ No Translation Found'}
                {book.translation_status === 'needs_review' && '! Needs Review'}
                {book.translation_status === 'checking' && '⟳ Checking...'}
              </div>
              {book.last_checked_at && (
                <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground mt-2')}>
                  Last checked: {new Date(book.last_checked_at).toLocaleString()}
                </p>
              )}
            </div>
          )}

          {/* Translation Result (from latest investigation) */}
          {translationResult &&
            translationResult.translation_found &&
            translationResult.spanish_book && (
              <div className="space-y-4">
                {/* Spanish Book Info */}
                <div className="bg-green-50 border border-green-200 rounded-none p-4">
                  <h3 className={clsx(TYPOGRAPHY.h4, 'text-green-900 mb-3')}>
                    Spanish Translation Found
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <span className={clsx(TYPOGRAPHY.bodySmall, 'text-green-700 font-medium')}>
                        Title:
                      </span>
                      <p className={clsx(TYPOGRAPHY.bodyBase, 'text-green-900')}>
                        {translationResult.spanish_book.title}
                        {translationResult.spanish_book.subtitle &&
                          ` - ${translationResult.spanish_book.subtitle}`}
                      </p>
                    </div>
                    {translationResult.spanish_book.authors &&
                      translationResult.spanish_book.authors.length > 0 && (
                        <div>
                          <span
                            className={clsx(TYPOGRAPHY.bodySmall, 'text-green-700 font-medium')}
                          >
                            Authors:
                          </span>
                          <p className={clsx(TYPOGRAPHY.bodyBase, 'text-green-900')}>
                            {translationResult.spanish_book.authors.join(', ')}
                          </p>
                        </div>
                      )}
                    {translationResult.spanish_book.publisher && (
                      <div>
                        <span className={clsx(TYPOGRAPHY.bodySmall, 'text-green-700 font-medium')}>
                          Publisher:
                        </span>
                        <p className={clsx(TYPOGRAPHY.bodyBase, 'text-green-900')}>
                          {translationResult.spanish_book.publisher}
                        </p>
                      </div>
                    )}
                    {translationResult.spanish_book.published_date && (
                      <div>
                        <span className={clsx(TYPOGRAPHY.bodySmall, 'text-green-700 font-medium')}>
                          Published:
                        </span>
                        <p className={clsx(TYPOGRAPHY.bodyBase, 'text-green-900')}>
                          {translationResult.spanish_book.published_date}
                        </p>
                      </div>
                    )}
                    {(translationResult.spanish_book.isbn_13 ||
                      translationResult.spanish_book.isbn_10) && (
                      <div>
                        <span className={clsx(TYPOGRAPHY.bodySmall, 'text-green-700 font-medium')}>
                          ISBN:
                        </span>
                        <p className={clsx(TYPOGRAPHY.bodyBase, 'text-green-900 font-mono')}>
                          {translationResult.spanish_book.isbn_13 ||
                            translationResult.spanish_book.isbn_10}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Confidence Breakdown */}
                <ConfidenceBreakdownComponent
                  breakdown={translationResult.confidence_breakdown}
                  notes={translationResult.investigation_notes}
                />
              </div>
            )}

          {/* No Translation Found */}
          {translationResult && !translationResult.translation_found && (
            <div className="bg-gray-50 border border-gray-200 rounded-none p-4">
              <p className={clsx(TYPOGRAPHY.bodyBase, 'text-gray-700')}>
                No Spanish translation was found for this book. The investigation checked:
              </p>
              <ul
                className={clsx(
                  TYPOGRAPHY.bodySmall,
                  'text-gray-600 mt-2 list-disc list-inside space-y-1'
                )}
              >
                <li>ISBN-based search</li>
                <li>Title and author combination</li>
                <li>Fuzzy keyword search with "traducción"</li>
              </ul>
              {translationResult.investigation_notes && (
                <details className="mt-3">
                  <summary
                    className={clsx(
                      TYPOGRAPHY.bodySmall,
                      'text-gray-700 cursor-pointer font-medium'
                    )}
                  >
                    View Investigation Details
                  </summary>
                  <pre
                    className={clsx(
                      TYPOGRAPHY.bodySmall,
                      'mt-2 text-gray-600 whitespace-pre-wrap font-mono'
                    )}
                  >
                    {translationResult.investigation_notes}
                  </pre>
                </details>
              )}
            </div>
          )}

          {/* Stored Translation Data (from database) */}
          {!translationResult && book.translation_status === 'found' && book.spanish_title && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-none p-4">
                <h3 className={clsx(TYPOGRAPHY.h4, 'text-green-900 mb-3')}>
                  Spanish Translation (Stored)
                </h3>
                <div className="space-y-2">
                  <div>
                    <span className={clsx(TYPOGRAPHY.bodySmall, 'text-green-700 font-medium')}>
                      Title:
                    </span>
                    <p className={clsx(TYPOGRAPHY.bodyBase, 'text-green-900')}>
                      {book.spanish_title}
                      {book.spanish_subtitle && ` - ${book.spanish_subtitle}`}
                    </p>
                  </div>
                  {book.spanish_authors && book.spanish_authors.length > 0 && (
                    <div>
                      <span className={clsx(TYPOGRAPHY.bodySmall, 'text-green-700 font-medium')}>
                        Authors:
                      </span>
                      <p className={clsx(TYPOGRAPHY.bodyBase, 'text-green-900')}>
                        {book.spanish_authors.join(', ')}
                      </p>
                    </div>
                  )}
                  {book.spanish_publisher && (
                    <div>
                      <span className={clsx(TYPOGRAPHY.bodySmall, 'text-green-700 font-medium')}>
                        Publisher:
                      </span>
                      <p className={clsx(TYPOGRAPHY.bodyBase, 'text-green-900')}>
                        {book.spanish_publisher}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {book.confidence_breakdown && (
                <ConfidenceBreakdownComponent
                  breakdown={book.confidence_breakdown as any}
                  notes={book.investigation_notes || undefined}
                />
              )}
            </div>
          )}

          {/* Initial State */}
          {book.translation_status === 'not_checked' && !translationResult && (
            <p className={clsx(TYPOGRAPHY.bodyBase, 'text-muted-foreground')}>
              This book has not been checked for Spanish translations yet. Click the button above to
              investigate.
            </p>
          )}
        </div>

        {/* Metadata */}
        <div className="bg-muted rounded-none border border-border p-4">
          <h3 className={clsx(TYPOGRAPHY.h5, 'font-semibold text-foreground mb-3')}>Metadata</h3>
          <div className={clsx(TYPOGRAPHY.bodySmall, 'grid grid-cols-2 gap-x-4 gap-y-2')}>
            <div>
              <span className="text-muted-foreground">Google Books ID:</span>
              <span className="ml-2 font-mono text-foreground">{book.google_books_id}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Added:</span>
              <span className="ml-2 text-foreground">
                {new Date(book.added_at).toLocaleDateString()}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Last Updated:</span>
              <span className="ml-2 text-foreground">
                {new Date(book.updated_at).toLocaleDateString()}
              </span>
            </div>
            {book.reviewed_at && (
              <div>
                <span className="text-muted-foreground">Reviewed:</span>
                <span className="ml-2 text-foreground">
                  {new Date(book.reviewed_at).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
