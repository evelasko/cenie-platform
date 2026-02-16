/* eslint-disable no-console */
'use client'

import { type Analytics } from 'firebase/analytics'
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

import {
  initializeAnalytics,
  setAnalyticsConsent,
  getAppName,
  type AnalyticsEventParams,
} from '../analytics-utils'

interface AnalyticsContextType {
  analytics: Analytics | null
  appName: string
  isInitialized: boolean
  logEvent: (eventName: string, eventParams?: AnalyticsEventParams) => Promise<void>
  logPageView: (pagePath: string, pageTitle?: string) => Promise<void>
  logUserAction: (action: string, category: string, label?: string, value?: number) => Promise<void>
  logError: (error: Error | string, context?: string) => Promise<void>
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined)

interface AnalyticsProviderProps {
  children: ReactNode
  enableDebug?: boolean
  /** Whether the user has granted analytics consent. Defaults to `false`. */
  consentGranted?: boolean
}

export function AnalyticsProvider({
  children,
  enableDebug = false,
  consentGranted = false,
}: AnalyticsProviderProps) {
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const appName = getAppName()

  useEffect(() => {
    let mounted = true

    async function initialize() {
      try {
        const analyticsInstance = await initializeAnalytics({ consentGranted })

        if (mounted) {
          setAnalytics(analyticsInstance)
          setIsInitialized(true)

          if (enableDebug || process.env.NODE_ENV === 'development') {
            console.log(
              `[Analytics] Initialized for app: ${appName}`,
              analyticsInstance ? '✅' : '❌',
              `(consent: ${consentGranted ? 'granted' : 'denied'})`
            )
          }
        }
      } catch (error) {
        console.error('Failed to initialize Analytics:', error)
        if (mounted) {
          setIsInitialized(true) // Mark as initialized even if failed
        }
      }
    }

    initialize().catch(console.error)

    return () => {
      mounted = false
    }
  }, [appName, enableDebug, consentGranted])

  // Update consent state live when user accepts/rejects after initial load
  useEffect(() => {
    if (isInitialized) {
      setAnalyticsConsent(consentGranted)
    }
  }, [consentGranted, isInitialized])

  // Import analytics functions dynamically to ensure they use the initialized instance
  const contextValue: AnalyticsContextType = {
    analytics,
    appName,
    isInitialized,
    logEvent: async (eventName: string, eventParams?: AnalyticsEventParams) => {
      const { logEvent } = await import('../analytics-utils')
      return logEvent(eventName, eventParams)
    },
    logPageView: async (pagePath: string, pageTitle?: string) => {
      const { logPageView } = await import('../analytics-utils')
      return logPageView(pagePath, pageTitle)
    },
    logUserAction: async (action: string, category: string, label?: string, value?: number) => {
      const { logUserAction } = await import('../analytics-utils')
      return logUserAction(action, category, label, value)
    },
    logError: async (error: Error | string, context?: string) => {
      const { logError } = await import('../analytics-utils')
      return logError(error, context)
    },
  }

  return <AnalyticsContext.Provider value={contextValue}>{children}</AnalyticsContext.Provider>
}

export function useAnalyticsContext(): AnalyticsContextType {
  const context = useContext(AnalyticsContext)

  if (!context) {
    throw new Error('useAnalyticsContext must be used within an AnalyticsProvider')
  }

  return context
}
