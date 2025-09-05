'use client'
/*
 * Documentation:
 * Icon with background — https://app.subframe.com/library?component=Icon+with+background_c5d68c0e-4c0c-4cff-8d8c-6ff334859b3a
 */

import React from 'react'
import * as SubframeCore from '@subframe/core'
import { FeatherCheck } from '@subframe/core'
import * as SubframeUtils from '../utils'

interface IconWithBackgroundRootProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'brand' | 'neutral' | 'error' | 'success' | 'warning' | 'dark' | 'light'
  size?: 'x-large' | 'large' | 'medium' | 'small' | 'x-small'
  icon?: React.ReactNode
  square?: boolean
  className?: string
}

const IconWithBackgroundRoot = React.forwardRef<HTMLDivElement, IconWithBackgroundRootProps>(
  function IconWithBackgroundRoot(
    {
      variant = 'brand',
      size = 'x-small',
      icon = <FeatherCheck />,
      square = false,
      className,
      ...otherProps
    }: IconWithBackgroundRootProps,
    ref
  ) {
    return (
      <div
        className={SubframeUtils.twClassNames(
          'group/c5d68c0e flex h-4 w-4 lg:h-5 lg:w-5 items-center justify-center gap-2 rounded-full bg-brand-primary',
          {
            'rounded-[4px]': square,
            'h-6 w-6': size === 'small',
            'h-8 w-8': size === 'medium',
            'h-12 w-12': size === 'large',
            'h-16 w-16': size === 'x-large',
            'bg-default-font-light': variant === 'light',
            'bg-default-font': variant === 'dark',
            'bg-warning-100': variant === 'warning',
            'bg-success-100': variant === 'success',
            'bg-error-100': variant === 'error',
            'bg-neutral-100': variant === 'neutral',
          },
          className
        )}
        ref={ref}
        {...otherProps}
      >
        {icon ? (
          <SubframeCore.IconWrapper
            className={SubframeUtils.twClassNames('text-subtitle font-subtitle text-brand-800', {
              'text-button-large font-button-large': size === 'small' || size === 'medium',
              'text-subheader font-subheader': size === 'large',
              'text-heading-3 font-heading-3': size === 'x-large',
              'text-default-font': variant === 'light',
              'text-default-background': variant === 'dark',
              'text-warning-800': variant === 'warning',
              'text-success-800': variant === 'success',
              'text-error-800': variant === 'error',
              'text-neutral-700': variant === 'neutral',
            })}
          >
            {icon}
          </SubframeCore.IconWrapper>
        ) : null}
      </div>
    )
  }
)

export const IconWithBackground = IconWithBackgroundRoot
