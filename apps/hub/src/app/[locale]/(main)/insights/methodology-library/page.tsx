'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function MethodologyLibraryPage() {
  const [disciplineFilter, setDisciplineFilter] = useState('All')
  const [goalFilter, setGoalFilter] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const methodologies = [
    {
      id: 1,
      title: 'The Somatic Integration Framework for Injury Prevention',
      discipline: 'Movement & Dance',
      goals: ['Injury Prevention', 'Skill Acquisition'],
      description:
        "A proven methodology that blends principles of Alexander Technique and Feldenkrais with real-time feedback to build a dancer's intuitive understanding of safe alignment and efficient movement, reducing the risk of common overuse injuries.",
      icon: '🩰',
    },
    {
      id: 2,
      title: 'The "Story-First" Collaborative Devising Process',
      discipline: 'Acting & Dramatic',
      goals: ['Collaborative Creation'],
      description:
        'A structured, five-stage framework for creative teams to develop original theatrical work. This process prioritizes shared narrative building and character development before physical staging, ensuring a cohesive and powerful final product.',
      icon: '🎭',
    },
    {
      id: 3,
      title: 'The "Digital Rehearsal Room" for Technology Integration',
      discipline: 'Directing & Choreography',
      goals: ['Technology Integration'],
      description:
        'An actionable guide for integrating digital tools (like projection mapping and interactive sound) early in the rehearsal process. This methodology helps avoid the common pitfall of technology feeling "tacked on" by making it a core part of the creative development.',
      icon: '💻',
    },
  ]

  const filteredMethodologies = methodologies.filter((methodology) => {
    const matchesDiscipline =
      disciplineFilter === 'All' || methodology.discipline === disciplineFilter
    const matchesGoal =
      goalFilter === 'All' || methodology.goals.some((goal) => goal === goalFilter)
    const matchesSearch =
      searchQuery === '' ||
      methodology.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      methodology.description.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesDiscipline && matchesGoal && matchesSearch
  })

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      {/* Hero Section */}
      <div className="mb-12">
        <h1 className="text-display-text-extra-large mb-6">
          The Methodology Library: From Theory to Practice
        </h1>
        <p className="text-body-large font-medium mb-8">
          This is your open-access resource for proven, practical frameworks that you can apply
          directly in the studio, the classroom, or your creative process. Bridge the gap between
          idea and execution.
        </p>
      </div>

      {/* Introduction */}
      <section className="mb-16">
        <p className="text-body mb-6">
          A great artistic or pedagogical idea is not enough. The true challenge lies in
          transforming that idea into a repeatable, effective process. How do you structure a
          collaborative devising session? What is the most effective way to teach a complex movement
          without causing injury? How can you integrate technology into your rehearsals in a
          meaningful way?
        </p>
        <p className="text-body-large font-medium mb-6">
          The <strong>CENIE Methodology Library</strong> exists to answer these questions.
        </p>
        <p className="text-body">
          Sourced from the innovative work of our Creative & Training Hubs, and curated from a
          global network of expert practitioners and researchers, this is a living collection of
          evidence-based frameworks. Each methodology is documented to be clear, actionable, and
          adaptable to your specific needs.
        </p>
      </section>

      {/* Filter Controls */}
      <section className="mb-12">
        <h2 className="text-display-text-large mb-8">Explore the Library</h2>
        <div className="bg-card p-6 rounded-lg mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-body-small font-medium mb-2">Filter by Discipline</label>
              <select
                value={disciplineFilter}
                onChange={(e) => setDisciplineFilter(e.target.value)}
                className="w-full p-3 border border-border rounded-md text-body"
              >
                <option value="All">All</option>
                <option value="Movement & Dance">Movement & Dance</option>
                <option value="Voice & Vocal">Voice & Vocal</option>
                <option value="Acting & Dramatic">Acting & Dramatic</option>
                <option value="Directing & Choreography">Directing & Choreography</option>
                <option value="Production & Design">Production & Design</option>
              </select>
            </div>
            <div>
              <label className="block text-body-small font-medium mb-2">Filter by Goal</label>
              <select
                value={goalFilter}
                onChange={(e) => setGoalFilter(e.target.value)}
                className="w-full p-3 border border-border rounded-md text-body"
              >
                <option value="All">All</option>
                <option value="Skill Acquisition">Skill Acquisition</option>
                <option value="Injury Prevention">Injury Prevention</option>
                <option value="Collaborative Creation">Collaborative Creation</option>
                <option value="Technology Integration">Technology Integration</option>
                <option value="Audience Engagement">Audience Engagement</option>
              </select>
            </div>
            <div>
              <label className="block text-body-small font-medium mb-2">Search Methodologies</label>
              <input
                type="text"
                placeholder="Search by keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-3 border border-border rounded-md text-body"
              />
            </div>
          </div>
        </div>

        {/* Methodology Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredMethodologies.map((methodology) => (
            <div
              key={methodology.id}
              className="bg-card p-6 rounded-lg hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-4xl">{methodology.icon}</div>
                <div className="flex flex-wrap gap-2">
                  {methodology.goals.map((goal, index) => (
                    <span
                      key={index}
                      className="bg-primary/10 text-primary px-2 py-1 rounded-full text-body-small"
                    >
                      {goal}
                    </span>
                  ))}
                </div>
              </div>

              <h3 className="text-display-text-small mb-3">{methodology.title}</h3>
              <p className="text-body-small text-muted-foreground mb-3">{methodology.discipline}</p>
              <p className="text-body mb-6">{methodology.description}</p>

              <button className="w-full bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 text-button-medium">
                View Methodology →
              </button>
            </div>
          ))}
        </div>

        {filteredMethodologies.length === 0 && (
          <div className="text-center py-12">
            <p className="text-body-large text-muted-foreground">
              No methodologies found matching your criteria. Try adjusting your filters.
            </p>
          </div>
        )}
      </section>

      {/* Contribute Section */}
      <section className="mb-16 bg-muted p-8 rounded-lg">
        <h2 className="text-display-text-large mb-6">
          Help Us Build the World&apos;s Premier Knowledge Base
        </h2>
        <p className="text-body mb-6">
          This library is a community-driven project. Our most valuable insights come from
          practitioners and educators like you who are innovating in their fields every day.
        </p>
        <p className="text-body mb-8">
          We are actively seeking well-documented, evidence-based methodologies to feature in our
          library. If you have developed a unique and effective process for training, creation, or
          production, we invite you to share it with our global community.
        </p>

        <h3 className="text-display-text-medium mb-6">Why Contribute?</h3>
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-4 rounded-lg">
            <h4 className="text-display-text-small mb-3">Amplify Your Impact</h4>
            <p className="text-body">
              Share your work with thousands of artists and educators worldwide.
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <h4 className="text-display-text-small mb-3">Gain Recognition</h4>
            <p className="text-body">
              Receive official recognition and a dedicated page for your methodology.
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <h4 className="text-display-text-small mb-3">Join a Network of Innovators</h4>
            <p className="text-body">Connect with other leading practitioners and researchers.</p>
          </div>
        </div>

        <Link
          href="/connect"
          className="inline-block bg-primary text-white px-8 py-3 rounded-md hover:bg-primary/90 text-button-large"
        >
          Learn More About Contributing a Methodology →
        </Link>
      </section>

      {/* Final Engagement */}
      <section className="bg-primary/5 p-12 rounded-lg">
        <h2 className="text-display-text-large mb-8 text-center">Go From Methodology to Mastery</h2>
        <p className="text-body-large mb-10 text-center max-w-3xl mx-auto">
          Discovering a new framework is the first step. True mastery comes from hands-on
          application and community support.
        </p>

        <h3 className="text-display-text-medium mb-8">Two Paths to Deepen Your Practice:</h3>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-lg">
            <h4 className="text-display-text-small mb-4">For Hands-On Learning:</h4>
            <h5 className="text-heading-4 mb-4">Explore Our Academy Workshops</h5>
            <p className="text-body mb-6">
              Many of the frameworks in this library are explored in-depth in our practical,
              hands-on workshops at the CENIE Academy.
            </p>
            <Link
              href="/learn/courses"
              className="inline-block bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 text-button-medium"
            >
              View Upcoming Workshops →
            </Link>
          </div>

          <div className="bg-white p-8 rounded-lg">
            <h4 className="text-display-text-small mb-4">For Active Discussion:</h4>
            <h5 className="text-heading-4 mb-4">Join Our Free Practitioner Community</h5>
            <p className="text-body mb-6">
              Discuss the implementation of these methodologies, share your adaptations, and get
              feedback from a global network of your peers.
            </p>
            <Link
              href="/connect"
              className="inline-block bg-secondary text-secondary-foreground px-6 py-3 rounded-md hover:bg-secondary/90 text-button-medium"
            >
              Join the Community Forum →
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
