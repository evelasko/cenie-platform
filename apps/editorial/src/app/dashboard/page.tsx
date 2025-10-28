import Link from 'next/link'
import { Search, Library } from 'lucide-react'
import { clsx } from 'clsx'
import { TYPOGRAPHY } from '@/lib/typography'

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-card rounded-none shadow-sm border border-border p-6">
        <h2 className={clsx(TYPOGRAPHY.h2, 'text-foreground mb-2')}>Welcome to CENIE Editorial</h2>
        <p className={clsx(TYPOGRAPHY.bodyBase, 'text-muted-foreground')}>
          Manage and curate performing arts books for translation from English to Spanish.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/dashboard/books/search"
          className="group bg-card rounded-none shadow-sm border border-border p-6 hover:shadow-md hover:border-primary transition-all"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-primary/10 rounded-none group-hover:bg-primary/20 transition-colors">
                  <Search className="h-6 w-6 text-primary" />
                </div>
                <h3 className={clsx(TYPOGRAPHY.h4, 'text-foreground')}>Search Books</h3>
              </div>
              <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground')}>
                Search Google Books API to find new titles for potential translation
              </p>
            </div>
          </div>
        </Link>

        <Link
          href="/dashboard/books"
          className="group bg-card rounded-none shadow-sm border border-border p-6 hover:shadow-md hover:border-secondary transition-all"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-secondary/10 rounded-none group-hover:bg-secondary/20 transition-colors">
                  <Library className="h-6 w-6 text-secondary" />
                </div>
                <h3 className={clsx(TYPOGRAPHY.h4, 'text-foreground')}>Manage Books</h3>
              </div>
              <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground')}>
                View and manage all books in the editorial workflow
              </p>
            </div>
          </div>
        </Link>
      </div>

      {/* Getting Started Guide */}
      <div className="bg-card rounded-none shadow-sm border border-border p-6">
        <h3 className={clsx(TYPOGRAPHY.h4, 'text-foreground mb-4')}>Getting Started</h3>
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold text-sm">
              1
            </div>
            <div>
              <h4 className={clsx(TYPOGRAPHY.h6, 'font-medium text-foreground')}>
                Search for Books
              </h4>
              <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground')}>
                Use the search tool to find performing arts books in English from Google Books
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold text-sm">
              2
            </div>
            <div>
              <h4 className={clsx(TYPOGRAPHY.h6, 'font-medium text-foreground')}>
                Add to Database
              </h4>
              <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground')}>
                Select books that are potentially relevant for translation
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold text-sm">
              3
            </div>
            <div>
              <h4 className={clsx(TYPOGRAPHY.h6, 'font-medium text-foreground')}>
                Review and Evaluate
              </h4>
              <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground')}>
                Assess books for marketability, relevance, and translation priority
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold text-sm">
              4
            </div>
            <div>
              <h4 className={clsx(TYPOGRAPHY.h6, 'font-medium text-foreground')}>
                Select for Translation
              </h4>
              <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground')}>
                Mark books as selected and move them through the translation workflow
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Workflow Status Overview */}
      <div className="bg-card rounded-none shadow-sm border border-border p-6">
        <h3 className={clsx(TYPOGRAPHY.h4, 'text-foreground mb-4')}>Editorial Workflow</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="text-center">
            <div className={clsx(TYPOGRAPHY.display2, 'text-muted-foreground')}>-</div>
            <div className={clsx(TYPOGRAPHY.caption, 'text-muted-foreground mt-1')}>Discovered</div>
          </div>
          <div className="text-center">
            <div className={clsx(TYPOGRAPHY.display2, 'text-secondary')}>-</div>
            <div className={clsx(TYPOGRAPHY.caption, 'text-muted-foreground mt-1')}>
              Under Review
            </div>
          </div>
          <div className="text-center">
            <div className={clsx(TYPOGRAPHY.display2, 'text-primary')}>-</div>
            <div className={clsx(TYPOGRAPHY.caption, 'text-muted-foreground mt-1')}>Selected</div>
          </div>
          <div className="text-center">
            <div className={clsx(TYPOGRAPHY.display2, 'text-secondary')}>-</div>
            <div className={clsx(TYPOGRAPHY.caption, 'text-muted-foreground mt-1')}>
              In Translation
            </div>
          </div>
          <div className="text-center">
            <div className={clsx(TYPOGRAPHY.display2, 'text-primary')}>-</div>
            <div className={clsx(TYPOGRAPHY.caption, 'text-muted-foreground mt-1')}>Published</div>
          </div>
          <div className="text-center">
            <div className={clsx(TYPOGRAPHY.display2, 'text-destructive')}>-</div>
            <div className={clsx(TYPOGRAPHY.caption, 'text-muted-foreground mt-1')}>Rejected</div>
          </div>
        </div>
      </div>
    </div>
  )
}
