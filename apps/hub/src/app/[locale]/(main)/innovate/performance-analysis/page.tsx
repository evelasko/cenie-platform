import Link from 'next/link'

export default function PerformanceAnalysisPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      {/* Hero Section */}
      <div className="mb-12">
        <h1 className="text-display-text-extra-large mb-6">See Your Art with New Eyes: The Power of Performance Analysis</h1>
        <p className="text-body-large font-medium mb-8">
          Move beyond intuition alone. Discover how data-driven analysis of performance, process, and production can unlock new levels of artistic refinement, team cohesion, and creative insight.
        </p>
        <p className="text-body mb-6">
          In the performing arts, we rely on a trained eye, a sensitive ear, and a deep sense of intuition to guide our creative choices. These are the irreplaceable pillars of our craft.
        </p>
        <p className="text-body mb-8">
          But what if we could augment that intuition with objective, data-driven insight? What if we could see the subtle patterns in an ensemble&apos;s timing, quantify the progress in a dancer&apos;s technique, or identify the precise moments a production workflow becomes inefficient?
        </p>
        <p className="text-body-large">
          This is the power of performance and process analysis. It is not about replacing the artist&apos;s eye, but about giving it a microscope. It&apos;s about transforming guesswork into knowledge, and making the invisible patterns of our work visible, so we can refine our art and our process with unprecedented precision.
        </p>
      </div>

      {/* Philosophy */}
      <section className="mb-16">
        <h2 className="text-display-text-large mb-8">The CENIE Philosophy: From Data to Deeper Artistry</h2>
        <p className="text-body mb-8">
          We believe that data in the arts is not cold or sterile. It is a new language for understanding our own work. Our approach to analysis is grounded in three core principles:
        </p>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-display-text-small mb-3">1. Insight, Not Just Information</h3>
            <p className="text-body">We focus on tools that provide actionable insights that lead to better artistic choices, not just endless streams of data.</p>
          </div>
          <div>
            <h3 className="text-display-text-small mb-3">2. Augmenting, Not Automating, Creativity</h3>
            <p className="text-body">Our platforms are designed to support the creative decision-making of directors, choreographers, and performers—empowering their vision, not dictating it.</p>
          </div>
          <div>
            <h3 className="text-display-text-small mb-3">3. A Holistic View</h3>
            <p className="text-body">True excellence comes from analyzing the entire artistic ecosystem—from an individual performer&apos;s technique to the efficiency of the entire production team that supports them.</p>
          </div>
        </div>
      </section>

      {/* CENIE Suite */}
      <section className="mb-16">
        <h2 className="text-display-text-large mb-8">Introducing the CENIE Suite of Analysis Tools</h2>
        <p className="text-body mb-10">
          To bring this philosophy to life, we have developed a suite of specialized software tools, each designed to illuminate a different facet of the artistic and production process. These platforms are the culmination of our research, designed by artists for artists.
        </p>

        <div className="space-y-8">
          <div className="bg-card p-8 rounded-lg">
            <h3 className="text-display-text-medium mb-4">Stoomp: For On-the-Stage Performance Analysis</h3>
            <p className="text-body-large italic mb-4">The ultimate tool for refining movement and technique.</p>
            <p className="text-body mb-6">
              Stoomp is our flagship AI-powered video analysis platform, designed for dancers, actors, directors, and trainers. Go beyond simple playback and use machine learning to analyze movement quality, timing, spatial relationships, and ensemble synchronization. It&apos;s the most powerful tool ever built for accelerating skill acquisition and achieving artistic precision.
            </p>
            <a 
              href="https://stoomp.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 text-button-medium"
            >
              Visit Stoomp.com to Start Your Free Trial →
            </a>
          </div>

          <div className="bg-card p-8 rounded-lg">
            <h3 className="text-display-text-medium mb-4">Cuaderno: For Backstage Process Analysis & Management</h3>
            <p className="text-body-large italic mb-4">The central nervous system for your entire production.</p>
            <p className="text-body mb-6">
              Cuaderno (from the Spanish <em>cuaderno</em>, a notebook) is our production and team collaboration platform. It moves your entire process—from scheduling and budgeting to communication and task management—into one transparent, efficient hub. Analyze your workflows, identify bottlenecks, and empower your team to collaborate seamlessly.
            </p>
            <a 
              href="https://cuaderno.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 text-button-medium"
            >
              Visit cuaderno.com to Learn More & Request a Demo →
            </a>
          </div>

          <div className="bg-card p-8 rounded-lg">
            <h3 className="text-display-text-medium mb-4">Platea: For Audition & Talent Analysis</h3>
            <p className="text-body-large italic mb-4">Discover the perfect talent with data-driven casting.</p>
            <p className="text-body mb-6">
              Platea (from the Spanish for the main seating area in a theatre) is our talent discovery and casting optimization platform. It streamlines the entire audition process, from submission to selection, using intelligent filtering and matching algorithms to help you find the right performers for your vision, faster and more effectively than ever before.
            </p>
            <a 
              href="https://platea.app" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 text-button-medium"
            >
              Visit Platea.app to See How It Works →
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary/5 p-12 rounded-lg text-center">
        <h2 className="text-display-text-large mb-6">Ready to Transform How You Analyze Your Work?</h2>
        <p className="text-body-large mb-8">
          Start your journey with our AI-powered analysis tools and discover insights that will elevate your artistic practice.
        </p>
        <div className="space-y-4">
          <a 
            href="https://stoomp.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block bg-primary text-white px-8 py-3 rounded-md hover:bg-primary/90 text-button-large mr-4"
          >
            Try Stoomp Free for 30 Days
          </a>
          <Link href="/innovate" className="inline-block bg-white text-primary border-2 border-primary px-8 py-3 rounded-md hover:bg-primary/5 text-button-large">
            Explore All Innovation Tools →
          </Link>
        </div>
      </section>
    </div>
  )
}
