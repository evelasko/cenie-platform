import { EmailSender } from '@cenie/email'
import { agencyEmailConfig } from './config'

export const agencyEmailSender = new EmailSender(agencyEmailConfig, 'resend')

