'use client'

import { useEffect, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import { useAnalyticsContext } from './context'
import { AnalyticsEventParams } from '../analytics'

/**
 * Hook to access analytics functions
 * Provides access to all analytics logging functions
 */
export function useAnalytics() {
  const { logEvent, logPageView, logUserAction, logError, isInitialized, appName } = useAnalyticsContext()
  
  return {
    logEvent,
    logPageView,
    logUserAction,
    logError,
    isInitialized,
    appName,
    isReady: isInitialized,
  }
}

/**
 * Hook for automatic page view tracking
 * Automatically logs page views when the route changes
 * @param enabled - Whether to enable automatic page tracking (default: true)
 * @param customTitle - Function to generate custom page titles
 */
export function usePageTracking(
  enabled = true,
  customTitle?: (pathname: string) => string
) {
  const pathname = usePathname()
  const { logPageView, isInitialized } = useAnalyticsContext()

  useEffect(() => {
    if (!enabled || !isInitialized || !pathname) {
      return
    }

    const pageTitle = customTitle ? customTitle(pathname) : undefined
    
    // Small delay to ensure the page has fully loaded
    const timer = setTimeout(() => {
      logPageView(pathname, pageTitle)
    }, 100)

    return () => clearTimeout(timer)
  }, [pathname, enabled, customTitle, logPageView, isInitialized])

  return { pathname, isTracking: enabled && isInitialized }
}

/**
 * Hook for tracking user interactions
 * Returns a function to easily log user actions
 */
export function useUserTracking() {
  const { logUserAction, isInitialized } = useAnalyticsContext()

  const trackClick = useCallback((
    elementId: string,
    elementType = 'button',
    additionalParams?: AnalyticsEventParams
  ) => {
    if (!isInitialized) return

    logUserAction('click', 'engagement', `${elementType}:${elementId}`)
    
    if (additionalParams) {
      const { logEvent } = require('../analytics')
      logEvent('user_interaction', {
        interaction_type: 'click',
        element_id: elementId,
        element_type: elementType,
        ...additionalParams,
      })
    }
  }, [logUserAction, isInitialized])

  const trackFormSubmission = useCallback((
    formName: string,
    successful = true,
    additionalParams?: AnalyticsEventParams
  ) => {
    if (!isInitialized) return

    logUserAction(
      successful ? 'form_submit_success' : 'form_submit_error',
      'form',
      formName
    )

    if (additionalParams) {
      const { logEvent } = require('../analytics')
      logEvent('form_interaction', {
        form_name: formName,
        success: successful,
        ...additionalParams,
      })
    }
  }, [logUserAction, isInitialized])

  const trackSearch = useCallback((
    searchTerm: string,
    searchCategory?: string,
    resultCount?: number
  ) => {
    if (!isInitialized) return

    const { logEvent } = require('../analytics')
    logEvent('search', {
      search_term: searchTerm,
      search_category: searchCategory || 'general',
      result_count: resultCount,
    })
  }, [isInitialized])

  const trackDownload = useCallback((
    fileName: string,
    fileType?: string,
    fileSize?: number
  ) => {
    if (!isInitialized) return

    const { logEvent } = require('../analytics')
    logEvent('file_download', {
      file_name: fileName,
      file_type: fileType || 'unknown',
      file_size: fileSize,
    })
  }, [isInitialized])

  return {
    trackClick,
    trackFormSubmission,
    trackSearch,
    trackDownload,
    isReady: isInitialized,
  }
}

/**
 * Hook for error tracking
 * Provides functions to track different types of errors
 */
export function useErrorTracking() {
  const { logError, isInitialized } = useAnalyticsContext()

  const trackError = useCallback((
    error: Error | string,
    context = 'application',
    severity: 'low' | 'medium' | 'high' = 'medium'
  ) => {
    if (!isInitialized) return

    logError(error, context)
    
    // Also log with severity information
    const { logEvent } = require('../analytics')
    const errorMessage = typeof error === 'string' ? error : error.message
    
    logEvent('error_occurred', {
      error_message: errorMessage,
      error_context: context,
      error_severity: severity,
    })
  }, [logError, isInitialized])

  const trackApiError = useCallback((
    endpoint: string,
    statusCode: number,
    errorMessage: string
  ) => {
    if (!isInitialized) return

    const { logEvent } = require('../analytics')
    logEvent('api_error', {
      endpoint,
      status_code: statusCode,
      error_message: errorMessage,
    })
  }, [isInitialized])

  const trackValidationError = useCallback((
    formField: string,
    validationType: string,
    errorMessage: string
  ) => {
    if (!isInitialized) return

    const { logEvent } = require('../analytics')
    logEvent('validation_error', {
      form_field: formField,
      validation_type: validationType,
      error_message: errorMessage,
    })
  }, [isInitialized])

  return {
    trackError,
    trackApiError,
    trackValidationError,
    isReady: isInitialized,
  }
}

/**
 * Hook for performance tracking
 * Provides functions to track performance metrics
 */
export function usePerformanceTracking() {
  const { isInitialized } = useAnalyticsContext()

  const trackTiming = useCallback((
    name: string,
    value: number,
    category = 'performance'
  ) => {
    if (!isInitialized) return

    const { logEvent } = require('../analytics')
    logEvent('timing_complete', {
      name,
      value,
      event_category: category,
    })
  }, [isInitialized])

  const trackLoadTime = useCallback((
    resourceName: string,
    loadTime: number
  ) => {
    if (!isInitialized) return

    const { logEvent } = require('../analytics')
    logEvent('resource_timing', {
      resource_name: resourceName,
      load_time: loadTime,
    })
  }, [isInitialized])

  return {
    trackTiming,
    trackLoadTime,
    isReady: isInitialized,
  }
}