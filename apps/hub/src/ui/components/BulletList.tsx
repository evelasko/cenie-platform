'use client'
/*
 * Documentation:
 * BulletList — A semantic unordered list component that wraps BulletListItem components
 * Provides proper HTML structure for accessibility and SEO
 */

import React from 'react'
import * as SubframeUtils from '../utils'

interface BulletListProps extends React.HTMLAttributes<HTMLUListElement> {
  children: React.ReactNode
  className?: string
}

const BulletListRoot = React.forwardRef<HTMLUListElement, BulletListProps>(function BulletListRoot(
  { children, className, ...otherProps }: BulletListProps,
  ref
) {
  return (
    <ul
      className={SubframeUtils.twClassNames('flex flex-col gap-4 w-full list-none', className)}
      ref={ref}
      {...otherProps}
    >
      {children}
    </ul>
  )
})

export const BulletList = BulletListRoot
