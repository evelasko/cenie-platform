import type { CatalogVolume } from '@/types/books'
import type { ArticleFrontmatter, NewsFrontmatter } from '@/lib/mdx'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://editorial.cenie.org'
const LOGO_URL = 'https://cdn.cenie.org/editorial/logo.png'

const publisherOrganization = {
  '@type': 'Organization' as const,
  name: 'CENIE Editorial',
  logo: {
    '@type': 'ImageObject' as const,
    url: LOGO_URL,
  },
}

export function generateBookJsonLd(volume: CatalogVolume) {
  const authors = volume.authors_display
    ? volume.authors_display.split(',').map((name) => name.trim()).filter(Boolean)
    : []
  const authorList = authors.map((name) => ({
    '@type': 'Person' as const,
    name,
  }))

  const datePublished = volume.publication_year
    ? `${volume.publication_year}-01-01`
    : volume.published_at || undefined

  const image =
    volume.cover_url || volume.cover_fallback_url || undefined

  const description = volume.seo_description || volume.description

  return {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: volume.title,
    ...(volume.subtitle && { alternateName: volume.subtitle }),
    ...(authorList.length > 0 && { author: authorList }),
    ...(volume.isbn_13 && { isbn: volume.isbn_13 }),
    ...(volume.isbn_10 && !volume.isbn_13 && { isbn: volume.isbn_10 }),
    publisher: {
      '@type': 'Organization' as const,
      name: volume.publisher_name,
    },
    ...(description && { description }),
    ...(image && { image }),
    ...(datePublished && { datePublished }),
    ...(volume.language && { inLanguage: volume.language }),
    ...(volume.slug && {
      mainEntityOfPage: {
        '@type': 'WebPage' as const,
        '@id': `${BASE_URL}/catalogo/${volume.slug}`,
      },
    }),
  }
}

export function generateArticleJsonLd(article: ArticleFrontmatter, slug: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    ...(article.author && {
      author: {
        '@type': 'Person' as const,
        name: article.author,
      },
    }),
    datePublished: article.publishedDate,
    ...(article.updatedDate && { dateModified: article.updatedDate }),
    ...(article.description && { description: article.description }),
    ...(article.coverImage && { image: article.coverImage }),
    publisher: publisherOrganization,
    inLanguage: 'es',
    mainEntityOfPage: {
      '@type': 'WebPage' as const,
      '@id': `${BASE_URL}/articulos/${slug}`,
    },
  }
}

export function generateNewsArticleJsonLd(news: NewsFrontmatter, slug: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: news.title,
    datePublished: news.publishedDate,
    ...(news.description && { description: news.description }),
    ...(news.coverImage && { image: news.coverImage }),
    publisher: publisherOrganization,
    inLanguage: 'es',
    mainEntityOfPage: {
      '@type': 'WebPage' as const,
      '@id': `${BASE_URL}/noticias/${slug}`,
    },
  }
}

export function generateOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'CENIE Editorial',
    url: BASE_URL,
    logo: LOGO_URL,
  }
}

export function generateWebSiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'CENIE Editorial',
    url: BASE_URL,
  }
}
