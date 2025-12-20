import { EmailSender } from '@cenie/email'
import { editorialEmailConfig } from './config'

export const editorialEmailSender = new EmailSender(editorialEmailConfig, 'resend')

