import Link from 'next/link'

export default function AIContentModelsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      {/* Hero Section */}
      <div className="mb-12">
        <h1 className="text-display-text-extra-large mb-6">Beyond the PDF: Structuring Knowledge for the Age of AI</h1>
        <p className="text-body-large font-medium mb-8">
          The future of research isn&apos;t just about finding articles; it&apos;s about querying ideas. We are building the foundational data layer that will enable AI to act as a true research partner for the performing arts community.
        </p>
      </div>

      {/* Current Limitation */}
      <section className="mb-16">
        <p className="text-body mb-6">
          For the last century, scholarly communication has been trapped in a metaphor: the paper article. We create a digital &quot;paper,&quot; save it as a PDF, and upload it to a digital &quot;library.&quot; But a PDF is a closed container; its deep, contextual knowledge is largely invisible to the powerful analytical tools we now possess.
        </p>
        <p className="text-body mb-6">
          An AI can &quot;read&quot; a thousand articles, but can it truly <em>understand</em> the relationship between a specific Laban effort and a Stanislavski acting technique? Can it trace the lineage of a choreographic concept across three continents and five decades?
        </p>
        <p className="text-body-large font-medium">
          Not with our current infrastructure. <strong>This is the problem we are solving.</strong>
        </p>
      </section>

      {/* What is AI-Ready Research */}
      <section className="mb-16">
        <h2 className="text-display-text-large mb-8">What is AI-Ready Research?</h2>
        <p className="text-body mb-6">
          At CENIE, we believe the next great leap in scholarship will come from transforming our content from a collection of static documents into a dynamic, interconnected <strong>knowledge graph</strong>.
        </p>
        <p className="text-body mb-6">
          We are developing a <strong>Context Model Protocol</strong>, a new standard for structuring and enriching performing arts research. This isn&apos;t just about metadata; it&apos;s about embedding deep, relational context directly into the content itself.
        </p>
        <p className="text-body-large mb-8">
          <strong>In simple terms, we are making scholarly content machine-readable at a granular level.</strong>
        </p>

        <div className="bg-card p-8 rounded-lg mb-8">
          <h3 className="text-display-text-medium mb-6">What does this enable?</h3>
          <div className="space-y-6">
            <div>
              <h4 className="text-display-text-small mb-3">For Today&apos;s Researcher:</h4>
              <p className="text-body">Your work becomes instantly more discoverable and impactful, connected to a web of related ideas.</p>
            </div>
            <div>
              <h4 className="text-display-text-small mb-3">For Tomorrow&apos;s AI Tools:</h4>
              <p className="text-body mb-4">Our structured data becomes the high-quality &quot;fuel&quot; needed to train sophisticated AI research assistants that can:</p>
              <ul className="list-disc list-inside space-y-2 text-body ml-4">
                <li>Perform complex, cross-disciplinary literature reviews in seconds.</li>
                <li>Identify non-obvious patterns and research gaps across the entire field.</li>
                <li>Generate novel hypotheses based on existing knowledge.</li>
                <li>Translate dense academic theory into practical frameworks for artists.</li>
              </ul>
            </div>
          </div>
        </div>

        <p className="text-body-large text-center font-medium">
          This is more than a new publishing model. <strong>It is the creation of a collective intelligence for the performing arts.</strong>
        </p>
      </section>

      {/* Whitepaper Section */}
      <section className="mb-16">
        <h2 className="text-display-text-large mb-8">Read Our Founding Whitepaper</h2>
        <div className="bg-primary/5 p-8 rounded-lg">
          <p className="text-body mb-6">
            This vision is detailed in our comprehensive whitepaper, <strong>&quot;The Future of Performing Arts Scholarship: A Framework for AI-Ready Content.&quot;</strong>
          </p>
          <p className="text-body mb-6">
            This paper is an essential read for academics, university leaders, researchers, and technologists who are interested in the future of scholarly communication.
          </p>
          
          <h4 className="text-heading-4 mb-4">Inside, you will discover:</h4>
          <ul className="list-disc list-inside space-y-2 text-body mb-8">
            <li>A detailed breakdown of our Context Model Protocol.</li>
            <li>The principles of semantic structuring for artistic and pedagogical knowledge.</li>
            <li>Use cases for how this framework will power next-generation research tools.</li>
            <li>Our approach to the ethical considerations of training AI on scholarly and cultural content.</li>
            <li>A roadmap for building a collaborative, open data ecosystem for the arts.</li>
          </ul>
          
          <p className="text-body mb-8">
            This is not just a summary; it is the foundational document for our entire research and publishing initiative.
          </p>

          {/* Form Section */}
          <div className="bg-white p-8 rounded-lg">
            <h3 className="text-display-text-medium mb-6">Get Your Free Copy Now</h3>
            <p className="text-body mb-6">To receive your complimentary PDF of the whitepaper, please enter your information below.</p>
            
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-body-small font-medium mb-2">Full Name *</label>
                <input type="text" className="w-full p-3 border border-border rounded-md text-body" placeholder="Your full name" />
              </div>
              <div>
                <label className="block text-body-small font-medium mb-2">Work Email *</label>
                <input type="email" className="w-full p-3 border border-border rounded-md text-body" placeholder="your@email.com" />
              </div>
              <div>
                <label className="block text-body-small font-medium mb-2">Institution / Organization *</label>
                <input type="text" className="w-full p-3 border border-border rounded-md text-body" placeholder="Your institution" />
              </div>
              <div>
                <label className="block text-body-small font-medium mb-2">Your Role *</label>
                <select className="w-full p-3 border border-border rounded-md text-body">
                  <option value="">Select your role</option>
                  <option value="professor">Professor</option>
                  <option value="researcher">Researcher</option>
                  <option value="phd-student">PhD Student</option>
                  <option value="university-leadership">University Leadership</option>
                  <option value="technologist">Technologist</option>
                  <option value="funder">Funder/Philanthropist</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            
            <button className="bg-primary text-white px-8 py-3 rounded-md hover:bg-primary/90 text-button-medium mb-4">
              Download the Whitepaper →
            </button>
            
            <p className="text-body-small text-muted-foreground">
              We respect your privacy. By downloading, you agree to receive occasional updates about CENIE&apos;s research initiatives and partnership opportunities. You can unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>

      {/* Collaboration Section */}
      <section className="mb-16">
        <h2 className="text-display-text-large mb-8">This Future is a Collaborative Project</h2>
        <p className="text-body mb-8">
          Building a collective intelligence for our field cannot be done in isolation. We are actively seeking partners, collaborators, and early adopters who share our vision and want to contribute to this groundbreaking work.
        </p>
        
        <h3 className="text-display-text-medium mb-6">We are looking to connect with:</h3>
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-card p-6 rounded-lg">
            <h4 className="text-display-text-small mb-3">University Libraries & Digital Humanities Departments</h4>
            <p className="text-body">Interested in piloting new models for scholarly communication.</p>
          </div>
          <div className="bg-card p-6 rounded-lg">
            <h4 className="text-display-text-small mb-3">AI Researchers & Computer Scientists</h4>
            <p className="text-body">Who need high-quality, structured data to train creative AI models.</p>
          </div>
          <div className="bg-card p-6 rounded-lg">
            <h4 className="text-display-text-small mb-3">Academic Presses & Scholarly Societies</h4>
            <p className="text-body">Open to exploring the future of publishing.</p>
          </div>
          <div className="bg-card p-6 rounded-lg">
            <h4 className="text-display-text-small mb-3">Philanthropic Foundations</h4>
            <p className="text-body">Dedicated to funding infrastructure projects that will have a lasting impact on the arts and humanities.</p>
          </div>
        </div>
        
        <p className="text-body-large mb-8">
          If your work aligns with our mission, we believe we can achieve more together.
        </p>
        
        <div className="text-center">
          <Link href="/connect" className="inline-block bg-primary text-white px-8 py-3 rounded-md hover:bg-primary/90 text-button-large">
            Inquire About a Research Partnership →
          </Link>
        </div>
      </section>
    </div>
  )
}
