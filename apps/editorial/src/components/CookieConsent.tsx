'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

import { Button } from '@cenie/ui'
import { cn } from '@cenie/ui/lib'

import { useConsent } from '@/hooks/useConsent'
import { TYPOGRAPHY } from '@/lib/typography'

/**
 * GDPR cookie-consent banner.
 *
 * - Appears at the bottom of the viewport on first visit (no stored preference).
 * - Does NOT block page interaction (fixed bar, no modal overlay).
 * - Slides in/out with a CSS transition.
 * - Accessible: `role="dialog"`, labeled, keyboard-navigable.
 */
export function CookieConsent() {
  const { hasBeenAsked, updateConsent } = useConsent()

  // Controls the CSS translate so the banner can animate out before unmounting.
  const [visible, setVisible] = useState(false)

  // Whether the component is in the DOM at all.
  const [mounted, setMounted] = useState(false)

  // Mount on client once we know consent hasn't been asked yet.
  useEffect(() => {
    if (hasBeenAsked) return

    setMounted(true)
    // Delay one frame so the translate transition triggers.
    const id = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(id)
  }, [hasBeenAsked])

  function dismiss(status: 'granted' | 'denied') {
    updateConsent(status)
    setVisible(false)
    // Wait for the slide-out transition before unmounting.
    setTimeout(() => setMounted(false), 300)
  }

  if (!mounted) return null

  return (
    <div
      role="dialog"
      aria-label="Consentimiento de cookies"
      className={cn(
        'fixed inset-x-0 bottom-0 z-50 transition-transform duration-300 ease-out',
        visible ? 'translate-y-0' : 'translate-y-full'
      )}
    >
      <div className="border-t border-border/40 bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/80">
        <div className="mx-auto flex max-w-5xl flex-col items-start gap-4 px-4 py-4 sm:flex-row sm:items-center sm:gap-6 sm:px-6">
          <p className={cn(TYPOGRAPHY.bodySmall, 'flex-1 text-muted-foreground')}>
            Utilizamos cookies para analizar el uso del sitio y mejorar tu experiencia.
            Puedes aceptar, rechazar o consultar nuestra{' '}
            <Link href="/privacidad" className={cn(TYPOGRAPHY.link, 'underline underline-offset-4')}>
              política de privacidad
            </Link>
            .
          </p>

          <div className="flex shrink-0 gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => dismiss('denied')}
            >
              Rechazar
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => dismiss('granted')}
            >
              Aceptar
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
