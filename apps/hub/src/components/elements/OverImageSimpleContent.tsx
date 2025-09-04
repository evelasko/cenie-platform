import { FeatherPlus } from '@subframe/core'
import { ButtonThemed } from '../../ui'

interface OverImageSimpleContentProps {
  headingNode?: React.ReactNode
  detailsNode?: React.ReactNode
  ctaTitleNode?: React.ReactNode
  ctaButtonLabel?: string
  onClick?: () => void
  className?: string
}

export default function OverImageSimpleContent({
  headingNode,
  detailsNode,
  ctaTitleNode,
  ctaButtonLabel,
  onClick,
}: OverImageSimpleContentProps) {
  return (
    <div className="w-full h-full grow shrink-0 basis-0 flex flex-col md:flex-row">
      <div className="w-full md:w-1/2 flex flex-col justify-between p-8 md:p-12 rounded-md bg-black/60 backdrop-blur-sm">
        <div className="space-y-6">
          <div className="flex items-start justify-between">
            {headingNode}
            <FeatherPlus className="text-display-text-small text-neutral-400 mt-2" />
          </div>

          <div className="text-display-text-small text-default-font-light space-y-4">
            {detailsNode}
          </div>
        </div>
      </div>
      <div className="w-full md:w-1/2 h-full flex flex-col items-end justify-end p-8 md:p-12">
        <div className="space-y-6">
          {ctaTitleNode}
          <ButtonThemed onClick={onClick}>{ctaButtonLabel}</ButtonThemed>
        </div>
      </div>
    </div>
  )
}
