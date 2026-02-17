'use client'

import { useEffect, useState } from 'react'
import { use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Loader2,
  AlertCircle,
  ArrowLeft,
  Languages,
  Upload,
  Users,
  BookOpen,
  Save,
  Send,
} from 'lucide-react'
import Button from '@/components/ui/Button'
import { clsx } from 'clsx'
import { TYPOGRAPHY } from '@/lib/typography'
import dynamic from 'next/dynamic'
import { useToast } from '@/components/ui/ToastContainer'

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
  () =>
    import('@/components/dashboard/CoverManager').then((mod) => ({ default: mod.CoverManager })),
  {
    loading: () => (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    ),
  }
)
import { getBookCoverUrl } from '@/lib/twicpics'
import { generateSlug } from '@/lib/slug'
import type { Book, ContributorRole } from '@/types/books'
import { logger } from '@/lib/logger-client'

interface ContributorSelection {
  id: string
  full_name: string
  slug: string
  primary_role: ContributorRole
  photo_url?: string | null
  nationality?: string | null
}

export default function PreparePublicationPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const toast = useToast()

  const [book, setBook] = useState<Book | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Translation state
  const [translating, setTranslating] = useState<string | null>(null)

  // Form state
  const [titleEs, setTitleEs] = useState('')
  const [subtitleEs, setSubtitleEs] = useState('')
  const [descriptionEs, setDescriptionEs] = useState('')
  const [excerptEs, setExcerptEs] = useState('')
  const [tableOfContents, setTableOfContents] = useState('')

  // Contributors
  const [authors, setAuthors] = useState<ContributorSelection[]>([])
  const [translators, setTranslators] = useState<ContributorSelection[]>([])

  // Publication details
  const [isbn13, setIsbn13] = useState('')
  const [isbn10, setIsbn10] = useState('')
  const [publicationYear, setPublicationYear] = useState<number>(new Date().getFullYear())
  const [categories, setCategories] = useState('')
  const [tags, setTags] = useState('')
  const [coverPath, setCoverPath] = useState<string>('')
  const [coverUrl, setCoverUrl] = useState<string | null>(null)

  // Generate slug from Spanish title for cover naming
  const publicationSlug = titleEs ? generateSlug(titleEs) : ''

  useEffect(() => {
    fetchBook()
  }, [resolvedParams.id])

  const fetchBook = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/books/${resolvedParams.id}`, {
        credentials: 'include',
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch book')
      }

      const bookData: Book = data.book

      // Check if book is selected for translation
      if (!bookData.selected_for_translation) {
        setError('This book is not selected for translation')
        return
      }

      setBook(bookData)

      // Pre-fill form with existing data
      setTitleEs(bookData.translated_title || '')
      setDescriptionEs(bookData.publication_description_es || '')
      setExcerptEs(bookData.publication_excerpt_es || '')
      setTableOfContents(
        bookData.publication_table_of_contents
          ? JSON.stringify(bookData.publication_table_of_contents, null, 2)
          : ''
      )
      setIsbn13(bookData.isbn_13 || '')
      setIsbn10(bookData.isbn_10 || '')

      // Load saved contributors
      if (bookData.temp_authors) {
        setAuthors(bookData.temp_authors as ContributorSelection[])
      }
      if (bookData.temp_translators) {
        setTranslators(bookData.temp_translators as ContributorSelection[])
      }

      // Set cover if exists
      if (bookData.temp_cover_twicpics_path) {
        setCoverPath(bookData.temp_cover_twicpics_path)
        setCoverUrl(getBookCoverUrl(bookData.temp_cover_twicpics_path, 'medium'))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch book')
    } finally {
      setLoading(false)
    }
  }

  const handleAutoTranslate = async (
    field: 'title' | 'subtitle' | 'description',
    sourceText: string
  ) => {
    if (!sourceText) {
      toast.error('No text to translate')
      return
    }

    setTranslating(field)

    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: sourceText,
          sourceLanguage: 'en',
          targetLanguage: 'es',
          useGlossary: true,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Translation failed')
      }

      // Set translated text
      if (field === 'title') {
        setTitleEs(data.translated_text)
      } else if (field === 'subtitle') {
        setSubtitleEs(data.translated_text)
      } else if (field === 'description') {
        setDescriptionEs(data.translated_text)
      }

      if (data.glossary_terms_used && data.glossary_terms_used.length > 0) {
        toast.success(`Translated using ${data.glossary_terms_used.length} glossary term(s)`, 5000)
      } else {
        toast.success('Translation complete')
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Translation failed')
    } finally {
      setTranslating(null)
    }
  }

  const handleCoverSelect = (path: string, url: string) => {
    setCoverPath(path)
    setCoverUrl(url)
    // Save immediately to draft
    handleSaveCover(path)
  }

  const handleSaveCover = async (path: string) => {
    try {
      const response = await fetch(`/api/books/${resolvedParams.id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          temp_cover_twicpics_path: path || null,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to save cover')
      }
    } catch (err) {
      logger.error('Failed to save cover', { error: err })
      // Error toast is handled by ImageUpload component
    }
  }

  const handleSaveDraft = async () => {
    setSaving(true)

    try {
      const response = await fetch(`/api/books/${resolvedParams.id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          translated_title: titleEs || null,
          publication_description_es: descriptionEs || null,
          publication_excerpt_es: excerptEs || null,
          publication_table_of_contents: tableOfContents ? JSON.parse(tableOfContents) : null,
          temp_cover_twicpics_path: coverPath || null,
          // Save contributor assignments
          temp_authors: authors.length > 0 ? authors : null,
          temp_translators: translators.length > 0 ? translators : null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save')
      }

      setBook(data.book)
      toast.success('Draft saved successfully!')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save draft')
    } finally {
      setSaving(false)
    }
  }

  const handlePublishToCatalog = async () => {
    // Validation
    if (!titleEs) {
      toast.error('Spanish title is required')
      return
    }

    if (!descriptionEs) {
      toast.error('Spanish description is required')
      return
    }

    if (translators.length === 0) {
      toast.error('At least one translator must be assigned')
      return
    }

    if (authors.length === 0) {
      toast.error('At least one original author must be assigned')
      return
    }

    if (
      !confirm(
        'Are you sure you want to publish this book to the catalog? This will make it visible as a draft in catalog management.'
      )
    ) {
      return
    }

    setSaving(true)

    try {
      // Generate slug from Spanish title
      const slug = generateSlug(titleEs)

      // Prepare catalog data
      const catalogData = {
        volume_type: 'translated',
        title: titleEs,
        subtitle: subtitleEs || undefined,
        description: descriptionEs,
        publication_year: publicationYear,
        isbn_13: isbn13 || undefined,
        isbn_10: isbn10 || undefined,
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
        excerpt: excerptEs || undefined,
        slug,
      }

      // Prepare contributors data
      const contributorsData = [
        // Original authors
        ...authors.map((author, index) => ({
          contributor_id: author.id,
          role: 'author',
          display_order: index,
          is_original_contributor: true,
        })),
        // Translators
        ...translators.map((translator, index) => ({
          contributor_id: translator.id,
          role: 'translator',
          display_order: index,
          is_original_contributor: false,
        })),
      ]

      const response = await fetch(`/api/books/${resolvedParams.id}/promote`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          catalogData,
          contributors: contributorsData,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to publish to catalog')
      }

      toast.success('Book successfully published to catalog!', 7000)

      // Redirect to catalog management (when implemented)
      // For now, redirect back to book detail
      setTimeout(() => {
        router.push(`/dashboard/books/${resolvedParams.id}`)
      }, 2000)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to publish to catalog')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-card rounded-none shadow-sm border border-border p-12 text-center">
        <Loader2 className="h-12 w-12 text-primary mx-auto mb-4 animate-spin" />
        <p className={clsx(TYPOGRAPHY.bodyBase, 'text-muted-foreground')}>Loading book...</p>
      </div>
    )
  }

  if (error || !book) {
    return (
      <div className="space-y-4">
        <Link href={`/dashboard/books/${resolvedParams.id}`}>
          <Button variant="outlined" size="sm" leadingIcon={ArrowLeft}>
            Back to Book
          </Button>
        </Link>
        <div className="bg-destructive/10 border border-destructive/20 rounded-none p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
          <div>
            <h3 className={clsx(TYPOGRAPHY.h5, 'font-medium text-destructive')}>Error</h3>
            <p className={clsx(TYPOGRAPHY.bodySmall, 'text-destructive/80 mt-1')}>
              {error || 'Book not found'}
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
        <div>
          <Link href={`/dashboard/books/${resolvedParams.id}`}>
            <Button variant="outlined" size="sm" leadingIcon={ArrowLeft}>
              Back to Book
            </Button>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleSaveDraft} disabled={saving} variant="outlined" leadingIcon={Save}>
            {saving ? 'Saving...' : 'Save Draft'}
          </Button>
          <Button
            onClick={handlePublishToCatalog}
            disabled={saving}
            variant="primary"
            leadingIcon={Send}
          >
            Publish to Catalog
          </Button>
        </div>
      </div>

      {/* Book Info Summary */}
      <div className="bg-card rounded-none shadow-sm border border-border p-4">
        <h2 className={clsx(TYPOGRAPHY.h4, 'text-foreground mb-2')}>Preparing: {book.title}</h2>
        <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground')}>
          {book.authors?.join(', ')} ({book.published_date})
        </p>
        <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground')}>{book.id}</p>
      </div>

      {/* Step 1: Spanish Metadata */}
      <div className="bg-card rounded-none shadow-sm border border-border p-6">
        <div className="flex items-center gap-2 mb-6">
          <Languages className="h-5 w-5 text-primary" />
          <h2 className={clsx(TYPOGRAPHY.h3, 'text-foreground')}>Step 1: Spanish Metadata</h2>
        </div>

        <div className="space-y-6">
          {/* Title */}
          <div>
            <label className={clsx(TYPOGRAPHY.bodySmall, 'block font-medium text-foreground mb-2')}>
              Spanish Title <span className="text-destructive">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={titleEs}
                onChange={(e) => setTitleEs(e.target.value)}
                placeholder="Título en español..."
                className={clsx(
                  TYPOGRAPHY.bodyBase,
                  'flex-1 px-3 py-2 border border-border rounded-none focus:outline-none focus:ring-2 focus:ring-primary'
                )}
              />
              <Button
                variant="outlined"
                size="sm"
                onClick={() => handleAutoTranslate('title', book.title)}
                disabled={translating === 'title'}
                leadingIcon={Languages}
              >
                {translating === 'title' ? 'Translating...' : 'Auto-translate'}
              </Button>
            </div>
            <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground mt-1')}>
              Original: {book.title}
            </p>
          </div>

          {/* Subtitle */}
          {book.subtitle && (
            <div>
              <label
                className={clsx(TYPOGRAPHY.bodySmall, 'block font-medium text-foreground mb-2')}
              >
                Spanish Subtitle
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={subtitleEs}
                  onChange={(e) => setSubtitleEs(e.target.value)}
                  placeholder="Subtítulo en español..."
                  className={clsx(
                    TYPOGRAPHY.bodyBase,
                    'flex-1 px-3 py-2 border border-border rounded-none focus:outline-none focus:ring-2 focus:ring-primary'
                  )}
                />
                <Button
                  variant="outlined"
                  size="sm"
                  onClick={() => handleAutoTranslate('subtitle', book.subtitle!)}
                  disabled={translating === 'subtitle'}
                  leadingIcon={Languages}
                >
                  {translating === 'subtitle' ? 'Translating...' : 'Auto-translate'}
                </Button>
              </div>
              <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground mt-1')}>
                Original: {book.subtitle}
              </p>
            </div>
          )}

          {/* Description */}
          <div>
            <label className={clsx(TYPOGRAPHY.bodySmall, 'block font-medium text-foreground mb-2')}>
              Spanish Description <span className="text-destructive">*</span>
            </label>
            <div className="space-y-2">
              <MarkdownEditor
                value={descriptionEs}
                onChange={setDescriptionEs}
                height={250}
                placeholder="Descripción del libro en español para el catálogo público..."
              />
              <Button
                variant="outlined"
                size="sm"
                onClick={() => {
                  // Try to get description from Google Books or use a placeholder
                  const sourceDesc = 'Book description' // TODO: Get from Google Books data
                  handleAutoTranslate('description', sourceDesc)
                }}
                disabled={translating === 'description'}
                leadingIcon={Languages}
              >
                {translating === 'description'
                  ? 'Translating...'
                  : 'Auto-translate from Google Books'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Step 2: Contributors */}
      <div className="bg-card rounded-none shadow-sm border border-border p-6">
        <div className="flex items-center gap-2 mb-6">
          <Users className="h-5 w-5 text-primary" />
          <h2 className={clsx(TYPOGRAPHY.h3, 'text-foreground')}>Step 2: Assign Contributors</h2>
        </div>

        <div className="space-y-6">
          {/* Original Authors */}
          <ContributorAutocomplete
            label="Original Author(s)"
            placeholder="Search for author..."
            roleFilter="author"
            multiple={true}
            selectedContributors={authors}
            onSelect={(contributor) => setAuthors([...authors, contributor])}
            onRemove={(id) => setAuthors(authors.filter((a) => a.id !== id))}
          />

          {/* Translators */}
          <ContributorAutocomplete
            label="Translator(s)"
            placeholder="Search for translator..."
            roleFilter="translator"
            multiple={true}
            selectedContributors={translators}
            onSelect={(contributor) => setTranslators([...translators, contributor])}
            onRemove={(id) => setTranslators(translators.filter((t) => t.id !== id))}
          />
        </div>
      </div>

      {/* Step 3: Content */}
      <div className="bg-card rounded-none shadow-sm border border-border p-6">
        <div className="flex items-center gap-2 mb-6">
          <BookOpen className="h-5 w-5 text-primary" />
          <h2 className={clsx(TYPOGRAPHY.h3, 'text-foreground')}>Step 3: Content & Preview</h2>
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
              Enter structured table of contents as JSON (optional for now)
            </p>
          </div>

          {/* Excerpt */}
          <div>
            <label className={clsx(TYPOGRAPHY.bodySmall, 'block font-medium text-foreground mb-2')}>
              Excerpt / Sample Chapter
            </label>
            <MarkdownEditor
              value={excerptEs}
              onChange={setExcerptEs}
              height={250}
              placeholder="Fragmento o capítulo de muestra en español..."
            />
          </div>
        </div>
      </div>

      {/* Step 4: Publication Details */}
      <div className="bg-card rounded-none shadow-sm border border-border p-6">
        <div className="flex items-center gap-2 mb-6">
          <Upload className="h-5 w-5 text-primary" />
          <h2 className={clsx(TYPOGRAPHY.h3, 'text-foreground')}>Step 4: Publication Details</h2>
        </div>

        <div className="space-y-6">
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

          {/* Publication Year */}
          <div>
            <label className={clsx(TYPOGRAPHY.bodySmall, 'block font-medium text-foreground mb-2')}>
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
              placeholder="e.g., stanislavski, método, formación actoral"
              className={clsx(
                TYPOGRAPHY.bodyBase,
                'w-full px-3 py-2 border border-border rounded-none focus:outline-none focus:ring-2 focus:ring-primary'
              )}
            />
          </div>

          {/* Cover Management */}
          <div>
            <CoverManager
              currentCoverPath={coverPath}
              currentCoverUrl={coverUrl || undefined}
              slug={publicationSlug}
              onSelect={handleCoverSelect}
              label="Cover Image"
            />
          </div>
        </div>
      </div>

      {/* Validation Checklist */}
      <div className="bg-blue-50 border border-blue-200 rounded-none p-4">
        <h3 className={clsx(TYPOGRAPHY.h5, 'font-semibold text-blue-900 mb-3')}>
          Publication Checklist
        </h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <input type="checkbox" checked={!!titleEs} readOnly className="h-4 w-4 rounded-none" />
            <span className={clsx(TYPOGRAPHY.bodySmall, 'text-blue-800')}>
              Spanish title provided
            </span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!descriptionEs}
              readOnly
              className="h-4 w-4 rounded-none"
            />
            <span className={clsx(TYPOGRAPHY.bodySmall, 'text-blue-800')}>
              Spanish description provided
            </span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={translators.length > 0}
              readOnly
              className="h-4 w-4 rounded-none"
            />
            <span className={clsx(TYPOGRAPHY.bodySmall, 'text-blue-800')}>
              Translator(s) assigned
            </span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={authors.length > 0}
              readOnly
              className="h-4 w-4 rounded-none"
            />
            <span className={clsx(TYPOGRAPHY.bodySmall, 'text-blue-800')}>
              Original author(s) assigned
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
