import type { EmailResult } from '../core/types'

export interface ProviderSendOptions {
  to: string | string[]
  subject: string
  html: string
  from: { name: string; email: string }
  replyTo?: { name: string; email: string }
  priority?: 'normal' | 'high'
  cc?: string | string[]
  bcc?: string | string[]
}

export interface EmailProvider {
  send(options: ProviderSendOptions): Promise<EmailResult>
}
