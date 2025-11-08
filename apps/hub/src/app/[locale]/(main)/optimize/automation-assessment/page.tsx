'use client'
import { useState } from 'react'
import { logger } from '@/lib/logger-client'

export default function AutomationAssessmentPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    workEmail: '',
    organizationName: '',
    role: '',
    budgetRange: '',
    timeConsumingTask: '',
  })

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    logger.debug('Form submitted', { formData })
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      {/* Hero Section */}
      <div className="mb-12">
        <h1 className="text-display-text-extra-large mb-6">
          Discover Your Organization&apos;s Untapped Potential
        </h1>
        <p className="text-body-large font-medium mb-8">
          In just 30 minutes, we can help you identify the top 1-2 areas where strategic automation
          can save you thousands of dollars and hundreds of hours in administrative overhead.
        </p>
      </div>

      {/* Introduction */}
      <section className="mb-16">
        <p className="text-body mb-8">
          Every arts organization has hidden inefficiencies—workflows that drain time, energy, and
          budget that could be better spent on creating art. The first step to solving them is
          identifying them.
        </p>
        <p className="text-body mb-8">
          This free, no-obligation <strong>Automation Assessment</strong> is a powerful strategic
          session designed for busy arts leaders. We will help you:
        </p>

        <div className="space-y-6 mb-10">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
            <div>
              <h3 className="text-heading-4 mb-2">Map Your Current Workflow</h3>
              <p className="text-body">
                We&apos;ll quickly walk through your key administrative and production processes to
                understand where you&apos;re spending the most time.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
            <div>
              <h3 className="text-heading-4 mb-2">Identify High-Impact Opportunities</h3>
              <p className="text-body">
                Our experts will pinpoint the specific tasks that are prime candidates for
                automation, based on our deep experience in the industry.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
            <div>
              <h3 className="text-heading-4 mb-2">Estimate Potential ROI</h3>
              <p className="text-body">
                We&apos;ll provide a ballpark estimate of the potential savings in time and money
                that automation could bring to your organization.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
            <div>
              <h3 className="text-heading-4 mb-2">Outline a Clear Path Forward</h3>
              <p className="text-body">
                You will leave the call with a clear understanding of what&apos;s possible and
                actionable next steps, whether you choose to work with us or not.
              </p>
            </div>
          </div>
        </div>

        <p className="text-body-large font-medium text-center">
          This is a valuable strategic consultation, offered for free.
        </p>
      </section>

      {/* Assessment Form */}
      <section className="bg-card p-8 rounded-lg">
        <h2 className="text-display-text-large mb-8 text-center">
          Book Your Free 30-Minute Assessment
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
          <div>
            <label htmlFor="fullName" className="block text-heading-4 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label htmlFor="workEmail" className="block text-heading-4 mb-2">
              Work Email *
            </label>
            <input
              type="email"
              id="workEmail"
              name="workEmail"
              value={formData.workEmail}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label htmlFor="organizationName" className="block text-heading-4 mb-2">
              Organization Name *
            </label>
            <input
              type="text"
              id="organizationName"
              name="organizationName"
              value={formData.organizationName}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label htmlFor="role" className="block text-heading-4 mb-2">
              Your Role *
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="">Select your role</option>
              <option value="Executive Director">Executive Director</option>
              <option value="Managing Director">Managing Director</option>
              <option value="General Manager">General Manager</option>
              <option value="Artistic Director">Artistic Director</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="budgetRange" className="block text-heading-4 mb-2">
              Organization&apos;s Approximate Annual Budget *
            </label>
            <select
              id="budgetRange"
              name="budgetRange"
              value={formData.budgetRange}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="">Select budget range</option>
              <option value="Under $500k">Under $500k</option>
              <option value="$500k - $2M">$500k - $2M</option>
              <option value="$2M - $5M">$2M - $5M</option>
              <option value="$5M+">$5M+</option>
            </select>
          </div>

          <div>
            <label htmlFor="timeConsumingTask" className="block text-heading-4 mb-2">
              What is the most time-consuming administrative task your team faces? *
            </label>
            <textarea
              id="timeConsumingTask"
              name="timeConsumingTask"
              value={formData.timeConsumingTask}
              onChange={handleInputChange}
              required
              rows={4}
              className="w-full px-4 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="Please describe the administrative task that takes up the most time for your team..."
            />
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="bg-primary text-white px-8 py-4 rounded-md hover:bg-primary/90 text-button-large"
            >
              Book My Free Assessment →
            </button>
            <p className="text-body-small text-muted-foreground mt-4">
              This assessment is a complimentary strategic session. We respect your privacy and will
              only use this information to prepare for and schedule our conversation. You will not
              be added to a marketing list.
            </p>
          </div>
        </form>
      </section>
    </div>
  )
}
