'use client'

import { useAuth } from '@cenie/firebase/auth'
import { Button } from '@cenie/ui'
import { signOut } from 'firebase/auth'
import { getFirebaseAuth } from '@cenie/firebase/client'
import { useRouter } from 'next/navigation'

export function Navbar() {
  const { user, loading } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      const auth = getFirebaseAuth()
      await signOut(auth)
      router.push('/sign-in')
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  if (loading) {
    return (
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-gray-900">CENIE Editorial</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="animate-pulse bg-gray-300 h-8 w-20 rounded"></div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-gray-900">CENIE Editorial</h1>
          <span className="text-sm text-gray-500">Academic Publishing Platform</span>
        </div>
        
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <span className="text-sm text-gray-700">
                Welcome, {user.displayName || user.email}
              </span>
              <Button
                onClick={handleSignOut}
                variant="outline"
                size="sm"
              >
                Sign Out
              </Button>
            </>
          ) : (
            <div className="flex space-x-2">
              <Button
                onClick={() => router.push('/sign-in')}
                variant="outline"
                size="sm"
              >
                Sign In
              </Button>
              <Button
                onClick={() => router.push('/sign-up')}
                size="sm"
              >
                Sign Up
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}