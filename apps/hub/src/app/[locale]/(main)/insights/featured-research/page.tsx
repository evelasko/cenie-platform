import Link from 'next/link'

export default function PublicationsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      {/* Hero Section */}
      <div className="mb-12">
        <h1 className="text-display-text-extra-large mb-6">
          Featured Research: Ideas Shaping the Future of Performance
        </h1>
        <p className="text-body-large font-medium mb-8">
          Great art is fueled by great ideas. Here, we bridge the gap between rigorous academic
          research and practical artistic application, showcasing the essential insights that are
          moving our industry forward.
        </p>
      </div>

      {/* Introduction */}
      <section className="mb-16">
        <p className="text-body mb-6">
          This is your curated briefing on the most important scholarship emerging from the CENIE
          ecosystem. We hand-select publications from our official academic press,{' '}
          <strong>CENIE Editorial</strong>, and provide concise summaries to explain not just{' '}
          <em>what</em> the research says, but <em>why it matters</em> to you as an artist, an
          educator, a producer, or a fellow scholar.
        </p>
        <p className="text-body">
          The full, peer-reviewed articles and books are hosted on their permanent home at{' '}
          <strong>CENIE Editorial</strong>, our dedicated publishing platform. Think of this page as
          your gateway to the most impactful ideas in our field.
        </p>
      </section>

      {/* Featured Publications */}
      <section className="mb-16">
        <h2 className="text-display-text-large mb-10">Featured Publications</h2>

        <div className="space-y-12">
          {/* Card 1: AI & Creativity */}
          <div className="bg-card p-8 rounded-lg">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <div className="flex items-center gap-4 mb-4">
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-body-small font-medium">
                    Peer-Reviewed Article
                  </span>
                </div>
                <h3 className="text-display-text-medium mb-3">
                  The Algorithmic Muse: A Framework for Human-AI Choreographic Collaboration
                </h3>
                <p className="text-body-small text-muted-foreground mb-4">Dr. Anya Sharma</p>

                <h4 className="text-heading-4 mb-3">Why It Matters:</h4>
                <p className="text-body mb-6">
                  This groundbreaking research moves beyond the fear of AI replacing artists. Dr.
                  Sharma provides a practical framework for using generative AI as a &quot;creative
                  partner&quot; to break through choreographic blocks, discover novel movement
                  patterns, and explore structural possibilities that the human mind might overlook.
                  This is an essential read for any director or choreographer curious about the
                  future of their creative process.
                </p>

                <a
                  href="https://editorial.cenie.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 text-button-medium"
                >
                  Read Full Article on CENIE Editorial →
                </a>
              </div>
              <div className="bg-linear-to-br from-primary/10 to-primary/5 rounded-lg p-6 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/20 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <span className="text-2xl">🤖</span>
                  </div>
                  <p className="text-body-small text-muted-foreground">AI & Creativity</p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Career Sustainability */}
          <div className="bg-card p-8 rounded-lg">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <div className="flex items-center gap-4 mb-4">
                  <span className="bg-secondary/20 text-secondary-foreground px-3 py-1 rounded-full text-body-small font-medium">
                    Book
                  </span>
                </div>
                <h3 className="text-display-text-medium mb-3">
                  The Portfolio Career: A New Economic Model for Performing Artists in the Digital
                  Age
                </h3>
                <p className="text-body-small text-muted-foreground mb-4">Dr. Isabella Rossi</p>

                <h4 className="text-heading-4 mb-3">Why It Matters:</h4>
                <p className="text-body mb-6">
                  The &quot;starving artist&quot; trope is not a sustainable model. This book offers
                  an evidence-based roadmap for building a diversified, resilient career. It
                  analyzes the success of artists who have combined performance with teaching,
                  digital products, and strategic consulting, providing a blueprint for financial
                  stability without sacrificing artistic integrity. It&apos;s a must-read for any
                  artist serious about building a long-term, thriving career.
                </p>

                <a
                  href="https://editorial.cenie.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 text-button-medium"
                >
                  Explore This Book on CENIE Editorial →
                </a>
              </div>
              <div className="bg-linear-to-br from-secondary/10 to-secondary/5 rounded-lg p-6 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-secondary/20 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <span className="text-2xl">💼</span>
                  </div>
                  <p className="text-body-small text-muted-foreground">Career Sustainability</p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Pedagogy & Training */}
          <div className="bg-card p-8 rounded-lg">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <div className="flex items-center gap-4 mb-4">
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-body-small font-medium">
                    Peer-Reviewed Article
                  </span>
                </div>
                <h3 className="text-display-text-medium mb-3">
                  Somatic Feedback Loops: Reducing Injury in Elite Dancers Through Real-Time Data
                </h3>
                <p className="text-body-small text-muted-foreground mb-4">Dr. Kenji Tanaka</p>

                <h4 className="text-heading-4 mb-3">Why It Matters:</h4>
                <p className="text-body mb-6">
                  Injury is one of the biggest threats to a dancer&apos;s career. This study details
                  the results of a pilot program using wearable sensors and real-time data feedback
                  to help dancers correct potentially harmful movement patterns before an injury
                  occurs. For educators, trainers, and dancers, this research points toward a future
                  of safer, more efficient, and more sustainable training methodologies.
                </p>

                <a
                  href="https://editorial.cenie.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 text-button-medium"
                >
                  Read Full Article on CENIE Editorial →
                </a>
              </div>
              <div className="bg-linear-to-br from-accent/10 to-accent/5 rounded-lg p-6 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-accent/20 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <span className="text-2xl">🩰</span>
                  </div>
                  <p className="text-body-small text-muted-foreground">Pedagogy & Training</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Publish Invitation */}
      <section className="mb-16 bg-muted p-8 rounded-lg">
        <h2 className="text-display-text-large mb-6">Have an Idea That Could Shape the Future?</h2>
        <p className="text-body mb-8">
          Our platform is built on the contributions of visionary researchers and practitioners like
          you. If you are working on groundbreaking research that bridges the gap between theory and
          practice, we invite you to learn more about our innovative, digital-first publishing
          model.
        </p>
        <Link
          href="/insights/publish-with-us"
          className="inline-block bg-primary text-white px-8 py-3 rounded-md hover:bg-primary/90 text-button-large"
        >
          Learn How to Publish With Us →
        </Link>
      </section>

      {/* Stay Connected */}
      <section className="bg-primary/5 p-12 rounded-lg">
        <h2 className="text-display-text-large mb-8 text-center">
          Stay at the Forefront of the Conversation
        </h2>
        <p className="text-body-large mb-10 text-center max-w-3xl mx-auto">
          Don&apos;t miss the next big idea. The best way to stay connected with the latest research
          and insights from the CENIE community is to join us.
        </p>

        <h3 className="text-display-text-medium mb-8">Two Paths to Stay Informed:</h3>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-lg">
            <h4 className="text-display-text-small mb-4">For Curated Insights:</h4>
            <h5 className="text-heading-4 mb-4">Subscribe to the CENIE Insights Newsletter</h5>
            <p className="text-body mb-6">
              Receive our bi-weekly newsletter featuring the most important new research, articles,
              and methodologies delivered directly to your inbox.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-body-small font-medium mb-2">Email Address</label>
                <input
                  type="email"
                  className="w-full p-3 border border-border rounded-md text-body"
                  placeholder="your@email.com"
                />
              </div>
              <button className="w-full bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 text-button-medium">
                Subscribe to Newsletter
              </button>
            </div>
          </div>

          <div className="bg-white p-8 rounded-lg">
            <h4 className="text-display-text-small mb-4">For Active Discussion:</h4>
            <h5 className="text-heading-4 mb-4">Join Our Free Research Community</h5>
            <p className="text-body mb-6">
              Connect with a global network of scholars and practitioners, share works-in-progress,
              and discuss the ideas that are shaping our field.
            </p>

            <Link
              href="/connect"
              className="inline-block w-full text-center bg-secondary text-secondary-foreground px-6 py-3 rounded-md hover:bg-secondary/90 text-button-medium"
            >
              Join the Community Forum →
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
