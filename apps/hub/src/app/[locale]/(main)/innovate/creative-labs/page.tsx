import Link from 'next/link'

export default function CreativeLabsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <h1 className="text-display-text-extra-large mb-6">Creative Labs</h1>
      <p className="text-body-large mb-8">
        Innovation labs and residency programs where choreographers and directors can experiment
        with AI, AR/VR, and emerging technologies in collaborative environments.
      </p>

      <div className="bg-primary/5 p-12 rounded-lg text-center">
        <p className="text-display-text-medium mb-6">Creative Labs Opening Soon</p>
        <p className="text-body mb-8">
          We&apos;re developing state-of-the-art creative laboratories where artists can experiment
          with cutting-edge technology. Our facilities will include AI choreography labs, video
          analysis studios, and VR creative spaces.
        </p>
        <Link
          href="/innovate"
          className="inline-block bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 text-button-medium"
        >
          Explore Our Innovation Ecosystem →
        </Link>
      </div>
    </div>
  )
}
