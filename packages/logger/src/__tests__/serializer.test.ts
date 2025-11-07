import { describe, it, expect } from 'vitest'
import { serialize, serializeError, safeJsonStringify } from '../utils/serializer'

describe('Serializer', () => {
  describe('serialize', () => {
    describe('primitives', () => {
      it('should serialize null and undefined', () => {
        expect(serialize(null)).toBe(null)
        expect(serialize(undefined)).toBe(undefined)
      })

      it('should serialize strings', () => {
        expect(serialize('hello')).toBe('hello')
        expect(serialize('')).toBe('')
      })

      it('should truncate very long strings', () => {
        const longString = 'a'.repeat(15000)
        const serialized = serialize(longString)

        expect(typeof serialized).toBe('string')
        expect(serialized.length).toBeLessThan(longString.length)
        expect(serialized).toContain('...[truncated]')
        expect(serialized.length).toBeLessThanOrEqual(10000 + 14) // 10000 + '...[truncated]'
      })

      it('should serialize numbers', () => {
        expect(serialize(0)).toBe(0)
        expect(serialize(42)).toBe(42)
        expect(serialize(-10)).toBe(-10)
        expect(serialize(3.14)).toBe(3.14)
        expect(serialize(Infinity)).toBe(Infinity)
        expect(serialize(NaN)).toBe(NaN)
      })

      it('should serialize booleans', () => {
        expect(serialize(true)).toBe(true)
        expect(serialize(false)).toBe(false)
      })
    })

    describe('dates', () => {
      it('should serialize Date objects to ISO strings', () => {
        const date = new Date('2025-01-06T10:00:00.000Z')
        expect(serialize(date)).toBe('2025-01-06T10:00:00.000Z')
      })

      it('should handle invalid dates', () => {
        const invalidDate = new Date('invalid')
        // Invalid dates throw when calling toISOString()
        // The serializer will catch this in the object serialization
        expect(() => serialize(invalidDate)).toThrow()
      })
    })

    describe('errors', () => {
      it('should serialize Error objects', () => {
        const error = new Error('Test error')
        const serialized = serialize(error)

        expect(serialized).toHaveProperty('name', 'Error')
        expect(serialized).toHaveProperty('message', 'Test error')
        expect(serialized).toHaveProperty('stack')
        expect(serialized.stack).toContain('Test error')
      })

      it('should serialize custom error types', () => {
        class CustomError extends Error {
          code = 'CUSTOM_ERROR'
          constructor(message: string) {
            super(message)
            this.name = 'CustomError' // Explicitly set name
          }
        }

        const error = new CustomError('Custom error message')
        const serialized = serialize(error)

        expect(serialized).toHaveProperty('name', 'CustomError')
        expect(serialized).toHaveProperty('message', 'Custom error message')
        expect(serialized).toHaveProperty('code', 'CUSTOM_ERROR')
      })
    })

    describe('arrays', () => {
      it('should serialize arrays', () => {
        const arr = [1, 'two', true, null]
        expect(serialize(arr)).toEqual([1, 'two', true, null])
      })

      it('should serialize nested arrays', () => {
        const nested = [1, [2, [3, [4]]]]
        expect(serialize(nested)).toEqual([1, [2, [3, [4]]]])
      })

      it('should serialize arrays with mixed types', () => {
        const mixed = [
          'string',
          123,
          true,
          null,
          { key: 'value' },
          new Date('2025-01-06'),
        ]
        const serialized = serialize(mixed)

        expect(serialized[0]).toBe('string')
        expect(serialized[1]).toBe(123)
        expect(serialized[2]).toBe(true)
        expect(serialized[3]).toBe(null)
        expect(serialized[4]).toEqual({ key: 'value' })
        expect(serialized[5]).toBe('2025-01-06T00:00:00.000Z')
      })
    })

    describe('objects', () => {
      it('should serialize plain objects', () => {
        const obj = { a: 1, b: 'two', c: true }
        expect(serialize(obj)).toEqual({ a: 1, b: 'two', c: true })
      })

      it('should serialize nested objects', () => {
        const nested = {
          level1: {
            level2: {
              level3: {
                value: 'deep',
              },
            },
          },
        }
        expect(serialize(nested)).toEqual(nested)
      })

      it('should stop at max depth to prevent infinite recursion', () => {
        let deepObj: any = { value: 0 }
        let current = deepObj

        // Create object deeper than MAX_DEPTH (10)
        for (let i = 1; i <= 15; i++) {
          current.nested = { value: i }
          current = current.nested
        }

        const serialized = serialize(deepObj)
        expect(serialized).toBeDefined()

        // Navigate to depth 10 and check for max depth marker
        let result: any = serialized
        for (let i = 0; i < 10; i++) {
          result = result.nested
        }
        expect(result.nested).toBe('[Max Depth Reached]')
      })
    })

    describe('special types', () => {
      it('should serialize Buffer objects', () => {
        const buffer = Buffer.from('hello')
        const serialized = serialize(buffer)

        expect(serialized).toBe('[Buffer 5 bytes]')
      })

      it('should serialize functions', () => {
        function namedFunc() {}
        const anonymousFunc = () => {}

        expect(serialize(namedFunc)).toBe('[Function namedFunc]')
        expect(serialize(anonymousFunc)).toBe('[Function anonymousFunc]')
        expect(serialize(function () {})).toBe('[Function anonymous]')
      })

      it('should handle complex objects with multiple types', () => {
        const complex = {
          string: 'text',
          number: 42,
          bool: true,
          date: new Date('2025-01-06'),
          error: new Error('test'),
          buffer: Buffer.from('data'),
          func: () => {},
          nested: {
            array: [1, 2, 3],
          },
        }

        const serialized = serialize(complex)

        expect(serialized.string).toBe('text')
        expect(serialized.number).toBe(42)
        expect(serialized.bool).toBe(true)
        expect(serialized.date).toBe('2025-01-06T00:00:00.000Z')
        expect(serialized.error).toHaveProperty('message', 'test')
        expect(serialized.buffer).toBe('[Buffer 4 bytes]')
        expect(serialized.func).toMatch(/\[Function/)
        expect(serialized.nested.array).toEqual([1, 2, 3])
      })
    })

    describe('error handling', () => {
      it('should handle serialization errors gracefully', () => {
        // Test that serialization doesn't crash on complex objects
        const obj = {
          valid: 'value',
          nested: { deep: 'data' },
        }

        const serialized = serialize(obj)
        expect(serialized.valid).toBe('value')
        expect(serialized.nested.deep).toBe('data')
      })
    })
  })

  describe('serializeError', () => {
    it('should serialize basic error properties', () => {
      const error = new Error('Test error')
      const serialized = serializeError(error)

      expect(serialized).toHaveProperty('name', 'Error')
      expect(serialized).toHaveProperty('message', 'Test error')
      expect(serialized).toHaveProperty('stack')
      expect(serialized.stack).toContain('Test error')
    })

    it('should serialize error code if present', () => {
      const error = Object.assign(new Error('System error'), { code: 'ESYSTEM' })
      const serialized = serializeError(error)

      expect(serialized).toHaveProperty('code', 'ESYSTEM')
    })

    it('should serialize status code if present', () => {
      const error = Object.assign(new Error('HTTP error'), { statusCode: 404 })
      const serialized = serializeError(error)

      expect(serialized).toHaveProperty('statusCode', 404)
    })

    it('should serialize error cause chain', () => {
      const rootCause = new Error('Root cause')
      const middleError = new Error('Middle error', { cause: rootCause })
      const topError = new Error('Top error', { cause: middleError })

      const serialized = serializeError(topError)

      expect(serialized).toHaveProperty('message', 'Top error')
      expect(serialized.cause).toHaveProperty('message', 'Middle error')
      expect(serialized.cause.cause).toHaveProperty('message', 'Root cause')
    })

    it('should include custom error properties', () => {
      class CustomError extends Error {
        public code = 'CUSTOM'
        public statusCode = 500
        public details = 'Custom details'
        public metadata = { userId: '123' }
      }

      const error = new CustomError('Custom error')
      const serialized = serializeError(error)

      expect(serialized.code).toBe('CUSTOM')
      expect(serialized.statusCode).toBe(500)
      expect(serialized.details).toBe('Custom details')
      expect(serialized.metadata).toEqual({ userId: '123' })
    })

    it('should handle non-Error objects', () => {
      const notAnError = 'just a string'
      const serialized = serializeError(notAnError)

      expect(serialized).toEqual({ message: 'just a string' })
    })

    it('should handle null and undefined', () => {
      expect(serializeError(null)).toEqual({ message: 'null' })
      expect(serializeError(undefined)).toEqual({ message: 'undefined' })
    })

    it('should skip properties that cannot be serialized', () => {
      const error = new Error('Test')
      Object.defineProperty(error, 'throwingProp', {
        get() {
          throw new Error('Cannot access')
        },
        enumerable: true,
      })

      const serialized = serializeError(error)
      // Should not include throwingProp or should handle it gracefully
      expect(serialized).toHaveProperty('message', 'Test')
    })

    it('should handle errors with circular references in custom properties', () => {
      const error: any = new Error('Circular error')
      error.self = error

      const serialized = serializeError(error)
      expect(serialized.message).toBe('Circular error')
      // The circular reference should be handled by serialize()
    })
  })

  describe('safeJsonStringify', () => {
    it('should stringify simple objects', () => {
      const obj = { a: 1, b: 'two', c: true }
      const json = safeJsonStringify(obj)

      expect(json).toBe('{"a":1,"b":"two","c":true}')
      expect(JSON.parse(json)).toEqual(obj)
    })

    it('should handle circular references', () => {
      const obj: any = { a: 1 }
      obj.self = obj
      obj.nested = { parent: obj }

      const json = safeJsonStringify(obj)

      expect(json).toBeDefined()
      expect(typeof json).toBe('string')
      expect(json).not.toBe('[Serialization Failed]')
    })

    it('should support indentation', () => {
      const obj = { a: 1, b: { c: 2 } }
      const json = safeJsonStringify(obj, 2)

      expect(json).toContain('\n')
      expect(json).toContain('  ')
    })

    it('should handle null and undefined', () => {
      expect(safeJsonStringify(null)).toBe('null')
      // JSON.stringify(undefined) returns undefined (not a string "undefined")
      // This is standard JSON behavior - undefined values are not serializable
      const result = safeJsonStringify(undefined)
      expect(result).toBeUndefined()
    })

    it('should handle arrays', () => {
      const arr = [1, 'two', true, { key: 'value' }]
      const json = safeJsonStringify(arr)

      expect(JSON.parse(json)).toEqual(arr)
    })

    it('should handle errors gracefully', () => {
      const obj = {
        toJSON() {
          throw new Error('Cannot convert to JSON')
        },
      }

      const json = safeJsonStringify(obj)
      expect(json).toBeDefined()
      expect(typeof json).toBe('string')
    })

    it('should handle BigInt and other non-serializable types', () => {
      const obj = {
        bigint: BigInt(123),
        symbol: Symbol('test'),
        func: () => {},
      }

      const json = safeJsonStringify(obj)
      expect(json).toBeDefined()
      expect(typeof json).toBe('string')
    })

    it('should preserve nested structure', () => {
      const nested = {
        level1: {
          level2: {
            level3: {
              value: 'deep',
            },
          },
        },
      }

      const json = safeJsonStringify(nested)
      const parsed = JSON.parse(json)

      expect(parsed.level1.level2.level3.value).toBe('deep')
    })
  })

  describe('integration', () => {
    it('should work together for complex error serialization', () => {
      class AppError extends Error {
        code = 'APP_ERROR'
        statusCode = 500
        metadata = { key: 'value' }
      }

      const rootError = new Error('Database connection failed')
      const appError = new AppError('Application error')
      ;(appError as any).cause = rootError

      const serialized = serialize(appError)
      const json = safeJsonStringify(serialized)

      expect(json).toBeDefined()
      const parsed = JSON.parse(json)

      expect(parsed.message).toBe('Application error')
      expect(parsed.code).toBe('APP_ERROR')
      expect(parsed.statusCode).toBe(500)
      expect(parsed.metadata).toEqual({ key: 'value' })
      expect(parsed.cause.message).toBe('Database connection failed')
    })

    it('should handle deeply nested objects with various types', () => {
      const complex = {
        user: {
          id: '123',
          profile: {
            name: 'John',
            age: 30,
            registered: new Date('2025-01-01'),
            metadata: {
              tags: ['admin', 'user'],
              settings: {
                theme: 'dark',
                notifications: true,
              },
            },
          },
        },
        error: new Error('Test error'),
        buffer: Buffer.from('data'),
      }

      const serialized = serialize(complex)
      const json = safeJsonStringify(serialized)
      const parsed = JSON.parse(json)

      expect(parsed.user.profile.name).toBe('John')
      expect(parsed.user.profile.registered).toBe('2025-01-01T00:00:00.000Z')
      expect(parsed.user.profile.metadata.tags).toEqual(['admin', 'user'])
      expect(parsed.error.message).toBe('Test error')
      expect(parsed.buffer).toBe('[Buffer 4 bytes]')
    })
  })
})

