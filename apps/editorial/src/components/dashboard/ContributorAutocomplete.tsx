'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, User, Plus, X } from 'lucide-react'
import { clsx } from 'clsx'
import { TYPOGRAPHY } from '@/lib/typography'
import { getContributorPhotoUrl } from '@/lib/twicpics'
import type { ContributorRole } from '@/types/books'
import Link from 'next/link'
import { logger } from '@/lib/logger-client'

interface ContributorSuggestion {
  id: string
  full_name: string
  slug: string
  primary_role: ContributorRole
  photo_url?: string | null
  photo_twicpics_path?: string | null
  nationality?: string | null
}

interface ContributorAutocompleteProps {
  onSelect: (contributor: ContributorSuggestion) => void
  selectedContributors?: ContributorSuggestion[]
  onRemove?: (contributorId: string) => void
  roleFilter?: ContributorRole
  placeholder?: string
  label?: string
  multiple?: boolean
}

export function ContributorAutocomplete({
  onSelect,
  selectedContributors = [],
  onRemove,
  roleFilter,
  placeholder = 'Search for a contributor...',
  label = 'Contributor',
  multiple = false,
}: ContributorAutocompleteProps) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<ContributorSuggestion[]>([])
  const [loading, setLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Click outside to close suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Fetch suggestions when query changes
  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    const timer = setTimeout(() => {
      fetchSuggestions()
    }, 300)

    return () => clearTimeout(timer)
  }, [query, roleFilter])

  const fetchSuggestions = async () => {
    setLoading(true)

    try {
      const params = new URLSearchParams({ q: query, limit: '10' })
      if (roleFilter) {
        params.set('role', roleFilter)
      }

      const response = await fetch(`/api/contributors/search?${params}`, {
        credentials: 'include',
      })

      const data = await response.json()

      if (response.ok) {
        // Filter out already selected contributors
        const filtered = data.contributors.filter(
          (c: ContributorSuggestion) =>
            !selectedContributors.find((selected) => selected.id === c.id)
        )
        setSuggestions(filtered)
        setShowSuggestions(true)
      }
    } catch (error) {
      logger.error('Failed to fetch suggestions', { error })
    } finally {
      setLoading(false)
    }
  }

  const handleSelect = (contributor: ContributorSuggestion) => {
    onSelect(contributor)
    setQuery('')
    setSuggestions([])
    setShowSuggestions(false)
  }

  const handleRemove = (contributorId: string) => {
    if (onRemove) {
      onRemove(contributorId)
    }
  }

  return (
    <div className="space-y-3">
      <label className={clsx(TYPOGRAPHY.bodySmall, 'block font-medium text-foreground')}>
        {label}
      </label>

      {/* Selected Contributors (for multiple mode) */}
      {multiple && selectedContributors.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedContributors.map((contributor) => (
            <div
              key={contributor.id}
              className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full"
            >
              <span className={clsx(TYPOGRAPHY.bodySmall)}>{contributor.full_name}</span>
              <button
                type="button"
                onClick={() => handleRemove(contributor.id)}
                className="hover:text-primary/80"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Single Selected Contributor */}
      {!multiple && selectedContributors.length > 0 && (
        <div className="flex items-center justify-between p-3 border border-border rounded-none bg-muted">
          <div className="flex items-center gap-3">
            {(() => {
              const photoUrl = selectedContributors[0].photo_twicpics_path
                ? getContributorPhotoUrl(selectedContributors[0].photo_twicpics_path, 200)
                : selectedContributors[0].photo_url
              return photoUrl ? (
                <img
                  src={photoUrl}
                  alt={selectedContributors[0].full_name}
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-muted-foreground/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-muted-foreground" />
                </div>
              )
            })()}
            <div>
              <p className={clsx(TYPOGRAPHY.bodyBase, 'font-medium text-foreground')}>
                {selectedContributors[0].full_name}
              </p>
              <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground')}>
                {selectedContributors[0].primary_role}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => handleRemove(selectedContributors[0].id)}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Search Input (only show if not selected or multiple mode) */}
      {(multiple || selectedContributors.length === 0) && (
        <div className="relative" ref={containerRef}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => query.length >= 2 && setShowSuggestions(true)}
              placeholder={placeholder}
              className={clsx(
                TYPOGRAPHY.bodyBase,
                'w-full pl-10 pr-3 py-2 border border-border rounded-none focus:outline-none focus:ring-2 focus:ring-primary'
              )}
            />
          </div>

          {/* Suggestions Dropdown */}
          {showSuggestions && (
            <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-none shadow-lg max-h-64 overflow-y-auto">
              {loading && (
                <div className="p-4 text-center">
                  <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground')}>
                    Searching...
                  </p>
                </div>
              )}

              {!loading && suggestions.length === 0 && query.length >= 2 && (
                <div className="p-4 text-center">
                  <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground mb-2')}>
                    No contributors found for "{query}"
                  </p>
                  <Link
                    href="/dashboard/contributors/new"
                    className={clsx(
                      TYPOGRAPHY.bodySmall,
                      'inline-flex items-center gap-1 text-primary hover:text-primary/80'
                    )}
                  >
                    <Plus className="h-3 w-3" />
                    Create new contributor
                  </Link>
                </div>
              )}

              {!loading &&
                suggestions.map((suggestion) => (
                  <button
                    key={suggestion.id}
                    type="button"
                    onClick={() => handleSelect(suggestion)}
                    className="w-full px-4 py-3 hover:bg-muted transition-colors flex items-center gap-3 border-b border-border last:border-b-0"
                  >
                    {(() => {
                      const photoUrl = suggestion.photo_twicpics_path
                        ? getContributorPhotoUrl(suggestion.photo_twicpics_path, 200)
                        : suggestion.photo_url
                      return photoUrl ? (
                        <img
                          src={photoUrl}
                          alt={suggestion.full_name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                          <User className="h-5 w-5 text-muted-foreground" />
                        </div>
                      )
                    })()}
                    <div className="flex-1 text-left">
                      <p className={clsx(TYPOGRAPHY.bodyBase, 'font-medium text-foreground')}>
                        {suggestion.full_name}
                      </p>
                      <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground')}>
                        {suggestion.primary_role}
                        {suggestion.nationality && ` • ${suggestion.nationality}`}
                      </p>
                    </div>
                  </button>
                ))}
            </div>
          )}
        </div>
      )}

      {/* Create New Link */}
      <Link
        href="/dashboard/contributors/new"
        className={clsx(
          TYPOGRAPHY.bodySmall,
          'inline-flex items-center gap-1 text-primary hover:text-primary/80'
        )}
      >
        <Plus className="h-3 w-3" />
        Create new contributor
      </Link>
    </div>
  )
}
