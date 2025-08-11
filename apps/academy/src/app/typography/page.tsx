export default function TypographyPage() {
  return (
    <div className="min-h-screen bg-background py-12 px-8">
      <div className="mx-auto max-w-4xl space-y-16">
        {/* Header */}
        <div className="text-center">
          <h1 className="type-display-1 text-primary mb-4">Academy Typography</h1>
          <p className="type-lead text-muted-foreground">
            Gotham font family showcase for the CENIE Academy platform
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
              <h1 className="type-display-1 text-foreground">Knowledge Mastery</h1>
              <div className="type-caption text-muted-foreground mt-2 font-mono">
                Font: var(--font-display) | Size: var(--type-display-1-size) | Weight: var(--type-display-1-weight)
              </div>
            </div>
            <div>
              <p className="type-caption text-muted-foreground mb-2">Display 2</p>
              <h1 className="type-display-2 text-foreground">Academy Excellence</h1>
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
              <h1 className="type-heading-1 text-foreground">Learning Pathways</h1>
              <div className="type-caption text-muted-foreground mt-2 font-mono">
                Font: var(--font-display) | Size: var(--type-heading-1-size) | Weight: var(--type-heading-1-weight)
              </div>
            </div>
            <div>
              <p className="type-caption text-muted-foreground mb-2">Heading 2</p>
              <h2 className="type-heading-2 text-foreground">Course Architecture</h2>
              <div className="type-caption text-muted-foreground mt-2 font-mono">
                Font: var(--font-display) | Size: var(--type-heading-2-size) | Weight: var(--type-heading-2-weight)
              </div>
            </div>
            <div>
              <p className="type-caption text-muted-foreground mb-2">Heading 3</p>
              <h3 className="type-heading-3 text-foreground">Module Structure</h3>
              <div className="type-caption text-muted-foreground mt-2 font-mono">
                Font: var(--font-display) | Size: var(--type-heading-3-size) | Weight: var(--type-heading-3-weight)
              </div>
            </div>
            <div>
              <p className="type-caption text-muted-foreground mb-2">Heading 4</p>
              <h4 className="type-heading-4 text-foreground">Lesson Planning</h4>
              <div className="type-caption text-muted-foreground mt-2 font-mono">
                Font: var(--font-display) | Size: var(--type-heading-4-size) | Weight: var(--type-heading-4-weight)
              </div>
            </div>
            <div>
              <p className="type-caption text-muted-foreground mb-2">Heading 5</p>
              <h5 className="type-heading-5 text-foreground">Assessment Methods</h5>
              <div className="type-caption text-muted-foreground mt-2 font-mono">
                Font: var(--font-body) | Size: var(--type-heading-5-size) | Weight: var(--type-heading-5-weight)
              </div>
            </div>
            <div>
              <p className="type-caption text-muted-foreground mb-2">Heading 6</p>
              <h6 className="type-heading-6 text-foreground">Learning Objectives</h6>
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
                Large body text enhances the learning experience by providing clear, readable content for course descriptions, important announcements, and key educational concepts.
              </p>
              <div className="type-caption text-muted-foreground mt-2 font-mono">
                Font: var(--font-body) | Size: var(--type-body-large-size) | Weight: var(--type-body-large-weight)
              </div>
            </div>
            <div>
              <p className="type-caption text-muted-foreground mb-2">Body Base</p>
              <p className="type-body-base text-foreground">
                Standard body text forms the backbone of educational content, providing optimal readability for lesson materials, course documentation, and instructional text. The carefully balanced typography ensures students can focus on learning without visual distractions.
              </p>
              <div className="type-caption text-muted-foreground mt-2 font-mono">
                Font: var(--font-body) | Size: var(--type-body-base-size) | Weight: var(--type-body-base-weight)
              </div>
            </div>
            <div>
              <p className="type-caption text-muted-foreground mb-2">Body Small</p>
              <p className="type-body-small text-foreground">
                Small body text provides supporting information such as prerequisites, additional resources, and supplementary notes that enhance the main learning content.
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
              <p className="type-lead text-foreground">Course introduction and overview</p>
              <div className="type-caption text-muted-foreground mt-2 font-mono">
                Size: var(--type-lead-size)
              </div>
            </div>
            <div>
              <p className="type-caption text-muted-foreground mb-2">Caption</p>
              <p className="type-caption text-muted-foreground">Resource citations and notes</p>
              <div className="type-caption text-muted-foreground mt-2 font-mono">
                Size: var(--type-caption-size)
              </div>
            </div>
            <div>
              <p className="type-caption text-muted-foreground mb-2">Overline</p>
              <p className="type-overline text-muted-foreground">Course Category</p>
              <div className="type-caption text-muted-foreground mt-2 font-mono">
                Size: var(--type-overline-size)
              </div>
            </div>
            <div>
              <p className="type-caption text-muted-foreground mb-2">Button Text</p>
              <p className="type-button text-foreground">Start Learning</p>
              <div className="type-caption text-muted-foreground mt-2 font-mono">
                Size: var(--type-button-size)
              </div>
            </div>
            <div>
              <p className="type-caption text-muted-foreground mb-2">Link Text</p>
              <p className="type-link text-primary">Course Resources</p>
              <div className="type-caption text-muted-foreground mt-2 font-mono">
                Decoration: var(--type-link-decoration)
              </div>
            </div>
            <div>
              <p className="type-caption text-muted-foreground mb-2">Quote</p>
              <p className="type-quote text-foreground">&quot;Education is the key to unlocking potential&quot;</p>
              <div className="type-caption text-muted-foreground mt-2 font-mono">
                Size: var(--type-quote-size)
              </div>
            </div>
            <div>
              <p className="type-caption text-muted-foreground mb-2">Label</p>
              <p className="type-label text-foreground">Assignment Due</p>
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

        {/* Academy-Specific Usage Examples */}
        <section className="space-y-8">
          <h2 className="type-heading-2 text-foreground border-b border-border pb-2">
            Academy Usage Examples
          </h2>
          <div className="space-y-8">
            <div className="border border-border rounded-lg p-6">
              <p className="type-overline text-primary mb-2">Web Development</p>
              <h3 className="type-heading-3 text-foreground mb-2">Introduction to React</h3>
              <p className="type-lead text-muted-foreground mb-4">
                Master the fundamentals of React development in this comprehensive course
              </p>
              <p className="type-body-base text-foreground mb-4">
                This course covers essential React concepts including components, state management, hooks, and modern development practices. Students will build real-world projects while learning industry best practices.
              </p>
              <div className="flex items-center gap-4">
                <span className="type-label text-foreground">Duration:</span>
                <span className="type-body-small text-muted-foreground">8 weeks</span>
                <span className="type-label text-foreground">Level:</span>
                <span className="type-body-small text-muted-foreground">Intermediate</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}