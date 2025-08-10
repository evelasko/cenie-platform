export interface ColorTokens {
  primary: string
  primaryForeground: string
  secondary: string
  secondaryForeground: string
  accent: string
  accentForeground: string
  background: string
  foreground: string
  muted: string
  mutedForeground: string
  border: string
  input: string
  ring: string
  destructive: string
  destructiveForeground: string
}

export interface TypographyTokens {
  fontFamily: {
    sans: string
    serif: string
    mono: string
  }
  fontSize: {
    xs: string
    sm: string
    base: string
    lg: string
    xl: string
    '2xl': string
    '3xl': string
    '4xl': string
    '5xl': string
  }
  fontWeight: {
    normal: number
    medium: number
    semibold: number
    bold: number
  }
  lineHeight: {
    tight: string
    normal: string
    relaxed: string
  }
}

export interface SpacingTokens {
  0: string
  1: string
  2: string
  3: string
  4: string
  5: string
  6: string
  8: string
  10: string
  12: string
  16: string
  20: string
  24: string
  32: string
  40: string
  48: string
  56: string
  64: string
}

export interface RadiusTokens {
  none: string
  sm: string
  md: string
  lg: string
  xl: string
  full: string
}

export interface DesignTokens {
  colors: ColorTokens
  typography: TypographyTokens
  spacing: SpacingTokens
  radius: RadiusTokens
}

export const baseTokens: DesignTokens = {
  colors: {
    primary: 'hsl(24, 95%, 53%)',
    primaryForeground: 'hsl(0, 0%, 100%)',
    secondary: 'hsl(210, 40%, 96%)',
    secondaryForeground: 'hsl(222, 47%, 11%)',
    accent: 'hsl(210, 40%, 90%)',
    accentForeground: 'hsl(222, 47%, 11%)',
    background: 'hsl(0, 0%, 100%)',
    foreground: 'hsl(222, 47%, 11%)',
    muted: 'hsl(210, 40%, 96%)',
    mutedForeground: 'hsl(215, 16%, 47%)',
    border: 'hsl(214, 32%, 91%)',
    input: 'hsl(214, 32%, 91%)',
    ring: 'hsl(24, 95%, 53%)',
    destructive: 'hsl(0, 84%, 60%)',
    destructiveForeground: 'hsl(0, 0%, 100%)',
  },
  typography: {
    fontFamily: {
      sans: 'Inter, system-ui, -apple-system, sans-serif',
      serif: 'Merriweather, Georgia, serif',
      mono: 'JetBrains Mono, monospace',
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75',
    },
  },
  spacing: {
    0: '0',
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    8: '2rem',
    10: '2.5rem',
    12: '3rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
    32: '8rem',
    40: '10rem',
    48: '12rem',
    56: '14rem',
    64: '16rem',
  },
  radius: {
    none: '0',
    sm: '0.125rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    full: '9999px',
  },
}