import { EmailConfigError } from '@cenie/errors'
import { createLogger } from '@cenie/logger'
import { Resend } from 'resend'

import type { EmailResult } from '../core/types'

import type { EmailProvider, ProviderSendOptions } from './provider.interface'

export class ResendProvider implements EmailProvider {
  private resend: Resend
  private testMode: boolean
  private logger: ReturnType<typeof createLogger>

  constructor() {
    this.logger = createLogger({ name: 'resend-provider' })

    const apiKey = process.env.RESEND_API_KEY

    if (!apiKey) {
      throw new EmailConfigError('RESEND_API_KEY environment variable is required')
    }

    this.resend = new Resend(apiKey)
    this.testMode = process.env.NODE_ENV === 'development'

    if (this.testMode) {
      this.logger.info('Resend initialized in TEST MODE - emails will not be sent to real inboxes')
    }
  }

  async send(options: ProviderSendOptions): Promise<EmailResult> {
    try {
      const { data, error } = await this.resend.emails.send({
        from: `${options.from.name} <${options.from.email}>`,
        to: Array.isArray(options.to) ? options.to : [options.to],
        subject: options.subject,
        html: options.html,
        reply_to: options.replyTo
          ? `${options.replyTo.name} <${options.replyTo.email}>`
          : undefined,
        cc: options.cc,
        bcc: options.bcc,
        tags: [
          { name: 'priority', value: options.priority || 'normal' },
          { name: 'environment', value: process.env.NODE_ENV || 'development' },
        ],
      })

      if (error) {
        this.logger.error('Resend API error', { error, subject: options.subject })
        return {
          success: false,
          error: error.message || 'Unknown Resend error',
        }
      }

      return {
        success: true,
        messageId: data?.id,
      }
    } catch (error) {
      this.logger.error('Resend provider error', { error })
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }
}
