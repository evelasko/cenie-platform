import { clsx } from 'clsx'
import { TYPOGRAPHY } from '../../lib/typography'

export default function TypographyPage() {
  return (
    <div className="min-h-screen bg-background py-12 px-8">
      <div className="mx-auto max-w-6xl space-y-16">
        {/* Header */}
        <div className="text-center">
          <h1 className={clsx(TYPOGRAPHY.hero, 'text-primary mb-4')}>Agency Typography</h1>
          <p className={clsx(TYPOGRAPHY.bodyLarge, 'text-muted-foreground')}>
            Sora for headings, Geist for body, IBM Plex Mono for labels — inspired by Effica AI
          </p>
        </div>

        {/* Usage Documentation */}
        <section className="space-y-6 border border-border rounded-lg p-8 bg-muted/30">
          <h2 className={clsx(TYPOGRAPHY.h2, 'text-foreground')}>Using Typography Constants</h2>
          <div className="space-y-4">
            <p className={clsx(TYPOGRAPHY.bodyBase, 'text-foreground')}>
              The Agency typography system features a{' '}
              <code className="px-2 py-1 bg-muted rounded text-sm font-mono">TYPOGRAPHY</code>{' '}
              constant with Effica&apos;s three-font hierarchy and bold uppercase aesthetic.
            </p>

            <div className="space-y-3">
              <p className={clsx(TYPOGRAPHY.labelMono, 'text-foreground')}>Import the constant:</p>
              <pre className="bg-foreground/5 border border-border rounded-lg p-4 overflow-x-auto">
                <code className="text-sm font-mono text-foreground">
                  {`import { clsx } from 'clsx';
import { TYPOGRAPHY } from '@/lib/typography';`}
                </code>
              </pre>
            </div>

            <div className="space-y-3">
              <p className={clsx(TYPOGRAPHY.labelMono, 'text-foreground')}>
                Use with clsx for combining classes:
              </p>
              <pre className="bg-foreground/5 border border-border rounded-lg p-4 overflow-x-auto">
                <code className="text-sm font-mono text-foreground">
                  {`<h1 className={clsx(TYPOGRAPHY.hero, "text-center")}>
  A Clear AI Plan
</h1>

<p className={clsx(TYPOGRAPHY.bodyLarge, "max-w-prose")}>
  Tagline text...
</p>`}
                </code>
              </pre>
            </div>

            <div className="space-y-3">
              <p className={clsx(TYPOGRAPHY.labelMono, 'text-foreground')}>
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
                  'bodyLarge',
                  'bodyBase',
                  'bodySmall',
                  'quote',
                  'stat',
                  'year',
                  'project',
                  'ctaPrimary',
                  'ctaSecondary',
                  'labelMono',
                  'sectionLabel',
                  'rating',
                  'link',
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
              <p className={clsx(TYPOGRAPHY.sectionLabel, 'mb-3 text-muted-foreground')}>
                Hero — Massive Impact
              </p>
              <h1 className={clsx(TYPOGRAPHY.hero, 'text-foreground')}>A Clear AI Plan</h1>
              <div className={clsx(TYPOGRAPHY.rating, 'mt-3 font-mono text-muted-foreground')}>
                Font: Sora | Size: clamp(3rem, 9vw + 2rem, 6.798rem) | Weight: 800 | Transform:
                UPPERCASE
              </div>
              <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground mt-3')}>
                <strong className="text-foreground">Use for:</strong> Main hero headings, primary
                value propositions, maximum impact statements
              </p>
            </div>

            <div className="border border-border rounded-lg p-6 bg-card">
              <p className={clsx(TYPOGRAPHY.sectionLabel, 'mb-3 text-muted-foreground')}>
                Display 1 — Large Subheadings
              </p>
              <h1 className={clsx(TYPOGRAPHY.display1, 'text-foreground')}>For Your Business</h1>
              <div className={clsx(TYPOGRAPHY.rating, 'mt-3 font-mono text-muted-foreground')}>
                Font: Sora | Size: clamp(2.5rem, 6vw + 1.5rem, 3.955rem) | Weight: 800 | Transform:
                UPPERCASE
              </div>
              <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground mt-3')}>
                <strong className="text-foreground">Use for:</strong> Hero subheadings, supporting
                hero text, secondary impact statements
              </p>
            </div>

            <div className="border border-border rounded-lg p-6 bg-card">
              <p className={clsx(TYPOGRAPHY.sectionLabel, 'mb-3 text-muted-foreground')}>
                Display 2 — Section Headings
              </p>
              <h1 className={clsx(TYPOGRAPHY.display2, 'text-foreground')}>
                Why Companies Choose Effica®
              </h1>
              <div className={clsx(TYPOGRAPHY.rating, 'mt-3 font-mono text-muted-foreground')}>
                Font: Sora | Size: clamp(1.75rem, 3vw + 1rem, 2.375rem) | Weight: 700 | Transform:
                UPPERCASE
              </div>
              <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground mt-3')}>
                <strong className="text-foreground">Use for:</strong> Major section titles, feature
                headlines, page section markers
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
              <p className={clsx(TYPOGRAPHY.sectionLabel, 'mb-2 text-muted-foreground')}>
                H1 — Animated Text Blocks
              </p>
              <h1 className={clsx(TYPOGRAPHY.h1, 'text-foreground')}>
                Turning Repetitive Work Into Time-Saving Systems
              </h1>
              <div className={clsx(TYPOGRAPHY.rating, 'mt-2 font-mono text-muted-foreground')}>
                Sora | clamp(1.5rem, 2.5vw + 0.75rem, 2.125rem) | Weight: 700 | UPPERCASE
              </div>
              <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground mt-3')}>
                <strong className="text-foreground">Use for:</strong> Large animated text, service
                descriptions, key messaging blocks
              </p>
            </div>

            <div className="border border-border rounded-lg p-6 bg-card">
              <p className={clsx(TYPOGRAPHY.sectionLabel, 'mb-2 text-muted-foreground')}>
                H2 — Labels & Categories
              </p>
              <h2 className={clsx(TYPOGRAPHY.h2, 'text-foreground')}>OUR ADVANTAGES Include:</h2>
              <div className={clsx(TYPOGRAPHY.rating, 'mt-2 font-mono text-muted-foreground')}>
                Sora | clamp(1.25rem, 2vw + 0.625rem, 1.875rem) | Weight: 700 | UPPERCASE
              </div>
              <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground mt-3')}>
                <strong className="text-foreground">Use for:</strong> Content group labels, category
                headers, emphasized blocks
              </p>
            </div>

            <div className="border border-border rounded-lg p-6 bg-card">
              <p className={clsx(TYPOGRAPHY.sectionLabel, 'mb-2 text-muted-foreground')}>
                H3 — Service Titles
              </p>
              <h3 className={clsx(TYPOGRAPHY.h3, 'text-foreground')}>AI Consulting & Strategy</h3>
              <div className={clsx(TYPOGRAPHY.rating, 'mt-2 font-mono text-muted-foreground')}>
                Sora | clamp(1.125rem, 1.5vw + 0.5rem, 1.5rem) | Weight: 700 | UPPERCASE
              </div>
              <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground mt-3')}>
                <strong className="text-foreground">Use for:</strong> Service card titles, feature
                names, product offerings
              </p>
            </div>

            <div className="border border-border rounded-lg p-6 bg-card">
              <p className={clsx(TYPOGRAPHY.sectionLabel, 'mb-2 text-muted-foreground')}>
                H4 — Video/Content Titles
              </p>
              <h4 className={clsx(TYPOGRAPHY.h4, 'text-foreground')}>
                How We Help You Use AI Without The Hype
              </h4>
              <div className={clsx(TYPOGRAPHY.rating, 'mt-2 font-mono text-muted-foreground')}>
                Sora | clamp(1rem, 1vw + 0.5rem, 1.125rem) | Weight: 700 | UPPERCASE
              </div>
              <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground mt-3')}>
                <strong className="text-foreground">Use for:</strong> Video titles, content
                headlines, article headers
              </p>
            </div>

            <div className="border border-border rounded-lg p-6 bg-card">
              <p className={clsx(TYPOGRAPHY.sectionLabel, 'mb-2 text-muted-foreground')}>
                H5 — Small Section Markers
              </p>
              <h5 className={clsx(TYPOGRAPHY.h5, 'text-foreground')}>/01</h5>
              <div className={clsx(TYPOGRAPHY.rating, 'mt-2 font-mono text-muted-foreground')}>
                Sora | clamp(0.875rem, 0.75vw + 0.5rem, 0.9375rem) | Weight: 700 | UPPERCASE
              </div>
              <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground mt-3')}>
                <strong className="text-foreground">Use for:</strong> Service numbers, step
                indicators, decorative counters
              </p>
            </div>

            <div className="border border-border rounded-lg p-6 bg-card">
              <p className={clsx(TYPOGRAPHY.sectionLabel, 'mb-2 text-muted-foreground')}>
                H6 — Button Text
              </p>
              <h6 className={clsx(TYPOGRAPHY.h6, 'text-foreground')}>Schedule A Free Assessment</h6>
              <div className={clsx(TYPOGRAPHY.rating, 'mt-2 font-mono text-muted-foreground')}>
                Sora | clamp(0.8125rem, 0.5vw + 0.5rem, 0.875rem) | Weight: 700 | UPPERCASE
              </div>
              <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground mt-3')}>
                <strong className="text-foreground">Use for:</strong> Primary CTA buttons, action
                labels, important UI text
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
              <p className={clsx(TYPOGRAPHY.sectionLabel, 'mb-2 text-muted-foreground')}>
                Body Large — Hero Taglines
              </p>
              <p className={clsx(TYPOGRAPHY.bodyLarge, 'text-foreground')}>
                We help businesses apply AI where it actually matters — without the noise.
              </p>
              <div className={clsx(TYPOGRAPHY.rating, 'mt-2 font-mono text-muted-foreground')}>
                Geist | clamp(1rem, 0.5vw + 0.875rem, 1.125rem) | Weight: 500 | Tracking: -0.03em
              </div>
              <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground mt-3')}>
                <strong className="text-foreground">Use for:</strong> Hero taglines, main value
                propositions, opening statements
              </p>
            </div>

            <div className="border border-border rounded-lg p-6 bg-card">
              <p className={clsx(TYPOGRAPHY.sectionLabel, 'mb-2 text-muted-foreground')}>
                Body Base — Main Content
              </p>
              <p className={clsx(TYPOGRAPHY.bodyBase, 'text-foreground')}>
                We provide practical AI consulting and automation services for companies that want
                results — not just theory. Our work is tailored, transparent, and focused on the
                areas of your business where AI makes a real impact.
              </p>
              <div className={clsx(TYPOGRAPHY.rating, 'mt-2 font-mono text-muted-foreground')}>
                Geist | clamp(0.9375rem, 0.25vw + 0.875rem, 1rem) | Weight: 500 | Tracking: -0.03em
              </div>
              <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground mt-3')}>
                <strong className="text-foreground">Use for:</strong> Service descriptions, main
                paragraphs, general content (default body text)
              </p>
            </div>

            <div className="border border-border rounded-lg p-6 bg-card">
              <p className={clsx(TYPOGRAPHY.sectionLabel, 'mb-2 text-muted-foreground')}>
                Body Small — Supporting Text
              </p>
              <p className={clsx(TYPOGRAPHY.bodySmall, 'text-foreground')}>
                Whether you have questions or just want to explore options, we&apos;re here to help
                you navigate AI adoption.
              </p>
              <div className={clsx(TYPOGRAPHY.rating, 'mt-2 font-mono text-muted-foreground')}>
                Geist | clamp(0.875rem, 0.25vw + 0.8125rem, 0.9375rem) | Weight: 500 | Tracking:
                -0.02em
              </div>
              <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground mt-3')}>
                <strong className="text-foreground">Use for:</strong> Supplementary text,
                descriptions, caption-like content
              </p>
            </div>
          </div>
        </section>

        {/* Specialized Effica Styles */}
        <section className="space-y-8">
          <h2 className={clsx(TYPOGRAPHY.h2, 'text-foreground border-b border-border pb-2')}>
            Specialized Effica Styles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-border rounded-lg p-6 bg-card">
              <p className={clsx(TYPOGRAPHY.sectionLabel, 'mb-2 text-muted-foreground')}>
                Quote — Testimonials
              </p>
              <p className={clsx(TYPOGRAPHY.quote, 'text-foreground')}>
                They Didn&apos;t Overwhelm Us With Jargon Or Endless Options
              </p>
              <div className={clsx(TYPOGRAPHY.rating, 'mt-2 font-mono text-muted-foreground')}>
                Sora | clamp(1.5rem, 2vw + 0.875rem, 2.125rem) | Weight: 700 | UPPERCASE
              </div>
              <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground mt-3')}>
                <strong className="text-foreground">Use for:</strong> Client testimonials, pull
                quotes, emphasized statements
              </p>
            </div>

            <div className="border border-border rounded-lg p-6 bg-card">
              <p className={clsx(TYPOGRAPHY.sectionLabel, 'mb-2 text-muted-foreground')}>
                Stat — Data Display
              </p>
              <p className={clsx(TYPOGRAPHY.stat, 'text-foreground')}>50+</p>
              <div className={clsx(TYPOGRAPHY.rating, 'mt-2 font-mono text-muted-foreground')}>
                Geist | clamp(1.5rem, 2vw + 0.875rem, 2.25rem) | Weight: 600 | Tracking: -0.06em
              </div>
              <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground mt-3')}>
                <strong className="text-foreground">Use for:</strong> Statistics, metrics, KPIs,
                data highlights
              </p>
            </div>

            <div className="border border-border rounded-lg p-6 bg-card">
              <p className={clsx(TYPOGRAPHY.sectionLabel, 'mb-2 text-muted-foreground')}>
                Year — Timeline Markers
              </p>
              <p className={clsx(TYPOGRAPHY.year, 'text-foreground')}>2025</p>
              <div className={clsx(TYPOGRAPHY.rating, 'mt-2 font-mono text-muted-foreground')}>
                Geist | clamp(1.25rem, 1.5vw + 0.625rem, 1.75rem) | Weight: 600 | UPPERCASE
              </div>
              <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground mt-3')}>
                <strong className="text-foreground">Use for:</strong> Year labels, dates in
                timelines, temporal markers
              </p>
            </div>

            <div className="border border-border rounded-lg p-6 bg-card">
              <p className={clsx(TYPOGRAPHY.sectionLabel, 'mb-2 text-muted-foreground')}>
                Project — Names & Titles
              </p>
              <p className={clsx(TYPOGRAPHY.project, 'text-foreground')}>FinEdge Advisors</p>
              <div className={clsx(TYPOGRAPHY.rating, 'mt-2 font-mono text-muted-foreground')}>
                Geist | clamp(1rem, 0.5vw + 0.75rem, 1.125rem) | Weight: 500 | Tracking: -0.05em
              </div>
              <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground mt-3')}>
                <strong className="text-foreground">Use for:</strong> Project names, client names,
                portfolio titles
              </p>
            </div>

            <div className="border border-border rounded-lg p-6 bg-card">
              <p className={clsx(TYPOGRAPHY.sectionLabel, 'mb-2 text-muted-foreground')}>
                CTA Primary — Main Buttons
              </p>
              <p className={clsx(TYPOGRAPHY.ctaPrimary, 'text-foreground')}>
                Schedule A Free Assessment
              </p>
              <div className={clsx(TYPOGRAPHY.rating, 'mt-2 font-mono text-muted-foreground')}>
                Sora | clamp(0.8125rem, 0.125vw + 0.75rem, 0.8125rem) | Weight: 700 | UPPERCASE
              </div>
              <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground mt-3')}>
                <strong className="text-foreground">Use for:</strong> Primary CTA buttons, main
                action labels
              </p>
            </div>

            <div className="border border-border rounded-lg p-6 bg-card">
              <p className={clsx(TYPOGRAPHY.sectionLabel, 'mb-2 text-muted-foreground')}>
                CTA Secondary — Soft CTAs
              </p>
              <p className={clsx(TYPOGRAPHY.ctaSecondary, 'text-foreground')}>Read more</p>
              <div className={clsx(TYPOGRAPHY.rating, 'mt-2 font-mono text-muted-foreground')}>
                Sora | clamp(0.875rem, 0.125vw + 0.8125rem, 0.875rem) | Weight: 600 | Sentence case
              </div>
              <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground mt-3')}>
                <strong className="text-foreground">Use for:</strong> Secondary CTAs, text links,
                navigation actions
              </p>
            </div>

            <div className="border border-border rounded-lg p-6 bg-card">
              <p className={clsx(TYPOGRAPHY.sectionLabel, 'mb-2 text-muted-foreground')}>
                Label Mono — UI Labels
              </p>
              <p className={clsx(TYPOGRAPHY.labelMono, 'text-foreground')}>Clear, Actionable</p>
              <div className={clsx(TYPOGRAPHY.rating, 'mt-2 font-mono text-muted-foreground')}>
                IBM Plex Mono | clamp(0.75rem, 0.25vw + 0.6875rem, 0.8125rem) | Weight: 500 |
                UPPERCASE
              </div>
              <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground mt-3')}>
                <strong className="text-foreground">Use for:</strong> Advantage lists, feature
                labels, benefit markers
              </p>
            </div>

            <div className="border border-border rounded-lg p-6 bg-card">
              <p className={clsx(TYPOGRAPHY.sectionLabel, 'mb-2 text-muted-foreground')}>
                Section Label — Section IDs
              </p>
              <p className={clsx(TYPOGRAPHY.sectionLabel, 'text-foreground')}>HOW WE WORK</p>
              <div className={clsx(TYPOGRAPHY.rating, 'mt-2 font-mono text-muted-foreground')}>
                IBM Plex Mono | clamp(0.75rem, 0.125vw + 0.6875rem, 0.75rem) | Weight: 500 |
                UPPERCASE
              </div>
              <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground mt-3')}>
                <strong className="text-foreground">Use for:</strong> Section identifiers, category
                tags, overlines
              </p>
            </div>

            <div className="border border-border rounded-lg p-6 bg-card">
              <p className={clsx(TYPOGRAPHY.sectionLabel, 'mb-2 text-muted-foreground')}>
                Rating — Micro Text
              </p>
              <p className={clsx(TYPOGRAPHY.rating, 'text-foreground')}>4.9/5</p>
              <div className={clsx(TYPOGRAPHY.rating, 'mt-2 font-mono text-muted-foreground')}>
                IBM Plex Mono | clamp(0.625rem, 0.125vw + 0.5625rem, 0.625rem) | Weight: 500 |
                UPPERCASE
              </div>
              <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground mt-3')}>
                <strong className="text-foreground">Use for:</strong> Ratings, stats labels,
                technical indicators, badges
              </p>
            </div>

            <div className="border border-border rounded-lg p-6 bg-card">
              <p className={clsx(TYPOGRAPHY.sectionLabel, 'mb-2 text-muted-foreground')}>
                Link — Text Links
              </p>
              <p className={clsx(TYPOGRAPHY.link, 'text-primary hover:opacity-70')}>About us</p>
              <div className={clsx(TYPOGRAPHY.rating, 'mt-2 font-mono text-muted-foreground')}>
                Sora | Weight: 600 | Hover: opacity 0.7
              </div>
              <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground mt-3')}>
                <strong className="text-foreground">Use for:</strong> Inline text links, navigation
                CTAs
              </p>
            </div>
          </div>
        </section>

        {/* Font Family Showcase */}
        <section className="space-y-8">
          <h2 className={clsx(TYPOGRAPHY.h2, 'text-foreground border-b border-border pb-2')}>
            Three-Font System
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-border rounded-lg p-6 bg-card">
              <p className={clsx(TYPOGRAPHY.sectionLabel, 'mb-4 text-primary')}>Sora</p>
              <p className="mb-3 text-muted-foreground text-sm">Display & Headings</p>
              <div className="space-y-3">
                <p style={{ fontFamily: 'Sora', fontWeight: 600 }} className="text-lg">
                  Semi-Bold (600)
                </p>
                <p style={{ fontFamily: 'Sora', fontWeight: 700 }} className="text-lg">
                  Bold (700)
                </p>
                <p style={{ fontFamily: 'Sora', fontWeight: 800 }} className="text-lg">
                  Extra-Bold (800)
                </p>
              </div>
              <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground mt-4')}>
                <strong className="text-foreground">Use:</strong> ALL headings, CTAs, quotes -
                always uppercase
              </p>
            </div>

            <div className="border border-border rounded-lg p-6 bg-card">
              <p className={clsx(TYPOGRAPHY.sectionLabel, 'mb-4 text-accent')}>Geist</p>
              <p className="mb-3 text-muted-foreground text-sm">Body Text</p>
              <div className="space-y-3">
                <p style={{ fontFamily: 'Geist', fontWeight: 500 }} className="text-lg">
                  Medium (500)
                </p>
                <p style={{ fontFamily: 'Geist', fontWeight: 600 }} className="text-lg">
                  Semi-Bold (600)
                </p>
              </div>
              <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground mt-4')}>
                <strong className="text-foreground">Use:</strong> Body paragraphs, stats, project
                names - sentence case
              </p>
            </div>

            <div className="border border-border rounded-lg p-6 bg-card">
              <p className={clsx(TYPOGRAPHY.sectionLabel, 'mb-4 text-secondary')}>IBM Plex Mono</p>
              <p className="mb-3 text-muted-foreground text-sm">Labels & UI</p>
              <div className="space-y-3">
                <p style={{ fontFamily: 'IBM Plex Mono', fontWeight: 500 }} className="text-lg">
                  Medium (500)
                </p>
                <p style={{ fontFamily: 'IBM Plex Mono', fontWeight: 600 }} className="text-lg">
                  Semi-Bold (600)
                </p>
              </div>
              <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground mt-4')}>
                <strong className="text-foreground">Use:</strong> Section labels, ratings, technical
                indicators - uppercase
              </p>
            </div>
          </div>
        </section>

        {/* Real-World Example */}
        <section className="space-y-8">
          <h2 className={clsx(TYPOGRAPHY.h2, 'text-foreground border-b border-border pb-2')}>
            Effica-Style Component
          </h2>
          <div className="border border-border rounded-xl p-8 space-y-6 bg-card">
            <div className="flex items-start justify-between">
              <p className={clsx(TYPOGRAPHY.sectionLabel, 'text-muted-foreground')}>01</p>
              <p className={clsx(TYPOGRAPHY.rating, 'text-muted-foreground')}>WHO WE ARE</p>
            </div>

            <h3 className={clsx(TYPOGRAPHY.h3, 'text-foreground')}>AI Consulting & Strategy</h3>

            <p className={clsx(TYPOGRAPHY.bodyBase, 'text-foreground')}>
              We&apos;re a hands-on team of AI consultants focused on helping small and mid-size
              businesses use automation where it matters most. We cut through the noise and
              implement it with no disruption.
            </p>

            <div className="flex items-center gap-6 pt-4">
              <div>
                <p className={clsx(TYPOGRAPHY.stat, 'text-primary')}>50+</p>
                <p className={clsx(TYPOGRAPHY.labelMono, 'text-muted-foreground')}>Hours Saved</p>
              </div>
              <div>
                <p className={clsx(TYPOGRAPHY.stat, 'text-accent')}>+15%</p>
                <p className={clsx(TYPOGRAPHY.labelMono, 'text-muted-foreground')}>
                  Increase In Retention
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-border">
              <div className="flex items-center gap-2">
                <span className={clsx(TYPOGRAPHY.sectionLabel, 'text-muted-foreground')}>
                  #AICONSULTING
                </span>
                <span className={clsx(TYPOGRAPHY.sectionLabel, 'text-muted-foreground')}>
                  #BUSINESSAUTOMATION
                </span>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <p
                className={clsx(
                  TYPOGRAPHY.ctaPrimary,
                  'inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg'
                )}
              >
                Schedule A Free Assessment
              </p>
              <p className={clsx(TYPOGRAPHY.ctaSecondary, 'inline-flex items-center text-primary')}>
                Read more →
              </p>
            </div>

            <div className="pt-4 border-t border-border">
              <p className={clsx(TYPOGRAPHY.project, 'text-foreground mb-1')}>Jessica Burns</p>
              <p className={clsx(TYPOGRAPHY.labelMono, 'text-muted-foreground')}>
                Client Success Manager
              </p>
            </div>
          </div>
        </section>

        {/* Typography Scale Reference */}
        <section className="space-y-6 border border-border rounded-lg p-8 bg-card">
          <h2 className={clsx(TYPOGRAPHY.h2, 'text-foreground mb-6')}>Complete Typography Scale</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-border">
                  <th className={clsx(TYPOGRAPHY.labelMono, 'text-left py-3 px-2')}>Style</th>
                  <th className={clsx(TYPOGRAPHY.labelMono, 'text-left py-3 px-2')}>Constant</th>
                  <th className={clsx(TYPOGRAPHY.labelMono, 'text-left py-3 px-2')}>Font</th>
                  <th className={clsx(TYPOGRAPHY.labelMono, 'text-left py-3 px-2')}>Desktop</th>
                  <th className={clsx(TYPOGRAPHY.labelMono, 'text-left py-3 px-2')}>Weight</th>
                  <th className={clsx(TYPOGRAPHY.labelMono, 'text-left py-3 px-2')}>Transform</th>
                </tr>
              </thead>
              <tbody className={TYPOGRAPHY.bodySmall}>
                <tr className="border-b border-border bg-primary/5">
                  <td className="py-3 px-2 font-semibold">Hero</td>
                  <td className="py-3 px-2 font-mono text-primary">TYPOGRAPHY.hero</td>
                  <td className="py-3 px-2">Sora</td>
                  <td className="py-3 px-2">109px</td>
                  <td className="py-3 px-2">800</td>
                  <td className="py-3 px-2">UPPERCASE</td>
                </tr>
                <tr className="border-b border-border bg-primary/5">
                  <td className="py-3 px-2 font-semibold">Display 1</td>
                  <td className="py-3 px-2 font-mono text-primary">TYPOGRAPHY.display1</td>
                  <td className="py-3 px-2">Sora</td>
                  <td className="py-3 px-2">63px</td>
                  <td className="py-3 px-2">800</td>
                  <td className="py-3 px-2">UPPERCASE</td>
                </tr>
                <tr className="border-b border-border bg-primary/5">
                  <td className="py-3 px-2 font-semibold">Display 2</td>
                  <td className="py-3 px-2 font-mono text-primary">TYPOGRAPHY.display2</td>
                  <td className="py-3 px-2">Sora</td>
                  <td className="py-3 px-2">38px</td>
                  <td className="py-3 px-2">700</td>
                  <td className="py-3 px-2">UPPERCASE</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-3 px-2 font-semibold">H1</td>
                  <td className="py-3 px-2 font-mono text-primary">TYPOGRAPHY.h1</td>
                  <td className="py-3 px-2">Sora</td>
                  <td className="py-3 px-2">34px</td>
                  <td className="py-3 px-2">700</td>
                  <td className="py-3 px-2">UPPERCASE</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-3 px-2 font-semibold">H2</td>
                  <td className="py-3 px-2 font-mono text-primary">TYPOGRAPHY.h2</td>
                  <td className="py-3 px-2">Sora</td>
                  <td className="py-3 px-2">30px</td>
                  <td className="py-3 px-2">700</td>
                  <td className="py-3 px-2">UPPERCASE</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-3 px-2 font-semibold">H3</td>
                  <td className="py-3 px-2 font-mono text-primary">TYPOGRAPHY.h3</td>
                  <td className="py-3 px-2">Sora</td>
                  <td className="py-3 px-2">24px</td>
                  <td className="py-3 px-2">700</td>
                  <td className="py-3 px-2">UPPERCASE</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-3 px-2 font-semibold">H4</td>
                  <td className="py-3 px-2 font-mono text-primary">TYPOGRAPHY.h4</td>
                  <td className="py-3 px-2">Sora</td>
                  <td className="py-3 px-2">18px</td>
                  <td className="py-3 px-2">700</td>
                  <td className="py-3 px-2">UPPERCASE</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-3 px-2 font-semibold">H5</td>
                  <td className="py-3 px-2 font-mono text-primary">TYPOGRAPHY.h5</td>
                  <td className="py-3 px-2">Sora</td>
                  <td className="py-3 px-2">15px</td>
                  <td className="py-3 px-2">700</td>
                  <td className="py-3 px-2">UPPERCASE</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-3 px-2 font-semibold">H6</td>
                  <td className="py-3 px-2 font-mono text-primary">TYPOGRAPHY.h6</td>
                  <td className="py-3 px-2">Sora</td>
                  <td className="py-3 px-2">14px</td>
                  <td className="py-3 px-2">700</td>
                  <td className="py-3 px-2">UPPERCASE</td>
                </tr>
                <tr className="border-b border-border bg-accent/10">
                  <td className="py-3 px-2 font-semibold">Body L</td>
                  <td className="py-3 px-2 font-mono text-accent">TYPOGRAPHY.bodyLarge</td>
                  <td className="py-3 px-2">Geist</td>
                  <td className="py-3 px-2">18px</td>
                  <td className="py-3 px-2">500</td>
                  <td className="py-3 px-2">—</td>
                </tr>
                <tr className="border-b border-border bg-accent/10">
                  <td className="py-3 px-2 font-semibold">Body Base</td>
                  <td className="py-3 px-2 font-mono text-accent">TYPOGRAPHY.bodyBase</td>
                  <td className="py-3 px-2">Geist</td>
                  <td className="py-3 px-2">16px</td>
                  <td className="py-3 px-2">500</td>
                  <td className="py-3 px-2">—</td>
                </tr>
                <tr className="border-b border-border bg-accent/10">
                  <td className="py-3 px-2 font-semibold">Body Small</td>
                  <td className="py-3 px-2 font-mono text-accent">TYPOGRAPHY.bodySmall</td>
                  <td className="py-3 px-2">Geist</td>
                  <td className="py-3 px-2">15px</td>
                  <td className="py-3 px-2">500</td>
                  <td className="py-3 px-2">—</td>
                </tr>
                <tr className="border-b border-border bg-secondary/10">
                  <td className="py-3 px-2 font-semibold">Label Mono</td>
                  <td className="py-3 px-2 font-mono text-secondary">TYPOGRAPHY.labelMono</td>
                  <td className="py-3 px-2">IBM</td>
                  <td className="py-3 px-2">13px</td>
                  <td className="py-3 px-2">500</td>
                  <td className="py-3 px-2">UPPERCASE</td>
                </tr>
                <tr className="border-b border-border bg-secondary/10">
                  <td className="py-3 px-2 font-semibold">Section Label</td>
                  <td className="py-3 px-2 font-mono text-secondary">TYPOGRAPHY.sectionLabel</td>
                  <td className="py-3 px-2">IBM</td>
                  <td className="py-3 px-2">12px</td>
                  <td className="py-3 px-2">500</td>
                  <td className="py-3 px-2">UPPERCASE</td>
                </tr>
                <tr className="border-b border-border bg-secondary/10">
                  <td className="py-3 px-2 font-semibold">Rating</td>
                  <td className="py-3 px-2 font-mono text-secondary">TYPOGRAPHY.rating</td>
                  <td className="py-3 px-2">IBM</td>
                  <td className="py-3 px-2">10px</td>
                  <td className="py-3 px-2">500</td>
                  <td className="py-3 px-2">UPPERCASE</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground pt-4')}>
            All sizes are responsive using clamp() functions. Desktop sizes shown for reference.
          </p>
        </section>

        {/* Key Characteristics */}
        <section className="space-y-6 bg-foreground/5 border border-border rounded-lg p-8">
          <h2 className={clsx(TYPOGRAPHY.h2, 'text-foreground')}>Effica Typography Principles</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <span className={clsx(TYPOGRAPHY.sectionLabel, 'text-primary')}>01</span>
              <div>
                <p className={clsx(TYPOGRAPHY.labelMono, 'text-foreground mb-1')}>
                  Three-Font Hierarchy
                </p>
                <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground')}>
                  Sora (display), Geist (body), IBM Plex Mono (labels) - each with distinct roles
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className={clsx(TYPOGRAPHY.sectionLabel, 'text-primary')}>02</span>
              <div>
                <p className={clsx(TYPOGRAPHY.labelMono, 'text-foreground mb-1')}>
                  Uppercase Dominance
                </p>
                <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground')}>
                  ALL headings and labels in uppercase for strong, authoritative presence
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className={clsx(TYPOGRAPHY.sectionLabel, 'text-primary')}>03</span>
              <div>
                <p className={clsx(TYPOGRAPHY.labelMono, 'text-foreground mb-1')}>
                  Tight Letter Spacing
                </p>
                <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground')}>
                  Negative tracking throughout (-0.02em to -0.07em) for modern, condensed aesthetic
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className={clsx(TYPOGRAPHY.sectionLabel, 'text-primary')}>04</span>
              <div>
                <p className={clsx(TYPOGRAPHY.labelMono, 'text-foreground mb-1')}>
                  Optimized Font Loading
                </p>
                <p className={clsx(TYPOGRAPHY.bodySmall, 'text-muted-foreground')}>
                  Sora (600, 700, 800), Geist (500, 600), IBM Plex Mono (500, 600) — only 7 weights
                  total
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
