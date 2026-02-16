'use client'

/**
 * Analytics abstraction layer for the Editorial app.
 *
 * Re-exports Firebase Analytics hooks from @cenie/firebase/analytics
 * so that Editorial components import from `@/lib/analytics` rather
 * than reaching into the package directly. This keeps the door open
 * for swapping or layering providers later without touching every
 * consumer.
 */

export {
  useAnalytics,
  usePageTracking,
  useUserTracking,
  useErrorTracking,
  usePerformanceTracking,
} from '@cenie/firebase/analytics'
