import { Body, Container, Heading, Html, Text } from '@react-email/components'

import { EmailSender } from '../core/sender'
import type { EmailTemplate } from '../core/types'

// Simple test template
interface TestEmailData {
  name: string
  message?: string
}

const TestEmail: EmailTemplate<TestEmailData> = {
  name: 'test-email',
  subject: (data) => `Test Email for ${data.name}`,
  component: ({ name, message, branding }) => (
    <Html>
      <Body style={{ backgroundColor: branding.backgroundColor, fontFamily: branding.fontFamily }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
          <Heading style={{ color: branding.primaryColor }}>Hello, {name}!</Heading>
          <Text style={{ color: branding.textColor }}>
            {message || 'This is a test email from the CENIE email package.'}
          </Text>
          <Text style={{ color: '#666', fontSize: '12px' }}>
            This email was sent using the @cenie/email package with Resend.
          </Text>
        </Container>
      </Body>
    </Html>
  ),
}

// Test sender configuration
const testConfig = {
  from: { name: 'CENIE Test', email: 'onboarding@resend.dev' }, // Resend sandbox
  branding: {
    primaryColor: '#f76808', // Orange (Hub color)
    backgroundColor: '#f5f5f5',
    textColor: '#0a0a0a',
    fontFamily: 'sans-serif',
    logoUrl: '',
  },
  typography: {
    headingFont: 'sans-serif',
    bodyFont: 'sans-serif',
    headingWeight: 700,
    bodyWeight: 400,
  },
  baseUrl: 'http://localhost:3000',
}

// Create sender instance
const sender = new EmailSender(testConfig, 'resend')

/**
 * Test 1: Send single email to Resend test address
 */
async function testSingleEmail() {
  console.log('\n📧 Test 1: Sending single email...')

  try {
    const result = await sender.send({
      to: 'delivered@resend.dev', // Resend test email
      template: TestEmail,
      data: { name: 'Developer', message: 'Testing single email send functionality.' },
    })

    console.log('✅ Result:', result)

    if (result.success) {
      console.log('✅ Email sent successfully! Message ID:', result.messageId)
    } else {
      console.error('❌ Email failed:', result.error)
    }
  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

/**
 * Test 2: Send bulk emails
 */
async function testBulkEmails() {
  console.log('\n📧 Test 2: Sending bulk emails (25 emails)...')

  try {
    const emails = Array.from({ length: 25 }, (_, i) => ({
      to: 'delivered@resend.dev',
      template: TestEmail,
      data: {
        name: `User ${i + 1}`,
        message: `This is bulk email #${i + 1} of 25.`,
      },
    }))

    const result = await sender.sendBulk(emails)

    console.log('✅ Bulk Result:')
    console.log(`   Total: ${result.total}`)
    console.log(`   Succeeded: ${result.succeeded}`)
    console.log(`   Failed: ${result.failed}`)

    if (result.failed > 0) {
      console.log('\n❌ Failed emails:')
      result.results.forEach((r, i) => {
        if (r.status === 'rejected') {
          console.log(`   Email ${i + 1}: ${r.reason}`)
        }
      })
    }
  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

/**
 * Test 3: Send high-priority notification
 */
async function testNotification() {
  console.log('\n📧 Test 3: Sending high-priority notification...')

  try {
    const result = await sender.notify({
      to: 'delivered@resend.dev',
      template: TestEmail,
      data: {
        name: 'Admin',
        message: 'This is a high-priority notification email.',
      },
    })

    console.log('✅ Result:', result)

    if (result.success) {
      console.log('✅ Notification sent successfully! Message ID:', result.messageId)
    } else {
      console.error('❌ Notification failed:', result.error)
    }
  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

/**
 * Test 4: Send with overrides
 */
async function testWithOverrides() {
  console.log('\n📧 Test 4: Sending with configuration overrides...')

  try {
    const result = await sender.send({
      to: 'delivered@resend.dev',
      template: TestEmail,
      data: { name: 'Override Test' },
      subject: 'Custom Subject Line Override',
      cc: 'delivered@resend.dev',
      priority: 'high',
    })

    console.log('✅ Result:', result)

    if (result.success) {
      console.log('✅ Email with overrides sent! Message ID:', result.messageId)
    } else {
      console.error('❌ Email failed:', result.error)
    }
  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

/**
 * Test 5: Test bounce simulation (using Resend bounce address)
 */
async function testBounce() {
  console.log('\n📧 Test 5: Testing bounce simulation...')

  try {
    const result = await sender.send({
      to: 'bounced@resend.dev', // Resend bounce simulation
      template: TestEmail,
      data: { name: 'Bounce Test' },
    })

    console.log('✅ Result:', result)
    console.log(
      '   Note: This should succeed (Resend accepts it), but would show as bounced in dashboard'
    )
  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

/**
 * Run all tests
 */
async function runAllTests() {
  console.log('🚀 Starting @cenie/email test suite')
  console.log('=' .repeat(60))

  // Check for API key
  if (!process.env.RESEND_API_KEY) {
    console.error('❌ ERROR: RESEND_API_KEY environment variable is not set!')
    console.log('\nUsage:')
    console.log('  RESEND_API_KEY=your_key tsx packages/email/src/__tests__/send-test.ts')
    process.exit(1)
  }

  console.log('✅ RESEND_API_KEY found')
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log('=' .repeat(60))

  await testSingleEmail()
  await new Promise((resolve) => setTimeout(resolve, 1000)) // Wait 1s between tests

  await testBulkEmails()
  await new Promise((resolve) => setTimeout(resolve, 1000))

  await testNotification()
  await new Promise((resolve) => setTimeout(resolve, 1000))

  await testWithOverrides()
  await new Promise((resolve) => setTimeout(resolve, 1000))

  await testBounce()

  console.log('\n' + '=' .repeat(60))
  console.log('✅ All tests completed!')
  console.log('=' .repeat(60))
  console.log('\n💡 Check Resend dashboard at: https://resend.com/emails')
  console.log('   You should see all test emails in the logs.')
}

// Run tests
runAllTests().catch((error) => {
  console.error('❌ Test suite failed:', error)
  process.exit(1)
})
