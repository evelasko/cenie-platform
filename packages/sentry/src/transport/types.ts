export interface SentryTransportOptions {
  dsn: string
  environment?: string
  release?: string
  sampleRate?: number
  enabled?: boolean
}

export interface SentryContext {
  userId?: string
  email?: string
  appName?: string
  requestId?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

