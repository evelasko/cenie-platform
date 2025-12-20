'use client'

import { Button, LogoAcademy } from '@cenie/ui'
import {
  BarChart,
  BookOpen,
  GraduationCap,
  LayoutDashboard,
  Settings,
  User,
  Users,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

interface DashboardNavProps {
  userRole: 'student' | 'instructor' | 'admin'
  userName: string
}

export function DashboardNav({ userRole, userName }: DashboardNavProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/session', {
        method: 'DELETE',
      })
      router.push('/sign-in')
    } catch (error) {
      console.error('Sign out failed:', error)
    }
  }

  const studentLinks = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'My Dashboard' },
    { href: '/dashboard/my-courses', icon: BookOpen, label: 'My Courses' },
    { href: '/dashboard/progress', icon: BarChart, label: 'My Progress' },
  ]

  const instructorLinks = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/dashboard/courses', icon: GraduationCap, label: 'Manage Courses' },
    { href: '/dashboard/students', icon: Users, label: 'Students' },
    { href: '/dashboard/my-courses', icon: BookOpen, label: 'My Learning' },
  ]

  const adminLinks = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/dashboard/courses', icon: GraduationCap, label: 'Manage Courses' },
    { href: '/dashboard/students', icon: Users, label: 'Students' },
    { href: '/dashboard/admin', icon: Settings, label: 'Admin Panel' },
  ]

  const links =
    userRole === 'admin' ? adminLinks : userRole === 'instructor' ? instructorLinks : studentLinks

  return (
    <nav className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <LogoAcademy className="h-8 w-auto" />
      </div>

      {/* User info */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <User className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="font-medium text-sm truncate">{userName}</p>
            <p className="text-xs text-gray-500 capitalize">{userRole}</p>
          </div>
        </div>
      </div>

      {/* Navigation links */}
      <div className="flex-1 p-4">
        <ul className="space-y-2">
          {links.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href

            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`
                    flex items-center gap-3 px-4 py-2 rounded-lg transition-colors
                    ${
                      isActive
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{link.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200">
        <Button variant="outline" className="w-full" onClick={handleSignOut}>
          Sign Out
        </Button>
      </div>
    </nav>
  )
}

