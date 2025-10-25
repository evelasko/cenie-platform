import { clsx } from 'clsx'
import { TYPOGRAPHY } from '../../lib/typography'

export default function TypographyPage() {
  return (
    <div className="min-h-screen bg-background py-12 px-8">
      <div className="mx-auto max-w-4xl space-y-16">
        {/* Header */}
        <div className="text-center">
          <h1 className={clsx(TYPOGRAPHY.display1, 'text-primary mb-4')}>
            Editorial Typography System
          </h1>
          <p className={clsx(TYPOGRAPHY.lead, 'text-muted-foreground')}>
            Anziano for headings, FF Basic Gothic Pro for body text — inspired by Harvard University
            Press
          </p>
        </div>

        {/* Usage Documentation */}
        <section className="space-y-6 border border-border rounded-lg p-8 bg-muted/30">
          <h2 className={clsx(TYPOGRAPHY.h2, 'text-foreground')}>Using Typography Constants</h2>
          <div className="space-y-4">
            <p className={clsx(TYPOGRAPHY.bodyBase, 'text-foreground')}>
              The Editorial typography system provides a{' '}
              <code className="px-2 py-1 bg-muted rounded text-sm font-mono">TYPOGRAPHY</code>{' '}
              constant for better developer experience and type safety.
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
                  {`<h1 className={clsx(TYPOGRAPHY.h1, "text-center mb-4")}>
  New and Noteworthy
</h1>

<p className={clsx(TYPOGRAPHY.bodyLarge, "max-w-prose")}>
  Lead paragraph text...
</p>`}
                </code>
              </pre>
            </div>

            <div className="space-y-3">
              <p className={clsx(TYPOGRAPHY.label, 'text-foreground')}>
                Available typography keys:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
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
                  'lead',
                  'caption',
                  'button',
                  'link',
                  'quote',
                  'label',
                ].map((key) => (
                  <code
                    key={key}
                    className="px-3 py-1.5 bg-primary/10 border border-primary/20 rounded text-xs font-mono"
                  >
                    {key}
                  </code>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Display Styles */}
        <section className="space-y-8">
          <h2 className={clsx(TYPOGRAPHY.h2, 'text-foreground border-b border-border pb-2')}>
            Display Styles
          </h2>
          <div className="space-y-6">
            <div>
              <p className={clsx(TYPOGRAPHY.caption, 'mb-2')}>Display 1</p>
              <h1 className={clsx(TYPOGRAPHY.display1, 'text-foreground')}>
                The Power of Creative Destruction
              </h1>
              <div className={clsx(TYPOGRAPHY.caption, 'mt-2 font-mono')}>
                Font: anziano | Size: clamp(1.5rem, 3vw + 1rem, 2.0625rem) | Weight: 400
              </div>
            </div>
            <div>
              <p className={clsx(TYPOGRAPHY.caption, 'mb-2')}>Display 2</p>
              <h1 className={clsx(TYPOGRAPHY.display2, 'text-foreground')}>
                Focus on Scholarly Excellence
              </h1>
              <div className={clsx(TYPOGRAPHY.caption, 'mt-2 font-mono')}>
                Font: anziano | Size: clamp(1.375rem, 2.5vw + 0.875rem, 1.875rem) | Weight: 400
              </div>
            </div>
          </div>
        </section>

        {/* Heading Styles */}
        <section className="space-y-8">
          <h2 className={clsx(TYPOGRAPHY.h2, 'text-foreground border-b border-border pb-2')}>
            Heading Styles
          </h2>
          <div className="space-y-6">
            <div>
              <p className={clsx(TYPOGRAPHY.caption, 'mb-2')}>Heading 1 — Hero Titles</p>
              <h1 className={clsx(TYPOGRAPHY.h1, 'text-foreground')}>New and Noteworthy</h1>
              <div className={clsx(TYPOGRAPHY.caption, 'mt-2 font-mono')}>
                Font: anziano | Size: clamp(1.5rem, 3vw + 1rem, 2.0625rem) | Weight: 400
              </div>
            </div>
            <div>
              <p className={clsx(TYPOGRAPHY.caption, 'mb-2')}>Heading 2 — Section Titles</p>
              <h2 className={clsx(TYPOGRAPHY.h2, 'text-foreground')}>
                Philippe Aghion Wins Nobel Prize
              </h2>
              <div className={clsx(TYPOGRAPHY.caption, 'mt-2 font-mono')}>
                Font: anziano | Size: clamp(1.25rem, 2vw + 0.75rem, 1.4375rem) | Weight: 400
              </div>
            </div>
            <div>
              <p className={clsx(TYPOGRAPHY.caption, 'mb-2')}>Heading 3 — Subsections</p>
              <h3 className={clsx(TYPOGRAPHY.h3, 'text-foreground')}>
                Reading List Recommendations
              </h3>
              <div className={clsx(TYPOGRAPHY.caption, 'mt-2 font-mono')}>
                Font: ff-basic-gothic-pro | Size: clamp(1.125rem, 1.5vw + 0.625rem, 1.25rem) |
                Weight: 300
              </div>
            </div>
            <div>
              <p className={clsx(TYPOGRAPHY.caption, 'mb-2')}>Heading 4 — Minor Headings</p>
              <h4 className={clsx(TYPOGRAPHY.h4, 'text-foreground')}>Article Categories</h4>
              <div className={clsx(TYPOGRAPHY.caption, 'mt-2 font-mono')}>
                Font: ff-basic-gothic-pro | Size: clamp(1rem, 1vw + 0.5rem, 1.125rem) | Weight: 300
              </div>
            </div>
            <div>
              <p className={clsx(TYPOGRAPHY.caption, 'mb-2')}>Heading 5 — Component Titles</p>
              <h5 className={clsx(TYPOGRAPHY.h5, 'text-foreground')}>Featured Authors</h5>
              <div className={clsx(TYPOGRAPHY.caption, 'mt-2 font-mono')}>
                Font: ff-basic-gothic-pro | Size: clamp(0.9375rem, 0.75vw + 0.5rem, 1rem) | Weight:
                300
              </div>
            </div>
            <div>
              <p className={clsx(TYPOGRAPHY.caption, 'mb-2')}>Heading 6 — Small Headings</p>
              <h6 className={clsx(TYPOGRAPHY.h6, 'text-foreground')}>Publication Details</h6>
              <div className={clsx(TYPOGRAPHY.caption, 'mt-2 font-mono')}>
                Font: ff-basic-gothic-pro | Size: clamp(0.875rem, 0.5vw + 0.5rem, 0.9375rem) |
                Weight: 400
              </div>
            </div>
          </div>
        </section>

        {/* Body Text Styles */}
        <section className="space-y-8">
          <h2 className={clsx(TYPOGRAPHY.h2, 'text-foreground border-b border-border pb-2')}>
            Body Text Styles
          </h2>
          <div className="space-y-6">
            <div>
              <p className={clsx(TYPOGRAPHY.caption, 'mb-2')}>Body Large — Lead Paragraphs</p>
              <p className={clsx(TYPOGRAPHY.bodyLarge, 'text-foreground')}>
                The Nobel Prize in Economics has been awarded to Philippe Aghion, coauthor of The
                Power of Creative Destruction, in recognition of his pioneering research on
                innovation, growth, and the dynamics of creative destruction.
              </p>
              <div className={clsx(TYPOGRAPHY.caption, 'mt-2 font-mono')}>
                Font: ff-basic-gothic-pro | Size: clamp(1rem, 0.5vw + 0.875rem, 1.125rem) | Weight:
                300
              </div>
            </div>
            <div>
              <p className={clsx(TYPOGRAPHY.caption, 'mb-2')}>Body Base — Main Content</p>
              <p className={clsx(TYPOGRAPHY.bodyBase, 'text-foreground')}>
                Harvard University Press has been a cornerstone of scholarly publishing for over a
                century. The press publishes books in a wide range of fields including the
                humanities, social sciences, and natural sciences, maintaining the highest standards
                of editorial excellence while embracing innovative approaches to academic
                communication.
              </p>
              <div className={clsx(TYPOGRAPHY.caption, 'mt-2 font-mono')}>
                Font: ff-basic-gothic-pro | Size: clamp(0.9375rem, 0.25vw + 0.875rem, 1rem) |
                Weight: 300
              </div>
            </div>
            <div>
              <p className={clsx(TYPOGRAPHY.caption, 'mb-2')}>Body Small — Captions & Credits</p>
              <p className={clsx(TYPOGRAPHY.bodySmall, 'text-foreground')}>
                Photography by Philip Romano. All rights reserved. Published by Harvard University
                Press, Cambridge, Massachusetts.
              </p>
              <div className={clsx(TYPOGRAPHY.caption, 'mt-2 font-mono')}>
                Font: ff-basic-gothic-pro | Size: clamp(0.8125rem, 0.25vw + 0.75rem, 0.875rem) |
                Weight: 300
              </div>
            </div>
          </div>
        </section>

        {/* UI/Utility Styles */}
        <section className="space-y-8">
          <h2 className={clsx(TYPOGRAPHY.h2, 'text-foreground border-b border-border pb-2')}>
            UI & Utility Styles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className={clsx(TYPOGRAPHY.caption, 'mb-2')}>Lead Text</p>
              <p className={clsx(TYPOGRAPHY.lead, 'text-foreground')}>
                Introduction to scholarly articles and features
              </p>
              <div className={clsx(TYPOGRAPHY.caption, 'mt-2 font-mono')}>
                Size: clamp(1rem, 0.5vw + 0.875rem, 1.125rem) | Weight: 300
              </div>
            </div>
            <div>
              <p className={clsx(TYPOGRAPHY.caption, 'mb-2')}>Caption</p>
              <p className={TYPOGRAPHY.caption}>Marla A. Ramírez</p>
              <div className={clsx(TYPOGRAPHY.caption, 'mt-2 font-mono')}>
                Size: clamp(0.75rem, 0.25vw + 0.6875rem, 0.875rem) | Weight: 300
              </div>
            </div>
            <div>
              <p className={clsx(TYPOGRAPHY.caption, 'mb-2')}>Button Text</p>
              <p className={clsx(TYPOGRAPHY.button, 'text-foreground')}>Discover the book</p>
              <div className={clsx(TYPOGRAPHY.caption, 'mt-2 font-mono')}>
                Size: clamp(0.875rem, 0.25vw + 0.8125rem, 1rem) | Weight: 300
              </div>
            </div>
            <div>
              <p className={clsx(TYPOGRAPHY.caption, 'mb-2')}>Link Text</p>
              <p className={clsx(TYPOGRAPHY.link, 'text-primary hover:opacity-70')}>Learn more</p>
              <div className={clsx(TYPOGRAPHY.caption, 'mt-2 font-mono')}>
                Weight: 300 | Decoration: none (hover: opacity 0.7)
              </div>
            </div>
            <div>
              <p className={clsx(TYPOGRAPHY.caption, 'mb-2')}>Quote Text</p>
              <p className={clsx(TYPOGRAPHY.quote, 'text-foreground')}>
                The press publishes books in a wide range of fields, maintaining the highest
                standards of excellence.
              </p>
              <div className={clsx(TYPOGRAPHY.caption, 'mt-2 font-mono')}>
                Size: clamp(1.125rem, 1vw + 0.875rem, 1.375rem) | Weight: 300 | Style: italic
              </div>
            </div>
            <div>
              <p className={clsx(TYPOGRAPHY.caption, 'mb-2')}>Label Text</p>
              <p className={clsx(TYPOGRAPHY.label, 'text-foreground')}>Reading List</p>
              <div className={clsx(TYPOGRAPHY.caption, 'mt-2 font-mono')}>
                Size: clamp(0.875rem, 0.25vw + 0.8125rem, 1rem) | Weight: 400
              </div>
            </div>
          </div>
        </section>

        {/* Font Weights - Anziano Display */}
        <section className="space-y-8">
          <h2 className={clsx(TYPOGRAPHY.h2, 'text-foreground border-b border-border pb-2')}>
            Display Font Weights (Anziano)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className={clsx(TYPOGRAPHY.caption, 'mb-2')}>Regular (400)</p>
              <p
                className="text-2xl"
                style={{ fontFamily: 'var(--font-display)', fontWeight: 400 }}
              >
                Anziano Regular
              </p>
            </div>
            <div>
              <p className={clsx(TYPOGRAPHY.caption, 'mb-2')}>Regular Italic (400)</p>
              <p
                className="text-2xl"
                style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontStyle: 'italic' }}
              >
                Anziano Italic
              </p>
            </div>
            <div>
              <p className={clsx(TYPOGRAPHY.caption, 'mb-2')}>Bold (700)</p>
              <p
                className="text-2xl"
                style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}
              >
                Anziano Bold
              </p>
            </div>
            <div>
              <p className={clsx(TYPOGRAPHY.caption, 'mb-2')}>Bold Italic (700)</p>
              <p
                className="text-2xl"
                style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontStyle: 'italic' }}
              >
                Anziano Bold Italic
              </p>
            </div>
          </div>
        </section>

        {/* Font Weights - FF Basic Gothic Pro Body */}
        <section className="space-y-8">
          <h2 className={clsx(TYPOGRAPHY.h2, 'text-foreground border-b border-border pb-2')}>
            Body Font Weights (FF Basic Gothic Pro)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className={clsx(TYPOGRAPHY.caption, 'mb-2')}>Light (300) — Primary Weight</p>
              <p className="text-lg" style={{ fontFamily: 'var(--font-body)', fontWeight: 300 }}>
                FF Basic Gothic Pro Light for elegant body text
              </p>
            </div>
            <div>
              <p className={clsx(TYPOGRAPHY.caption, 'mb-2')}>Regular (400) — Secondary Weight</p>
              <p className="text-lg" style={{ fontFamily: 'var(--font-body)', fontWeight: 400 }}>
                FF Basic Gothic Pro Regular for labels and headings
              </p>
            </div>
            <div>
              <p className={clsx(TYPOGRAPHY.caption, 'mb-2')}>Medium (500)</p>
              <p className="text-lg" style={{ fontFamily: 'var(--font-body)', fontWeight: 500 }}>
                FF Basic Gothic Pro Medium for emphasis
              </p>
            </div>
            <div>
              <p className={clsx(TYPOGRAPHY.caption, 'mb-2')}>Bold (700)</p>
              <p className="text-lg" style={{ fontFamily: 'var(--font-body)', fontWeight: 700 }}>
                FF Basic Gothic Pro Bold for strong emphasis
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
