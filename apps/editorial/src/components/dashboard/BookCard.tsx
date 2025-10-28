import Image from 'next/image'
import { Book, Calendar, User, ExternalLink, Building2 } from 'lucide-react'
import { clsx } from 'clsx'
import { TYPOGRAPHY } from '@/lib/typography'
import Button from '@/components/ui/Button'
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
    <div className="bg-card rounded-none border border-border hover:border-primary hover:shadow-md transition-all p-4">
      <div className="flex gap-4">
        {/* Book Cover */}
        <div className="shrink-0">
          {coverUrl ? (
            <Image
              src={coverUrl}
              alt={volumeInfo.title}
              width={80}
              height={120}
              className="rounded-none shadow-sm"
              unoptimized
            />
          ) : (
            <div className="w-20 h-30 bg-muted rounded-none flex items-center justify-center">
              <Book className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
        </div>

        {/* Book Info */}
        <div className="flex-1 min-w-0">
          <h3 className={clsx(TYPOGRAPHY.h4, 'font-semibold text-foreground mb-1 line-clamp-2')}>
            {volumeInfo.title}
          </h3>
          {volumeInfo.subtitle && (
            <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground mb-2 line-clamp-1')}>
              {volumeInfo.subtitle}
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 my-6">
            <div className={clsx(TYPOGRAPHY.bodySmall, 'flex items-center')}>
              <User className="h-3 w-3 mr-1 shrink-0" />
              <span className="line-clamp-1">{formatAuthors(volumeInfo.authors)}</span>
            </div>
            {volumeInfo.publishedDate && (
              <div className={clsx(TYPOGRAPHY.bodySmall, 'flex items-center')}>
                <Calendar className="h-3 w-3 mr-1 shrink-0" />
                <span>{volumeInfo.publishedDate}</span>
              </div>
            )}
            {volumeInfo.publisher && (
              <div className={clsx(TYPOGRAPHY.bodySmall, 'flex items-center')}>
                <Building2 className="h-3 w-3 mr-1 shrink-0" />
                <span>{volumeInfo.publisher}</span>
              </div>
            )}
          </div>

          {volumeInfo.description && (
            <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground line-clamp-2 mb-3')}>
              {volumeInfo.description}
            </p>
          )}

          <div className="flex items-center gap-2">
            {volumeInfo.categories && volumeInfo.categories.length > 0 && (
              <span
                className={clsx(
                  TYPOGRAPHY.caption,
                  'inline-flex items-center px-2 py-0.5 rounded-none font-medium bg-secondary/10 text-secondary'
                )}
              >
                {volumeInfo.categories[0]}
              </span>
            )}
            {volumeInfo.averageRating && (
              <span className={clsx(TYPOGRAPHY.caption, 'text-muted-foreground')}>
                ⭐ {volumeInfo.averageRating.toFixed(1)}
              </span>
            )}
            {volumeInfo.pageCount && (
              <span className={clsx(TYPOGRAPHY.caption, 'text-muted-foreground')}>
                {volumeInfo.pageCount} pages
              </span>
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
              className="text-primary hover:text-primary/80 p-1 transition-colors"
              title="View on Google Books"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}

          {onAddBook && (
            <Button
              onClick={() => onAddBook(book.id)}
              disabled={isAdding || isAdded}
              variant={isAdded ? 'tertiary' : 'primary'}
              size="sm"
              backgroundColor={isAdded ? '#10b981' : undefined}
              textColor={isAdded ? 'white' : undefined}
            >
              {isAdded ? 'Added' : isAdding ? 'Adding...' : 'Add Book'}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
