import { checkAppAccess, getAuthenticatedUser } from '@cenie/auth-server/helpers'
import { hasRole } from '@cenie/auth-utils/roles'
import { Button } from '@cenie/ui'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function NewCoursePage() {
  const user = await getAuthenticatedUser()
  const access = await checkAppAccess(user!.uid, 'academy')

  if (!hasRole(access.role!, 'instructor')) {
    redirect('/dashboard')
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Create New Course</h1>

      <form className="bg-white rounded-lg shadow p-6 space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Course Title
          </label>
          <input
            id="title"
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Introduction to AI"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            id="description"
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Course description..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
              Duration (weeks)
            </label>
            <input
              id="duration"
              type="number"
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="8"
            />
          </div>

          <div>
            <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-2">
              Level
            </label>
            <select
              id="level"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </div>
        </div>

        <div className="flex gap-4">
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            Create Course
          </Button>
          <Link href="/dashboard/courses">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  )
}

