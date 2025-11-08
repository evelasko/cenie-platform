'use client'

import {
  useAnalytics,
  usePageTracking,
  useUserTracking,
  useErrorTracking,
} from '@cenie/firebase/analytics'
import { useEffect, useState } from 'react'
import { logger } from '../../../lib/logger-client'

export default function AnalyticsDemoPage() {
  const { logEvent, logPageView, logUserAction, isReady, appName } = useAnalytics()
  const { trackClick, trackFormSubmission, trackSearch } = useUserTracking()
  const { trackError } = useErrorTracking()
  const [eventCount, setEventCount] = useState(0)

  // Enable automatic page tracking
  usePageTracking(true, (pathname) => `Demo Page - ${pathname}`)

  useEffect(() => {
    if (isReady) {
      logger.debug('Analytics ready', { appName })
    }
  }, [isReady, appName])

  const handleCustomEvent = async () => {
    await logEvent('demo_button_clicked', {
      button_type: 'primary',
      event_count: eventCount + 1,
    })
    setEventCount((prev) => prev + 1)
  }

  const handlePageView = async () => {
    await logPageView('/demo-page', 'Analytics Demo Page')
  }

  const handleUserAction = async () => {
    await logUserAction('demo_action', 'user_interaction', 'demo_label', 1)
  }

  const handleClickTracking = () => {
    trackClick('demo-element', 'demo-button', {
      demo_parameter: 'test_value',
    })
  }

  const handleFormTracking = () => {
    trackFormSubmission('demo_form', Math.random() > 0.5, {
      form_field_count: 3,
    })
  }

  const handleSearchTracking = () => {
    trackSearch('analytics demo', 'demo_category', 5)
  }

  const handleErrorTracking = () => {
    trackError(new Error('Demo error for testing'), 'demo_context', 'low')
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Firebase Analytics Demo</h1>

      <div className="mb-4">
        <p className="text-lg mb-2">
          App Name: <strong>{appName}</strong>
        </p>
        <p className="text-lg mb-4">
          Analytics Ready: <strong>{isReady ? '✅' : '❌'}</strong>
        </p>
        <p className="text-lg mb-4">
          Events Logged: <strong>{eventCount}</strong>
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="p-4 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Basic Analytics</h2>
          <div className="space-y-2">
            <button
              onClick={handleCustomEvent}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Log Custom Event
            </button>
            <button
              onClick={handlePageView}
              className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Log Page View
            </button>
            <button
              onClick={handleUserAction}
              className="w-full px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
            >
              Log User Action
            </button>
          </div>
        </div>

        <div className="p-4 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Advanced Tracking</h2>
          <div className="space-y-2">
            <button
              onClick={handleClickTracking}
              className="w-full px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
            >
              Track Click Event
            </button>
            <button
              onClick={handleFormTracking}
              className="w-full px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              Track Form Submission
            </button>
            <button
              onClick={handleSearchTracking}
              className="w-full px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600"
            >
              Track Search Event
            </button>
            <button
              onClick={handleErrorTracking}
              className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Track Error Event
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Implementation Notes</h2>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>
            • All events automatically include the app_name dimension for Google Analytics filtering
          </li>
          <li>• Page tracking is enabled automatically via usePageTracking hook</li>
          <li>• Analytics is SSR-safe and only initializes on the client side</li>
          <li>• Debug logging is enabled in development mode</li>
          <li>• Events are logged to console in development for debugging</li>
        </ul>
      </div>
    </div>
  )
}
