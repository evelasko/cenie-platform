import { checkAppAccess, getAuthenticatedUser } from '@cenie/auth-server/helpers'
import { Award, BarChart, BookOpen, Clock } from 'lucide-react'

export default async function StudentDashboardPage() {
  const user = await getAuthenticatedUser()
  const access = await checkAppAccess(user!.uid, 'academy')

  // Role check (this page accessible to all roles)
  const role = access.role

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-2">
        Welcome back{user!.email ? `, ${user!.email.split('@')[0]}` : ''}!
      </h1>
      <p className="text-gray-600 mb-8">
        {role === 'student' && 'Continue your learning journey'}
        {role === 'instructor' && 'Your teaching dashboard'}
        {role === 'admin' && 'Academy administration'}
      </p>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard icon={BookOpen} label="Enrolled Courses" value="0" color="blue" />
        <StatCard icon={Clock} label="Hours Learned" value="0" color="green" />
        <StatCard icon={BarChart} label="Progress" value="0%" color="purple" />
        <StatCard icon={Award} label="Certificates" value="0" color="yellow" />
      </div>

      {/* Enrolled Courses Section */}
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">My Courses</h2>

        <div className="text-center py-12 text-gray-500">
          <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p>No courses enrolled yet</p>
          <p className="text-sm mt-2">Browse the catalog to get started</p>
        </div>
      </section>
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  color: string
}) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    yellow: 'bg-yellow-50 text-yellow-600',
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div
        className={`w-12 h-12 rounded-lg ${colors[color]} flex items-center justify-center mb-4`}
      >
        <Icon className="w-6 h-6" />
      </div>
      <p className="text-2xl font-bold mb-1">{value}</p>
      <p className="text-sm text-gray-600">{label}</p>
    </div>
  )
}
