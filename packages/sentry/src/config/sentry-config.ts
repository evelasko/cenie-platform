import type { SentryTransportOptions } from '../transport/types'

export interface CreateSentryConfigOptions {
  appName: 'hub' | 'editorial' | 'academy' | 'agency'
  dsn: string
  environment?: string
  sampleRate?: number
}

export function createSentryConfig(
  options: CreateSentryConfigOptions
): SentryTransportOptions {
  return {
    dsn: options.dsn,
    environment: options.environment || process.env.NODE_ENV || 'development',
    release: process.env.VERCEL_GIT_COMMIT_SHA || 'local',
    sampleRate: options.sampleRate || (options.environment === 'production' ? 0.1 : 1.0),
    enabled: options.environment !== 'development', // Disable in dev by default
  }
}

