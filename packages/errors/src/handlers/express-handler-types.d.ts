import type { ILogger } from '@cenie/logger'

declare global {
  namespace Express {
    interface Request {
      log: ILogger
    }
  }
}

export {}
