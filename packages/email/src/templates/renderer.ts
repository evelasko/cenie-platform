import { createLogger } from '@cenie/logger'
import { render } from '@react-email/components'
import type { ReactElement } from 'react'

const logger = createLogger({ name: 'email-renderer' })

/**
 * Render React Email component to HTML string
 */
export async function renderEmailTemplate(element: ReactElement): Promise<string> {
  try {
    const html = await render(element, {
      pretty: process.env.NODE_ENV === 'development',
    })

    logger.debug('Email template rendered', {
      length: html.length,
      mode: process.env.NODE_ENV,
    })

    return html
  } catch (error) {
    logger.error('Email template rendering failed', { error })
    throw new Error(`Failed to render email template: ${error}`)
  }
}
