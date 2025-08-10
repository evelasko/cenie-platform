import { Button } from '@cenie/ui'

export default function AcademyHomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-primary/5 to-accent/20 px-4">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold text-primary">
            CENIE Academy
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground font-light">
            Educational Platform for Emerging Technologies
          </p>
        </div>

        <div className="w-24 h-1 bg-primary mx-auto rounded-full" />

        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">
            🎓 Platform Under Construction
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Welcome to CENIE Academy, your gateway to cutting-edge education in 
            artificial intelligence, emerging economies, and innovative technologies. 
            We're crafting a comprehensive learning environment for the future.
          </p>
          <p className="text-base text-muted-foreground">
            Our platform will offer structured courses, interactive workshops, 
            certification programs, and expert-led seminars, all designed to 
            prepare you for the evolving technological landscape.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="p-6 border border-border rounded-lg bg-card hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-foreground mb-2">AI & Technology</h3>
            <p className="text-sm text-muted-foreground">
              Deep dive into artificial intelligence, machine learning, and emerging tech trends.
            </p>
          </div>
          <div className="p-6 border border-border rounded-lg bg-card hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-foreground mb-2">Innovation Economics</h3>
            <p className="text-sm text-muted-foreground">
              Understand new economic models and their impact on technology adoption.
            </p>
          </div>
          <div className="p-6 border border-border rounded-lg bg-card hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-foreground mb-2">Applied Research</h3>
            <p className="text-sm text-muted-foreground">
              Hands-on projects and research opportunities with industry experts.
            </p>
          </div>
        </div>

        <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 mt-8">
          <h3 className="text-lg font-semibold text-foreground mb-4">Coming Features</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="text-muted-foreground">Interactive course modules</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="text-muted-foreground">Expert-led live sessions</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="text-muted-foreground">Industry certification paths</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="text-muted-foreground">Collaborative project spaces</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="text-muted-foreground">Progress tracking & analytics</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="text-muted-foreground">Community forums & mentorship</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button size="lg" className="text-lg px-8">
            Early Access
          </Button>
          <Button variant="outline" size="lg" className="text-lg px-8">
            Course Catalog
          </Button>
        </div>

        <div className="text-sm text-muted-foreground mt-12">
          <p>© 2024 CENIE Academy. Part of the CENIE Platform.</p>
        </div>
      </div>
    </div>
  )
}