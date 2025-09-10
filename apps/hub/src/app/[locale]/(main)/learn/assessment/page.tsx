'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function AssessmentPage() {
  const [started, setStarted] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [answers, setAnswers] = useState<Record<string, string>>({})

  const handleAnswer = (question: string, answer: string) => {
    setAnswers({ ...answers, [question]: answer })
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      {/* Hero Section */}
      {!started && (
        <div className="text-center mb-12">
          <h1 className="text-display-text-extra-large mb-6">
            Discover Your Path to a Future-Ready Artistic Career
          </h1>
          <p className="text-body-large mb-6">
            The modern artistic career requires a diverse set of skills. But where should you focus
            your energy? Is it technology, financial strategy, or marketing?
          </p>
          <p className="text-body mb-8">
            This quick, 5-minute assessment is designed to help you identify your unique strengths
            and pinpoint the areas with the most potential for growth. Answer a few simple questions
            about your current confidence levels, and we&apos;ll provide a personalized,
            no-obligation recommendation for your ideal learning path.
          </p>
          <p className="text-display-text-small font-medium mb-8">
            Let&apos;s build your blueprint for success.
          </p>
          <button
            onClick={() => setStarted(true)}
            className="bg-primary text-white px-8 py-4 rounded-md hover:bg-primary/90 text-button-large"
          >
            Start the Assessment Now →
          </button>
        </div>
      )}

      {/* Assessment Quiz */}
      {started && currentStep <= 4 && (
        <div>
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-body-small text-muted-foreground mb-2">
              <span>Step {currentStep} of 4</span>
              <span>{Math.round((currentStep / 4) * 100)}% Complete</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${(currentStep / 4) * 100}%` }}
              />
            </div>
          </div>

          {/* Questions */}
          {currentStep === 1 && (
            <div className="bg-card p-8 rounded-lg">
              <h2 className="text-display-text-medium mb-6">
                First, to help us tailor our recommendations, what is your primary artistic
                discipline?
              </h2>
              <div className="grid gap-4">
                {[
                  'Dance/Choreography',
                  'Theatre (Actor/Director)',
                  'Music',
                  'Visual/Interdisciplinary Arts',
                  'Arts Management/Production',
                  'Other',
                ].map((option) => (
                  <button
                    key={option}
                    onClick={() => handleAnswer('discipline', option)}
                    className="text-left p-4 border-2 border-border rounded-md hover:border-primary hover:bg-primary/5 transition-all text-body"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="bg-card p-8 rounded-lg">
              <h2 className="text-display-text-medium mb-6">
                How confident do you feel with digital tools and technology?
              </h2>
              <div className="grid gap-4">
                {[
                  { value: '1', label: 'Not confident at all - Technology feels overwhelming' },
                  { value: '2', label: 'Basic skills - I can use email and social media' },
                  {
                    value: '3',
                    label: "Moderate skills - I'm comfortable with most digital tools",
                  },
                  { value: '4', label: 'Advanced - I regularly use sophisticated software' },
                  { value: '5', label: 'Expert - I could teach others about technology' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleAnswer('tech_confidence', option.value)}
                    className="text-left p-4 border-2 border-border rounded-md hover:border-primary hover:bg-primary/5 transition-all text-body"
                  >
                    <span className="font-medium">{option.value}.</span> {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="bg-card p-8 rounded-lg">
              <h2 className="text-display-text-medium mb-6">
                How comfortable are you with business and financial management?
              </h2>
              <div className="grid gap-4">
                {[
                  { value: '1', label: 'No experience - Business feels completely foreign' },
                  { value: '2', label: 'Basic understanding - I manage personal finances' },
                  { value: '3', label: "Some experience - I've handled simple contracts" },
                  { value: '4', label: 'Confident - I understand budgets and business planning' },
                  { value: '5', label: 'Expert - I could run my own business' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleAnswer('business_confidence', option.value)}
                    className="text-left p-4 border-2 border-border rounded-md hover:border-primary hover:bg-primary/5 transition-all text-body"
                  >
                    <span className="font-medium">{option.value}.</span> {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="bg-card p-8 rounded-lg">
              <h2 className="text-display-text-medium mb-6">
                What is your primary goal right now?
              </h2>
              <div className="grid gap-4">
                {[
                  'Build a sustainable freelance career',
                  'Grow my audience and online presence',
                  'Launch my own creative business',
                  'Integrate new technologies into my art',
                  'Improve my financial stability',
                  'Explore new career opportunities',
                ].map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      handleAnswer('goal', option)
                      setCurrentStep(5) // Move to results
                    }}
                    className="text-left p-4 border-2 border-border rounded-md hover:border-primary hover:bg-primary/5 transition-all text-body"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Results */}
      {currentStep === 5 && (
        <div className="text-center">
          <h2 className="text-display-text-large mb-6">Your Personalized Learning Path</h2>
          <div className="bg-primary/5 p-8 rounded-lg mb-8">
            <p className="text-body-large mb-6">
              Based on your responses, we recommend starting with our{' '}
              <strong>Digital Fundamentals for Artists</strong> course to build your technology
              confidence, followed by our <strong>Entrepreneurship for Artists</strong> program to
              strengthen your business skills.
            </p>
            <p className="text-body mb-8">
              This combination will give you the foundational skills needed to achieve your goal of
              building a sustainable freelance career.
            </p>
            <div className="space-y-4">
              <Link
                href="/learn/courses"
                className="inline-block bg-primary text-white px-8 py-3 rounded-md hover:bg-primary/90 text-button-medium"
              >
                View Recommended Courses →
              </Link>
              <div>
                <Link href="/connect" className="text-primary hover:underline text-button-medium">
                  Schedule a Free Consultation to Discuss Your Path
                </Link>
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              setStarted(false)
              setCurrentStep(1)
              setAnswers({})
            }}
            className="text-muted-foreground hover:text-foreground underline text-body"
          >
            Take the Assessment Again
          </button>
        </div>
      )}
    </div>
  )
}
