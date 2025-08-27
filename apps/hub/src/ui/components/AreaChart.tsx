'use client'
/*
 * Documentation:
 * Area Chart — https://app.subframe.com/library?component=Area+Chart_8aa1e7b3-5db6-4a62-aa49-137ced21a231
 */

import React from 'react'
import * as SubframeCore from '@subframe/core'
import * as SubframeUtils from '../utils'

interface AreaChartRootProps extends React.ComponentProps<typeof SubframeCore.AreaChart> {
  stacked?: boolean
  className?: string
}

const AreaChartRoot = React.forwardRef<
  React.ElementRef<typeof SubframeCore.AreaChart>,
  AreaChartRootProps
>(function AreaChartRoot({ stacked = false, className, ...otherProps }: AreaChartRootProps, ref) {
  return (
    <SubframeCore.AreaChart
      className={SubframeUtils.twClassNames('h-80 w-full', className)}
      ref={ref}
      stacked={stacked}
      colors={['#943e00', '#4f2305', '#f76808', '#5f2a06', '#ff802b', '#763205']}
      dark={true}
      {...otherProps}
    />
  )
})

export const AreaChart = AreaChartRoot
