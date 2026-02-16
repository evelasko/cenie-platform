'use client'

import { useEffect } from 'react'
import { Button } from '@cenie/ui'
import { TYPOGRAPHY } from '@/lib/typography'
import { clsx } from 'clsx'
import { logger } from '@/lib/logger-client'

import './globals.css'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    logger.error('Global error', { error: error.message, digest: error.digest })
  }, [error])

  return (
    <html lang="es" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className={clsx(TYPOGRAPHY.display1, 'mb-4')}>Algo salió mal</h1>
            <p className={clsx(TYPOGRAPHY.bodyLarge, 'text-muted-foreground mb-8')}>
              Ha ocurrido un error grave. Puedes intentar de nuevo.
            </p>
            <Button onClick={() => reset()}>Intentar de nuevo</Button>
          </div>
        </div>
      </body>
    </html>
  )
}
