'use client'

import { useState } from 'react'
import { clsx } from 'clsx'
import { TYPOGRAPHY } from '@/lib/typography'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import { Loader2 } from 'lucide-react'

export interface AddContributorModalProps {
  isOpen: boolean
  onClose: () => void
  authorName: string
  onSuccess: () => void
}

export default function AddContributorModal({
  isOpen,
  onClose,
  authorName,
  onSuccess,
}: AddContributorModalProps) {
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCreate = async () => {
    setIsCreating(true)
    setError(null)

    try {
      // Generate slug from name (lowercase, replace spaces with hyphens, remove special chars)
      const slug = authorName
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .trim()
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen

      const response = await fetch('/api/contributors', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: authorName,
          slug,
          primary_role: 'author',
        }),
      })

      const data = await response.json()

      if (response.status === 409) {
        // Contributor already exists
        setError('This contributor already exists in the database')
        return
      }

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create contributor')
      }

      // Success!
      onSuccess()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create contributor')
    } finally {
      setIsCreating(false)
    }
  }

  const handleClose = () => {
    if (!isCreating) {
      setError(null)
      onClose()
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add Contributor"
      size="sm"
      footer={
        <>
          <Button onClick={handleClose} variant="outlined" disabled={isCreating}>
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            variant="primary"
            disabled={isCreating}
            leadingIcon={isCreating ? Loader2 : undefined}
          >
            {isCreating ? 'Adding...' : 'Add Contributor'}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <p className={clsx(TYPOGRAPHY.bodyBase, 'text-foreground')}>
          Do you want to add <strong>{authorName}</strong> as a contributor to the database?
        </p>

        <div className="bg-muted/50 border border-border rounded-none p-4">
          <dl className={clsx(TYPOGRAPHY.bodySmall, 'space-y-2')}>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Name:</dt>
              <dd className="font-medium text-foreground">{authorName}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Role:</dt>
              <dd className="font-medium text-foreground">Author</dd>
            </div>
          </dl>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-none p-3">
            <p className={clsx(TYPOGRAPHY.bodySmall, 'text-destructive')}>{error}</p>
          </div>
        )}

        <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground')}>
          This will create a new contributor record that can be used across the CENIE Editorial catalog.
        </p>
      </div>
    </Modal>
  )
}

