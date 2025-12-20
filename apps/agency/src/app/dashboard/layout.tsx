'use client'

import { useAuthContext } from '@cenie/firebase/auth'
import { createLogger } from '@cenie/logger'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { AGENCY_CONFIG } from '@/lib/constants'
import { DashboardNav } from '@/components/dashboard/nav'

const logger = createLogger({ name: 'agency:dashboard' })

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuthContext()
  const router = useRouter()
  const [role, setRole] = useState<string | null>(null)
  const [loadingRole, setLoadingRole] = useState(true)

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      logger.warn('Unauthenticated user redirected from dashboard')
      router.push('/sign-in')
    }
  }, [user, loading, router])

  // Fetch user role
  useEffect(() => {
    async function fetchRole() {
      if (!user) return

      try {
        const idToken = await user.getIdToken()
        const response = await fetch('/api/users/apps/agency/access', {
          headers: { Authorization: `Bearer ${idToken}` },
        })

        if (response.ok) {
          const data = await response.json()
          setRole(data.role || 'client')
          logger.debug('User role fetched', { role: data.role })
        } else {
          logger.warn('Failed to fetch user role')
          setRole('client')
        }
      } catch (error) {
        logger.error('Error fetching user role', { error })
        setRole('client')
      } finally {
        setLoadingRole(false)
      }
    }

    if (user) {
      fetchRole()
    }
  }, [user])

  // Loading state
  if (loading || loadingRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-sky-500 mx-auto"></div>
          <p className="mt-4 text-slate-300">Loading...</p>
        </div>
      </div>
    )
  }

  // Not authenticated
  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <DashboardNav user={user} role={role || 'client'} />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}

