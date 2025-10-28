import { clsx } from 'clsx'
import Image from 'next/image'
import Link from 'next/link'
import { TYPOGRAPHY } from '@/lib/typography'
import ArrowIcon from '../graphics/ArrowIcon'

export interface SingleBookBannerProps {
  title: string
  coverSrc: string
  authors: {
    name: string
    link: string
  }[]
  link: string
}

/**
 * This component is a single column with tinted background containing the following rows:
 * - The title is displayed as TYPOGRAPHY.display1 in black.
 * - The authors are displayed as a list of links to the author's page.
 * - The cover is displayed entirely with its aspect ratio maintained, and its width limited to 60% of the container width.
 * - The link is displayed as a link to the book page labeled with `Descubre el libro` and the arrow icon from the graphics folder.
 */
export default function SingleBookBanner({
  title,
  coverSrc,
  authors,
  link,
}: SingleBookBannerProps) {
  return (
    <div className="flex flex-col items-center gap-8 py-16 bg-primary/10">
      {/* Title */}
      <h1 className={clsx(TYPOGRAPHY.display1, 'text-black text-center px-4')}>{title}</h1>

      {/* Authors */}
      <div className="flex flex-wrap gap-2 justify-center px-4">
        {authors.map((author, index) => (
          <span key={index}>
            <Link
              href={author.link}
              className={clsx(TYPOGRAPHY.h5, 'text-black/80 hover:text-primary transition-colors')}
            >
              {author.name}
            </Link>
            {index < authors.length - 1 && <span className="text-black/80">, </span>}
          </span>
        ))}
      </div>

      {/* Cover Image */}
      <div className="relative w-3/5 max-w-md aspect-2/3">
        <Image src={coverSrc} alt={title} fill className="object-contain" sizes="60vw" />
      </div>

      {/* Link */}
      <Link
        href={link}
        className={clsx(
          TYPOGRAPHY.h3,
          'flex items-center gap-2 text-black/80 hover:text-primary transition-colors'
        )}
      >
        <span>Descubre el libro</span>
        <ArrowIcon size={20} color="currentColor" />
      </Link>
    </div>
  )
}
