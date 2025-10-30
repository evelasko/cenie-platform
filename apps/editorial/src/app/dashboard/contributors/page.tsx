'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Loader2, AlertCircle, Plus, User, Search, Edit, Trash2 } from 'lucide-react'
import Button from '@/components/ui/Button'
import { clsx } from 'clsx'
import { TYPOGRAPHY } from '@/lib/typography'
import { useToast } from '@/components/ui/ToastContainer'
import { getContributorPhotoUrl } from '@/lib/twicpics'
import type { Contributor, ContributorRole } from '@/types/books'

const roleLabels: Record<ContributorRole, string> = {
  author: 'Author',
  translator: 'Translator',
  editor: 'Editor',
  illustrator: 'Illustrator',
  narrator: 'Narrator',
  other: 'Other',
}

export default function ContributorsListPage() {
  const toast = useToast()
  const [contributors, setContributors] = useState<Contributor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [roleFilter, setRoleFilter] = useState<ContributorRole | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    fetchContributors()
  }, [roleFilter, searchQuery])

  const fetchContributors = async () => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      if (roleFilter !== 'all') {
        params.set('role', roleFilter)
      }
      if (searchQuery) {
        params.set('search', searchQuery)
      }
      params.set('limit', '100')

      const response = await fetch(`/api/contributors?${params}`, {
        credentials: 'include',
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch contributors')
      }

      setContributors(data.contributors)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch contributors')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (
      !confirm(`Are you sure you want to delete "${name}"? This will deactivate the contributor.`)
    ) {
      return
    }

    setDeleting(id)

    try {
      const response = await fetch(`/api/contributors/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete contributor')
      }

      toast.success(`Contributor "${name}" deactivated`)
      fetchContributors()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete contributor')
    } finally {
      setDeleting(null)
    }
  }

  if (loading && contributors.length === 0) {
    return (
      <div className="bg-card rounded-none shadow-sm border border-border p-12 text-center">
        <Loader2 className="h-12 w-12 text-primary mx-auto mb-4 animate-spin" />
        <p className={clsx(TYPOGRAPHY.bodyBase, 'text-muted-foreground')}>
          Loading contributors...
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-destructive/10 border border-destructive/20 rounded-none p-4 flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
        <div>
          <h3 className={clsx(TYPOGRAPHY.h5, 'font-medium text-destructive')}>
            Error Loading Contributors
          </h3>
          <p className={clsx(TYPOGRAPHY.bodySmall, 'text-destructive/80 mt-1')}>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={clsx(TYPOGRAPHY.display1, 'text-foreground')}>Contributors</h1>
          <p className={clsx(TYPOGRAPHY.bodyBase, 'text-muted-foreground mt-1')}>
            Manage authors, translators, editors, and other contributors
          </p>
        </div>
        <Link href="/dashboard/contributors/new">
          <Button variant="primary" leadingIcon={Plus}>
            Add Contributor
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-none shadow-sm border border-border p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div>
            <label className={clsx(TYPOGRAPHY.bodySmall, 'block font-medium text-foreground mb-2')}>
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={clsx(
                  TYPOGRAPHY.bodyBase,
                  'w-full pl-10 pr-3 py-2 border border-border rounded-none focus:outline-none focus:ring-2 focus:ring-primary'
                )}
              />
            </div>
          </div>

          {/* Role Filter */}
          <div>
            <label className={clsx(TYPOGRAPHY.bodySmall, 'block font-medium text-foreground mb-2')}>
              Filter by Role
            </label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as ContributorRole | 'all')}
              className={clsx(
                TYPOGRAPHY.bodyBase,
                'w-full px-3 py-2 border border-border rounded-none focus:outline-none focus:ring-2 focus:ring-primary'
              )}
            >
              <option value="all">All Roles</option>
              <option value="author">Authors</option>
              <option value="translator">Translators</option>
              <option value="editor">Editors</option>
              <option value="illustrator">Illustrators</option>
              <option value="narrator">Narrators</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground')}>
          {contributors.length} contributor{contributors.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Contributors List */}
      {contributors.length === 0 ? (
        <div className="bg-card rounded-none shadow-sm border border-border p-12 text-center">
          <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <p className={clsx(TYPOGRAPHY.h4, 'text-foreground mb-2')}>No contributors found</p>
          <p className={clsx(TYPOGRAPHY.bodyBase, 'text-muted-foreground mb-4')}>
            {searchQuery || roleFilter !== 'all'
              ? 'Try adjusting your filters'
              : 'Get started by adding your first contributor'}
          </p>
          <Link href="/dashboard/contributors/new">
            <Button variant="primary" leadingIcon={Plus}>
              Add Contributor
            </Button>
          </Link>
        </div>
      ) : (
        <div className="bg-card rounded-none shadow-sm border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className={clsx(TYPOGRAPHY.bodySmall, 'text-left px-6 py-3 font-semibold')}>
                    Name
                  </th>
                  <th className={clsx(TYPOGRAPHY.bodySmall, 'text-left px-6 py-3 font-semibold')}>
                    Role
                  </th>
                  <th className={clsx(TYPOGRAPHY.bodySmall, 'text-left px-6 py-3 font-semibold')}>
                    Nationality
                  </th>
                  <th className={clsx(TYPOGRAPHY.bodySmall, 'text-left px-6 py-3 font-semibold')}>
                    Years
                  </th>
                  <th className={clsx(TYPOGRAPHY.bodySmall, 'text-right px-6 py-3 font-semibold')}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {contributors.map((contributor) => (
                  <tr
                    key={contributor.id}
                    className="border-b border-border hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {(() => {
                          const photoUrl = contributor.photo_twicpics_path
                            ? getContributorPhotoUrl(contributor.photo_twicpics_path, 200)
                            : contributor.photo_url
                          return photoUrl ? (
                            <img
                              src={photoUrl}
                              alt={contributor.full_name}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                              <User className="h-5 w-5 text-muted-foreground" />
                            </div>
                          )
                        })()}
                        <div>
                          <p className={clsx(TYPOGRAPHY.bodyBase, 'font-medium text-foreground')}>
                            {contributor.full_name}
                          </p>
                          <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground')}>
                            {contributor.slug}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={clsx(
                          TYPOGRAPHY.bodySmall,
                          'inline-flex items-center px-2 py-1 rounded-full bg-primary/10 text-primary'
                        )}
                      >
                        {roleLabels[contributor.primary_role]}
                      </span>
                    </td>
                    <td className={clsx(TYPOGRAPHY.bodyBase, 'px-6 py-4 text-foreground')}>
                      {contributor.nationality || '—'}
                    </td>
                    <td className={clsx(TYPOGRAPHY.bodyBase, 'px-6 py-4 text-foreground')}>
                      {contributor.birth_year || '—'}
                      {contributor.death_year && ` – ${contributor.death_year}`}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/dashboard/contributors/${contributor.id}`}>
                          <Button variant="outlined" size="sm" leadingIcon={Edit}>
                            Edit
                          </Button>
                        </Link>
                        <Button
                          variant="outlined"
                          size="sm"
                          leadingIcon={Trash2}
                          onClick={() => handleDelete(contributor.id, contributor.full_name)}
                          disabled={deleting === contributor.id}
                        >
                          {deleting === contributor.id ? 'Deleting...' : 'Delete'}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
