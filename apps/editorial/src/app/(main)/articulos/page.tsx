import { Metadata } from 'next'
import { getAllContent, type ArticleFrontmatter } from '@/lib/mdx'
import { ContentCard, PageHero, PageContainer } from '@/components/content'

export const metadata: Metadata = {
  title: 'Artículos Académicos',
  description:
    'Explore nuestra colección de artículos académicos sobre investigación, metodología y publicación científica.',
}

export default async function ArticulosPage() {
  // Get all articles
  const articles = await getAllContent<ArticleFrontmatter>('articles')

  // Sort by date (newest first)
  const sortedArticles = articles.sort((a, b) => {
    const dateA = new Date(a.frontmatter.publishedDate).getTime()
    const dateB = new Date(b.frontmatter.publishedDate).getTime()
    return dateB - dateA
  })

  // Separate featured articles
  const featuredArticles = sortedArticles.filter((article) => article.frontmatter.featured)
  const regularArticles = sortedArticles.filter((article) => !article.frontmatter.featured)

  return (
    <PageContainer>
      {/* Hero Section */}
      <PageHero
        title="Artículos Académicos"
        subtitle="Investigación de vanguardia en artes escénicas, publicación académica y metodologías de investigación."
      />

      {/* Featured Articles Section */}
      {featuredArticles.length > 0 && (
        <section className="py-12 border-b border-border">
          <div className="container mx-auto px-4">
            <h2 className="type-heading-2 mb-8">Artículos Destacados</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredArticles.map((article) => (
                <ContentCard
                  key={article.slug}
                  slug={article.slug}
                  frontmatter={article.frontmatter}
                  readingTime={article.readingTime}
                  type="article"
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Articles Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="type-heading-2">
              {featuredArticles.length > 0 ? 'Todos los Artículos' : 'Artículos Recientes'}
            </h2>
            <p className="type-body-base text-muted-foreground">
              {sortedArticles.length} {sortedArticles.length === 1 ? 'artículo' : 'artículos'}
            </p>
          </div>

          {sortedArticles.length === 0 ? (
            <div className="text-center py-12">
              <p className="type-body-large text-muted-foreground">
                No hay artículos disponibles en este momento.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(featuredArticles.length > 0 ? regularArticles : sortedArticles).map((article) => (
                <ContentCard
                  key={article.slug}
                  slug={article.slug}
                  frontmatter={article.frontmatter}
                  readingTime={article.readingTime}
                  type="article"
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </PageContainer>
  )
}
