'use client'
/*
 * Documentation:
 * BrandToggle — https://app.subframe.com/library?component=BrandToggle_bfabc256-275e-4199-994e-04ab1fa84eb8
 */

import React from 'react'
import * as SubframeCore from '@subframe/core'
import * as SubframeUtils from '../utils'

interface ItemProps extends React.ComponentProps<typeof SubframeCore.ToggleGroup.Item> {
  disabled?: boolean
  children?: React.ReactNode
  className?: string
}

const Item = React.forwardRef<HTMLDivElement, ItemProps>(function Item(
  { disabled = false, children, className, ...otherProps }: ItemProps,
  ref
) {
  return (
    <SubframeCore.ToggleGroup.Item asChild={true} {...otherProps}>
      <div
        className={SubframeUtils.twClassNames(
          'group/c28144d2 flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-full px-6 py-1 active:bg-neutral-100 aria-[checked=true]:h-11 aria-[checked=true]:w-full aria-[checked=true]:bg-default-background aria-[checked=true]:shadow-sm hover:aria-[checked=true]:bg-default-background active:aria-[checked=true]:bg-default-background',
          { 'hover:bg-transparent active:bg-transparent': disabled },
          className
        )}
        ref={ref}
      >
        {children ? (
          <span
            className={SubframeUtils.twClassNames(
              'whitespace-nowrap text-subtitle font-subtitle text-default-font-light group-hover/c28144d2:text-subtext-color group-active/c28144d2:text-default-font group-aria-[checked=true]/c28144d2:text-default-font',
              {
                'text-neutral-200 group-hover/c28144d2:text-neutral-200 group-active/c28144d2:text-neutral-400':
                  disabled,
              }
            )}
          >
            {children}
          </span>
        ) : null}
      </div>
    </SubframeCore.ToggleGroup.Item>
  )
})

interface BrandToggleRootProps extends React.ComponentProps<typeof SubframeCore.ToggleGroup.Root> {
  children?: React.ReactNode
  value?: string
  onValueChange?: (value: string) => void
  className?: string
}

const BrandToggleRoot = React.forwardRef<HTMLDivElement, BrandToggleRootProps>(
  function BrandToggleRoot({ children, className, ...otherProps }: BrandToggleRootProps, ref) {
    return children ? (
      <SubframeCore.ToggleGroup.Root asChild={true} {...otherProps}>
        <div
          className={SubframeUtils.twClassNames(
            'flex items-center gap-0.5 overflow-hidden rounded-full bg-[#26262680] px-1 py-1',
            className
          )}
          ref={ref}
        >
          {children}
        </div>
      </SubframeCore.ToggleGroup.Root>
    ) : null
  }
)

export const BrandToggle = Object.assign(BrandToggleRoot, {
  Item,
})
