/**
 * Typography Constants
 *
 * Centralized typography utility classes for the Editorial platform.
 * Based on Harvard University Press design system.
 *
 * @example
 * ```tsx
 * import { TYPOGRAPHY } from '@/lib/typography';
 * import { clsx } from 'clsx';
 *
 * <h1 className={clsx(TYPOGRAPHY.display1, "text-center")}>
 *   Hero Title
 * </h1>
 * ```
 */

export const TYPOGRAPHY = {
  // Display Styles
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
  bodyLarge: 'type-body-large',
  bodyBase: 'type-body-base',
  bodySmall: 'type-body-small',

  // Utility Styles
  lead: 'type-lead',
  caption: 'type-caption',
  button: 'type-button',
  link: 'type-link',
  quote: 'type-quote',
  label: 'type-label',
} as const

/**
 * Type-safe typography class names
 */
export type TypographyKey = keyof typeof TYPOGRAPHY
export type TypographyValue = (typeof TYPOGRAPHY)[TypographyKey]
