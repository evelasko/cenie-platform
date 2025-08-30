'use client'
/*
 * Documentation:
 * BulletListItem — A semantic list item component with customizable bullet icon
 * Supports complex content including styled spans and nested elements
 */

import React from 'react'
import { FeatherCircleSmall } from '@subframe/core'
import * as SubframeUtils from '../utils'

interface BulletListItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
  children: React.ReactNode
  icon?: React.ReactNode
  className?: string
}

const BulletListItemRoot = React.forwardRef<HTMLLIElement, BulletListItemProps>(
  function BulletListItemRoot(
    {
      children,
      icon = (
        <FeatherCircleSmall className="text-display-text-small text-default-font mt-1 flex-shrink-0" />
      ),
      className,
      ...otherProps
    }: BulletListItemProps,
    ref
  ) {
    return (
      <li
        className={SubframeUtils.twClassNames('flex items-start gap-3 px-2 py-2', className)}
        ref={ref}
        {...otherProps}
      >
        {icon}
        <div className="flex flex-col gap-1">
          <div className="text-display-text-small text-default-font">{children}</div>
        </div>
      </li>
    )
  }
)

export const BulletListItem = BulletListItemRoot
