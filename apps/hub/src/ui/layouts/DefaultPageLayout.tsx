'use client'
/*
 * Documentation:
 * Button — https://app.subframe.com/library?component=Button_3b777358-b86b-40af-9327-891efc6826fe
 * Default Page Layout — https://app.subframe.com/library?component=Default+Page+Layout_a57b1c43-310a-493f-b807-8cc88e2452cf
 * Text Field — https://app.subframe.com/library?component=Text+Field_be48ca43-f8e7-4c0e-8870-d219ea11abfe
 * Topbar with left nav and right buttons — https://app.subframe.com/library?component=Topbar+with+left+nav+and+right+buttons_ccff85e5-018b-4c55-ab4d-e454acefe565
 */

import React from 'react'
import { FeatherSearch } from '@subframe/core'
import { Button } from '../components/Button'
import { TextField } from '../components/TextField'
import { TopbarWithLeftNavAndRightButtons } from '../components/TopbarWithLeftNavAndRightButtons'
import * as SubframeUtils from '../utils'

interface DefaultPageLayoutRootProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  className?: string
}

const DefaultPageLayoutRoot = React.forwardRef<HTMLDivElement, DefaultPageLayoutRootProps>(
  function DefaultPageLayoutRoot(
    { children, className, ...otherProps }: DefaultPageLayoutRootProps,
    ref
  ) {
    return (
      <div
        className={SubframeUtils.twClassNames(
          'flex h-screen w-full flex-col items-center',
          className
        )}
        ref={ref}
        {...otherProps}
      >
        <TopbarWithLeftNavAndRightButtons
          className="mobile:hidden"
          leftSlot={
            <>
              <img
                className="h-6 flex-none object-cover"
                src="https://res.cloudinary.com/subframe/image/upload/v1711417507/shared/y2rsnhq3mex4auk54aye.png"
              />
              <div className="flex items-center gap-1">
                <TopbarWithLeftNavAndRightButtons.NavItem selected={true}>
                  Learn
                </TopbarWithLeftNavAndRightButtons.NavItem>
                <TopbarWithLeftNavAndRightButtons.NavItem>
                  Innovate
                </TopbarWithLeftNavAndRightButtons.NavItem>
                <TopbarWithLeftNavAndRightButtons.NavItem>
                  Optimize
                </TopbarWithLeftNavAndRightButtons.NavItem>
                <TopbarWithLeftNavAndRightButtons.NavItem>
                  Explore
                </TopbarWithLeftNavAndRightButtons.NavItem>
              </div>
            </>
          }
          rightSlot={
            <>
              <TextField label="" helpText="" icon={<FeatherSearch />}>
                <TextField.Input placeholder="Search" />
              </TextField>
              <Button variant="neutral-secondary">Log In</Button>
              <Button>Sign Up</Button>
            </>
          }
        />
        {children ? (
          <div className="flex w-full grow shrink-0 basis-0 flex-col items-start gap-4 overflow-y-auto bg-default-background">
            {children}
          </div>
        ) : null}
      </div>
    )
  }
)

export const DefaultPageLayout = DefaultPageLayoutRoot
