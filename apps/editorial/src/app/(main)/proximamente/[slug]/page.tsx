'use client'

import { useEffect, useState } from 'react'
import { use } from 'react'
import { notFound } from 'next/navigation'
import Head from 'next/head'
import { PageContainer, Section, Prose } from '@/components/content'
import BooksGrid from '@/components/sections/BooksGrid'
import { VolumeHero } from '@/components/catalog/VolumeHero'
import { TableOfContentsDisplay } from '@/components/catalog/TableOfContentsDisplay'
import { TranslationInfo } from '@/components/catalog/TranslationInfo'
import BookPraiseItem from '@/components/items/BookPraiseItem'
import BookForeword from '@/components/sections/BookForeword'
import { Loader2 } from 'lucide-react'
import { clsx } from 'clsx'
import { TYPOGRAPHY } from '@/lib/typography'
import type { CatalogVolume } from '@/types/books'
import type { bookData } from '@/components/sections/BooksGrid'

interface VolumeContributor {
  contributor_id: string
  full_name: string
  role: string
  bio_es?: string
  photo_url?: string
}

export default function ProximamenteVolumePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const resolvedParams = use(params)
  const slug = resolvedParams.slug

  const [volume, setVolume] = useState<CatalogVolume | null>(null)
  const [contributors, setContributors] = useState<VolumeContributor[]>([])
  const [related, setRelated] = useState<CatalogVolume[]>([])
  const [loading, setLoading] = useState(true)
  const [notFoundError, setNotFoundError] = useState(false)

  useEffect(() => {
    fetchVolume()
  }, [slug])

  const fetchVolume = async () => {
    setLoading(true)

    try {
      const response = await fetch(`/api/public/proximamente/${slug}`)
      const data = await response.json()

      if (!response.ok) {
        if (response.status === 404) {
          setNotFoundError(true)
        }
        return
      }

      setVolume(data.volume)
      setContributors(data.contributors || [])
      setRelated(data.related || [])
    } catch (error) {
      console.error('Failed to fetch volume:', error)
      setNotFoundError(true)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center py-24">
          <Loader2 className="h-12 w-12 text-primary mb-4 animate-spin" />
          <p className={clsx(TYPOGRAPHY.bodyBase, 'text-black/60')}>Cargando...</p>
        </div>
      </PageContainer>
    )
  }

  if (notFoundError || !volume) {
    notFound()
  }

  const authors = contributors.filter((c) => c.role === 'author')
  const translators = contributors.filter((c) => c.role === 'translator')

  const relatedBooks: bookData[] = related.map((v) => ({
    title: v.title,
    author: v.authors_display || 'CENIE Editorial',
    coverSrc: v.cover_url || v.cover_fallback_url || '/images/placeholder-cover.jpg',
    link: `/proximamente/${v.slug}`,
  }))

  const pageTitle = `${volume.title} | Próximamente | CENIE Editorial`
  const pageDescription =
    volume.seo_description || volume.description?.substring(0, 160) || `Próximamente: ${volume.title}`
  const coverImage = volume.cover_url || volume.cover_fallback_url

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        {coverImage && <meta property="og:image" content={coverImage} />}
        <meta property="og:type" content="book" />
        {volume.isbn_13 && <meta property="book:isbn" content={volume.isbn_13} />}
        {volume.publication_year && (
          <meta property="book:release_date" content={volume.publication_year.toString()} />
        )}
        {volume.authors_display && <meta property="book:author" content={volume.authors_display} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        {coverImage && <meta name="twitter:image" content={coverImage} />}
        {volume.seo_keywords && volume.seo_keywords.length > 0 && (
          <meta name="keywords" content={volume.seo_keywords.join(', ')} />
        )}
      </Head>

      {/* Hero - no access link for upcoming books */}
      <VolumeHero
        title={volume.title}
        subtitle={volume.subtitle || undefined}
        authors={volume.authors_display || 'CENIE Editorial'}
        translator={volume.translator_display || undefined}
        coverUrl={volume.cover_url || volume.cover_fallback_url || '/images/placeholder-cover.jpg'}
        publicationYear={volume.publication_year || undefined}
        isbn={volume.isbn_13 || volume.isbn_10 || undefined}
        pageCount={volume.page_count || undefined}
        publisher={volume.publisher_name}
      />

      {/* Próximamente badge */}
      <PageContainer>
        <Section spacing="normal">
          <div
            className={clsx(
              TYPOGRAPHY.h4,
              'inline-block px-4 py-2 bg-primary/10 text-primary rounded-full'
            )}
          >
            Próximamente disponible
          </div>
        </Section>
      </PageContainer>

      <PageContainer>
        {/* Description */}
        {volume.description && (
          <Section spacing="large">
            <Prose>
              <div dangerouslySetInnerHTML={{ __html: volume.description }} />
            </Prose>
          </Section>
        )}

        {/* Table of Contents */}
        {volume.table_of_contents && (
          <Section spacing="large">
            <TableOfContentsDisplay toc={volume.table_of_contents} />
          </Section>
        )}

        {/* Excerpt */}
        {volume.excerpt && (
          <Section spacing="large">
            <BookForeword quote="Fragmento" foreword={volume.excerpt} />
          </Section>
        )}

        {/* Translation Info */}
        {volume.volume_type === 'translated' && volume.original_title && (
          <Section spacing="large">
            <TranslationInfo
              originalTitle={volume.original_title}
              originalLanguage={volume.original_language || undefined}
              originalPublisher={volume.original_publisher || undefined}
              originalPublicationYear={volume.original_publication_year || undefined}
              translationYear={volume.translation_year || undefined}
              translator={volume.translator_display || undefined}
            />
          </Section>
        )}

        {/* Reviews/Praise */}
        {volume.reviews_quotes && volume.reviews_quotes.length > 0 && (
          <Section spacing="large">
            <h2 className={clsx(TYPOGRAPHY.h3, 'text-black mb-6')}>Elogios y Reseñas</h2>
            <div className="space-y-4">
              {volume.reviews_quotes.map((quote, index) => (
                <BookPraiseItem key={index} text={quote.text} author={quote.source} />
              ))}
            </div>
          </Section>
        )}

        {/* Contributors Bios */}
        {authors.length > 0 && authors.some((a) => a.bio_es) && (
          <Section spacing="large">
            <h2 className={clsx(TYPOGRAPHY.h3, 'text-black mb-6')}>Sobre los Autores</h2>
            <div className="space-y-6">
              {authors.filter((a) => a.bio_es).map((author) => (
                <div key={author.contributor_id}>
                  <h3 className={clsx(TYPOGRAPHY.h4, 'text-black mb-2')}>{author.full_name}</h3>
                  <p className={clsx(TYPOGRAPHY.bodyBase, 'text-black/80')}>{author.bio_es}</p>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Translator Bios */}
        {translators.length > 0 && translators.some((t) => t.bio_es) && (
          <Section spacing="large">
            <h2 className={clsx(TYPOGRAPHY.h3, 'text-black mb-6')}>Sobre los Traductores</h2>
            <div className="space-y-6">
              {translators.filter((t) => t.bio_es).map((translator) => (
                <div key={translator.contributor_id}>
                  <h3 className={clsx(TYPOGRAPHY.h4, 'text-black mb-2')}>{translator.full_name}</h3>
                  <p className={clsx(TYPOGRAPHY.bodyBase, 'text-black/80')}>{translator.bio_es}</p>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Related Upcoming Volumes */}
        {relatedBooks.length > 0 && (
          <Section spacing="large">
            <BooksGrid
              title="Otras Próximas Publicaciones"
              books={relatedBooks}
              overflow={true}
            />
          </Section>
        )}
      </PageContainer>
    </>
  )
}
