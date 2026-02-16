'use client'

import { useCallback, useState } from 'react'

import { setAnalyticsConsent } from '@cenie/firebase/analytics'

import { getConsentState, setConsentState, type ConsentStatus } from '@/lib/consent'
import { logger } from '@/lib/logger-client'

/**
 * React hook for managing cookie-consent state.
 *
 * - Reads the persisted cookie on first render (SSR-safe).
 * - `updateConsent` writes the cookie **and** updates Firebase Consent
 *   Mode in a single call so the banner component stays simple.
 */
export function useConsent() {
  const [consent, setConsent] = useState<ConsentStatus | null>(() =>
    typeof document !== 'undefined' ? getConsentState() : null
  )

  const updateConsent = useCallback((status: ConsentStatus) => {
    setConsentState(status)
    setAnalyticsConsent(status === 'granted')
    setConsent(status)
    logger.info('Cookie consent updated', { status })
  }, [])

  const hasBeenAsked = consent !== null

  return { consent, updateConsent, hasBeenAsked } as const
}
