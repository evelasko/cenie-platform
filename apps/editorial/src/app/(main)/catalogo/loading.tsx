import { PageContainer, Section } from '@/components/content'

export default function CatalogoLoading() {
  return (
    <PageContainer>
      {/* PageHero skeleton */}
      <header className="text-center mb-16">
        <div className="h-10 w-2/3 mx-auto mb-6 bg-muted animate-pulse rounded" />
        <div className="h-6 w-1/2 mx-auto bg-muted animate-pulse rounded" />
      </header>

      {/* Books grid skeleton - matches BooksGrid: grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 */}
      <Section spacing="lg">
        <div className="flex flex-col gap-8">
          <div className="h-8 w-48 bg-muted animate-pulse rounded" />
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="flex flex-col gap-3">
                <div className="w-full aspect-2/3 bg-muted animate-pulse rounded" />
                <div className="h-4 w-full bg-muted animate-pulse rounded" />
                <div className="h-3 w-3/4 bg-muted animate-pulse rounded" />
              </div>
            ))}
          </div>
        </div>
      </Section>
    </PageContainer>
  )
}
