'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Loader2, AlertCircle, BookOpen, Filter, ChevronRight } from 'lucide-react'
import Button from '@/components/ui/Button'
import { clsx } from 'clsx'
import { TYPOGRAPHY } from '@/lib/typography'
import type { Book, BookStatus } from '@/types/books'

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

      const response = await fetch(`/api/books?${params}`)
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-card rounded-none shadow-sm border border-border p-6">
        <div className="flex items-center justify-between">
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
                <Link
                  key={book.id}
                  href={`/dashboard/books/${book.id}`}
                  className="block bg-card rounded-none border border-border hover:border-primary hover:shadow-md transition-all p-4"
                >
                  <div className="flex items-start justify-between gap-4">
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
                  </div>
                </Link>
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
    </div>
  )
}
