import Link from 'next/link'

export default function CoursesPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      {/* Hero Section */}
      <div className="mb-12">
        <h1 className="text-display-text-extra-large mb-6">
          Find the Right Program to Build Your Future-Ready Career
        </h1>
        <p className="text-body-large mb-6">
          Welcome to the CENIE Academy Course Catalog. Every program below is designed specifically
          for the performing arts community, grounded in our core philosophy of contextual learning,
          confidence-building, and community support.
        </p>
        <p className="text-body mb-8">
          Whether you need to master a specific digital tool, learn the fundamentals of artistic
          entrepreneurship, or undertake a complete career transformation, you will find a path
          here.
        </p>

        {/* CTA Boxes */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-card p-6 rounded-lg">
            <h3 className="text-display-text-small mb-3">Unsure Where to Start?</h3>
            <p className="text-body mb-4">
              Take our free 5-minute skills assessment to get a personalized course recommendation.
            </p>
            <Link
              href="/learn/assessment"
              className="inline-block bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 text-button-medium"
            >
              Take the Assessment →
            </Link>
          </div>
          <div className="bg-card p-6 rounded-lg">
            <h3 className="text-display-text-small mb-3">Have Specific Questions?</h3>
            <p className="text-body mb-4">
              Schedule a free 30-minute consultation with an advisor to design a custom learning
              path.
            </p>
            <Link
              href="/connect"
              className="inline-block bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 text-button-medium"
            >
              Book a Consultation →
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Program */}
      <section className="mb-16">
        <h2 className="text-display-text-large mb-8">Our Flagship Program</h2>
        <div className="bg-primary/5 p-8 rounded-lg">
          <h3 className="text-display-text-medium mb-3">The Complete Artist Entrepreneur</h3>
          <p className="text-body-large italic mb-4">
            A Comprehensive 16-Week Program to Transform Your Career
          </p>
          <p className="text-body mb-6">
            This is our most immersive program for artists who are serious about building a
            sustainable, multi-faceted career. Combining all of our essential training in
            technology, finance, marketing, and business management, this cohort-based program
            provides the skills, mentorship, and community needed to go from artist to entrepreneur.
          </p>
          <h4 className="text-heading-4 mb-4">Key Benefits:</h4>
          <ul className="list-disc list-inside space-y-2 text-body mb-6">
            <li>
              <strong>Comprehensive Curriculum:</strong> Master all essential non-artistic skills in
              one integrated program.
            </li>
            <li>
              <strong>Dedicated Mentorship:</strong> Get personalized guidance from a successful
              artist-entrepreneur.
            </li>
            <li>
              <strong>Peer Cohort:</strong> Learn and grow with a small, dedicated group of
              professional peers.
            </li>
            <li>
              <strong>Capstone Project:</strong> Graduate with a real-world project and a strategic
              plan for your career.
            </li>
          </ul>
          <Link
            href="/learn/courses/complete-artist-entrepreneur"
            className="inline-block bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 text-button-medium"
          >
            Learn More & Apply for the Next Cohort →
          </Link>
        </div>
      </section>

      {/* Course Tracks */}
      <section>
        <h2 className="text-display-text-large mb-4">Explore Our Course Tracks</h2>
        <p className="text-body mb-10">
          Build your own learning path by choosing from our specialized courses. Each course is a
          deep dive into a critical skill area, designed to deliver practical, applicable knowledge
          you can use immediately.
        </p>

        {/* Technology Literacy Track */}
        <div className="mb-12">
          <h3 className="text-display-text-medium mb-6">
            Technology Literacy Track: Master the Digital Tools of the Modern Artist
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-card p-6 rounded-lg">
              <h4 className="text-display-text-small mb-3">Digital Fundamentals for Artists</h4>
              <p className="text-body mb-4">
                Learn the essentials of social media, digital marketing, and online collaboration to
                build your professional brand and audience.
              </p>
              <p className="text-body-small text-muted-foreground mb-4">
                6 Weeks | Online with live sessions
              </p>
              <Link
                href="/learn/courses/digital-fundamentals"
                className="text-primary hover:underline text-button-medium"
              >
                View Details & Enroll →
              </Link>
            </div>

            <div className="bg-card p-6 rounded-lg">
              <h4 className="text-display-text-small mb-3">AI Tools for Creative Professionals</h4>
              <p className="text-body mb-4">
                Discover how to use AI-assisted tools for choreography, composition, performance
                analysis, and content creation.
              </p>
              <p className="text-body-small text-muted-foreground mb-4">
                8 Weeks | Hybrid online/lab sessions
              </p>
              <Link
                href="/learn/courses/ai-tools-for-creatives"
                className="text-primary hover:underline text-button-medium"
              >
                View Details & Enroll →
              </Link>
            </div>

            <div className="bg-card p-6 rounded-lg">
              <h4 className="text-display-text-small mb-3">Advanced Digital Integration</h4>
              <p className="text-body mb-4">
                Go beyond the basics. Learn to build a custom website, set up e-commerce platforms,
                and master live streaming technologies.
              </p>
              <p className="text-body-small text-muted-foreground mb-4">
                10 Weeks | Project-based learning
              </p>
              <Link
                href="/learn/courses/advanced-digital-integration"
                className="text-primary hover:underline text-button-medium"
              >
                View Details & Enroll →
              </Link>
            </div>
          </div>
        </div>

        {/* Business Skills Track */}
        <div className="mb-12">
          <h3 className="text-display-text-medium mb-6">
            Business Skills Track: Become the CEO of Your Artistic Career
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-card p-6 rounded-lg">
              <h4 className="text-display-text-small mb-3">Entrepreneurship for Artists</h4>
              <p className="text-body mb-4">
                Business model development, financial planning, contract negotiation, and tax
                strategies for creative careers.
              </p>
              <p className="text-body-small text-muted-foreground mb-4">
                8 Weeks | Online with peer groups
              </p>
              <Link
                href="/learn/courses/entrepreneurship-for-artists"
                className="text-primary hover:underline text-button-medium"
              >
                View Details & Enroll →
              </Link>
            </div>

            <div className="bg-card p-6 rounded-lg">
              <h4 className="text-display-text-small mb-3">Marketing and Brand Development</h4>
              <p className="text-body mb-4">
                Personal branding strategy, content marketing, network building, and grant writing
                for artists.
              </p>
              <p className="text-body-small text-muted-foreground mb-4">
                6 Weeks | Interactive workshops
              </p>
              <Link
                href="/learn/courses/marketing-brand-development"
                className="text-primary hover:underline text-button-medium"
              >
                View Details & Enroll →
              </Link>
            </div>

            <div className="bg-card p-6 rounded-lg">
              <h4 className="text-display-text-small mb-3">Leadership and Management</h4>
              <p className="text-body mb-4">
                Team building for creative projects, production management, negotiation skills, and
                strategic planning.
              </p>
              <p className="text-body-small text-muted-foreground mb-4">
                10 Weeks | Case study methodology
              </p>
              <Link
                href="/learn/courses/leadership-management"
                className="text-primary hover:underline text-button-medium"
              >
                View Details & Enroll →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
