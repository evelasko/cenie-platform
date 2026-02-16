import { clsx } from 'clsx'
import { TYPOGRAPHY } from '@/lib/typography'

export default function DashboardLoading() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto" />
        <p className={clsx(TYPOGRAPHY.bodyBase, 'mt-4 text-muted-foreground')}>Loading...</p>
      </div>
    </div>
  )
}
