import { checkAppAccess, getAuthenticatedUser } from '@cenie/auth-server/helpers'
import { hasRole } from '@cenie/auth-utils/roles'
import { Search, Users } from 'lucide-react'
import { redirect } from 'next/navigation'

export default async function StudentsManagementPage() {
  const user = await getAuthenticatedUser()
  const access = await checkAppAccess(user!.uid, 'academy')

  // Verify instructor role
  if (!hasRole(access.role!, 'instructor')) {
    redirect('/dashboard')
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Student Management</h1>
        <p className="text-gray-600">View and manage your students</p>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search students by name or email..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Students List */}
      <section className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Your Students</h2>
        </div>

        <div className="p-6">
          <div className="text-center py-12 text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="font-medium mb-2">No students yet</p>
            <p className="text-sm">Students will appear here when they enroll in your courses</p>
          </div>
        </div>
      </section>
    </div>
  )
}

