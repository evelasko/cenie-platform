import { EmailSender } from '@cenie/email'
import { academyEmailConfig } from './config'

export const academyEmailSender = new EmailSender(academyEmailConfig, 'resend')

