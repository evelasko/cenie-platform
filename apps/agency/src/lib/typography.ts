/**
 * Typography Constants
 *
 * Centralized typography utility classes for the CENIE Agency platform.
 * Based on Effica AI consultancy design system — bold uppercase headings with three-font hierarchy.
 *
 * @example
 * ```tsx
 * import { TYPOGRAPHY } from '@/lib/typography';
 * import { clsx } from 'clsx';
 *
 * <h1 className={clsx(TYPOGRAPHY.hero, "text-center mb-8")}>
 *   A Clear AI Plan
 * </h1>
 * ```
 */

export const TYPOGRAPHY = {
  // Hero/Display Styles (Sora, uppercase)
  hero: 'type-hero',
  display1: 'type-display-1',
  display2: 'type-display-2',

  // Heading Styles (Sora, uppercase)
  h1: 'type-heading-1',
  h2: 'type-heading-2',
  h3: 'type-heading-3',
  h4: 'type-heading-4',
  h5: 'type-heading-5',
  h6: 'type-heading-6',

  // Body Styles (Geist, sentence case)
  bodyLarge: 'type-body-large',
  bodyBase: 'type-body-base',
  bodySmall: 'type-body-small',

  // Specialized Styles
  quote: 'type-quote',
  stat: 'type-stat',
  year: 'type-year',
  project: 'type-project',
  ctaPrimary: 'type-cta-primary',
  ctaSecondary: 'type-cta-secondary',
  labelMono: 'type-label-mono',
  sectionLabel: 'type-section-label',
  rating: 'type-rating',
  link: 'type-link',
} as const

/**
 * Type-safe typography class names
 */
export type TypographyKey = keyof typeof TYPOGRAPHY
export type TypographyValue = (typeof TYPOGRAPHY)[TypographyKey]
