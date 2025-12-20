import { VerificationEmailExample } from '../src/templates/examples/verification'

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
export default function VerificationEmailPreview() {
  return VerificationEmailExample.component({
    userName: 'John Doe',
    verificationUrl: 'https://hub.cenie.org/verify?token=abc123',
    branding: mockBranding,
    typography: mockTypography,
    baseUrl: 'https://hub.cenie.org',
  })
}
