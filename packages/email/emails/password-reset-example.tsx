import { PasswordResetEmailExample } from '../src/templates/examples/password-reset'

// Example branding configuration for preview
const mockBranding = {
  primaryColor: '#f76808', // Hub orange
  backgroundColor: '#ffffff',
  textColor: '#0a0a0a',
  fontFamily: 'Inter, sans-serif',
  logoUrl: 'https://via.placeholder.com/120x40/f76808/ffffff?text=CENIE',
}

const mockTypography = {
  headingFont: 'Inter, sans-serif',
  bodyFont: 'Inter, sans-serif',
  headingWeight: 700,
  bodyWeight: 400,
}

// Preview component
export default function PasswordResetEmailPreview() {
  return PasswordResetEmailExample.component({
    userName: 'John Doe',
    resetUrl: 'https://hub.cenie.org/reset-password?token=xyz789',
    expiresIn: '1 hour',
    branding: mockBranding,
    typography: mockTypography,
    baseUrl: 'https://hub.cenie.org',
  })
}
