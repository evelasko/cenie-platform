import { Metadata } from 'next'
import { getAllContent, type NewsFrontmatter } from '@/lib/mdx'
import { ContentCard, PageHero, PageContainer } from '@/components/content'

export const metadata: Metadata = {
  title: 'Noticias',
  description:
    'Mantente al día con las últimas novedades, anuncios y eventos de CENIE Editorial.',
}

export default async function NoticiasPage() {
  // Get all news
  const news = await getAllContent<NewsFrontmatter>('news')

  // Sort by date (newest first)
  const sortedNews = news.sort((a, b) => {
    const dateA = new Date(a.frontmatter.publishedDate).getTime()
    const dateB = new Date(b.frontmatter.publishedDate).getTime()
    return dateB - dateA
  })

  // Separate featured news
  const featuredNews = sortedNews.filter((item) => item.frontmatter.featured)
  const regularNews = sortedNews.filter((item) => !item.frontmatter.featured)

  return (
    <PageContainer>
      {/* Hero Section */}
      <PageHero
        title="Noticias"
        subtitle="Últimas novedades, anuncios y eventos de CENIE Editorial."
      />

      {/* Featured News Section */}
      {featuredNews.length > 0 && (
        <section className="py-12 border-b border-border">
          <div className="container mx-auto px-4">
            <h2 className="type-heading-2 mb-8">Noticias Destacadas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredNews.map((item) => (
                <ContentCard
                  key={item.slug}
                  slug={item.slug}
                  frontmatter={item.frontmatter}
                  readingTime={item.readingTime}
                  type="news"
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All News Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="type-heading-2">
              {featuredNews.length > 0 ? 'Todas las Noticias' : 'Noticias Recientes'}
            </h2>
            <p className="type-body-base text-muted-foreground">
              {sortedNews.length} {sortedNews.length === 1 ? 'noticia' : 'noticias'}
            </p>
          </div>

          {sortedNews.length === 0 ? (
            <div className="text-center py-12">
              <p className="type-body-large text-muted-foreground">
                No hay noticias disponibles en este momento.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(featuredNews.length > 0 ? regularNews : sortedNews).map((item) => (
                <ContentCard
                  key={item.slug}
                  slug={item.slug}
                  frontmatter={item.frontmatter}
                  readingTime={item.readingTime}
                  type="news"
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </PageContainer>
  )
}
