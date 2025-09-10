import Link from 'next/link'

export default function ResourcesPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <h1 className="text-display-text-extra-large mb-6">Free Resources & Workshops</h1>
      <p className="text-body-large mb-8">
        We believe in making knowledge accessible. Begin your journey with our library of free
        resources, including tech tutorials, articles on career strategy, and our monthly
        introductory workshops.
      </p>

      <div className="bg-primary/5 p-12 rounded-lg text-center">
        <p className="text-display-text-medium mb-6">Content Coming Soon</p>
        <p className="text-body mb-8">
          We&apos;re currently developing our comprehensive resource library. Check back soon for
          free tutorials, templates, and workshops designed specifically for performing artists.
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
