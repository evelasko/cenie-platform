'use client'

import { getFirebaseConfig } from '@cenie/firebase/client'
import { useState } from 'react'

export default function TestFirebasePage() {
  const [config, setConfig] = useState<ReturnType<typeof getFirebaseConfig> | null>(null)
  const [error, setError] = useState<string | null>(null)

  const testFirebaseConfig = () => {
    try {
      const firebaseConfig = getFirebaseConfig()
      setConfig(firebaseConfig)
      setError(null)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      setConfig(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Firebase Configuration Test</h1>

          <button
            onClick={testFirebaseConfig}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
          >
            Test Firebase Config
          </button>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded p-4 mb-4">
              <h3 className="text-red-800 font-medium">Configuration Error:</h3>
              <p className="text-red-600 text-sm mt-1">{error}</p>
            </div>
          )}

          {config && (
            <div className="bg-green-50 border border-green-200 rounded p-4">
              <h3 className="text-green-800 font-medium mb-2">Firebase Configuration:</h3>
              <pre className="text-sm text-gray-700 bg-gray-100 p-3 rounded overflow-x-auto">
                {JSON.stringify(config, null, 2)}
              </pre>
            </div>
          )}

          <div className="mt-6 text-sm text-gray-600">
            <p>
              This page tests if your Firebase environment variables are properly configured. Click
              the button above to test the configuration.
            </p>
            <p className="mt-2">Expected environment variables:</p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>NEXT_PUBLIC_FIREBASE_API_KEY or FIREBASE_API_KEY</li>
              <li>NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN or FIREBASE_AUTH_DOMAIN</li>
              <li>NEXT_PUBLIC_FIREBASE_PROJECT_ID or FIREBASE_PROJECT_ID</li>
              <li>NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET or FIREBASE_STORAGE_BUCKET</li>
              <li>NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID or FIREBASE_MESSAGING_SENDER_ID</li>
              <li>NEXT_PUBLIC_FIREBASE_APP_ID or FIREBASE_APP_ID</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
