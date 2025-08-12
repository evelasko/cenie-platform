'use client'

import { useAuthContext } from '@cenie/firebase/auth'
import { signOut } from '@cenie/firebase/auth'
import { Button } from '@cenie/ui'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function DashboardPage() {
  const { user, loading } = useAuthContext()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/sign-in')
    }
  }, [user, loading, router])

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/sign-in')
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to signin
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-gray-900">
                Editorial Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">
                Welcome, {user.displayName || user.email}
              </span>
              <Button 
                onClick={handleSignOut}
                variant="outline"
                className="border-orange-300 text-orange-700 hover:bg-orange-50"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white overflow-hidden shadow-lg rounded-lg border border-orange-100">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Authentication Details
              </h2>
              
              <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    User ID
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 font-mono">
                    {user.uid}
                  </dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Email
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {user.email}
                  </dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Display Name
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {user.displayName || 'Not set'}
                  </dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Email Verified
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.emailVerified 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {user.emailVerified ? 'Verified' : 'Not Verified'}
                    </span>
                  </dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Provider
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {user.providerData?.[0]?.providerId || 'Unknown'}
                  </dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Last Sign In
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {user.metadata?.lastSignInTime 
                      ? new Date(user.metadata.lastSignInTime).toLocaleString() 
                      : 'Unknown'}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
          
          <div className="mt-6 bg-white overflow-hidden shadow-lg rounded-lg border border-orange-100">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Welcome to Editorial
              </h2>
              <div className="prose max-w-none">
                <p className="text-gray-600 mb-4">
                  📚 Welcome to the CENIE Editorial platform - your academic publishing workspace.
                </p>
                <p className="text-gray-600 mb-4">
                  Here you can manage manuscripts, coordinate peer reviews, and collaborate with 
                  authors and reviewers in the academic publishing process.
                </p>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mt-4">
                  <h3 className="text-sm font-medium text-orange-800 mb-2">Next Steps:</h3>
                  <ul className="text-sm text-orange-700 space-y-1">
                    <li>• Set up your editorial profile</li>
                    <li>• Review assigned manuscripts</li>
                    <li>• Manage peer review workflows</li>
                    <li>• Coordinate with editorial team</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}