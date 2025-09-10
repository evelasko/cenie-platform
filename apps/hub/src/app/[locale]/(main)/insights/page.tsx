import Link from 'next/link'

export default function InsightsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      {/* Hero Section */}
      <div className="mb-12">
        <h1 className="text-display-text-extra-large mb-6">
          Explore the Frontier of Performing Arts Knowledge
        </h1>
        <p className="text-body-large font-medium mb-8">
          Discover a dynamic ecosystem for scholarship where rigorous research, proven
          methodologies, and innovative technology converge. We connect big ideas to practical
          application.
        </p>
        <p className="text-body mb-8">
          The most pressing questions in the performing arts today—from the integration of AI to the
          development of sustainable careers—demand more than just isolated research. They demand a
          new kind of scholarly conversation: one that is accessible, interconnected, and directly
          engaged with the artists and educators shaping our field.
        </p>
        <p className="text-body-large">
          The <strong>CENIE Insights Pathway</strong> is your entry into this conversation.
        </p>
        <p className="text-body mt-6">
          We don&apos;t just archive knowledge; we activate it. We curate cutting-edge research from
          our dedicated academic press, share evidence-based methodologies from our creative and
          training hubs, and provide a platform for the big ideas that will define the future of
          performance.
        </p>
      </div>

      {/* Three Pathways */}
      <section className="mb-16">
        <h2 className="text-display-text-large mb-8">Discover, Contribute, and Apply Knowledge</h2>
        <p className="text-body mb-10">
          Whether you are here to find the latest research, share your own work, or translate theory
          into practice, we have a clear path for you.
        </p>

        <div className="space-y-8">
          <div className="bg-card p-8 rounded-lg">
            <h3 className="text-display-text-medium mb-4">
              1. Featured Research from CENIE Editorial
            </h3>
            <p className="text-body-large italic mb-4">
              For the scholar, the student, and the curious artist.
            </p>
            <p className="text-body mb-6">
              Get a curated look at the most important new scholarship in our field. We highlight
              groundbreaking work from our dedicated academic publishing house,{' '}
              <strong>CENIE Editorial</strong>, and provide concise summaries that explain not just{' '}
              <em>what</em> the research says, but <em>why it matters</em> to the performing arts
              community.
            </p>
            <Link
              href="/insights/featured-research"
              className="inline-block bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 text-button-medium"
            >
              Explore Featured Articles & Books →
            </Link>
          </div>

          <div className="bg-card p-8 rounded-lg">
            <h3 className="text-display-text-medium mb-4">2. Publish With Us</h3>
            <p className="text-body-large italic mb-4">
              For the researcher and practitioner-scholar ready to make an impact.
            </p>
            <p className="text-body mb-6">
              Your work deserves a platform built for the 21st century. Our publishing arm,{' '}
              <strong>CENIE Editorial</strong>, offers a peer-reviewed, digital-first process that
              accelerates publication, enhances your work with multimedia, and connects it to a
              global audience through our unique AI-ready model.
            </p>
            <Link
              href="/insights/publish-with-us"
              className="inline-block bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 text-button-medium"
            >
              Learn About Our Publishing Model →
            </Link>
          </div>

          <div className="bg-card p-8 rounded-lg">
            <h3 className="text-display-text-medium mb-4">3. The Methodology Library</h3>
            <p className="text-body-large italic mb-4">
              For the educator, trainer, and practitioner.
            </p>
            <p className="text-body mb-6">
              Bridge the gap between theory and practice. This is our open-access collection of
              evidence-based training and creative development methods, sourced from our Hubs and
              global network. Discover proven frameworks you can immediately apply in the studio,
              the classroom, or your own creative process.
            </p>
            <Link
              href="/insights/methodology-library"
              className="inline-block bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 text-button-medium"
            >
              Access the Methodology Library →
            </Link>
          </div>
        </div>
      </section>

      {/* CENIE Difference */}
      <section className="mb-16">
        <h2 className="text-display-text-large mb-8">
          The CENIE Difference: Connecting Ideas to Impact
        </h2>
        <p className="text-body mb-8">
          Our platform is more than a collection of articles; it&apos;s an engine for discovery. We
          are pioneering a new, AI-enhanced framework for structuring knowledge, designed to reveal
          non-obvious connections and accelerate the journey from insight to application.
        </p>
        <p className="text-body">
          This commitment to interconnected knowledge ensures that a new training methodology can
          inform scholarly research, and a new academic theory can inspire a practical tool for
          artists. This is the future of a truly living, breathing field of study.
        </p>
      </section>

      {/* CTA Section */}
      <section className="bg-primary/5 p-12 rounded-lg text-center">
        <h2 className="text-display-text-large mb-6">Join the Conversation</h2>
        <p className="text-body-large mb-8">
          Be part of the future of performing arts scholarship. Whether you&apos;re conducting
          research, developing methodologies, or seeking insights to inform your practice, CENIE
          Insights connects you to the knowledge that matters.
        </p>
        <div className="space-y-4">
          <Link
            href="/insights/featured-research"
            className="inline-block bg-primary text-white px-8 py-3 rounded-md hover:bg-primary/90 text-button-large mr-4"
          >
            Explore Research
          </Link>
          <Link
            href="/insights/publish-with-us"
            className="inline-block bg-white text-primary border-2 border-primary px-8 py-3 rounded-md hover:bg-primary/5 text-button-large"
          >
            Publish With Us →
          </Link>
        </div>
      </section>
    </div>
  )
}
