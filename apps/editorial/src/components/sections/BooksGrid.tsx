import { clsx } from 'clsx'
import { TYPOGRAPHY } from '@/lib/typography'
import BookCardItem from '../items/BookCardItem'
import Link from 'next/link'

export type bookData = {
  title: string
  author: string
  coverSrc: string
  link: string
}

/**
 * This component is a grid of books with the title above the carousel displayed as TYPOGRAPHY.h2 in black.
 * The book items are displayed as BookCardItem components, and the gird is displayed as a grid
 * of 5 columns on desktop and 4 columns on tablet, and 2 columns on mobile.
 * If the overflow prop is true, the grid accomodates the books that don't fit in the grid in subsequent rows,
 * otherwise it hides the books that don't fit in the grid.
 * @param books - The books data
 * @returns
 */
export default function BooksGrid({
  title,
  books,
  overflow,
}: {
  title: string
  books: bookData[]
  overflow: boolean
}) {
  return (
    <div className="flex flex-col gap-8">
      {/* Title */}
      <h2 className={clsx(TYPOGRAPHY.h2, 'text-black')}>{title}</h2>

      {/* Books Grid */}
      <div
        className={clsx(
          'grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6',
          !overflow && 'overflow-hidden'
        )}
      >
        {books.map((book, index) => (
          <Link key={index} href={book.link} className="block hover:opacity-80 transition-opacity">
            <BookCardItem
              title={book.title}
              subtitle={book.author}
              imageSrc={book.coverSrc}
              imageAlt={`${book.title} cover`}
            />
          </Link>
        ))}
      </div>
    </div>
  )
}
