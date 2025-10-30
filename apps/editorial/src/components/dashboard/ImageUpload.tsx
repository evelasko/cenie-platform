'use client'

import { useState, useRef, useCallback } from 'react'
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react'
import { clsx } from 'clsx'
import { TYPOGRAPHY } from '@/lib/typography'
import { useToast } from '@/components/ui/ToastContainer'
import Button from '@/components/ui/Button'

export interface ImageUploadProps {
  onUpload: (path: string, url: string) => void
  currentImageUrl?: string | null
  type: 'cover' | 'photo'
  label?: string
}

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

/**
 * ImageUpload Component
 *
 * Reusable component for uploading book covers or contributor photos.
 * Features drag-and-drop, preview, and validation.
 */
export function ImageUpload({ onUpload, currentImageUrl, type, label }: ImageUploadProps) {
  const toast = useToast()
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null)
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): string | null => {
    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'Invalid file type. Please upload JPG, PNG, or WebP images.'
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return 'File size exceeds 5MB. Please upload a smaller image.'
    }

    return null
  }

  const handleFile = useCallback(
    async (file: File) => {
      const validationError = validateFile(file)
      if (validationError) {
        toast.error(validationError)
        return
      }

      // Show preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)

      // Upload file
      setUploading(true)

      try {
        const formData = new FormData()
        formData.append('file', file)

        const endpoint = type === 'cover' ? '/api/upload/cover' : '/api/upload/photo'
        const response = await fetch(endpoint, {
          method: 'POST',
          credentials: 'include',
          body: formData,
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Upload failed')
        }

        // Call onUpload callback with the returned path and URL
        onUpload(data.twicpics_path, data.display_url)

        toast.success(
          type === 'cover' ? 'Cover uploaded successfully!' : 'Photo uploaded successfully!'
        )
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to upload image')
        // Reset preview on error
        setPreview(currentImageUrl || null)
      } finally {
        setUploading(false)
      }
    },
    [type, onUpload, toast, currentImageUrl]
  )

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFile(e.dataTransfer.files[0])
      }
    },
    [handleFile]
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault()
      if (e.target.files && e.target.files[0]) {
        handleFile(e.target.files[0])
      }
    },
    [handleFile]
  )

  const handleRemove = useCallback(() => {
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    // Clear the image by passing empty strings
    onUpload('', '')
  }, [onUpload])

  const isCover = type === 'cover'

  return (
    <div className="space-y-3">
      {label && (
        <label className={clsx(TYPOGRAPHY.bodySmall, 'block font-medium text-foreground')}>
          {label}
        </label>
      )}

      {/* Preview */}
      {preview && (
        <div className="relative inline-block">
          <div
            className={clsx(
              'relative overflow-hidden border-2 border-border',
              isCover ? 'w-32 h-48' : 'w-32 h-32'
            )}
          >
            <img
              src={preview}
              alt={isCover ? 'Book cover preview' : 'Contributor photo preview'}
              className={clsx('w-full h-full object-cover', isCover ? '' : 'rounded-full')}
            />
          </div>
          {!uploading && (
            <button
              type="button"
              onClick={handleRemove}
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-white flex items-center justify-center hover:bg-destructive/90 transition-colors"
              aria-label="Remove image"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      )}

      {/* Upload Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={clsx(
          'border-2 border-dashed rounded-none transition-colors',
          dragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50',
          preview ? 'hidden' : ''
        )}
      >
        <div className="p-8 text-center">
          {uploading ? (
            <>
              <Loader2 className="h-8 w-8 text-primary mx-auto mb-2 animate-spin" />
              <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground')}>Uploading...</p>
            </>
          ) : (
            <>
              <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground mb-2')}>
                Drag and drop an image here, or
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept={ALLOWED_TYPES.join(',')}
                onChange={handleChange}
                className="hidden"
                id={`image-upload-${type}`}
                disabled={uploading}
              />
              <label htmlFor={`image-upload-${type}`} className="cursor-pointer inline-block">
                <Button variant="outlined" size="sm" leadingIcon={ImageIcon}>
                  Browse Files
                </Button>
              </label>
              <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground mt-2')}>
                JPG, PNG, or WebP up to 5MB
              </p>
            </>
          )}
        </div>
      </div>

      {/* Replace Button (shown when preview exists) */}
      {preview && !uploading && (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept={ALLOWED_TYPES.join(',')}
            onChange={handleChange}
            className="hidden"
            id={`image-replace-${type}`}
            disabled={uploading}
          />
          <label htmlFor={`image-replace-${type}`} className="cursor-pointer inline-block">
            <Button variant="outlined" size="sm" leadingIcon={Upload}>
              Replace Image
            </Button>
          </label>
        </div>
      )}
    </div>
  )
}
