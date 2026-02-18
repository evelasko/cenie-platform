'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, Library, BookHeart, Loader2, X } from 'lucide-react'
import { clsx } from 'clsx'
import { TYPOGRAPHY } from '@/lib/typography'
import { getCoverPlaceholder } from '@/lib/cover-placeholder'
import type { CatalogVolume } from '@/types/books'

export default function DashboardPage() {
  // Hero selector state
  const [publishedVolumes, setPublishedVolumes] = useState<CatalogVolume[]>([])
  const [currentHero, setCurrentHero] = useState<CatalogVolume | null>(null)
  const [selectedVolumeId, setSelectedVolumeId] = useState<string>('')
  const [heroLoading, setHeroLoading] = useState(true)
  const [heroSaving, setHeroSaving] = useState(false)
  const [heroError, setHeroError] = useState<string | null>(null)

  useEffect(() => {
    fetchPublishedVolumes()
    fetchCurrentHero()
  }, [])

  const fetchPublishedVolumes = async () => {
    try {
      const response = await fetch('/api/catalog?status=published&limit=100', {
        credentials: 'include',
      })
      const data = await response.json()
      if (response.ok) {
        setPublishedVolumes(data.volumes || [])
      }
    } catch {
      // Non-critical; selector will just be empty
    }
  }

  const fetchCurrentHero = async () => {
    setHeroLoading(true)
    try {
      const response = await fetch('/api/catalog/hero', { credentials: 'include' })
      const data = await response.json()
      if (response.ok && data.volume) {
        setCurrentHero(data.volume)
        setSelectedVolumeId(data.volume.id)
      } else {
        setCurrentHero(null)
      }
    } catch {
      setCurrentHero(null)
    } finally {
      setHeroLoading(false)
    }
  }

  const saveHero = async () => {
    if (!selectedVolumeId) return
    setHeroSaving(true)
    setHeroError(null)
    try {
      const response = await fetch('/api/catalog/hero', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ volume_id: selectedVolumeId }),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Failed to set hero')
      }
      setCurrentHero(data.volume)
    } catch (err) {
      setHeroError(err instanceof Error ? err.message : 'Failed to save hero')
    } finally {
      setHeroSaving(false)
    }
  }

  const clearHero = async () => {
    setHeroSaving(true)
    setHeroError(null)
    try {
      const response = await fetch('/api/catalog/hero', {
        method: 'DELETE',
        credentials: 'include',
      })
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to clear hero')
      }
      setCurrentHero(null)
      setSelectedVolumeId('')
    } catch (err) {
      setHeroError(err instanceof Error ? err.message : 'Failed to clear hero')
    } finally {
      setHeroSaving(false)
    }
  }

  const coverSrc =
    currentHero?.cover_url || currentHero?.cover_fallback_url || getCoverPlaceholder()

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-card rounded-none shadow-sm border border-border p-6">
        <h2 className={clsx(TYPOGRAPHY.h2, 'text-foreground mb-2')}>Welcome to CENIE Editorial</h2>
        <p className={clsx(TYPOGRAPHY.bodyBase, 'text-muted-foreground')}>
          Manage and curate performing arts books for translation from English to Spanish.
        </p>
      </div>

      {/* Hero Book Selector */}
      <div className="bg-card rounded-none shadow-sm border border-border p-6">
        <div className="flex items-center space-x-3 mb-5">
          <div className="p-2 bg-primary/10 rounded-none">
            <BookHeart className="h-5 w-5 text-primary" />
          </div>
          <h3 className={clsx(TYPOGRAPHY.h4, 'text-foreground')}>Hero Book</h3>
        </div>

        <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground mb-4')}>
          Select the published book to feature prominently on the homepage hero section.
        </p>

        {heroLoading ? (
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className={TYPOGRAPHY.bodySmall}>Loading…</span>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Selector row */}
            <div className="flex flex-col lg:flex-row gap-3">
              <select
                value={selectedVolumeId}
                onChange={(e) => setSelectedVolumeId(e.target.value)}
                disabled={heroSaving}
                className={clsx(
                  TYPOGRAPHY.bodySmall,
                  'flex-1 border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50'
                )}
              >
                <option value="">— Select a published volume —</option>
                {publishedVolumes.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.title}
                    {v.authors_display ? ` — ${v.authors_display}` : ''}
                  </option>
                ))}
              </select>

              <button
                onClick={saveHero}
                disabled={!selectedVolumeId || heroSaving}
                className={clsx(
                  TYPOGRAPHY.bodySmall,
                  'px-5 py-2 bg-primary text-white hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                )}
              >
                {heroSaving ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Saving…
                  </span>
                ) : (
                  'Save'
                )}
              </button>

              {currentHero && (
                <button
                  onClick={clearHero}
                  disabled={heroSaving}
                  className={clsx(
                    TYPOGRAPHY.bodySmall,
                    'flex items-center gap-1.5 px-4 py-2 border border-border text-muted-foreground hover:border-destructive hover:text-destructive transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                  )}
                >
                  <X className="h-3 w-3" />
                  Clear Hero
                </button>
              )}
            </div>

            {/* Error */}
            {heroError && (
              <p className={clsx(TYPOGRAPHY.bodySmall, 'text-destructive')}>{heroError}</p>
            )}

            {/* Current hero preview */}
            {currentHero && (
              <div className="flex items-center gap-4 pt-2 border-t border-border">
                <div className="relative w-10 aspect-2/3 shrink-0">
                  <Image
                    src={coverSrc}
                    alt={currentHero.title}
                    fill
                    className="object-contain"
                    sizes="40px"
                  />
                </div>
                <div>
                  <p className={clsx(TYPOGRAPHY.bodySmall, 'font-medium text-foreground')}>
                    {currentHero.title}
                  </p>
                  {currentHero.authors_display && (
                    <p className={clsx(TYPOGRAPHY.caption, 'text-muted-foreground')}>
                      {currentHero.authors_display}
                    </p>
                  )}
                </div>
              </div>
            )}

            {!currentHero && !heroLoading && (
              <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground italic')}>
                No hero book is currently set.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/dashboard/books/search"
          className="group bg-card rounded-none shadow-sm border border-border p-6 hover:shadow-md hover:border-primary transition-all"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-primary/10 rounded-none group-hover:bg-primary/20 transition-colors">
                  <Search className="h-6 w-6 text-primary" />
                </div>
                <h3 className={clsx(TYPOGRAPHY.h4, 'text-foreground')}>Search Books</h3>
              </div>
              <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground')}>
                Search Google Books API to find new titles for potential translation
              </p>
            </div>
          </div>
        </Link>

        <Link
          href="/dashboard/books"
          className="group bg-card rounded-none shadow-sm border border-border p-6 hover:shadow-md hover:border-secondary transition-all"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-secondary/10 rounded-none group-hover:bg-secondary/20 transition-colors">
                  <Library className="h-6 w-6 text-secondary" />
                </div>
                <h3 className={clsx(TYPOGRAPHY.h4, 'text-foreground')}>Manage Books</h3>
              </div>
              <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground')}>
                View and manage all books in the editorial workflow
              </p>
            </div>
          </div>
        </Link>
      </div>

      {/* Getting Started Guide */}
      <div className="bg-card rounded-none shadow-sm border border-border p-6">
        <h3 className={clsx(TYPOGRAPHY.h4, 'text-foreground mb-4')}>Getting Started</h3>
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold text-sm">
              1
            </div>
            <div>
              <h4 className={clsx(TYPOGRAPHY.h6, 'font-medium text-foreground')}>
                Search for Books
              </h4>
              <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground')}>
                Use the search tool to find performing arts books in English from Google Books
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold text-sm">
              2
            </div>
            <div>
              <h4 className={clsx(TYPOGRAPHY.h6, 'font-medium text-foreground')}>
                Add to Database
              </h4>
              <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground')}>
                Select books that are potentially relevant for translation
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold text-sm">
              3
            </div>
            <div>
              <h4 className={clsx(TYPOGRAPHY.h6, 'font-medium text-foreground')}>
                Review and Evaluate
              </h4>
              <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground')}>
                Assess books for marketability, relevance, and translation priority
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold text-sm">
              4
            </div>
            <div>
              <h4 className={clsx(TYPOGRAPHY.h6, 'font-medium text-foreground')}>
                Select for Translation
              </h4>
              <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground')}>
                Mark books as selected and move them through the translation workflow
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Workflow Status Overview */}
      <div className="bg-card rounded-none shadow-sm border border-border p-6">
        <h3 className={clsx(TYPOGRAPHY.h4, 'text-foreground mb-4')}>Editorial Workflow</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="text-center">
            <div className={clsx(TYPOGRAPHY.display2, 'text-muted-foreground')}>-</div>
            <div className={clsx(TYPOGRAPHY.caption, 'text-muted-foreground mt-1')}>Discovered</div>
          </div>
          <div className="text-center">
            <div className={clsx(TYPOGRAPHY.display2, 'text-secondary')}>-</div>
            <div className={clsx(TYPOGRAPHY.caption, 'text-muted-foreground mt-1')}>
              Under Review
            </div>
          </div>
          <div className="text-center">
            <div className={clsx(TYPOGRAPHY.display2, 'text-primary')}>-</div>
            <div className={clsx(TYPOGRAPHY.caption, 'text-muted-foreground mt-1')}>Selected</div>
          </div>
          <div className="text-center">
            <div className={clsx(TYPOGRAPHY.display2, 'text-secondary')}>-</div>
            <div className={clsx(TYPOGRAPHY.caption, 'text-muted-foreground mt-1')}>
              In Translation
            </div>
          </div>
          <div className="text-center">
            <div className={clsx(TYPOGRAPHY.display2, 'text-primary')}>-</div>
            <div className={clsx(TYPOGRAPHY.caption, 'text-muted-foreground mt-1')}>Published</div>
          </div>
          <div className="text-center">
            <div className={clsx(TYPOGRAPHY.display2, 'text-destructive')}>-</div>
            <div className={clsx(TYPOGRAPHY.caption, 'text-muted-foreground mt-1')}>Rejected</div>
          </div>
        </div>
      </div>
    </div>
  )
}
