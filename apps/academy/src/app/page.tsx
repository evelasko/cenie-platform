'use client'

import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Badge, Separator, Tabs, TabsContent, TabsList, TabsTrigger } from '@cenie/ui'
import { GraduationCap, BookOpen, Users, Award, TrendingUp, Laptop, Brain, Target, CheckCircle, Bell, Mail, Linkedin } from 'lucide-react'
import { useAuth } from '@cenie/firebase/auth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AcademyHomePage() {
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-blue-50/20 to-background dark:via-blue-950/10">
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        <div className="text-center mb-16 space-y-6">
          <Badge variant="outline" className="mb-4">
            Launching Q2 2024
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            CENIE Academy
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground font-medium">
            Shaping Tomorrow's Innovators Through Advanced AI Education
          </p>
          
          <div className="max-w-3xl mx-auto mt-8">
            <p className="text-lg text-foreground/90 leading-relaxed">
              We're building something extraordinary. CENIE Academy will be your premier destination 
              for cutting-edge education in artificial intelligence, innovation management, and digital transformation.
            </p>
          </div>
        </div>

        <Separator className="my-12" />

        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 flex items-center justify-center gap-3">
              <BookOpen className="h-8 w-8 text-blue-600" />
              What's Coming
            </h2>
            <p className="text-muted-foreground text-lg">Comprehensive Learning Experiences</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow border-blue-100 dark:border-blue-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-blue-600" />
                  AI Fundamentals
                </CardTitle>
                <CardDescription>Master the foundations</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Machine Learning Basics</li>
                  <li>• Neural Networks & Deep Learning</li>
                  <li>• Natural Language Processing</li>
                  <li>• Computer Vision Applications</li>
                  <li>• AI Ethics & Governance</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-blue-100 dark:border-blue-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  Innovation Strategy
                </CardTitle>
                <CardDescription>Lead transformation</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Innovation Management</li>
                  <li>• Digital Transformation</li>
                  <li>• Change Leadership</li>
                  <li>• Strategic Planning</li>
                  <li>• Technology Adoption</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-blue-100 dark:border-blue-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Laptop className="h-5 w-5 text-blue-600" />
                  Applied Technologies
                </CardTitle>
                <CardDescription>Hands-on experience</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Cloud Computing & DevOps</li>
                  <li>• Data Science & Analytics</li>
                  <li>• Blockchain Technologies</li>
                  <li>• IoT & Edge Computing</li>
                  <li>• Cybersecurity Fundamentals</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-blue-100 dark:border-blue-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  Business Applications
                </CardTitle>
                <CardDescription>Real-world solutions</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• AI for Business Leaders</li>
                  <li>• Process Automation</li>
                  <li>• Customer Experience AI</li>
                  <li>• Predictive Analytics</li>
                  <li>• ROI Measurement</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-blue-100 dark:border-blue-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  Emerging Technologies
                </CardTitle>
                <CardDescription>Future-focused learning</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Quantum Computing Basics</li>
                  <li>• Extended Reality (XR)</li>
                  <li>• Autonomous Systems</li>
                  <li>• Synthetic Biology & AI</li>
                  <li>• Web3 Technologies</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-blue-100 dark:border-blue-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-blue-600" />
                  Certification Programs
                </CardTitle>
                <CardDescription>Professional credentials</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• AI Practitioner Certificate</li>
                  <li>• Innovation Manager Diploma</li>
                  <li>• Data Science Professional</li>
                  <li>• Digital Transformation Expert</li>
                  <li>• Industry-Specific Tracks</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        <Separator className="my-12" />

        <div className="mb-16">
          <Tabs defaultValue="features" className="w-full">
            <TabsList className="grid w-full md:w-[500px] mx-auto grid-cols-3">
              <TabsTrigger value="features">Premium Features</TabsTrigger>
              <TabsTrigger value="learning">Learning Experience</TabsTrigger>
              <TabsTrigger value="community">Community</TabsTrigger>
            </TabsList>
            
            <TabsContent value="features" className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Premium Features</CardTitle>
                  <CardDescription>
                    State-of-the-art learning platform with cutting-edge capabilities
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-blue-600 mt-1" />
                      <div>
                        <p className="font-medium">Interactive Learning</p>
                        <p className="text-sm text-muted-foreground">
                          Hands-on labs, simulations, and real-world projects
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-blue-600 mt-1" />
                      <div>
                        <p className="font-medium">Expert Mentorship</p>
                        <p className="text-sm text-muted-foreground">
                          Direct access to industry leaders and AI experts
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-blue-600 mt-1" />
                      <div>
                        <p className="font-medium">Flexible Learning Paths</p>
                        <p className="text-sm text-muted-foreground">
                          Self-paced and cohort-based options available
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-blue-600 mt-1" />
                      <div>
                        <p className="font-medium">Industry Partnerships</p>
                        <p className="text-sm text-muted-foreground">
                          Learn from real case studies and enterprise projects
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="learning" className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Learning Experience</CardTitle>
                  <CardDescription>
                    Designed for maximum engagement and knowledge retention
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-l-4 border-blue-600 pl-4">
                      <p className="font-medium">Live Masterclasses</p>
                      <p className="text-sm text-muted-foreground">
                        Weekly sessions with renowned experts and practitioners
                      </p>
                    </div>
                    <div className="border-l-4 border-blue-600 pl-4">
                      <p className="font-medium">Project-Based Learning</p>
                      <p className="text-sm text-muted-foreground">
                        Build a portfolio with real-world applications
                      </p>
                    </div>
                    <div className="border-l-4 border-blue-600 pl-4">
                      <p className="font-medium">Peer Collaboration</p>
                      <p className="text-sm text-muted-foreground">
                        Work with learners from diverse backgrounds globally
                      </p>
                    </div>
                    <div className="border-l-4 border-blue-600 pl-4">
                      <p className="font-medium">Continuous Assessment</p>
                      <p className="text-sm text-muted-foreground">
                        Track progress with detailed analytics and feedback
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="community" className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Global Community</CardTitle>
                  <CardDescription>
                    Connect with innovators and thought leaders worldwide
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <Users className="h-4 w-4 text-blue-600" />
                        Networking Opportunities
                      </h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Alumni network access</li>
                        <li>• Industry meetups</li>
                        <li>• Virtual coffee chats</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-blue-600" />
                        Career Support
                      </h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Job placement assistance</li>
                        <li>• Resume reviews</li>
                        <li>• Interview preparation</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <Card className="bg-gradient-to-r from-blue-600 to-blue-500 text-white border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">Be Among the First</CardTitle>
            <CardDescription className="text-blue-100">
              Join our exclusive waitlist and get early access to CENIE Academy
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="min-w-[200px]">
                <Bell className="h-4 w-4 mr-2" />
                Join Waitlist
              </Button>
              <Button size="lg" variant="outline" className="min-w-[200px] bg-transparent text-white border-white hover:bg-white/10">
                Notify Me
              </Button>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 mt-8 text-left">
              <div className="space-y-2">
                <p className="font-semibold">Email Updates</p>
                <p className="text-sm text-blue-100">Latest course announcements</p>
              </div>
              <div className="space-y-2">
                <p className="font-semibold">Priority Access</p>
                <p className="text-sm text-blue-100">First enrollment when we open</p>
              </div>
              <div className="space-y-2">
                <p className="font-semibold">Exclusive Content</p>
                <p className="text-sm text-blue-100">Preview materials & discounts</p>
              </div>
            </div>

            <Separator className="bg-white/20" />

            <div className="flex items-center justify-center gap-6">
              <div className="text-left">
                <p className="font-semibold flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Contact Us
                </p>
                <p className="text-sm text-blue-100">academy@cenie.org</p>
              </div>
              <div className="text-left">
                <p className="font-semibold flex items-center gap-2">
                  <Linkedin className="h-4 w-4" />
                  Follow Us
                </p>
                <p className="text-sm text-blue-100">@CENIEAcademy</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-12 space-y-4">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold">Expected Launch:</span> Q2 2024 | 
            <span className="font-semibold ml-2">Status:</span> Final development phase
          </p>
          
          <p className="text-lg font-medium text-muted-foreground italic">
            Part of the CENIE Innovation Ecosystem
          </p>
          
          <p className="text-sm text-muted-foreground">
            © 2024 CENIE Academy. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}