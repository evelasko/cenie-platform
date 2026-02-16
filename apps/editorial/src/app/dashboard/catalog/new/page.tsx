'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { Save, ArrowLeft, Users, BookOpen, Loader2 } from 'lucide-react'
import Button from '@/components/ui/Button'
import { clsx } from 'clsx'
import { TYPOGRAPHY } from '@/lib/typography'
import { useToast } from '@/components/ui/ToastContainer'

const MarkdownEditor = dynamic(
  () =>
    import('@/components/dashboard/MarkdownEditor').then((mod) => ({
      default: mod.MarkdownEditor,
    })),
  {
    loading: () => (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    ),
  }
)

const CoverManager = dynamic(
  () => import('@/components/dashboard/CoverManager').then((mod) => ({ default: mod.CoverManager })),
  {
    loading: () => (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    ),
  }
)

const ContributorAutocomplete = dynamic(
  () =>
    import('@/components/dashboard/ContributorAutocomplete').then((mod) => ({
      default: mod.ContributorAutocomplete,
    })),
  {
    loading: () => (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    ),
  }
)
import type { VolumeType, ContributorRole } from '@/types/books'
import { logger } from '@/lib/logger-client'

interface ContributorSelection {
  id: string
  full_name: string
  slug: string
  primary_role: ContributorRole
  photo_url?: string | null
  nationality?: string | null
}

const volumeTypeOptions: { value: VolumeType; label: string; description: string }[] = [
  {
    value: 'original',
    label: 'Original Publication',
    description: 'A book authored or compiled by CENIE Editorial',
  },
  {
    value: 'adapted',
    label: 'Adapted Edition',
    description: 'An annotated, adapted, or compiled edition based on existing works',
  },
]

export default function NewOriginalPublicationPage() {
  const router = useRouter()
  const toast = useToast()

  const [saving, setSaving] = useState(false)

  // Form state
  const [volumeType, setVolumeType] = useState<VolumeType>('original')
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [description, setDescription] = useState('')
  const [publisherName, setPublisherName] = useState('CENIE Editorial')
  const [publicationYear, setPublicationYear] = useState<number>(new Date().getFullYear())
  const [isbn13, setIsbn13] = useState('')
  const [isbn10, setIsbn10] = useState('')
  const [pageCount, setPageCount] = useState<number | null>(null)
  const [categories, setCategories] = useState('')
  const [tags, setTags] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [tableOfContents, setTableOfContents] = useState('')
  const [coverPath, setCoverPath] = useState('')
  const [coverUrl, setCoverUrl] = useState('')

  // Contributors
  const [authors, setAuthors] = useState<ContributorSelection[]>([])
  const [editors, setEditors] = useState<ContributorSelection[]>([])

  // Generate slug from title for cover naming
  const publicationSlug = title
    ? title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
    : ''

  const handleCoverSelect = (path: string, url: string) => {
    setCoverPath(path)
    setCoverUrl(url)
    toast.success('Cover selected!')
  }

  const handleCreate = async () => {
    // Validation
    if (!title) {
      toast.error('Title is required')
      return
    }

    if (!description) {
      toast.error('Description is required')
      return
    }

    if (authors.length === 0 && editors.length === 0) {
      toast.error('At least one author or editor must be assigned')
      return
    }

    setSaving(true)

    try {
      // Generate slug
      const slug = title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')

      // Create catalog volume
      const volumeResponse = await fetch('/api/catalog', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          volume_type: volumeType,
          title,
          subtitle: subtitle || undefined,
          description,
          publisher_name: publisherName,
          publication_year: publicationYear,
          isbn_13: isbn13 || undefined,
          isbn_10: isbn10 || undefined,
          page_count: pageCount || undefined,
          cover_twicpics_path: coverPath || undefined,
          categories: categories
            ? categories
                .split(',')
                .map((c) => c.trim())
                .filter(Boolean)
            : undefined,
          tags: tags
            ? tags
                .split(',')
                .map((t) => t.trim())
                .filter(Boolean)
            : undefined,
          table_of_contents: tableOfContents ? JSON.parse(tableOfContents) : undefined,
          excerpt: excerpt || undefined,
          slug,
        }),
      })

      const volumeData = await volumeResponse.json()

      if (!volumeResponse.ok) {
        throw new Error(volumeData.error || 'Failed to create volume')
      }

      const volumeId = volumeData.volume.id

      // Link contributors via API
      const contributorsData = [
        ...authors.map((author, index) => ({
          volume_id: volumeId,
          contributor_id: author.id,
          role: 'author',
          display_order: index,
          is_original_contributor: true,
        })),
        ...editors.map((editor, index) => ({
          volume_id: volumeId,
          contributor_id: editor.id,
          role: 'editor',
          display_order: index,
          is_original_contributor: true,
        })),
      ]

      if (contributorsData.length > 0) {
        // Link contributors through API endpoint
        const contributorsResponse = await fetch(`/api/catalog/${volumeId}/contributors`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contributors: contributorsData }),
        })

        if (!contributorsResponse.ok) {
          const errorData = await contributorsResponse.json()
          logger.error('Contributors link error', { error: errorData })
          toast.error('Volume created but failed to link contributors')
        }
      }

      toast.success('Original publication created successfully!', 7000)
      setTimeout(() => {
        router.push(`/dashboard/catalog/${volumeId}`)
      }, 1500)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to create publication')
    } finally {
      setSaving(false)
    }
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
        <Button onClick={handleCreate} disabled={saving} variant="primary" leadingIcon={Save}>
          {saving ? 'Creating...' : 'Create Publication'}
        </Button>
      </div>

      {/* Page Title */}
      <div>
        <h1 className={clsx(TYPOGRAPHY.display1, 'text-foreground')}>
          Create Original Publication
        </h1>
        <p className={clsx(TYPOGRAPHY.bodyBase, 'text-muted-foreground mt-1')}>
          Create a new CENIE Editorial publication (not based on existing external books)
        </p>
      </div>

      {/* Volume Type */}
      <div className="bg-card rounded-none shadow-sm border border-border p-6">
        <h2 className={clsx(TYPOGRAPHY.h3, 'text-foreground mb-6')}>Publication Type</h2>

        <div className="space-y-3">
          {volumeTypeOptions.map((option) => (
            <label
              key={option.value}
              className={clsx(
                'flex items-start gap-3 p-4 border rounded-none cursor-pointer transition-colors',
                volumeType === option.value
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:bg-muted'
              )}
            >
              <input
                type="radio"
                name="volumeType"
                value={option.value}
                checked={volumeType === option.value}
                onChange={(e) => setVolumeType(e.target.value as VolumeType)}
                className="mt-1"
              />
              <div>
                <p className={clsx(TYPOGRAPHY.bodyBase, 'font-medium text-foreground')}>
                  {option.label}
                </p>
                <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground')}>
                  {option.description}
                </p>
              </div>
            </label>
          ))}
        </div>
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
              placeholder="Título del libro en español..."
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
              placeholder="Subtítulo (opcional)..."
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
            <MarkdownEditor
              value={description}
              onChange={setDescription}
              height={250}
              placeholder="Descripción del libro para el catálogo público..."
            />
          </div>
        </div>
      </div>

      {/* Cover Image */}
      <div className="bg-card rounded-none shadow-sm border border-border p-6">
        <h2 className={clsx(TYPOGRAPHY.h3, 'text-foreground mb-6')}>Cover Image</h2>
        <CoverManager
          currentCoverPath={coverPath}
          currentCoverUrl={coverUrl}
          slug={publicationSlug}
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

        <div className="space-y-6">
          {/* Authors */}
          <ContributorAutocomplete
            label="Author(s)"
            placeholder="Search for author..."
            roleFilter="author"
            multiple={true}
            selectedContributors={authors}
            onSelect={(contributor) => setAuthors([...authors, contributor])}
            onRemove={(id) => setAuthors(authors.filter((a) => a.id !== id))}
          />

          {/* Editors/Compilers */}
          <ContributorAutocomplete
            label="Editor(s) / Compiler(s)"
            placeholder="Search for editor..."
            roleFilter="editor"
            multiple={true}
            selectedContributors={editors}
            onSelect={(contributor) => setEditors([...editors, contributor])}
            onRemove={(id) => setEditors(editors.filter((e) => e.id !== id))}
          />
        </div>
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
                value={publicationYear}
                onChange={(e) => setPublicationYear(parseInt(e.target.value))}
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
              placeholder="e.g., investigación, pedagogía, innovación"
              className={clsx(
                TYPOGRAPHY.bodyBase,
                'w-full px-3 py-2 border border-border rounded-none focus:outline-none focus:ring-2 focus:ring-primary'
              )}
            />
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
          {/* Table of Contents */}
          <div>
            <label className={clsx(TYPOGRAPHY.bodySmall, 'block font-medium text-foreground mb-2')}>
              Table of Contents (JSON)
            </label>
            <textarea
              value={tableOfContents}
              onChange={(e) => setTableOfContents(e.target.value)}
              rows={8}
              placeholder='{"chapters": [{"title": "Capítulo 1", "page": 1}]}'
              className={clsx(
                TYPOGRAPHY.bodyBase,
                'w-full px-3 py-2 border border-border rounded-none focus:outline-none focus:ring-2 focus:ring-primary font-mono'
              )}
            />
            <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground mt-1')}>
              Enter structured table of contents as JSON (optional)
            </p>
          </div>

          {/* Excerpt */}
          <div>
            <label className={clsx(TYPOGRAPHY.bodySmall, 'block font-medium text-foreground mb-2')}>
              Excerpt / Sample Chapter
            </label>
            <MarkdownEditor
              value={excerpt}
              onChange={setExcerpt}
              height={300}
              placeholder="Fragmento o capítulo de muestra..."
            />
          </div>
        </div>
      </div>

      {/* Validation Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-none p-4">
        <h3 className={clsx(TYPOGRAPHY.h5, 'font-semibold text-blue-900 mb-3')}>
          Publication Checklist
        </h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <input type="checkbox" checked={!!title} readOnly className="h-4 w-4 rounded-none" />
            <span className={clsx(TYPOGRAPHY.bodySmall, 'text-blue-800')}>Title provided</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!description}
              readOnly
              className="h-4 w-4 rounded-none"
            />
            <span className={clsx(TYPOGRAPHY.bodySmall, 'text-blue-800')}>
              Description provided
            </span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={authors.length > 0 || editors.length > 0}
              readOnly
              className="h-4 w-4 rounded-none"
            />
            <span className={clsx(TYPOGRAPHY.bodySmall, 'text-blue-800')}>
              Contributors assigned
            </span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!coverPath}
              readOnly
              className="h-4 w-4 rounded-none"
            />
            <span className={clsx(TYPOGRAPHY.bodySmall, 'text-blue-800')}>
              Cover uploaded (recommended)
            </span>
          </div>
        </div>
        <p className={clsx(TYPOGRAPHY.bodySmall, 'text-blue-700 mt-4 italic')}>
          Note: This will be created as a draft. You can publish it to the public catalog from the
          catalog management page.
        </p>
      </div>
    </div>
  )
}
