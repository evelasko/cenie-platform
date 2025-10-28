'use client'

import { clsx } from 'clsx'
import { TYPOGRAPHY } from '@/lib/typography'
import { useState } from 'react'

export interface TabbedContentProps {
  tabs: {
    label: string
    content: React.ReactNode
  }[]
}

/**
 * This component is a full width section with the tab contents displayed below the tabs.
 * The switching between tabs is done by clicking on the tab buttons and the content changes with a fade animation.
 * The tabs are displayed as an horizontal list of links (non underlined) styles as TYPOGRAPHY.bodyBase in black 50% opacity.
 * The hover and the active state of the tabs are styled as TYPOGRAPHY.bodyBase in black 90% opacity.
 * The row containing the tabs have a bottom border with a width of 1px and a color of black 10% opacity. However
 * The bottom border of a tab link when active or hovered is colored as black.
 * The tab content is displayed as the content of the tab in full width.
 */
export default function TabbedContent({ tabs }: TabbedContentProps) {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <div className="w-full flex flex-col">
      {/* Tabs */}
      <div className="flex border-b border-black/10">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={clsx(
              TYPOGRAPHY.bodyBase,
              'px-6 py-3 border-b-2 transition-colors',
              activeTab === index
                ? 'text-black/90 border-black'
                : 'text-black/50 border-transparent hover:text-black/90 hover:border-black'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="w-full py-8">
        <div className="animate-fade-in-up">{tabs[activeTab].content}</div>
      </div>
    </div>
  )
}
