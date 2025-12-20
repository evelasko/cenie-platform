import { checkAppAccess, getAuthenticatedUser } from '@cenie/auth-server/helpers'
import { redirect } from 'next/navigation'

import { DashboardNav } from '@/components/dashboard/nav'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Get authenticated user (server component)
  const user = await getAuthenticatedUser()

  if (!user) {
    redirect('/sign-in')
  }

  // Check Academy access
  const access = await checkAppAccess(user.uid, 'academy')

  if (!access.hasAccess) {
    redirect('/sign-in')
  }

  return (
    <div className="flex h-screen">
      <DashboardNav
        userRole={access.role as 'student' | 'instructor' | 'admin'}
        userName={user.email || 'User'}
      />
      <main className="flex-1 overflow-y-auto bg-gray-50">{children}</main>
    </div>
  )
}

