import { EmailSender } from '@cenie/email'
import { hubEmailConfig } from './config'

export const hubEmailSender = new EmailSender(hubEmailConfig, 'resend')

