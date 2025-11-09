# TASK 2-4 & 2-5: Create Academy Dashboards (Combined)

**Phase**: 2 - Academy Authentication  
**Duration**: 2 days  
**Dependencies**: TASK_23 (Route protection working)  
**Deliverables**: Student and Instructor dashboards

---

## OBJECTIVE

Create role-specific dashboards for Academy students and instructors. These are the authenticated landing pages where users manage their courses and learning activities.

**What You're Building**: Production-ready dashboards with role-appropriate features.

**Why Combined**: Student and Instructor dashboards share layout patterns, navigation, and many components. Building together reduces duplication and ensures consistency.

---

## ARCHITECTURE CONTEXT

### Dashboard Access Patterns

**Student Dashboard** (`/dashboard`):

- Accessible to: students, instructors, admins
- Shows: Enrolled courses, progress, upcoming sessions
- Actions: View course content, track progress, submit assignments

**Instructor Dashboard** (`/dashboard/courses`):

- Accessible to: instructors, admins only
- Shows: Created courses, student enrollment, analytics
- Actions: Create courses, manage content, grade assignments

**Admin Dashboard** (`/dashboard/admin`):

- Accessible to: admins only
- Shows: All users, all courses, system stats
- Actions: Grant access, manage users, configure system

### Role-Based Navigation

**Navigation shows different links based on role**:

```typescript
// Student sees:
- My Courses
- Browse Catalog
- My Progress
- Profile

// Instructor sees (additionally):
- My Courses (student view)
- Manage Courses (instructor view)
- Student Management
- Analytics
- Profile

// Admin sees (additionally):
- All above
- User Management
- System Settings
```

---

## SOURCE FILES TO STUDY

**References**:

1. `apps/editorial/src/app/dashboard/` directory
   - Layout pattern for dashboards
   - Navigation sidebar
   - Role-based content display

2. `apps/hub/src/app/[locale]/dashboard/page.tsx`
   - User dashboard structure
   - Data fetching patterns

**Note**: Academy dashboards are new (not extracted), but use similar patterns.

---

## WHAT TO BUILD

### Directory Structure

```
apps/academy/src/app/
├── dashboard/
│   ├── layout.tsx (NEW - dashboard shell with navigation)
│   ├── page.tsx (UPDATE - student dashboard)
│   ├── courses/
│   │   ├── page.tsx (NEW - instructor course management)
│   │   ├── new/
│   │   │   └── page.tsx (NEW - create course form)
│   │   └── [courseId]/
│   │       └── page.tsx (NEW - course detail for instructor)
│   ├── students/
│   │   └── page.tsx (NEW - student management for instructor)
│   └── admin/
│       └── page.tsx (NEW - admin panel)
└── components/
    └── dashboard/
        ├── nav.tsx (NEW - dashboard navigation)
        ├── course-card.tsx (NEW - course display component)
        └── stats-card.tsx (NEW - statistics display)
```

---

## DETAILED REQUIREMENTS

### Component 1: Dashboard Navigation (`src/components/dashboard/nav.tsx`)

**Purpose**: Role-based sidebar navigation

```typescript
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogoAcademy } from '@cenie/ui/graphics'
import { Button } from '@cenie/ui'
import {
  BookOpen,
  BarChart,
  Users,
  Settings,
  User,
  GraduationCap,
  LayoutDashboard
} from 'lucide-react'

interface DashboardNavProps {
  userRole: 'student' | 'instructor' | 'admin'
  userName: string
}

export function DashboardNav({ userRole, userName }: DashboardNavProps) {
  const pathname = usePathname()

  const studentLinks = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'My Dashboard' },
    { href: '/dashboard/courses', icon: BookOpen, label: 'My Courses' },
    { href: '/dashboard/progress', icon: BarChart, label: 'My Progress' },
  ]

  const instructorLinks = [
    ...studentLinks,
    { href: '/dashboard/teach', icon: GraduationCap, label: 'Manage Courses' },
    { href: '/dashboard/students', icon: Users, label: 'Students' },
  ]

  const adminLinks = [
    ...instructorLinks,
    { href: '/dashboard/admin', icon: Settings, label: 'Admin Panel' },
  ]

  const links =
    userRole === 'admin' ? adminLinks :
    userRole === 'instructor' ? instructorLinks :
    studentLinks

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
            <p className="font-medium text-sm">{userName}</p>
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
                    ${isActive
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
        <form action="/api/auth/session" method="DELETE">
          <Button variant="outline" className="w-full" type="submit">
            Sign Out
          </Button>
        </form>
      </div>
    </nav>
  )
}
```

### Layout: Dashboard Shell (`src/app/dashboard/layout.tsx`)

**Purpose**: Common layout for all dashboard pages

```typescript
import { redirect } from 'next/navigation'
import { getAuthenticatedUser, checkAppAccess } from '@cenie/auth-server/helpers'
import { DashboardNav } from '@/components/dashboard/nav'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
      <main className="flex-1 overflow-y-auto bg-gray-50">
        {children}
      </main>
    </div>
  )
}
```

---

## TASK 2-4: STUDENT DASHBOARD

### Page: Student Dashboard (`src/app/dashboard/page.tsx`)

**Purpose**: Main dashboard for students

```typescript
import { getAuthenticatedUser, checkAppAccess } from '@cenie/auth-server/helpers'
import { redirect } from 'next/navigation'
import { BookOpen, Clock, TrendingUp, Award } from 'lucide-react'

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
        <StatCard
          icon={BookOpen}
          label="Enrolled Courses"
          value="0"
          color="blue"
        />
        <StatCard
          icon={Clock}
          label="Hours Learned"
          value="0"
          color="green"
        />
        <StatCard
          icon={TrendingUp}
          label="Progress"
          value="0%"
          color="purple"
        />
        <StatCard
          icon={Award}
          label="Certificates"
          value="0"
          color="yellow"
        />
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
  color
}: {
  icon: any
  label: string
  value: string
  color: string
}) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    yellow: 'bg-yellow-50 text-yellow-600',
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className={`w-12 h-12 rounded-lg ${colors[color]} flex items-center justify-center mb-4`}>
        <Icon className="w-6 h-6" />
      </div>
      <p className="text-2xl font-bold mb-1">{value}</p>
      <p className="text-sm text-gray-600">{label}</p>
    </div>
  )
}
```

---

## TASK 2-5: INSTRUCTOR DASHBOARD

### Page: Instructor Course Management (`src/app/dashboard/courses/page.tsx`)

**Purpose**: Instructor-only course management interface

**Protection**: Requires instructor role

```typescript
import { redirect } from 'next/navigation'
import { getAuthenticatedUser, checkAppAccess } from '@cenie/auth-server/helpers'
import { hasRole } from '@cenie/auth-utils/roles'
import { Button } from '@cenie/ui'
import Link from 'next/link'
import { Plus, BookOpen, Users, BarChart3 } from 'lucide-react'

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
        <StatCard
          icon={BookOpen}
          label="Active Courses"
          value="0"
          sublabel="courses"
        />
        <StatCard
          icon={Users}
          label="Total Students"
          value="0"
          sublabel="enrolled"
        />
        <StatCard
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

function StatCard({ icon: Icon, label, value, sublabel }: any) {
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
```

### Page: Create Course (`src/app/dashboard/courses/new/page.tsx`)

**Purpose**: Form for instructors to create new courses

```typescript
import { redirect } from 'next/navigation'
import { getAuthenticatedUser, checkAppAccess } from '@cenie/auth-server/helpers'
import { hasRole } from '@cenie/auth-utils/roles'
import { Button } from '@cenie/ui'

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
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Course Title
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Introduction to AI"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Course description..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration (weeks)
            </label>
            <input
              type="number"
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Level
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
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
          <Button type="button" variant="outline" onClick={() => history.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
```

**Note**: Course creation logic (database, etc.) is NOT part of auth tasks. This is just the UI shell - actual course functionality comes later.

---

## TESTING REQUIREMENTS

### Test 1: Student Dashboard Access

1. Sign in as student
2. Visit <http://localhost:3002/dashboard>
3. **Expected**:
   - Page loads
   - Shows student navigation (My Courses, Progress)
   - Does NOT show instructor links
   - Stats show 0 (no data yet)

### Test 2: Instructor Dashboard Access

1. Grant yourself instructor role:

   ```bash
   # In Firebase Console → Firestore
   # Find your user_app_access record
   # Change role from 'student' to 'instructor'
   ```

2. Sign out and sign in again (refresh token)
3. Visit <http://localhost:3002/dashboard>
4. **Expected**:
   - Shows instructor navigation (Manage Courses, Students)
   - Can access /dashboard/courses
   - Can access /dashboard/students

### Test 3: Role Protection on Instructor Pages

**As student**:

1. Sign in as student
2. Try to visit <http://localhost:3002/dashboard/courses>
3. **Expected**: Redirect to /dashboard (student dashboard)

**As instructor**:

1. Sign in as instructor
2. Visit <http://localhost:3002/dashboard/courses>
3. **Expected**: Instructor course management page loads

### Test 4: Navigation Rendering

**Check navigation shows appropriate links**:

- Student: Should see 3 links (Dashboard, Courses, Progress)
- Instructor: Should see 5 links (above + Manage Courses, Students)
- Admin: Should see 6 links (above + Admin Panel)

### Test 5: Responsive Design

**Test at different screen sizes**:

- Desktop (1920px): Sidebar + content side-by-side
- Tablet (768px): Should still work (may need mobile nav later)
- Mobile (375px): Consider collapsible sidebar (optional for now)

---

## SUCCESS CRITERIA

### Student Dashboard (TASK 2-4)

- [ ] `/dashboard` page created and working
- [ ] Shows student-appropriate content
- [ ] Stats cards displaying (with 0 values for now)
- [ ] Empty state for courses
- [ ] Accessible to students, instructors, admins
- [ ] Navigation shows student links

### Instructor Dashboard (TASK 2-5)

- [ ] `/dashboard/courses` page created
- [ ] Protected - requires instructor role
- [ ] Shows instructor course management
- [ ] Create course button present
- [ ] `/dashboard/courses/new` page created
- [ ] Form for course creation (UI only)
- [ ] `/dashboard/students` page created
- [ ] Student management interface (UI only)
- [ ] Navigation shows instructor links

### Shared Components

- [ ] DashboardNav component with role-based links
- [ ] Dashboard layout with sidebar + content
- [ ] Logout functionality working
- [ ] Role-based redirects working

### Technical

- [ ] TypeScript strict mode passing
- [ ] Linting clean
- [ ] Responsive design (desktop + tablet)
- [ ] No console errors

---

## COMMON PITFALLS

1. **Don't build course functionality**: This task is UI shells only - actual course management comes later

2. **Don't forget server components**: Dashboard layout should be Server Component for auth checks

3. **Don't skip role checks**: Always verify role before showing instructor content

4. **Don't hardcode user data**: Get from session via getAuthenticatedUser()

5. **Don't make navigation too complex**: Simple role-based links for now

---

## WHAT'S NOT IN SCOPE

**These are auth tasks, NOT course management tasks**:

- ❌ Actual course database/APIs
- ❌ Enrollment functionality
- ❌ Course content delivery
- ❌ Progress tracking
- ❌ Assignments/grading

**What IS in scope**:

- ✅ Dashboard UI shells
- ✅ Role-based navigation
- ✅ Access control enforcement
- ✅ Layout and structure

**Course features** will be added later (separate project, not part of auth consolidation).

---

## HANDOFF

When complete:

- [ ] Student dashboard functional
- [ ] Instructor dashboard functional
- [ ] Role-based navigation working
- [ ] All protection layers working

**This completes Phase 2!** Academy now has full authentication with role-based dashboards.

**Next Phase**: Phase 3 (Agency) follows identical pattern with different roles/branding.

---

**Estimated Time**: 8-12 hours (2 days for both dashboards)

**Note**: These are UI shells demonstrating role-based access. Focus on clean UX and proper protection rather than complete feature sets.
