'use client'

import { useEffect, useState } from 'react'
import { use } from 'react'
import Link from 'next/link'
import { Loader2, AlertCircle, Save, ArrowLeft } from 'lucide-react'
import Button from '@/components/ui/Button'
import { clsx } from 'clsx'
import { TYPOGRAPHY } from '@/lib/typography'
import { useToast } from '@/components/ui/ToastContainer'
import type { Contributor, ContributorRole } from '@/types/books'

const roleOptions: { value: ContributorRole; label: string }[] = [
  { value: 'author', label: 'Author' },
  { value: 'translator', label: 'Translator' },
  { value: 'editor', label: 'Editor' },
  { value: 'illustrator', label: 'Illustrator' },
  { value: 'narrator', label: 'Narrator' },
  { value: 'other', label: 'Other' },
]

export default function ContributorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const toast = useToast()

  const [contributor, setContributor] = useState<Contributor | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [fullName, setFullName] = useState('')
  const [slug, setSlug] = useState('')
  const [primaryRole, setPrimaryRole] = useState<ContributorRole>('author')
  const [nameVariants, setNameVariants] = useState('')
  const [bioEs, setBioEs] = useState('')
  const [bioEn, setBioEn] = useState('')
  const [nationality, setNationality] = useState('')
  const [birthYear, setBirthYear] = useState<number | null>(null)
  const [deathYear, setDeathYear] = useState<number | null>(null)
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [translatorSpecializations, setTranslatorSpecializations] = useState('')
  const [translatorLanguages, setTranslatorLanguages] = useState('')

  useEffect(() => {
    fetchContributor()
  }, [resolvedParams.id])

  const fetchContributor = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/contributors/${resolvedParams.id}`, {
        credentials: 'include',
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch contributor')
      }

      const contrib: Contributor = data.contributor
      setContributor(contrib)

      // Set form values
      setFullName(contrib.full_name)
      setSlug(contrib.slug)
      setPrimaryRole(contrib.primary_role)
      setNameVariants(contrib.name_variants?.join(', ') || '')
      setBioEs(contrib.bio_es || '')
      setBioEn(contrib.bio_en || '')
      setNationality(contrib.nationality || '')
      setBirthYear(contrib.birth_year ?? null)
      setDeathYear(contrib.death_year ?? null)
      setWebsiteUrl(contrib.website_url || '')
      setTranslatorSpecializations(contrib.translator_specializations?.join(', ') || '')
      setTranslatorLanguages(contrib.translator_languages?.join(', ') || '')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch contributor')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)

    try {
      const response = await fetch(`/api/contributors/${resolvedParams.id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: fullName,
          slug,
          primary_role: primaryRole,
          name_variants: nameVariants
            ? nameVariants
                .split(',')
                .map((v) => v.trim())
                .filter(Boolean)
            : null,
          bio_es: bioEs || null,
          bio_en: bioEn || null,
          nationality: nationality || null,
          birth_year: birthYear,
          death_year: deathYear,
          website_url: websiteUrl || null,
          translator_specializations:
            primaryRole === 'translator' && translatorSpecializations
              ? translatorSpecializations
                  .split(',')
                  .map((v) => v.trim())
                  .filter(Boolean)
              : null,
          translator_languages:
            primaryRole === 'translator' && translatorLanguages
              ? translatorLanguages
                  .split(',')
                  .map((v) => v.trim())
                  .filter(Boolean)
              : null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save contributor')
      }

      setContributor(data.contributor)
      toast.success('Contributor updated successfully!')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save contributor')
    } finally {
      setSaving(false)
    }
  }

  // Auto-generate slug from name
  const handleNameChange = (name: string) => {
    setFullName(name)
    if (!contributor) {
      // Only auto-generate slug for new contributors
      const autoSlug = name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
      setSlug(autoSlug)
    }
  }

  if (loading) {
    return (
      <div className="bg-card rounded-none shadow-sm border border-border p-12 text-center">
        <Loader2 className="h-12 w-12 text-primary mx-auto mb-4 animate-spin" />
        <p className={clsx(TYPOGRAPHY.bodyBase, 'text-muted-foreground')}>Loading contributor...</p>
      </div>
    )
  }

  if (error || !contributor) {
    return (
      <div className="space-y-4">
        <Link href="/dashboard/contributors">
          <Button variant="outlined" size="sm" leadingIcon={ArrowLeft}>
            Back to Contributors
          </Button>
        </Link>
        <div className="bg-destructive/10 border border-destructive/20 rounded-none p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
          <div>
            <h3 className={clsx(TYPOGRAPHY.h5, 'font-medium text-destructive')}>
              Error Loading Contributor
            </h3>
            <p className={clsx(TYPOGRAPHY.bodySmall, 'text-destructive/80 mt-1')}>
              {error || 'Contributor not found'}
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
        <Link href="/dashboard/contributors">
          <Button variant="outlined" size="sm" leadingIcon={ArrowLeft}>
            Back to Contributors
          </Button>
        </Link>
        <Button onClick={handleSave} disabled={saving} variant="primary" leadingIcon={Save}>
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      {/* Contributor Info */}
      <div className="bg-card rounded-none shadow-sm border border-border p-6">
        <h2 className={clsx(TYPOGRAPHY.h3, 'text-foreground mb-6')}>Contributor Information</h2>

        <div className="space-y-6">
          {/* Photo Preview */}
          {contributor.photo_url && (
            <div className="flex items-center gap-4">
              <img
                src={contributor.photo_url}
                alt={contributor.full_name}
                className="h-24 w-24 rounded-full object-cover border-2 border-border"
              />
              <div>
                <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground')}>Current Photo</p>
                <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground italic')}>
                  Photo upload coming soon
                </p>
              </div>
            </div>
          )}

          {/* Full Name */}
          <div>
            <label className={clsx(TYPOGRAPHY.bodySmall, 'block font-medium text-foreground mb-2')}>
              Full Name <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g., Constantin Stanislavski"
              className={clsx(
                TYPOGRAPHY.bodyBase,
                'w-full px-3 py-2 border border-border rounded-none focus:outline-none focus:ring-2 focus:ring-primary'
              )}
            />
          </div>

          {/* Slug */}
          <div>
            <label className={clsx(TYPOGRAPHY.bodySmall, 'block font-medium text-foreground mb-2')}>
              URL Slug <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="e.g., constantin-stanislavski"
              className={clsx(
                TYPOGRAPHY.bodyBase,
                'w-full px-3 py-2 border border-border rounded-none focus:outline-none focus:ring-2 focus:ring-primary font-mono'
              )}
            />
            <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground mt-1')}>
              Used in URLs: /catalogo/autores/{slug}
            </p>
          </div>

          {/* Primary Role */}
          <div>
            <label className={clsx(TYPOGRAPHY.bodySmall, 'block font-medium text-foreground mb-2')}>
              Primary Role <span className="text-destructive">*</span>
            </label>
            <select
              value={primaryRole}
              onChange={(e) => setPrimaryRole(e.target.value as ContributorRole)}
              className={clsx(
                TYPOGRAPHY.bodyBase,
                'w-full px-3 py-2 border border-border rounded-none focus:outline-none focus:ring-2 focus:ring-primary'
              )}
            >
              {roleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Name Variants */}
          <div>
            <label className={clsx(TYPOGRAPHY.bodySmall, 'block font-medium text-foreground mb-2')}>
              Name Variants (comma-separated)
            </label>
            <input
              type="text"
              value={nameVariants}
              onChange={(e) => setNameVariants(e.target.value)}
              placeholder="e.g., C. Stanislavski, Konstantin Stanislavsky"
              className={clsx(
                TYPOGRAPHY.bodyBase,
                'w-full px-3 py-2 border border-border rounded-none focus:outline-none focus:ring-2 focus:ring-primary'
              )}
            />
            <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground mt-1')}>
              Alternative spellings or formats for search
            </p>
          </div>

          {/* Bio Spanish */}
          <div>
            <label className={clsx(TYPOGRAPHY.bodySmall, 'block font-medium text-foreground mb-2')}>
              Biography (Spanish)
            </label>
            <textarea
              value={bioEs}
              onChange={(e) => setBioEs(e.target.value)}
              rows={4}
              placeholder="Biografía del contribuidor en español..."
              className={clsx(
                TYPOGRAPHY.bodyBase,
                'w-full px-3 py-2 border border-border rounded-none focus:outline-none focus:ring-2 focus:ring-primary'
              )}
            />
          </div>

          {/* Bio English */}
          <div>
            <label className={clsx(TYPOGRAPHY.bodySmall, 'block font-medium text-foreground mb-2')}>
              Biography (English)
            </label>
            <textarea
              value={bioEn}
              onChange={(e) => setBioEn(e.target.value)}
              rows={4}
              placeholder="Contributor biography in English..."
              className={clsx(
                TYPOGRAPHY.bodyBase,
                'w-full px-3 py-2 border border-border rounded-none focus:outline-none focus:ring-2 focus:ring-primary'
              )}
            />
          </div>

          {/* Nationality */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label
                className={clsx(TYPOGRAPHY.bodySmall, 'block font-medium text-foreground mb-2')}
              >
                Nationality
              </label>
              <input
                type="text"
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
                placeholder="e.g., Russian, Spanish"
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
                Birth Year
              </label>
              <input
                type="number"
                value={birthYear || ''}
                onChange={(e) => setBirthYear(e.target.value ? parseInt(e.target.value) : null)}
                placeholder="e.g., 1863"
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
                Death Year
              </label>
              <input
                type="number"
                value={deathYear || ''}
                onChange={(e) => setDeathYear(e.target.value ? parseInt(e.target.value) : null)}
                placeholder="e.g., 1938"
                className={clsx(
                  TYPOGRAPHY.bodyBase,
                  'w-full px-3 py-2 border border-border rounded-none focus:outline-none focus:ring-2 focus:ring-primary'
                )}
              />
            </div>
          </div>

          {/* Website */}
          <div>
            <label className={clsx(TYPOGRAPHY.bodySmall, 'block font-medium text-foreground mb-2')}>
              Website URL
            </label>
            <input
              type="url"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="https://example.com"
              className={clsx(
                TYPOGRAPHY.bodyBase,
                'w-full px-3 py-2 border border-border rounded-none focus:outline-none focus:ring-2 focus:ring-primary'
              )}
            />
          </div>

          {/* Translator-specific fields */}
          {primaryRole === 'translator' && (
            <>
              <div>
                <label
                  className={clsx(TYPOGRAPHY.bodySmall, 'block font-medium text-foreground mb-2')}
                >
                  Specializations (comma-separated)
                </label>
                <input
                  type="text"
                  value={translatorSpecializations}
                  onChange={(e) => setTranslatorSpecializations(e.target.value)}
                  placeholder="e.g., theater, poetry, literary fiction"
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
                  Language Pairs (comma-separated)
                </label>
                <input
                  type="text"
                  value={translatorLanguages}
                  onChange={(e) => setTranslatorLanguages(e.target.value)}
                  placeholder="e.g., en-es, fr-es, de-es"
                  className={clsx(
                    TYPOGRAPHY.bodyBase,
                    'w-full px-3 py-2 border border-border rounded-none focus:outline-none focus:ring-2 focus:ring-primary'
                  )}
                />
                <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground mt-1')}>
                  Format: source-target (e.g., en-es for English to Spanish)
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Metadata */}
      <div className="bg-muted rounded-none border border-border p-4">
        <h3 className={clsx(TYPOGRAPHY.h5, 'font-semibold text-foreground mb-3')}>Metadata</h3>
        <div className={clsx(TYPOGRAPHY.bodySmall, 'grid grid-cols-2 gap-x-4 gap-y-2')}>
          <div>
            <span className="text-muted-foreground">ID:</span>
            <span className="ml-2 font-mono text-foreground">{contributor.id}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Status:</span>
            <span className="ml-2 text-foreground">
              {contributor.is_active ? 'Active' : 'Inactive'}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Created:</span>
            <span className="ml-2 text-foreground">
              {new Date(contributor.created_at).toLocaleDateString()}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Last Updated:</span>
            <span className="ml-2 text-foreground">
              {new Date(contributor.updated_at).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
