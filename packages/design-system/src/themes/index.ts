import { type DesignTokens, baseTokens } from '../tokens'

export type ThemeVariant = 'hub' | 'editorial' | 'academy' | 'learn'

export interface Theme extends DesignTokens {
  name: ThemeVariant
}

export const hubTheme: Theme = {
  ...baseTokens,
  name: 'hub',
}

export const editorialTheme: Theme = {
  ...baseTokens,
  name: 'editorial',
  colors: {
    ...baseTokens.colors,
    primary: 'hsl(30, 40%, 35%)',
    primaryForeground: 'hsl(0, 0%, 100%)',
    accent: 'hsl(30, 25%, 85%)',
    accentForeground: 'hsl(30, 40%, 20%)',
  },
  typography: {
    ...baseTokens.typography,
    fontFamily: {
      ...baseTokens.typography.fontFamily,
      sans: 'Merriweather, Georgia, serif',
      serif: 'Merriweather, Georgia, serif',
    },
  },
}

export const academyTheme: Theme = {
  ...baseTokens,
  name: 'academy',
  colors: {
    ...baseTokens.colors,
    primary: 'hsl(210, 95%, 50%)',
    primaryForeground: 'hsl(0, 0%, 100%)',
    accent: 'hsl(210, 40%, 90%)',
    accentForeground: 'hsl(210, 95%, 30%)',
  },
  typography: {
    ...baseTokens.typography,
    fontFamily: {
      ...baseTokens.typography.fontFamily,
      sans: 'Inter, system-ui, -apple-system, sans-serif',
    },
  },
}

export const learnTheme: Theme = {
  ...academyTheme,
  name: 'learn',
  colors: {
    ...academyTheme.colors,
    accent: 'hsl(200, 50%, 85%)',
  },
}

export const themes: Record<ThemeVariant, Theme> = {
  hub: hubTheme,
  editorial: editorialTheme,
  academy: academyTheme,
  learn: learnTheme,
}

export function getTheme(variant: ThemeVariant): Theme {
  return themes[variant] || hubTheme
}

export function generateCSSVariables(theme: Theme): string {
  const vars: string[] = []
  
  // Color variables - no need for hsl() wrapper in v4
  Object.entries(theme.colors).forEach(([key, value]) => {
    const colorKey = key.replace(/([A-Z])/g, '-$1').toLowerCase()
    vars.push(`--color-${colorKey}: ${value};`)
  })
  
  // Font family variables
  Object.entries(theme.typography.fontFamily).forEach(([key, value]) => {
    vars.push(`--font-${key}: ${value};`)
  })
  
  // Text size variables (using --text prefix for v4)
  Object.entries(theme.typography.fontSize).forEach(([key, value]) => {
    vars.push(`--text-${key}: ${value};`)
  })
  
  // Font weight variables
  Object.entries(theme.typography.fontWeight).forEach(([key, value]) => {
    vars.push(`--font-weight-${key}: ${value};`)
  })
  
  // Line height variables (using --leading prefix for v4)
  Object.entries(theme.typography.lineHeight).forEach(([key, value]) => {
    vars.push(`--leading-${key}: ${value};`)
  })
  
  // Spacing variables - v4 doesn't use numbered spacing variables
  // but we can keep them for custom use
  Object.entries(theme.spacing).forEach(([key, value]) => {
    vars.push(`--spacing-${key}: ${value};`)
  })
  
  // Radius variables
  Object.entries(theme.radius).forEach(([key, value]) => {
    vars.push(`--radius-${key}: ${value};`)
  })
  
  return `@theme {\n  ${vars.join('\n  ')}\n}`
}