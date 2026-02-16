import type { MetadataRoute } from 'next'
import { createStaticClient } from '@cenie/supabase/static'
import { getContentSlugs } from '@/lib/mdx'
import { logger } from '@/lib/logger'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://editorial.cenie.org'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE_URL}/catalogo`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/articulos`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/noticias`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/destacados`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/proximamente`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/nosotros`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/nosotros/comite`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/nosotros/comunidad`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/nosotros/contacto`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/nosotros/traducciones`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/recursos/acceso`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/recursos/autores`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/recursos/estudiantes`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/recursos/instituciones`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/tecnologia`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/privacidad`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/terminos`, changeFrequency: 'yearly', priority: 0.3 },
  ]

  const [catalogRoutes, articleRoutes, newsRoutes, proximamenteRoutes] = await Promise.all([
    getCatalogRoutes(),
    getArticleRoutes(),
    getNewsRoutes(),
    getProximamenteRoutes(),
  ])

  return [...staticRoutes, ...catalogRoutes, ...articleRoutes, ...newsRoutes, ...proximamenteRoutes]
}

async function getCatalogRoutes(): Promise<MetadataRoute.Sitemap> {
  try {
    const supabase = createStaticClient()
    const { data, error } = await supabase
      .from('catalog_volumes')
      .select('*')
      .eq('publication_status', 'published')

    if (error) {
      logger.error('Sitemap: failed to fetch catalog volumes', { error: error.message })
      return []
    }

    return ((data as Record<string, unknown>[]) || []).map((volume) => ({
      url: `${BASE_URL}/catalogo/${volume.slug as string}`,
      lastModified: volume.updated_at ? new Date(volume.updated_at as string) : undefined,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))
  } catch (error) {
    logger.error('Sitemap: catalog routes error', {
      error: error instanceof Error ? error.message : 'Unknown error',
    })
    return []
  }
}

function getArticleRoutes(): MetadataRoute.Sitemap {
  try {
    const slugs = getContentSlugs('articles')
    return slugs.map((slug) => ({
      url: `${BASE_URL}/articulos/${slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  } catch (error) {
    logger.error('Sitemap: article routes error', {
      error: error instanceof Error ? error.message : 'Unknown error',
    })
    return []
  }
}

function getNewsRoutes(): MetadataRoute.Sitemap {
  try {
    const slugs = getContentSlugs('news')
    return slugs.map((slug) => ({
      url: `${BASE_URL}/noticias/${slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  } catch (error) {
    logger.error('Sitemap: news routes error', {
      error: error instanceof Error ? error.message : 'Unknown error',
    })
    return []
  }
}

async function getProximamenteRoutes(): Promise<MetadataRoute.Sitemap> {
  try {
    const supabase = createStaticClient()

    const [draftResult, booksResult] = await Promise.all([
      supabase
        .from('catalog_volumes')
        .select('*')
        .eq('publication_status', 'draft'),
      supabase
        .from('books')
        .select('*')
        .eq('selected_for_translation', true)
        .eq('promoted_to_catalog', false),
    ])

    const routes: MetadataRoute.Sitemap = []

    if (draftResult.error) {
      logger.error('Sitemap: failed to fetch draft volumes', { error: draftResult.error.message })
    } else {
      for (const volume of (draftResult.data as Record<string, unknown>[]) || []) {
        routes.push({
          url: `${BASE_URL}/proximamente/${volume.slug as string}`,
          lastModified: volume.updated_at ? new Date(volume.updated_at as string) : undefined,
          changeFrequency: 'weekly' as const,
          priority: 0.5,
        })
      }
    }

    if (booksResult.error) {
      logger.error('Sitemap: failed to fetch selected books', { error: booksResult.error.message })
    } else {
      for (const book of (booksResult.data as Record<string, unknown>[]) || []) {
        routes.push({
          url: `${BASE_URL}/proximamente/book-${book.id as string}`,
          lastModified: book.added_at ? new Date(book.added_at as string) : undefined,
          changeFrequency: 'weekly' as const,
          priority: 0.5,
        })
      }
    }

    return routes
  } catch (error) {
    logger.error('Sitemap: proximamente routes error', {
      error: error instanceof Error ? error.message : 'Unknown error',
    })
    return []
  }
}
