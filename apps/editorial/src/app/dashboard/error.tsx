'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@cenie/ui'
import { TYPOGRAPHY } from '@/lib/typography'
import { clsx } from 'clsx'
import { logger } from '@/lib/logger-client'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    logger.error('Dashboard segment error', { error: error.message, digest: error.digest })
  }, [error])

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className={clsx(TYPOGRAPHY.h2, 'mb-4')}>Error en el panel</h1>
        <p className={clsx(TYPOGRAPHY.bodyLarge, 'text-muted-foreground mb-8')}>
          Ha ocurrido un error al cargar esta sección. Puedes intentar de nuevo o volver al inicio del
          panel.
        </p>
        <div className="flex gap-4 justify-center">
          <Button onClick={() => reset()}>Intentar de nuevo</Button>
          <Link
            href="/dashboard"
            className={clsx(
              TYPOGRAPHY.button,
              'px-6 py-3 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors inline-flex items-center justify-center'
            )}
          >
            Volver al panel
          </Link>
        </div>
      </div>
    </div>
  )
}
