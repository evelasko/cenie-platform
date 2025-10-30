'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Save, ArrowLeft } from 'lucide-react'
import Button from '@/components/ui/Button'
import { clsx } from 'clsx'
import { TYPOGRAPHY } from '@/lib/typography'
import { useToast } from '@/components/ui/ToastContainer'
import type { ContributorRole } from '@/types/books'

const roleOptions: { value: ContributorRole; label: string }[] = [
  { value: 'author', label: 'Author' },
  { value: 'translator', label: 'Translator' },
  { value: 'editor', label: 'Editor' },
  { value: 'illustrator', label: 'Illustrator' },
  { value: 'narrator', label: 'Narrator' },
  { value: 'other', label: 'Other' },
]

export default function NewContributorPage() {
  const router = useRouter()
  const toast = useToast()

  const [saving, setSaving] = useState(false)

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

  // Auto-generate slug from name
  const handleNameChange = (name: string) => {
    setFullName(name)
    const autoSlug = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
    setSlug(autoSlug)
  }

  const handleCreate = async () => {
    if (!fullName || !slug) {
      toast.error('Name and slug are required')
      return
    }

    setSaving(true)

    try {
      const response = await fetch('/api/contributors', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: fullName,
          slug,
          primary_role: primaryRole,
          name_variants: nameVariants
            ? nameVariants.split(',').map((v) => v.trim()).filter(Boolean)
            : undefined,
          bio_es: bioEs || undefined,
          bio_en: bioEn || undefined,
          nationality: nationality || undefined,
          birth_year: birthYear || undefined,
          death_year: deathYear || undefined,
          website_url: websiteUrl || undefined,
          translator_specializations:
            primaryRole === 'translator' && translatorSpecializations
              ? translatorSpecializations.split(',').map((v) => v.trim()).filter(Boolean)
              : undefined,
          translator_languages:
            primaryRole === 'translator' && translatorLanguages
              ? translatorLanguages.split(',').map((v) => v.trim()).filter(Boolean)
              : undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create contributor')
      }

      toast.success('Contributor created successfully!')
      router.push(`/dashboard/contributors/${data.contributor.id}`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to create contributor')
    } finally {
      setSaving(false)
    }
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
        <Button onClick={handleCreate} disabled={saving} variant="primary" leadingIcon={Save}>
          {saving ? 'Creating...' : 'Create Contributor'}
        </Button>
      </div>

      {/* Form */}
      <div className="bg-card rounded-none shadow-sm border border-border p-6">
        <h2 className={clsx(TYPOGRAPHY.h3, 'text-foreground mb-6')}>New Contributor</h2>

        <div className="space-y-6">
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
              Auto-generated from name, but you can customize it
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

          {/* Nationality, Birth/Death Year */}
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

          {/* Quick Start Tip */}
          <div className="bg-blue-50 border border-blue-200 rounded-none p-4">
            <p className={clsx(TYPOGRAPHY.bodySmall, 'text-blue-800')}>
              <strong>Tip:</strong> You can add basic information now and fill in the biography
              and other details later.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

