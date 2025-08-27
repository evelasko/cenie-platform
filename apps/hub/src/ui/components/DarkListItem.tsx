'use client'
/*
 * Documentation:
 * DarkListItem — https://app.subframe.com/library?component=DarkListItem_88ad5f0d-00c8-4627-8b8f-36fff1b087cf
 */

import React from 'react'
import * as SubframeCore from '@subframe/core'
import { FeatherPlus } from '@subframe/core'
import * as SubframeUtils from '../utils'

interface DarkListItemRootProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode
  children?: React.ReactNode
  className?: string
}

const DarkListItemRoot = React.forwardRef<HTMLDivElement, DarkListItemRootProps>(
  function DarkListItemRoot(
    { icon = <FeatherPlus />, children, className, ...otherProps }: DarkListItemRootProps,
    ref
  ) {
    return (
      <div
        className={SubframeUtils.twClassNames('flex items-start gap-2', className)}
        ref={ref}
        {...otherProps}
      >
        <div className="flex grow shrink-0 basis-0 flex-col items-start">
          <div className="flex h-0.5 w-full flex-none flex-col items-center gap-2" />
          <div className="flex flex-col items-start rounded-full bg-neutral-200 px-0.5 py-0.5">
            {icon ? (
              <SubframeCore.IconWrapper className="text-subtitle font-subtitle text-default-font-light">
                {icon}
              </SubframeCore.IconWrapper>
            ) : null}
          </div>
        </div>
        {children ? <div className="flex flex-col items-start">{children}</div> : null}
      </div>
    )
  }
)

export const DarkListItem = DarkListItemRoot
