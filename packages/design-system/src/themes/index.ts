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
  
  Object.entries(theme.colors).forEach(([key, value]) => {
    vars.push(`--color-${key}: ${value};`)
  })
  
  Object.entries(theme.typography.fontSize).forEach(([key, value]) => {
    vars.push(`--font-size-${key}: ${value};`)
  })
  
  Object.entries(theme.typography.fontWeight).forEach(([key, value]) => {
    vars.push(`--font-weight-${key}: ${value};`)
  })
  
  Object.entries(theme.spacing).forEach(([key, value]) => {
    vars.push(`--spacing-${key}: ${value};`)
  })
  
  Object.entries(theme.radius).forEach(([key, value]) => {
    vars.push(`--radius-${key}: ${value};`)
  })
  
  return `:root {\n  ${vars.join('\n  ')}\n}`
}