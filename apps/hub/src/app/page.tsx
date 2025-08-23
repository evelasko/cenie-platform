"use client"

// import { type Metadata } from 'next'
import MediaHero from '../components/heroes/MediaHero'
import MarginBlock from '../components/layouts/MarginBlock'
import DarkSection from '../components/layouts/DarkSection'
import BottomBlurFrame from '../components/decorations/BottomBlurFrame'
import { motion, useScroll, useTransform, easeOut } from "framer-motion"
import { useRef } from 'react'
import clsx from 'clsx'

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
  </div>
  
  {/* Bottom Blur Frame Component */}
  <BottomBlurFrame />
  </>
  )
}