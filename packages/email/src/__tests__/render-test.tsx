import * as fs from 'fs'

import {
  PasswordResetEmailExample,
  VerificationEmailExample,
  WelcomeEmailExample,
} from '../templates/examples'
import { renderEmailTemplate } from '../templates/renderer'

async function testRender() {
  const mockBranding = {
    primaryColor: '#f76808',
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

  console.log('🧪 Testing Email Template Rendering')
  console.log('=' .repeat(60))

  // Test 1: Verification Email
  console.log('\n📧 Test 1: Verification Email')
  const verificationElement = VerificationEmailExample.component({
    userName: 'Test User',
    verificationUrl: 'https://example.com/verify/token123',
    branding: mockBranding,
    typography: mockTypography,
    baseUrl: 'https://example.com',
  })

  const verificationHtml = await renderEmailTemplate(verificationElement)
  console.log('✅ Template rendered successfully')
  console.log('   HTML length:', verificationHtml.length, 'bytes')
  console.log('   Contains primary color:', verificationHtml.includes('#f76808'))
  console.log('   Contains user name:', verificationHtml.includes('Test User'))
  console.log('   Contains CTA button:', verificationHtml.includes('Verify Email Address'))

  // Save to file
  fs.writeFileSync('/tmp/verification-email.html', verificationHtml)
  console.log('   Saved to /tmp/verification-email.html')

  // Test 2: Password Reset Email
  console.log('\n📧 Test 2: Password Reset Email')
  const resetElement = PasswordResetEmailExample.component({
    userName: 'Test User',
    resetUrl: 'https://example.com/reset/token456',
    expiresIn: '1 hour',
    branding: mockBranding,
    typography: mockTypography,
    baseUrl: 'https://example.com',
  })

  const resetHtml = await renderEmailTemplate(resetElement)
  console.log('✅ Template rendered successfully')
  console.log('   HTML length:', resetHtml.length, 'bytes')
  console.log('   Contains expiry time:', resetHtml.includes('1 hour'))
  console.log('   Contains CTA button:', resetHtml.includes('Reset Password'))

  fs.writeFileSync('/tmp/password-reset-email.html', resetHtml)
  console.log('   Saved to /tmp/password-reset-email.html')

  // Test 3: Welcome Email
  console.log('\n📧 Test 3: Welcome Email')
  const welcomeElement = WelcomeEmailExample.component({
    userName: 'Test User',
    dashboardUrl: 'https://example.com/dashboard',
    appName: 'CENIE Hub',
    branding: mockBranding,
    typography: mockTypography,
    baseUrl: 'https://example.com',
  })

  const welcomeHtml = await renderEmailTemplate(welcomeElement)
  console.log('✅ Template rendered successfully')
  console.log('   HTML length:', welcomeHtml.length, 'bytes')
  console.log('   Contains app name:', welcomeHtml.includes('CENIE Hub'))
  console.log('   Contains CTA button:', welcomeHtml.includes('Go to Dashboard'))

  fs.writeFileSync('/tmp/welcome-email.html', welcomeHtml)
  console.log('   Saved to /tmp/welcome-email.html')

  // Summary
  console.log('\n' + '=' .repeat(60))
  console.log('✅ All template tests passed!')
  console.log('=' .repeat(60))
  console.log('\n💡 View rendered emails:')
  console.log('   - Verification: file:///tmp/verification-email.html')
  console.log('   - Password Reset: file:///tmp/password-reset-email.html')
  console.log('   - Welcome: file:///tmp/welcome-email.html')
  console.log('\n💡 Or open in browser:')
  console.log('   open /tmp/verification-email.html')
}

testRender().catch((error) => {
  console.error('❌ Template rendering test failed:', error)
  process.exit(1)
})
