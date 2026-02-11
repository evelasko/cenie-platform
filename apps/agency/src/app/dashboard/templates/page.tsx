'use client'

import { useAuthContext } from '@cenie/firebase/auth'
import { createLogger } from '@cenie/logger'
import { useEffect, useState } from 'react'
import { FileText, Plus, TrendingUp, Users, Clock } from 'lucide-react'
import { Button } from '@cenie/ui'
import Link from 'next/link'

const logger = createLogger({ name: 'agency:dashboard:templates' })

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
  description 
}: { 
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
}) {
  return (
    <div className="text-center py-12">
      <Icon className="h-16 w-16 text-slate-600 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-slate-400 mb-6 max-w-sm mx-auto">{description}</p>
    </div>
  )
}

export default function ManagerTemplatesPage() {
  const { user } = useAuthContext()
  const [stats, _setStats] = useState({
    activeTemplates: 0,
    totalClients: 0,
    avgProjectValue: 0,
    templatesThisMonth: 0,
  })

  useEffect(() => {
    if (user) {
      logger.info('Manager templates page loaded', { userId: user.uid })
      // TODO: Fetch actual stats from API
    }
  }, [user])

  return (
    <div className="px-4 py-6 sm:px-0">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white uppercase tracking-wide">
            Manage Templates
          </h1>
          <p className="text-slate-400 mt-2">Create and manage automation templates</p>
        </div>
        <Link href="/dashboard/templates/new">
          <Button className="bg-sky-600 hover:bg-sky-500 text-white uppercase tracking-wide">
            <Plus className="h-5 w-5 mr-2" />
            Create Template
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatsCard
          icon={FileText}
          label="Active Templates"
          value={stats.activeTemplates}
          description="Published templates"
        />
        <StatsCard
          icon={Users}
          label="Total Clients"
          value={stats.totalClients}
          description="Using your templates"
        />
        <StatsCard
          icon={TrendingUp}
          label="Avg Project Value"
          value={`$${stats.avgProjectValue}`}
          description="Per template project"
        />
        <StatsCard
          icon={Clock}
          label="This Month"
          value={stats.templatesThisMonth}
          description="Templates created"
        />
      </div>

      {/* Templates List */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg">
        <div className="px-6 py-5 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white uppercase tracking-wide">Your Templates</h2>
          <p className="text-sm text-slate-400 mt-1">Manage and edit your automation templates</p>
        </div>
        <div className="p-6">
          <EmptyState
            icon={FileText}
            title="No templates yet"
            description="Create your first automation template to get started"
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8 bg-slate-800 border border-slate-700 rounded-lg">
        <div className="px-6 py-5 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white uppercase tracking-wide">Recent Activity</h2>
          <p className="text-sm text-slate-400 mt-1">Template usage and updates</p>
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

