'use client'

import { Button } from '@cenie/ui'
import { LogoAgency } from '@cenie/ui/graphics'
import { createLogger } from '@cenie/logger'
import { getFirebaseAuth } from '@cenie/firebase/client'
import { signOut } from 'firebase/auth'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import type { User } from 'firebase/auth'

const logger = createLogger({ name: 'agency:nav' })

interface DashboardNavProps {
  user: User
  role: string
}

export function DashboardNav({ user, role }: DashboardNavProps) {
  const router = useRouter()
  const pathname = usePathname()

  const handleSignOut = async () => {
    try {
      // Clear session cookie
      await fetch('/api/auth/session', { method: 'DELETE' })

      // Sign out from Firebase
      const auth = getFirebaseAuth()
      await signOut(auth)

      logger.info('User signed out successfully')
      router.push('/sign-in')
    } catch (error) {
      logger.error('Sign out error', { error })
    }
  }

  // Define navigation links based on role
  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', roles: ['client', 'manager', 'admin'] },
    { href: '/projects', label: 'My Projects', roles: ['client', 'manager', 'admin'] },
    { href: '/templates', label: 'Browse Templates', roles: ['client', 'manager', 'admin'] },
    { href: '/dashboard/templates', label: 'Manage Templates', roles: ['manager', 'admin'] },
    { href: '/dashboard/clients', label: 'Clients', roles: ['manager', 'admin'] },
    { href: '/dashboard/admin', label: 'Admin', roles: ['admin'] },
  ]

  const visibleLinks = navLinks.filter((link) => link.roles.includes(role))

  return (
    <header className="bg-slate-800 border-b border-slate-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <LogoAgency className="h-10 w-auto" />
            </Link>
            <div className="hidden md:flex items-center space-x-1">
              {visibleLinks.map((link) => {
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium uppercase tracking-wide transition-colors ${
                      isActive
                        ? 'bg-slate-700 text-white'
                        : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* User Info and Actions */}
          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-medium text-white">
                {user.displayName || user.email}
              </div>
              <div className="text-xs text-slate-400 uppercase">
                {role}
              </div>
            </div>
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white uppercase text-xs tracking-wide"
            >
              Sign Out
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pb-4">
          <div className="flex flex-wrap gap-2">
            {visibleLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1 rounded-md text-xs font-medium uppercase tracking-wide ${
                    isActive
                      ? 'bg-slate-700 text-white'
                      : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </header>
  )
}

