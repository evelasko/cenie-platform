'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Loader2, AlertCircle, Plus, BookOpen, Eye, Edit, BookMarked } from 'lucide-react'
import Button from '@/components/ui/Button'
import { clsx } from 'clsx'
import { TYPOGRAPHY } from '@/lib/typography'
import { useToast } from '@/components/ui/ToastContainer'
import type { CatalogVolume, VolumeType, PublicationStatus } from '@/types/books'

const statusLabels: Record<PublicationStatus, string> = {
  draft: 'Draft',
  published: 'Published',
  archived: 'Archived',
}

const typeLabels: Record<VolumeType, string> = {
  translated: 'Translated',
  original: 'Original',
  adapted: 'Adapted',
}

export default function CatalogManagementPage() {
  const toast = useToast()
  const [volumes, setVolumes] = useState<CatalogVolume[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<PublicationStatus | 'all'>('all')
  const [typeFilter, setTypeFilter] = useState<VolumeType | 'all'>('all')

  useEffect(() => {
    fetchVolumes()
  }, [statusFilter, typeFilter])

  const fetchVolumes = async () => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      if (statusFilter !== 'all') {
        params.set('status', statusFilter)
      }
      if (typeFilter !== 'all') {
        params.set('type', typeFilter)
      }
      params.set('limit', '100')

      const response = await fetch(`/api/catalog?${params}`, {
        credentials: 'include',
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch catalog volumes')
      }

      setVolumes(data.volumes)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch catalog volumes')
    } finally {
      setLoading(false)
    }
  }

  const handlePublish = async (id: string, title: string) => {
    if (!confirm(`Publish "${title}" to the public catalog?`)) {
      return
    }

    try {
      const response = await fetch(`/api/catalog/${id}/publish`, {
        method: 'POST',
        credentials: 'include',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to publish volume')
      }

      toast.success(`"${title}" published successfully!`)
      fetchVolumes()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to publish volume')
    }
  }

  if (loading && volumes.length === 0) {
    return (
      <div className="bg-card rounded-none shadow-sm border border-border p-12 text-center">
        <Loader2 className="h-12 w-12 text-primary mx-auto mb-4 animate-spin" />
        <p className={clsx(TYPOGRAPHY.bodyBase, 'text-muted-foreground')}>
          Loading catalog volumes...
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
            Error Loading Catalog
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
          <h1 className={clsx(TYPOGRAPHY.display1, 'text-foreground')}>Catalog Management</h1>
          <p className={clsx(TYPOGRAPHY.bodyBase, 'text-muted-foreground mt-1')}>
            Manage published volumes and drafts
          </p>
        </div>
        <Link href="/dashboard/catalog/new">
          <Button variant="primary" leadingIcon={Plus}>
            Create Original Publication
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-none shadow-sm border border-border p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Status Filter */}
          <div>
            <label className={clsx(TYPOGRAPHY.bodySmall, 'block font-medium text-foreground mb-2')}>
              Publication Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as PublicationStatus | 'all')}
              className={clsx(
                TYPOGRAPHY.bodyBase,
                'w-full px-3 py-2 border border-border rounded-none focus:outline-none focus:ring-2 focus:ring-primary'
              )}
            >
              <option value="all">All Statuses</option>
              <option value="draft">Drafts</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <label className={clsx(TYPOGRAPHY.bodySmall, 'block font-medium text-foreground mb-2')}>
              Volume Type
            </label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as VolumeType | 'all')}
              className={clsx(
                TYPOGRAPHY.bodyBase,
                'w-full px-3 py-2 border border-border rounded-none focus:outline-none focus:ring-2 focus:ring-primary'
              )}
            >
              <option value="all">All Types</option>
              <option value="translated">Translated</option>
              <option value="original">Original</option>
              <option value="adapted">Adapted</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground')}>
          {volumes.length} volume{volumes.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Volumes List */}
      {volumes.length === 0 ? (
        <div className="bg-card rounded-none shadow-sm border border-border p-12 text-center">
          <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <p className={clsx(TYPOGRAPHY.h4, 'text-foreground mb-2')}>No volumes found</p>
          <p className={clsx(TYPOGRAPHY.bodyBase, 'text-muted-foreground mb-4')}>
            {statusFilter !== 'all' || typeFilter !== 'all'
              ? 'Try adjusting your filters'
              : 'Promote books from the workspace or create an original publication'}
          </p>
          <div className="flex gap-2 justify-center">
            <Link href="/dashboard/books">
              <Button variant="outlined">Go to Books Workspace</Button>
            </Link>
            <Link href="/dashboard/catalog/new">
              <Button variant="primary" leadingIcon={Plus}>
                Create Original Publication
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {volumes.map((volume) => (
            <div
              key={volume.id}
              className="bg-card rounded-none shadow-sm border border-border p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className={clsx(TYPOGRAPHY.h4, 'text-foreground')}>{volume.title}</h3>
                    <span
                      className={clsx(
                        TYPOGRAPHY.bodySmall,
                        'px-2 py-0.5 rounded-full',
                        volume.publication_status === 'published' && 'bg-green-100 text-green-800',
                        volume.publication_status === 'draft' && 'bg-yellow-100 text-yellow-800',
                        volume.publication_status === 'archived' && 'bg-gray-100 text-gray-800'
                      )}
                    >
                      {statusLabels[volume.publication_status]}
                    </span>
                    <span
                      className={clsx(
                        TYPOGRAPHY.bodySmall,
                        'px-2 py-0.5 rounded-full bg-primary/10 text-primary'
                      )}
                    >
                      {typeLabels[volume.volume_type]}
                    </span>
                    {(volume as { _source?: string })._source === 'book' && (
                      <span
                        className={clsx(
                          TYPOGRAPHY.bodySmall,
                          'px-2 py-0.5 rounded-full bg-blue-100 text-blue-800'
                        )}
                      >
                        In Preparation
                      </span>
                    )}
                  </div>

                  {volume.subtitle && (
                    <p className={clsx(TYPOGRAPHY.bodyBase, 'text-muted-foreground mb-2')}>
                      {volume.subtitle}
                    </p>
                  )}

                  <p className={clsx(TYPOGRAPHY.bodyBase, 'text-foreground line-clamp-2 mb-2')}>
                    {volume.description}
                  </p>

                  <div className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground space-y-1')}>
                    {volume.authors_display && (
                      <p>
                        <strong>Authors:</strong> {volume.authors_display}
                      </p>
                    )}
                    {volume.translator_display && (
                      <p>
                        <strong>Translation:</strong> {volume.translator_display}
                      </p>
                    )}
                    {volume.publication_year && (
                      <p>
                        <strong>Year:</strong> {volume.publication_year}
                      </p>
                    )}
                    {volume.slug && (
                      <p>
                        <strong>Slug:</strong> <span className="font-mono">{volume.slug}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  {(volume as { _source?: string })._source === 'book' ? (
                    <>
                      <Link href={`/dashboard/books/${volume.id}/prepare`}>
                        <Button variant="primary" size="sm" leadingIcon={BookMarked}>
                          Prepare for Publication
                        </Button>
                      </Link>
                      <Link href={`/proximamente/${volume.slug}`} target="_blank">
                        <Button variant="outlined" size="sm" leadingIcon={Eye}>
                          View on Próximamente
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <>
                      {volume.publication_status === 'draft' && (
                        <Button
                          variant="primary"
                          size="sm"
                          leadingIcon={Eye}
                          onClick={() => handlePublish(volume.id, volume.title)}
                        >
                          Publish
                        </Button>
                      )}
                      <Link href={`/dashboard/catalog/${volume.id}`}>
                        <Button variant="outlined" size="sm" leadingIcon={Edit}>
                          Edit
                        </Button>
                      </Link>
                      {volume.slug && volume.publication_status === 'published' && (
                        <Link href={`/catalogo/${volume.slug}`} target="_blank">
                          <Button variant="outlined" size="sm" leadingIcon={BookOpen}>
                            View Public
                          </Button>
                        </Link>
                      )}
                      {volume.slug && volume.publication_status === 'draft' && (
                        <Link href={`/proximamente/${volume.slug}`} target="_blank">
                          <Button variant="outlined" size="sm" leadingIcon={Eye}>
                            View on Próximamente
                          </Button>
                        </Link>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
