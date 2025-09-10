import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      {/* Hero Section */}
      <div className="mb-12">
        <h1 className="text-display-text-extra-large mb-6">
          About CENIE: Bridging the Worlds of Art and Code
        </h1>
        <p className="text-body-large font-medium mb-8">
          Our mission is to build the future artists deserve—one where technology serves creativity,
          and sustainable careers are the standard, not the exception.
        </p>
        <p className="text-body mb-8">
          CENIE was born from a fundamental disconnect I&apos;ve witnessed my entire life: the world
          of the performing arts and the world of technology often speak different languages. Tech
          companies build &quot;one-size-fits-all&quot; solutions that misunderstand the creative
          process, while arts organizations struggle to keep pace with a digital world that feels
          alien to their work.
        </p>
        <p className="text-body-large text-center font-medium">
          <strong>CENIE is the bridge.</strong>
        </p>
      </div>

      {/* Mission */}
      <section className="mb-16">
        <p className="text-body mb-8">
          We are a new, comprehensive ecosystem founded on the principle that the most profound
          innovation comes from deep, interdisciplinary expertise. We exist to translate the
          possibilities of technology into the language of art, ensuring that the future of
          performance is shaped by those who understand it best: the artists themselves.
        </p>

        <h2 className="text-display-text-large mb-8">
          The Vision: A Future-Ready Performing Arts Community
        </h2>
        <p className="text-body mb-6">
          Our vision is for a world where artists are empowered to build thriving, sustainable
          careers on their own terms. Where technology acts as a creative collaborator, not a
          threat. And where the timeless human connection of live performance is preserved and
          amplified for generations to come.
        </p>
        <p className="text-body-large">
          <strong>Our Mission</strong>: To make this vision a reality by providing artists and
          organizations with the essential, artist-centric education, tools, and frameworks they
          need to navigate the digital age with confidence and creativity.
        </p>
      </section>

      {/* Story */}
      <section className="mb-16 bg-muted p-8 rounded-lg">
        <h2 className="text-display-text-large mb-8">The Story: A Lifetime on Two Stages</h2>
        <p className="text-body mb-6">
          This mission isn&apos;t just a business plan; it&apos;s the culmination of my life&apos;s
          work. I have spent over 30 years living in two parallel worlds.
        </p>
        <p className="text-body mb-6">
          <strong>By day</strong>, I was a performing artist and academic. Starting at age 10, I
          dedicated my life to ballet and contemporary dance. I pursued this passion to the highest
          academic levels, earning a PhD in the choreography and directing of Broadway musicals, and
          becoming a university professor, where I&apos;ve had the privilege of guiding thousands of
          talented students into their professional careers. I have lived the financial precarity,
          the operational inefficiencies, and the skills gaps that hold back so many brilliant
          artists.
        </p>
        <p className="text-body mb-6">
          <strong>By night</strong>, I was a self-taught technologist. From learning my first
          programming language at age 10 to mastering Python, DevOps, and AI/ML development, I have
          always been fascinated by how systems work. I&apos;ve built mobile apps, designed 3D
          animations, and created AI agents to solve complex problems.
        </p>
        <p className="text-body-large">
          For decades, these two halves of my life remained separate. CENIE is the moment they come
          together. I founded CENIE because I believe the future of our industry depends on leaders
          who are fluent in both languages—art and code. This deep, personal, and lived expertise is
          the foundation of everything we do.
        </p>
      </section>

      {/* Core Values */}
      <section className="mb-16">
        <h2 className="text-display-text-large mb-8">Core Values That Guide Our Work</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-card p-6 rounded-lg">
            <h3 className="text-display-text-small mb-4">Artistic Integrity First</h3>
            <p className="text-body">
              Every technology integration and business innovation must enhance, not compromise,
              authentic artistic expression and cultural values.
            </p>
          </div>
          <div className="bg-card p-6 rounded-lg">
            <h3 className="text-display-text-small mb-4">Evidence-Based Innovation</h3>
            <p className="text-body">
              Our solutions are grounded in research, tested through practice, and continuously
              refined based on real-world outcomes.
            </p>
          </div>
          <div className="bg-card p-6 rounded-lg">
            <h3 className="text-display-text-small mb-4">Community-Centered Design</h3>
            <p className="text-body">
              We build for and with the performing arts community, ensuring our tools serve real
              needs rather than imposing external solutions.
            </p>
          </div>
          <div className="bg-card p-6 rounded-lg">
            <h3 className="text-display-text-small mb-4">Sustainable Growth</h3>
            <p className="text-body">
              We prioritize long-term sustainability over rapid scaling, building foundations that
              support lasting positive change in our industry.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary/5 p-12 rounded-lg text-center">
        <h2 className="text-display-text-large mb-6">Join Us in Shaping the Future</h2>
        <p className="text-body-large mb-8">
          CENIE exists because the performing arts community deserves technology that understands
          and serves our unique needs. Together, we can build a future where creativity and
          technology work in harmony.
        </p>
        <div className="space-y-4">
          <Link
            href="/learn"
            className="inline-block bg-primary text-white px-8 py-3 rounded-md hover:bg-primary/90 text-button-large mr-4"
          >
            Start Learning
          </Link>
          <Link
            href="/connect"
            className="inline-block bg-white text-primary border-2 border-primary px-8 py-3 rounded-md hover:bg-primary/5 text-button-large"
          >
            Connect With Us →
          </Link>
        </div>
      </section>
    </div>
  )
}
