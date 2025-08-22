import { type Metadata } from 'next'
import MediaHero from '../components/heroes/MediaHero'
import MarginBlock from '../components/layouts/MarginBlock'
import DarkSection from '../components/layouts/DarkSection'

export const metadata: Metadata = {
  // TODO Tranlsate this to Spanish
  title: 'CENIE | The Future of Performing Arts | Launching September 2025',
  description: 'CENIE is a comprehensive ecosystem empowering performing artists and organizations with AI-powered tools, specialized education, and collaborative platforms. Join us in shaping the future of performance.',
  keywords: 'performing arts, technology, AI in arts, virtual reality, artistic innovation, artist education, production management software, academic publishing, Spanish-speaking artists',
  openGraph: {
    title: 'CENIE | The Future of Performing Arts | Launching September 2025',
    description: 'CENIE is a comprehensive ecosystem empowering performing artists and organizations with AI-powered tools, specialized education, and collaborative platforms. Join us in shaping the future of performance.',
    url: 'https://cenie.org',
    siteName: 'CENIE',
    locale: 'es_ES',
    type: 'website',
  },
  alternates: {
    canonical: 'https://cenie.org'
  }
}


export default function HubHomePage() {
  return (
    <>
    <div className="mt-16 px-1 mb-1 md:px-1.5 bg-gradient-to-b from-[var(--color-nav-background)] to-background">
      <MediaHero backgroundVideo="/media/videos/smoke-fall.mp4" backgroundClassName="mb-1">
      <div className="text-center">
        <h1 className="text-heading-1">
          The Future of Performing Arts
        </h1>
      </div>
      <div className="text-center pb-16">
        <p className="text-heading-3 max-w-3xl mx-auto">
          A comprehensive ecosystem empowering performing artists and organizations with AI-powered tools, specialized education, and collaborative platforms.
        </p>
      </div>
      </MediaHero>
    </div>
  <div className="page-wrapper">
    <MarginBlock header={(<div/>)}>
      <p className='text-display-text-large'>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
      </p>
    </MarginBlock>
    <DarkSection>
      <div className="flex flex-col items-center p-36 justify-center h-124">
        <p className='text-display-text-large'>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
        </p>
      </div>
    </DarkSection>
  </div>
  </>
  )
}