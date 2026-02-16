import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { getCompiledMDXBySlug, getContentSlugs, type ArticleFrontmatter } from '@/lib/mdx'
import { generateArticleJsonLd } from '@/lib/structured-data'
import { ContentLayout } from '@/components/content'

// Generate static params for all articles
export async function generateStaticParams() {
  const slugs = getContentSlugs('articles')
  return slugs.map((slug) => ({ slug }))
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const article = await getCompiledMDXBySlug<ArticleFrontmatter>('articles', slug)

  if (!article) {
    return {
      title: 'Artículo no encontrado',
    }
  }

  return {
    title: article.frontmatter.title,
    description: article.frontmatter.description,
    authors: article.frontmatter.author ? [{ name: article.frontmatter.author }] : undefined,
    openGraph: {
      title: article.frontmatter.title,
      description: article.frontmatter.description,
      type: 'article',
      publishedTime: article.frontmatter.publishedDate,
      modifiedTime: article.frontmatter.updatedDate,
      authors: article.frontmatter.author ? [article.frontmatter.author] : undefined,
      tags: article.frontmatter.tags,
      // Dynamic OG image from opengraph-image.tsx
    },
    twitter: {
      card: 'summary_large_image',
      title: article.frontmatter.title,
      description: article.frontmatter.description,
      // Dynamic OG image from opengraph-image.tsx
    },
  }
}

export default async function ArticuloPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = await getCompiledMDXBySlug<ArticleFrontmatter>('articles', slug)

  if (!article) {
    notFound()
  }

  const articleJsonLd = generateArticleJsonLd(article.frontmatter, slug)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleJsonLd).replace(/</g, '\u003c'),
        }}
      />
      <ContentLayout
        frontmatter={article.frontmatter}
        readingTime={article.readingTime}
        type="article"
      >
        {article.content}
      </ContentLayout>
    </>
  )
}
