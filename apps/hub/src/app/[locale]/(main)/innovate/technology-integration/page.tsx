import Link from 'next/link'

export default function TechnologyIntegrationPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <h1 className="text-display-text-extra-large mb-6">Technology Integration Services</h1>
      <p className="text-body-large mb-8">
        Expert guidance for your creative vision. For artists and organizations with a specific
        project in mind, our team provides strategic consulting and hands-on support.
      </p>

      <div className="bg-primary/5 p-12 rounded-lg text-center">
        <p className="text-display-text-medium mb-6">Integration Services Coming Soon</p>
        <p className="text-body mb-8">
          We&apos;re developing comprehensive technology integration services to help artists and
          organizations navigate digital transformation, from integrating AI into new works to
          optimizing creative workflows.
        </p>
        <Link
          href="/innovate"
          className="inline-block bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 text-button-medium"
        >
          Explore Our Innovation Tools →
        </Link>
      </div>
    </div>
  )
}
