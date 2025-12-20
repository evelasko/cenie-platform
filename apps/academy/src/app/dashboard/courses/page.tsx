import { checkAppAccess, getAuthenticatedUser } from '@cenie/auth-server/helpers'
import { hasRole } from '@cenie/auth-utils/roles'
import { Button } from '@cenie/ui'
import { BarChart3, BookOpen, Plus, Users } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function InstructorCoursesPage() {
  const user = await getAuthenticatedUser()
  const access = await checkAppAccess(user!.uid, 'academy')

  // Verify instructor role
  if (!hasRole(access.role!, 'instructor')) {
    redirect('/dashboard') // Redirect students to student dashboard
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Manage Courses</h1>
          <p className="text-gray-600">Create and manage your courses</p>
        </div>

        <Link href="/dashboard/courses/new">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Create Course
          </Button>
        </Link>
      </div>

      {/* Instructor Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <InstructorStatCard
          icon={BookOpen}
          label="Active Courses"
          value="0"
          sublabel="courses"
        />
        <InstructorStatCard icon={Users} label="Total Students" value="0" sublabel="enrolled" />
        <InstructorStatCard
          icon={BarChart3}
          label="Avg Completion"
          value="0%"
          sublabel="rate"
        />
      </div>

      {/* Courses List */}
      <section className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Your Courses</h2>
        </div>

        <div className="p-6">
          <div className="text-center py-12 text-gray-500">
            <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="font-medium mb-2">No courses yet</p>
            <p className="text-sm mb-4">Create your first course to get started</p>
            <Link href="/dashboard/courses/new">
              <Button variant="outline">Create Course</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

function InstructorStatCard({
  icon: Icon,
  label,
  value,
  sublabel,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  sublabel: string
}) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <Icon className="w-8 h-8 text-blue-600" />
        <span className="text-2xl font-bold">{value}</span>
      </div>
      <p className="text-sm font-medium text-gray-700">{label}</p>
      <p className="text-xs text-gray-500">{sublabel}</p>
    </div>
  )
}

