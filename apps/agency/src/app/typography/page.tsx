export default function TypographyPage() {
  return (
    <div className="min-h-screen bg-background py-12 px-8">
      <div className="mx-auto max-w-4xl space-y-16">
        {/* Header */}
        <div className="text-center">
          <h1 className="type-display-1 text-primary mb-4">Learn Typography</h1>
          <p className="type-lead text-muted-foreground">
            Gotham font family showcase for the CENIE Learn platform
          </p>
        </div>

        {/* Display Styles */}
        <section className="space-y-8">
          <h2 className="type-heading-2 text-foreground border-b border-border pb-2">
            Display Styles
          </h2>
          <div className="space-y-6">
            <div>
              <p className="type-caption text-muted-foreground mb-2">Display 1</p>
              <h1 className="type-display-1 text-foreground">Skill Development</h1>
              <div className="type-caption text-muted-foreground mt-2 font-mono">
                Font: var(--font-display) | Size: var(--type-display-1-size) | Weight: var(--type-display-1-weight)
              </div>
            </div>
            <div>
              <p className="type-caption text-muted-foreground mb-2">Display 2</p>
              <h1 className="type-display-2 text-foreground">Learn Platform</h1>
              <div className="type-caption text-muted-foreground mt-2 font-mono">
                Font: var(--font-display) | Size: var(--type-display-2-size) | Weight: var(--type-display-2-weight)
              </div>
            </div>
          </div>
        </section>

        {/* Heading Styles */}
        <section className="space-y-8">
          <h2 className="type-heading-2 text-foreground border-b border-border pb-2">
            Heading Styles
          </h2>
          <div className="space-y-6">
            <div>
              <p className="type-caption text-muted-foreground mb-2">Heading 1</p>
              <h1 className="type-heading-1 text-foreground">Interactive Learning</h1>
              <div className="type-caption text-muted-foreground mt-2 font-mono">
                Font: var(--font-display) | Size: var(--type-heading-1-size) | Weight: var(--type-heading-1-weight)
              </div>
            </div>
            <div>
              <p className="type-caption text-muted-foreground mb-2">Heading 2</p>
              <h2 className="type-heading-2 text-foreground">Personalized Journey</h2>
              <div className="type-caption text-muted-foreground mt-2 font-mono">
                Font: var(--font-display) | Size: var(--type-heading-2-size) | Weight: var(--type-heading-2-weight)
              </div>
            </div>
            <div>
              <p className="type-caption text-muted-foreground mb-2">Heading 3</p>
              <h3 className="type-heading-3 text-foreground">Progress Tracking</h3>
              <div className="type-caption text-muted-foreground mt-2 font-mono">
                Font: var(--font-display) | Size: var(--type-heading-3-size) | Weight: var(--type-heading-3-weight)
              </div>
            </div>
            <div>
              <p className="type-caption text-muted-foreground mb-2">Heading 4</p>
              <h4 className="type-heading-4 text-foreground">Skill Assessment</h4>
              <div className="type-caption text-muted-foreground mt-2 font-mono">
                Font: var(--font-display) | Size: var(--type-heading-4-size) | Weight: var(--type-heading-4-weight)
              </div>
            </div>
            <div>
              <p className="type-caption text-muted-foreground mb-2">Heading 5</p>
              <h5 className="type-heading-5 text-foreground">Learning Milestones</h5>
              <div className="type-caption text-muted-foreground mt-2 font-mono">
                Font: var(--font-body) | Size: var(--type-heading-5-size) | Weight: var(--type-heading-5-weight)
              </div>
            </div>
            <div>
              <p className="type-caption text-muted-foreground mb-2">Heading 6</p>
              <h6 className="type-heading-6 text-foreground">Activity Summary</h6>
              <div className="type-caption text-muted-foreground mt-2 font-mono">
                Font: var(--font-body) | Size: var(--type-heading-6-size) | Weight: var(--type-heading-6-weight)
              </div>
            </div>
          </div>
        </section>

        {/* Body Text Styles */}
        <section className="space-y-8">
          <h2 className="type-heading-2 text-foreground border-b border-border pb-2">
            Body Text Styles
          </h2>
          <div className="space-y-6">
            <div>
              <p className="type-caption text-muted-foreground mb-2">Body Large</p>
              <p className="type-body-large text-foreground">
                Large body text creates an engaging learning environment, making complex concepts more approachable and encouraging continued exploration of educational content.
              </p>
              <div className="type-caption text-muted-foreground mt-2 font-mono">
                Font: var(--font-body) | Size: var(--type-body-large-size) | Weight: var(--type-body-large-weight)
              </div>
            </div>
            <div>
              <p className="type-caption text-muted-foreground mb-2">Body Base</p>
              <p className="type-body-base text-foreground">
                The primary body text provides clear communication of learning materials, exercise instructions, and educational content. Its balanced readability ensures learners can focus on skill development and knowledge acquisition without typographic barriers interfering with comprehension.
              </p>
              <div className="type-caption text-muted-foreground mt-2 font-mono">
                Font: var(--font-body) | Size: var(--type-body-base-size) | Weight: var(--type-body-base-weight)
              </div>
            </div>
            <div>
              <p className="type-caption text-muted-foreground mb-2">Body Small</p>
              <p className="type-body-small text-foreground">
                Small body text delivers helpful hints, progress indicators, and contextual information that supports the primary learning experience.
              </p>
              <div className="type-caption text-muted-foreground mt-2 font-mono">
                Font: var(--font-body) | Size: var(--type-body-small-size) | Weight: var(--type-body-small-weight)
              </div>
            </div>
          </div>
        </section>

        {/* UI/Utility Styles */}
        <section className="space-y-8">
          <h2 className="type-heading-2 text-foreground border-b border-border pb-2">
            UI & Utility Styles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="type-caption text-muted-foreground mb-2">Lead Text</p>
              <p className="type-lead text-foreground">Begin your learning adventure today</p>
              <div className="type-caption text-muted-foreground mt-2 font-mono">
                Size: var(--type-lead-size)
              </div>
            </div>
            <div>
              <p className="type-caption text-muted-foreground mb-2">Caption</p>
              <p className="type-caption text-muted-foreground">Progress indicators and tips</p>
              <div className="type-caption text-muted-foreground mt-2 font-mono">
                Size: var(--type-caption-size)
              </div>
            </div>
            <div>
              <p className="type-caption text-muted-foreground mb-2">Overline</p>
              <p className="type-overline text-muted-foreground">Skill Level</p>
              <div className="type-caption text-muted-foreground mt-2 font-mono">
                Size: var(--type-overline-size)
              </div>
            </div>
            <div>
              <p className="type-caption text-muted-foreground mb-2">Button Text</p>
              <p className="type-button text-foreground">Continue Learning</p>
              <div className="type-caption text-muted-foreground mt-2 font-mono">
                Size: var(--type-button-size)
              </div>
            </div>
            <div>
              <p className="type-caption text-muted-foreground mb-2">Link Text</p>
              <p className="type-link text-primary">Related Skills</p>
              <div className="type-caption text-muted-foreground mt-2 font-mono">
                Decoration: var(--type-link-decoration)
              </div>
            </div>
            <div>
              <p className="type-caption text-muted-foreground mb-2">Quote</p>
              <p className="type-quote text-foreground">&quot;Learning never stops&quot;</p>
              <div className="type-caption text-muted-foreground mt-2 font-mono">
                Size: var(--type-quote-size)
              </div>
            </div>
            <div>
              <p className="type-caption text-muted-foreground mb-2">Label</p>
              <p className="type-label text-foreground">Next Challenge</p>
              <div className="type-caption text-muted-foreground mt-2 font-mono">
                Size: var(--type-label-size)
              </div>
            </div>
          </div>
        </section>

        {/* Font Weights */}
        <section className="space-y-8">
          <h2 className="type-heading-2 text-foreground border-b border-border pb-2">
            Font Weights (Gotham)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="type-caption text-muted-foreground mb-2">Light (300)</p>
              <p className="text-2xl" style={{fontFamily: 'var(--font-body)', fontWeight: 300}}>
                Gotham Light
              </p>
            </div>
            <div>
              <p className="type-caption text-muted-foreground mb-2">Book (400)</p>
              <p className="text-2xl" style={{fontFamily: 'var(--font-body)', fontWeight: 400}}>
                Gotham Book
              </p>
            </div>
            <div>
              <p className="type-caption text-muted-foreground mb-2">Medium (500)</p>
              <p className="text-2xl" style={{fontFamily: 'var(--font-body)', fontWeight: 500}}>
                Gotham Medium
              </p>
            </div>
            <div>
              <p className="type-caption text-muted-foreground mb-2">Bold (700)</p>
              <p className="text-2xl" style={{fontFamily: 'var(--font-body)', fontWeight: 700}}>
                Gotham Bold
              </p>
            </div>
            <div>
              <p className="type-caption text-muted-foreground mb-2">Black (800)</p>
              <p className="text-2xl" style={{fontFamily: 'var(--font-body)', fontWeight: 800}}>
                Gotham Black
              </p>
            </div>
            <div>
              <p className="type-caption text-muted-foreground mb-2">Ultra (900)</p>
              <p className="text-2xl" style={{fontFamily: 'var(--font-body)', fontWeight: 900}}>
                Gotham Ultra
              </p>
            </div>
          </div>
        </section>

        {/* Learn-Specific Usage Examples */}
        <section className="space-y-8">
          <h2 className="type-heading-2 text-foreground border-b border-border pb-2">
            Learn Platform Usage Examples
          </h2>
          <div className="space-y-8">
            <div className="border border-border rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="type-label text-primary">JS</span>
                </div>
                <div>
                  <p className="type-overline text-primary">Interactive Exercise</p>
                  <h4 className="type-heading-4 text-foreground">JavaScript Fundamentals</h4>
                </div>
              </div>
              <p className="type-body-base text-foreground mb-4">
                Practice your JavaScript skills with this interactive coding exercise. Complete the function to handle array manipulation.
              </p>
              <div className="bg-muted/50 rounded p-4 mb-4">
                <p className="type-label text-foreground mb-2">Instructions:</p>
                <p className="type-body-small text-muted-foreground">
                  Write a function that takes an array of numbers and returns the sum of all even numbers.
                </p>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="type-caption text-muted-foreground">Progress:</span>
                  <span className="type-body-small text-foreground">3 of 5 completed</span>
                </div>
                <button className="type-button bg-primary text-primary-foreground px-4 py-2 rounded">
                  Check Answer
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}