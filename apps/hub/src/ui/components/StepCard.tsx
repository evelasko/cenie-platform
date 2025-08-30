'use client'
/*
 * Documentation:
 * StepCard — https://app.subframe.com/library?component=StepCard_e5834e3a-1a53-49ed-9691-3cdf7d9d760c
 */

import React from 'react'
import * as SubframeUtils from '../utils'

interface StepCardRootProps extends React.HTMLAttributes<HTMLDivElement> {
  image?: string
  label?: React.ReactNode
  variant?: 'default' | 'step-1' | 'step-2' | 'step-3' | 'step-4'
  className?: string
}

const StepCardRoot = React.forwardRef<HTMLDivElement, StepCardRootProps>(function StepCardRoot(
  { image, label, variant = 'default', className, ...otherProps }: StepCardRootProps,
  ref
) {
  return (
    <div
      className={SubframeUtils.twClassNames(
        'group/e5834e3a flex w-full flex-col items-start gap-4 rounded-md bg-neutral-950 px-6 py-6 min-h-0',
        className
      )}
      ref={ref}
      {...otherProps}
    >
      {/* Header row: Circle indicators (left) and number indicator (right) */}
      <div className="flex w-full items-center justify-between px-2 py-2">
        <div className="flex items-center gap-1">
          <div
            className={SubframeUtils.twClassNames(
              'flex h-2.5 w-2.5 flex-none flex-col items-center rounded-full bg-neutral-background',
              {
                'bg-default-font':
                  variant === 'step-4' ||
                  variant === 'step-3' ||
                  variant === 'step-2' ||
                  variant === 'step-1',
              }
            )}
          />
          <div
            className={SubframeUtils.twClassNames(
              'flex h-2.5 w-2.5 flex-none flex-col items-center rounded-full bg-neutral-background',
              {
                'bg-default-font':
                  variant === 'step-4' || variant === 'step-3' || variant === 'step-2',
              }
            )}
          />
          <div
            className={SubframeUtils.twClassNames(
              'flex h-2.5 w-2.5 flex-none flex-col items-center rounded-full bg-neutral-background',
              {
                'bg-default-font': variant === 'step-4' || variant === 'step-3',
              }
            )}
          />
          <div
            className={SubframeUtils.twClassNames(
              'flex h-2.5 w-2.5 flex-none flex-col items-center rounded-full bg-neutral-background',
              { 'bg-default-font': variant === 'step-4' }
            )}
          />
        </div>
        <span
          className={SubframeUtils.twClassNames(
            'text-button-small font-button-small text-subtext-color',
            { 'text-subtext-color': variant === 'step-1' }
          )}
        >
          {variant === 'step-4'
            ? '04'
            : variant === 'step-3'
              ? '03'
              : variant === 'step-2'
                ? '02'
                : variant === 'step-1'
                  ? '01'
                  : '00'}
        </span>
      </div>

      {/* Content row: Responsive layout for image and text */}
      <div className="flex w-full flex-row gap-4 px-2 py-2 flex-1 min-h-0">
        {/* Text content - appears first on mobile, second on desktop */}
        {label ? (
          <div className="order-2 flex-1 min-w-0 text-body-large">
            <span className="break-words">{label}</span>
          </div>
        ) : null}

        {/* Image - appears second on mobile, first on desktop */}
        {image ? (
          <div className="order-1 flex-none w-14">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="w-full md:w-14 rounded-sm aspect-square object-cover"
              src={image}
              alt=""
            />
          </div>
        ) : null}
      </div>
    </div>
  )
})

export const StepCard = StepCardRoot
