'use client'
/*
 * Documentation:
 * AvatarImage — https://app.subframe.com/library?component=AvatarImage_e3a93015-7236-418b-bcb2-550d3b8de8e9
 */

import React from 'react'
import * as SubframeUtils from '../utils'

interface AvatarImageRootProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string
  size?: 'default' | 'large' | 'medium' | 'x-small'
  grayscale?: boolean
  className?: string
}

const AvatarImageRoot = React.forwardRef<HTMLDivElement, AvatarImageRootProps>(
  function AvatarImageRoot(
    { src, size = 'default', grayscale = false, className, ...otherProps }: AvatarImageRootProps,
    ref
  ) {
    return (
      <div
        className={SubframeUtils.twClassNames(
          'group/e3a93015 flex h-full w-12 flex-col items-start gap-2 aspect-square',
          {
            'h-full w-8': size === 'x-small',
            'h-full w-16': size === 'medium',
            'h-full w-24': size === 'large',
          },
          className
        )}
        ref={ref}
        {...otherProps}
      >
        {src ? (
          <img
            className={SubframeUtils.twClassNames('flex-none rounded-full', {
              grayscale: grayscale,
            })}
            src={src}
          />
        ) : null}
      </div>
    )
  }
)

export const AvatarImage = AvatarImageRoot
