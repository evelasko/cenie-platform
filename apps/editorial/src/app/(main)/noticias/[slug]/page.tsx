import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { getCompiledMDXBySlug, getContentSlugs, type NewsFrontmatter } from '@/lib/mdx'
import { generateNewsArticleJsonLd } from '@/lib/structured-data'
import { ContentLayout } from '@/components/content'

// Generate static params for all news
export async function generateStaticParams() {
  const slugs = getContentSlugs('news')
  return slugs.map((slug) => ({ slug }))
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const news = await getCompiledMDXBySlug<NewsFrontmatter>('news', slug)

  if (!news) {
    return {
      title: 'Noticia no encontrada',
    }
  }

  return {
    title: news.frontmatter.title,
    description: news.frontmatter.description,
    openGraph: {
      title: news.frontmatter.title,
      description: news.frontmatter.description,
      type: 'article',
      publishedTime: news.frontmatter.publishedDate,
      tags: news.frontmatter.tags,
      images: news.frontmatter.coverImage
        ? [{ url: news.frontmatter.coverImage, alt: news.frontmatter.coverImageAlt }]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: news.frontmatter.title,
      description: news.frontmatter.description,
      images: news.frontmatter.coverImage ? [news.frontmatter.coverImage] : undefined,
    },
  }
}

export default async function NoticiaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const news = await getCompiledMDXBySlug<NewsFrontmatter>('news', slug)

  if (!news) {
    notFound()
  }

  const newsJsonLd = generateNewsArticleJsonLd(news.frontmatter, slug)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(newsJsonLd).replace(/</g, '\u003c'),
        }}
      />
      <ContentLayout
        frontmatter={news.frontmatter}
        readingTime={news.readingTime}
        type="news"
      >
        {news.content}
      </ContentLayout>
    </>
  )
}
