import { formatLog } from '../core/formatter'
import type { Transport, LogEntry } from '../core/types'

/**
 * Console transport configuration
 */
export interface ConsoleTransportConfig {
  prettyPrint?: boolean
}

/**
 * Console transport - writes logs to stdout/stderr
 */
export class ConsoleTransport implements Transport {
  private readonly prettyPrint: boolean

  constructor(config: ConsoleTransportConfig = {}) {
    this.prettyPrint = config.prettyPrint ?? process.env.NODE_ENV === 'development'
  }

  write(entry: LogEntry): void {
    const output = formatLog(entry, this.prettyPrint)

    // Use stderr for errors, stdout for everything else
    if (entry.level === 'error' || entry.level === 'fatal') {
      console.error(output)
    } else {
      // eslint-disable-next-line no-console
      console.info(output)
    }
  }
}
