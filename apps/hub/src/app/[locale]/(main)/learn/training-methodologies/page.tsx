import Link from 'next/link'

export default function TrainingMethodologiesPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <h1 className="text-display-text-extra-large mb-6">Training Methodologies</h1>
      <p className="text-body-large mb-8">
        Go deeper than the &quot;how&quot; and explore the &quot;why.&quot; This is our hub for
        evidence-based research, pedagogical frameworks, and documented best practices for teaching
        and training in the performing arts.
      </p>

      <div className="bg-primary/5 p-12 rounded-lg text-center">
        <p className="text-display-text-medium mb-6">Methodology Library Coming Soon</p>
        <p className="text-body mb-8">
          We&apos;re building a comprehensive collection of evidence-based training methodologies
          specifically designed for the performing arts. Join our global community of educators and
          contribute to this growing knowledge base.
        </p>
        <Link
          href="/learn"
          className="inline-block bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 text-button-medium"
        >
          Return to Learn Section →
        </Link>
      </div>
    </div>
  )
}
