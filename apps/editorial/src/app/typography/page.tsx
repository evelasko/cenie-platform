export default function TypographyPage() {
  return (
    <div className="min-h-screen bg-background py-12 px-8">
      <div className="mx-auto max-w-4xl space-y-16">
        {/* Header */}
        <div className="text-center">
          <h1 className="type-display-1 text-primary mb-4">Editorial Typography</h1>
          <p className="type-lead text-muted-foreground">
            Warbler Display for headings, Gotham for body text - Editorial platform showcase
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
              <h1 className="type-display-1 text-foreground">Literary Excellence</h1>
              <div className="type-caption text-muted-foreground mt-2 font-mono">
                Font: var(--font-display) [Warbler Display] | Size: var(--type-display-1-size) | Weight: var(--type-display-1-weight)
              </div>
            </div>
            <div>
              <p className="type-caption text-muted-foreground mb-2">Display 2</p>
              <h1 className="type-display-2 text-foreground">Editorial Vision</h1>
              <div className="type-caption text-muted-foreground mt-2 font-mono">
                Font: var(--font-display) [Warbler Display] | Size: var(--type-display-2-size) | Weight: var(--type-display-2-weight)
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
              <h1 className="type-heading-1 text-foreground">Crafting Stories</h1>
              <div className="type-caption text-muted-foreground mt-2 font-mono">
                Font: var(--font-display) [Warbler Display] | Size: var(--type-heading-1-size) | Weight: var(--type-heading-1-weight)
              </div>
            </div>
            <div>
              <p className="type-caption text-muted-foreground mb-2">Heading 2</p>
              <h2 className="type-heading-2 text-foreground">Publishing Heritage</h2>
              <div className="type-caption text-muted-foreground mt-2 font-mono">
                Font: var(--font-display) [Warbler Display] | Size: var(--type-heading-2-size) | Weight: var(--type-heading-2-weight)
              </div>
            </div>
            <div>
              <p className="type-caption text-muted-foreground mb-2">Heading 3</p>
              <h3 className="type-heading-3 text-foreground">Editorial Standards</h3>
              <div className="type-caption text-muted-foreground mt-2 font-mono">
                Font: var(--font-display) [Warbler Display] | Size: var(--type-heading-3-size) | Weight: var(--type-heading-3-weight)
              </div>
            </div>
            <div>
              <p className="type-caption text-muted-foreground mb-2">Heading 4</p>
              <h4 className="type-heading-4 text-foreground">Content Strategy</h4>
              <div className="type-caption text-muted-foreground mt-2 font-mono">
                Font: var(--font-display) [Warbler Display] | Size: var(--type-heading-4-size) | Weight: var(--type-heading-4-weight)
              </div>
            </div>
            <div>
              <p className="type-caption text-muted-foreground mb-2">Heading 5</p>
              <h5 className="type-heading-5 text-foreground">Section Guidelines</h5>
              <div className="type-caption text-muted-foreground mt-2 font-mono">
                Font: var(--font-body) [Gotham] | Size: var(--type-heading-5-size) | Weight: var(--type-heading-5-weight)
              </div>
            </div>
            <div>
              <p className="type-caption text-muted-foreground mb-2">Heading 6</p>
              <h6 className="type-heading-6 text-foreground">Article Structure</h6>
              <div className="type-caption text-muted-foreground mt-2 font-mono">
                Font: var(--font-body) [Gotham] | Size: var(--type-heading-6-size) | Weight: var(--type-heading-6-weight)
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
                Large body text provides excellent readability for feature articles and editorial content, creating an inviting reading experience that draws readers into the narrative flow.
              </p>
              <div className="type-caption text-muted-foreground mt-2 font-mono">
                Font: var(--font-body) [Gotham] | Size: var(--type-body-large-size) | Weight: var(--type-body-large-weight)
              </div>
            </div>
            <div>
              <p className="type-caption text-muted-foreground mb-2">Body Base</p>
              <p className="type-body-base text-foreground">
                The standard body text for editorial content combines the clarity of Gotham with optimal line spacing and letter tracking. This ensures comfortable reading for long-form articles, interviews, and editorial pieces while maintaining the professional aesthetic expected in publishing.
              </p>
              <div className="type-caption text-muted-foreground mt-2 font-mono">
                Font: var(--font-body) [Gotham] | Size: var(--type-body-base-size) | Weight: var(--type-body-base-weight)
              </div>
            </div>
            <div>
              <p className="type-caption text-muted-foreground mb-2">Body Small</p>
              <p className="type-body-small text-foreground">
                Small body text serves bylines, photo credits, and supplementary information that supports the main editorial content without overwhelming the primary narrative.
              </p>
              <div className="type-caption text-muted-foreground mt-2 font-mono">
                Font: var(--font-body) [Gotham] | Size: var(--type-body-small-size) | Weight: var(--type-body-small-weight)
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
              <p className="type-lead text-foreground">Editorial lead for article introductions</p>
              <div className="type-caption text-muted-foreground mt-2 font-mono">
                Size: var(--type-lead-size)
              </div>
            </div>
            <div>
              <p className="type-caption text-muted-foreground mb-2">Caption</p>
              <p className="type-caption text-muted-foreground">Photo captions and metadata</p>
              <div className="type-caption text-muted-foreground mt-2 font-mono">
                Size: var(--type-caption-size)
              </div>
            </div>
            <div>
              <p className="type-caption text-muted-foreground mb-2">Overline</p>
              <p className="type-overline text-muted-foreground">Section identifier</p>
              <div className="type-caption text-muted-foreground mt-2 font-mono">
                Size: var(--type-overline-size)
              </div>
            </div>
            <div>
              <p className="type-caption text-muted-foreground mb-2">Button Text</p>
              <p className="type-button text-foreground">Read More</p>
              <div className="type-caption text-muted-foreground mt-2 font-mono">
                Size: var(--type-button-size)
              </div>
            </div>
            <div>
              <p className="type-caption text-muted-foreground mb-2">Link Text</p>
              <p className="type-link text-primary">Related Article Link</p>
              <div className="type-caption text-muted-foreground mt-2 font-mono">
                Decoration: var(--type-link-decoration)
              </div>
            </div>
            <div>
              <p className="type-caption text-muted-foreground mb-2">Quote</p>
              <p className="type-quote text-foreground">&quot;Words have the power to transform minds&quot;</p>
              <div className="type-caption text-muted-foreground mt-2 font-mono">
                Size: var(--type-quote-size)
              </div>
            </div>
            <div>
              <p className="type-caption text-muted-foreground mb-2">Label</p>
              <p className="type-label text-foreground">Article Category</p>
              <div className="type-caption text-muted-foreground mt-2 font-mono">
                Size: var(--type-label-size)
              </div>
            </div>
          </div>
        </section>

        {/* Font Weights - Warbler Display */}
        <section className="space-y-8">
          <h2 className="type-heading-2 text-foreground border-b border-border pb-2">
            Display Font Weights (Warbler Display)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="type-caption text-muted-foreground mb-2">Regular (400)</p>
              <p className="text-2xl" style={{fontFamily: 'var(--font-display)', fontWeight: 400}}>
                Warbler Display Regular
              </p>
            </div>
            <div>
              <p className="type-caption text-muted-foreground mb-2">Regular Italic (400)</p>
              <p className="text-2xl" style={{fontFamily: 'var(--font-display)', fontWeight: 400, fontStyle: 'italic'}}>
                Warbler Display Italic
              </p>
            </div>
            <div>
              <p className="type-caption text-muted-foreground mb-2">Bold (700)</p>
              <p className="text-2xl" style={{fontFamily: 'var(--font-display)', fontWeight: 700}}>
                Warbler Display Bold
              </p>
            </div>
            <div>
              <p className="type-caption text-muted-foreground mb-2">Bold Italic (700)</p>
              <p className="text-2xl" style={{fontFamily: 'var(--font-display)', fontWeight: 700, fontStyle: 'italic'}}>
                Warbler Display Bold Italic
              </p>
            </div>
          </div>
        </section>

        {/* Font Weights - Gotham Body */}
        <section className="space-y-8">
          <h2 className="type-heading-2 text-foreground border-b border-border pb-2">
            Body Font Weights (Gotham)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="type-caption text-muted-foreground mb-2">Light (300)</p>
              <p className="text-lg" style={{fontFamily: 'var(--font-body)', fontWeight: 300}}>
                Gotham Light for elegant body text
              </p>
            </div>
            <div>
              <p className="type-caption text-muted-foreground mb-2">Book (400)</p>
              <p className="text-lg" style={{fontFamily: 'var(--font-body)', fontWeight: 400}}>
                Gotham Book for standard reading
              </p>
            </div>
            <div>
              <p className="type-caption text-muted-foreground mb-2">Medium (500)</p>
              <p className="text-lg" style={{fontFamily: 'var(--font-body)', fontWeight: 500}}>
                Gotham Medium for emphasis
              </p>
            </div>
            <div>
              <p className="type-caption text-muted-foreground mb-2">Bold (700)</p>
              <p className="text-lg" style={{fontFamily: 'var(--font-body)', fontWeight: 700}}>
                Gotham Bold for strong emphasis
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}