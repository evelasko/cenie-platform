import { clsx } from 'clsx'
import { TYPOGRAPHY } from '@/lib/typography'

export default function StatsPage() {
  return (
    <div className="space-y-6">
      <div className="bg-card rounded-none shadow-sm border border-border p-6">
        <h1 className={clsx(TYPOGRAPHY.h2, 'text-foreground mb-2')}>Statistics</h1>
        <p className={clsx(TYPOGRAPHY.bodyBase, 'text-muted-foreground')}>
          Editorial workflow statistics and insights.
        </p>
      </div>

      <div className="bg-card rounded-none shadow-sm border border-border p-12 text-center">
        <p className={clsx(TYPOGRAPHY.bodyBase, 'text-muted-foreground')}>
          Statistics dashboard coming soon...
        </p>
      </div>
    </div>
  )
}
