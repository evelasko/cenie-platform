import { clsx } from 'clsx'
import Image from 'next/image'
import { TYPOGRAPHY } from '@/lib/typography'
import { getCoverPlaceholder } from '@/lib/cover-placeholder'
import LinkButton from '../ui/LinkButton'

interface HeroFeaturedBookProps {
  title: string
  authors: string
  coverUrl: string | null
  catalogLink: string
}

/**
 * Full-screen hero section featuring a single book from the catalog.
 * Designed for the editorial homepage to highlight the current featured publication.
 *
 * Background: rgb(230, 237, 240) — a calm blue-grey that frames the cover.
 */
export function HeroFeaturedBook({ title, authors, coverUrl, catalogLink }: HeroFeaturedBookProps) {
  const src = coverUrl || getCoverPlaceholder()

  return (
    <section
      className="flex h-screen flex-col items-center gap-6 overflow-hidden py-12 text-center"
      style={{ backgroundColor: 'var(--color-muted-background-light)' }}
    >
      <div className="site-container flex flex-col items-center gap-6 flex-1 min-h-0">
        {/* Title */}
        <h1 className={clsx(TYPOGRAPHY.display1, 'shrink-0 max-w-2xl text-black mt-4')}>{title}</h1>

        {/* Author(s) */}
        <p className={clsx(TYPOGRAPHY.bodyLarge, 'shrink-0 text-black/70 mb-8')}>{authors}</p>

        {/* Book Cover — grows to fill remaining vertical space, width derived from height via 2:3 ratio */}
        <div className="flex min-h-0 flex-1 items-center justify-center">
          <div className="relative h-full aspect-2/3">
            <Image
              src={src}
              alt={title}
              fill
              className="object-contain shadow-large"
              sizes="(max-width: 768px) 50vw, 33vw"
              priority
            />
          </div>
        </div>

        {/* CTA */}
        <div className="my-8">
          <LinkButton href={catalogLink} label="descubre el libro" />
        </div>
      </div>
    </section>
  )
}
