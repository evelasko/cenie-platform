'use client'

// import { type Metadata } from 'next'
import MediaHero from '../components/heroes/MediaHero'
import MarginBlock from '../components/layouts/MarginBlock'
import DarkSection from '../components/layouts/DarkSection'
import BottomBlurFrame from '../components/decorations/BottomBlurFrame'
import { motion, useScroll, useTransform, easeOut } from 'framer-motion'
import { useRef } from 'react'
import clsx from 'clsx'
import ImageCard from '../components/cards/ImageCard'
import TinyTitle from '../components/elements/TinyTitle'
import OverImageContent from '../components/elements/OverImageContent'
import NoiseOverlay from '../components/decorations/NoiseOverlay'
import { BrandAccordion } from '../ui/components/BrandAccordion'
import { ButtonThemed } from '../ui/components/ButtonThemed'
import { FeatherArrowUpRight } from '@subframe/core'
import { FeatherCircleSmall } from '@subframe/core'
import Image from 'next/image'
import Spacer from '../components/layouts/Spacer'
import LightSection from '../components/layouts/LightSection'

// export const metadata: Metadata = {
//   // TODO Tranlsate this to Spanish
//   title: 'CENIE | The Future of Performing Arts | Launching September 2025',
//   description: 'CENIE is a comprehensive ecosystem empowering performing artists and organizations with AI-powered tools, specialized education, and collaborative platforms. Join us in shaping the future of performance.',
//   keywords: 'performing arts, technology, AI in arts, virtual reality, artistic innovation, artist education, production management software, academic publishing, Spanish-speaking artists',
//   openGraph: {
//     title: 'CENIE | The Future of Performing Arts | Launching September 2025',
//     description: 'CENIE is a comprehensive ecosystem empowering performing artists and organizations with AI-powered tools, specialized education, and collaborative platforms. Join us in shaping the future of performance.',
//     url: 'https://cenie.org',
//     siteName: 'CENIE',
//     locale: 'es_ES',
//     type: 'website',
//   },
//   alternates: {
//     canonical: 'https://cenie.org'
//   }
// }

export default function HubHomePage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll()
  const rangeEnd = 1.5
  const translateY = useTransform(scrollYProgress, [0, rangeEnd], [-250, 650], { ease: easeOut })
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.9, 1], { ease: easeOut })
  const opacity = useTransform(scrollYProgress, [0, 0.1], [0, 1], { ease: easeOut })

  return (
    <>
      {/* Hero Section */}
      <div
        id="revealer"
        className={clsx(
          'h-[calc(100vh-4rem)] mt-16 px-1 md:px-1.5',
          'bg-gradient-to-b from-[var(--color-nav-background)] to-background',
          'z-[5]'
        )}
      >
        <MediaHero backgroundVideo="/media/videos/hub-hero-loop.mp4" backgroundClassName="mb-1">
          <div id="logo-type" className="text-center relative w-full p-1.5 lg:p-1">
            <div className="w-full aspect-[4/1] flex items-end justify-end">
              <div className="w-1/2 text-right text-display-text-small pr-1">
                <p className="text-white opacity-80 uppercase tracking-[0.2em] leading-[1.6em] text-[10px] lg:text-[16px]">
                  centro de
                  <br />
                  investigaciones
                  <br />
                  escénicas
                </p>
              </div>
            </div>
            {/* Blank space with 4:1 aspect ratio */}
            <div className="relative w-full aspect-[4/1]">
              {/* Container for image with 4:1 aspect ratio */}
              <Image
                className="opacity-90 drop-shadow-[0_0_15px_rgba(255,255,255,0.9)] filter-[brightness(1.5)]"
                src="/media/brand/logo-type-white.svg"
                alt="CENIE Logo"
                fill
              />
            </div>
          </div>
          <div className="w-full h-full items-start content-start grid grid-cols-4 pt-4 px-8">
            <div className="col-span-1"></div>
            <div className="col-span-3 text-left mix-blend-exclusion">
              <p className="text-hero-quote text-white/80">
                Transform your artistic career with technology that amplifies, never replaces, human
                creativity
              </p>
            </div>
            <div className="col-span-1 flex items-end justify-end pt-12 pr-4 lg:pr-8">
              <div className="animate-bounce">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="opacity-80">
                  <path
                    d="M12 4L12 20M12 20L18 14M12 20L6 14"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
            <div className="col-span-3 pt-12 text-left">
              <p className="text-text-button text-white/80">discover how</p>
            </div>
          </div>
        </MediaHero>
      </div>
      <motion.div
        id="revealer-content"
        className="z-[1]"
        ref={containerRef}
        style={{
          y: translateY,
          scale,
          opacity,
        }}
      >
        <MarginBlock header={<div />}>
          <p className="text-display-text-extra-large">
            We&#39;re not just another technology company:{' '}
            <span className="text-subtext-color">
              CENIE is the first comprehensive ecosystem specifically designed by and for the
              performing arts community, combining deep artistic expertise with cutting-edge
              technological innovation.
            </span>
          </p>
        </MarginBlock>
      </motion.div>
      <div className="page-wrapper">
        {/* Page Content */}
        <Spacer />
        <LightSection>
          <div className="content-wrapper flex flex-col lg:flex-row w-full lg:items-stretch gap-6 lg:gap-8">
            {/* Text Content Column */}
            <div className="w-full lg:w-[80%] flex flex-col items-start gap-4">
              <span className="text-display-text-large text-default-font pb-4 lg:pb-8">
                Performing artists and organizations are navigating unprecedented challenges:
              </span>

              {/* Challenge List */}
              <div className="flex flex-col gap-4 w-full">
                <div className="flex items-start gap-3 px-2 py-2">
                  <FeatherCircleSmall className="text-display-text-small text-default-font mt-1 flex-shrink-0" />
                  <div className="flex flex-col gap-1">
                    <div className="text-display-text-small text-default-font">
                      Economic uncertainty
                      <span className="text-subtext-color">
                        {' '}
                        with traditional funding models under pressure
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 px-2 py-2">
                  <FeatherCircleSmall className="text-display-text-small text-default-font mt-1 flex-shrink-0" />
                  <div className="flex flex-col gap-1">
                    <div className="text-display-text-small text-default-font">
                      Technology gaps
                      <span className="text-subtext-color">
                        {' '}
                        that separate artists from new opportunities
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 px-2 py-2">
                  <FeatherCircleSmall className="text-display-text-small text-default-font mt-1 flex-shrink-0" />
                  <div className="flex flex-col gap-1">
                    <div className="text-display-text-small text-default-font">
                      Educational limitations
                      <span className="text-subtext-color"> in business and digital literacy</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 px-2 py-2">
                  <FeatherCircleSmall className="text-display-text-small text-default-font mt-1 flex-shrink-0" />
                  <div className="flex flex-col gap-1">
                    <div className="text-display-text-small text-default-font">
                      Fragmented resources
                      <span className="text-subtext-color">
                        {' '}
                        across training, creation, and production
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 px-2 py-2">
                  <FeatherCircleSmall className="text-display-text-small text-default-font mt-1 flex-shrink-0" />
                  <div className="flex flex-col gap-1">
                    <div className="text-display-text-small text-default-font">
                      Language barriers
                      <span className="text-subtext-color">
                        {' '}
                        limiting access to cutting-edge methodologies
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 px-2 py-2">
                  <FeatherCircleSmall className="text-display-text-small text-default-font mt-1 flex-shrink-0" />
                  <div className="flex flex-col gap-1">
                    <div className="text-display-text-small text-default-font">
                      Operational inefficiencies
                      <span className="text-subtext-color">
                        {' '}
                        in production and talent management
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Image Column */}
            <div className="w-full lg:w-1/2 relative aspect-video lg:flex lg:flex-col">
              <Image
                className="radius-md object-cover lg:h-full lg:flex-1"
                fill
                alt="CENIE workspace"
                src="/media/images/image-1.jpg"
              />
            </div>
          </div>
        </LightSection>
        <Spacer />
        <DarkSection>
          <div className="flex flex-col items-center p-36 justify-center h-124">
            <p className="text-display-text-large">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
            </p>
          </div>
        </DarkSection>
        <MarginBlock header={<div />}>
          <p className="text-display-text-large">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
          </p>
        </MarginBlock>
        <MarginBlock header={<TinyTitle text="Who we are" />}>
          <p className="text-display-text-large">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
          </p>
        </MarginBlock>
        <MarginBlock header={<TinyTitle text="What we do" />}>
          <p className="text-display-text-large">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
          </p>
        </MarginBlock>
        <NoiseOverlay
          className="w-full aspect-[4/3] md:aspect-[4/3] max-md:aspect-[3/4] radius-lg z-30"
          contentAboveNoise={
            <OverImageContent
              heading="Success Story"
              details="Maria, a contemporary dancer from Madrid, increased her annual income from $28,000 to $42,000 within 18 months of completing CENIE's technology and business literacy programs. She now teaches internationally via digital platforms and has launched her own online choreography studio."
              ctaTitle="Start your transformation"
              ctaButtonLabel="Visit our Skills Section"
              onClick={() => {
                console.log('clicked')
              }}
            />
          }
        >
          <ImageCard
            src="/media/images/image-1.jpg"
            alt="Image 1"
            variant="clean"
            diableContentAnimation
          />
        </NoiseOverlay>
        <MarginBlock header={<TinyTitle text="What we do" />}>
          <p className="text-display-text-large">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
          </p>
        </MarginBlock>
        <DarkSection>
          <>
            <MarginBlock header={<TinyTitle text="What we do" />}>
              <h2 className="text-heading-2">Solutions.</h2>
            </MarginBlock>
            <div className="content-wrapper">
              <BrandAccordion
                trigger={
                  <div className="flex w-full items-center gap-2 px-3 py-4">
                    <div className="flex grow shrink-0 basis-0 flex-col items-start">
                      <div className="flex items-start">
                        <Image
                          width={144}
                          height={144}
                          className="hidden grow shrink-0 basis-0 rounded-md"
                          src="/media/images/default/zhgLgjCtsbVWTYRQuFeBf3XoW6c.jpg"
                          alt="Academy for Specialized Education"
                        />
                        <div className="hidden h-px flex-col items-center gap-2 bg-transparent px-12 py-12" />
                      </div>
                      <div className="hidden w-full flex-col items-center gap-2 bg-transparent px-2 py-2" />
                      <span className="w-full text-display-text-small font-display-text-small text-default-font-light">
                        Accordion header
                      </span>
                    </div>
                    <BrandAccordion.Chevron />
                  </div>
                }
                headerImage="/media/images/default/zhgLgjCtsbVWTYRQuFeBf3XoW6c.jpg"
                headerText="Academy for Specialized Education"
              >
                <div className="flex w-full grow shrink-0 basis-0 flex-col items-start gap-2">
                  <div className="flex w-full grow shrink-0 basis-0 flex-col items-start gap-2 px-3 py-2">
                    <span className="text-body-large font-body-large text-subtext-color">
                      Professional development courses in technology, finance, and business skills
                      specifically designed for performing artists. Bridge the gap between
                      traditional arts training and modern career requirements.
                    </span>
                  </div>
                  <div className="flex w-full items-start gap-2 px-6 py-6">
                    <div className="flex h-0 grow shrink-0 basis-0 flex-col items-center gap-2 bg-neutral-border" />
                    <ButtonThemed
                      variant="brand-secondary"
                      iconRight={<FeatherArrowUpRight />}
                      onClick={(_event: React.MouseEvent<HTMLButtonElement>) => {}}
                    >
                      VISIT THE ACADEMY
                    </ButtonThemed>
                  </div>
                </div>
              </BrandAccordion>
              <BrandAccordion
                trigger={
                  <div className="flex w-full items-center gap-2 px-3 py-4">
                    <div className="flex grow shrink-0 basis-0 flex-col items-start">
                      <div className="flex items-start">
                        <Image
                          width={144}
                          height={144}
                          className="hidden grow shrink-0 basis-0 rounded-md"
                          src="/media/images/default/zhgLgjCtsbVWTYRQuFeBf3XoW6c.jpg"
                          alt="Creative Development Hub"
                        />
                        <div className="hidden h-px flex-col items-center gap-2 bg-transparent px-12 py-12" />
                      </div>
                      <div className="hidden w-full flex-col items-center gap-2 bg-transparent px-2 py-2" />
                      <span className="w-full text-display-text-small font-display-text-small text-default-font-light">
                        Accordion header
                      </span>
                    </div>
                    <BrandAccordion.Chevron />
                  </div>
                }
                headerImage="/media/images/default/zhgLgjCtsbVWTYRQuFeBf3XoW6c.jpg"
                headerText="Creative Development Hub"
              >
                <div className="flex w-full grow shrink-0 basis-0 flex-col items-start gap-2 px-3 py-2">
                  <div className="flex flex-col items-start gap-2">
                    <span className="text-body-large font-body-large text-subtext-color">
                      Innovation labs and residency programs where choreographers and directors can
                      experiment with AI, AR/VR, and emerging technologies in collaborative
                      environments.
                    </span>
                  </div>
                  <div className="flex w-full items-start gap-2 px-6 py-6">
                    <div className="flex h-0 grow shrink-0 basis-0 flex-col items-center gap-2 bg-neutral-border" />
                    <ButtonThemed
                      variant="brand-secondary"
                      iconRight={<FeatherArrowUpRight />}
                      onClick={(_event: React.MouseEvent<HTMLButtonElement>) => {}}
                    >
                      VISIT THE HUB
                    </ButtonThemed>
                  </div>
                </div>
              </BrandAccordion>
              <BrandAccordion
                trigger={
                  <div className="flex w-full items-center gap-2 px-3 py-4">
                    <div className="flex grow shrink-0 basis-0 flex-col items-start">
                      <div className="flex items-start">
                        <Image
                          width={144}
                          height={144}
                          className="hidden grow shrink-0 basis-0 rounded-md"
                          src="/media/images/default/zhgLgjCtsbVWTYRQuFeBf3XoW6c.jpg"
                          alt="Training Exchange Network"
                        />
                        <div className="hidden h-px flex-col items-center gap-2 bg-transparent px-12 py-12" />
                      </div>
                      <div className="hidden w-full flex-col items-center gap-2 bg-transparent px-2 py-2" />
                      <span className="w-full text-display-text-small font-display-text-small text-default-font-light">
                        Accordion header
                      </span>
                    </div>
                    <BrandAccordion.Chevron />
                  </div>
                }
                headerImage="/media/images/default/zhgLgjCtsbVWTYRQuFeBf3XoW6c.jpg"
                headerText="Training Exchange Network"
              >
                <div className="flex w-full grow shrink-0 basis-0 flex-col items-start gap-2 px-3 py-2">
                  <div className="flex flex-col items-start gap-2">
                    <span className="text-body-large font-body-large text-subtext-color">
                      Platform for sharing and developing evidence-based methodologies among
                      performing arts educators and trainers worldwide.
                    </span>
                  </div>
                  <div className="flex w-full items-start gap-2 px-6 py-6">
                    <div className="flex h-0 grow shrink-0 basis-0 flex-col items-center gap-2 bg-neutral-border" />
                    <ButtonThemed
                      variant="brand-secondary"
                      iconRight={<FeatherArrowUpRight />}
                      onClick={(_event: React.MouseEvent<HTMLButtonElement>) => {}}
                    >
                      VISIT THE HUB
                    </ButtonThemed>
                  </div>
                </div>
              </BrandAccordion>
              <BrandAccordion
                trigger={
                  <div className="flex w-full items-center gap-2 px-3 py-4">
                    <div className="flex grow shrink-0 basis-0 flex-col items-start">
                      <div className="flex items-start">
                        <Image
                          width={144}
                          height={144}
                          className="hidden grow shrink-0 basis-0 rounded-md"
                          src="/media/images/default/zhgLgjCtsbVWTYRQuFeBf3XoW6c.jpg"
                          alt="Software Suite"
                        />
                        <div className="hidden h-px flex-col items-center gap-2 bg-transparent px-12 py-12" />
                      </div>
                      <div className="hidden w-full flex-col items-center gap-2 bg-transparent px-2 py-2" />
                      <span className="w-full text-display-text-small font-display-text-small text-default-font-light">
                        Accordion header
                      </span>
                    </div>
                    <BrandAccordion.Chevron />
                  </div>
                }
                headerImage="/media/images/default/zhgLgjCtsbVWTYRQuFeBf3XoW6c.jpg"
                headerText="Software Suite"
              >
                <div className="flex w-full grow shrink-0 basis-0 flex-col items-start gap-2 px-3 py-2">
                  <div className="flex w-full items-center gap-2 border-b border-solid border-neutral-border">
                    <FeatherCircleSmall className="text-body-large font-body-large text-default-font" />
                    <div className="flex grow shrink-0 basis-0 flex-wrap items-start gap-2 px-2 py-2">
                      <span className="text-body-large font-body-large text-brand-700">Stoomp</span>
                      <span className="text-body-large font-body-large text-subtext-color">
                        AI-powered video analysis for performance enhancement
                      </span>
                    </div>
                    <ButtonThemed
                      variant="brand-tertiary"
                      size="small"
                      iconRight={<FeatherArrowUpRight />}
                      onClick={(_event: React.MouseEvent<HTMLButtonElement>) => {}}
                    />
                  </div>
                  <div className="flex w-full items-center gap-2 border-b border-solid border-neutral-border">
                    <FeatherCircleSmall className="text-body-large font-body-large text-default-font" />
                    <div className="flex grow shrink-0 basis-0 flex-wrap items-start gap-2 px-2 py-2">
                      <span className="text-body-large font-body-large text-brand-700">
                        Cuaderno
                      </span>
                      <span className="text-body-large font-body-large text-subtext-color">
                        Production management and team collaboration platform
                      </span>
                    </div>
                    <ButtonThemed
                      variant="brand-tertiary"
                      size="small"
                      iconRight={<FeatherArrowUpRight />}
                      onClick={(_event: React.MouseEvent<HTMLButtonElement>) => {}}
                    />
                  </div>
                  <div className="flex w-full items-center gap-2">
                    <FeatherCircleSmall className="text-body-large font-body-large text-default-font" />
                    <div className="flex grow shrink-0 basis-0 flex-wrap items-start gap-2 px-2 py-2">
                      <span className="text-body-large font-body-large text-brand-700">Platea</span>
                      <span className="text-body-large font-body-large text-subtext-color">
                        Talent discovery and casting optimization platform
                      </span>
                    </div>
                    <ButtonThemed
                      variant="brand-tertiary"
                      size="small"
                      iconRight={<FeatherArrowUpRight />}
                      onClick={(_event: React.MouseEvent<HTMLButtonElement>) => {}}
                    />
                  </div>
                  <div className="flex h-px w-full flex-none flex-col items-center gap-2 bg-transparent px-2 py-2" />
                </div>
              </BrandAccordion>
              <BrandAccordion
                trigger={
                  <div className="flex w-full items-center gap-2 px-3 py-4">
                    <div className="flex grow shrink-0 basis-0 flex-col items-start">
                      <div className="flex items-start">
                        <Image
                          width={144}
                          height={144}
                          className="hidden grow shrink-0 basis-0 rounded-md"
                          src="/media/images/default/zhgLgjCtsbVWTYRQuFeBf3XoW6c.jpg"
                          alt="Automation Agency"
                        />
                        <div className="hidden h-px flex-col items-center gap-2 bg-transparent px-12 py-12" />
                      </div>
                      <div className="hidden w-full flex-col items-center gap-2 bg-transparent px-2 py-2" />
                      <span className="w-full text-display-text-small font-display-text-small text-default-font-light">
                        Accordion header
                      </span>
                    </div>
                    <BrandAccordion.Chevron />
                  </div>
                }
                headerImage="/media/images/default/zhgLgjCtsbVWTYRQuFeBf3XoW6c.jpg"
                headerText="Automation Agency"
              >
                <div className="flex w-full grow shrink-0 basis-0 flex-col items-start">
                  <div className="flex w-full grow shrink-0 basis-0 flex-col items-start gap-2 px-3 py-2">
                    <span className="text-body-large font-body-large text-subtext-color">
                      Custom AI and machine learning solutions for production workflows and
                      organizational administration.
                    </span>
                  </div>
                  <div className="flex w-full items-start gap-2 px-6 py-6">
                    <div className="flex h-0 grow shrink-0 basis-0 flex-col items-center gap-2 bg-neutral-border" />
                    <ButtonThemed
                      variant="brand-secondary"
                      iconRight={<FeatherArrowUpRight />}
                      onClick={(_event: React.MouseEvent<HTMLButtonElement>) => {}}
                    >
                      VISIT THE AGENCY
                    </ButtonThemed>
                  </div>
                </div>
              </BrandAccordion>
              <BrandAccordion
                trigger={
                  <div className="flex w-full items-center gap-2 px-3 py-4">
                    <div className="flex grow shrink-0 basis-0 flex-col items-start">
                      <div className="flex items-start">
                        <Image
                          width={144}
                          height={144}
                          className="hidden grow shrink-0 basis-0 rounded-md"
                          src="/media/images/default/zhgLgjCtsbVWTYRQuFeBf3XoW6c.jpg"
                          alt="Academic Publishing Division"
                        />
                        <div className="hidden h-px flex-col items-center gap-2 bg-transparent px-12 py-12" />
                      </div>
                      <div className="hidden w-full flex-col items-center gap-2 bg-transparent px-2 py-2" />
                      <span className="w-full text-display-text-small font-display-text-small text-default-font-light">
                        Accordion header
                      </span>
                    </div>
                    <BrandAccordion.Chevron />
                  </div>
                }
                headerImage="/media/images/default/zhgLgjCtsbVWTYRQuFeBf3XoW6c.jpg"
                headerText="Academic Publishing Division"
              >
                <div className="flex w-full grow shrink-0 basis-0 flex-col items-start">
                  <div className="flex w-full grow shrink-0 basis-0 flex-col items-start gap-2 px-3 py-2">
                    <span className="text-body-large font-body-large text-subtext-color">
                      Digital-first scholarly publishing with AI integration and Spanish-language
                      translations, making research more accessible and actionable.
                    </span>
                  </div>
                  <div className="flex w-full items-start gap-2 px-6 py-6">
                    <div className="flex h-0 grow shrink-0 basis-0 flex-col items-center gap-2 bg-neutral-border" />
                    <ButtonThemed
                      variant="brand-secondary"
                      iconRight={<FeatherArrowUpRight />}
                      onClick={(_event: React.MouseEvent<HTMLButtonElement>) => {}}
                    >
                      VISIT THE EDITORIAL
                    </ButtonThemed>
                  </div>
                </div>
              </BrandAccordion>
            </div>
          </>
        </DarkSection>
      </div>
      {/* Bottom Blur Frame Component */}
      <BottomBlurFrame />
    </>
  )
}
