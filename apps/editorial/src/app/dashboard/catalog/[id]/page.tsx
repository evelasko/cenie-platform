'use client'

import { useEffect, useState } from 'react'
import { use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2, AlertCircle, Save, ArrowLeft, Eye, Archive, Users, BookOpen } from 'lucide-react'
import Button from '@/components/ui/Button'
import { clsx } from 'clsx'
import { TYPOGRAPHY } from '@/lib/typography'
import { useToast } from '@/components/ui/ToastContainer'
import { CoverManager } from '@/components/dashboard/CoverManager'
import type { CatalogVolume, VolumeType, PublicationStatus, ContributorRole } from '@/types/books'

interface VolumeContributor {
  contributor_id: string
  full_name: string
  role: ContributorRole
  display_order: number
}

export default function CatalogVolumeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const toast = useToast()

  const [volume, setVolume] = useState<CatalogVolume | null>(null)
  const [contributors, setContributors] = useState<VolumeContributor[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [description, setDescription] = useState('')
  const [volumeType, setVolumeType] = useState<VolumeType>('translated')
  const [publicationStatus, setPublicationStatus] = useState<PublicationStatus>('draft')
  const [publisherName, setPublisherName] = useState('CENIE Editorial')
  const [publicationYear, setPublicationYear] = useState<number | null>(null)
  const [isbn13, setIsbn13] = useState('')
  const [isbn10, setIsbn10] = useState('')
  const [pageCount, setPageCount] = useState<number | null>(null)
  const [categories, setCategories] = useState('')
  const [tags, setTags] = useState('')
  const [featured, setFeatured] = useState(false)
  const [slug, setSlug] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [coverPath, setCoverPath] = useState('')
  const [coverUrl, setCoverUrl] = useState('')

  useEffect(() => {
    fetchVolume()
  }, [resolvedParams.id])

  const fetchVolume = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/catalog/${resolvedParams.id}`, {
        credentials: 'include',
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch volume')
      }

      const vol: CatalogVolume = data.volume
      setVolume(vol)

      // Set form values
      setTitle(vol.title)
      setSubtitle(vol.subtitle || '')
      setDescription(vol.description)
      setVolumeType(vol.volume_type)
      setPublicationStatus(vol.publication_status)
      setPublisherName(vol.publisher_name)
      setPublicationYear(vol.publication_year ?? null)
      setIsbn13(vol.isbn_13 || '')
      setIsbn10(vol.isbn_10 || '')
      setPageCount(vol.page_count ?? null)
      setCategories(vol.categories?.join(', ') || '')
      setTags(vol.tags?.join(', ') || '')
      setFeatured(vol.featured)
      setSlug(vol.slug || '')
      setExcerpt(vol.excerpt || '')
      setCoverPath(vol.cover_twicpics_path || '')
      setCoverUrl(vol.cover_url || '')

      // Set contributors if available
      if (data.contributors && Array.isArray(data.contributors)) {
        setContributors(data.contributors)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch volume')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!title || !description) {
      toast.error('Title and description are required')
      return
    }

    setSaving(true)

    try {
      const response = await fetch(`/api/catalog/${resolvedParams.id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          subtitle: subtitle || null,
          description,
          publisher_name: publisherName,
          publication_year: publicationYear,
          isbn_13: isbn13 || null,
          isbn_10: isbn10 || null,
          page_count: pageCount,
          categories: categories
            ? categories
                .split(',')
                .map((c) => c.trim())
                .filter(Boolean)
            : null,
          tags: tags
            ? tags
                .split(',')
                .map((t) => t.trim())
                .filter(Boolean)
            : null,
          featured,
          slug: slug || null,
          excerpt: excerpt || null,
          cover_twicpics_path: coverPath || null,
          cover_url: coverUrl || null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save volume')
      }

      setVolume(data.volume)
      toast.success('Volume updated successfully!')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save volume')
    } finally {
      setSaving(false)
    }
  }

  const handlePublish = async () => {
    if (!confirm('Publish this volume to the public catalog?')) {
      return
    }

    try {
      const response = await fetch(`/api/catalog/${resolvedParams.id}/publish`, {
        method: 'POST',
        credentials: 'include',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to publish volume')
      }

      setVolume(data.volume)
      setPublicationStatus('published')
      toast.success('Volume published to public catalog!')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to publish volume')
    }
  }

  const handleArchive = async () => {
    if (!confirm('Archive this volume? It will no longer be visible in the public catalog.')) {
      return
    }

    try {
      const response = await fetch(`/api/catalog/${resolvedParams.id}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to archive volume')
      }

      toast.success('Volume archived successfully!')
      router.push('/dashboard/catalog')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to archive volume')
    }
  }

  const handleCoverSelect = (path: string, url: string) => {
    setCoverPath(path)
    setCoverUrl(url)
    toast.success('Cover updated! Remember to save changes.')
  }

  if (loading) {
    return (
      <div className="bg-card rounded-none shadow-sm border border-border p-12 text-center">
        <Loader2 className="h-12 w-12 text-primary mx-auto mb-4 animate-spin" />
        <p className={clsx(TYPOGRAPHY.bodyBase, 'text-muted-foreground')}>Loading volume...</p>
      </div>
    )
  }

  if (error || !volume) {
    return (
      <div className="space-y-4">
        <Link href="/dashboard/catalog">
          <Button variant="outlined" size="sm" leadingIcon={ArrowLeft}>
            Back to Catalog
          </Button>
        </Link>
        <div className="bg-destructive/10 border border-destructive/20 rounded-none p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
          <div>
            <h3 className={clsx(TYPOGRAPHY.h5, 'font-medium text-destructive')}>Error</h3>
            <p className={clsx(TYPOGRAPHY.bodySmall, 'text-destructive/80 mt-1')}>
              {error || 'Volume not found'}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href="/dashboard/catalog">
          <Button variant="outlined" size="sm" leadingIcon={ArrowLeft}>
            Back to Catalog
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          {publicationStatus === 'draft' && (
            <Button onClick={handlePublish} variant="primary" leadingIcon={Eye}>
              Publish to Public
            </Button>
          )}
          <Button onClick={handleArchive} variant="outlined" leadingIcon={Archive}>
            Archive
          </Button>
          <Button onClick={handleSave} disabled={saving} variant="primary" leadingIcon={Save}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Status Banner */}
      <div
        className={clsx(
          'rounded-none p-4 border',
          publicationStatus === 'published' && 'bg-green-50 border-green-200',
          publicationStatus === 'draft' && 'bg-yellow-50 border-yellow-200',
          publicationStatus === 'archived' && 'bg-gray-50 border-gray-200'
        )}
      >
        <p className={clsx(TYPOGRAPHY.bodyBase, 'font-medium')}>
          Status: {publicationStatus.toUpperCase()} • Type: {volumeType.toUpperCase()}
        </p>
        {volume.slug && (
          <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground mt-1')}>
            Public URL: /catalogo/{volume.slug}
          </p>
        )}
      </div>

      {/* Basic Information */}
      <div className="bg-card rounded-none shadow-sm border border-border p-6">
        <h2 className={clsx(TYPOGRAPHY.h3, 'text-foreground mb-6')}>Basic Information</h2>

        <div className="space-y-6">
          {/* Title */}
          <div>
            <label className={clsx(TYPOGRAPHY.bodySmall, 'block font-medium text-foreground mb-2')}>
              Title (Spanish) <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={clsx(
                TYPOGRAPHY.bodyBase,
                'w-full px-3 py-2 border border-border rounded-none focus:outline-none focus:ring-2 focus:ring-primary'
              )}
            />
          </div>

          {/* Subtitle */}
          <div>
            <label className={clsx(TYPOGRAPHY.bodySmall, 'block font-medium text-foreground mb-2')}>
              Subtitle (Spanish)
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className={clsx(
                TYPOGRAPHY.bodyBase,
                'w-full px-3 py-2 border border-border rounded-none focus:outline-none focus:ring-2 focus:ring-primary'
              )}
            />
          </div>

          {/* Description */}
          <div>
            <label className={clsx(TYPOGRAPHY.bodySmall, 'block font-medium text-foreground mb-2')}>
              Description (Spanish) <span className="text-destructive">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              className={clsx(
                TYPOGRAPHY.bodyBase,
                'w-full px-3 py-2 border border-border rounded-none focus:outline-none focus:ring-2 focus:ring-primary'
              )}
            />
          </div>

          {/* Slug */}
          <div>
            <label className={clsx(TYPOGRAPHY.bodySmall, 'block font-medium text-foreground mb-2')}>
              URL Slug
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="auto-generated-from-title"
              className={clsx(
                TYPOGRAPHY.bodyBase,
                'w-full px-3 py-2 border border-border rounded-none focus:outline-none focus:ring-2 focus:ring-primary font-mono'
              )}
            />
            <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground mt-1')}>
              Used in public URL: /catalogo/{slug || 'slug-here'}
            </p>
          </div>
        </div>
      </div>

      {/* Cover Image */}
      <div className="bg-card rounded-none shadow-sm border border-border p-6">
        <h2 className={clsx(TYPOGRAPHY.h3, 'text-foreground mb-6')}>Cover Image</h2>
        <CoverManager
          currentCoverPath={coverPath}
          currentCoverUrl={coverUrl}
          slug={slug}
          onSelect={handleCoverSelect}
          label="Book Cover"
        />
      </div>

      {/* Contributors */}
      <div className="bg-card rounded-none shadow-sm border border-border p-6">
        <div className="flex items-center gap-2 mb-6">
          <Users className="h-5 w-5 text-primary" />
          <h2 className={clsx(TYPOGRAPHY.h3, 'text-foreground')}>Contributors</h2>
        </div>

        {contributors.length > 0 && (
          <div className="mb-6">
            <h3 className={clsx(TYPOGRAPHY.h5, 'font-semibold text-foreground mb-3')}>
              Current Contributors
            </h3>
            <div className="space-y-2">
              {contributors.map((contrib) => (
                <div
                  key={contrib.contributor_id}
                  className="flex items-center justify-between p-3 border border-border rounded-none"
                >
                  <div>
                    <p className={clsx(TYPOGRAPHY.bodyBase, 'font-medium text-foreground')}>
                      {contrib.full_name}
                    </p>
                    <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground')}>
                      {contrib.role} • Order: {contrib.display_order}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground italic')}>
          Note: Contributor management interface coming soon. Contributors were assigned during
          promotion from workspace.
        </p>
      </div>

      {/* Publication Details */}
      <div className="bg-card rounded-none shadow-sm border border-border p-6">
        <h2 className={clsx(TYPOGRAPHY.h3, 'text-foreground mb-6')}>Publication Details</h2>

        <div className="space-y-6">
          {/* Publisher & Year */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                className={clsx(TYPOGRAPHY.bodySmall, 'block font-medium text-foreground mb-2')}
              >
                Publisher
              </label>
              <input
                type="text"
                value={publisherName}
                onChange={(e) => setPublisherName(e.target.value)}
                className={clsx(
                  TYPOGRAPHY.bodyBase,
                  'w-full px-3 py-2 border border-border rounded-none focus:outline-none focus:ring-2 focus:ring-primary'
                )}
              />
            </div>
            <div>
              <label
                className={clsx(TYPOGRAPHY.bodySmall, 'block font-medium text-foreground mb-2')}
              >
                Publication Year
              </label>
              <input
                type="number"
                value={publicationYear || ''}
                onChange={(e) =>
                  setPublicationYear(e.target.value ? parseInt(e.target.value) : null)
                }
                className={clsx(
                  TYPOGRAPHY.bodyBase,
                  'w-full px-3 py-2 border border-border rounded-none focus:outline-none focus:ring-2 focus:ring-primary'
                )}
              />
            </div>
          </div>

          {/* ISBNs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                className={clsx(TYPOGRAPHY.bodySmall, 'block font-medium text-foreground mb-2')}
              >
                ISBN-13
              </label>
              <input
                type="text"
                value={isbn13}
                onChange={(e) => setIsbn13(e.target.value)}
                placeholder="978-1234567890"
                className={clsx(
                  TYPOGRAPHY.bodyBase,
                  'w-full px-3 py-2 border border-border rounded-none focus:outline-none focus:ring-2 focus:ring-primary font-mono'
                )}
              />
            </div>
            <div>
              <label
                className={clsx(TYPOGRAPHY.bodySmall, 'block font-medium text-foreground mb-2')}
              >
                ISBN-10
              </label>
              <input
                type="text"
                value={isbn10}
                onChange={(e) => setIsbn10(e.target.value)}
                placeholder="1234567890"
                className={clsx(
                  TYPOGRAPHY.bodyBase,
                  'w-full px-3 py-2 border border-border rounded-none focus:outline-none focus:ring-2 focus:ring-primary font-mono'
                )}
              />
            </div>
          </div>

          {/* Page Count */}
          <div>
            <label className={clsx(TYPOGRAPHY.bodySmall, 'block font-medium text-foreground mb-2')}>
              Page Count
            </label>
            <input
              type="number"
              value={pageCount || ''}
              onChange={(e) => setPageCount(e.target.value ? parseInt(e.target.value) : null)}
              className={clsx(
                TYPOGRAPHY.bodyBase,
                'w-full px-3 py-2 border border-border rounded-none focus:outline-none focus:ring-2 focus:ring-primary'
              )}
            />
          </div>

          {/* Categories */}
          <div>
            <label className={clsx(TYPOGRAPHY.bodySmall, 'block font-medium text-foreground mb-2')}>
              Categories (comma-separated)
            </label>
            <input
              type="text"
              value={categories}
              onChange={(e) => setCategories(e.target.value)}
              placeholder="e.g., teatro, actuación, técnica"
              className={clsx(
                TYPOGRAPHY.bodyBase,
                'w-full px-3 py-2 border border-border rounded-none focus:outline-none focus:ring-2 focus:ring-primary'
              )}
            />
          </div>

          {/* Tags */}
          <div>
            <label className={clsx(TYPOGRAPHY.bodySmall, 'block font-medium text-foreground mb-2')}>
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g., stanislavski, método, formación"
              className={clsx(
                TYPOGRAPHY.bodyBase,
                'w-full px-3 py-2 border border-border rounded-none focus:outline-none focus:ring-2 focus:ring-primary'
              )}
            />
          </div>

          {/* Featured */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="featured"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="h-4 w-4 text-primary focus:ring-primary border-border rounded-none"
            />
            <label htmlFor="featured" className={clsx(TYPOGRAPHY.bodyBase, 'ml-2 text-foreground')}>
              Featured Volume (show prominently in catalog)
            </label>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-card rounded-none shadow-sm border border-border p-6">
        <div className="flex items-center gap-2 mb-6">
          <BookOpen className="h-5 w-5 text-primary" />
          <h2 className={clsx(TYPOGRAPHY.h3, 'text-foreground')}>Content & Previews</h2>
        </div>

        <div className="space-y-6">
          {/* Excerpt */}
          <div>
            <label className={clsx(TYPOGRAPHY.bodySmall, 'block font-medium text-foreground mb-2')}>
              Excerpt / Sample Chapter
            </label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={8}
              placeholder="Fragmento o capítulo de muestra..."
              className={clsx(
                TYPOGRAPHY.bodyBase,
                'w-full px-3 py-2 border border-border rounded-none focus:outline-none focus:ring-2 focus:ring-primary'
              )}
            />
          </div>
        </div>
      </div>

      {/* Metadata */}
      <div className="bg-muted rounded-none border border-border p-4">
        <h3 className={clsx(TYPOGRAPHY.h5, 'font-semibold text-foreground mb-3')}>Metadata</h3>
        <div className={clsx(TYPOGRAPHY.bodySmall, 'grid grid-cols-2 gap-x-4 gap-y-2')}>
          <div>
            <span className="text-muted-foreground">Volume ID:</span>
            <span className="ml-2 font-mono text-foreground">{volume.id}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Created:</span>
            <span className="ml-2 text-foreground">
              {new Date(volume.created_at).toLocaleDateString()}
            </span>
          </div>
          {volume.published_at && (
            <div>
              <span className="text-muted-foreground">Published:</span>
              <span className="ml-2 text-foreground">
                {new Date(volume.published_at).toLocaleDateString()}
              </span>
            </div>
          )}
          <div>
            <span className="text-muted-foreground">Last Updated:</span>
            <span className="ml-2 text-foreground">
              {new Date(volume.updated_at).toLocaleDateString()}
            </span>
          </div>
          {volume.source_book_id && (
            <div>
              <span className="text-muted-foreground">Source Book:</span>
              <Link
                href={`/dashboard/books/${volume.source_book_id}`}
                className="ml-2 text-primary hover:text-primary/80"
              >
                View in workspace
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
