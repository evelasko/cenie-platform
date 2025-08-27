'use client'
/*
 * Documentation:
 * DarkSection — https://app.subframe.com/library?component=DarkSection_a30fdae0-4d46-4f09-a5b3-394779b98eb7
 */

import React from 'react'
import * as SubframeUtils from '../utils'

interface DarkSectionRootProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  variant?: 'default'
  className?: string
}

const DarkSectionRoot = React.forwardRef<HTMLDivElement, DarkSectionRootProps>(
  function DarkSectionRoot(
    { children, variant = 'default', className, ...otherProps }: DarkSectionRootProps,
    ref
  ) {
    return (
      <div
        className={SubframeUtils.twClassNames(
          'flex w-full flex-col items-start gap-2 rounded-lg bg-neutral-50 px-6 py-6',
          className
        )}
        ref={ref}
        {...otherProps}
      >
        <div className="flex w-full flex-col items-start gap-2">
          <div className="flex h-px w-full flex-none flex-col items-center gap-2 bg-transparent px-6 py-6" />
          {children ? (
            <div className="flex w-full flex-col items-start gap-2 px-2 py-2">{children}</div>
          ) : null}
          <div className="flex h-px w-full flex-none flex-col items-center gap-2 bg-transparent px-6 py-6" />
        </div>
      </div>
    )
  }
)

export const DarkSection = DarkSectionRoot
