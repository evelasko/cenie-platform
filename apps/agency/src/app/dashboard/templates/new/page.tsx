'use client'

import { Button } from '@cenie/ui'
import { createLogger } from '@cenie/logger'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const logger = createLogger({ name: 'agency:templates:new' })

export default function NewTemplatePage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    estimatedTime: '',
    complexity: 'medium',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // TODO: Implement template creation API call
      logger.info('Creating template', { formData })
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      logger.info('Template created successfully')
      router.push('/dashboard/templates')
    } catch (err) {
      logger.error('Failed to create template', { error: err })
      setError('Failed to create template. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="px-4 py-6 sm:px-0 max-w-3xl">
      {/* Back Button */}
      <Link
        href="/dashboard/templates"
        className="inline-flex items-center text-sky-400 hover:text-sky-300 mb-6 uppercase text-sm tracking-wide"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Templates
      </Link>

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white uppercase tracking-wide">
          Create New Template
        </h1>
        <p className="text-slate-400 mt-2">Design a new automation template for clients</p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-slate-800 border border-slate-700 rounded-lg p-6">
        <div className="space-y-6">
          {/* Template Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2 uppercase tracking-wide">
              Template Name
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-white placeholder-slate-400"
              placeholder="e.g., Email Automation Workflow"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-2 uppercase tracking-wide">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={4}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-white placeholder-slate-400"
              placeholder="Describe what this template does and how it helps clients..."
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-slate-300 mb-2 uppercase tracking-wide">
              Category
            </label>
            <input
              id="category"
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-white placeholder-slate-400"
              placeholder="e.g., Marketing, Sales, Operations"
            />
          </div>

          {/* Estimated Time */}
          <div>
            <label htmlFor="estimatedTime" className="block text-sm font-medium text-slate-300 mb-2 uppercase tracking-wide">
              Estimated Setup Time
            </label>
            <input
              id="estimatedTime"
              type="text"
              value={formData.estimatedTime}
              onChange={(e) => setFormData({ ...formData, estimatedTime: e.target.value })}
              required
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-white placeholder-slate-400"
              placeholder="e.g., 2-4 hours"
            />
          </div>

          {/* Complexity */}
          <div>
            <label htmlFor="complexity" className="block text-sm font-medium text-slate-300 mb-2 uppercase tracking-wide">
              Complexity Level
            </label>
            <select
              id="complexity"
              value={formData.complexity}
              onChange={(e) => setFormData({ ...formData, complexity: e.target.value })}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-white"
            >
              <option value="beginner">Beginner</option>
              <option value="medium">Medium</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>

        {/* Form Actions */}
        <div className="mt-8 flex justify-end space-x-4">
          <Link href="/dashboard/templates">
            <Button
              type="button"
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-700 uppercase tracking-wide"
            >
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={loading}
            className="bg-sky-600 hover:bg-sky-500 text-white uppercase tracking-wide"
          >
            {loading ? 'Creating...' : 'Create Template'}
          </Button>
        </div>
      </form>
    </div>
  )
}

