'use client'

import { useAuthContext, signOut, getIdToken } from '@cenie/firebase/auth'
import Button from '@/components/ui/Button'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import { clsx } from 'clsx'
import { TYPOGRAPHY } from '@/lib/typography'
import { BookOpen, Search, Library, LogOut, Home, BarChart } from 'lucide-react'
import { ToastProvider } from '@/components/ui/ToastContainer'

interface NavItem {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

const navItems: NavItem[] = [
  { href: '/dashboard', label: 'Home', icon: Home },
  { href: '/dashboard/books', label: 'Books', icon: Library },
  { href: '/dashboard/books/search', label: 'Search Books', icon: Search },
  { href: '/dashboard/stats', label: 'Statistics', icon: BarChart },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuthContext()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/sign-in')
    }
  }, [user, loading, router])

  // Ensure session cookie exists for authenticated users
  useEffect(() => {
    async function ensureSession() {
      if (user) {
        try {
          console.log('📝 [Dashboard] User authenticated, ensuring session cookie exists...')
          const idToken = await getIdToken()
          
          if (!idToken) {
            console.error('❌ [Dashboard] Failed to get ID token')
            return
          }
          
          console.log('📝 [Dashboard] Got ID token, length:', idToken.length)
          
          // Try to create/refresh session cookie
          const response = await fetch('/api/auth/session', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idToken }),
          })

          if (response.ok) {
            console.log('✅ [Dashboard] Session cookie ensured')
          } else {
            const errorData = await response.json()
            console.error('❌ [Dashboard] Failed to create session cookie:', errorData)
          }
        } catch (error) {
          console.error('❌ [Dashboard] Error ensuring session:', error)
        }
      }
    }

    ensureSession()
  }, [user])

  const handleSignOut = async () => {
    try {
      // Clear server-side session cookie
      await fetch('/api/auth/session', {
        method: 'DELETE',
        credentials: 'include',
      })

      // Sign out from Firebase
      await signOut()

      router.push('/sign-in')
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className={clsx(TYPOGRAPHY.bodyBase, 'mt-4 text-muted-foreground')}>Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect
  }

  return (
    <ToastProvider>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-card shadow-sm border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-3">
                <BookOpen className="h-8 w-8 text-primary" />
                <div>
                  <h1 className={clsx(TYPOGRAPHY.h2, 'text-foreground')}>Editorial Dashboard</h1>
                  <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground')}>
                    CENIE Book Management
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className={clsx(TYPOGRAPHY.bodySmall, 'font-medium text-foreground')}>
                    {user.displayName || 'User'}
                  </p>
                  <p className={clsx(TYPOGRAPHY.caption, 'text-muted-foreground')}>{user.email}</p>
                </div>
                <Button onClick={handleSignOut} variant="outlined" size="sm" leadingIcon={LogOut}>
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-8">
            {/* Sidebar Navigation */}
            <aside className="w-64 shrink-0">
              <nav className="bg-card rounded-none shadow-sm border border-border overflow-hidden">
                <ul className="divide-y divide-border">
                  {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={clsx(
                            TYPOGRAPHY.bodyBase,
                            'flex items-center space-x-3 px-4 py-3 transition-colors',
                            isActive
                              ? 'bg-primary/10 text-primary font-medium'
                              : 'text-foreground hover:bg-muted hover:text-primary'
                          )}
                        >
                          <Icon
                            className={clsx(
                              'h-5 w-5',
                              isActive ? 'text-primary' : 'text-muted-foreground'
                            )}
                          />
                          <span>{item.label}</span>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </nav>

              {/* Quick Stats */}
              <div className="mt-6 bg-card rounded-none shadow-sm border border-border p-4">
                <h3 className={clsx(TYPOGRAPHY.h5, 'text-foreground mb-2')}>Quick Stats</h3>
                <div className={clsx(TYPOGRAPHY.bodySmall, 'space-y-2 text-muted-foreground')}>
                  <div className="flex justify-between">
                    <span>Total Books</span>
                    <span className="font-medium text-foreground">-</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Selected</span>
                    <span className="font-medium text-primary">-</span>
                  </div>
                  <div className="flex justify-between">
                    <span>In Translation</span>
                    <span className="font-medium text-secondary">-</span>
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0">{children}</main>
          </div>
        </div>
      </div>
    </ToastProvider>
  )
}
