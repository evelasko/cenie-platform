import {
  getAnalytics,
  type Analytics,
  logEvent as firebaseLogEvent,
  isSupported,
  setConsent as firebaseSetConsent,
} from 'firebase/analytics'

import { initializeFirebase } from './client'
import { type AnalyticsEventParams, type CustomEventParams } from './types'

// Re-export types for easier importing
export type { AnalyticsEventParams, CustomEventParams }

let analytics: Analytics | undefined

/**
 * Check if code is running on the client side
 */
function isClient(): boolean {
  try {
    return typeof globalThis !== 'undefined' && typeof globalThis.window !== 'undefined'
  } catch {
    return false
  }
}

/**
 * Set Firebase Analytics consent state (Consent Mode v2).
 *
 * Call this before `getAnalytics()` on first init to ensure no tracking
 * cookies are written when consent has not been granted.  Can also be
 * called later to update consent (e.g. after the user accepts/rejects).
 *
 * @param granted - `true` to grant all analytics consent types,
 *                  `false` to deny them.
 */
export function setAnalyticsConsent(granted: boolean): void {
  const status = granted ? 'granted' : 'denied'
  firebaseSetConsent({
    analytics_storage: status,
    ad_storage: status,
    ad_user_data: status,
    ad_personalization: status,
  })
}

export interface InitializeAnalyticsOptions {
  /** Whether the user has granted analytics consent. Defaults to `false` (denied). */
  consentGranted?: boolean
}

/**
 * Initialize Firebase Analytics with app context.
 * SSR-safe - only initializes on client side.
 *
 * When `options.consentGranted` is omitted or `false`, Firebase Consent
 * Mode is set to "denied" **before** `getAnalytics()` is called, so no
 * tracking cookies are created until consent is explicitly granted.
 */
export async function initializeAnalytics(
  options?: InitializeAnalyticsOptions
): Promise<Analytics | null> {
  // Only initialize on client side
  if (!isClient()) {
    return null
  }

  // Check if analytics is supported
  const supported = await isSupported()
  if (!supported) {
    console.warn('Firebase Analytics is not supported in this environment')
    return null
  }

  if (!analytics) {
    try {
      const app = initializeFirebase()
      setAnalyticsConsent(options?.consentGranted ?? false)
      analytics = getAnalytics(app)
    } catch (error) {
      console.error('Failed to initialize Firebase Analytics:', error)
      return null
    }
  }
  
  return analytics
}

/**
 * Get the current app name from environment variables
 */
export function getAppName(): string {
  return process.env.NEXT_PUBLIC_APP_NAME || 'unknown-app'
}

/**
 * Custom logEvent that automatically adds app context
 * @param eventName - The name of the event
 * @param eventParams - Additional parameters for the event
 */
export async function logEvent(
  eventName: string, 
  eventParams: AnalyticsEventParams = {}
): Promise<void> {
  try {
    const analyticsInstance = await initializeAnalytics()
    
    if (!analyticsInstance) {
      // Fallback for server-side or unsupported environments
      console.warn('[Analytics]', eventName, { ...eventParams, app_name: getAppName() })
      return
    }

    const customParams: CustomEventParams = {
      ...eventParams,
      app_name: getAppName(),
    }

    firebaseLogEvent(analyticsInstance, eventName, customParams)
    
    // Debug logging in development
    if (process.env.NODE_ENV === 'development') {
      console.warn('[Analytics]', eventName, customParams)
    }
  } catch (error) {
    console.error('Error logging analytics event:', error)
  }
}

/**
 * Log a page view event with automatic app context
 * @param pagePath - The page path being viewed
 * @param pageTitle - Optional page title
 */
export async function logPageView(pagePath: string, pageTitle?: string): Promise<void> {
  await logEvent('page_view', {
    page_path: pagePath,
    page_title: pageTitle || pagePath,
  })
}

/**
 * Log a user action event with automatic app context
 * @param action - The action performed
 * @param category - The category of the action
 * @param label - Optional label for the action
 * @param value - Optional numeric value
 */
export async function logUserAction(
  action: string,
  category: string,
  label?: string,
  value?: number
): Promise<void> {
  const params: AnalyticsEventParams = {
    event_category: category,
    event_label: label || '',
  }
  
  if (value !== undefined) {
    params.value = value
  }

  await logEvent(action, params)
}

/**
 * Log an error event with automatic app context
 * @param error - The error object or message
 * @param context - Optional context where the error occurred
 */
export async function logError(
  error: Error | string,
  context?: string
): Promise<void> {
  const errorMessage = typeof error === 'string' ? error : error.message
  const errorStack = typeof error === 'string' ? '' : error.stack || ''
  
  await logEvent('exception', {
    description: errorMessage,
    fatal: false,
    context: context || 'unknown',
    error_stack: errorStack,
  })
}

/**
 * Get the Analytics instance (for advanced usage)
 * Returns null on server side or if not supported
 */
export async function getAnalyticsInstance(): Promise<Analytics | null> {
  return await initializeAnalytics()
}