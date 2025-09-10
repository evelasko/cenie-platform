import Link from 'next/link'

export default function LearnPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      {/* Hero Section */}
      <div className="mb-12">
        <h1 className="text-display-text-extra-large mb-6">
          Learn the Skills to Build a Sustainable Artistic Career
        </h1>
        <p className="text-body-large font-medium mb-8">
          Go beyond your traditional training. Our programs are designed to equip performing artists
          with the essential technology, finance, and business skills needed to thrive in the modern
          creative economy.
        </p>
        <p className="text-body mb-6">
          The paradox of the modern performing artist is that talent is not enough. You can be a
          brilliant dancer, a captivating actor, or a visionary director, but if you don&apos;t
          understand how to market your work, manage your finances, and leverage digital tools, you
          are building a career on an unstable foundation.
        </p>
        <p className="text-body-large font-medium mb-8">
          Traditional arts education prepares you for the craft, but often leaves you unprepared for
          the career.
        </p>
        <p className="text-body">
          At CENIE, our educational mission is to bridge that gap. We don&apos;t teach you your
          art—you are already the expert in that. We provide the crucial strategic scaffolding
          around your talent, empowering you to build a career that is not only artistically
          fulfilling but also financially sustainable and professionally resilient.
        </p>
      </div>

      {/* Educational Philosophy */}
      <section className="mb-16">
        <h2 className="text-display-text-large mb-8">
          Our Educational Philosophy: Designed for Artists, By Artists
        </h2>
        <p className="text-body mb-8">
          Generic business courses and tech bootcamps fail artists because they don&apos;t speak our
          language. They lack the context, empathy, and pedagogical approach needed for the creative
          mind. Our approach is different because it&apos;s built from the ground up on three core
          principles:
        </p>
        <div className="space-y-8">
          <div>
            <h3 className="text-display-text-medium mb-4">1. Context is Everything</h3>
            <p className="text-body">
              We teach technology and business through the lens of artistic practice. You won&apos;t
              learn abstract business theory; you&apos;ll build a budget for an independent
              production. You won&apos;t learn generic coding; you&apos;ll learn how to use AI tools
              to analyze your choreography.
            </p>
          </div>
          <div>
            <h3 className="text-display-text-medium mb-4">2. Confidence Before Competence</h3>
            <p className="text-body">
              We know the biggest hurdle is often mindset (&quot;I&apos;m not a business
              person,&quot; &quot;Technology is overwhelming&quot;). Our curriculum is designed to
              build confidence through small, practical, and immediate wins, creating a positive
              feedback loop that makes learning feel empowering, not intimidating.
            </p>
          </div>
          <div>
            <h3 className="text-display-text-medium mb-4">3. Community as the Classroom</h3>
            <p className="text-body">
              Artists thrive on collaboration. Our programs are built around a cohort model,
              connecting you with a network of peers who understand your journey. This community
              becomes a lifelong resource for collaboration, accountability, and opportunity.
            </p>
          </div>
        </div>
      </section>

      {/* Learning Pathways */}
      <section className="mb-16">
        <h2 className="text-display-text-large mb-8">Explore Our Learning Pathways</h2>
        <p className="text-body mb-10">
          We have structured our educational offerings to meet you where you are and take you where
          you want to go. Whether you need a specific skill, a deep understanding of methodology, or
          a comprehensive career transformation, there is a path for you.
        </p>
        <div className="space-y-8">
          <div className="bg-card p-8 rounded-lg">
            <h3 className="text-display-text-medium mb-4">
              1. Courses for Artists (CENIE Academy)
            </h3>
            <p className="text-body-large italic mb-4">
              For the artist ready to build concrete skills.
            </p>
            <p className="text-body mb-6">
              This is our core offering: a catalog of practical, hands-on courses in technology,
              finance, and entrepreneurship. Go from feeling unprepared to feeling empowered with a
              toolkit of skills you can apply immediately to your career.
            </p>
            <Link href="/learn/courses" className="text-primary hover:underline text-button-medium">
              Explore the Course Catalog →
            </Link>
          </div>

          <div className="bg-card p-8 rounded-lg">
            <h3 className="text-display-text-medium mb-4">
              2. Training Methodologies (Training Exchange Hub)
            </h3>
            <p className="text-body-large italic mb-4">
              For the educator, trainer, and lifelong learner.
            </p>
            <p className="text-body mb-6">
              Go deeper than the &quot;how&quot; and explore the &quot;why.&quot; This is our hub
              for evidence-based research, pedagogical frameworks, and documented best practices for
              teaching and training in the performing arts. Contribute to and learn from a global
              community of educators.
            </p>
            <Link
              href="/learn/training-methodologies"
              className="text-primary hover:underline text-button-medium"
            >
              Access the Methodology Library →
            </Link>
          </div>

          <div className="bg-card p-8 rounded-lg">
            <h3 className="text-display-text-medium mb-4">3. Free Resources & Workshops</h3>
            <p className="text-body-large italic mb-4">For everyone starting their journey.</p>
            <p className="text-body mb-6">
              We believe in making knowledge accessible. Begin your journey with our library of free
              resources, including tech tutorials, articles on career strategy, and our monthly
              introductory workshops designed to give you a taste of the CENIE approach.
            </p>
            <Link
              href="/learn/resources"
              className="text-primary hover:underline text-button-medium"
            >
              Explore Free Resources →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary/5 p-12 rounded-lg text-center">
        <h2 className="text-display-text-large mb-6">Your Transformation Starts Here</h2>
        <p className="text-body-large mb-8 max-w-3xl mx-auto">
          Building a sustainable career in the arts is a deliberate act. It requires more than just
          talent—it requires strategy, skill, and a supportive community. We are here to provide all
          three.
        </p>
        <p className="text-display-text-small font-medium mb-10">Ready to take the first step?</p>

        <div className="space-y-8 max-w-2xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-display-text-small mb-3">
              🎯 Unsure Where to Begin? Take Our Free Skills Assessment
            </h3>
            <p className="text-body mb-4">
              In 5 minutes, identify your biggest opportunities for growth and get a personalized
              recommendation for your ideal learning path.
            </p>
            <Link
              href="/learn/assessment"
              className="inline-block bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 text-button-medium"
            >
              Start Your Assessment
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-display-text-small mb-3">
              📚 Ready to Dive In? Browse Our Full Course Catalog
            </h3>
            <p className="text-body mb-4">
              Explore our full range of programs, from individual courses to comprehensive career
              development tracks.
            </p>
            <Link
              href="/learn/courses"
              className="inline-block bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 text-button-medium"
            >
              View All Courses
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
