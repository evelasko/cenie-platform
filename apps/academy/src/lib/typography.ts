/**
 * Typography Constants
 *
 * Centralized typography utility classes for the CENIE Academy platform.
 * Based on Trifecta agency design system — modern, bold, tight spacing.
 *
 * @example
 * ```tsx
 * import { TYPOGRAPHY } from '@/lib/typography';
 * import { clsx } from 'clsx';
 *
 * <h1 className={clsx(TYPOGRAPHY.hero, "text-center mb-8")}>
 *   Dream Big
 * </h1>
 * ```
 */

export const TYPOGRAPHY = {
  // Hero/Display Styles
  hero: 'type-hero',
  display1: 'type-display-1',
  display2: 'type-display-2',

  // Heading Styles
  h1: 'type-heading-1',
  h2: 'type-heading-2',
  h3: 'type-heading-3',
  h4: 'type-heading-4',
  h5: 'type-heading-5',
  h6: 'type-heading-6',

  // Body Styles
  bodyXlarge: 'type-body-xlarge',
  bodyLarge: 'type-body-large',
  bodyBase: 'type-body-base',
  bodySmall: 'type-body-small',
  bodyTiny: 'type-body-tiny',

  // Specialized Styles
  lead: 'type-lead',
  brand: 'type-brand',
  nav: 'type-nav',
  caption: 'type-caption',
  label: 'type-label',
  button: 'type-button',
  link: 'type-link',
  counter: 'type-counter',
  stat: 'type-stat',
  price: 'type-price',
} as const

/**
 * Type-safe typography class names
 */
export type TypographyKey = keyof typeof TYPOGRAPHY
export type TypographyValue = (typeof TYPOGRAPHY)[TypographyKey]
