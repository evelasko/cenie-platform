'use client'

import { clsx } from 'clsx'
import Image from 'next/image'
import Link from 'next/link'
import { TYPOGRAPHY } from '@/lib/typography'
import { useRef } from 'react'

export type bookData = {
  title: string
  author: string
  coverSrc: string
  link: string
}

/**
 * This component is a carousel of books with the title above the carousel displayed as TYPOGRAPHY.h2 in black and a tinted background.
 * The book items are displayed similarily to the animated li elements in the html comment at the bottom of this file.
 * @param books - The books data
 * @returns
 */
export default function BooksCarouselBanner({
  title,
  books,
}: {
  title: string
  books: bookData[]
}) {
  const scrollRef = useRef<HTMLDivElement>(null)

  return (
    <div className="w-full bg-secondary/10 py-16">
      <div className="container mx-auto px-4">
        {/* Title */}
        <h2 className={clsx(TYPOGRAPHY.h2, 'text-black mb-0')}>{title}</h2>

        {/* Carousel — pt-16 compensates for overflow-y clipping caused by overflow-x-auto */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pt-16 pb-4 scrollbar-hide snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {books.map((book, index) => (
            <Link
              key={index}
              href={book.link}
              className="group relative flex aspect-2/3 items-end shrink-0 w-1/2 md:w-1/3 lg:w-1/5 snap-start"
            >
              {/* Cover Image with hover animation */}
              <div className="relative z-10 w-full transition-transform duration-300 ease-in-out group-hover:-translate-y-16">
                <div className="relative aspect-2/3 shadow-lg">
                  <Image
                    src={book.coverSrc}
                    alt={`${book.title} cover`}
                    fill
                    className="object-contain"
                    sizes="400px"
                  />
                </div>
              </div>

              {/* Metadata */}
              <span className="absolute bottom-0 left-0 right-0 pb-2">
                <strong className={clsx(TYPOGRAPHY.bodySmall, 'line-clamp-2 block')}>
                  {book.title}
                </strong>
                <em className={clsx(TYPOGRAPHY.caption, 'mt-1 line-clamp-2 block text-secondary')}>
                  {book.author}
                </em>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

/*
  <li class="splide__slide w-6-cols flex-none py-60 md:!w-3-cols-vw xl:!w-2-cols md:py-100 is-active is-visible" id="splide01-slide01" role="group" aria-roledescription="slide" aria-label="1 of 10" style="margin-right: 102px; width: calc(50% - 51px);">
                                      <a class="group/book effect-focus relative flex aspect-2/3 items-end" href="https://www.hup.harvard.edu/books/9780674986503">
                                          <div class="relative z-99 mt-auto w-full" style="--distance: -60px;">
                                              <div class="transition-transform !duration-300 ease-in-out group-hover/book:translate-y-[var(--distance)]" data-billboardcarousel-cover="" style="--distance: -63px;">
          <div class="items-end aspect-2/3 relative flex">
              <img class="cover-img shadow   h-full max-h-full min-h-[3px] w-full min-w-[2px] object-contain" data-productimages-item="" itemprop="image" alt="Ripples on the Cosmic Ocean" sizes="400px" srcset="https://www.hup.harvard.edu/img/feeds/jackets/9780674986503.png?fm=jpg&amp;q=80&amp;fit=max&amp;w=50 50w, https://www.hup.harvard.edu/img/feeds/jackets/9780674986503.png?fm=jpg&amp;q=80&amp;fit=max&amp;w=100 100w, https://www.hup.harvard.edu/img/feeds/jackets/9780674986503.png?fm=jpg&amp;q=80&amp;fit=max&amp;w=200 200w, https://www.hup.harvard.edu/img/feeds/jackets/9780674986503.png?fm=jpg&amp;q=80&amp;fit=max&amp;w=400 400w, https://www.hup.harvard.edu/img/feeds/jackets/9780674986503.png?fm=jpg&amp;q=80&amp;fit=max&amp;w=600 600w, https://www.hup.harvard.edu/img/feeds/jackets/9780674986503.png?fm=jpg&amp;q=80&amp;fit=max&amp;w=800 800w, https://www.hup.harvard.edu/img/feeds/jackets/9780674986503.png?fm=jpg&amp;q=80&amp;fit=max&amp;w=1200 1200w, https://www.hup.harvard.edu/img/feeds/jackets/9780674986503.png?fm=jpg&amp;q=80&amp;fit=max&amp;w=1600 1600w, https://www.hup.harvard.edu/img/feeds/jackets/9780674986503.png?fm=jpg&amp;q=80&amp;fit=max&amp;w=2000 2000w" src="https://www.hup.harvard.edu/img/feeds/jackets/9780674986503.png?fm=jpg&amp;q=80&amp;fit=max&amp;w=200" data-loaded="true">
                              <span class="cover-img-placeholder z-1 pointer-events-none absolute inset-0 bg-placeholder duration-500 ease-out-sine" aria-hidden="true"></span>
                      </div>
      </div>
                                          </div>
                                          <span class="absolute bottom-0 left-0 right-0" data-billboardcarousel-meta="">
                                              <strong class="f-ui-02 line-clamp-2">Ripples on the Cosmic Ocean</strong> <br class="hidden">
                                              <em class="f-caption mt-4 line-clamp-2 block text-secondary">Dagomar Degroot</em>
                                          </span>
                                      </a>
                                  </li>
  */
