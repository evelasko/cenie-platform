"use client"

// import { type Metadata } from 'next'
import MediaHero from '../components/heroes/MediaHero'
import MarginBlock from '../components/layouts/MarginBlock'
import DarkSection from '../components/layouts/DarkSection'
import BottomBlurFrame from '../components/decorations/BottomBlurFrame'
import { motion, useScroll, useTransform, easeOut } from "framer-motion"
import { useRef } from 'react'
import clsx from 'clsx'
import ImageCard from '../components/cards/ImageCard'
import TinyTitle from '../components/elements/TinyTitle'
import OverImageContent from '../components/elements/OverImageContent'
import NoiseOverlay from '../components/decorations/NoiseOverlay'
import { BrandAccordion } from "../ui/components/BrandAccordion";
import { ButtonThemed } from "../ui/components/ButtonThemed";
import { FeatherArrowUpRight } from "@subframe/core";
import { FeatherCircleSmall } from "@subframe/core";

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
  const rangeEnd = 1.8
  const translateY = useTransform(scrollYProgress, [0, rangeEnd], [-150, -50], { ease: easeOut })
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.9, 1], { ease: easeOut })
  const opacity = useTransform(scrollYProgress, [0, 0.1], [0, 1], { ease: easeOut })

  return (
    <>
    <div id="revealer" className={clsx(
      "h-[calc(100vh-4rem)] mt-16 px-1 md:px-1.5",
      "bg-gradient-to-b from-[var(--color-nav-background)] to-background",
      "z-10"
    )
      }>
      <MediaHero backgroundVideo="/media/videos/smoke-fall.mp4" backgroundClassName="mb-1">
      <div className="text-center">
        <h1 className="text-heading-1 text-white">
          The Future of Performing Arts
        </h1>
      </div>
      <div className="text-center pb-16 text-white">
        <p className="text-heading-3 max-w-3xl mx-auto">
          A comprehensive ecosystem empowering performing artists and organizations with AI-powered tools, specialized education, and collaborative platforms.
        </p>
      </div>
      </MediaHero>
    </div>
    <motion.div id="revealer-content" className="z-5" ref={containerRef} 
    style={{ 
      y: translateY, 
      scale, 
      opacity
      }}>
      <MarginBlock header={(<div/>)}>
        <p className='text-display-text-extra-large'>
      We&#39;re not just another technology company: <span className="text-subtext-color">
        CENIE is the first comprehensive ecosystem specifically designed by and
        for the performing arts community, combining deep artistic expertise with
        cutting-edge technological innovation.
      </span>
        </p>
      </MarginBlock>
      </motion.div>
  <div className="page-wrapper">
    
    <DarkSection>
      <div className="flex flex-col items-center p-36 justify-center h-124">
        <p className='text-display-text-large'>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
        </p>
      </div>
    </DarkSection>
    <MarginBlock header={(<div/>)}>
      <p className='text-display-text-large'>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
      </p>
    </MarginBlock>
    <MarginBlock header={(<TinyTitle text="Who we are" />)}>
      <p className='text-display-text-large'>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
      </p>
    </MarginBlock>
    <div className="flex flex-col gap-2 w-full">
      <div className="w-[60%] aspect-[4/3]">
      {/* No Noise Overlay */}
    <ImageCard src="/media/images/image-1.jpg" alt="Image 1">
      <div className="text-center w-full h-full flex items-center justify-center">
        <h2 className="text-heading-3 text-white">
          Lorem ipsum
        </h2>
      </div>
    </ImageCard>
    </div>
    <div className="mt-8 w-[60%] aspect-[4/3]">
    {/* Noise Overlay */}
    <ImageCard src="/media/images/image-1.jpg" alt="Image 1" useNoise diableContentAnimation>
      <div />
    </ImageCard>
      <div className={clsx(
        "absolute w-full h-full inset-2 z-[100]",
        "flex items-center justify-center",
        "text-heading-3 text-white hover:scale-105 hover:font-bold",
        "transition-transform duration-300 ease-out"
      )}>
        <p>Special Content</p>
      </div>
    </div>
    <div className="mt-8 w-[40%] aspect-[4/3]">
    <ImageCard src="/media/images/image-1.jpg" alt="Image 1" variant="clean">
      <div className="text-center w-full h-full flex items-center justify-center">
        <h2 className="text-heading-3 text-white">
          Lorem ipsum
        </h2>
      </div>
    </ImageCard>
    </div>
    </div>
    <MarginBlock header={(<TinyTitle text="What we do" />)}>
      <p className='text-display-text-large'>
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
          onClick={() => { console.log('clicked') }}
        />
      }
    >
      <ImageCard src="/media/images/image-1.jpg" alt="Image 1" variant="clean" diableContentAnimation />
    </NoiseOverlay>
  </div>
  <MarginBlock header={(<TinyTitle text="What we do" />)}>
      <p className='text-display-text-large'>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
      </p>
  </MarginBlock>
  <DarkSection>
    <>
      <MarginBlock header={(<TinyTitle text="What we do" />)}>
      <h2 className="text-heading-2">Solutions.</h2>
      </MarginBlock>
      <BrandAccordion
    trigger={
      <div className="flex w-full items-center gap-2 px-3 py-4">
        <div className="flex grow shrink-0 basis-0 flex-col items-start">
          <div className="flex items-start">
            <img
              className="hidden max-w-[144px] grow shrink-0 basis-0 rounded-md"
              src="https://res.cloudinary.com/subframe/image/upload/v1711417580/shared/zp8qzxs8z5zoyd4r6tti.jpg"
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
    headerImage="https://res.cloudinary.com/subframe/image/upload/v1711417580/shared/zp8qzxs8z5zoyd4r6tti.jpg"
    headerText="Academy for Specialized Education"
  >
    <div className="flex w-full grow shrink-0 basis-0 flex-col items-start gap-2">
      <div className="flex w-full grow shrink-0 basis-0 flex-col items-start gap-2 px-3 py-2">
        <span className="text-body-large font-body-large text-subtext-color">
          Professional development courses in technology, finance, and business
          skills specifically designed for performing artists. Bridge the gap
          between traditional arts training and modern career requirements.
        </span>
      </div>
      <div className="flex w-full items-start gap-2 px-6 py-6">
        <div className="flex h-0 grow shrink-0 basis-0 flex-col items-center gap-2 bg-neutral-border" />
        <ButtonThemed
          variant="brand-secondary"
          iconRight={<FeatherArrowUpRight />}
          onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
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
            <img
              className="hidden max-w-[144px] grow shrink-0 basis-0 rounded-md"
              src="https://res.cloudinary.com/subframe/image/upload/v1711417580/shared/zp8qzxs8z5zoyd4r6tti.jpg"
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
    headerImage="https://res.cloudinary.com/subframe/image/upload/v1711417577/shared/ug6zq2m8ghszl3x4dmng.webp"
    headerText="Creative Development Hub"
  >
    <div className="flex w-full grow shrink-0 basis-0 flex-col items-start gap-2 px-3 py-2">
      <div className="flex flex-col items-start gap-2">
        <span className="text-body-large font-body-large text-subtext-color">
          Innovation labs and residency programs where choreographers and
          directors can experiment with AI, AR/VR, and emerging technologies in
          collaborative environments.
        </span>
      </div>
      <div className="flex w-full items-start gap-2 px-6 py-6">
        <div className="flex h-0 grow shrink-0 basis-0 flex-col items-center gap-2 bg-neutral-border" />
        <ButtonThemed
          variant="brand-secondary"
          iconRight={<FeatherArrowUpRight />}
          onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
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
            <img
              className="hidden max-w-[144px] grow shrink-0 basis-0 rounded-md"
              src="https://res.cloudinary.com/subframe/image/upload/v1711417580/shared/zp8qzxs8z5zoyd4r6tti.jpg"
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
    headerImage="https://res.cloudinary.com/subframe/image/upload/v1711417582/shared/ugxgqzv603gmmspskhah.jpg"
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
          onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
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
            <img
              className="hidden max-w-[144px] grow shrink-0 basis-0 rounded-md"
              src="https://res.cloudinary.com/subframe/image/upload/v1711417580/shared/zp8qzxs8z5zoyd4r6tti.jpg"
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
    headerImage="https://res.cloudinary.com/subframe/image/upload/v1711417577/shared/ug6zq2m8ghszl3x4dmng.webp"
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
          onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
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
          onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
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
          onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
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
            <img
              className="hidden max-w-[144px] grow shrink-0 basis-0 rounded-md"
              src="https://res.cloudinary.com/subframe/image/upload/v1711417580/shared/zp8qzxs8z5zoyd4r6tti.jpg"
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
    headerImage="https://res.cloudinary.com/subframe/image/upload/v1711417580/shared/zp8qzxs8z5zoyd4r6tti.jpg"
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
          onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
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
            <img
              className="hidden max-w-[144px] grow shrink-0 basis-0 rounded-md"
              src="https://res.cloudinary.com/subframe/image/upload/v1711417580/shared/zp8qzxs8z5zoyd4r6tti.jpg"
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
    headerImage="https://res.cloudinary.com/subframe/image/upload/v1711417580/shared/zp8qzxs8z5zoyd4r6tti.jpg"
    headerText="Academic Publishing Division"
  >
    <div className="flex w-full grow shrink-0 basis-0 flex-col items-start">
      <div className="flex w-full grow shrink-0 basis-0 flex-col items-start gap-2 px-3 py-2">
        <span className="text-body-large font-body-large text-subtext-color">
          Digital-first scholarly publishing with AI integration and
          Spanish-language translations, making research more accessible and
          actionable.
        </span>
      </div>
      <div className="flex w-full items-start gap-2 px-6 py-6">
        <div className="flex h-0 grow shrink-0 basis-0 flex-col items-center gap-2 bg-neutral-border" />
        <ButtonThemed
          variant="brand-secondary"
          iconRight={<FeatherArrowUpRight />}
          onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
        >
          VISIT THE EDITORIAL
        </ButtonThemed>
      </div>
    </div>
  </BrandAccordion>
    </>
  </DarkSection>
  {/* Bottom Blur Frame Component */}
  <BottomBlurFrame />
  </>
  )
}