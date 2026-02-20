'use client'

import Link from 'next/link'
import { Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import BookCardItem from '@/components/items/BookCardItem'
import type { bookData } from '@/components/banners/BooksCarouselBanner'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

interface BooksSwiperCarouselProps {
  books: bookData[]
}

export default function BooksSwiperCarousel({ books }: BooksSwiperCarouselProps) {
  return (
    <Swiper
      modules={[Navigation, Pagination]}
      navigation
      pagination={{ clickable: true }}
      spaceBetween={64}
      slidesPerView={2}
      breakpoints={{
        640: { slidesPerView: 3 },
        1024: { slidesPerView: 4 },
        1280: { slidesPerView: 5 },
      }}
      className="books-swiper"
    >
      {books.map((book, index) => (
        <SwiperSlide key={index}>
          <Link href={book.link} className="block pt-16 pb-20">
            <BookCardItem
              title={book.title}
              subtitle={book.author}
              imageSrc={book.coverSrc}
              imageAlt={`${book.title} cover`}
            />
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  )
}
