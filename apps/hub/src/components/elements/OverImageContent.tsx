import { FeatherPlus } from '@subframe/core'
import { ButtonThemed } from '../../ui'
import clsx from 'clsx'

interface OverImageContentProps {
  heading?: string
  headingNode?: React.ReactNode
  details?: string
  detailsNode?: React.ReactNode
  ctaTitle?: string
  ctaTitleNode?: React.ReactNode
  ctaButtonLabel?: string
  ctaButtonNode?: React.ReactNode
  onClick?: () => void
  className?: string
}

export default function OverImageContent({
  heading,
  headingNode,
  details,
  detailsNode,
  ctaTitle,
  ctaTitleNode,
  ctaButtonLabel,
  ctaButtonNode,
  onClick,
  className,
}: OverImageContentProps) {
  return (
    <div
      className={clsx(
        'w-full h-full grow shrink-0 basis-0 items-start grid grid-cols-1 md:grid-cols-2 place-items-center',
        className
      )}
    >
      <div className="w-full flex grow shrink-0 basis-0 flex-col items-start self-stretch rounded-lg bg-[#171717cc] px-12 py-12 place-items-center place-content-between">
        <div className="flex w-full items-start place-content-between">
          {headingNode ?? (
            <span className="text-display-text-large font-display-text-large text-default-font-light">
              {heading ?? ''}
            </span>
          )}
          <FeatherPlus className="text-display-text-small font-display-text-small text-default-font-light" />
        </div>
        {detailsNode ?? (
          <span className="text-display-text-medium font-display-text-medium text-neutral-border">
            {details ?? ''}
          </span>
        )}
      </div>
      <div className="w-full flex flex-col items-start gap-6 self-stretch px-12 py-12 place-content-end">
        {ctaTitleNode ?? (
          <span className="text-display-text-large font-display-text-large text-default-font-light">
            {ctaTitle ?? ''}
          </span>
        )}
        {ctaButtonNode ?? (
          <ButtonThemed onClick={onClick || (() => {})}>{ctaButtonLabel ?? ''}</ButtonThemed>
        )}
      </div>
    </div>
  )
}
