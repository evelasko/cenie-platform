import { clsx } from 'clsx'
import Image from 'next/image'
import Link from 'next/link'
import { TYPOGRAPHY } from '@/lib/typography'

interface VolumeHeroProps {
  title: string
  subtitle?: string
  authors: string // authors_display from DB
  translator?: string // translator_display from DB
  coverUrl: string
  publicationYear?: number
  isbn?: string
  pageCount?: number
  publisher?: string
  accessLink?: string // Link to membership/access page
}

export function VolumeHero({
  title,
  subtitle,
  authors,
  translator,
  coverUrl,
  publicationYear,
  isbn,
  pageCount,
  publisher = 'CENIE Editorial',
  accessLink,
}: VolumeHeroProps) {
  return (
    <header className="container grid grid-cols-12 gap-y-12 md:gap-y-16 pt-4 md:pt-12">
      {/* Cover Image Column */}
      <div className="col-span-12 md:col-span-10 md:col-start-2 lg:col-span-6 lg:col-start-1">
        <div className="relative flex aspect-343/468 items-center justify-center bg-muted md:aspect-square lg:aspect-460/620 xl:aspect-638/680">
          {/* Book Cover */}
          <div className="w-11/25">
            <div className="relative aspect-2/3 flex items-center">
              <Image
                src={coverUrl}
                alt={title}
                fill
                className="object-contain"
                sizes="30vw"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      {/* Book Details Column */}
      <div className="col-span-12 md:col-span-10 md:col-start-2 lg:col-span-6 lg:col-start-7 lg:flex lg:items-center lg:justify-center lg:py-11">
        <div className="w-full lg:ml-6 lg:max-w-[360px]">
          {/* Title */}
          <h1 className={clsx(TYPOGRAPHY.display1, 'mb-3 text-black')}>{title}</h1>

          {/* Subtitle */}
          {subtitle && (
            <p className={clsx(TYPOGRAPHY.h4, 'mb-3 text-black/70')}>{subtitle}</p>
          )}

          {/* Authors */}
          <p className={clsx(TYPOGRAPHY.h3, 'text-black/60 mb-1')}>{authors}</p>

          {/* Translator (if translated work) */}
          {translator && (
            <p className={clsx(TYPOGRAPHY.h5, 'text-black/60 mb-1 italic')}>{translator}</p>
          )}

          {/* Publisher */}
          <p className={clsx(TYPOGRAPHY.h5, 'text-black/60')}>{publisher}</p>

          {/* Access CTA */}
          {accessLink && (
            <div className="mt-8">
              <Link
                href={accessLink}
                className={clsx(
                  TYPOGRAPHY.bodyBase,
                  'flex items-center justify-center w-full px-4 py-3 bg-primary text-white hover:bg-primary/90 transition-colors'
                )}
              >
                Acceder
              </Link>
            </div>
          )}

          {/* Metadata */}
          <div className="mt-10 space-y-1">
            {isbn && (
              <p className={clsx(TYPOGRAPHY.h5, 'text-black/60')}>ISBN {isbn}</p>
            )}
            {publicationYear && (
              <p className={clsx(TYPOGRAPHY.h5, 'text-black/60')}>
                Publicación: {publicationYear}
              </p>
            )}
            {pageCount && (
              <p className={clsx(TYPOGRAPHY.h5, 'text-black/60')}>
                {pageCount} páginas
              </p>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

