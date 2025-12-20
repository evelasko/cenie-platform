import { checkAppAccess, getAuthenticatedUser } from '@cenie/auth-server/helpers'
import { hasRole } from '@cenie/auth-utils/roles'
import { BookOpen, Settings, Users } from 'lucide-react'
import { redirect } from 'next/navigation'

export default async function AdminPanelPage() {
  const user = await getAuthenticatedUser()
  const access = await checkAppAccess(user!.uid, 'academy')

  // Verify admin role
  if (!hasRole(access.role!, 'admin')) {
    redirect('/dashboard')
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
        <p className="text-gray-600">Academy system administration</p>
      </div>

      {/* Admin Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <AdminStatCard icon={Users} label="Total Users" value="0" />
        <AdminStatCard icon={BookOpen} label="Total Courses" value="0" />
        <AdminStatCard icon={Settings} label="Active Sessions" value="0" />
      </div>

      {/* Admin Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AdminSection
          title="User Management"
          description="Manage user accounts and permissions"
          icon={Users}
        />
        <AdminSection
          title="Course Administration"
          description="Oversee all Academy courses"
          icon={BookOpen}
        />
        <AdminSection
          title="System Settings"
          description="Configure Academy settings"
          icon={Settings}
        />
      </div>
    </div>
  )
}

function AdminStatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
}) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <Icon className="w-8 h-8 text-blue-600" />
        <span className="text-2xl font-bold">{value}</span>
      </div>
      <p className="text-sm font-medium text-gray-700">{label}</p>
    </div>
  )
}

function AdminSection({
  title,
  description,
  icon: Icon,
}: {
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
}) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold mb-1">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  )
}

