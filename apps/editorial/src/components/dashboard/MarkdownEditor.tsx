'use client'

import dynamic from 'next/dynamic'
import { Loader2 } from 'lucide-react'

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center p-8 border border-border">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  ),
})

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  height?: number
  preview?: 'edit' | 'preview' | 'live'
  placeholder?: string
}

export function MarkdownEditor({
  value,
  onChange,
  height = 300,
  preview = 'live',
  placeholder,
}: MarkdownEditorProps) {
  return (
    <div data-color-mode="light">
      <MDEditor
        value={value}
        onChange={(val) => onChange(val || '')}
        height={height}
        preview={preview}
        textareaProps={{ placeholder }}
      />
    </div>
  )
}
