import { ReactNode } from 'react'
import NoiseOverlay from '../../components/decorations/NoiseOverlay'
import OverImageSimpleContent from '../../components/elements/OverImageSimpleContent'
import TinyTitle from '../../components/elements/TinyTitle'
import MarginBlock from '../../components/layouts/MarginBlock'
import { StepCard, type StepCardRootProps } from '../../ui/components/StepCard'
import Image from 'next/image'

interface WhatWeDoForProps {
  heading: string[]
  details: string
  steps: StepCardRootProps[]
  explanation: string
  underExplanation?: string
  ctaTitle?: string
  ctaLabel?: string
  ctaLink?: string
  image: string
  imageAlt: string
  children?: ReactNode
}

export default function WhatWeDoFor({
  heading,
  details,
  steps,
  explanation,
  underExplanation,
  ctaTitle,
  ctaLabel,
  ctaLink,
  image,
  imageAlt,
  children,
}: WhatWeDoForProps) {
  return (
    <>
      <MarginBlock header={<TinyTitle text="What we do" />}>
        <div className="flex flex-col items-start gap-6 pr-6 pt-6">
          <h3 className="text-display-text-extra-large flex flex-wrap items-start gap-2">
            {heading[0] && <span className="text-subtext-color">{heading[0]}</span>}
            {heading[1]}
          </h3>
          <div className="text-body md:!text-body-large">{details}</div>
          <span className="text-display-text-extra-large text-subtext-color">how we help:</span>
        </div>
      </MarginBlock>
      <div className="w-full items-start gap-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 !pb-0 content-wrapper">
        {steps.map(({ image, label }, index) => (
          <StepCard
            key={index}
            image={image}
            label={label}
            variant={`step-${index + 1}` as StepCardRootProps['variant']}
            className="lg:h-full"
          />
        ))}
      </div>
      {children ?? (
        <div className="w-full !pt-6 md:!pt-1.5 content-wrapper">
          <NoiseOverlay
            className="w-full min-h-[600px] md:min-h-[500px] rounded-md"
            contentAboveNoise={
              <OverImageSimpleContent
                headingNode={
                  <h3 className="text-display-text-extra-large text-default-font-light">
                    This Path
                    <br />
                    <span className="text-neutral-500">is for You If...</span>
                  </h3>
                }
                detailsNode={
                  <div className="text-display-text-small text-default-font-light space-y-4">
                    <p>{explanation}</p>
                    {underExplanation && <p className="text-neutral-500">{underExplanation}</p>}
                  </div>
                }
                ctaTitleNode={
                  ctaTitle && (
                    <p className="text-display-text-large text-default-font-light">{ctaTitle}</p>
                  )
                }
                ctaButtonLabel={ctaLabel}
                onClick={() => {
                  // TODO: Implement onClick
                  console.log(ctaLink)
                }}
              />
            }
          >
            {/* Background Image */}
            <Image
              src={image}
              alt={imageAlt}
              fill
              className="object-cover rounded-md"
              sizes="(max-width: 768px) 100vw, 100vw"
              priority
            />
          </NoiseOverlay>
        </div>
      )}
    </>
  )
}
