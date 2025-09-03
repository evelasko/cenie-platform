'use client'
/*
 * Documentation:
 * BrandAccordion — https://app.subframe.com/library?component=BrandAccordion_08273c8e-96b2-42dc-be04-ae1b4f531552
 */

import React from 'react'
import * as SubframeCore from '@subframe/core'
import { FeatherPlus } from '@subframe/core'
import { FeatherMinus } from '@subframe/core'
import * as SubframeUtils from '../utils'
import Image from 'next/image'

interface ChevronProps extends React.ComponentProps<typeof SubframeCore.Collapsible.Chevron> {
  boolean?: boolean
  className?: string
}

const Chevron = React.forwardRef<HTMLDivElement, ChevronProps>(function Chevron(
  { boolean = false, className, ...otherProps }: ChevronProps,
  ref
) {
  return (
    <SubframeCore.Collapsible.Chevron {...otherProps}>
      <div
        className={SubframeUtils.twClassNames(
          'group/df6b38bf flex flex-col items-start gap-2 rounded-full border border-solid border-neutral-200 px-2 py-2',
          className
        )}
        ref={ref}
      >
        {boolean ? (
          <FeatherMinus className="text-display-text-small font-display-text-small text-default-font-light" />
        ) : (
          <FeatherPlus className="text-display-text-small font-display-text-small text-default-font-light" />
        )}
      </div>
    </SubframeCore.Collapsible.Chevron>
  )
})

interface ContentProps extends React.ComponentProps<typeof SubframeCore.Collapsible.Content> {
  children?: React.ReactNode
  className?: string
}

const Content = React.forwardRef<HTMLDivElement, ContentProps>(function Content(
  { children, className, ...otherProps }: ContentProps,
  ref
) {
  return children ? (
    <SubframeCore.Collapsible.Content asChild={true} {...otherProps}>
      <div
        className={SubframeUtils.twClassNames('flex w-full flex-col items-start gap-2', className)}
        ref={ref}
      >
        {children}
      </div>
    </SubframeCore.Collapsible.Content>
  ) : null
})

interface TriggerProps extends React.ComponentProps<typeof SubframeCore.Collapsible.Trigger> {
  children?: React.ReactNode
  className?: string
}

const Trigger = React.forwardRef<HTMLDivElement, TriggerProps>(function Trigger(
  { children, className, ...otherProps }: TriggerProps,
  ref
) {
  return children ? (
    <SubframeCore.Collapsible.Trigger asChild={true} {...otherProps}>
      <div
        className={SubframeUtils.twClassNames(
          'flex w-full cursor-pointer flex-col items-start gap-2',
          className
        )}
        ref={ref}
      >
        {children}
      </div>
    </SubframeCore.Collapsible.Trigger>
  ) : null
})

interface BrandAccordionRootProps
  extends React.ComponentProps<typeof SubframeCore.Collapsible.Root> {
  trigger?: React.ReactNode
  children?: React.ReactNode
  headerImage?: string
  headerText?: React.ReactNode
  className?: string
}

const BrandAccordionRoot = React.forwardRef<HTMLDivElement, BrandAccordionRootProps>(
  function BrandAccordionRoot(
    {
      trigger,
      children,
      headerImage,
      headerText,
      className,
      ...otherProps
    }: BrandAccordionRootProps,
    ref
  ) {
    return (
      <SubframeCore.Collapsible.Root asChild={true} {...otherProps}>
        <div
          className={SubframeUtils.twClassNames(
            'group/08273c8e flex w-full flex-col items-start',
            className
          )}
          ref={ref}
        >
          <Trigger>
            {trigger ? (
              <div className="flex w-full grow shrink-0 basis-0 flex-col items-start border-b border-solid border-neutral-200 group-data-[state=open]/08273c8e:h-auto group-data-[state=open]/08273c8e:w-full group-data-[state=open]/08273c8e:flex-none group-data-[state=open]/08273c8e:border-none">
                {trigger}
              </div>
            ) : null}
          </Trigger>
          <Content>
            {/* Main content section - only visible when accordion is open */}
            {children ? (
              <div className="hidden group-data-[state=open]/08273c8e:flex w-full !flex-row items-start gap-4 px-3 py-4 group-data-[state=open]/08273c8e:border-b group-data-[state=open]/08273c8e:border-solid group-data-[state=open]/08273c8e:border-neutral-border">
                {headerImage && (
                  <div className="w-[20%] lg:w-[10%] aspect-square flex-shrink-0">
                    <Image
                      width={144}
                      height={144}
                      className="w-full h-full rounded-sm md:rounded-md object-cover"
                      src={headerImage}
                      alt={typeof headerText === 'string' ? headerText : 'Header image'}
                    />
                  </div>
                )}
                {/* Content takes up remaining space beside the image */}
                <div className="flex-1 flex flex-col items-start">{children}</div>
              </div>
            ) : null}
          </Content>
        </div>
      </SubframeCore.Collapsible.Root>
    )
  }
)

export const BrandAccordion = Object.assign(BrandAccordionRoot, {
  Chevron,
  Content,
  Trigger,
})
