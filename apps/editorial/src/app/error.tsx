'use client'

import { useEffect } from 'react'
import { Button } from '@cenie/ui'
import { TYPOGRAPHY } from '@/lib/typography'
import { clsx } from 'clsx'
import { logger } from '@/lib/logger-client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    logger.error('Route segment error', { error: error.message, digest: error.digest })
  }, [error])

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className={clsx(TYPOGRAPHY.display1, 'mb-4')}>Algo salió mal</h1>
        <p className={clsx(TYPOGRAPHY.bodyLarge, 'text-muted-foreground mb-8')}>
          Ha ocurrido un error. Puedes intentar de nuevo.
        </p>
        <Button onClick={() => reset()}>Intentar de nuevo</Button>
      </div>
    </div>
  )
}
