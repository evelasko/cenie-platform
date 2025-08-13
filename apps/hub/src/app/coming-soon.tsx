'use client'

import { useAuthContext } from '@cenie/firebase/auth'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@cenie/ui'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@cenie/ui'
import { Separator } from '@cenie/ui'
import { ArrowRight, Calendar, Mail, Globe, Users, BookOpen, Zap, Target, Lightbulb, Rocket, CheckCircle } from 'lucide-react'

export default function HubComingSoon() {
  const { user, loading } = useAuthContext()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      // TODO: Integrate with actual email subscription service
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 3000)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 type-body-base text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 opacity-50" />
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-32 h-32 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-48 h-48 bg-secondary/20 rounded-full blur-xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/3 w-24 h-24 bg-accent/20 rounded-full blur-xl animate-pulse delay-2000"></div>
        </div>
        <div className="relative container mx-auto px-4 text-center">
          <div className="mx-auto max-w-4xl">
            <div className="animate-fade-in-up">
              <h1 className="type-display-1 mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                The Future of Performance is Coming.
              </h1>
            </div>
            <div className="flex items-center justify-center gap-2 mb-8 animate-fade-in-up delay-200">
              <Calendar className="h-5 w-5 text-primary animate-bounce" />
              <p className="type-heading-4 text-primary font-bold">Launching September 2025</p>
            </div>
            <div className="animate-fade-in-up delay-400">
              <p className="type-lead mb-12 text-muted-foreground max-w-3xl mx-auto">
                CENIE is where the timeless essence of live performance embraces the transformative potential of technological innovation. 
                We are building a comprehensive ecosystem to empower artists, academics, and organizations with the knowledge, tools, and frameworks 
                to thrive in a new era of creative expression.
              </p>
            </div>
            
            {/* Email Subscription */}
            <div className="animate-fade-in-up delay-600">
              <Card className="mx-auto max-w-md mb-8 border-2 border-primary/20 shadow-xl backdrop-blur-sm bg-background/80">
                <CardHeader className="pb-4">
                  <CardTitle className="type-heading-5 flex items-center gap-2 justify-center">
                    <Mail className="h-5 w-5" />
                    Be the First to Know
                  </CardTitle>
                  <CardDescription className="type-body-small">
                    Join our mailing list for exclusive updates and launch invitations
                  </CardDescription>
                </CardHeader>
              <CardContent>
                {subscribed ? (
                  <div className="flex items-center gap-2 justify-center text-green-600">
                    <CheckCircle className="h-5 w-5" />
                    <span className="type-body-base font-medium">Thank you for subscribing!</span>
                  </div>
                ) : (
                  <form onSubmit={handleSubscribe} className="flex gap-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="flex-1 px-3 py-2 rounded-md border border-input bg-background type-body-base"
                      required
                    />
                    <Button type="submit" className="type-button">
                      Subscribe
                    </Button>
                  </form>
                )}
              </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Separator className="opacity-30" />

      {/* Challenges Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="type-heading-1 mb-6">Transforming Challenges into Opportunities</h2>
            <p className="type-lead text-muted-foreground max-w-3xl mx-auto">
              The performing arts are at a pivotal moment. Technological disruption, economic uncertainty, and educational gaps 
              present significant challenges. CENIE addresses these head-on, providing integrated solutions to:
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle className="type-heading-5">Leverage Technology</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="type-body-small">
                  Master AI, AR/VR, and digital platforms to amplify your creative vision.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <Target className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle className="type-heading-5">Achieve Sustainability</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="type-body-small">
                  Access new revenue models and business skills for a resilient career.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <Lightbulb className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle className="type-heading-5">Innovate & Collaborate</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="type-body-small">
                  Connect with a global network to enhance production efficiency and share knowledge.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <Globe className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle className="type-heading-5">Bridge Language Gaps</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="type-body-small">
                  Offering cutting-edge methodologies and resources in both English and Spanish.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator className="opacity-30" />

      {/* Ecosystem Section */}
      <section className="py-20 bg-gradient-to-r from-muted/30 to-accent/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="type-heading-1 mb-6">An Ecosystem for a New Age of Artistry</h2>
            <p className="type-lead text-muted-foreground max-w-3xl mx-auto">
              CENIE is more than a single product—it's an integrated ecosystem designed for the modern creator.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              { title: "Academic Publishing", desc: "A digital-first publisher with AI-enhanced tools and Spanish translations.", icon: BookOpen },
              { title: "Automation Agency", desc: "Custom AI/ML solutions to streamline production and administration.", icon: Rocket },
              { title: "Specialized Academy", desc: "Essential courses in technology, finance, and business for artists.", icon: Users },
              { title: "Creative Hub", desc: "Innovation labs and residencies for choreographers and dramatic artists.", icon: Lightbulb },
              { title: "Training Exchange", desc: "A collaborative platform for sharing performance methodologies.", icon: Globe },
              { title: "Software Suite", desc: "Powerful tools for video analysis (Stoomp), production management (qAderno), and talent discovery (Platea).", icon: Zap }
            ].map((item, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <item.icon className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="type-heading-6">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="type-body-small">{item.desc}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Separator className="opacity-30" />

      {/* Target Audience Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="type-heading-1 mb-6">For Every Creator and Innovator</h2>
            <p className="type-lead text-muted-foreground max-w-3xl mx-auto">
              CENIE is built for the entire performing arts community:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Performing Artists", desc: "seeking career sustainability and technological fluency." },
              { title: "Researchers & Academics", desc: "who need powerful publishing and collaboration platforms." },
              { title: "Industry Professionals", desc: "aiming for operational efficiency and innovative tools." },
              { title: "Spanish-Speaking Community", desc: "looking for specialized content and resources." }
            ].map((audience, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="pb-2">
                  <CardTitle className="type-heading-6 text-primary">{audience.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="type-body-small">{audience.desc}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Separator className="opacity-30" />

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="type-heading-1 mb-6">Join Our Journey</h2>
          <p className="type-lead mb-12 text-muted-foreground max-w-2xl mx-auto">
            The future is collaborative. Connect with us and be part of the movement shaping the next generation of performing arts.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button size="lg" className="type-button">
              <Mail className="mr-2 h-4 w-4" />
              Stay Informed
            </Button>
            <Button variant="outline" size="lg" className="type-button">
              Learn More
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {/* Social Media Placeholder */}
          <div className="flex justify-center gap-6 text-muted-foreground">
            <span className="type-body-small">Follow us on:</span>
            <span className="type-body-small hover:text-primary cursor-pointer">LinkedIn</span>
            <span className="type-body-small hover:text-primary cursor-pointer">Twitter/X</span>
            <span className="type-body-small hover:text-primary cursor-pointer">Instagram</span>
            <span className="type-body-small hover:text-primary cursor-pointer">YouTube</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <p className="type-caption text-muted-foreground">© 2024 CENIE. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  )
}