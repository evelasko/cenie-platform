import { PageContainer, Section } from '@/components/content'

export default function VolumeLoading() {
  return (
    <>
      {/* VolumeHero skeleton */}
      <header className="container grid grid-cols-12 gap-y-12 md:gap-y-16 pt-4 md:pt-12">
        {/* Cover area */}
        <div className="col-span-12 md:col-span-10 md:col-start-2 lg:col-span-6 lg:col-start-1">
          <div className="relative flex aspect-2/3 items-center justify-center bg-muted animate-pulse rounded" />
        </div>

        {/* Details column */}
        <div className="col-span-12 md:col-span-10 md:col-start-2 lg:col-span-6 lg:col-start-7 lg:flex lg:items-center lg:justify-center lg:py-11">
          <div className="w-full lg:ml-6 lg:max-w-[360px] space-y-3">
            <div className="h-10 w-full bg-muted animate-pulse rounded" />
            <div className="h-6 w-4/5 bg-muted animate-pulse rounded" />
            <div className="h-5 w-3/4 bg-muted animate-pulse rounded" />
            <div className="h-4 w-1/2 bg-muted animate-pulse rounded" />
            <div className="mt-8 h-12 w-full bg-muted animate-pulse rounded" />
            <div className="mt-10 space-y-2">
              <div className="h-4 w-24 bg-muted animate-pulse rounded" />
              <div className="h-4 w-32 bg-muted animate-pulse rounded" />
            </div>
          </div>
        </div>
      </header>

      {/* PageContainer with prose skeletons */}
      <PageContainer>
        <Section spacing="large">
          <div className="space-y-4">
            <div className="h-4 w-full bg-muted animate-pulse rounded" />
            <div className="h-4 w-full bg-muted animate-pulse rounded" />
            <div className="h-4 w-5/6 bg-muted animate-pulse rounded" />
            <div className="h-4 w-4/6 bg-muted animate-pulse rounded" />
          </div>
        </Section>
        <Section spacing="large">
          <div className="space-y-4">
            <div className="h-4 w-full bg-muted animate-pulse rounded" />
            <div className="h-4 w-full bg-muted animate-pulse rounded" />
            <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
          </div>
        </Section>
      </PageContainer>
    </>
  )
}
