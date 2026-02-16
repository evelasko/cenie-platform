import { PageContainer } from '@/components/content'

function SkeletonContentCard() {
  return (
    <article className="flex flex-col border border-border rounded-lg overflow-hidden bg-background">
      <div className="w-full h-48 bg-muted animate-pulse" />
      <div className="flex flex-col flex-1 p-6">
        <div className="h-6 w-20 mb-3 bg-muted animate-pulse rounded-full" />
        <div className="h-5 w-full mb-3 bg-muted animate-pulse rounded" />
        <div className="space-y-2 mb-4">
          <div className="h-4 w-full bg-muted animate-pulse rounded" />
          <div className="h-4 w-5/6 bg-muted animate-pulse rounded" />
          <div className="h-4 w-4/6 bg-muted animate-pulse rounded" />
        </div>
        <div className="pt-4 border-t border-border">
          <div className="flex gap-4">
            <div className="h-4 w-24 bg-muted animate-pulse rounded" />
            <div className="h-4 w-20 bg-muted animate-pulse rounded" />
          </div>
        </div>
      </div>
    </article>
  )
}

export default function NoticiasLoading() {
  return (
    <PageContainer>
      {/* PageHero skeleton */}
      <header className="text-center mb-16">
        <div className="h-10 w-2/3 mx-auto mb-6 bg-muted animate-pulse rounded" />
        <div className="h-6 w-1/2 mx-auto bg-muted animate-pulse rounded" />
      </header>

      {/* Featured section skeleton */}
      <section className="py-12 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="h-8 w-48 mb-8 bg-muted animate-pulse rounded" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <SkeletonContentCard key={i} />
            ))}
          </div>
        </div>
      </section>
    </PageContainer>
  )
}
