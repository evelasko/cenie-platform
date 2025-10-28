'use client'

import { clsx } from 'clsx'
import { TYPOGRAPHY } from '@/lib/typography'
import { useState, useMemo } from 'react'
import { CircleMinus, CirclePlus } from 'lucide-react'

/**
 * This component is a single column with the quote in a row before the foreword.
 * Both props are markdown formatted with elements like bold, italic, multiline paragraphs, etc.
 * The quote is displayed as TYPOGRAPHY.display2 in black.
 * The foreword is displayed as TYPOGRAPHY.bodyLarge in black 90% opacity.
 * Similarily to the view more toggle button in the BookPraiseItem component, if the foreword has
 * over 300 chaaracters, it must be truncated to the next dot and the toggle button to view more must be displayed.
 * @param quote - The quote from the foreword (markdown formatted)
 * @param foreword - The foreword text (markdown formatted)
 * @returns
 */
export default function BookForeword({ quote, foreword }: { quote: string; foreword: string }) {
  const [isExpanded, setIsExpanded] = useState(false)

  // Truncate foreword to around 300-500 characters to the last dot
  const { displayText, isTruncated } = useMemo(() => {
    if (foreword.length <= 300) {
      return { displayText: foreword, isTruncated: false }
    }

    // Find the last dot between 300 and 500 characters
    let truncateIndex = -1
    for (let i = 300; i <= Math.min(500, foreword.length); i++) {
      if (foreword[i] === '.') {
        truncateIndex = i + 1 // Include the dot
      }
    }

    // If no dot found, truncate at 300 characters
    if (truncateIndex === -1) {
      truncateIndex = 300
    }

    return {
      displayText: foreword.substring(0, truncateIndex),
      isTruncated: true,
    }
  }, [foreword])

  return (
    <div className="flex flex-col gap-6">
      {/* Quote */}
      <div
        className={clsx(TYPOGRAPHY.display2, 'text-black')}
        dangerouslySetInnerHTML={{ __html: quote }}
      />

      {/* Foreword */}
      <div
        className={clsx(TYPOGRAPHY.bodyLarge, 'text-black/90')}
        dangerouslySetInnerHTML={{ __html: isExpanded ? foreword : displayText }}
      />

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
