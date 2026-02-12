'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Head from 'next/head'
import { PageContainer, PageHero, Section } from '@/components/content'
import BooksGrid from '@/components/sections/BooksGrid'
import BooksCarouselBanner from '@/components/banners/BooksCarouselBanner'
import { CatalogFilters } from '@/components/catalog/CatalogFilters'
import { Loader2 } from 'lucide-react'
import { clsx } from 'clsx'
import { TYPOGRAPHY } from '@/lib/typography'
import type { CatalogVolume, VolumeType } from '@/types/books'
import type { bookData } from '@/components/sections/BooksGrid'

function CatalogoContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [volumes, setVolumes] = useState<CatalogVolume[]>([])
  const [featured, setFeatured] = useState<CatalogVolume[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(1)

  // Filter state from URL
  const page = parseInt(searchParams.get('page') || '1')
  const searchQuery = searchParams.get('search') || ''
  const selectedType = (searchParams.get('type') || 'all') as VolumeType | 'all'
  const selectedCategories = searchParams.get('categories')?.split(',').filter(Boolean) || []

  // Use stable string for dependency to avoid infinite loop ([] !== [] on each render)
  const categoriesKey = selectedCategories.join(',')

  useEffect(() => {
    fetchCategories()
    fetchFeatured()
  }, [])

  useEffect(() => {
    fetchVolumes()
  }, [page, searchQuery, selectedType, categoriesKey])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/public/categories')
      const data = await response.json()
      if (response.ok) {
        setCategories(data.categories || [])
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  const fetchFeatured = async () => {
    try {
      const response = await fetch('/api/public/catalog?featured=true&per_page=10')
      const data = await response.json()
      if (response.ok) {
        setFeatured(data.volumes || [])
      }
    } catch (error) {
      console.error('Failed to fetch featured:', error)
    }
  }

  const fetchVolumes = async () => {
    setLoading(true)

    try {
      const params = new URLSearchParams()
      params.set('page', page.toString())
      params.set('per_page', '20')

      if (searchQuery) params.set('search', searchQuery)
      if (selectedType !== 'all') params.set('type', selectedType)
      if (selectedCategories.length > 0) params.set('categories', selectedCategories.join(','))

      const response = await fetch(`/api/public/catalog?${params}`)
      const data = await response.json()

      if (response.ok) {
        setVolumes(data.volumes || [])
        setTotalPages(data.pagination?.total_pages || 1)
      }
    } catch (error) {
      console.error('Failed to fetch volumes:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateFilters = (
    updates: Partial<{
      search: string
      type: VolumeType | 'all'
      categories: string[]
      page: number
    }>
  ) => {
    const params = new URLSearchParams()

    // Always reset to page 1 when filters change
    const newPage = updates.page !== undefined ? updates.page : 1
    if (newPage > 1) params.set('page', newPage.toString())

    const newSearch = updates.search !== undefined ? updates.search : searchQuery
    if (newSearch) params.set('search', newSearch)

    const newType = updates.type !== undefined ? updates.type : selectedType
    if (newType !== 'all') params.set('type', newType)

    const newCategories = updates.categories !== undefined ? updates.categories : selectedCategories
    if (newCategories.length > 0) params.set('categories', newCategories.join(','))

    router.push(`/catalogo?${params.toString()}`)
  }

  const handleCategoryToggle = (category: string) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category]
    updateFilters({ categories: newCategories })
  }

  const handleReset = () => {
    router.push('/catalogo')
  }

  // Transform volumes to bookData format
  const featuredBooks: bookData[] = featured.map((v) => ({
    title: v.title,
    author: v.authors_display || 'CENIE Editorial',
    coverSrc: v.cover_url || v.cover_fallback_url || '/images/placeholder-cover.jpg',
    link: `/catalogo/${v.slug}`,
  }))

  const catalogBooks: bookData[] = volumes.map((v) => ({
    title: v.title,
    author: v.authors_display || 'CENIE Editorial',
    coverSrc: v.cover_url || v.cover_fallback_url || '/images/placeholder-cover.jpg',
    link: `/catalogo/${v.slug}`,
  }))

  return (
    <>
      {/* SEO Meta Tags */}
      <Head>
        <title>Catálogo CENIE Editorial | Publicaciones de Artes Escénicas</title>
        <meta
          name="description"
          content="Explora nuestra colección de publicaciones y traducciones especializadas en teatro, danza y artes escénicas. Investigación académica de calidad en español."
        />
        <meta
          property="og:title"
          content="Catálogo CENIE Editorial | Publicaciones de Artes Escénicas"
        />
        <meta
          property="og:description"
          content="Explora nuestra colección de publicaciones y traducciones especializadas en teatro, danza y artes escénicas."
        />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="keywords"
          content="teatro, danza, artes escénicas, publicaciones académicas, traducciones, investigación"
        />
      </Head>

      <PageContainer>
        <PageHero
          title="Catálogo CENIE Editorial"
          subtitle="Descubre nuestra colección de publicaciones y traducciones sobre artes escénicas"
        />

        {/* Featured Carousel */}
        {featured.length > 0 &&
          !searchQuery &&
          selectedCategories.length === 0 &&
          selectedType === 'all' && (
            <Section spacing="large">
              <BooksCarouselBanner title="Publicaciones Destacadas" books={featuredBooks} />
            </Section>
          )}

        {/* Main Catalog with Filters */}
        <Section spacing="large">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-6">
                <CatalogFilters
                  categories={categories}
                  selectedCategories={selectedCategories}
                  selectedType={selectedType}
                  searchQuery={searchQuery}
                  onSearchChange={(query) => updateFilters({ search: query })}
                  onCategoryToggle={handleCategoryToggle}
                  onTypeChange={(type) => updateFilters({ type })}
                  onReset={handleReset}
                />
              </div>
            </div>

            {/* Catalog Grid */}
            <div className="lg:col-span-3">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="h-12 w-12 text-primary mb-4 animate-spin" />
                  <p className={clsx(TYPOGRAPHY.bodyBase, 'text-black/60')}>
                    Cargando publicaciones...
                  </p>
                </div>
              ) : catalogBooks.length === 0 ? (
                <div className="text-center py-12">
                  <p className={clsx(TYPOGRAPHY.h4, 'text-black mb-2')}>
                    No se encontraron publicaciones
                  </p>
                  <p className={clsx(TYPOGRAPHY.bodyBase, 'text-black/60')}>
                    Intenta ajustar tus filtros o búsqueda
                  </p>
                </div>
              ) : (
                <>
                  <BooksGrid
                    title={`${searchQuery ? `Resultados para "${searchQuery}"` : 'Todas las Publicaciones'} (${volumes.length})`}
                    books={catalogBooks}
                    overflow={true}
                  />

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-12 flex items-center justify-center gap-2">
                      {page > 1 && (
                        <button
                          onClick={() => updateFilters({ page: page - 1 })}
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
                          onClick={() => updateFilters({ page: page + 1 })}
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
            </div>
          </div>
        </Section>
      </PageContainer>
    </>
  )
}

export default function CatalogoPage() {
  return (
    <Suspense
      fallback={
        <PageContainer>
          <PageHero
            title="Catálogo CENIE Editorial"
            subtitle="Descubre nuestra colección de publicaciones y traducciones sobre artes escénicas"
          />
          <Section spacing="large">
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-12 w-12 text-primary mb-4 animate-spin" />
              <p className={clsx(TYPOGRAPHY.bodyBase, 'text-black/60')}>Cargando catálogo...</p>
            </div>
          </Section>
        </PageContainer>
      }
    >
      <CatalogoContent />
    </Suspense>
  )
}
