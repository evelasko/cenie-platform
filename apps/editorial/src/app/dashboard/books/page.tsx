'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Loader2, AlertCircle, BookOpen, Filter, ChevronRight, Search, CheckCircle2, XCircle, Clock } from 'lucide-react'
import Button from '@/components/ui/Button'
import { clsx } from 'clsx'
import { TYPOGRAPHY } from '@/lib/typography'
import type { Book, BookStatus, BatchInvestigationProgress } from '@/types/books'

const statusColors: Record<BookStatus, string> = {
  discovered: 'bg-muted text-muted-foreground',
  under_review: 'bg-secondary/10 text-secondary',
  selected: 'bg-primary/10 text-primary',
  in_translation: 'bg-secondary/10 text-secondary',
  published: 'bg-primary/10 text-primary',
  rejected: 'bg-destructive/10 text-destructive',
}

const statusLabels: Record<BookStatus, string> = {
  discovered: 'Discovered',
  under_review: 'Under Review',
  selected: 'Selected',
  in_translation: 'In Translation',
  published: 'Published',
  rejected: 'Rejected',
}

export default function BooksListPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<BookStatus | 'all'>('all')
  const [selectedBooks, setSelectedBooks] = useState<Set<string>>(new Set())
  const [batchInvestigating, setBatchInvestigating] = useState(false)
  const [batchProgress, setBatchProgress] = useState<BatchInvestigationProgress | null>(null)

  useEffect(() => {
    fetchBooks()
  }, [statusFilter])

  const fetchBooks = async () => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      if (statusFilter !== 'all') {
        params.set('status', statusFilter)
      }

      const response = await fetch(`/api/books?${params}`, {
        credentials: 'include',
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch books')
      }

      setBooks(data.books)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch books')
    } finally {
      setLoading(false)
    }
  }

  const formatAuthors = (authors?: string[] | null) => {
    if (!authors || authors.length === 0) return 'Unknown Author'
    if (authors.length === 1) return authors[0]
    if (authors.length === 2) return authors.join(' and ')
    return `${authors[0]} et al.`
  }

  const toggleBookSelection = (bookId: string) => {
    const newSelected = new Set(selectedBooks)
    if (newSelected.has(bookId)) {
      newSelected.delete(bookId)
    } else {
      newSelected.add(bookId)
    }
    setSelectedBooks(newSelected)
  }

  const toggleSelectAll = () => {
    if (selectedBooks.size === books.length) {
      setSelectedBooks(new Set())
    } else {
      setSelectedBooks(new Set(books.map(b => b.id)))
    }
  }

  const handleBatchInvestigation = async () => {
    if (selectedBooks.size === 0) return

    setBatchInvestigating(true)
    const bookIds = Array.from(selectedBooks)

    setBatchProgress({
      total: bookIds.length,
      completed: 0,
      found: 0,
      not_found: 0,
      needs_review: 0,
      failed: 0,
      current_book: undefined,
    })

    for (let i = 0; i < bookIds.length; i++) {
      const bookId = bookIds[i]
      const book = books.find(b => b.id === bookId)

      setBatchProgress(prev => prev ? {
        ...prev,
        current_book: book?.title || 'Unknown',
      } : null)

      try {
        const response = await fetch(`/api/books/${bookId}/investigate-translation`, {
          method: 'POST',
          credentials: 'include',
        })

        const data = await response.json()

        if (response.ok) {
          setBatchProgress(prev => {
            if (!prev) return null
            const newProgress = {
              ...prev,
              completed: prev.completed + 1,
            }

            if (data.translation_found) {
              if (data.confidence_score >= 70) {
                newProgress.found++
              } else {
                newProgress.needs_review++
              }
            } else {
              newProgress.not_found++
            }

            return newProgress
          })
        } else {
          setBatchProgress(prev => prev ? {
            ...prev,
            completed: prev.completed + 1,
            failed: prev.failed + 1,
          } : null)
        }
      } catch (err) {
        setBatchProgress(prev => prev ? {
          ...prev,
          completed: prev.completed + 1,
          failed: prev.failed + 1,
        } : null)
      }

      // Small delay to avoid rate limiting
      if (i < bookIds.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500))
      }
    }

    // Refresh books list
    await fetchBooks()
    setSelectedBooks(new Set())
    setBatchInvestigating(false)
  }

  const closeBatchProgress = () => {
    setBatchProgress(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-card rounded-none shadow-sm border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className={clsx(TYPOGRAPHY.h2, 'text-foreground mb-2')}>Books Database</h1>
            <p className={clsx(TYPOGRAPHY.bodyBase, 'text-muted-foreground')}>
              Manage and track books in the editorial workflow.
            </p>
          </div>
          <Link href="/dashboard/books/search">
            <Button variant="primary">Add New Book</Button>
          </Link>
        </div>

        {/* Batch Actions */}
        {books.length > 0 && !loading && (
          <div className="flex items-center gap-4 pt-4 border-t border-border">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedBooks.size === books.length && books.length > 0}
                onChange={toggleSelectAll}
                className="h-4 w-4 text-primary focus:ring-primary border-border rounded-none"
              />
              <span className={clsx(TYPOGRAPHY.bodySmall, 'font-medium text-foreground')}>
                Select All ({books.length})
              </span>
            </label>

            {selectedBooks.size > 0 && (
              <>
                <div className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground')}>
                  {selectedBooks.size} selected
                </div>
                <Button
                  onClick={handleBatchInvestigation}
                  disabled={batchInvestigating}
                  variant="outlined"
                  leadingIcon={Search}
                  size="sm"
                >
                  {batchInvestigating ? 'Investigating...' : 'Check Selected for Translations'}
                </Button>
                <button
                  onClick={() => setSelectedBooks(new Set())}
                  className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground hover:text-foreground')}
                >
                  Clear Selection
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="bg-card rounded-none shadow-sm border border-border p-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className={clsx(TYPOGRAPHY.bodySmall, 'font-medium text-foreground')}>
              Filter by status:
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setStatusFilter('all')}
              className={clsx(
                TYPOGRAPHY.bodySmall,
                'px-3 py-1.5 font-medium rounded-none transition-colors',
                statusFilter === 'all'
                  ? 'bg-primary text-white'
                  : 'bg-muted text-foreground hover:bg-primary/10'
              )}
            >
              All
            </button>
            {Object.entries(statusLabels).map(([status, label]) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status as BookStatus)}
                className={clsx(
                  TYPOGRAPHY.bodySmall,
                  'px-3 py-1.5 font-medium rounded-none transition-colors',
                  statusFilter === status
                    ? 'bg-primary text-white'
                    : 'bg-muted text-foreground hover:bg-primary/10'
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-card rounded-none shadow-sm border border-border p-12 text-center">
          <Loader2 className="h-12 w-12 text-primary mx-auto mb-4 animate-spin" />
          <p className={clsx(TYPOGRAPHY.bodyBase, 'text-muted-foreground')}>Loading books...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-none p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
          <div>
            <h3 className={clsx(TYPOGRAPHY.h5, 'font-medium text-destructive')}>
              Error Loading Books
            </h3>
            <p className={clsx(TYPOGRAPHY.bodySmall, 'text-destructive/80 mt-1')}>{error}</p>
            <Button onClick={fetchBooks} variant="outlined" size="sm" className="mt-2">
              Try Again
            </Button>
          </div>
        </div>
      )}

      {/* Books List */}
      {!loading && !error && (
        <>
          {books.length > 0 ? (
            <div className="space-y-3">
              {books.map((book) => (
                <div
                  key={book.id}
                  className="bg-card rounded-none border border-border hover:border-primary hover:shadow-md transition-all p-4"
                >
                  <div className="flex items-start gap-4">
                    {/* Checkbox */}
                    <div className="pt-1">
                      <input
                        type="checkbox"
                        checked={selectedBooks.has(book.id)}
                        onChange={() => toggleBookSelection(book.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="h-4 w-4 text-primary focus:ring-primary border-border rounded-none cursor-pointer"
                      />
                    </div>

                    {/* Book Content - clickable link */}
                    <Link
                      href={`/dashboard/books/${book.id}`}
                      className="flex-1 min-w-0 flex items-start justify-between gap-4"
                    >
                      <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-3 mb-2">
                        <h3
                          className={clsx(
                            TYPOGRAPHY.h5,
                            'font-semibold text-foreground line-clamp-1'
                          )}
                        >
                          {book.title}
                        </h3>
                        <span
                          className={clsx(
                            TYPOGRAPHY.caption,
                            'shrink-0 inline-flex items-center px-2 py-0.5 rounded-none font-medium',
                            statusColors[book.status]
                          )}
                        >
                          {statusLabels[book.status]}
                        </span>
                      </div>

                      {book.subtitle && (
                        <p
                          className={clsx(
                            TYPOGRAPHY.bodySmall,
                            'text-muted-foreground mb-2 line-clamp-1'
                          )}
                        >
                          {book.subtitle}
                        </p>
                      )}

                      <div
                        className={clsx(
                          TYPOGRAPHY.bodySmall,
                          'flex items-center gap-4 text-muted-foreground'
                        )}
                      >
                        <span>{formatAuthors(book.authors)}</span>
                        {book.published_date && (
                          <>
                            <span>•</span>
                            <span>{book.published_date}</span>
                          </>
                        )}
                        {book.language && (
                          <>
                            <span>•</span>
                            <span className="uppercase">{book.language}</span>
                          </>
                        )}
                      </div>

                      {book.translated_title && (
                        <p className={clsx(TYPOGRAPHY.bodySmall, 'text-primary mt-2 font-medium')}>
                          📖 {book.translated_title}
                        </p>
                      )}

                      <div
                        className={clsx(
                          TYPOGRAPHY.caption,
                          'flex items-center gap-4 mt-2 text-muted-foreground'
                        )}
                      >
                        <span>Added {new Date(book.added_at).toLocaleDateString()}</span>
                        {book.selected_for_translation && (
                          <>
                            <span>•</span>
                            <span className="text-primary font-medium">
                              ⭐ Selected for Translation
                            </span>
                          </>
                        )}
                        {book.translation_priority && (
                          <>
                            <span>•</span>
                            <span>Priority: {book.translation_priority}</span>
                          </>
                        )}
                      </div>
                      </div>

                      <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-card rounded-none shadow-sm border border-border p-12 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className={clsx(TYPOGRAPHY.h4, 'text-foreground mb-2')}>No books found</h3>
              <p className={clsx(TYPOGRAPHY.bodyBase, 'text-muted-foreground mb-4')}>
                {statusFilter === 'all'
                  ? 'Start by searching and adding books from Google Books'
                  : `No books with status "${statusLabels[statusFilter as BookStatus]}"`}
              </p>
              <Link href="/dashboard/books/search">
                <Button variant="primary">Search Books</Button>
              </Link>
            </div>
          )}
        </>
      )}

      {/* Batch Progress Modal */}
      {batchProgress && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-none shadow-xl border border-border max-w-2xl w-full p-6">
            <h2 className={clsx(TYPOGRAPHY.h3, 'text-foreground mb-4')}>
              Batch Translation Investigation
            </h2>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground')}>
                  Progress: {batchProgress.completed} / {batchProgress.total}
                </span>
                <span className={clsx(TYPOGRAPHY.bodySmall, 'font-medium text-foreground')}>
                  {Math.round((batchProgress.completed / batchProgress.total) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-primary h-3 rounded-full transition-all duration-300"
                  style={{ width: `${(batchProgress.completed / batchProgress.total) * 100}%` }}
                />
              </div>
            </div>

            {/* Current Book */}
            {batchProgress.current_book && batchProgress.completed < batchProgress.total && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-none">
                <div className="flex items-center gap-2 mb-2">
                  <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
                  <span className={clsx(TYPOGRAPHY.bodySmall, 'font-medium text-blue-900')}>
                    Currently checking...
                  </span>
                </div>
                <p className={clsx(TYPOGRAPHY.bodyBase, 'text-blue-800 line-clamp-1')}>
                  {batchProgress.current_book}
                </p>
              </div>
            )}

            {/* Results Summary */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-green-50 border border-green-200 rounded-none p-4">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span className={clsx(TYPOGRAPHY.bodySmall, 'font-medium text-green-900')}>
                    Found
                  </span>
                </div>
                <p className={clsx(TYPOGRAPHY.h3, 'text-green-900 font-bold')}>
                  {batchProgress.found}
                </p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-none p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="h-5 w-5 text-yellow-600" />
                  <span className={clsx(TYPOGRAPHY.bodySmall, 'font-medium text-yellow-900')}>
                    Needs Review
                  </span>
                </div>
                <p className={clsx(TYPOGRAPHY.h3, 'text-yellow-900 font-bold')}>
                  {batchProgress.needs_review}
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-none p-4">
                <div className="flex items-center gap-2 mb-1">
                  <XCircle className="h-5 w-5 text-gray-600" />
                  <span className={clsx(TYPOGRAPHY.bodySmall, 'font-medium text-gray-900')}>
                    Not Found
                  </span>
                </div>
                <p className={clsx(TYPOGRAPHY.h3, 'text-gray-900 font-bold')}>
                  {batchProgress.not_found}
                </p>
              </div>

              {batchProgress.failed > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-none p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <span className={clsx(TYPOGRAPHY.bodySmall, 'font-medium text-red-900')}>
                      Errors
                    </span>
                  </div>
                  <p className={clsx(TYPOGRAPHY.h3, 'text-red-900 font-bold')}>
                    {batchProgress.failed}
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3">
              {batchProgress.completed === batchProgress.total ? (
                <Button onClick={closeBatchProgress} variant="primary">
                  Done
                </Button>
              ) : (
                <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground italic')}>
                  Please wait while we check all selected books...
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
