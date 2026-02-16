'use client'

import { useState } from 'react'

import { AnalyticsProvider } from '@cenie/firebase/analytics'
import { AuthProvider } from '@cenie/firebase/auth'

import { getConsentState } from '@/lib/consent'

export function Providers({ children }: { children: React.ReactNode }) {
  const [consentGranted] = useState(() => {
    if (typeof document === 'undefined') return false
    return getConsentState() === 'granted'
  })

  return (
    <AuthProvider>
      <AnalyticsProvider
        enableDebug={process.env.NODE_ENV === 'development'}
        consentGranted={consentGranted}
      >
        {children}
      </AnalyticsProvider>
    </AuthProvider>
  )
}
