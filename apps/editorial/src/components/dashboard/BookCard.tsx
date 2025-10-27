import Image from 'next/image'
import { Book, Calendar, User, ExternalLink } from 'lucide-react'
import type { GoogleBookVolume } from '@/types/books'

interface BookCardProps {
  book: GoogleBookVolume
  onAddBook?: (volumeId: string) => void
  isAdding?: boolean
  isAdded?: boolean
}

export function BookCard({ book, onAddBook, isAdding, isAdded }: BookCardProps) {
  const { volumeInfo } = book
  const coverUrl = volumeInfo.imageLinks?.thumbnail?.replace('http://', 'https://') || null

  const formatAuthors = (authors?: string[]) => {
    if (!authors || authors.length === 0) return 'Unknown Author'
    if (authors.length === 1) return authors[0]
    if (authors.length === 2) return authors.join(' and ')
    return `${authors[0]} et al.`
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:border-orange-200 hover:shadow-md transition-all p-4">
      <div className="flex gap-4">
        {/* Book Cover */}
        <div className="shrink-0">
          {coverUrl ? (
            <Image
              src={coverUrl}
              alt={volumeInfo.title}
              width={80}
              height={120}
              className="rounded shadow-sm"
              unoptimized
            />
          ) : (
            <div className="w-20 h-30 bg-gray-100 rounded flex items-center justify-center">
              <Book className="h-8 w-8 text-gray-400" />
            </div>
          )}
        </div>

        {/* Book Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{volumeInfo.title}</h3>
          {volumeInfo.subtitle && (
            <p className="text-sm text-gray-600 mb-2 line-clamp-1">{volumeInfo.subtitle}</p>
          )}

          <div className="space-y-1 mb-3">
            <div className="flex items-center text-sm text-gray-600">
              <User className="h-3 w-3 mr-1 shrink-0" />
              <span className="line-clamp-1">{formatAuthors(volumeInfo.authors)}</span>
            </div>
            {volumeInfo.publishedDate && (
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-3 w-3 mr-1 shrink-0" />
                <span>{volumeInfo.publishedDate}</span>
              </div>
            )}
          </div>

          {volumeInfo.description && (
            <p className="text-sm text-gray-600 line-clamp-2 mb-3">{volumeInfo.description}</p>
          )}

          <div className="flex items-center gap-2">
            {volumeInfo.categories && volumeInfo.categories.length > 0 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                {volumeInfo.categories[0]}
              </span>
            )}
            {volumeInfo.averageRating && (
              <span className="text-xs text-gray-500">
                ⭐ {volumeInfo.averageRating.toFixed(1)}
              </span>
            )}
            {volumeInfo.pageCount && (
              <span className="text-xs text-gray-500">{volumeInfo.pageCount} pages</span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="shrink-0 flex flex-col items-end justify-between">
          {volumeInfo.previewLink && (
            <a
              href={volumeInfo.previewLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-600 hover:text-orange-700 p-1"
              title="View on Google Books"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}

          {onAddBook && (
            <button
              onClick={() => onAddBook(book.id)}
              disabled={isAdding || isAdded}
              className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                isAdded
                  ? 'bg-green-100 text-green-700 cursor-not-allowed'
                  : isAdding
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-orange-600 text-white hover:bg-orange-700'
              }`}
            >
              {isAdded ? 'Added' : isAdding ? 'Adding...' : 'Add Book'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
