import { describe, it, expect } from 'vitest'
import { parseLogLevel, getLogLevelName, shouldLog } from '../core/levels'
import { LogLevel } from '../core/types'

describe('Log Levels', () => {
  describe('parseLogLevel', () => {
    it('should parse string log levels', () => {
      expect(parseLogLevel('trace')).toBe(LogLevel.TRACE)
      expect(parseLogLevel('debug')).toBe(LogLevel.DEBUG)
      expect(parseLogLevel('info')).toBe(LogLevel.INFO)
      expect(parseLogLevel('warn')).toBe(LogLevel.WARN)
      expect(parseLogLevel('error')).toBe(LogLevel.ERROR)
      expect(parseLogLevel('fatal')).toBe(LogLevel.FATAL)
    })

    it('should be case insensitive', () => {
      expect(parseLogLevel('TRACE')).toBe(LogLevel.TRACE)
      expect(parseLogLevel('Debug')).toBe(LogLevel.DEBUG)
      expect(parseLogLevel('INFO')).toBe(LogLevel.INFO)
      expect(parseLogLevel('WaRn')).toBe(LogLevel.WARN)
    })

    it('should pass through numeric log levels', () => {
      expect(parseLogLevel(LogLevel.TRACE)).toBe(LogLevel.TRACE)
      expect(parseLogLevel(LogLevel.DEBUG)).toBe(LogLevel.DEBUG)
      expect(parseLogLevel(LogLevel.INFO)).toBe(LogLevel.INFO)
      expect(parseLogLevel(LogLevel.WARN)).toBe(LogLevel.WARN)
      expect(parseLogLevel(LogLevel.ERROR)).toBe(LogLevel.ERROR)
      expect(parseLogLevel(LogLevel.FATAL)).toBe(LogLevel.FATAL)
    })

    it('should pass through explicit numeric values', () => {
      expect(parseLogLevel(0)).toBe(0)
      expect(parseLogLevel(10)).toBe(10)
      expect(parseLogLevel(20)).toBe(20)
      expect(parseLogLevel(30)).toBe(30)
      expect(parseLogLevel(40)).toBe(40)
      expect(parseLogLevel(50)).toBe(50)
    })

    it('should default to INFO for invalid string levels', () => {
      expect(parseLogLevel('invalid')).toBe(LogLevel.INFO)
      expect(parseLogLevel('unknown')).toBe(LogLevel.INFO)
      expect(parseLogLevel('')).toBe(LogLevel.INFO)
    })

    it('should handle all valid level names', () => {
      const validLevels = ['trace', 'debug', 'info', 'warn', 'error', 'fatal']
      const expectedValues = [
        LogLevel.TRACE,
        LogLevel.DEBUG,
        LogLevel.INFO,
        LogLevel.WARN,
        LogLevel.ERROR,
        LogLevel.FATAL,
      ]

      validLevels.forEach((level, index) => {
        expect(parseLogLevel(level)).toBe(expectedValues[index])
      })
    })
  })

  describe('getLogLevelName', () => {
    it('should convert log levels to names', () => {
      expect(getLogLevelName(LogLevel.TRACE)).toBe('trace')
      expect(getLogLevelName(LogLevel.DEBUG)).toBe('debug')
      expect(getLogLevelName(LogLevel.INFO)).toBe('info')
      expect(getLogLevelName(LogLevel.WARN)).toBe('warn')
      expect(getLogLevelName(LogLevel.ERROR)).toBe('error')
      expect(getLogLevelName(LogLevel.FATAL)).toBe('fatal')
    })

    it('should convert numeric values to names', () => {
      expect(getLogLevelName(0)).toBe('trace')
      expect(getLogLevelName(10)).toBe('debug')
      expect(getLogLevelName(20)).toBe('info')
      expect(getLogLevelName(30)).toBe('warn')
      expect(getLogLevelName(40)).toBe('error')
      expect(getLogLevelName(50)).toBe('fatal')
    })

    it('should default to info for unknown levels', () => {
      expect(getLogLevelName(999 as LogLevel)).toBe('info')
      expect(getLogLevelName(-1 as LogLevel)).toBe('info')
    })

    it('should be inverse of parseLogLevel for valid levels', () => {
      const levels = ['trace', 'debug', 'info', 'warn', 'error', 'fatal'] as const

      levels.forEach((level) => {
        const numericLevel = parseLogLevel(level)
        const convertedBack = getLogLevelName(numericLevel)
        expect(convertedBack).toBe(level)
      })
    })
  })

  describe('shouldLog', () => {
    it('should allow logging at or above minimum level', () => {
      // When min level is INFO (20)
      expect(shouldLog(LogLevel.TRACE, LogLevel.INFO)).toBe(false)
      expect(shouldLog(LogLevel.DEBUG, LogLevel.INFO)).toBe(false)
      expect(shouldLog(LogLevel.INFO, LogLevel.INFO)).toBe(true)
      expect(shouldLog(LogLevel.WARN, LogLevel.INFO)).toBe(true)
      expect(shouldLog(LogLevel.ERROR, LogLevel.INFO)).toBe(true)
      expect(shouldLog(LogLevel.FATAL, LogLevel.INFO)).toBe(true)
    })

    it('should work with TRACE minimum level', () => {
      // When min level is TRACE (0), everything should log
      expect(shouldLog(LogLevel.TRACE, LogLevel.TRACE)).toBe(true)
      expect(shouldLog(LogLevel.DEBUG, LogLevel.TRACE)).toBe(true)
      expect(shouldLog(LogLevel.INFO, LogLevel.TRACE)).toBe(true)
      expect(shouldLog(LogLevel.WARN, LogLevel.TRACE)).toBe(true)
      expect(shouldLog(LogLevel.ERROR, LogLevel.TRACE)).toBe(true)
      expect(shouldLog(LogLevel.FATAL, LogLevel.TRACE)).toBe(true)
    })

    it('should work with FATAL minimum level', () => {
      // When min level is FATAL (50), only FATAL should log
      expect(shouldLog(LogLevel.TRACE, LogLevel.FATAL)).toBe(false)
      expect(shouldLog(LogLevel.DEBUG, LogLevel.FATAL)).toBe(false)
      expect(shouldLog(LogLevel.INFO, LogLevel.FATAL)).toBe(false)
      expect(shouldLog(LogLevel.WARN, LogLevel.FATAL)).toBe(false)
      expect(shouldLog(LogLevel.ERROR, LogLevel.FATAL)).toBe(false)
      expect(shouldLog(LogLevel.FATAL, LogLevel.FATAL)).toBe(true)
    })

    it('should work with ERROR minimum level', () => {
      expect(shouldLog(LogLevel.DEBUG, LogLevel.ERROR)).toBe(false)
      expect(shouldLog(LogLevel.INFO, LogLevel.ERROR)).toBe(false)
      expect(shouldLog(LogLevel.WARN, LogLevel.ERROR)).toBe(false)
      expect(shouldLog(LogLevel.ERROR, LogLevel.ERROR)).toBe(true)
      expect(shouldLog(LogLevel.FATAL, LogLevel.ERROR)).toBe(true)
    })

    it('should work with WARN minimum level', () => {
      expect(shouldLog(LogLevel.DEBUG, LogLevel.WARN)).toBe(false)
      expect(shouldLog(LogLevel.INFO, LogLevel.WARN)).toBe(false)
      expect(shouldLog(LogLevel.WARN, LogLevel.WARN)).toBe(true)
      expect(shouldLog(LogLevel.ERROR, LogLevel.WARN)).toBe(true)
      expect(shouldLog(LogLevel.FATAL, LogLevel.WARN)).toBe(true)
    })

    it('should work with DEBUG minimum level', () => {
      expect(shouldLog(LogLevel.TRACE, LogLevel.DEBUG)).toBe(false)
      expect(shouldLog(LogLevel.DEBUG, LogLevel.DEBUG)).toBe(true)
      expect(shouldLog(LogLevel.INFO, LogLevel.DEBUG)).toBe(true)
      expect(shouldLog(LogLevel.WARN, LogLevel.DEBUG)).toBe(true)
      expect(shouldLog(LogLevel.ERROR, LogLevel.DEBUG)).toBe(true)
      expect(shouldLog(LogLevel.FATAL, LogLevel.DEBUG)).toBe(true)
    })

    it('should use numeric comparison', () => {
      // Numeric values should work the same way
      expect(shouldLog(10, 20)).toBe(false) // DEBUG < INFO
      expect(shouldLog(20, 20)).toBe(true) // INFO === INFO
      expect(shouldLog(30, 20)).toBe(true) // WARN > INFO
    })
  })

  describe('Log level hierarchy', () => {
    it('should maintain correct numeric hierarchy', () => {
      expect(LogLevel.TRACE).toBeLessThan(LogLevel.DEBUG)
      expect(LogLevel.DEBUG).toBeLessThan(LogLevel.INFO)
      expect(LogLevel.INFO).toBeLessThan(LogLevel.WARN)
      expect(LogLevel.WARN).toBeLessThan(LogLevel.ERROR)
      expect(LogLevel.ERROR).toBeLessThan(LogLevel.FATAL)
    })

    it('should have correct absolute values', () => {
      expect(LogLevel.TRACE).toBe(0)
      expect(LogLevel.DEBUG).toBe(10)
      expect(LogLevel.INFO).toBe(20)
      expect(LogLevel.WARN).toBe(30)
      expect(LogLevel.ERROR).toBe(40)
      expect(LogLevel.FATAL).toBe(50)
    })

    it('should support custom levels between standard ones', () => {
      // Custom level between DEBUG (10) and INFO (20)
      const customLevel = 15

      expect(shouldLog(customLevel, LogLevel.DEBUG)).toBe(true)
      expect(shouldLog(customLevel, LogLevel.INFO)).toBe(false)
      expect(shouldLog(LogLevel.DEBUG, customLevel)).toBe(false)
      expect(shouldLog(LogLevel.INFO, customLevel)).toBe(true)
    })
  })
})

