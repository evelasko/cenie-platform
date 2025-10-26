import { clsx } from 'clsx'
import { TYPOGRAPHY } from '../../lib/typography'

export default function TypographyPage() {
  return (
    <div className="min-h-screen bg-background py-12 px-8">
      <div className="mx-auto max-w-6xl space-y-16">
        {/* Header */}
        <div className="text-center">
          <h1 className={clsx(TYPOGRAPHY.display1, 'text-primary mb-4')}>Academy Typography</h1>
          <p className={clsx(TYPOGRAPHY.lead, 'text-muted-foreground')}>
            Geist font family — inspired by Trifecta creative agency
          </p>
        </div>

        {/* Usage Documentation */}
        <section className="space-y-6 border border-border rounded-lg p-8 bg-muted/30">
          <h2 className={clsx(TYPOGRAPHY.h2, 'text-foreground')}>Using Typography Constants</h2>
          <div className="space-y-4">
            <p className={clsx(TYPOGRAPHY.bodyBase, 'text-foreground')}>
              The Academy typography system provides a{' '}
              <code className="px-2 py-1 bg-muted rounded text-sm font-mono">TYPOGRAPHY</code>{' '}
              constant for better developer experience with Trifecta&apos;s bold, modern aesthetic.
            </p>

            <div className="space-y-3">
              <p className={clsx(TYPOGRAPHY.label, 'text-foreground')}>Import the constant:</p>
              <pre className="bg-foreground/5 border border-border rounded-lg p-4 overflow-x-auto">
                <code className="text-sm font-mono text-foreground">
                  {`import { clsx } from 'clsx';
import { TYPOGRAPHY } from '@/lib/typography';`}
                </code>
              </pre>
            </div>

            <div className="space-y-3">
              <p className={clsx(TYPOGRAPHY.label, 'text-foreground')}>
                Use with clsx for combining classes:
              </p>
              <pre className="bg-foreground/5 border border-border rounded-lg p-4 overflow-x-auto">
                <code className="text-sm font-mono text-foreground">
                  {`<h1 className={clsx(TYPOGRAPHY.hero, "text-center")}>
  Dream Big
</h1>

<p className={clsx(TYPOGRAPHY.bodyLarge, "max-w-prose")}>
  Course description...
</p>`}
                </code>
              </pre>
            </div>

            <div className="space-y-3">
              <p className={clsx(TYPOGRAPHY.label, 'text-foreground')}>
                Available typography keys:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  'hero',
                  'display1',
                  'display2',
                  'h1',
                  'h2',
                  'h3',
                  'h4',
                  'h5',
                  'h6',
                  'bodyXlarge',
                  'bodyLarge',
                  'bodyBase',
                  'bodySmall',
                  'bodyTiny',
                  'lead',
                  'brand',
                  'nav',
                  'caption',
                  'label',
                  'button',
                  'link',
                  'counter',
                  'stat',
                  'price',
                ].map((key) => (
                  <code
                    key={key}
                    className="px-2 py-1 bg-primary/10 border border-primary/20 rounded text-xs font-mono"
                  >
                    {key}
                  </code>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Hero/Display Styles */}
        <section className="space-y-8">
          <h2 className={clsx(TYPOGRAPHY.h2, 'text-foreground border-b border-border pb-2')}>
            Hero & Display Styles
          </h2>
          <div className="space-y-8">
            <div className="border border-border rounded-lg p-6 bg-card">
              <p className={clsx(TYPOGRAPHY.caption, 'mb-3')}>Hero — Massive Impact Headings</p>
              <h1 className={clsx(TYPOGRAPHY.hero, 'text-foreground')}>Dream /Big.</h1>
              <div className={clsx(TYPOGRAPHY.caption, 'mt-3 font-mono')}>
                Font: Geist | Size: clamp(3rem, 10vw + 2rem, 8.955rem) | Weight: 600 | Tracking:
                -0.06em
              </div>
              <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground mt-3')}>
                <strong className="text-foreground">Use for:</strong> Landing page hero headings,
                main value propositions, maximum visual impact statements
              </p>
            </div>
            <div className="border border-border rounded-lg p-6 bg-card">
              <p className={clsx(TYPOGRAPHY.caption, 'mb-3')}>Display 1 — Giant Stat Numbers</p>
              <h1 className={clsx(TYPOGRAPHY.display1, 'text-foreground')}>/95</h1>
              <div className={clsx(TYPOGRAPHY.caption, 'mt-3 font-mono')}>
                Font: Geist | Size: clamp(2.5rem, 6vw + 1.5rem, 8.875rem) | Weight: 600 | Tracking:
                -0.06em
              </div>
              <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground mt-3')}>
                <strong className="text-foreground">Use for:</strong> Large statistics, metrics,
                achievement numbers, data visualization emphasis
              </p>
            </div>
            <div className="border border-border rounded-lg p-6 bg-card">
              <p className={clsx(TYPOGRAPHY.caption, 'mb-3')}>Display 2 — Section Headings</p>
              <h1 className={clsx(TYPOGRAPHY.display2, 'text-foreground')}>/Services</h1>
              <div className={clsx(TYPOGRAPHY.caption, 'mt-3 font-mono')}>
                Font: Geist | Size: clamp(2rem, 4vw + 1rem, 3.375rem) | Weight: 600 | Tracking:
                -0.06em
              </div>
              <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground mt-3')}>
                <strong className="text-foreground">Use for:</strong> Major section titles, category
                headers, prominent announcements
              </p>
            </div>
          </div>
        </section>

        {/* Heading Hierarchy */}
        <section className="space-y-8">
          <h2 className={clsx(TYPOGRAPHY.h2, 'text-foreground border-b border-border pb-2')}>
            Heading Hierarchy
          </h2>
          <div className="space-y-6">
            <div className="border border-border rounded-lg p-6 bg-card">
              <p className={clsx(TYPOGRAPHY.caption, 'mb-2')}>H1 — Page Sections</p>
              <h1 className={clsx(TYPOGRAPHY.h1, 'text-foreground')}>
                How we guide every /project
              </h1>
              <div className={clsx(TYPOGRAPHY.caption, 'mt-2 font-mono')}>
                Geist | clamp(2rem, 3vw + 1rem, 2.5rem) | Weight: 600 | Tracking: -0.06em
              </div>
              <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground mt-3')}>
                <strong className="text-foreground">Use for:</strong> Main page sections, primary
                content areas, important announcements
              </p>
            </div>
            <div className="border border-border rounded-lg p-6 bg-card">
              <p className={clsx(TYPOGRAPHY.caption, 'mb-2')}>H2 — Subsections</p>
              <h2 className={clsx(TYPOGRAPHY.h2, 'text-foreground')}>
                From captivating website design
              </h2>
              <div className={clsx(TYPOGRAPHY.caption, 'mt-2 font-mono')}>
                Geist | clamp(1.5rem, 2vw + 0.75rem, 2rem) | Weight: 600 | Tracking: -0.05em
              </div>
              <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground mt-3')}>
                <strong className="text-foreground">Use for:</strong> Secondary sections, subsection
                titles, feature descriptions
              </p>
            </div>
            <div className="border border-border rounded-lg p-6 bg-card">
              <p className={clsx(TYPOGRAPHY.caption, 'mb-2')}>H3 — Card/Component Titles</p>
              <h3 className={clsx(TYPOGRAPHY.h3, 'text-foreground')}>/Development</h3>
              <div className={clsx(TYPOGRAPHY.caption, 'mt-2 font-mono')}>
                Geist | clamp(1.25rem, 1.5vw + 0.625rem, 1.5rem) | Weight: 500 | Tracking: -0.04em
              </div>
              <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground mt-3')}>
                <strong className="text-foreground">Use for:</strong> Service card titles, component
                headings, module names
              </p>
            </div>
            <div className="border border-border rounded-lg p-6 bg-card">
              <p className={clsx(TYPOGRAPHY.caption, 'mb-2')}>H4 — Minor Headings</p>
              <h4 className={clsx(TYPOGRAPHY.h4, 'text-foreground')}>/Essentials Package</h4>
              <div className={clsx(TYPOGRAPHY.caption, 'mt-2 font-mono')}>
                Geist | clamp(1.0625rem, 1vw + 0.5rem, 1.25rem) | Weight: 500 | Tracking: -0.04em
              </div>
              <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground mt-3')}>
                <strong className="text-foreground">Use for:</strong> Pricing package titles,
                content groupings, list section headers
              </p>
            </div>
            <div className="border border-border rounded-lg p-6 bg-card">
              <p className={clsx(TYPOGRAPHY.caption, 'mb-2')}>H5 — Small Headings</p>
              <h5 className={clsx(TYPOGRAPHY.h5, 'text-foreground')}>/Euphoria.</h5>
              <div className={clsx(TYPOGRAPHY.caption, 'mt-2 font-mono')}>
                Geist | clamp(0.9375rem, 0.75vw + 0.5rem, 1.0625rem) | Weight: 500 | Tracking:
                -0.03em
              </div>
              <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground mt-3')}>
                <strong className="text-foreground">Use for:</strong> Project names, portfolio
                items, case study titles
              </p>
            </div>
            <div className="border border-border rounded-lg p-6 bg-card">
              <p className={clsx(TYPOGRAPHY.caption, 'mb-2')}>H6 — Micro Headings</p>
              <h6 className={clsx(TYPOGRAPHY.h6, 'text-foreground')}>/Discovery</h6>
              <div className={clsx(TYPOGRAPHY.caption, 'mt-2 font-mono')}>
                Geist | clamp(0.875rem, 0.5vw + 0.5rem, 0.9375rem) | Weight: 600 | Tracking: -0.02em
              </div>
              <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground mt-3')}>
                <strong className="text-foreground">Use for:</strong> Process steps, workflow
                phases, small section identifiers
              </p>
            </div>
          </div>
        </section>

        {/* Body Text Styles */}
        <section className="space-y-8">
          <h2 className={clsx(TYPOGRAPHY.h2, 'text-foreground border-b border-border pb-2')}>
            Body Text Styles
          </h2>
          <div className="space-y-6">
            <div className="border border-border rounded-lg p-6 bg-card">
              <p className={clsx(TYPOGRAPHY.caption, 'mb-2')}>
                Body XLarge — Feature Introductions
              </p>
              <p className={clsx(TYPOGRAPHY.bodyXlarge, 'text-foreground')}>
                From captivating website design and development to performance-driven digital
                marketing, we offer end-to-end services.
              </p>
              <div className={clsx(TYPOGRAPHY.caption, 'mt-2 font-mono')}>
                Geist | clamp(1.25rem, 1.5vw + 0.75rem, 1.5rem) | Weight: 500 | Tracking: -0.04em
              </div>
              <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground mt-3')}>
                <strong className="text-foreground">Use for:</strong> Feature introductions,
                prominent descriptions, emphasized paragraphs
              </p>
            </div>
            <div className="border border-border rounded-lg p-6 bg-card">
              <p className={clsx(TYPOGRAPHY.caption, 'mb-2')}>Body Large — Taglines & Intro Text</p>
              <p className={clsx(TYPOGRAPHY.bodyLarge, 'text-foreground')}>
                We build websites, apps & campaigns that actually move the needle for growing
                brands.
              </p>
              <div className={clsx(TYPOGRAPHY.caption, 'mt-2 font-mono')}>
                Geist | clamp(1rem, 0.75vw + 0.625rem, 1.0625rem) | Weight: 500 | Tracking: -0.04em
              </div>
              <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground mt-3')}>
                <strong className="text-foreground">Use for:</strong> Hero taglines, value
                propositions, opening statements
              </p>
            </div>
            <div className="border border-border rounded-lg p-6 bg-card">
              <p className={clsx(TYPOGRAPHY.caption, 'mb-2')}>Body Base — Main Content</p>
              <p className={clsx(TYPOGRAPHY.bodyBase, 'text-foreground')}>
                We build fast, flexible and future-ready sites and apps. Nothing bloated, nothing
                messy. Our cross-functional teams collaborate to deliver exceptional results across
                all digital touchpoints.
              </p>
              <div className={clsx(TYPOGRAPHY.caption, 'mt-2 font-mono')}>
                Geist | clamp(0.875rem, 0.5vw + 0.5rem, 0.9375rem) | Weight: 500 | Tracking: -0.03em
              </div>
              <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground mt-3')}>
                <strong className="text-foreground">Use for:</strong> Service descriptions, main
                paragraphs, general content (default body text)
              </p>
            </div>
            <div className="border border-border rounded-lg p-6 bg-card">
              <p className={clsx(TYPOGRAPHY.caption, 'mb-2')}>Body Small — Supporting Details</p>
              <p className={clsx(TYPOGRAPHY.bodySmall, 'text-foreground')}>
                Startups, one-person businesses, landing pages, MVPs — perfect for getting started
                quickly.
              </p>
              <div className={clsx(TYPOGRAPHY.caption, 'mt-2 font-mono')}>
                Geist | clamp(0.8125rem, 0.25vw + 0.75rem, 0.875rem) | Weight: 500 | Tracking:
                -0.03em
              </div>
              <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground mt-3')}>
                <strong className="text-foreground">Use for:</strong> Package descriptions, list
                items, supplementary information
              </p>
            </div>
            <div className="border border-border rounded-lg p-6 bg-card">
              <p className={clsx(TYPOGRAPHY.caption, 'mb-2')}>Body Tiny — Fine Print & Metadata</p>
              <p className={clsx(TYPOGRAPHY.bodyTiny, 'text-foreground')}>
                Local time: October 26, 05:43 AM
              </p>
              <div className={clsx(TYPOGRAPHY.caption, 'mt-2 font-mono')}>
                Geist | clamp(0.6875rem, 0.25vw + 0.5rem, 0.75rem) | Weight: 600 | Tracking: -0.03em
              </div>
              <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground mt-3')}>
                <strong className="text-foreground">Use for:</strong> Timestamps, fine print,
                technical details, micro-copy
              </p>
            </div>
          </div>
        </section>

        {/* Specialized Trifecta Styles */}
        <section className="space-y-8">
          <h2 className={clsx(TYPOGRAPHY.h2, 'text-foreground border-b border-border pb-2')}>
            Specialized Agency Styles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-border rounded-lg p-6 bg-card">
              <p className={clsx(TYPOGRAPHY.caption, 'mb-2')}>Stat Numbers</p>
              <p className={clsx(TYPOGRAPHY.stat, 'text-foreground')}>/95</p>
              <div className={clsx(TYPOGRAPHY.caption, 'mt-2 font-mono')}>
                clamp(3rem, 8vw + 1.5rem, 8.875rem) | Weight: 600
              </div>
              <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground mt-3')}>
                <strong className="text-foreground">Use for:</strong> Achievement numbers, client
                counts, project totals, KPIs
              </p>
            </div>
            <div className="border border-border rounded-lg p-6 bg-card">
              <p className={clsx(TYPOGRAPHY.caption, 'mb-2')}>Price Display</p>
              <p className={clsx(TYPOGRAPHY.price, 'text-foreground')}>$2,490</p>
              <div className={clsx(TYPOGRAPHY.caption, 'mt-2 font-mono')}>
                clamp(1.25rem, 1vw + 0.75rem, 1.5rem) | Weight: 600
              </div>
              <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground mt-3')}>
                <strong className="text-foreground">Use for:</strong> Pricing amounts, cost
                displays, financial figures
              </p>
            </div>
            <div className="border border-border rounded-lg p-6 bg-card">
              <p className={clsx(TYPOGRAPHY.caption, 'mb-2')}>Brand Mark</p>
              <p className={clsx(TYPOGRAPHY.brand, 'text-foreground')}>(t)rifecta®</p>
              <div className={clsx(TYPOGRAPHY.caption, 'mt-2 font-mono')}>
                clamp(1.125rem, 0.75vw + 0.75rem, 1.25rem) | Weight: 600
              </div>
              <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground mt-3')}>
                <strong className="text-foreground">Use for:</strong> Brand logos, company names in
                navigation, trademark text
              </p>
            </div>
            <div className="border border-border rounded-lg p-6 bg-card">
              <p className={clsx(TYPOGRAPHY.caption, 'mb-2')}>Navigation Links</p>
              <p className={clsx(TYPOGRAPHY.nav, 'text-foreground')}>/Home</p>
              <div className={clsx(TYPOGRAPHY.caption, 'mt-2 font-mono')}>
                clamp(0.875rem, 0.25vw + 0.75rem, 0.9375rem) | Weight: 600
              </div>
              <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground mt-3')}>
                <strong className="text-foreground">Use for:</strong> Main navigation menu items,
                header links, footer navigation
              </p>
            </div>
            <div className="border border-border rounded-lg p-6 bg-card">
              <p className={clsx(TYPOGRAPHY.caption, 'mb-2')}>Counter/Index</p>
              <p className={clsx(TYPOGRAPHY.counter, 'text-foreground')}>/001/</p>
              <div className={clsx(TYPOGRAPHY.caption, 'mt-2 font-mono')}>
                clamp(0.625rem, 0.125vw + 0.5625rem, 0.6875rem) | Weight: 600
              </div>
              <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground mt-3')}>
                <strong className="text-foreground">Use for:</strong> Decorative numbering, step
                indicators, list indexes, process counters
              </p>
            </div>
            <div className="border border-border rounded-lg p-6 bg-card">
              <p className={clsx(TYPOGRAPHY.caption, 'mb-2')}>Lead Text</p>
              <p className={clsx(TYPOGRAPHY.lead, 'text-foreground')}>
                Introduction to courses and features
              </p>
              <div className={clsx(TYPOGRAPHY.caption, 'mt-2 font-mono')}>
                clamp(1rem, 0.75vw + 0.625rem, 1.0625rem) | Weight: 500
              </div>
              <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground mt-3')}>
                <strong className="text-foreground">Use for:</strong> Article/course introductions,
                lead paragraphs, section openings
              </p>
            </div>
          </div>
        </section>

        {/* UI Elements */}
        <section className="space-y-8">
          <h2 className={clsx(TYPOGRAPHY.h2, 'text-foreground border-b border-border pb-2')}>
            UI Elements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-border rounded-lg p-6 bg-card">
              <p className={clsx(TYPOGRAPHY.caption, 'mb-2')}>Button Text</p>
              <p className={clsx(TYPOGRAPHY.button, 'text-foreground')}>Get started</p>
              <div className={clsx(TYPOGRAPHY.caption, 'mt-2 font-mono')}>
                clamp(0.875rem, 0.25vw + 0.75rem, 0.9375rem) | Weight: 600 | LH: 0.9
              </div>
              <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground mt-3')}>
                <strong className="text-foreground">Use for:</strong> CTA buttons, action labels,
                form submit text
              </p>
            </div>
            <div className="border border-border rounded-lg p-6 bg-card">
              <p className={clsx(TYPOGRAPHY.caption, 'mb-2')}>Link Text</p>
              <p className={clsx(TYPOGRAPHY.link, 'text-primary hover:opacity-70')}>About us</p>
              <div className={clsx(TYPOGRAPHY.caption, 'mt-2 font-mono')}>
                Weight: 500 | Decoration: none (hover: opacity 0.7)
              </div>
              <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground mt-3')}>
                <strong className="text-foreground">Use for:</strong> Text links, inline anchors,
                navigation CTAs
              </p>
            </div>
            <div className="border border-border rounded-lg p-6 bg-card">
              <p className={clsx(TYPOGRAPHY.caption, 'mb-2')}>Caption</p>
              <p className={TYPOGRAPHY.caption}>Photography credits and metadata</p>
              <div className={clsx(TYPOGRAPHY.caption, 'mt-2 font-mono')}>
                clamp(0.75rem, 0.25vw + 0.6875rem, 0.8125rem) | Weight: 500
              </div>
              <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground mt-3')}>
                <strong className="text-foreground">Use for:</strong> Image captions, author
                credits, metadata, help text
              </p>
            </div>
            <div className="border border-border rounded-lg p-6 bg-card">
              <p className={clsx(TYPOGRAPHY.caption, 'mb-2')}>Label</p>
              <p className={clsx(TYPOGRAPHY.label, 'text-foreground')}>Timeline:</p>
              <div className={clsx(TYPOGRAPHY.caption, 'mt-2 font-mono')}>
                clamp(0.8125rem, 0.25vw + 0.6875rem, 0.875rem) | Weight: 500
              </div>
              <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground mt-3')}>
                <strong className="text-foreground">Use for:</strong> Form labels, field names, data
                attribute labels
              </p>
            </div>
          </div>
        </section>

        {/* Font Weights */}
        <section className="space-y-8">
          <h2 className={clsx(TYPOGRAPHY.h2, 'text-foreground border-b border-border pb-2')}>
            Geist Font Weights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className={clsx(TYPOGRAPHY.caption, 'mb-2')}>Medium (500) — Primary Body Weight</p>
              <p className="text-2xl" style={{ fontFamily: 'var(--font-body)', fontWeight: 500 }}>
                Geist Medium for body text and descriptions
              </p>
            </div>
            <div>
              <p className={clsx(TYPOGRAPHY.caption, 'mb-2')}>
                Semi-Bold (600) — Headings & Emphasis
              </p>
              <p className="text-2xl" style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}>
                Geist Semi-Bold for headings and navigation
              </p>
            </div>
          </div>
        </section>

        {/* Real-World Example */}
        <section className="space-y-8">
          <h2 className={clsx(TYPOGRAPHY.h2, 'text-foreground border-b border-border pb-2')}>
            Trifecta-Style Component
          </h2>
          <div className="border border-border rounded-xl p-8 space-y-6 bg-card">
            <div className="flex items-center justify-between">
              <p className={clsx(TYPOGRAPHY.counter, 'text-muted-foreground')}>/001/</p>
              <p className={clsx(TYPOGRAPHY.label, 'text-muted-foreground')}>2018-25©</p>
            </div>

            <h3 className={clsx(TYPOGRAPHY.h3, 'text-foreground')}>/Development</h3>

            <p className={clsx(TYPOGRAPHY.bodyBase, 'text-foreground')}>
              We build fast, flexible and future-ready sites and apps. Nothing bloated, nothing
              messy.
            </p>

            <div className="flex items-center gap-4 pt-4">
              <p className={clsx(TYPOGRAPHY.price, 'text-primary')}>$2,490</p>
              <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground')}>/project</p>
            </div>

            <div className="space-y-2 pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <p className={clsx(TYPOGRAPHY.label, 'text-foreground')}>Timeline:</p>
                <p className={clsx(TYPOGRAPHY.bodySmall, 'text-foreground')}>2–3 weeks</p>
              </div>
              <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground')}>
                4–8 custom-designed pages with full responsive design
              </p>
            </div>

            <div className="pt-4">
              <p
                className={clsx(
                  TYPOGRAPHY.button,
                  'inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg'
                )}
              >
                Get started
              </p>
            </div>
          </div>
        </section>

        {/* Typography Scale Reference */}
        <section className="space-y-6 border border-border rounded-lg p-8 bg-card">
          <h2 className={clsx(TYPOGRAPHY.h2, 'text-foreground mb-6')}>
            Complete Typography Scale Reference
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-border">
                  <th className={clsx(TYPOGRAPHY.label, 'text-left py-3 px-2')}>Style</th>
                  <th className={clsx(TYPOGRAPHY.label, 'text-left py-3 px-2')}>Constant</th>
                  <th className={clsx(TYPOGRAPHY.label, 'text-left py-3 px-2')}>Desktop</th>
                  <th className={clsx(TYPOGRAPHY.label, 'text-left py-3 px-2')}>Weight</th>
                  <th className={clsx(TYPOGRAPHY.label, 'text-left py-3 px-2')}>Use Case</th>
                </tr>
              </thead>
              <tbody className={TYPOGRAPHY.bodySmall}>
                <tr className="border-b border-border">
                  <td className="py-3 px-2 font-semibold">Hero</td>
                  <td className="py-3 px-2 font-mono text-primary">TYPOGRAPHY.hero</td>
                  <td className="py-3 px-2">143px</td>
                  <td className="py-3 px-2">600</td>
                  <td className="py-3 px-2">Massive impact headings</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-3 px-2 font-semibold">Display 1</td>
                  <td className="py-3 px-2 font-mono text-primary">TYPOGRAPHY.display1</td>
                  <td className="py-3 px-2">142px</td>
                  <td className="py-3 px-2">600</td>
                  <td className="py-3 px-2">Giant stat numbers</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-3 px-2 font-semibold">Display 2</td>
                  <td className="py-3 px-2 font-mono text-primary">TYPOGRAPHY.display2</td>
                  <td className="py-3 px-2">54px</td>
                  <td className="py-3 px-2">600</td>
                  <td className="py-3 px-2">Section headings</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-3 px-2 font-semibold">H1</td>
                  <td className="py-3 px-2 font-mono text-primary">TYPOGRAPHY.h1</td>
                  <td className="py-3 px-2">40px</td>
                  <td className="py-3 px-2">600</td>
                  <td className="py-3 px-2">Page sections</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-3 px-2 font-semibold">H2</td>
                  <td className="py-3 px-2 font-mono text-primary">TYPOGRAPHY.h2</td>
                  <td className="py-3 px-2">32px</td>
                  <td className="py-3 px-2">600</td>
                  <td className="py-3 px-2">Subsections</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-3 px-2 font-semibold">H3</td>
                  <td className="py-3 px-2 font-mono text-primary">TYPOGRAPHY.h3</td>
                  <td className="py-3 px-2">24px</td>
                  <td className="py-3 px-2">500</td>
                  <td className="py-3 px-2">Card titles</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-3 px-2 font-semibold">H4</td>
                  <td className="py-3 px-2 font-mono text-primary">TYPOGRAPHY.h4</td>
                  <td className="py-3 px-2">20px</td>
                  <td className="py-3 px-2">500</td>
                  <td className="py-3 px-2">Minor headings</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-3 px-2 font-semibold">H5</td>
                  <td className="py-3 px-2 font-mono text-primary">TYPOGRAPHY.h5</td>
                  <td className="py-3 px-2">17px</td>
                  <td className="py-3 px-2">500</td>
                  <td className="py-3 px-2">Small headings</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-3 px-2 font-semibold">H6</td>
                  <td className="py-3 px-2 font-mono text-primary">TYPOGRAPHY.h6</td>
                  <td className="py-3 px-2">15px</td>
                  <td className="py-3 px-2">600</td>
                  <td className="py-3 px-2">Micro headings</td>
                </tr>
                <tr className="border-b border-border bg-muted/30">
                  <td className="py-3 px-2 font-semibold">Body XL</td>
                  <td className="py-3 px-2 font-mono text-primary">TYPOGRAPHY.bodyXlarge</td>
                  <td className="py-3 px-2">24px</td>
                  <td className="py-3 px-2">500</td>
                  <td className="py-3 px-2">Feature intros</td>
                </tr>
                <tr className="border-b border-border bg-muted/30">
                  <td className="py-3 px-2 font-semibold">Body L</td>
                  <td className="py-3 px-2 font-mono text-primary">TYPOGRAPHY.bodyLarge</td>
                  <td className="py-3 px-2">17px</td>
                  <td className="py-3 px-2">500</td>
                  <td className="py-3 px-2">Taglines & intro text</td>
                </tr>
                <tr className="border-b border-border bg-muted/30">
                  <td className="py-3 px-2 font-semibold">Body Base</td>
                  <td className="py-3 px-2 font-mono text-primary">TYPOGRAPHY.bodyBase</td>
                  <td className="py-3 px-2">15px</td>
                  <td className="py-3 px-2">500</td>
                  <td className="py-3 px-2">Main content (default)</td>
                </tr>
                <tr className="border-b border-border bg-muted/30">
                  <td className="py-3 px-2 font-semibold">Body Small</td>
                  <td className="py-3 px-2 font-mono text-primary">TYPOGRAPHY.bodySmall</td>
                  <td className="py-3 px-2">14px</td>
                  <td className="py-3 px-2">500</td>
                  <td className="py-3 px-2">Descriptions</td>
                </tr>
                <tr className="border-b border-border bg-muted/30">
                  <td className="py-3 px-2 font-semibold">Body Tiny</td>
                  <td className="py-3 px-2 font-mono text-primary">TYPOGRAPHY.bodyTiny</td>
                  <td className="py-3 px-2">11px</td>
                  <td className="py-3 px-2">600</td>
                  <td className="py-3 px-2">Fine print</td>
                </tr>
                <tr className="border-b border-border bg-accent/10">
                  <td className="py-3 px-2 font-semibold">Price</td>
                  <td className="py-3 px-2 font-mono text-primary">TYPOGRAPHY.price</td>
                  <td className="py-3 px-2">24px</td>
                  <td className="py-3 px-2">600</td>
                  <td className="py-3 px-2">Pricing display</td>
                </tr>
                <tr className="border-b border-border bg-accent/10">
                  <td className="py-3 px-2 font-semibold">Stat</td>
                  <td className="py-3 px-2 font-mono text-primary">TYPOGRAPHY.stat</td>
                  <td className="py-3 px-2">142px</td>
                  <td className="py-3 px-2">600</td>
                  <td className="py-3 px-2">Large numbers</td>
                </tr>
                <tr className="border-b border-border bg-accent/10">
                  <td className="py-3 px-2 font-semibold">Brand</td>
                  <td className="py-3 px-2 font-mono text-primary">TYPOGRAPHY.brand</td>
                  <td className="py-3 px-2">20px</td>
                  <td className="py-3 px-2">600</td>
                  <td className="py-3 px-2">Logo/brand mark</td>
                </tr>
                <tr className="border-b border-border bg-accent/10">
                  <td className="py-3 px-2 font-semibold">Nav</td>
                  <td className="py-3 px-2 font-mono text-primary">TYPOGRAPHY.nav</td>
                  <td className="py-3 px-2">15px</td>
                  <td className="py-3 px-2">600</td>
                  <td className="py-3 px-2">Navigation</td>
                </tr>
                <tr className="border-b border-border bg-accent/10">
                  <td className="py-3 px-2 font-semibold">Counter</td>
                  <td className="py-3 px-2 font-mono text-primary">TYPOGRAPHY.counter</td>
                  <td className="py-3 px-2">10px</td>
                  <td className="py-3 px-2">600</td>
                  <td className="py-3 px-2">Decorative numbers</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-3 px-2 font-semibold">Lead</td>
                  <td className="py-3 px-2 font-mono text-primary">TYPOGRAPHY.lead</td>
                  <td className="py-3 px-2">17px</td>
                  <td className="py-3 px-2">500</td>
                  <td className="py-3 px-2">Lead paragraphs</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-3 px-2 font-semibold">Caption</td>
                  <td className="py-3 px-2 font-mono text-primary">TYPOGRAPHY.caption</td>
                  <td className="py-3 px-2">13px</td>
                  <td className="py-3 px-2">500</td>
                  <td className="py-3 px-2">Captions & credits</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-3 px-2 font-semibold">Label</td>
                  <td className="py-3 px-2 font-mono text-primary">TYPOGRAPHY.label</td>
                  <td className="py-3 px-2">14px</td>
                  <td className="py-3 px-2">500</td>
                  <td className="py-3 px-2">Form labels</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-3 px-2 font-semibold">Button</td>
                  <td className="py-3 px-2 font-mono text-primary">TYPOGRAPHY.button</td>
                  <td className="py-3 px-2">15px</td>
                  <td className="py-3 px-2">600</td>
                  <td className="py-3 px-2">Button text</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-3 px-2 font-semibold">Link</td>
                  <td className="py-3 px-2 font-mono text-primary">TYPOGRAPHY.link</td>
                  <td className="py-3 px-2">—</td>
                  <td className="py-3 px-2">500</td>
                  <td className="py-3 px-2">Text links</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground pt-4')}>
            All sizes are responsive using clamp() functions. Desktop sizes shown for reference.
            Actual rendering scales smoothly from mobile (320px) to desktop (1920px+).
          </p>
        </section>

        {/* Key Characteristics */}
        <section className="space-y-6 bg-foreground/5 border border-border rounded-lg p-8">
          <h2 className={clsx(TYPOGRAPHY.h2, 'text-foreground')}>Trifecta Typography Principles</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className={clsx(TYPOGRAPHY.counter, 'text-primary')}>/01/</span>
              <div>
                <p className={clsx(TYPOGRAPHY.label, 'text-foreground mb-1')}>
                  Tight Letter Spacing
                </p>
                <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground')}>
                  Negative tracking (-0.02em to -0.06em) creates a modern, condensed feel
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className={clsx(TYPOGRAPHY.counter, 'text-primary')}>/02/</span>
              <div>
                <p className={clsx(TYPOGRAPHY.label, 'text-foreground mb-1')}>
                  Compact Line Heights
                </p>
                <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground')}>
                  Tight leading (0.85-1.2) for impact and visual density
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className={clsx(TYPOGRAPHY.counter, 'text-primary')}>/03/</span>
              <div>
                <p className={clsx(TYPOGRAPHY.label, 'text-foreground mb-1')}>Two-Weight System</p>
                <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground')}>
                  Only 500 (medium) and 600 (semi-bold) for simplicity and performance
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className={clsx(TYPOGRAPHY.counter, 'text-primary')}>/04/</span>
              <div>
                <p className={clsx(TYPOGRAPHY.label, 'text-foreground mb-1')}>Single Font Family</p>
                <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground')}>
                  Geist throughout — unified and cohesive design system
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
