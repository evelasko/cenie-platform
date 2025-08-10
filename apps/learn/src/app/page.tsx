import { Button } from '@cenie/ui'

export default function LearnHomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-accent/10 to-primary/5 px-4">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold text-primary">
            CENIE Learn
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground font-light">
            Learning Management System
          </p>
        </div>

        <div className="w-24 h-1 bg-primary mx-auto rounded-full" />

        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">
            📖 Platform Under Construction
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Welcome to CENIE Learn, our comprehensive Learning Management System. 
            We're building an intelligent platform that adapts to your learning style 
            and provides personalized educational experiences.
          </p>
          <p className="text-base text-muted-foreground">
            Our LMS will seamlessly integrate with CENIE Academy courses, provide 
            detailed progress analytics, facilitate collaborative learning, and 
            offer adaptive assessment tools for optimal learning outcomes.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          <div className="p-4 border border-border rounded-lg bg-card hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="font-semibold text-foreground mb-2">Progress Analytics</h3>
            <p className="text-xs text-muted-foreground">
              Detailed insights into learning patterns and achievement tracking.
            </p>
          </div>
          <div className="p-4 border border-border rounded-lg bg-card hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="font-semibold text-foreground mb-2">Adaptive Learning</h3>
            <p className="text-xs text-muted-foreground">
              Personalized learning paths based on individual performance and goals.
            </p>
          </div>
          <div className="p-4 border border-border rounded-lg bg-card hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
              <span className="text-2xl">👥</span>
            </div>
            <h3 className="font-semibold text-foreground mb-2">Collaboration</h3>
            <p className="text-xs text-muted-foreground">
              Group projects, peer reviews, and interactive discussion forums.
            </p>
          </div>
          <div className="p-4 border border-border rounded-lg bg-card hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
              <span className="text-2xl">📝</span>
            </div>
            <h3 className="font-semibold text-foreground mb-2">Assessment Tools</h3>
            <p className="text-xs text-muted-foreground">
              Intelligent quizzes, assignments, and competency-based evaluations.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-primary/5 to-accent/20 border border-primary/20 rounded-lg p-6 mt-8">
          <h3 className="text-lg font-semibold text-foreground mb-4">LMS Features</h3>
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div className="space-y-2">
              <h4 className="font-medium text-foreground">Learning Experience</h4>
              <div className="space-y-1 text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  <span>Interactive modules</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  <span>Multimedia content</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  <span>Mobile learning</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-foreground">Progress Management</h4>
              <div className="space-y-1 text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  <span>Learning pathways</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  <span>Achievement badges</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  <span>Completion certificates</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-foreground">Integration</h4>
              <div className="space-y-1 text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  <span>Academy sync</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  <span>Editorial resources</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  <span>Single sign-on</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button size="lg" className="text-lg px-8">
            Beta Access
          </Button>
          <Button variant="outline" size="lg" className="text-lg px-8">
            View Demo
          </Button>
        </div>

        <div className="text-sm text-muted-foreground mt-12">
          <p>© 2024 CENIE Learn. Part of the CENIE Platform.</p>
        </div>
      </div>
    </div>
  )
}