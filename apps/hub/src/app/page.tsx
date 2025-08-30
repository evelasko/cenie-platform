'use client'

// import { type Metadata } from 'next'
import MediaHero from '../components/heroes/MediaHero'
import MarginBlock from '../components/layouts/MarginBlock'
import DarkSection from '../components/layouts/DarkSection'
import BottomBlurFrame from '../components/decorations/BottomBlurFrame'
import { motion, useScroll, useTransform, easeOut, easeInOut } from 'framer-motion'
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
import { StepCard } from '../ui/components/StepCard'
import { Button } from '../ui/components/Button'
import { AccordionFaq } from '../ui/components/AccordionFaq'
import { BulletList } from '../ui/components/BulletList'
import { BulletListItem } from '../ui/components/BulletListItem'

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
  const revealerRef = useRef<HTMLDivElement>(null)

  // Use global scroll progress for slower-than-scroll animation
  const { scrollYProgress } = useScroll()

  // Define scroll stages for slower reveal animation (80% of scroll to complete)
  const scrollStages = {
    initial: 0, // 0% - Animation starts
    active: 0.3, // 30% - Main transition begins
    complete: 0.8, // 80% - Reveal completes, content centered
    normal: 1.0, // 100% - Normal scrolling
  }

  // REVEALER ANIMATIONS (the hero component that moves away)
  // Scale animations: X axis subtle compression, Y axis moderate compression
  const revealerScaleX = useTransform(
    scrollYProgress,
    [scrollStages.initial, scrollStages.complete],
    [1, 0.55],
    { ease: easeOut }
  )
  const revealerScaleY = useTransform(
    scrollYProgress,
    [scrollStages.initial, scrollStages.complete],
    [1, 0.5],
    { ease: easeOut }
  )

  // Translation: Move revealer up and out of viewport
  const revealerTranslateY = useTransform(
    scrollYProgress,
    [scrollStages.initial, scrollStages.complete],
    [0, -400], // Move further up to ensure complete exit
    { ease: easeInOut }
  )

  // REVEALER-CONTENT ANIMATIONS (the content that gets revealed)
  // Translation: Start above center, end at center when revealer exits
  const contentTranslateY = useTransform(
    scrollYProgress,
    [scrollStages.initial, scrollStages.complete],
    [-150, 750], // Start slightly above, end centered
    { ease: easeOut }
  )

  // Scale: Subtle zoom-in effect during reveal
  const contentScale = useTransform(
    scrollYProgress,
    [scrollStages.initial, scrollStages.active],
    [0.85, 1],
    { ease: easeOut }
  )

  // Opacity: Fade in during initial stage
  const contentOpacity = useTransform(
    scrollYProgress,
    [scrollStages.initial, scrollStages.initial + 0.15], // Quick fade-in
    [0, 1],
    { ease: easeOut }
  )

  return (
    <>
      {/* Hero Section */}
      <motion.div
        id="revealer"
        ref={revealerRef}
        className={clsx(
          'h-[calc(100vh-4rem)] mt-16 px-1 md:px-1.5',
          'bg-gradient-to-b from-[var(--color-nav-background)] to-background',
          'z-[5]'
        )}
        style={{
          scaleX: revealerScaleX,
          scaleY: revealerScaleY,
          y: revealerTranslateY,
          transformOrigin: 'center center',
          willChange: 'transform',
        }}
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
      </motion.div>
      <motion.div
        id="revealer-content"
        className="z-[1]"
        ref={containerRef}
        style={{
          y: contentTranslateY,
          scale: contentScale,
          opacity: contentOpacity,
          willChange: 'transform, opacity',
        }}
      >
        <MarginBlock header={<div />}>
          <p className="text-hero-quote">
            No somos otra app:{' '}
            <span className="text-subtext-color">
              CENIE es un ecosistema diseñado por y para la comunidad artística que combina el
              conocimiento del arte con la innovación tecnológica de vanguardia.
            </span>
          </p>
        </MarginBlock>
      </motion.div>
      <div className="page-wrapper">
        {/* Page Content */}
        <Spacer />
        {/* Problem ================================================== */}
        <section id="problem">
          <div className="content-wrapper flex flex-col lg:flex-row w-full lg:items-stretch gap-6 lg:gap-8">
            {/* Text Content Column */}
            <div className="w-full lg:w-[80%] flex flex-col items-start gap-4">
              <span className="text-display-text-large text-default-font pb-4 lg:pb-8">
                Performing artists and organizations are navigating unprecedented challenges:
              </span>

              {/* Challenge List */}
              <BulletList>
                <BulletListItem>
                  Economic uncertainty
                  <span className="text-subtext-color">
                    {' '}
                    with traditional funding models under pressure
                  </span>
                </BulletListItem>

                <BulletListItem>
                  Technology gaps
                  <span className="text-subtext-color">
                    {' '}
                    that separate artists from new opportunities
                  </span>
                </BulletListItem>

                <BulletListItem>
                  Educational limitations
                  <span className="text-subtext-color"> in business and digital literacy</span>
                </BulletListItem>

                <BulletListItem>
                  Fragmented resources
                  <span className="text-subtext-color">
                    {' '}
                    across training, creation, and production
                  </span>
                </BulletListItem>

                <BulletListItem>
                  Language barriers
                  <span className="text-subtext-color">
                    {' '}
                    limiting access to cutting-edge methodologies
                  </span>
                </BulletListItem>

                <BulletListItem>
                  Operational inefficiencies
                  <span className="text-subtext-color"> in production and talent management</span>
                </BulletListItem>
              </BulletList>
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
          <MarginBlock header={<div />}>
            <p className="text-display-text-extra-large">
              The result?{' '}
              <span className="text-subtext-color">
                Talented artists struggling to build sustainable careers while organizations miss
                opportunities for innovation and growth.
              </span>
            </p>
          </MarginBlock>
        </section>
        <Spacer />
        {/* Solutions ================================================ */}
        <section id="solutions">
          <DarkSection customClass="py-12 lg:py-32">
            <>
              <MarginBlock header={<TinyTitle text="What we do" className="mb-4 lg:mb-0" />}>
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
                        Innovation labs and residency programs where choreographers and directors
                        can experiment with AI, AR/VR, and emerging technologies in collaborative
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
                        <span className="text-body-large font-body-large text-brand-700">
                          Stoomp
                        </span>
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
                        <span className="text-body-large font-body-large text-brand-700">
                          Platea
                        </span>
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
        </section>
        <Spacer />
        {/* Success Story ============================================ */}
        <section id="success-story-for-artists">
          <MarginBlock header={<TinyTitle text="Success Story" />}>
            <div className="flex flex-col items-start gap-6 pr-6 pt-6 pb-12">
              <div className="flex flex-wrap items-start gap-2">
                <span className="text-display-text-extra-large text-default-font">
                  For performing artists:
                </span>
                <span className="text-display-text-extra-large text-subtext-color">
                  Elevate Your Skills &amp; Career Potential
                </span>
              </div>
              <div className="text-body">
                The Opportunity: Artists who embrace technology and business literacy see an average
                40% increase in income and 90% improvement in career sustainability.
              </div>
              <span className="text-display-text-extra-large text-subtext-color">how we help:</span>
            </div>
          </MarginBlock>
          <div className="w-full items-start gap-1 grid grid-cols-2 content-wrapper">
            <StepCard
              image="https://images.unsplash.com/photo-1516321497487-e288fb19713f"
              label="Master essential technology skills through specific training programs"
              variant="step-1"
            />
            <StepCard
              image="https://res.cloudinary.com/subframe/image/upload/v1755504646/uploads/24215/ugj8o2t8sumcxjtv85lq.jpg"
              label="Access AI-powered tools that enhance your creative process"
              variant="step-2"
            />
            <StepCard
              image="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4"
              label="Develop business acumen for freelance success and entrepreneurship"
              variant="step-3"
            />
            <StepCard
              image="https://images.unsplash.com/photo-1542744173-8e7e53415bb0"
              label="Connect with a global community of forward-thinking artists"
              variant="step-4"
            />
          </div>
        </section>
        <Spacer />
        {/* Success Story for Creatives ============================== */}
        <section id="success-story-for-creatives">
          <MarginBlock header={<TinyTitle text="Success Story" />}>
            <div className="flex flex-col items-start gap-6 pr-6 pt-6 pb-12">
              <div className="flex flex-wrap items-start gap-2">
                <span className="text-display-text-extra-large font-display-text-extra-large text-default-font">
                  For Creative Professionals:
                </span>
                <span className="text-display-text-extra-large font-display-text-extra-large text-subtext-color">
                  Innovate Your Art with Technology
                </span>
              </div>
              <span className="text-body-large font-body-large text-default-font">
                The Opportunity: Artists and directors using AI-enhanced creative tools report 60%
                faster development cycles and unprecedented creative breakthroughs.
              </span>
              <span className="text-display-text-extra-large font-display-text-extra-large text-subtext-color">
                how we help:
              </span>
            </div>
          </MarginBlock>
          <div className="w-full items-start gap-1 grid grid-cols-2 content-wrapper">
            <StepCard
              image="https://images.unsplash.com/photo-1516321497487-e288fb19713f"
              label="Access state-of-the-art innovation labs and residency programs"
              variant="step-1"
            />
            <StepCard
              image="https://res.cloudinary.com/subframe/image/upload/v1755504646/uploads/24215/ugj8o2t8sumcxjtv85lq.jpg"
              label="Use Stoomp's AI video analysis to refine performances with precision"
              variant="step-2"
            />
            <StepCard
              image="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4"
              label="Integrate emerging technologies into your artistic practice"
              variant="step-3"
            />
            <StepCard
              image="https://images.unsplash.com/photo-1542744173-8e7e53415bb0"
              label="Collaborate with technologists who understand artistic vision"
              variant="step-4"
            />
          </div>
        </section>
        <Spacer />
        {/* Success Story for Professionals ========================== */}
        <section id="success-story-for-professionals">
          <MarginBlock header={<TinyTitle text="Success Story" />}>
            <div className="flex flex-col items-start gap-6 pr-6 pt-6 pb-12">
              <div className="flex flex-wrap items-start gap-2">
                <span className="text-display-text-extra-large font-display-text-extra-large text-default-font">
                  For Industry Professionals:
                </span>
                <span className="text-display-text-extra-large font-display-text-extra-large text-subtext-color">
                  Optimize Your Production Processes
                </span>
              </div>
              <span className="text-body-large font-body-large text-default-font">
                The Opportunity: Organizations implementing CENIE&#39;s optimization solutions
                achieve 30% reduction in production timelines and significant cost savings through
                workflow automation.
              </span>
              <span className="text-display-text-extra-large font-display-text-extra-large text-subtext-color">
                how we help:
              </span>
            </div>
          </MarginBlock>
          <div className="w-full items-start gap-1 grid grid-cols-2 content-wrapper">
            <StepCard
              image="https://images.unsplash.com/photo-1516321497487-e288fb19713f"
              label="Streamline productions with qAderno's collaborative management platform"
              variant="step-1"
            />
            <StepCard
              image="https://res.cloudinary.com/subframe/image/upload/v1755504646/uploads/24215/ugj8o2t8sumcxjtv85lq.jpg"
              label="Accelerate casting and talent discovery through Platea's matching algorithms"
              variant="step-2"
            />
            <StepCard
              image="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4"
              label="Implement custom AI automation for repetitive administrative tasks"
              variant="step-3"
            />
            <StepCard
              image="https://images.unsplash.com/photo-1542744173-8e7e53415bb0"
              label="Receive strategic consulting for digital transformation"
              variant="step-4"
            />
          </div>
        </section>
        <Spacer />
        {/* Success Story for Researchers ============================ */}
        <section id="success-story-for-researchers">
          <MarginBlock header={<TinyTitle text="Success Story" />}>
            <div className="flex flex-col items-start gap-6 pr-6 pt-6 pb-12">
              <div className="flex flex-wrap items-start gap-2">
                <span className="text-display-text-extra-large font-display-text-extra-large text-default-font">
                  For Researchers &amp; Academics:
                </span>
                <span className="text-display-text-extra-large font-display-text-extra-large text-subtext-color">
                  Explore Cutting-Edge Insights
                </span>
              </div>
              <span className="text-body-large font-body-large text-default-font">
                The Opportunity: Access to CENIE&#39;s research network opens doors to international
                collaborations, enhanced publication opportunities, and AI-ready content
                development.
              </span>
              <span className="text-display-text-extra-large font-display-text-extra-large text-subtext-color">
                how we help:
              </span>
            </div>
          </MarginBlock>
          <div className="w-full items-start gap-1 grid grid-cols-2 content-wrapper">
            <StepCard
              image="https://images.unsplash.com/photo-1516321497487-e288fb19713f"
              label="Publish through our AI-enhanced academic division with global reach"
              variant="step-1"
            />
            <StepCard
              image="https://res.cloudinary.com/subframe/image/upload/v1755504646/uploads/24215/ugj8o2t8sumcxjtv85lq.jpg"
              label="Access comprehensive methodology libraries and research databases"
              variant="step-2"
            />
            <StepCard
              image="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4"
              label="Contribute to developing AI-ready content models for performing arts"
              variant="step-3"
            />
            <StepCard
              image="https://images.unsplash.com/photo-1542744173-8e7e53415bb0"
              label="Connect with researchers worldwide through our sharing platform"
              variant="step-4"
            />
          </div>
          <MarginBlock header={<div />}>
            <div className="flex grow shrink-0 basis-0 flex-col items-start gap-6 pr-6 pt-6 pb-12">
              <span className="w-full text-display-text-extra-large font-display-text-extra-large text-subtext-color">
                Access research resources
              </span>
              <Button onClick={(_event: React.MouseEvent<HTMLButtonElement>) => {}}>
                Visit our Insights Section
              </Button>
            </div>
          </MarginBlock>
        </section>
        <Spacer />
        {/* FAQ ===================================================== */}
        <section id="faq">
          <div className="w-full flex-wrap items-start gap-2 px-2 py-2 grid grid-cols-2 content-wrapper">
            <div className="flex flex-col items-start gap-2">
              <span className="text-heading-2 font-heading-2 text-default-font">FAQ.</span>
              <div className="flex h-12 w-full flex-none flex-col items-center gap-2 bg-transparent" />
              <div className="flex items-start gap-2">
                <span className="grow shrink-0 basis-0 text-body font-body text-default-font">
                  Got questions? We&#39;ve got answers. Here&#39;s everything you need to know about
                  us.
                </span>
                <div className="flex w-32 flex-none flex-col items-center self-stretch bg-transparent px-12 py-12" />
              </div>
            </div>
            <div className="flex grow shrink-0 basis-0 flex-col flex-wrap items-start gap-1">
              <div className="flex w-full flex-col items-start gap-2 rounded-md bg-default-font-light px-6 py-6">
                <AccordionFaq
                  trigger={
                    <div className="flex w-full items-center gap-2 px-3 py-2">
                      <span className="grow shrink-0 basis-0 text-display-text-small font-display-text-small text-default-font">
                        Who is CENIE designed for?
                      </span>
                      <AccordionFaq.Chevron />
                    </div>
                  }
                  defaultOpen={true}
                >
                  <div className="flex w-full grow shrink-0 basis-0 flex-col items-start gap-2 px-3 py-4">
                    <span className="text-body-large font-body-large text-subtext-color">
                      CENIE serves four primary audiences: performing artists seeking professional
                      development, creative professionals looking to innovate with technology,
                      industry professionals needing operational optimization, and
                      researchers/academics advancing scholarly work in performing arts.
                    </span>
                  </div>
                </AccordionFaq>
              </div>
              <div className="flex w-full flex-col items-start gap-2 rounded-md bg-default-font-light px-6 py-6">
                <AccordionFaq
                  trigger={
                    <div className="flex w-full items-center gap-2 px-3 py-2">
                      <span className="grow shrink-0 basis-0 text-display-text-small font-display-text-small text-default-font">
                        Do I need existing technology experience to benefit from CENIE?
                      </span>
                      <AccordionFaq.Chevron />
                    </div>
                  }
                >
                  <div className="flex w-full grow shrink-0 basis-0 flex-col items-start gap-2 px-3 py-4">
                    <span className="text-body-large font-body-large text-subtext-color">
                      Not at all. Our programs are designed to meet you wherever you are in your
                      technology journey. We offer everything from basic digital literacy to
                      advanced AI integration, with clear learning pathways for every skill level.
                    </span>
                  </div>
                </AccordionFaq>
              </div>
              <div className="flex w-full flex-col items-start gap-2 rounded-md bg-default-font-light px-6 py-6">
                <AccordionFaq
                  trigger={
                    <div className="flex w-full items-center gap-2 px-3 py-2">
                      <span className="grow shrink-0 basis-0 text-display-text-small font-display-text-small text-default-font">
                        How does CENIE differ from other online education platforms?
                      </span>
                      <AccordionFaq.Chevron />
                    </div>
                  }
                >
                  <div className="flex w-full grow shrink-0 basis-0 flex-col items-start gap-2 px-3 py-4">
                    <span className="text-body-large font-body-large text-subtext-color">
                      CENIE is the only platform specifically designed by performing arts
                      professionals for the performing arts community. Our content addresses the
                      unique challenges and opportunities facing artists and arts organizations,
                      with culturally relevant examples and practical applications.
                    </span>
                  </div>
                </AccordionFaq>
              </div>
              <div className="flex w-full flex-col items-start gap-2 rounded-md bg-default-font-light px-6 py-6">
                <AccordionFaq
                  trigger={
                    <div className="flex w-full items-center gap-2 px-3 py-2">
                      <span className="grow shrink-0 basis-0 text-display-text-small font-display-text-small text-default-font">
                        What kind of results can I expect?
                      </span>
                      <AccordionFaq.Chevron />
                    </div>
                  }
                >
                  <div className="flex w-full grow shrink-0 basis-0 flex-col items-start gap-2 px-3 py-4">
                    <span className="text-body-large font-body-large text-subtext-color">
                      Based on our tracked outcomes, artists typically see a 40% income increase and
                      90% improvement in technology proficiency within 18 months. Organizations
                      report 30% faster production timelines and significant cost savings through
                      our optimization solutions.
                    </span>
                  </div>
                </AccordionFaq>
              </div>
            </div>
          </div>
        </section>
        <Spacer />
        {/* Who we are =============================================== */}
        <section id="who-we-are">
          <MarginBlock header={<div />}>
            <p className="text-display-text-large">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
            </p>
          </MarginBlock>
        </section>
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
      </div>
      {/* Bottom Blur Frame Component */}
      <BottomBlurFrame />
    </>
  )
}
