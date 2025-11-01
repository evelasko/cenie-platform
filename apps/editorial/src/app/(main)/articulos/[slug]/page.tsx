import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { getCompiledMDXBySlug, getContentSlugs, type ArticleFrontmatter } from '@/lib/mdx'
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
      images: article.frontmatter.coverImage
        ? [{ url: article.frontmatter.coverImage, alt: article.frontmatter.coverImageAlt }]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.frontmatter.title,
      description: article.frontmatter.description,
      images: article.frontmatter.coverImage ? [article.frontmatter.coverImage] : undefined,
    },
  }
}

export default async function ArticuloPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = await getCompiledMDXBySlug<ArticleFrontmatter>('articles', slug)

  if (!article) {
    notFound()
  }

  return (
    <ContentLayout
      frontmatter={article.frontmatter}
      readingTime={article.readingTime}
      type="article"
    >
      {article.content}
    </ContentLayout>
  )
}
