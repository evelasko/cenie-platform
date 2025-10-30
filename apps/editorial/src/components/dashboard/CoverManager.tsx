'use client'

import { useState, useEffect, useRef } from 'react'
import { Upload, Image as ImageIcon, Loader2, X, Check, Search } from 'lucide-react'
import { clsx } from 'clsx'
import { TYPOGRAPHY } from '@/lib/typography'
import Button from '@/components/ui/Button'

interface CoverFile {
  filename: string
  path: string
  thumbnail_url: string
  medium_url: string
  full_url: string
  size_bytes: number
  size_readable: string
  modified: string
}

interface CoverManagerProps {
  currentCoverPath?: string
  currentCoverUrl?: string
  slug: string // Publication slug for naming uploaded file
  onSelect: (path: string, url: string) => void
  label?: string
}

export function CoverManager({
  currentCoverPath,
  currentCoverUrl,
  slug,
  onSelect,
  label = 'Book Cover',
}: CoverManagerProps) {
  const [activeTab, setActiveTab] = useState<'upload' | 'browse'>('upload')
  const [uploading, setUploading] = useState(false)
  const [loadingFiles, setLoadingFiles] = useState(false)
  const [availableFiles, setAvailableFiles] = useState<CoverFile[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load available files when browse tab is activated
  useEffect(() => {
    if (activeTab === 'browse') {
      loadAvailableFiles()
    }
  }, [activeTab])

  const loadAvailableFiles = async () => {
    setLoadingFiles(true)

    try {
      const params = new URLSearchParams()
      if (searchQuery) {
        params.set('search', searchQuery)
      }

      const response = await fetch(`/api/files/covers?${params}`, {
        credentials: 'include',
      })

      const data = await response.json()

      if (response.ok) {
        setAvailableFiles(data.files || [])
      }
    } catch (error) {
      console.error('Failed to load covers:', error)
    } finally {
      setLoadingFiles(false)
    }
  }

  // Reload files when search changes
  useEffect(() => {
    if (activeTab === 'browse') {
      const timer = setTimeout(() => {
        loadAvailableFiles()
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [searchQuery, activeTab])

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0])
    }
  }

  const handleFileUpload = async (file: File) => {
    if (!slug) {
      alert('Cannot upload: Publication slug is required')
      return
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      alert('Invalid file type. Only JPG, PNG, and WebP are allowed.')
      return
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds maximum allowed size of 5MB')
      return
    }

    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('slug', slug)

      const response = await fetch('/api/upload/cover', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed')
      }

      onSelect(data.twicpics_path, data.display_url)

      if (data.overwritten) {
        alert(`Cover updated successfully! (Replaced existing ${data.filename})`)
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleSelectExisting = (file: CoverFile) => {
    setSelectedFile(file.path)
    onSelect(file.path, file.medium_url)
  }

  const handleRemoveCover = () => {
    if (confirm('Remove cover image?')) {
      onSelect('', '')
    }
  }

  const filteredFiles = searchQuery
    ? availableFiles.filter((f) => f.filename.toLowerCase().includes(searchQuery.toLowerCase()))
    : availableFiles

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className={clsx(TYPOGRAPHY.bodySmall, 'block font-medium text-foreground')}>
          {label}
        </label>
        {currentCoverPath && (
          <button
            type="button"
            onClick={handleRemoveCover}
            className={clsx(
              TYPOGRAPHY.bodySmall,
              'text-destructive hover:text-destructive/80 flex items-center gap-1'
            )}
          >
            <X className="h-3 w-3" />
            Remove Cover
          </button>
        )}
      </div>

      {/* Current Cover Preview */}
      {currentCoverUrl && (
        <div className="border border-border rounded-none p-4 bg-muted">
          <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground mb-2')}>
            Current Cover:
          </p>
          <div className="flex items-start gap-4">
            <img
              src={currentCoverUrl}
              alt="Current cover"
              className="w-32 h-48 object-cover rounded-none border border-border"
            />
            <div className="flex-1">
              <p className={clsx(TYPOGRAPHY.bodySmall, 'text-foreground font-mono')}>
                {currentCoverPath}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-border flex">
        <button
          type="button"
          onClick={() => setActiveTab('upload')}
          className={clsx(
            TYPOGRAPHY.bodyBase,
            'px-4 py-2 border-b-2 transition-colors',
            activeTab === 'upload'
              ? 'border-primary text-primary font-medium'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          )}
        >
          Upload New
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('browse')}
          className={clsx(
            TYPOGRAPHY.bodyBase,
            'px-4 py-2 border-b-2 transition-colors',
            activeTab === 'browse'
              ? 'border-primary text-primary font-medium'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          )}
        >
          Browse Existing ({availableFiles.length})
        </button>
      </div>

      {/* Upload Tab */}
      {activeTab === 'upload' && (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            accept="image/jpeg,image/jpg,image/png,image/webp"
            className="hidden"
          />

          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={clsx(
              'border-2 border-dashed rounded-none p-12 text-center cursor-pointer transition-colors',
              dragActive
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50 hover:bg-muted'
            )}
          >
            {uploading ? (
              <div>
                <Loader2 className="h-12 w-12 text-primary mx-auto mb-4 animate-spin" />
                <p className={clsx(TYPOGRAPHY.bodyBase, 'text-foreground')}>Uploading...</p>
              </div>
            ) : (
              <div>
                <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className={clsx(TYPOGRAPHY.bodyBase, 'text-foreground mb-2')}>
                  Drop cover image here or click to browse
                </p>
                <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground mb-2')}>
                  JPG, PNG, or WebP • Max 5MB
                </p>
                <p className={clsx(TYPOGRAPHY.bodySmall, 'text-primary font-mono')}>
                  Will be saved as: {slug}.jpg
                </p>
              </div>
            )}
          </div>

          {!slug && (
            <p className={clsx(TYPOGRAPHY.bodySmall, 'text-destructive mt-2')}>
              Warning: Slug is required for upload. Set a title first to auto-generate the slug.
            </p>
          )}
        </div>
      )}

      {/* Browse Tab */}
      {activeTab === 'browse' && (
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search covers by filename..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={clsx(
                TYPOGRAPHY.bodyBase,
                'w-full pl-10 pr-3 py-2 border border-border rounded-none focus:outline-none focus:ring-2 focus:ring-primary'
              )}
            />
          </div>

          {/* Files Grid */}
          {loadingFiles ? (
            <div className="text-center py-12">
              <Loader2 className="h-8 w-8 text-primary mx-auto mb-2 animate-spin" />
              <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground')}>
                Loading covers...
              </p>
            </div>
          ) : filteredFiles.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-border rounded-none">
              <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className={clsx(TYPOGRAPHY.bodyBase, 'text-foreground mb-1')}>
                {searchQuery ? 'No covers match your search' : 'No covers available'}
              </p>
              <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground')}>
                {searchQuery
                  ? 'Try a different search term'
                  : 'Upload a cover or add files to public/images/covers/'}
              </p>
            </div>
          ) : (
            <div className="border border-border rounded-none max-h-96 overflow-y-auto">
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
                {filteredFiles.map((file) => (
                  <button
                    key={file.path}
                    type="button"
                    onClick={() => handleSelectExisting(file)}
                    className={clsx(
                      'relative group border-2 rounded-none overflow-hidden transition-all hover:shadow-lg',
                      selectedFile === file.path || currentCoverPath === file.path
                        ? 'border-primary'
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    {/* Selected Indicator */}
                    {(selectedFile === file.path || currentCoverPath === file.path) && (
                      <div className="absolute top-1 right-1 bg-primary text-white rounded-full p-1 z-10">
                        <Check className="h-3 w-3" />
                      </div>
                    )}

                    {/* Thumbnail */}
                    <div className="aspect-[2/3] relative">
                      <img
                        src={file.thumbnail_url}
                        alt={file.filename}
                        className="w-full h-full object-cover"
                      />
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className={clsx(TYPOGRAPHY.bodySmall, 'text-white')}>
                          Select
                        </span>
                      </div>
                    </div>

                    {/* File Info */}
                    <div className="p-2 bg-muted">
                      <p
                        className={clsx(
                          TYPOGRAPHY.bodySmall,
                          'text-foreground truncate font-mono text-xs'
                        )}
                        title={file.filename}
                      >
                        {file.filename}
                      </p>
                      <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground text-xs')}>
                        {file.size_readable}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Results Info */}
          {filteredFiles.length > 0 && (
            <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground text-center')}>
              Showing {filteredFiles.length} cover{filteredFiles.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      )}

      {/* Helper Text */}
      <div className="bg-blue-50 border border-blue-200 rounded-none p-3">
        <p className={clsx(TYPOGRAPHY.bodySmall, 'text-blue-800')}>
          <strong>Tip:</strong>{' '}
          {activeTab === 'upload' ? (
            <>
              Upload will save as <code className="font-mono">{slug}.jpg</code>. If a file with
              this name exists, it will be replaced.
            </>
          ) : (
            <>
              Select an existing cover from your <code className="font-mono">public/images/covers/</code> folder,
              or switch to Upload to add a new one.
            </>
          )}
        </p>
      </div>
    </div>
  )
}

