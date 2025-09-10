import Link from 'next/link'

export default function PublishWithUsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      {/* Hero Section */}
      <div className="mb-12">
        <h1 className="text-display-text-extra-large mb-6">
          Your Research Deserves a 21st-Century Platform.
        </h1>
        <p className="text-body-large font-medium mb-8">
          Traditional academic publishing is too slow, too rigid, and too disconnected from the
          artists and educators who need your work most. We&apos;ve built a better model.
        </p>
      </div>

      {/* Introduction: The Core Problem */}
      <section className="mb-16">
        <p className="text-body mb-6">
          You&apos;ve spent months, perhaps years, on your research. You&apos;ve uncovered a vital
          insight, developed a groundbreaking methodology, or offered a critical new perspective.
          Now comes the most frustrating part: getting it into the hands of the people who can use
          it.
        </p>
        <p className="text-body mb-8">
          The traditional path is paved with obstacles: year-long review cycles, restrictive
          paywalls that limit your readership to a handful of elite institutions, and static PDF
          formats that fail to capture the dynamic, multimedia nature of the performing arts.
        </p>
        <p className="text-body-large font-medium text-center">
          <strong>
            Your work is too important to be trapped in the past. At CENIE, we believe your impact
            should be as dynamic as your ideas.
          </strong>
        </p>
      </section>

      {/* The CENIE Solution */}
      <section className="mb-16">
        <h2 className="text-display-text-large mb-8">
          The CENIE Solution: A Better Publishing Model
        </h2>
        <p className="text-body mb-10">
          We have reimagined the academic publishing process from the ground up, creating a
          digital-first, peer-reviewed platform designed for{' '}
          <strong>speed, reach, and lasting relevance.</strong> When you publish with us, you
          don&apos;t just get a citation; you get a dynamic platform for your ideas.
        </p>
        <p className="text-display-text-medium mb-10">
          Here&apos;s what makes our model different:
        </p>

        <div className="space-y-10">
          {/* Feature 1 */}
          <div className="bg-card p-8 rounded-lg">
            <h3 className="text-display-text-medium mb-4">1. Accelerated Impact & Global Reach</h3>
            <p className="text-body">
              Forget waiting years for your work to see the light of day. Our streamlined,
              digitally-native peer review process reduces time-to-publication by up to 60%. And
              with our commitment to open-access options, your research is immediately available to
              a global audience of scholars, students, and practitioners, free from the barriers of
              institutional paywalls.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-card p-8 rounded-lg">
            <h3 className="text-display-text-medium mb-4">2. A Richer, More Dynamic Medium</h3>
            <p className="text-body mb-6">
              Performance can&apos;t be contained in static text. Our platform is built to showcase
              your work in its full richness.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-primary/5 p-4 rounded-md">
                <h4 className="text-display-text-small mb-3">📹 Embed High-Resolution Video</h4>
                <p className="text-body-small">
                  Demonstrate a specific movement or show a performance excerpt directly within your
                  article.
                </p>
              </div>
              <div className="bg-primary/5 p-4 rounded-md">
                <h4 className="text-display-text-small mb-3">
                  🎵 Integrate Audio & Interactive Elements
                </h4>
                <p className="text-body-small">
                  Let readers hear the musical passage or engage with the data you&apos;re
                  analyzing.
                </p>
              </div>
              <div className="bg-primary/5 p-4 rounded-md">
                <h4 className="text-display-text-small mb-3">🔗 Connect Your Ideas</h4>
                <p className="text-body-small">
                  Link directly to supplementary materials, online archives, and other relevant
                  research, creating a living document.
                </p>
              </div>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="bg-card p-8 rounded-lg">
            <h3 className="text-display-text-medium mb-4">3. Future-Proof Your Scholarly Legacy</h3>
            <p className="text-body mb-6">
              This is our most important innovation. We don&apos;t just publish your work; we
              structure it for the future of discovery. Our unique{' '}
              <strong>AI-ready content model</strong> transforms your research from a simple
              document into a structured dataset. This means:
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <div>
                  <h4 className="text-heading-4 mb-2">Enhanced Discoverability</h4>
                  <p className="text-body">
                    Your work becomes more visible to the next generation of AI-powered research
                    tools, ensuring it is found and cited for years to come.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <div>
                  <h4 className="text-heading-4 mb-2">Deeper Connections</h4>
                  <p className="text-body">
                    Our framework allows future researchers to uncover non-obvious thematic
                    connections between your work and others across the entire CENIE corpus.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <div>
                  <h4 className="text-heading-4 mb-2">Lasting Relevance</h4>
                  <p className="text-body">
                    By making your research machine-readable, you ensure it will be part of the
                    foundational data for the future of performing arts scholarship.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="bg-card p-8 rounded-lg">
            <h3 className="text-display-text-medium mb-4">
              4. A Peer Review Process That Values Practice
            </h3>
            <p className="text-body mb-6">
              Our commitment to rigor is absolute. But we believe rigor includes relevance. Our
              innovative peer review model combines:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-secondary/5 p-4 rounded-md">
                <h4 className="text-display-text-small mb-3">Traditional Academic Review</h4>
                <p className="text-body">
                  By leading scholars in your field to ensure theoretical soundness.
                </p>
              </div>
              <div className="bg-secondary/5 p-4 rounded-md">
                <h4 className="text-display-text-small mb-3">Practitioner Review</h4>
                <p className="text-body">
                  By working artists, directors, and educators who can assess the practical,
                  on-the-ground applicability of your work.
                </p>
              </div>
            </div>
            <p className="text-body mt-6">
              This dual approach ensures your research is not only intellectually robust but also
              genuinely useful to the community it&apos;s meant to serve.
            </p>
          </div>
        </div>
      </section>

      {/* Ready to Amplify */}
      <section className="mb-16 bg-primary/5 p-8 rounded-lg">
        <h2 className="text-display-text-large mb-6">Are You Ready to Amplify Your Impact?</h2>
        <p className="text-body mb-8">
          We are actively seeking original, high-quality manuscripts from established scholars,
          emerging researchers, and practitioner-scholars whose work pushes the boundaries of our
          field. We are particularly interested in research that is interdisciplinary,
          technologically innovative, and has clear implications for the practice or pedagogy of the
          performing arts.
        </p>
        <p className="text-body mb-8">
          The full details of our editorial standards, peer review process, and submission portal
          are located on our dedicated academic press website, <strong>CENIE Editorial</strong>.
        </p>
        <div className="text-center">
          <a
            href="https://editorial.cenie.org"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-primary text-white px-8 py-4 rounded-md hover:bg-primary/90 text-button-large"
          >
            View Submission Guidelines & Submit on CENIE Editorial →
          </a>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mb-16">
        <h2 className="text-display-text-large mb-10">Frequently Asked Questions for Authors</h2>

        <div className="space-y-8">
          <div className="bg-card p-6 rounded-lg">
            <h3 className="text-display-text-small mb-4">
              Q: Is publishing with CENIE considered academically rigorous?
            </h3>
            <p className="text-body">
              <strong>A:</strong> Absolutely. Every submission undergoes a rigorous double-blind
              peer review process involving both established academics and expert practitioners. Our
              editorial standards are on par with respected university presses.
            </p>
          </div>

          <div className="bg-card p-6 rounded-lg">
            <h3 className="text-display-text-small mb-4">
              Q: What is the cost to publish? Do you offer Open Access?
            </h3>
            <p className="text-body">
              <strong>A:</strong> We are committed to creating accessible pathways for publication
              and offer several models, including no-cost traditional licensing and various
              open-access options. Detailed information is available in our submission guidelines.
            </p>
          </div>

          <div className="bg-card p-6 rounded-lg">
            <h3 className="text-display-text-small mb-4">Q: What disciplines do you publish in?</h3>
            <p className="text-body">
              <strong>A:</strong> We welcome submissions from across the performing arts, including
              but not limited to dance, theatre, music theatre, performance studies, pedagogy, arts
              administration, and the intersection of arts and technology.
            </p>
          </div>

          <div className="bg-card p-6 rounded-lg">
            <h3 className="text-display-text-small mb-4">
              Q: I&apos;m a practitioner, not a traditional academic. Can I still submit?
            </h3>
            <p className="text-body">
              <strong>A:</strong> Yes. We strongly encourage submissions from practitioner-scholars.
              We believe some of the most vital research comes from those actively working in the
              field. Our editorial team can provide guidance on how to frame your practical work for
              a scholarly publication.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-muted p-12 rounded-lg text-center">
        <h2 className="text-display-text-large mb-6">
          Join the Future of Performing Arts Scholarship
        </h2>
        <p className="text-body-large mb-8 max-w-3xl mx-auto">
          Your research has the potential to transform how we understand and practice the performing
          arts. Don&apos;t let traditional publishing limitations hold back your impact.
        </p>
        <div className="space-y-4">
          <a
            href="https://editorial.cenie.org"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-primary text-white px-8 py-3 rounded-md hover:bg-primary/90 text-button-large mr-4"
          >
            Submit Your Research
          </a>
          <Link
            href="/insights/ai-approach"
            className="inline-block bg-white text-primary border-2 border-primary px-8 py-3 rounded-md hover:bg-primary/5 text-button-large"
          >
            Learn About Our AI-Ready Model →
          </Link>
        </div>
      </section>
    </div>
  )
}
