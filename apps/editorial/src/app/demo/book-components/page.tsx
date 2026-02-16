import dynamic from 'next/dynamic'
import { clsx } from 'clsx'
import { TYPOGRAPHY } from '@/lib/typography'
import Button from '@/components/ui/Button'

const BookCardItem = dynamic(() => import('@/components/items/BookCardItem'), {
  loading: () => <div className="flex items-center justify-center p-8">Loading...</div>,
})

const BookListItem = dynamic(() => import('@/components/items/BookListItem'), {
  loading: () => <div className="flex items-center justify-center p-8">Loading...</div>,
})

const BookPraiseItem = dynamic(() => import('@/components/items/BookPraiseItem'), {
  loading: () => <div className="flex items-center justify-center p-8">Loading...</div>,
})

const InLineMenuCard = dynamic(() => import('@/components/items/InLineMenuCard'), {
  loading: () => <div className="flex items-center justify-center p-8">Loading...</div>,
})

export default function BookComponentsDemoPage() {
  return (
    <div className="min-h-screen bg-background py-12 px-8">
      <div className="mx-auto max-w-7xl space-y-16">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className={clsx(TYPOGRAPHY.display1, 'text-foreground')}>Book Components Demo</h1>
          <p className={clsx(TYPOGRAPHY.lead, 'text-muted-foreground')}>
            Showcasing BookCardItem, BookListItem, BookPraiseItem, and InLineMenuCard
          </p>
        </div>

        {/* BookCardItem Section */}
        <section className="space-y-6">
          <h2 className={clsx(TYPOGRAPHY.h2, 'text-foreground border-b border-border pb-2')}>
            BookCardItem Component
          </h2>
          <p className={clsx(TYPOGRAPHY.bodyBase, 'text-muted-foreground')}>
            Single column card with image in original aspect ratio, title, and subtitle.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <BookCardItem
              title="The Art of War"
              subtitle="Ancient Military Strategy"
              imageSrc="/demo/covers/cover-1.jpg"
              imageAlt="The Art of War book cover"
            />
            <BookCardItem
              title="Pride and Prejudice"
              subtitle="A Classic Romance"
              imageSrc="/demo/covers/cover-2.jpg"
              imageAlt="Pride and Prejudice book cover"
            />
            <BookCardItem
              title="1984"
              subtitle="Dystopian Fiction"
              imageSrc="/demo/covers/cover-3.jpg"
              imageAlt="1984 book cover"
            />
            <BookCardItem
              title="To Kill a Mockingbird"
              subtitle="Social Justice Classic"
              imageSrc="/demo/covers/cover-4.jpg"
              imageAlt="To Kill a Mockingbird book cover"
            />
          </div>
        </section>

        {/* BookListItem Section */}
        <section className="space-y-6">
          <h2 className={clsx(TYPOGRAPHY.h2, 'text-foreground border-b border-border pb-2')}>
            BookListItem Component
          </h2>
          <p className={clsx(TYPOGRAPHY.bodyBase, 'text-muted-foreground')}>
            Two-column layout (responsive) with image, title, subtitle, author, description, and
            button.
          </p>
          <div className="space-y-8">
            <BookListItem
              imageSrc="/demo/covers/cover-5.jpg"
              imageAlt="The Great Gatsby book cover"
              title="The Great Gatsby"
              subtitle="A Novel of the Jazz Age"
              author="F. Scott Fitzgerald"
              description="Set in the Jazz Age on Long Island, the novel depicts narrator Nick Carraway's interactions with mysterious millionaire Jay Gatsby and Gatsby's obsession to reunite with his former lover, Daisy Buchanan."
              button={<Button variant="primary">View Details</Button>}
            />
            <BookListItem
              imageSrc="/demo/covers/cover-6.jpg"
              imageAlt="Moby Dick book cover"
              title="Moby-Dick"
              author="Herman Melville"
              description="The narrative of Captain Ahab's obsessive quest to destroy the white whale that maimed him. A masterpiece of American literature exploring themes of obsession, nature, and humanity."
              button={<Button variant="secondary">Learn More</Button>}
            />
            <BookListItem
              imageSrc="/demo/covers/cover-7.jpg"
              imageAlt="The Catcher in the Rye book cover"
              title="The Catcher in the Rye"
              subtitle="Coming of Age Classic"
              author="J.D. Salinger"
              description="The novel details two days in the life of 16-year-old Holden Caulfield after he has been expelled from prep school. Confused and disillusioned, Holden searches for truth and rails against the phoniness of the adult world."
              button={<Button variant="primary">Add to Library</Button>}
            />
          </div>
        </section>

        {/* BookPraiseItem Section */}
        <section className="space-y-6">
          <h2 className={clsx(TYPOGRAPHY.h2, 'text-foreground border-b border-border pb-2')}>
            BookPraiseItem Component
          </h2>
          <p className={clsx(TYPOGRAPHY.bodyBase, 'text-muted-foreground')}>
            Praise/review component with text truncation and expand/collapse functionality.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BookPraiseItem
              text="A masterpiece of modern literature. This book changed my entire perspective on life and philosophy. The author's brilliant prose and deep insights make it an unforgettable reading experience."
              author="— Jane Smith, Literary Critic"
            />
            <BookPraiseItem
              text="Short but impactful. A must-read for everyone interested in contemporary fiction."
              author="— John Doe, Book Reviewer"
            />
            <BookPraiseItem
              text="An extraordinary work that seamlessly blends history, philosophy, and storytelling. The author demonstrates a rare ability to make complex ideas accessible without sacrificing depth or nuance. Each chapter builds upon the last, creating a tapestry of interconnected themes that resonate long after the final page. The narrative voice is both intimate and authoritative, drawing readers into a world that feels simultaneously familiar and completely new. This is the kind of book that demands to be read slowly, savored like a fine wine. It challenges our assumptions about literature itself and what it can achieve. The prose sparkles with intelligence and wit, making even the most challenging passages a joy to read. In short, this is a monumental achievement that will be studied and celebrated for generations to come."
              author="— Dr. Sarah Johnson, Professor of Literature"
            />
            <BookPraiseItem
              text="A compelling narrative that grips you from the first page and doesn't let go until the end. The character development is superb, and the plot twists are both surprising and inevitable in hindsight. This author has created something truly special. Every sentence is crafted with care, every image precisely chosen. The book works on multiple levels - as entertainment, as social commentary, and as a meditation on the human condition."
              author="— Michael Chen, Award-winning Author"
            />
          </div>
        </section>

        {/* InLineMenuCard Section */}
        <section className="space-y-6">
          <h2 className={clsx(TYPOGRAPHY.h2, 'text-foreground border-b border-border pb-2')}>
            InLineMenuCard Component
          </h2>
          <p className={clsx(TYPOGRAPHY.bodyBase, 'text-muted-foreground')}>
            Navigation card with title, description, and links with arrow icons.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <InLineMenuCard
              title="For Readers"
              description="Discover our extensive catalog of academic and literary works"
              links={[
                { label: 'Browse Catalog', href: '/catalog', target: '_self' },
                { label: 'New Releases', href: '/new-releases', target: '_self' },
                { label: 'Bestsellers', href: '/bestsellers', target: '_self' },
                { label: 'Award Winners', href: '/awards', target: '_self' },
              ]}
            />
            <InLineMenuCard
              title="For Authors"
              description="Join our community of distinguished scholars and writers"
              links={[
                { label: 'Submission Guidelines', href: '/submit', target: '_self' },
                { label: 'Editorial Process', href: '/process', target: '_self' },
                { label: 'Author Resources', href: '/resources', target: '_self' },
              ]}
            />
            <InLineMenuCard
              title="For Librarians"
              description="Access tools and resources for institutional partnerships"
              links={[
                { label: 'Bulk Ordering', href: '/bulk', target: '_self' },
                { label: 'Digital Access', href: '/digital', target: '_self' },
                { label: 'Library Support', href: '/support', target: '_self' },
                { label: 'Catalog Downloads', href: '/downloads', target: '_self' },
              ]}
            />
          </div>
        </section>

        {/* Combined Example */}
        <section className="space-y-6">
          <h2 className={clsx(TYPOGRAPHY.h2, 'text-foreground border-b border-border pb-2')}>
            Combined Example: Book Detail Page Layout
          </h2>
          <p className={clsx(TYPOGRAPHY.bodyBase, 'text-muted-foreground')}>
            A realistic example showing how these components work together.
          </p>
          <div className="space-y-8">
            {/* Main book info */}
            <BookListItem
              imageSrc="/demo/covers/cover-1.jpg"
              imageAlt="Featured book cover"
              title="The Philosophy of Modern Society"
              subtitle="Exploring Contemporary Thought"
              author="Dr. Elizabeth Martinez"
              description="A comprehensive examination of philosophical movements shaping our modern world. This groundbreaking work synthesizes decades of research into an accessible and engaging narrative that speaks to both scholars and general readers."
              button={
                <Button variant="primary" size="lg">
                  Purchase Now
                </Button>
              }
            />

            {/* Praise section */}
            <div className="space-y-4">
              <h3 className={clsx(TYPOGRAPHY.h3, 'text-foreground')}>What People Are Saying</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <BookPraiseItem
                  text="Dr. Martinez has produced a tour de force. This book is essential reading for anyone interested in understanding the intellectual currents that shape our contemporary moment. Her analysis is sharp, her writing elegant, and her conclusions profound."
                  author="— Prof. Robert Williams, Harvard University"
                />
                <BookPraiseItem
                  text="Brilliantly argued and beautifully written. Martinez demonstrates why philosophy remains vital in the 21st century."
                  author="— The New York Times Book Review"
                />
              </div>
            </div>

            {/* Related menu */}
            <div>
              <h3 className={clsx(TYPOGRAPHY.h3, 'text-foreground mb-4')}>Explore More</h3>
              <InLineMenuCard
                title="Related Topics"
                description="Continue your journey through contemporary philosophy"
                links={[
                  { label: 'More by This Author', href: '/author/martinez', target: '_self' },
                  { label: 'Philosophy Collection', href: '/philosophy', target: '_self' },
                  { label: 'Reader Discussion Guide', href: '/guide', target: '_self' },
                ]}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
