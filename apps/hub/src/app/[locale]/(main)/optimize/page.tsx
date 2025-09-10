import Link from 'next/link'

export default function OptimizePage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      {/* Hero Section */}
      <div className="mb-12">
        <h1 className="text-display-text-extra-large mb-6">Optimize Your Process: From Creative Chaos to Operational Excellence</h1>
        <p className="text-body-large font-medium mb-8">
          Stop wasting time on administrative fires and start focusing on the art. Discover our suite of tools and services designed to streamline your productions, automate your workflows, and build a more resilient and efficient organization.
        </p>
        <p className="text-body mb-8">
          In the performing arts, our greatest resource is creative energy. Yet, how much of that energy is drained by disorganized communication, inefficient workflows, and the endless administrative tasks required to bring a vision to the stage?
        </p>
        <p className="text-body mb-8">
          <strong>We&apos;ve all been there</strong>: the frantic search for the latest version of the script, the budget spreadsheet that doesn&apos;t add up, the casting process that feels like a shot in the dark. This operational friction doesn&apos;t just cost time and money—it costs us our focus and diminishes our creative potential.
        </p>
        <p className="text-body-large">
          The <strong>CENIE Optimization Pathway</strong> is designed to solve this. We provide the strategic framework and purpose-built tools that transform your operations, giving you back the time, clarity, and resources to do what you do best: create extraordinary art.
        </p>
      </div>

      {/* Philosophy */}
      <section className="mb-16">
        <h2 className="text-display-text-large mb-8">Our Philosophy: Operations in Service of Art</h2>
        <p className="text-body mb-8">
          We believe operational excellence is not a separate, corporate function; it is the invisible architecture that supports great art. Our optimization philosophy is guided by three principles:
        </p>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-display-text-small mb-3">1. Purpose-Built for Artists</h3>
            <p className="text-body">Our tools are not generic project management software with an &quot;arts&quot; template. They are designed from the ground up by performing arts professionals who understand the unique, non-linear, and collaborative nature of creative production.</p>
          </div>
          <div>
            <h3 className="text-display-text-small mb-3">2. Automation that Empowers</h3>
            <p className="text-body">We focus on automating the repetitive, low-value tasks that burn out your team, freeing up human talent for the high-value work of creation, strategy, and community engagement.</p>
          </div>
          <div>
            <h3 className="text-display-text-small mb-3">3. Clarity Creates Confidence</h3>
            <p className="text-body">When your team has a single source of truth for schedules, budgets, and communication, it eliminates confusion and builds the confidence needed to take on ambitious artistic challenges.</p>
          </div>
        </div>
      </section>

      {/* Solutions */}
      <section className="mb-16">
        <h2 className="text-display-text-large mb-8">Explore Our Optimization Solutions</h2>
        <p className="text-body mb-10">
          We address the three critical areas of operational inefficiency in performing arts organizations with a suite of integrated solutions.
        </p>

        <div className="space-y-8">
          <div className="bg-card p-8 rounded-lg">
            <h3 className="text-display-text-medium mb-4">1. qAderno: The Production Collaboration Hub</h3>
            <p className="text-body-large italic mb-4">The single source of truth for your entire production.</p>
            <p className="text-body mb-6">
              Say goodbye to scattered emails and conflicting spreadsheets. qAderno is our intuitive platform that centralizes every aspect of your production, from pre-production planning and budgeting to rehearsal scheduling and performance management.
            </p>
            <a 
              href="https://cuaderno.app" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 text-button-medium"
            >
              Discover qAderno →
            </a>
          </div>

          <div className="bg-card p-8 rounded-lg">
            <h3 className="text-display-text-medium mb-4">2. Platea: The Talent Discovery Platform</h3>
            <p className="text-body-large italic mb-4">Find the right artist for the right role, every time.</p>
            <p className="text-body mb-6">
              Move beyond the limitations of your personal network. Platea is our intelligent platform designed to streamline the casting process, making it easier to discover diverse new talent and manage auditions with efficiency and clarity.
            </p>
            <a 
              href="https://platea.app" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 text-button-medium"
            >
              Explore Platea →
            </a>
          </div>

          <div className="bg-card p-8 rounded-lg">
            <h3 className="text-display-text-medium mb-4">3. Automation & Strategy Services</h3>
            <p className="text-body-large italic mb-4">Expert guidance for your digital transformation.</p>
            <p className="text-body mb-6">
              For organizations ready for a deeper level of optimization, our Automation Agency provides strategic consulting and custom solutions. We help you analyze your workflows, identify high-impact automation opportunities, and build a roadmap for a more efficient future.
            </p>
            <Link href="/optimize/automation-assessment" className="inline-block bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 text-button-medium">
              Learn About Our Services →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary/5 p-12 rounded-lg text-center">
        <h2 className="text-display-text-large mb-6">Ready to Transform Your Workflow?</h2>
        <p className="text-body-large mb-8">
          The path to operational excellence is a journey, not an overnight fix. We are here to guide you every step of the way.
        </p>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-display-text-small mb-3">🚀 Start with a Demo</h3>
            <p className="text-body mb-4">
              The best way to understand the power of our platforms is to see them. Schedule a personalized, no-obligation demo.
            </p>
            <Link href="/optimize/demo" className="inline-block bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 text-button-medium">
              Schedule Your Free Demo
            </Link>
          </div>
          
          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-display-text-small mb-3">⚡ Get a Free Assessment</h3>
            <p className="text-body mb-4">
              Identify your biggest opportunities for operational improvement with our comprehensive workflow assessment.
            </p>
            <Link href="/optimize/automation-assessment" className="inline-block bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 text-button-medium">
              Start Your Assessment
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
