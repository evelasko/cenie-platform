export default function TypographyPage() {
  return (
    <div className="min-h-screen bg-background py-12 px-8">
      <div className="mx-auto max-w-6xl space-y-16">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-heading-1 text-primary">CENIE Hub Typography</h1>
          <p className="text-subheader text-muted-foreground max-w-3xl mx-auto">
            Complete typography system with responsive Subframe classes and legacy compatibility
          </p>
          <div className="bg-muted rounded-lg p-6 text-left max-w-2xl mx-auto">
            <h3 className="text-heading-4 text-foreground mb-3">Usage Instructions</h3>
            <div className="text-body space-y-2 text-muted-foreground">
              <p><strong className="text-foreground">NEW:</strong> Use <code className="text-monospace-body bg-accent px-1 rounded">text-*</code> classes for all new components</p>
              <p><strong className="text-foreground">LEGACY:</strong> <code className="text-monospace-body bg-accent px-1 rounded">type-*</code> classes remain for backwards compatibility</p>
              <p><strong className="text-foreground">RESPONSIVE:</strong> All new classes scale smoothly from mobile to desktop</p>
            </div>
          </div>
        </div>

        {/* Main Headings - Primary */}
        <section className="space-y-8">
          <h2 className="text-heading-3 text-foreground border-b border-border pb-2">
            📝 Main Headings (Primary)
          </h2>
          <div className="space-y-8">
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-caption-small text-muted-foreground mb-3">text-heading-1</p>
              <h1 className="text-heading-1 text-foreground mb-4">The Future of Learning</h1>
              <div className="text-monospace-body text-muted-foreground bg-muted p-3 rounded text-sm">
                Max: 118px | Responsive: clamp(3.5rem, 8vw + 1rem, 7.375rem) | Weight: 400
              </div>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-caption-small text-muted-foreground mb-3">text-heading-2</p>
              <h2 className="text-heading-2 text-foreground mb-4">Innovation Hub Platform</h2>
              <div className="text-monospace-body text-muted-foreground bg-muted p-3 rounded text-sm">
                Max: 99px | Responsive: clamp(2.5rem, 6vw + 1rem, 6.1875rem) | Weight: 500
              </div>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-caption-small text-muted-foreground mb-3">text-heading-3</p>
              <h3 className="text-heading-3 text-foreground mb-4">Strategic Vision</h3>
              <div className="text-monospace-body text-muted-foreground bg-muted p-3 rounded text-sm">
                Max: 50px | Responsive: clamp(1.875rem, 4vw + 0.5rem, 3.125rem) | Weight: 400
              </div>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-caption-small text-muted-foreground mb-3">text-heading-4</p>
              <h4 className="text-heading-4 text-foreground mb-4">Implementation Focus</h4>
              <div className="text-monospace-body text-muted-foreground bg-muted p-3 rounded text-sm">
                Max: 22px | Responsive: clamp(1.25rem, 2.5vw + 0.25rem, 1.375rem) | Weight: 400
              </div>
            </div>
          </div>
        </section>

        {/* Display Text Variants */}
        <section className="space-y-8">
          <h2 className="text-heading-3 text-foreground border-b border-border pb-2">
            🎭 Display Text Variants
          </h2>
          <div className="space-y-8">
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-caption-small text-muted-foreground mb-3">text-display-text-extra-large</p>
              <h1 className="text-display-text-extra-large text-foreground mb-4">Extra Large Display</h1>
              <div className="text-monospace-body text-muted-foreground bg-muted p-3 rounded text-sm">
                Max: 62px | Responsive: clamp(2.25rem, 5vw + 0.5rem, 3.875rem) | Weight: 500
              </div>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-caption-small text-muted-foreground mb-3">text-display-text-large</p>
              <h2 className="text-display-text-large text-foreground mb-4">Large Display Text</h2>
              <div className="text-monospace-body text-muted-foreground bg-muted p-3 rounded text-sm">
                Max: 44px | Responsive: clamp(1.75rem, 3.5vw + 0.25rem, 2.75rem) | Weight: 500
              </div>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-caption-small text-muted-foreground mb-3">text-display-text-medium</p>
              <h3 className="text-display-text-medium text-foreground mb-4">Medium Display Text</h3>
              <div className="text-monospace-body text-muted-foreground bg-muted p-3 rounded text-sm">
                Max: 26px | Responsive: clamp(1.25rem, 2vw + 0.25rem, 1.625rem) | Weight: 400
              </div>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-caption-small text-muted-foreground mb-3">text-display-text-small</p>
              <h4 className="text-display-text-small text-foreground mb-4">Small Display Text</h4>
              <div className="text-monospace-body text-muted-foreground bg-muted p-3 rounded text-sm">
                Max: 22px | Responsive: clamp(1.125rem, 1.5vw + 0.125rem, 1.375rem) | Weight: 400
              </div>
            </div>
          </div>
        </section>

        {/* Body Text */}
        <section className="space-y-8">
          <h2 className="text-heading-3 text-foreground border-b border-border pb-2">
            📖 Body Text
          </h2>
          <div className="space-y-8">
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-caption-small text-muted-foreground mb-3">text-body-large</p>
              <p className="text-body-large text-foreground mb-4">
                Large body text is perfect for introductory paragraphs and important content that needs to stand out while maintaining excellent readability across all devices.
              </p>
              <div className="text-monospace-body text-muted-foreground bg-muted p-3 rounded text-sm">
                Max: 18px | Responsive: clamp(1.0625rem, 1.25vw + 0.125rem, 1.125rem) | Weight: 400
              </div>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-caption-small text-muted-foreground mb-3">text-body</p>
              <p className="text-body text-foreground mb-4">
                This is the standard body text size used throughout the platform. It provides optimal readability for extended reading sessions while maintaining a professional appearance that works well across different screen sizes and devices. Perfect for main content areas.
              </p>
              <div className="text-monospace-body text-muted-foreground bg-muted p-3 rounded text-sm">
                Max: 16px | Responsive: clamp(0.9375rem, 1vw + 0.125rem, 1rem) | Weight: 300
              </div>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-caption-small text-muted-foreground mb-3">text-body-small</p>
              <p className="text-body-small text-foreground mb-4">
                Small body text is used for secondary information, captions, and supporting content that complements the main text without competing for attention.
              </p>
              <div className="text-monospace-body text-muted-foreground bg-muted p-3 rounded text-sm">
                Max: 16px | Responsive: clamp(0.875rem, 0.75vw + 0.125rem, 1rem) | Weight: 400
              </div>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-caption-small text-muted-foreground mb-3">text-body-bold</p>
              <p className="text-body-bold text-foreground mb-4">
                Bold body text for emphasis and important information that needs to stand out.
              </p>
              <div className="text-monospace-body text-muted-foreground bg-muted p-3 rounded text-sm">
                Max: 14px | Responsive: clamp(0.8125rem, 0.75vw + 0.125rem, 0.875rem) | Weight: 600
              </div>
            </div>
          </div>
        </section>

        {/* Utility Text */}
        <section className="space-y-8">
          <h2 className="text-heading-3 text-foreground border-b border-border pb-2">
            🔧 Utility Text
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-caption-small text-muted-foreground mb-3">text-subheader</p>
              <p className="text-subheader text-foreground mb-4">Subheader text for sections</p>
              <div className="text-monospace-body text-muted-foreground bg-muted p-3 rounded text-xs">
                Max: 30px | Weight: 300
              </div>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-caption-small text-muted-foreground mb-3">text-overtitle</p>
              <p className="text-overtitle text-foreground mb-4">Overtitle Content</p>
              <div className="text-monospace-body text-muted-foreground bg-muted p-3 rounded text-xs">
                Max: 20px | Weight: 400
              </div>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-caption-small text-muted-foreground mb-3">text-subtitle</p>
              <p className="text-subtitle text-foreground mb-4">Subtitle information</p>
              <div className="text-monospace-body text-muted-foreground bg-muted p-3 rounded text-xs">
                Max: 14px | Weight: 400
              </div>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-caption-small text-muted-foreground mb-3">text-overline</p>
              <p className="text-overline text-muted-foreground mb-4">SECTION OVERLINE</p>
              <div className="text-monospace-body text-muted-foreground bg-muted p-3 rounded text-xs">
                Max: 16px | Weight: 400 | Uppercase
              </div>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-caption-small text-muted-foreground mb-3">text-caption</p>
              <p className="text-caption text-foreground mb-4">Caption and metadata text</p>
              <div className="text-monospace-body text-muted-foreground bg-muted p-3 rounded text-xs">
                Max: 30px | Weight: 400
              </div>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-caption-small text-muted-foreground mb-3">text-caption-small</p>
              <p className="text-caption-small text-muted-foreground mb-4">Small caption text</p>
              <div className="text-monospace-body text-muted-foreground bg-muted p-3 rounded text-xs">
                Max: 12px | Weight: 300
              </div>
            </div>
          </div>
        </section>

        {/* Button Text */}
        <section className="space-y-8">
          <h2 className="text-heading-3 text-foreground border-b border-border pb-2">
            🔘 Button Text
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-caption-small text-muted-foreground mb-3">text-button-large</p>
              <p className="text-button-large text-foreground mb-4">Large Button Text</p>
              <div className="text-monospace-body text-muted-foreground bg-muted p-3 rounded text-xs">
                Max: 22px | Weight: 400
              </div>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-caption-small text-muted-foreground mb-3">text-button-medium</p>
              <p className="text-button-medium text-foreground mb-4">Medium Button</p>
              <div className="text-monospace-body text-muted-foreground bg-muted p-3 rounded text-xs">
                Max: 16px | Weight: 500
              </div>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-caption-small text-muted-foreground mb-3">text-button-small</p>
              <p className="text-button-small text-foreground mb-4">Small Button</p>
              <div className="text-monospace-body text-muted-foreground bg-muted p-3 rounded text-xs">
                Max: 12px | Weight: 400
              </div>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-caption-small text-muted-foreground mb-3">text-text-button</p>
              <p className="text-text-button text-primary mb-4">Text Button Link</p>
              <div className="text-monospace-body text-muted-foreground bg-muted p-3 rounded text-xs">
                Max: 20px | Weight: 400
              </div>
            </div>
          </div>
        </section>

        {/* Monospace */}
        <section className="space-y-8">
          <h2 className="text-heading-3 text-foreground border-b border-border pb-2">
            💻 Monospace
          </h2>
          <div className="bg-card border border-border rounded-lg p-6">
            <p className="text-caption-small text-muted-foreground mb-3">text-monospace-body</p>
            <p className="text-monospace-body text-foreground mb-4">
              const typography = &quot;monospace code text&quot;;
            </p>
            <div className="text-monospace-body text-muted-foreground bg-muted p-3 rounded text-xs">
              Max: 14px | Font: Aglet Mono | Weight: 400
            </div>
          </div>
        </section>

        {/* Font Weights Showcase */}
        <section className="space-y-8">
          <h2 className="text-heading-3 text-foreground border-b border-border pb-2">
            ⚖️ Gotham Font Weights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-caption-small text-muted-foreground mb-2">Light (300)</p>
              <p className="text-2xl" style={{fontFamily: 'var(--font-body)', fontWeight: 300}}>
                Gotham Light
              </p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-caption-small text-muted-foreground mb-2">Book (400)</p>
              <p className="text-2xl" style={{fontFamily: 'var(--font-body)', fontWeight: 400}}>
                Gotham Book
              </p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-caption-small text-muted-foreground mb-2">Medium (500)</p>
              <p className="text-2xl" style={{fontFamily: 'var(--font-body)', fontWeight: 500}}>
                Gotham Medium
              </p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-caption-small text-muted-foreground mb-2">Bold (700)</p>
              <p className="text-2xl" style={{fontFamily: 'var(--font-body)', fontWeight: 700}}>
                Gotham Bold
              </p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-caption-small text-muted-foreground mb-2">Black (800)</p>
              <p className="text-2xl" style={{fontFamily: 'var(--font-body)', fontWeight: 800}}>
                Gotham Black
              </p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-caption-small text-muted-foreground mb-2">Ultra (900)</p>
              <p className="text-2xl" style={{fontFamily: 'var(--font-body)', fontWeight: 900}}>
                Gotham Ultra
              </p>
            </div>
          </div>
        </section>

        {/* Color Palette */}
        <section className="space-y-8">
          <h2 className="text-heading-3 text-foreground border-b border-border pb-2">
            🎨 Color Palette
          </h2>
          <div className="space-y-6">
            {/* Brand Colors */}
            <div>
              <h3 className="text-heading-4 text-foreground mb-4">Brand Colors</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-card border border-border rounded-lg p-4">
                  <div className="w-full h-12 rounded mb-2" style={{backgroundColor: 'rgb(247, 104, 8)'}}></div>
                  <p className="text-caption-small text-muted-foreground">Primary</p>
                  <p className="text-monospace-body text-xs">rgb(247, 104, 8)</p>
                </div>
                <div className="bg-card border border-border rounded-lg p-4">
                  <div className="w-full h-12 rounded mb-2" style={{backgroundColor: 'rgb(148, 62, 0)'}}></div>
                  <p className="text-caption-small text-muted-foreground">Brand 500</p>
                  <p className="text-monospace-body text-xs">rgb(148, 62, 0)</p>
                </div>
                <div className="bg-card border border-border rounded-lg p-4">
                  <div className="w-full h-12 rounded mb-2" style={{backgroundColor: 'rgb(255, 128, 43)'}}></div>
                  <p className="text-caption-small text-muted-foreground">Brand 700</p>
                  <p className="text-monospace-body text-xs">rgb(255, 128, 43)</p>
                </div>
                <div className="bg-card border border-border rounded-lg p-4">
                  <div className="w-full h-12 rounded mb-2" style={{backgroundColor: 'rgb(255, 139, 62)'}}></div>
                  <p className="text-caption-small text-muted-foreground">Brand 800</p>
                  <p className="text-monospace-body text-xs">rgb(255, 139, 62)</p>
                </div>
                <div className="bg-card border border-border rounded-lg p-4">
                  <div className="w-full h-12 rounded mb-2" style={{backgroundColor: 'rgb(254, 234, 221)'}}></div>
                  <p className="text-caption-small text-muted-foreground">Brand 900</p>
                  <p className="text-monospace-body text-xs">rgb(254, 234, 221)</p>
                </div>
              </div>
            </div>
            
            {/* Status Colors */}
            <div>
              <h3 className="text-heading-4 text-foreground mb-4">Status Colors</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-card border border-border rounded-lg p-4">
                  <div className="w-full h-12 rounded mb-2" style={{backgroundColor: 'rgb(233, 61, 130)'}}></div>
                  <p className="text-caption-small text-muted-foreground">Error</p>
                  <p className="text-monospace-body text-xs">rgb(233, 61, 130)</p>
                </div>
                <div className="bg-card border border-border rounded-lg p-4">
                  <div className="w-full h-12 rounded mb-2" style={{backgroundColor: 'rgb(255, 178, 36)'}}></div>
                  <p className="text-caption-small text-muted-foreground">Warning</p>
                  <p className="text-monospace-body text-xs">rgb(255, 178, 36)</p>
                </div>
                <div className="bg-card border border-border rounded-lg p-4">
                  <div className="w-full h-12 rounded mb-2" style={{backgroundColor: 'rgb(70, 167, 88)'}}></div>
                  <p className="text-caption-small text-muted-foreground">Success</p>
                  <p className="text-monospace-body text-xs">rgb(70, 167, 88)</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Legacy Classes - Backwards Compatibility */}
        <section className="space-y-8 border-t border-border pt-8">
          <div className="bg-muted rounded-lg p-6">
            <h2 className="text-heading-3 text-foreground mb-4">
              🔄 Legacy Classes (Backwards Compatibility)
            </h2>
            <p className="text-body text-muted-foreground mb-4">
              These classes remain available for existing components. Gradually migrate to the new <code className="text-monospace-body bg-accent px-1 rounded">text-*</code> classes above.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-sm">
              <div>
                <h4 className="text-body-bold text-foreground mb-2">Display</h4>
                <div className="space-y-1 text-caption text-muted-foreground">
                  <p><code>.type-display-1</code></p>
                  <p><code>.type-display-2</code></p>
                </div>
              </div>
              <div>
                <h4 className="text-body-bold text-foreground mb-2">Headings</h4>
                <div className="space-y-1 text-caption text-muted-foreground">
                  <p><code>.type-heading-1</code></p>
                  <p><code>.type-heading-2</code></p>
                  <p><code>.type-heading-3</code></p>
                  <p><code>.type-heading-4</code></p>
                  <p><code>.type-heading-5</code></p>
                  <p><code>.type-heading-6</code></p>
                </div>
              </div>
              <div>
                <h4 className="text-body-bold text-foreground mb-2">Body</h4>
                <div className="space-y-1 text-caption text-muted-foreground">
                  <p><code>.type-body-large</code></p>
                  <p><code>.type-body-base</code></p>
                  <p><code>.type-body-small</code></p>
                </div>
              </div>
              <div>
                <h4 className="text-body-bold text-foreground mb-2">Utility</h4>
                <div className="space-y-1 text-caption text-muted-foreground">
                  <p><code>.type-lead</code></p>
                  <p><code>.type-caption</code></p>
                  <p><code>.type-overline</code></p>
                  <p><code>.type-button</code></p>
                  <p><code>.type-link</code></p>
                  <p><code>.type-quote</code></p>
                  <p><code>.type-label</code></p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}