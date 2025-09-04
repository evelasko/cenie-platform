'use client'

// import { type Metadata } from 'next'
import MediaHero from '../components/heroes/MediaHero'
import MarginBlock from '../components/layouts/MarginBlock'
import DarkSection from '../components/layouts/DarkSection'
import { motion } from 'framer-motion'
import { useRef } from 'react'
import clsx from 'clsx'
import TinyTitle from '../components/elements/TinyTitle'
import { BrandAccordion } from '../ui/components/BrandAccordion'
import { ButtonThemed } from '../ui/components/ButtonThemed'
import { FeatherArrowUpRight } from '@subframe/core'
import Image from 'next/image'
import Spacer from '../components/layouts/Spacer'
import { Button } from '../ui/components/Button'
import { AccordionFaq } from '../ui/components/AccordionFaq'
import { DynamicIcon } from 'lucide-react/dynamic'
import { BulletList } from '../ui/components/BulletList'
import { BulletListItem } from '../ui/components/BulletListItem'
import WhatWeDoFor from './widgets/WhatWeDoFor'

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

  // // Use global scroll progress for slower-than-scroll animation
  // const { scrollYProgress } = useScroll()

  // // Define scroll stages for slower reveal animation (80% of scroll to complete)
  // const scrollStages = {
  //   initial: 0, // 0% - Animation starts
  //   active: 0.3, // 30% - Main transition begins
  //   complete: 0.8, // 80% - Reveal completes, content centered
  //   normal: 1.0, // 100% - Normal scrolling
  // }

  // // REVEALER ANIMATIONS (the hero component that moves away)
  // // Scale animations: X axis subtle compression, Y axis moderate compression
  // const revealerScaleX = useTransform(
  //   scrollYProgress,
  //   [scrollStages.initial, scrollStages.complete],
  //   [1, 0.55],
  //   { ease: easeOut }
  // )
  // const revealerScaleY = useTransform(
  //   scrollYProgress,
  //   [scrollStages.initial, scrollStages.complete],
  //   [1, 0.5],
  //   { ease: easeOut }
  // )

  // // Translation: Move revealer up and out of viewport
  // const revealerTranslateY = useTransform(
  //   scrollYProgress,
  //   [scrollStages.initial, scrollStages.complete],
  //   [0, -400], // Move further up to ensure complete exit
  //   { ease: easeInOut }
  // )

  // // REVEALER-CONTENT ANIMATIONS (the content that gets revealed)
  // // Translation: Start above center, end at center when revealer exits
  // const contentTranslateY = useTransform(
  //   scrollYProgress,
  //   [scrollStages.initial, scrollStages.complete],
  //   [-150, 750], // Start slightly above, end centered
  //   { ease: easeOut }
  // )

  // // Scale: Subtle zoom-in effect during reveal
  // const contentScale = useTransform(
  //   scrollYProgress,
  //   [scrollStages.initial, scrollStages.active],
  //   [0.85, 1],
  //   { ease: easeOut }
  // )

  // // Opacity: Fade in during initial stage
  // const contentOpacity = useTransform(
  //   scrollYProgress,
  //   [scrollStages.initial, scrollStages.initial + 0.15], // Quick fade-in
  //   [0, 1],
  //   { ease: easeOut }
  // )

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
        // style={{
        //   scaleX: revealerScaleX,
        //   scaleY: revealerScaleY,
        //   y: revealerTranslateY,
        //   transformOrigin: 'center center',
        //   willChange: 'transform',
        // }}
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
        // style={{
        //   y: contentTranslateY,
        //   scale: contentScale,
        //   opacity: contentOpacity,
        //   willChange: 'transform, opacity',
        // }}
      >
        <MarginBlock header={<div />}>
          <p className="text-display-text-extra-large text-default-font">
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
        {/* Problem =============================================== */}
        <section id="problem">
          <div className="content-wrapper flex flex-col lg:flex-row w-full lg:items-stretch gap-6 lg:gap-8">
            {/* Text Content Column */}
            <div className="w-full lg:w-[80%] flex flex-col items-start gap-4">
              <span className="text-display-text-extra-large text-default-font pb-4 lg:pb-8">
                Performing artists and organizations are navigating unprecedented challenges:
              </span>

              {/* Challenge List */}
              <BulletList>
                {[
                  {
                    heading: 'Economic uncertainty',
                    details: 'with traditional funding models under pressure',
                  },
                  {
                    heading: 'Technology gaps',
                    details: 'that separate artists from new opportunities',
                  },
                  {
                    heading: 'Educational limitations',
                    details: 'in business and digital literacy',
                  },
                  {
                    heading: 'Fragmented resources',
                    details: 'across training, creation, and production',
                  },
                  {
                    heading: 'Language barriers',
                    details: 'limiting access to cutting-edge methodologies',
                  },
                  {
                    heading: 'Operational inefficiencies',
                    details: 'in production and talent management',
                  },
                ].map(({ heading, details }) => (
                  <BulletListItem key={heading}>
                    {heading}
                    <span className="text-subtext-color"> {details}</span>
                  </BulletListItem>
                ))}
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
        {/* Solutions ============================================= */}
        <section id="solutions">
          <DarkSection customClass="py-12 lg:py-32">
            <>
              <MarginBlock
                header={<TinyTitle text="What we do" className="mb-4 lg:mb-0" variant="light" />}
              >
                <h2 className="text-heading-2">Solutions.</h2>
                <p className="pt-8 text-body md:!text-body-large">
                  CENIE addresses these challenges through an integrated ecosystem of seven
                  initiatives that work seamlessly together:
                </p>
              </MarginBlock>
              <div className="content-wrapper">
                {[
                  {
                    heading: 'Academy for Specialized Education',
                    details:
                      'Professional development courses in technology, finance, and business skills specifically designed for performing artists. Bridge the gap between traditional arts training and modern career requirements.',
                    ctaLabel: 'visit the academy',
                    ctaLink: 'https://academy.cenie.org',
                    image: '/media/images/image-1.jpg',
                  },
                  {
                    heading: 'Creative Development Hub',
                    details:
                      'Innovation labs and residency programs where choreographers and directors can experiment with AI, AR/VR, and emerging technologies in collaborative environments.',
                    ctaLabel: 'visit the hub',
                    ctaLink: '',
                    image: '/media/images/image-1.jpg',
                  },
                  {
                    heading: 'Training Exchange Network',
                    details:
                      'Platform for sharing and developing evidence-based methodologies among performing arts educators and trainers worldwide.',
                    ctaLabel: 'explore the network',
                    ctaLink: '',
                    image: '/media/images/image-1.jpg',
                  },
                  {
                    heading: 'Software Suite',
                    detailsNode: (
                      <div className="w-full space-y-4">
                        {[
                          {
                            heading: 'Stoomp',
                            details: 'AI-powered video analysis for performance enhancement',
                            ctaLink: 'https://stoomp.cenie.org',
                          },
                          {
                            heading: 'qAderno',
                            details: 'Production management and team collaboration platform',
                            ctaLink: 'https://qaderno.cenie.org',
                          },
                          {
                            heading: 'Platea',
                            details: 'Talent discovery and casting optimization platform',
                            ctaLink: 'https://platea.cenie.org',
                          },
                        ].map(({ heading, details, ctaLink }) => (
                          <div
                            key={heading}
                            className="flex gap-3 pb-4 border-b border-neutral-100"
                          >
                            <div className="w-full">
                              <div className="text-body-large text-brand-700 pb-2">{heading}</div>
                              <div className="text-body-small md:!text-body text-neutral-500">
                                {details}
                              </div>
                            </div>
                            <ButtonThemed
                              variant="brand-tertiary"
                              size="medium"
                              iconRight={<FeatherArrowUpRight />}
                              onClick={(_event: React.MouseEvent<HTMLButtonElement>) => {
                                // TODO: Implement onClick
                                console.log(ctaLink)
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    ),
                    ctaLabel: '',
                    ctaLink: '',
                    image: '/media/images/image-1.jpg',
                  },
                  {
                    heading: 'Automation Agency',
                    details:
                      'Custom AI and machine learning solutions for production workflows and organizational administration.',
                    ctaLabel: 'visit the agency',
                    ctaLink: 'https://agency.cenie.org',
                    image: '/media/images/image-1.jpg',
                  },
                  {
                    heading: 'Research and Development',
                    details:
                      'Advanced research and development in performing arts methodologies and technology.',
                    ctaLabel: 'visit the editorial',
                    ctaLink: 'https://editorial.cenie.org',
                    image: '/media/images/image-1.jpg',
                  },
                ].map(({ heading, details, image, detailsNode, ctaLabel, ctaLink }) => (
                  <BrandAccordion
                    key={heading}
                    trigger={
                      <div className="flex w-full items-center gap-2 px-3 py-4">
                        <div className="flex grow shrink-0 basis-0 flex-col items-start text-display-text-small text-default-font-light">
                          {heading}
                        </div>
                        <BrandAccordion.Chevron />
                      </div>
                    }
                    headerImage={image}
                    headerText={heading}
                  >
                    <div className="flex w-full grow shrink-0 basis-0 flex-col items-start gap-2">
                      <div className="flex w-full grow shrink-0 basis-0 flex-col items-start gap-2 px-3 pb-2">
                        <span className="text-body md:!text-body-large  text-neutral-500">
                          {details ?? detailsNode}
                        </span>
                      </div>
                      <div className="flex w-full items-start gap-2 px-6 py-6">
                        <div className="flex h-0 grow shrink-0 basis-0 flex-col items-center gap-2 bg-neutral-border" />
                        <ButtonThemed
                          variant="brand-secondary"
                          iconRight={<FeatherArrowUpRight />}
                          onClick={(_event: React.MouseEvent<HTMLButtonElement>) => {
                            // TODO: Implement onClick
                            console.log(ctaLink)
                          }}
                        >
                          {ctaLabel}
                        </ButtonThemed>
                      </div>
                    </div>
                  </BrandAccordion>
                ))}
              </div>
            </>
          </DarkSection>
        </section>
        <Spacer />
        {/* What we do for artists ================================ */}
        <section id="what-we-do-for-artists">
          <WhatWeDoFor
            heading={['For Performing Artists:', 'elevate your skills & career potential']}
            details="The most successful artists of the next decade will be those who combine their creative talent with technological literacy and business acumen. We exist to make those skills accessible."
            steps={[
              {
                image: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f',
                label: 'Master essential technology skills through specific training programs',
              },
              {
                image:
                  'https://res.cloudinary.com/subframe/image/upload/v1755504646/uploads/24215/ugj8o2t8sumcxjtv85lq.jpg',
                label: 'Access AI-powered tools that enhance your creative process',
              },
              {
                image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4',
                label: 'Develop business acumen for freelance success and entrepreneurship',
              },
              {
                image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0',
                label: 'Connect with a global community of forward-thinking artists',
              },
            ]}
            explanation="You're a talented dancer who wants to build an international online presence, a recent theatre graduate needing to understand project budgets, or an actor looking to leverage AI for auditioning. We provide the practical skills that complement your artistic training."
            underExplanation="We provide the practical skills that complement your artistic training."
            ctaTitle="Explore the Skills Pathway"
            ctaLabel="Visit our Skills Section"
            ctaLink="todo" // TODO: Add link
            image="/media/images/image-1.jpg"
            imageAlt="Success story background"
          />
        </section>
        <Spacer />
        {/* What we do for creatives ============================== */}
        <section id="what-we-do-for-creatives">
          <WhatWeDoFor
            heading={['For Creative Professionals:', 'innovate your art with technology']}
            details="Technology should not replace human creativity, but amplify it. When used with intention, AI, AR/VR, and other emerging tools can unlock unprecedented artistic possibilities."
            steps={[
              {
                image: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f',
                label: 'Access state-of-the-art innovation labs and residency programs',
              },
              {
                image:
                  'https://res.cloudinary.com/subframe/image/upload/v1755504646/uploads/24215/ugj8o2t8sumcxjtv85lq.jpg',
                label: 'Use AI video analysis tools to refine performances with precision',
              },
              {
                image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4',
                label: 'Integrate emerging technologies into your artistic practice',
              },
              {
                image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0',
                label: 'Collaborate with technologists who understand artistic vision',
              },
            ]}
            explanation="You're a choreographer curious about generative AI as a creative partner, a director looking to integrate interactive visuals into a live performance, or a collective wanting to explore the future of digital theatre. We provide the sandbox and the tools for you to build what's next."
            underExplanation="We provide the sandbox and the tools for you to build what's next."
            ctaTitle="Explore the Innovation Pathway"
            ctaLabel="Visit our Innovation Section"
            ctaLink="todo" // TODO: Add link
            image="/media/images/image-1.jpg"
            imageAlt="Success story background"
          />
        </section>
        <Spacer />
        {/* What we do for professionals ========================== */}
        <section id="what-we-do-for-professionals">
          <WhatWeDoFor
            heading={['For Industry Professionals:', 'optimize your production processes']}
            details="Operational excellence frees up resources for what truly matters: creating impactful art. By streamlining workflows, we can make the entire industry more sustainable and resilient."
            steps={[
              {
                image: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f',
                label: 'Streamline productions with collaborative management platform',
              },
              {
                image:
                  'https://res.cloudinary.com/subframe/image/upload/v1755504646/uploads/24215/ugj8o2t8sumcxjtv85lq.jpg',
                label: 'Accelerate casting and talent discovery through matching algorithms',
              },
              {
                image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4',
                label: 'Implement custom AI automation for repetitive administrative tasks',
              },
              {
                image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0',
                label: 'Receive strategic consulting for digital transformation',
              },
            ]}
            explanation="You're a production manager for a national theatre tired of coordinating via endless email chains, an artistic director needing a more efficient casting process, or an organization looking to digitize archives and streamline operations. We build the infrastructure that lets you focus on the art."
            underExplanation="We build the infrastructure that lets you focus on the art."
            ctaTitle="Explore the Optimization Pathway"
            ctaLabel="Visit our Optimization Section"
            ctaLink="todo" // TODO: Add link
            image="/media/images/image-1.jpg"
            imageAlt="Success story background"
          />
        </section>
        <Spacer />
        {/* What we do for researchers ============================ */}
        <section id="what-we-do-for-researchers">
          <WhatWeDoFor
            heading={['For Researchers &amp; Academics:', 'explore cutting-edge insights']}
            details="The future of performing arts scholarship is digital, accessible, and interconnected. By integrating research with AI, we can accelerate discovery and bridge the gap between theory and practice."
            steps={[
              {
                image: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f',
                label: 'Publish through our AI-enhanced academic division with global reach',
              },
              {
                image:
                  'https://res.cloudinary.com/subframe/image/upload/v1755504646/uploads/24215/ugj8o2t8sumcxjtv85lq.jpg',
                label: 'Access comprehensive methodology libraries and research databases',
              },
              {
                image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4',
                label: 'Contribute to developing AI-ready content models for performing arts',
              },
              {
                image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0',
                label: 'Connect with researchers worldwide through our sharing platform',
              },
            ]}
            explanation="You're a researcher looking to integrate AI into your work, an academic seeking to develop new methodologies, or an institution wanting to digitize archives and streamline operations. We provide the tools and resources to make your research more efficient and impactful."
            underExplanation="We provide the tools and resources to make your research more efficient and impactful."
            ctaTitle="Explore the Research Pathway"
            ctaLabel="Visit our Research Section"
            ctaLink="todo" // TODO: Add link
            image="/media/images/image-1.jpg"
            imageAlt="Success story background"
          >
            <MarginBlock header={<div />}>
              <div className="flex grow shrink-0 basis-0 flex-col items-start gap-6 pr-6 pt-6 pb-12">
                <span className="w-full text-display-text-large text-subtext-color">
                  Access research resources
                </span>
                <Button
                  onClick={(_event: React.MouseEvent<HTMLButtonElement>) => {
                    // TODO: Implement onClick
                    console.log('ctaLink')
                  }}
                >
                  Visit our Insights Section
                </Button>
              </div>
            </MarginBlock>
          </WhatWeDoFor>
          <div className="py-12" />
        </section>
        <Spacer />
        {/* The CENIE Difference ================================== */}
        <section id="the-cenie-difference">
          <DarkSection customClass="py-12 lg:py-32">
            <>
              <MarginBlock
                header={<TinyTitle text="What we do" className="mb-4 lg:mb-0" variant="light" />}
              >
                <>
                  <h2 className="text-heading-2">Difference.</h2>
                  <p className="text-display-text-extra-large text-neutral-500 pt-8">
                    Why We&apos;re Uniquely Positioned to Transform Your Success
                  </p>
                </>
              </MarginBlock>
              <MarginBlock
                header={
                  <div className="h-full md:flex-col justify-end pr-8 hidden md:flex">
                    <p className="text-display-text-large pb-4">Discover More</p>
                    <ButtonThemed
                      variant="brand-primary"
                      size="medium"
                      iconRight={<FeatherArrowUpRight />}
                      onClick={(_event: React.MouseEvent<HTMLButtonElement>) => {
                        // TODO: Implement onClick
                        console.log('ctaLink')
                      }}
                    >
                      Visit our About Section
                    </ButtonThemed>
                  </div>
                }
              >
                <>
                  <div className="w-full grid grid-cols-2 gap-1">
                    {[
                      {
                        heading: 'Deep Performing Arts Expertise',
                        details:
                          "Our founders and team come from prestigious performing arts institutions and have decades of experience in theater, dance, and interdisciplinary performance. We understand your challenges because we've lived them.",
                        icon: 'activity',
                      },
                      {
                        heading: 'Cutting-Edge Technology Integration',
                        details:
                          'We partner with leading AI researchers and technology developers to create tools specifically for artistic applications. Our solutions amplify human creativity rather than replace it.',
                        icon: 'anchor',
                      },
                      {
                        heading: 'Comprehensive Ecosystem Approach',
                        details:
                          "Unlike fragmented solutions, CENIE's seven integrated initiatives work together to address every aspect of your professional development and organizational needs.",
                        icon: 'anchor',
                      },
                      {
                        heading: 'Evidence-Based Results',
                        details:
                          'Our methodologies are backed by research and proven outcomes. We track success metrics and continuously refine our approaches based on real-world results.',
                        icon: 'anchor',
                      },
                    ].map(({ heading, details, icon }) => (
                      <div key={heading} className="bg-neutral-100/50 p-6 rounded-md">
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-2 pb-4">
                          <div className="mb-2 md:mb-0">
                            <DynamicIcon name={icon as any} size={12} color="white" />
                          </div>
                          <p className="text-body md:!text-body-large text-default-font-light !font-bold">
                            {heading}
                          </p>
                        </div>
                        <p className="text-body-small md:!text-body text-neutral-600">{details}</p>
                      </div>
                    ))}
                  </div>
                  <div className="w-full md:hidden pt-24">
                    <p className="text-display-text-large pb-4">Discover More</p>
                    <ButtonThemed
                      variant="brand-primary"
                      size="medium"
                      iconRight={<FeatherArrowUpRight />}
                      onClick={(_event: React.MouseEvent<HTMLButtonElement>) => {
                        // TODO: Implement onClick
                        console.log('ctaLink')
                      }}
                    >
                      Visit our About Section
                    </ButtonThemed>
                  </div>
                </>
              </MarginBlock>
            </>
          </DarkSection>
        </section>
        <Spacer />
        {/* FAQ ===================================================== */}
        <section id="faq">
          <div className="w-full flex-wrap items-start gap-2 px-2 py-2 grid grid-cols-1 md:grid-cols-2 content-wrapper">
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
                      <span className="grow shrink-0 basis-0 text-display-text-small">
                        Who is CENIE designed for?
                      </span>
                      <AccordionFaq.Chevron />
                    </div>
                  }
                  defaultOpen={true}
                >
                  <div className="flex w-full grow shrink-0 basis-0 flex-col items-start gap-2 px-3 py-4">
                    <span className="text-body-large text-subtext-color">
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
                    <span className="text-body-large text-subtext-color">
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
                    <span className="text-body-large text-subtext-color">
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
                    <span className="text-body-large text-subtext-color">
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

        <MarginBlock header={<TinyTitle text="What we do" />}>
          <p className="text-display-text-large">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
          </p>
        </MarginBlock>
      </div>
    </>
  )
}
