import Link from 'next/link'

export default function InnovatePage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      {/* Hero Section */}
      <div className="mb-12">
        <h1 className="text-display-text-extra-large mb-6">
          Innovate Your Art: Technology as a Creative Partner
        </h1>
        <p className="text-body-large font-medium mb-8">
          Go beyond the limits of traditional creation. Discover AI-powered tools, collaborative
          innovation programs, and a new framework for integrating technology to amplify your unique
          artistic voice.
        </p>
        <p className="text-body mb-6">
          The next great leap in the performing arts will not come from an algorithm. It will come
          from a visionary artist who learns to use algorithms as a new kind of collaborator.
        </p>
        <p className="text-body mb-8">
          For too long, technology and art have been seen as opposing forces. But the most exciting
          frontier of creation lies at their intersection. AI, advanced video analysis, and
          interactive digital tools are not threats to human creativity—they are the most powerful
          artistic tools to emerge in a generation, waiting for a master to wield them.
        </p>
        <p className="text-body-large">
          The <strong>CENIE Innovation Pathway</strong> is your entry into this new world. We
          provide access to groundbreaking tools, a framework for meaningful experimentation, and a
          community of fellow pioneers dedicated to defining the future of performance.
        </p>
      </div>

      {/* Innovation Ecosystem */}
      <section className="mb-16">
        <h2 className="text-display-text-large mb-8">Our Innovation Ecosystem</h2>
        <p className="text-body mb-10">
          We&apos;ve designed a three-part ecosystem to support your creative journey, whether
          you&apos;re taking your first steps with technology or are ready to build a revolutionary
          new work.
        </p>

        <div className="space-y-8">
          <div className="bg-card p-8 rounded-lg">
            <h3 className="text-display-text-medium mb-4">
              1. Stoomp: The AI-Powered Performance Analysis Platform
            </h3>
            <p className="text-body-large italic mb-4">See your work with new eyes.</p>
            <p className="text-body mb-6">
              Stoomp is our flagship software suite, designed to move performance analysis from
              subjective intuition to objective insight. Trained on thousands of hours of
              performance, it helps you refine technique, enhance ensemble work, and track artistic
              growth with unprecedented clarity.
            </p>
            <a
              href="https://stoomp.net"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 text-button-medium"
            >
              Discover Stoomp →
            </a>
          </div>

          <div className="bg-card p-8 rounded-lg">
            <h3 className="text-display-text-medium mb-4">2. Creative Innovation Programs</h3>
            <p className="text-body-large italic mb-4">
              A new model for artistic research & development.
            </p>
            <p className="text-body mb-6">
              This is our framework for fostering groundbreaking work. Through a combination of
              focused workshops, collaborative labs, and future residency programs, we provide
              artists with the structure, mentorship, and resources needed to experiment with
              emerging technologies in a creatively rigorous environment.
            </p>
            <Link
              href="/innovate/creative-labs"
              className="inline-block bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 text-button-medium"
            >
              Explore Our Programs →
            </Link>
          </div>

          <div className="bg-card p-8 rounded-lg">
            <h3 className="text-display-text-medium mb-4">3. Technology Integration Services</h3>
            <p className="text-body-large italic mb-4">Expert guidance for your creative vision.</p>
            <p className="text-body mb-6">
              For artists and organizations with a specific project in mind, our team provides
              strategic consulting and hands-on support. We help you navigate the complexities of
              digital transformation, from integrating AI into a new work to optimizing your
              creative workflow.
            </p>
            <Link
              href="/innovate/technology-integration"
              className="inline-block bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 text-button-medium"
            >
              Learn About Our Services →
            </Link>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="mb-16">
        <h2 className="text-display-text-large mb-8">
          The CENIE Philosophy: Amplifying the Artist
        </h2>
        <p className="text-body mb-8">
          We don&apos;t believe in &quot;technology for technology&apos;s sake.&quot; Our entire
          innovation philosophy is built on one question: How can this tool serve the art?
        </p>

        <div className="space-y-6">
          <div>
            <h3 className="text-display-text-small mb-3">Human-Centered AI</h3>
            <p className="text-body">
              Our tools are designed as partners, not replacements. They suggest, analyze, and
              reveal patterns, but the artist always remains the author.
            </p>
          </div>
          <div>
            <h3 className="text-display-text-small mb-3">Process Over Product</h3>
            <p className="text-body">
              We value the &quot;what if?&quot; more than the &quot;what is.&quot; Our programs are
              designed to encourage experimentation and courageous failure as essential parts of the
              innovative process.
            </p>
          </div>
          <div>
            <h3 className="text-display-text-small mb-3">Authenticity First</h3>
            <p className="text-body">
              We guide artists to integrate technology in a way that feels true to their unique
              voice and vision, avoiding gimmicks and preserving the core of their artistic
              identity.
            </p>
          </div>
        </div>
      </section>

      {/* Who This Is For */}
      <section className="mb-16">
        <h2 className="text-display-text-large mb-8">Who is This For?</h2>
        <p className="text-body mb-8">
          The Innovation Pathway is designed for the curious, the courageous, and the creators who
          are not satisfied with the status quo.
        </p>

        <div className="bg-muted p-8 rounded-lg space-y-4">
          <p className="text-body">
            • This is for you if... you are a choreographer who wonders if an AI could help you
            break through a creative block.
          </p>
          <p className="text-body">
            • This is for you if... you are a director who wants to understand how data analysis can
            improve your ensemble&apos;s timing and cohesion.
          </p>
          <p className="text-body">
            • This is for you if... you are a performer who wants to use objective feedback to
            accelerate your technical mastery.
          </p>
          <p className="text-body">
            • This is for you if... you are an organization ready to build a culture of innovation
            that will define your work for the next decade.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary/5 p-12 rounded-lg text-center">
        <h2 className="text-display-text-large mb-8">Ready to Explore the Future of Creation?</h2>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-display-text-small mb-3">
              🚀 Take Your First Step: Try Stoomp for Free
            </h3>
            <p className="text-body mb-4">
              Experience the power of AI-enhanced video analysis firsthand with a full-featured
              30-day trial of our flagship platform.
            </p>
            <a
              href="https://stoomp.net/trial"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 text-button-medium"
            >
              Start Your Free Stoomp Trial
            </a>
          </div>

          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-display-text-small mb-3">
              🔬 Get Inspired: Attend Our &quot;Art & AI&quot; Workshop
            </h3>
            <p className="text-body mb-4">
              Join our free monthly online workshop where we demonstrate the latest creative tools
              and showcase innovative works from artists in our network.
            </p>
            <Link
              href="/connect"
              className="inline-block bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 text-button-medium"
            >
              Register for the Free Workshop
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
