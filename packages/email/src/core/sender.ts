import { EmailRenderError, EmailSendError } from '@cenie/errors'
import { createLogger } from '@cenie/logger'

import type { EmailProvider } from '../providers/provider.interface'

import type {
  BulkEmailResult,
  EmailBrandConfig,
  EmailResult,
  EmailTemplate,
  SendEmailOptions,
} from './types'

export class EmailSender {
  private provider: EmailProvider
  private logger: ReturnType<typeof createLogger>
  private config: EmailBrandConfig

  constructor(config: EmailBrandConfig, providerType: 'resend' | 'sendgrid' = 'resend') {
    this.config = config
    this.logger = createLogger({
      name: 'email-sender',
      context: { app: config.from.email },
    })

    // Provider selection - lazy load to avoid importing both
    if (providerType === 'resend') {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { ResendProvider } = require('../providers/resend')
      this.provider = new ResendProvider()
    } else {
      // SendGrid will be implemented in future
      throw new Error('SendGrid provider not yet implemented')
    }
  }

  /**
   * Send a single email
   */
  async send<T>(options: SendEmailOptions<T>): Promise<EmailResult> {
    try {
      // Determine subject
      const subject =
        options.subject ||
        (typeof options.template.subject === 'function'
          ? options.template.subject(options.data)
          : options.template.subject)

      // Render template
      this.logger.debug('Rendering email template', { template: options.template.name })
      const html = await this.renderTemplate(options.template, options.data)

      // Send via provider
      this.logger.debug('Sending email', {
        to: options.to,
        subject,
        provider: this.provider.constructor.name,
      })

      const result = await this.provider.send({
        to: options.to,
        subject,
        html,
        from: options.from || this.config.from,
        replyTo: options.replyTo || this.config.replyTo,
        priority: options.priority,
        cc: options.cc,
        bcc: options.bcc,
      })

      // Log success
      this.logger.info('Email sent successfully', {
        to: Array.isArray(options.to) ? options.to.join(',') : options.to,
        subject,
        template: options.template.name,
        messageId: result.messageId,
      })

      return result
    } catch (error) {
      this.logger.error('Failed to send email', {
        error,
        to: options.to,
        template: options.template.name,
      })

      throw new EmailSendError('Failed to send email', {
        cause: error,
        metadata: {
          to: options.to,
          template: options.template.name,
        },
      })
    }
  }

  /**
   * Send bulk emails (for newsletters, notifications, etc.)
   */
  async sendBulk<T>(emails: SendEmailOptions<T>[]): Promise<BulkEmailResult> {
    this.logger.info('Starting bulk email send', { count: emails.length })

    // Process in batches
    const batchSize = 10
    const batches: SendEmailOptions<T>[][] = []

    for (let i = 0; i < emails.length; i += batchSize) {
      batches.push(emails.slice(i, i + batchSize))
    }

    const allResults: Array<PromiseSettledResult<EmailResult>> = []

    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i]
      this.logger.debug(`Processing batch ${i + 1}/${batches.length}`, {
        batchSize: batch.length,
      })

      const batchResults = await Promise.allSettled(batch.map((email) => this.send(email)))
      allResults.push(...batchResults)

      // Rate limiting between batches
      if (i < batches.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 50))
      }
    }

    const succeeded = allResults.filter((r) => r.status === 'fulfilled').length
    const failed = allResults.filter((r) => r.status === 'rejected').length

    this.logger.info('Bulk email send completed', {
      total: emails.length,
      succeeded,
      failed,
      batchCount: batches.length,
    })

    return {
      total: emails.length,
      succeeded,
      failed,
      results: allResults,
    }
  }

  /**
   * Send high-priority notification email
   */
  async notify<T>(options: SendEmailOptions<T>): Promise<EmailResult> {
    return this.send({ ...options, priority: 'high' })
  }

  /**
   * Render email template with brand configuration
   */
  private async renderTemplate<T>(template: EmailTemplate<T>, data: T): Promise<string> {
    try {
      const { render } = await import('@react-email/components')

      const element = template.component({
        ...data,
        branding: this.config.branding,
        typography: this.config.typography,
        baseUrl: this.config.baseUrl,
      })

      return await render(element)
    } catch (error) {
      this.logger.error('Template rendering failed', {
        error,
        template: template.name,
      })

      throw new EmailRenderError('Failed to render email template', {
        cause: error,
        metadata: { template: template.name },
      })
    }
  }
}
