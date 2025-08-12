'use client'

import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Badge, Separator, Tabs, TabsContent, TabsList, TabsTrigger } from '@cenie/ui'
import { Briefcase, Zap, Brain, Rocket, Target, Code2, Users, Award, ChevronRight, Mail, Phone, Calendar } from 'lucide-react'
import { useAuth } from '@cenie/firebase/auth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AgencyHomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-primary/5 to-background">
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        <div className="text-center mb-16 space-y-6">
          <Badge variant="outline" className="mb-4">
            Launching Q1 2024
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            CENIE Agency
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground font-medium">
            Your Strategic Partner in AI-Driven Innovation
          </p>
          
          <div className="max-w-3xl mx-auto mt-8">
            <p className="text-lg text-foreground/90 leading-relaxed">
              We're crafting the future of innovation consulting. CENIE Agency will deliver 
              world-class AI consulting and strategic innovation services to transform your business.
            </p>
          </div>
        </div>

        <Separator className="my-12" />

        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 flex items-center justify-center gap-3">
              <Briefcase className="h-8 w-8 text-primary" />
              Our Expertise
            </h2>
            <p className="text-muted-foreground text-lg">Comprehensive Innovation Solutions</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Rocket className="h-5 w-5" />
                  Innovation Strategy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 mt-0.5 text-primary" />
                    <span>AI Implementation Roadmaps</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 mt-0.5 text-primary" />
                    <span>Digital Transformation Planning</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 mt-0.5 text-primary" />
                    <span>Innovation Framework Development</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 mt-0.5 text-primary" />
                    <span>Technology Assessment & Selection</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 mt-0.5 text-primary" />
                    <span>Change Management Excellence</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI Integration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 mt-0.5 text-primary" />
                    <span>Strategic AI Integration</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 mt-0.5 text-primary" />
                    <span>Machine Learning Solutions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 mt-0.5 text-primary" />
                    <span>Natural Language Processing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 mt-0.5 text-primary" />
                    <span>Computer Vision Applications</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 mt-0.5 text-primary" />
                    <span>Predictive Analytics</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Process Optimization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 mt-0.5 text-primary" />
                    <span>Process Automation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 mt-0.5 text-primary" />
                    <span>Workflow Optimization</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 mt-0.5 text-primary" />
                    <span>Performance Measurement</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 mt-0.5 text-primary" />
                    <span>Resource Allocation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 mt-0.5 text-primary" />
                    <span>Cost Optimization</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code2 className="h-5 w-5" />
                  Technology Solutions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 mt-0.5 text-primary" />
                    <span>Cloud Migration</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 mt-0.5 text-primary" />
                    <span>System Architecture</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 mt-0.5 text-primary" />
                    <span>API Development</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 mt-0.5 text-primary" />
                    <span>Data Infrastructure</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 mt-0.5 text-primary" />
                    <span>Security Implementation</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Team Development
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 mt-0.5 text-primary" />
                    <span>Innovation Culture Building</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 mt-0.5 text-primary" />
                    <span>Team Training Programs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 mt-0.5 text-primary" />
                    <span>Leadership Development</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 mt-0.5 text-primary" />
                    <span>Agile Transformation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 mt-0.5 text-primary" />
                    <span>Knowledge Transfer</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Strategic Advisory
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 mt-0.5 text-primary" />
                    <span>Executive Advisory</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 mt-0.5 text-primary" />
                    <span>Market Analysis</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 mt-0.5 text-primary" />
                    <span>Competitive Intelligence</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 mt-0.5 text-primary" />
                    <span>Risk Assessment</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 mt-0.5 text-primary" />
                    <span>Growth Strategy</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        <Separator className="my-12" />

        <div className="mb-16">
          <Tabs defaultValue="approach" className="w-full">
            <TabsList className="grid w-full md:w-[500px] mx-auto grid-cols-3">
              <TabsTrigger value="approach">Our Approach</TabsTrigger>
              <TabsTrigger value="process">Our Process</TabsTrigger>
              <TabsTrigger value="partners">Partnership</TabsTrigger>
            </TabsList>
            
            <TabsContent value="approach" className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Premium Consulting Solutions</CardTitle>
                  <CardDescription>
                    Our team of industry experts is preparing comprehensive services designed 
                    to accelerate your innovation journey.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h3 className="font-semibold flex items-center gap-2">
                        <Award className="h-5 w-5 text-primary" />
                        Strategic Planning
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Custom AI and innovation roadmaps tailored to your industry and goals
                      </p>
                    </div>
                    <div className="space-y-3">
                      <h3 className="font-semibold flex items-center gap-2">
                        <Award className="h-5 w-5 text-primary" />
                        Implementation Support
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        End-to-end project management with dedicated expert teams
                      </p>
                    </div>
                    <div className="space-y-3">
                      <h3 className="font-semibold flex items-center gap-2">
                        <Award className="h-5 w-5 text-primary" />
                        Training & Development
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Comprehensive team capability building and knowledge transfer
                      </p>
                    </div>
                    <div className="space-y-3">
                      <h3 className="font-semibold flex items-center gap-2">
                        <Award className="h-5 w-5 text-primary" />
                        Ongoing Advisory
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Continuous optimization support and strategic guidance
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="process" className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Our Process</CardTitle>
                  <CardDescription>
                    A structured approach to delivering transformative results
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                        1
                      </div>
                      <div>
                        <h4 className="font-semibold">Discovery & Assessment</h4>
                        <p className="text-sm text-muted-foreground">
                          Comprehensive analysis of your current state and opportunities
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                        2
                      </div>
                      <div>
                        <h4 className="font-semibold">Strategy Development</h4>
                        <p className="text-sm text-muted-foreground">
                          Custom roadmap creation aligned with your business objectives
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                        3
                      </div>
                      <div>
                        <h4 className="font-semibold">Implementation</h4>
                        <p className="text-sm text-muted-foreground">
                          Hands-on execution with agile methodologies and best practices
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                        4
                      </div>
                      <div>
                        <h4 className="font-semibold">Optimization & Scale</h4>
                        <p className="text-sm text-muted-foreground">
                          Continuous improvement and expansion of successful initiatives
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="partners" className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Partner With Us</CardTitle>
                  <CardDescription>
                    Join our professional network for exclusive updates and early access
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="border-l-4 border-primary pl-4">
                      <p className="font-medium">Industry Insights</p>
                      <p className="text-sm text-muted-foreground">Latest trends and best practices</p>
                    </div>
                    <div className="border-l-4 border-primary pl-4">
                      <p className="font-medium">Case Studies</p>
                      <p className="text-sm text-muted-foreground">Real transformation success stories</p>
                    </div>
                    <div className="border-l-4 border-primary pl-4">
                      <p className="font-medium">Early Access</p>
                      <p className="text-sm text-muted-foreground">Priority booking for consulting services</p>
                    </div>
                    <div className="border-l-4 border-primary pl-4">
                      <p className="font-medium">Exclusive Events</p>
                      <p className="text-sm text-muted-foreground">Invitation-only innovation workshops</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <Card className="bg-primary text-primary-foreground">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">Ready to Transform?</CardTitle>
            <CardDescription className="text-primary-foreground/80">
              Be among the first to partner with CENIE Agency
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="min-w-[200px]">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Consultation
              </Button>
              <Button size="lg" variant="outline" className="min-w-[200px] bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground/10">
                Get Early Access
              </Button>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 mt-8 text-left">
              <div className="space-y-2">
                <p className="font-semibold flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Consulting Inquiries
                </p>
                <p className="text-sm text-primary-foreground/80">consulting@cenie.org</p>
              </div>
              <div className="space-y-2">
                <p className="font-semibold flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Professional Network
                </p>
                <p className="text-sm text-primary-foreground/80">LinkedIn: @CENIEAgency</p>
              </div>
              <div className="space-y-2">
                <p className="font-semibold">Speaker Bureau</p>
                <p className="text-sm text-primary-foreground/80">Industry events available</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-12 space-y-4">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold">Launch Date:</span> Q1 2024 | 
            <span className="font-semibold ml-2">Status:</span> Team onboarding and methodology finalization
          </p>
          
          <p className="text-lg font-medium text-muted-foreground italic">
            Part of the CENIE Innovation Ecosystem
          </p>
          
          <p className="text-sm text-muted-foreground">
            © 2024 CENIE Agency. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}