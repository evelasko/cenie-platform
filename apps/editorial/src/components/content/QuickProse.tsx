'use client'

import { useMemo, useState } from 'react'
import { Prose } from './Prose'
import { splitMarkdownBlocks } from '@/lib/split-markdown'

interface QuickProseProps {
  content: string
  /** Number of top-level markdown blocks to show before truncation. Default: 3 */
  truncateAfter?: number
  className?: string
  expandLabel?: string
  collapseLabel?: string
}

export function QuickProse({
  content,
  truncateAfter = 3,
  className,
  expandLabel = 'Leer más',
  collapseLabel = 'Leer menos',
}: QuickProseProps) {
  const [expanded, setExpanded] = useState(false)

  const { preview, rest } = useMemo(
    () => splitMarkdownBlocks(content, truncateAfter),
    [content, truncateAfter]
  )

  if (!rest) {
    return <Prose content={content} className={className} />
  }

  return (
    <div className={className}>
      <Prose content={preview} />

      <div className={`prose-rest${expanded ? ' expanded' : ''}`}>
        <div>
          <Prose content={rest} />
        </div>
      </div>

      <button
        onClick={() => setExpanded((prev) => !prev)}
        className="mt-4 type-label text-primary hover:text-primary/80 transition-colors underline underline-offset-4"
        aria-expanded={expanded}
      >
        {expanded ? collapseLabel : expandLabel}
      </button>
    </div>
  )
}
