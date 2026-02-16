import { PageContainer } from '@/components/content'

export default function MainLoading() {
  return (
    <PageContainer>
      {/* PageHero skeleton */}
      <header className="text-center mb-16">
        <div className="h-10 w-2/3 mx-auto mb-6 bg-muted animate-pulse rounded" />
        <div className="h-6 w-1/2 mx-auto bg-muted animate-pulse rounded" />
      </header>

      {/* Content placeholder blocks */}
      <section className="py-16 space-y-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 w-full bg-muted animate-pulse rounded" />
            <div className="h-4 w-5/6 bg-muted animate-pulse rounded" />
            <div className="h-4 w-4/6 bg-muted animate-pulse rounded" />
          </div>
        ))}
      </section>
    </PageContainer>
  )
}
