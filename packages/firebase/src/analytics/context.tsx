/* eslint-disable no-console */
'use client'

import { type Analytics } from 'firebase/analytics'
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

import { initializeAnalytics, getAppName, type AnalyticsEventParams } from '../analytics'

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
}

export function AnalyticsProvider({ children, enableDebug = false }: AnalyticsProviderProps) {
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const appName = getAppName()

  useEffect(() => {
    let mounted = true

    async function initialize() {
      try {
        const analyticsInstance = await initializeAnalytics()
        
        if (mounted) {
          setAnalytics(analyticsInstance)
          setIsInitialized(true)
          
          if (enableDebug || process.env.NODE_ENV === 'development') {
            console.log(`[Analytics] Initialized for app: ${appName}`, analyticsInstance ? '✅' : '❌')
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
  }, [appName, enableDebug])

  // Import analytics functions dynamically to ensure they use the initialized instance
  const contextValue: AnalyticsContextType = {
    analytics,
    appName,
    isInitialized,
    logEvent: async (eventName: string, eventParams?: AnalyticsEventParams) => {
      const { logEvent } = await import('../analytics')
      return logEvent(eventName, eventParams)
    },
    logPageView: async (pagePath: string, pageTitle?: string) => {
      const { logPageView } = await import('../analytics')
      return logPageView(pagePath, pageTitle)
    },
    logUserAction: async (action: string, category: string, label?: string, value?: number) => {
      const { logUserAction } = await import('../analytics')
      return logUserAction(action, category, label, value)
    },
    logError: async (error: Error | string, context?: string) => {
      const { logError } = await import('../analytics')
      return logError(error, context)
    },
  }

  return (
    <AnalyticsContext.Provider value={contextValue}>
      {children}
    </AnalyticsContext.Provider>
  )
}

export function useAnalyticsContext(): AnalyticsContextType {
  const context = useContext(AnalyticsContext)
  
  if (!context) {
    throw new Error('useAnalyticsContext must be used within an AnalyticsProvider')
  }
  
  return context
}