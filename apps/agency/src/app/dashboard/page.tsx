'use client'

import { useAuthContext } from '@cenie/firebase/auth'
import { createLogger } from '@cenie/logger'
import { useEffect, useState } from 'react'
import { Briefcase, FileText, Zap, DollarSign } from 'lucide-react'

const logger = createLogger({ name: 'agency:dashboard:client' })

interface StatsCardProps {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string | number
  description?: string
}

function StatsCard({ icon: Icon, label, value, description }: StatsCardProps) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-sky-500 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <Icon className="h-8 w-8 text-sky-500" />
      </div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm font-medium text-slate-300 uppercase tracking-wide">{label}</div>
      {description && <div className="text-xs text-slate-400 mt-2">{description}</div>}
    </div>
  )
}

function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  action 
}: { 
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  action?: { label: string; href: string }
}) {
  return (
    <div className="text-center py-12">
      <Icon className="h-16 w-16 text-slate-600 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-slate-400 mb-6 max-w-sm mx-auto">{description}</p>
      {action && (
        <a
          href={action.href}
          className="inline-block bg-sky-600 hover:bg-sky-500 text-white px-6 py-2 rounded-md font-medium uppercase tracking-wide transition-colors"
        >
          {action.label}
        </a>
      )}
    </div>
  )
}

export default function ClientDashboard() {
  const { user } = useAuthContext()
  const [stats, setStats] = useState({
    activeProjects: 0,
    templatesUsed: 0,
    automationsRunning: 0,
    monthlySavings: 0,
  })

  useEffect(() => {
    if (user) {
      logger.info('Client dashboard loaded', { userId: user.uid })
      // TODO: Fetch actual stats from API
    }
  }, [user])

  return (
    <div className="px-4 py-6 sm:px-0">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatsCard
          icon={Briefcase}
          label="Active Projects"
          value={stats.activeProjects}
          description="Projects in progress"
        />
        <StatsCard
          icon={FileText}
          label="Templates Used"
          value={stats.templatesUsed}
          description="Automation templates"
        />
        <StatsCard
          icon={Zap}
          label="Automations Running"
          value={stats.automationsRunning}
          description="Active workflows"
        />
        <StatsCard
          icon={DollarSign}
          label="Monthly Savings"
          value={`$${stats.monthlySavings}`}
          description="Time & cost saved"
        />
      </div>

      {/* Main Content */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg">
        <div className="px-6 py-5 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white uppercase tracking-wide">My Projects</h2>
          <p className="text-sm text-slate-400 mt-1">Manage your automation projects</p>
        </div>
        <div className="p-6">
          <EmptyState
            icon={Briefcase}
            title="No projects yet"
            description="Browse templates to start your first automation project"
            action={{ label: 'Browse Templates', href: '/templates' }}
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8 bg-slate-800 border border-slate-700 rounded-lg">
        <div className="px-6 py-5 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white uppercase tracking-wide">Recent Activity</h2>
          <p className="text-sm text-slate-400 mt-1">Your latest actions and updates</p>
        </div>
        <div className="p-6">
          <div className="text-center py-8 text-slate-400">
            No recent activity to display
          </div>
        </div>
      </div>
    </div>
  )
}
