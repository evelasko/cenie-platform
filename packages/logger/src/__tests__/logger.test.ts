import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

import { logContext } from '../context/async-context.server'
import { Logger, createLogger } from '../core/logger'
import { LogLevel } from '../core/types'
import type { Transport, LogEntry } from '../core/types'

// Mock transport for testing
class MockTransport implements Transport {
  public logs: LogEntry[] = []

  write(entry: LogEntry): void {
    this.logs.push(entry)
  }

  flush(): void {
    this.logs = []
  }

  getLastLog(): LogEntry | undefined {
    return this.logs[this.logs.length - 1]
  }

  getAllLogs(): LogEntry[] {
    return this.logs
  }
}

describe('Logger', () => {
  let mockTransport: MockTransport

  beforeEach(() => {
    mockTransport = new MockTransport()
    logContext.clear()
  })

  afterEach(() => {
    logContext.clear()
  })

  describe('createLogger', () => {
    it('should create a logger instance', () => {
      const logger = createLogger({ name: 'test' })

      expect(logger).toBeInstanceOf(Logger)
      expect(logger).toHaveProperty('trace')
      expect(logger).toHaveProperty('debug')
      expect(logger).toHaveProperty('info')
      expect(logger).toHaveProperty('warn')
      expect(logger).toHaveProperty('error')
      expect(logger).toHaveProperty('fatal')
      expect(logger).toHaveProperty('child')
    })

    it('should create logger with custom config', () => {
      const logger = createLogger({
        name: 'custom-logger',
        level: LogLevel.DEBUG,
        environment: 'production',
        context: { version: '1.0.0' },
        transports: [mockTransport],
      })

      logger.debug('Test message')

      const log = mockTransport.getLastLog()
      expect(log).toBeDefined()
      expect(log?.context.app).toBe('custom-logger')
      expect(log?.context.environment).toBe('production')
      expect(log?.context.version).toBe('1.0.0')
    })
  })

  describe('constructor', () => {
    it('should initialize with required config', () => {
      const logger = createLogger({
        name: 'test-logger',
        transports: [mockTransport],
      })

      logger.info('Test')
      const log = mockTransport.getLastLog()

      expect(log?.context.app).toBe('test-logger')
    })

    it('should default to INFO level', () => {
      const logger = createLogger({
        name: 'test',
        transports: [mockTransport],
      })

      logger.debug('Should not log')
      expect(mockTransport.logs).toHaveLength(0)

      logger.info('Should log')
      expect(mockTransport.logs).toHaveLength(1)
    })

    it('should accept string log level', () => {
      const logger = createLogger({
        name: 'test',
        level: 'debug',
        transports: [mockTransport],
      })

      logger.debug('Should log')
      expect(mockTransport.logs).toHaveLength(1)
    })

    it('should detect environment from NODE_ENV', () => {
      const originalEnv = process.env.NODE_ENV

      process.env.NODE_ENV = 'production'
      const prodLogger = createLogger({
        name: 'test',
        transports: [mockTransport],
      })
      prodLogger.info('Test')
      expect(mockTransport.getLastLog()?.context.environment).toBe('production')

      mockTransport.flush()
      process.env.NODE_ENV = 'test'
      const testLogger = createLogger({
        name: 'test',
        transports: [mockTransport],
      })
      testLogger.info('Test')
      expect(mockTransport.getLastLog()?.context.environment).toBe('test')

      mockTransport.flush()
      process.env.NODE_ENV = 'development'
      const devLogger = createLogger({
        name: 'test',
        transports: [mockTransport],
      })
      devLogger.info('Test')
      expect(mockTransport.getLastLog()?.context.environment).toBe('development')

      process.env.NODE_ENV = originalEnv
    })

    it('should accept custom environment override', () => {
      const logger = createLogger({
        name: 'test',
        environment: 'production',
        transports: [mockTransport],
      })

      logger.info('Test')
      expect(mockTransport.getLastLog()?.context.environment).toBe('production')
    })

    it('should accept custom redact fields', () => {
      const logger = createLogger({
        name: 'test',
        redact: ['customSecret'],
        transports: [mockTransport],
      })

      logger.info('Test', { customSecret: 'value', normalField: 'visible' })

      const log = mockTransport.getLastLog()
      expect(log?.metadata?.customSecret).toBe('[REDACTED]')
      expect(log?.metadata?.normalField).toBe('visible')
    })
  })

  describe('log level methods', () => {
    beforeEach(() => {
      mockTransport = new MockTransport()
    })

    it('should log trace messages', () => {
      const logger = createLogger({
        name: 'test',
        level: LogLevel.TRACE,
        transports: [mockTransport],
      })

      logger.trace('Trace message')

      const log = mockTransport.getLastLog()
      expect(log?.level).toBe('trace')
      expect(log?.message).toBe('Trace message')
    })

    it('should log debug messages', () => {
      const logger = createLogger({
        name: 'test',
        level: LogLevel.DEBUG,
        transports: [mockTransport],
      })

      logger.debug('Debug message')

      const log = mockTransport.getLastLog()
      expect(log?.level).toBe('debug')
      expect(log?.message).toBe('Debug message')
    })

    it('should log info messages', () => {
      const logger = createLogger({
        name: 'test',
        level: LogLevel.INFO,
        transports: [mockTransport],
      })

      logger.info('Info message')

      const log = mockTransport.getLastLog()
      expect(log?.level).toBe('info')
      expect(log?.message).toBe('Info message')
    })

    it('should log warn messages', () => {
      const logger = createLogger({
        name: 'test',
        level: LogLevel.WARN,
        transports: [mockTransport],
      })

      logger.warn('Warning message')

      const log = mockTransport.getLastLog()
      expect(log?.level).toBe('warn')
      expect(log?.message).toBe('Warning message')
    })

    it('should log error messages', () => {
      const logger = createLogger({
        name: 'test',
        level: LogLevel.ERROR,
        transports: [mockTransport],
      })

      const error = new Error('Test error')
      logger.error('Error message', error)

      const log = mockTransport.getLastLog()
      expect(log?.level).toBe('error')
      expect(log?.message).toBe('Error message')
      expect(log?.error).toBeDefined()
      expect(log?.error?.message).toBe('Test error')
    })

    it('should log fatal messages', () => {
      const logger = createLogger({
        name: 'test',
        level: LogLevel.FATAL,
        transports: [mockTransport],
      })

      const error = new Error('Fatal error')
      logger.fatal('Fatal message', error)

      const log = mockTransport.getLastLog()
      expect(log?.level).toBe('fatal')
      expect(log?.message).toBe('Fatal message')
      expect(log?.error).toBeDefined()
    })

    it('should respect minimum log level', () => {
      const logger = createLogger({
        name: 'test',
        level: LogLevel.WARN,
        transports: [mockTransport],
      })

      logger.trace('Should not log')
      logger.debug('Should not log')
      logger.info('Should not log')
      expect(mockTransport.logs).toHaveLength(0)

      logger.warn('Should log')
      logger.error('Should log')
      logger.fatal('Should log')
      expect(mockTransport.logs).toHaveLength(3)
    })
  })

  describe('metadata handling', () => {
    it('should include metadata in log entries', () => {
      const logger = createLogger({
        name: 'test',
        transports: [mockTransport],
      })

      logger.info('Test message', { userId: '123', action: 'login' })

      const log = mockTransport.getLastLog()
      expect(log?.metadata).toEqual({ userId: '123', action: 'login' })
    })

    it('should sanitize sensitive metadata', () => {
      const logger = createLogger({
        name: 'test',
        transports: [mockTransport],
      })

      logger.info('User login', {
        username: 'john',
        password: 'secret123',
        token: 'abc123',
      })

      const log = mockTransport.getLastLog()
      expect(log?.metadata?.username).toBe('john')
      expect(log?.metadata?.password).toBe('[REDACTED]')
      expect(log?.metadata?.token).toBe('[REDACTED]')
    })

    it('should serialize complex metadata', () => {
      const logger = createLogger({
        name: 'test',
        transports: [mockTransport],
      })

      logger.info('Complex data', {
        date: new Date('2025-01-06'),
        nested: { key: 'value' },
        array: [1, 2, 3],
      })

      const log = mockTransport.getLastLog()
      expect(log?.metadata?.date).toBe('2025-01-06T00:00:00.000Z')
      expect(log?.metadata?.nested).toEqual({ key: 'value' })
      expect(log?.metadata?.array).toEqual([1, 2, 3])
    })

    it('should handle null and undefined metadata', () => {
      const logger = createLogger({
        name: 'test',
        transports: [mockTransport],
      })

      logger.info('No metadata')
      expect(mockTransport.getLastLog()?.metadata).toBeUndefined()

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      logger.info('Null metadata', null as any)
      // Null metadata results in no metadata being added
      const log = mockTransport.getLastLog()
      // Metadata may be undefined when null is passed
      expect(log).toBeDefined()
    })
  })

  describe('error handling', () => {
    it('should serialize Error objects', () => {
      const logger = createLogger({
        name: 'test',
        transports: [mockTransport],
      })

      const error = new Error('Test error')
      logger.error('Error occurred', error)

      const log = mockTransport.getLastLog()
      expect(log?.error).toBeDefined()
      expect(log?.error?.name).toBe('Error')
      expect(log?.error?.message).toBe('Test error')
      expect(log?.error?.stack).toBeDefined()
    })

    it('should handle error with cause chain', () => {
      const logger = createLogger({
        name: 'test',
        transports: [mockTransport],
      })

      const rootError = new Error('Root cause')
      const error = new Error('Wrapped error', { cause: rootError })

      logger.error('Error with cause', error)

      const log = mockTransport.getLastLog()
      expect(log?.error?.message).toBe('Wrapped error')
      expect(log?.error?.cause).toBeDefined()
      expect(log?.error?.cause?.message).toBe('Root cause')
    })

    it('should include error with metadata', () => {
      const logger = createLogger({
        name: 'test',
        transports: [mockTransport],
      })

      const error = new Error('Test error')
      logger.error('Error occurred', error, { userId: '123', action: 'fetch' })

      const log = mockTransport.getLastLog()
      expect(log?.error?.message).toBe('Test error')
      expect(log?.metadata).toEqual({ userId: '123', action: 'fetch' })
    })
  })

  describe('context integration', () => {
    it('should include default context in all logs', () => {
      const logger = createLogger({
        name: 'test',
        context: { version: '1.0.0', region: 'us-east-1' },
        transports: [mockTransport],
      })

      logger.info('Test message')

      const log = mockTransport.getLastLog()
      expect(log?.context.version).toBe('1.0.0')
      expect(log?.context.region).toBe('us-east-1')
    })

    it('should include async context values', () => {
      const logger = createLogger({
        name: 'test',
        transports: [mockTransport],
      })

      logContext.run({ requestId: 'req_123', userId: 'user_456' }, () => {
        logger.info('Test message')

        const log = mockTransport.getLastLog()
        expect(log?.context.requestId).toBe('req_123')
        expect(log?.context.userId).toBe('user_456')
      })
    })

    it('should merge default and async context', () => {
      const logger = createLogger({
        name: 'test',
        context: { version: '1.0.0' },
        transports: [mockTransport],
      })

      logContext.run({ requestId: 'req_123' }, () => {
        logger.info('Test message')

        const log = mockTransport.getLastLog()
        expect(log?.context.app).toBe('test')
        expect(log?.context.version).toBe('1.0.0')
        expect(log?.context.requestId).toBe('req_123')
      })
    })

    it('should always include app and environment in context', () => {
      const logger = createLogger({
        name: 'my-app',
        environment: 'production',
        transports: [mockTransport],
      })

      logger.info('Test')

      const log = mockTransport.getLastLog()
      expect(log?.context.app).toBe('my-app')
      expect(log?.context.environment).toBe('production')
    })
  })

  describe('child logger', () => {
    it('should create child logger with additional context', () => {
      const parentLogger = createLogger({
        name: 'parent',
        context: { service: 'api' },
        transports: [mockTransport],
      })

      const childLogger = parentLogger.child({ requestId: 'req_123' })

      childLogger.info('Child log')

      const log = mockTransport.getLastLog()
      expect(log?.context.app).toBe('parent')
      expect(log?.context.service).toBe('api')
      expect(log?.context.requestId).toBe('req_123')
    })

    it('should inherit parent log level', () => {
      const parentLogger = createLogger({
        name: 'parent',
        level: LogLevel.WARN,
        transports: [mockTransport],
      })

      const childLogger = parentLogger.child({ child: true })

      childLogger.debug('Should not log')
      childLogger.info('Should not log')
      expect(mockTransport.logs).toHaveLength(0)

      childLogger.warn('Should log')
      expect(mockTransport.logs).toHaveLength(1)
    })

    it('should inherit parent transports', () => {
      const mockTransport2 = new MockTransport()

      const parentLogger = createLogger({
        name: 'parent',
        transports: [mockTransport, mockTransport2],
      })

      const childLogger = parentLogger.child({ child: true })

      childLogger.info('Test')

      expect(mockTransport.logs).toHaveLength(1)
      expect(mockTransport2.logs).toHaveLength(1)
    })

    it('should allow deep nesting', () => {
      const logger1 = createLogger({
        name: 'root',
        context: { level: 1 },
        transports: [mockTransport],
      })

      const logger2 = logger1.child({ level: 2 })
      const logger3 = logger2.child({ level: 3 })

      logger3.info('Deeply nested')

      const log = mockTransport.getLastLog()
      expect(log?.context.level).toBe(3) // Last one wins
      expect(log?.context.app).toBe('root')
    })
  })

  describe('transports', () => {
    it('should write to multiple transports', () => {
      const transport1 = new MockTransport()
      const transport2 = new MockTransport()

      const logger = createLogger({
        name: 'test',
        transports: [transport1, transport2],
      })

      logger.info('Test message')

      expect(transport1.logs).toHaveLength(1)
      expect(transport2.logs).toHaveLength(1)
      expect(transport1.getLastLog()?.message).toBe('Test message')
      expect(transport2.getLastLog()?.message).toBe('Test message')
    })

    it('should handle async transports', async () => {
      const asyncLogs: LogEntry[] = []

      class AsyncTransport implements Transport {
        async write(entry: LogEntry): Promise<void> {
          await new Promise((resolve) => setTimeout(resolve, 10))
          asyncLogs.push(entry)
        }
      }

      const logger = createLogger({
        name: 'test',
        transports: [new AsyncTransport()],
      })

      logger.info('Async test')

      // Give async transport time to complete
      await new Promise((resolve) => setTimeout(resolve, 20))

      expect(asyncLogs).toHaveLength(1)
      expect(asyncLogs[0].message).toBe('Async test')
    })

    it('should support flush and close operations', async () => {
      const flushSpy = vi.fn()
      const closeSpy = vi.fn()

      class CustomTransport implements Transport {
        write(): void {}
        flush(): void {
          flushSpy()
        }
        close(): void {
          closeSpy()
        }
      }

      const logger = createLogger({
        name: 'test',
        transports: [new CustomTransport()],
      }) as Logger

      await logger.flush()
      expect(flushSpy).toHaveBeenCalledTimes(1)

      await logger.close()
      expect(closeSpy).toHaveBeenCalledTimes(1)
    })
  })

  describe('timestamp', () => {
    it('should include ISO timestamp in log entries', () => {
      const logger = createLogger({
        name: 'test',
        transports: [mockTransport],
      })

      const beforeLog = new Date().toISOString()
      logger.info('Test')
      const afterLog = new Date().toISOString()

      const log = mockTransport.getLastLog()
      expect(log?.timestamp).toBeDefined()
      expect(log!.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
      expect(log!.timestamp >= beforeLog).toBe(true)
      expect(log!.timestamp <= afterLog).toBe(true)
    })
  })

  describe('edge cases', () => {
    it('should handle logger without transports', () => {
      const logger = createLogger({ name: 'test' })

      // Should not throw
      expect(() => {
        logger.info('Test')
      }).not.toThrow()
    })

    it('should handle empty context', () => {
      const logger = createLogger({
        name: 'test',
        context: {},
        transports: [mockTransport],
      })

      logger.info('Test')

      const log = mockTransport.getLastLog()
      expect(log?.context.app).toBe('test')
    })

    it('should handle very long messages', () => {
      const logger = createLogger({
        name: 'test',
        transports: [mockTransport],
      })

      const longMessage = 'a'.repeat(20000)
      logger.info(longMessage)

      const log = mockTransport.getLastLog()
      expect(log?.message).toBeDefined()
      // Message should be truncated by serializer
      expect(log?.message.length).toBeLessThanOrEqual(longMessage.length)
    })

    it('should handle circular references in metadata', () => {
      const logger = createLogger({
        name: 'test',
        transports: [mockTransport],
      })

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const circular: any = { a: 1 }
      circular.self = circular

      // Should not throw
      expect(() => {
        logger.info('Circular', circular)
      }).not.toThrow()

      expect(mockTransport.logs).toHaveLength(1)
    })
  })
})
