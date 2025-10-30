'use client'

import { useState } from 'react'
import { Search, Loader2, AlertCircle, BookOpen } from 'lucide-react'
import Button from '@/components/ui/Button'
import { BookCard } from '@/components/dashboard/BookCard'
import { clsx } from 'clsx'
import { TYPOGRAPHY } from '@/lib/typography'
import type { GoogleBooksSearchResponse } from '@/types/books'

export default function BookSearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<GoogleBooksSearchResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [addingBooks, setAddingBooks] = useState<Set<string>>(new Set())
  const [addedBooks, setAddedBooks] = useState<Set<string>>(new Set())

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault()

    if (!query.trim()) {
      setError('Please enter a search query')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/books/search?q=${encodeURIComponent(query)}`, {
        credentials: 'include',
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to search books')
      }

      setResults(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search books')
      setResults(null)
    } finally {
      setLoading(false)
    }
  }

  const handleAddBook = async (volumeId: string) => {
    setAddingBooks((prev) => new Set(prev).add(volumeId))

    try {
      const response = await fetch('/api/books', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ googleBooksId: volumeId }),
      })

      const data = await response.json()

      if (response.status === 409) {
        // Book already exists
        setAddedBooks((prev) => new Set(prev).add(volumeId))
        return
      }

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add book')
      }

      setAddedBooks((prev) => new Set(prev).add(volumeId))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to add book')
    } finally {
      setAddingBooks((prev) => {
        const next = new Set(prev)
        next.delete(volumeId)
        return next
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-card rounded-none shadow-sm border border-border p-6">
        <h1 className={clsx(TYPOGRAPHY.h2, 'text-foreground mb-2')}>Search Books</h1>
        <p className={clsx(TYPOGRAPHY.bodyBase, 'text-muted-foreground')}>
          Search Google Books to find performing arts titles for potential translation.
        </p>
      </div>

      {/* Search Form */}
      <div className="bg-card rounded-none shadow-sm border border-border p-6">
        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label
              htmlFor="search"
              className={clsx(TYPOGRAPHY.bodySmall, 'block font-medium text-foreground mb-2')}
            >
              Search Query
            </label>
            <div className="flex gap-3">
              <input
                id="search"
                type="text"
                value={query}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
                placeholder="Enter title, author, ISBN, or keywords..."
                className={clsx(
                  TYPOGRAPHY.bodyBase,
                  'flex-1 px-3 py-2 border border-border rounded-none focus:outline-none focus:ring-2 focus:ring-primary'
                )}
                disabled={loading}
              />
              <Button
                type="submit"
                disabled={loading}
                variant="primary"
                leadingIcon={loading ? Loader2 : Search}
              >
                {loading ? 'Searching...' : 'Search'}
              </Button>
            </div>
          </div>

          <div className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground')}>
            <p className="font-medium mb-1">Search Tips:</p>
            <ul className={clsx(TYPOGRAPHY.caption, 'list-disc list-inside space-y-0.5')}>
              <li>Use quotes for exact phrases: "performance theory"</li>
              <li>Search by author: inauthor:stanislavski</li>
              <li>Search by subject: subject:theater</li>
              <li>Search by ISBN: isbn:9780123456789</li>
            </ul>
          </div>
        </form>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-none p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
          <div>
            <h3 className={clsx(TYPOGRAPHY.h5, 'font-medium text-destructive')}>Search Error</h3>
            <p className={clsx(TYPOGRAPHY.bodySmall, 'text-destructive/80 mt-1')}>{error}</p>
          </div>
        </div>
      )}

      {/* Results */}
      {results && (
        <div className="space-y-4">
          <div className="bg-card rounded-none shadow-sm border border-border p-4">
            <div className="flex items-center justify-between">
              <h2 className={clsx(TYPOGRAPHY.h4, 'text-foreground')}>
                Search Results
                <span
                  className={clsx(TYPOGRAPHY.bodySmall, 'ml-2 font-normal text-muted-foreground')}
                >
                  ({results.totalItems.toLocaleString()} found)
                </span>
              </h2>
            </div>
          </div>

          {results.items && results.items.length > 0 ? (
            <div className="space-y-3">
              {results.items.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onAddBook={handleAddBook}
                  isAdding={addingBooks.has(book.id)}
                  isAdded={addedBooks.has(book.id)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-card rounded-none shadow-sm border border-border p-12 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className={clsx(TYPOGRAPHY.h4, 'text-foreground mb-2')}>No books found</h3>
              <p className={clsx(TYPOGRAPHY.bodyBase, 'text-muted-foreground')}>
                Try adjusting your search query
              </p>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!results && !loading && !error && (
        <div className="bg-card rounded-none shadow-sm border border-border p-12 text-center">
          <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className={clsx(TYPOGRAPHY.h4, 'text-foreground mb-2')}>Ready to search</h3>
          <p className={clsx(TYPOGRAPHY.bodyBase, 'text-muted-foreground')}>
            Enter a query above to find books
          </p>
        </div>
      )}
    </div>
  )
}
