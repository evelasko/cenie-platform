'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Head from 'next/head'
import Link from 'next/link'
import { PageContainer, PageHero, Section } from '@/components/content'
import BooksGrid from '@/components/sections/BooksGrid'
import { Loader2 } from 'lucide-react'
import { clsx } from 'clsx'
import { TYPOGRAPHY } from '@/lib/typography'
import type { CatalogVolume } from '@/types/books'
import type { bookData } from '@/components/sections/BooksGrid'

function ProximamenteContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [volumes, setVolumes] = useState<CatalogVolume[]>([])
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(1)

  const page = parseInt(searchParams.get('page') || '1')

  useEffect(() => {
    fetchVolumes()
  }, [page])

  const fetchVolumes = async () => {
    setLoading(true)

    try {
      const params = new URLSearchParams()
      params.set('page', page.toString())
      params.set('per_page', '20')

      const response = await fetch(`/api/public/proximamente?${params}`)
      const data = await response.json()

      if (response.ok) {
        setVolumes(data.volumes || [])
        setTotalPages(data.pagination?.total_pages || 1)
      }
    } catch (error) {
      console.error('Failed to fetch upcoming volumes:', error)
    } finally {
      setLoading(false)
    }
  }

  const catalogBooks: bookData[] = volumes.map((v) => ({
    title: v.title,
    author: v.authors_display || 'CENIE Editorial',
    coverSrc: v.cover_url || v.cover_fallback_url || '/images/placeholder-cover.jpg',
    link: `/proximamente/${v.slug}`,
  }))

  return (
    <>
      <Head>
        <title>Próximamente | CENIE Editorial</title>
        <meta
          name="description"
          content="Descubre las próximas publicaciones de CENIE Editorial. Traducciones y obras originales en preparación sobre teatro, danza y artes escénicas."
        />
        <meta property="og:title" content="Próximamente | CENIE Editorial" />
        <meta
          property="og:description"
          content="Descubre las próximas publicaciones de CENIE Editorial. Traducciones y obras originales en preparación."
        />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <PageContainer>
        <PageHero
          title="Próximamente"
          subtitle="Publicaciones en preparación. Descubre las traducciones y obras originales que pronto estarán disponibles en nuestro catálogo."
        />

        <Section spacing="large">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-12 w-12 text-primary mb-4 animate-spin" />
              <p className={clsx(TYPOGRAPHY.bodyBase, 'text-black/60')}>
                Cargando publicaciones próximas...
              </p>
            </div>
          ) : catalogBooks.length === 0 ? (
            <div className="text-center py-12">
              <p className={clsx(TYPOGRAPHY.h4, 'text-black mb-2')}>
                No hay publicaciones próximas
              </p>
              <p className={clsx(TYPOGRAPHY.bodyBase, 'text-black/60')}>
                Explora nuestro{' '}
                <Link href="/catalogo" className="underline text-primary hover:no-underline">
                  catálogo publicado
                </Link>{' '}
                mientras tanto.
              </p>
            </div>
          ) : (
            <>
              <BooksGrid
                title={`Próximas Publicaciones (${volumes.length})`}
                books={catalogBooks}
                overflow={true}
              />

              {totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-2">
                  {page > 1 && (
                    <button
                      onClick={() => router.push(`/proximamente?page=${page - 1}`)}
                      className={clsx(
                        TYPOGRAPHY.bodyBase,
                        'px-4 py-2 border border-gray-300 hover:bg-gray-50 transition-colors'
                      )}
                    >
                      Anterior
                    </button>
                  )}

                  <span className={clsx(TYPOGRAPHY.bodyBase, 'px-4 py-2 text-black/60')}>
                    Página {page} de {totalPages}
                  </span>

                  {page < totalPages && (
                    <button
                      onClick={() => router.push(`/proximamente?page=${page + 1}`)}
                      className={clsx(
                        TYPOGRAPHY.bodyBase,
                        'px-4 py-2 border border-gray-300 hover:bg-gray-50 transition-colors'
                      )}
                    >
                      Siguiente
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </Section>
      </PageContainer>
    </>
  )
}

export default function ProximamentePage() {
  return (
    <Suspense
      fallback={
        <PageContainer>
          <PageHero
            title="Próximamente"
            subtitle="Publicaciones en preparación. Descubre las traducciones y obras originales que pronto estarán disponibles."
          />
          <Section spacing="large">
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-12 w-12 text-primary mb-4 animate-spin" />
              <p className={clsx(TYPOGRAPHY.bodyBase, 'text-black/60')}>Cargando...</p>
            </div>
          </Section>
        </PageContainer>
      }
    >
      <ProximamenteContent />
    </Suspense>
  )
}
