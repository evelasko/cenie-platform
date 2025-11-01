import { clsx } from 'clsx'
import { TYPOGRAPHY } from '@/lib/typography'
import BookDetails from '@/components/sections/BookDetails'
import BookForeword from '@/components/sections/BookForeword'
import BooksGrid from '@/components/sections/BooksGrid'
import TabbedContent from '@/components/sections/TabbedContent'
import BooksCarouselBanner from '@/components/banners/BooksCarouselBanner'
import SingleBookBanner from '@/components/banners/SingleBookBanner'
import BookPraiseItem from '@/components/items/BookPraiseItem'

export default function BookSectionsDemoPage() {
  // Sample book data
  const sampleBooks = [
    {
      title: 'The Art of War',
      author: 'Sun Tzu',
      coverSrc: '/demo/covers/cover-1.jpg',
      link: '/book/art-of-war',
    },
    {
      title: 'Pride and Prejudice',
      author: 'Jane Austen',
      coverSrc: '/demo/covers/cover-2.jpg',
      link: '/book/pride-prejudice',
    },
    {
      title: '1984',
      author: 'George Orwell',
      coverSrc: '/demo/covers/cover-3.jpg',
      link: '/book/1984',
    },
    {
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      coverSrc: '/demo/covers/cover-4.jpg',
      link: '/book/mockingbird',
    },
    {
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      coverSrc: '/demo/covers/cover-5.jpg',
      link: '/book/gatsby',
    },
    {
      title: 'Moby Dick',
      author: 'Herman Melville',
      coverSrc: '/demo/covers/cover-6.jpg',
      link: '/book/moby-dick',
    },
    {
      title: 'The Catcher in the Rye',
      author: 'J.D. Salinger',
      coverSrc: '/demo/covers/cover-7.jpg',
      link: '/book/catcher',
    },
  ]

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="mx-auto max-w-7xl space-y-16 px-4">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className={clsx(TYPOGRAPHY.display1, 'text-foreground')}>
            Book & Section Components Demo
          </h1>
          <p className={clsx(TYPOGRAPHY.lead, 'text-muted-foreground')}>
            Showcasing BookDetails, BookForeword, BooksGrid, TabbedContent, and Banners
          </p>
        </div>

        {/* SingleBookBanner Section */}
        <section className="space-y-6">
          <h2 className={clsx(TYPOGRAPHY.h2, 'text-foreground border-b border-border pb-2')}>
            SingleBookBanner Component
          </h2>
          <p className={clsx(TYPOGRAPHY.bodyBase, 'text-muted-foreground')}>
            Featured book banner with tinted background.
          </p>
          <SingleBookBanner
            title="The Philosophy of Modern Society"
            coverSrc="/demo/covers/cover-1.jpg"
            authors={[
              { name: 'Dr. Elizabeth Martinez', link: '/author/martinez' },
              { name: 'Prof. John Smith', link: '/author/smith' },
            ]}
            link="/book/philosophy-modern-society"
          />
        </section>

        {/* BooksCarouselBanner Section */}
        <section className="space-y-6">
          <h2 className={clsx(TYPOGRAPHY.h2, 'text-foreground border-b border-border pb-2')}>
            BooksCarouselBanner Component
          </h2>
          <p className={clsx(TYPOGRAPHY.bodyBase, 'text-muted-foreground')}>
            Horizontal scrolling carousel with book covers and metadata.
          </p>
          <div className="-mx-4">
            <BooksCarouselBanner title="New Releases" books={sampleBooks} />
          </div>
        </section>

        {/* BooksGrid Section */}
        <section className="space-y-6">
          <h2 className={clsx(TYPOGRAPHY.h2, 'text-foreground border-b border-border pb-2')}>
            BooksGrid Component
          </h2>
          <p className={clsx(TYPOGRAPHY.bodyBase, 'text-muted-foreground')}>
            Responsive grid layout for displaying multiple books.
          </p>
          <div className="space-y-8">
            <div>
              <h3 className={clsx(TYPOGRAPHY.h3, 'text-foreground mb-4')}>With Overflow</h3>
              <BooksGrid title="Bestsellers" books={sampleBooks} overflow={true} />
            </div>
            <div>
              <h3 className={clsx(TYPOGRAPHY.h3, 'text-foreground mb-4')}>Without Overflow</h3>
              <BooksGrid title="Staff Picks" books={sampleBooks.slice(0, 5)} overflow={false} />
            </div>
          </div>
        </section>

        {/* BookDetails Section */}
        <section className="space-y-6">
          <h2 className={clsx(TYPOGRAPHY.h2, 'text-foreground border-b border-border pb-2')}>
            BookDetails Component
          </h2>
          <p className={clsx(TYPOGRAPHY.bodyBase, 'text-muted-foreground')}>
            Comprehensive book information with purchase options.
          </p>
          <div className="bg-white rounded-lg p-6">
            <BookDetails
              bookTitle="This Craft of Verse"
              bookAuthor={[{ name: 'Jorge Luis Borges', link: '/author/borges' }]}
              bookEditor={['Calin-Andrei Mihailescu']}
              bookPublicationDate="09/16/2025"
              bookISBN="9780674302457"
              bookCoverSrc="/demo/covers/cover-2.jpg"
              lookInsideLink="/sample/this-craft-of-verse.pdf"
              buyHereLink={[
                { format: 'Hardcover', price: '22.95', currency: '£', link: '/buy/hardcover' },
                { format: 'eBook', price: '15.99', currency: '£', link: '/buy/ebook' },
              ]}
              buyElsewhereLinks={[
                { label: 'Amazon', link: 'https://amazon.com' },
                { label: 'Barnes and Noble', link: 'https://bn.com' },
                { label: 'Bookshop.org', link: 'https://bookshop.org' },
              ]}
            />
          </div>
        </section>

        {/* BookForeword Section */}
        <section className="space-y-6">
          <h2 className={clsx(TYPOGRAPHY.h2, 'text-foreground border-b border-border pb-2')}>
            BookForeword Component
          </h2>
          <p className={clsx(TYPOGRAPHY.bodyBase, 'text-muted-foreground')}>
            Book foreword with quote and expandable text (supports HTML content).
          </p>
          <div className="max-w-3xl space-y-8">
            <div className="border border-border p-6 rounded-lg">
              <BookForeword
                quote="<em>A masterwork of literary criticism</em>"
                foreword="<p>This collection represents the culmination of decades of scholarly work by one of the twentieth century's most influential writers. <strong>Jorge Luis Borges</strong> brings his unique perspective to the craft of poetry and prose.</p><p>In these lectures, originally delivered at Harvard University, Borges explores the fundamental elements of verse-making with both erudition and accessibility. His insights span from ancient Greek epics to modern Argentine poetry, demonstrating his remarkable breadth of knowledge.</p>"
              />
            </div>
            <div className="border border-border p-6 rounded-lg">
              <BookForeword
                quote="<em>Essential reading for all scholars</em>"
                foreword="<p>The philosophical depth of this work cannot be overstated. Drawing from a lifetime of research and contemplation, the author presents a comprehensive framework for understanding contemporary society.</p><p>Each chapter builds upon the last, creating a tapestry of interconnected ideas that challenge conventional wisdom. The prose is both rigorous and engaging, making complex concepts accessible to readers from diverse backgrounds. Through careful analysis and thoughtful argumentation, this book makes a compelling case for rethinking our fundamental assumptions about social organization, economic systems, and cultural evolution.</p><p>The author's mastery of historical context enriches every discussion, providing readers with a deep appreciation for how current debates are rooted in centuries of philosophical discourse. This is not merely a theoretical exercise but a practical guide for navigating the complexities of modern life.</p>"
              />
            </div>
          </div>
        </section>

        {/* TabbedContent Section */}
        <section className="space-y-6">
          <h2 className={clsx(TYPOGRAPHY.h2, 'text-foreground border-b border-border pb-2')}>
            TabbedContent Component
          </h2>
          <p className={clsx(TYPOGRAPHY.bodyBase, 'text-muted-foreground')}>
            Tabbed interface for organizing content sections.
          </p>
          <TabbedContent
            tabs={[
              {
                label: 'Description',
                content: (
                  <div className="space-y-4">
                    <p className={clsx(TYPOGRAPHY.bodyLarge, 'text-black/90')}>
                      This groundbreaking work explores the intersection of philosophy, economics,
                      and social theory. Drawing from decades of research, the author presents a
                      comprehensive framework for understanding contemporary challenges.
                    </p>
                    <p className={clsx(TYPOGRAPHY.bodyBase, 'text-black/80')}>
                      The book is divided into three main sections, each building upon the insights
                      of the previous. Through rigorous analysis and clear exposition, complex ideas
                      become accessible to a broad audience.
                    </p>
                  </div>
                ),
              },
              {
                label: 'Reviews',
                content: (
                  <div className="space-y-4">
                    <BookPraiseItem
                      text="A tour de force of intellectual history. This book will be essential reading for scholars across multiple disciplines for years to come."
                      author="— Prof. Sarah Williams, Oxford University"
                    />
                    <BookPraiseItem
                      text="Brilliantly argued and beautifully written. The author demonstrates why philosophy remains vital in addressing contemporary challenges. Each chapter offers fresh insights that challenge conventional wisdom while remaining grounded in rigorous scholarship."
                      author="— The New York Review of Books"
                    />
                    <BookPraiseItem
                      text="Essential reading for anyone interested in understanding our complex world."
                      author="— Dr. Michael Chen, Harvard University"
                    />
                  </div>
                ),
              },
              {
                label: 'About the Author',
                content: (
                  <div className="space-y-4">
                    <p className={clsx(TYPOGRAPHY.bodyLarge, 'text-black/90')}>
                      Dr. Elizabeth Martinez is Professor of Philosophy at Stanford University. Her
                      research focuses on social and political philosophy, with particular emphasis
                      on questions of justice, equality, and democratic theory.
                    </p>
                    <p className={clsx(TYPOGRAPHY.bodyBase, 'text-black/80')}>
                      She has published extensively in leading academic journals and is the author
                      of several influential books. Her work has been translated into fifteen
                      languages and has received numerous awards, including the prestigious
                      Guggenheim Fellowship.
                    </p>
                  </div>
                ),
              },
              {
                label: 'Table of Contents',
                content: (
                  <div className={clsx(TYPOGRAPHY.bodyBase, 'text-black/80')}>
                    <ol className="list-decimal list-inside space-y-2">
                      <li>Introduction: The Challenge of Modernity</li>
                      <li>Historical Foundations of Social Thought</li>
                      <li>Economics and Human Flourishing</li>
                      <li>The Role of Institutions</li>
                      <li>Democracy and Its Discontents</li>
                      <li>Justice in Theory and Practice</li>
                      <li>Cultural Evolution and Social Change</li>
                      <li>Technology and Human Values</li>
                      <li>Looking Forward: Challenges and Opportunities</li>
                      <li>Conclusion: Toward a Better Future</li>
                    </ol>
                  </div>
                ),
              },
            ]}
          />
        </section>

        {/* Combined Example */}
        <section className="space-y-6">
          <h2 className={clsx(TYPOGRAPHY.h2, 'text-foreground border-b border-border pb-2')}>
            Complete Book Page Example
          </h2>
          <p className={clsx(TYPOGRAPHY.bodyBase, 'text-muted-foreground')}>
            All components working together in a realistic book detail page layout.
          </p>
          <div className="bg-white rounded-lg overflow-hidden shadow-lg">
            <div className="p-6">
              <BookDetails
                bookTitle="The Philosophy of Creative Destruction"
                bookAuthor={[
                  { name: 'Dr. Robert Williams', link: '/author/williams' },
                  { name: 'Prof. Jane Thompson', link: '/author/thompson' },
                ]}
                bookPublicationDate="11/15/2024"
                bookISBN="9780123456789"
                bookCoverSrc="/demo/covers/cover-3.jpg"
                lookInsideLink="/sample/philosophy-creative-destruction.pdf"
                buyHereLink={[
                  { format: 'Hardcover', price: '34.95', currency: '$', link: '/buy/hardcover' },
                  { format: 'Paperback', price: '19.95', currency: '$', link: '/buy/paperback' },
                  { format: 'eBook', price: '12.99', currency: '$', link: '/buy/ebook' },
                ]}
                buyElsewhereLinks={[
                  { label: 'Amazon', link: 'https://amazon.com' },
                  { label: 'Bookshop.org', link: 'https://bookshop.org' },
                ]}
              />
            </div>

            <div className="px-6 pb-6">
              <TabbedContent
                tabs={[
                  {
                    label: 'Overview',
                    content: (
                      <div className="space-y-6">
                        <BookForeword
                          quote="<em>A profound exploration of economic transformation</em>"
                          foreword="<p>This remarkable work examines how creative destruction shapes modern economies and societies. The authors bring together insights from economics, philosophy, and history to illuminate one of the most important yet misunderstood forces in contemporary life.</p><p>Through careful analysis and compelling examples, they demonstrate how innovation and disruption are not merely economic phenomena but fundamental aspects of human progress.</p>"
                        />
                      </div>
                    ),
                  },
                  {
                    label: 'Praise',
                    content: (
                      <div className="space-y-4">
                        <BookPraiseItem
                          text="Williams and Thompson have produced an instant classic. This book masterfully combines theoretical rigor with practical wisdom, offering insights that will benefit scholars, policymakers, and business leaders alike. Their analysis of creative destruction is both comprehensive and accessible, making complex economic concepts understandable without sacrificing depth."
                          author="— Prof. David Anderson, MIT Sloan School of Management"
                        />
                        <BookPraiseItem
                          text="A brilliant synthesis of economic theory and philosophical reflection. Essential reading for our times."
                          author="— The Economist"
                        />
                      </div>
                    ),
                  },
                ]}
              />
            </div>
          </div>
        </section>

        {/* Another Carousel */}
        <section className="space-y-6">
          <div className="-mx-4">
            <BooksCarouselBanner title="Related Titles" books={sampleBooks.reverse()} />
          </div>
        </section>
      </div>
    </div>
  )
}
