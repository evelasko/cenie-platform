'use client'

import { clsx } from 'clsx'
import { TYPOGRAPHY } from '@/lib/typography'
import { useState, useMemo } from 'react'
import { CircleMinus, CirclePlus } from 'lucide-react'

interface BookPraiseItemProps {
  text: string
  author: string
}

/**
 * This component is a block with background rgb(240, 242, 245) and padding 12px. It holds a single column
 * with the text in TYPOGRAPHY.bodyBase in rgb(13, 13, 13) truncated to around 300/500 characters to the last dot if the text is over 300 characters.
 * And right below, a row with the author in TYPOGRAPHY.bodyBase in black 80% opacity.
 * If the text is truncated, there should be another row with a text button `view more` that toggles the full text
 * display.
 *
 * @param text - The text of the praise
 * @param author - The author of the praise
 * @returns
 */
export default function BookPraiseItem({ text, author }: BookPraiseItemProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  // Truncate text to around 300-500 characters to the last dot
  const { displayText, isTruncated } = useMemo(() => {
    if (text.length <= 300) {
      return { displayText: text, isTruncated: false }
    }

    // Find the last dot between 300 and 500 characters
    let truncateIndex = -1
    for (let i = 300; i <= Math.min(500, text.length); i++) {
      if (text[i] === '.') {
        truncateIndex = i + 1 // Include the dot
      }
    }

    // If no dot found, truncate at 300 characters
    if (truncateIndex === -1) {
      truncateIndex = 300
    }

    return {
      displayText: text.substring(0, truncateIndex),
      isTruncated: true,
    }
  }, [text])

  return (
    <div className="flex flex-col gap-3 p-3" style={{ backgroundColor: 'rgb(240, 242, 245)' }}>
      {/* Praise Text */}
      <p className={clsx(TYPOGRAPHY.bodyBase)} style={{ color: 'rgb(13, 13, 13)' }}>
        {isExpanded ? text : displayText}
      </p>

      {/* Author */}
      <p className={clsx(TYPOGRAPHY.bodyBase, 'text-black/80')}>{author}</p>

      {/* View More/Less Toggle */}
      {isTruncated && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={clsx(
            TYPOGRAPHY.bodySmall,
            'text-black/50 underline text-left flex items-center gap-2'
          )}
        >
          {isExpanded ? (
            <CircleMinus className="w-4 h-4 text-black/30" />
          ) : (
            <CirclePlus className="w-4 h-4 text-black/30" />
          )}
          {isExpanded ? 'view less' : 'view more'}
        </button>
      )}
    </div>
  )
}
