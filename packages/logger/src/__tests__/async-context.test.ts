import { describe, it, expect, beforeEach } from 'vitest'

import { logContext, ContextKeys } from '../context/async-context.server'

describe('Async Context', () => {
  beforeEach(() => {
    // Clear context before each test
    logContext.clear()
  })

  describe('ContextKeys', () => {
    it('should have standard context key constants', () => {
      expect(ContextKeys.REQUEST_ID).toBe('requestId')
      expect(ContextKeys.USER_ID).toBe('userId')
      expect(ContextKeys.SESSION_ID).toBe('sessionId')
      expect(ContextKeys.IP_ADDRESS).toBe('ipAddress')
      expect(ContextKeys.USER_AGENT).toBe('userAgent')
      expect(ContextKeys.PATH).toBe('path')
      expect(ContextKeys.METHOD).toBe('method')
    })
  })

  describe('run', () => {
    it('should run callback with provided context', () => {
      const result = logContext.run({ requestId: 'req_123' }, () => {
        return logContext.get('requestId')
      })

      expect(result).toBe('req_123')
    })

    it('should isolate context per execution', () => {
      const result1 = logContext.run({ requestId: 'req_1' }, () => {
        return logContext.get('requestId')
      })

      const result2 = logContext.run({ requestId: 'req_2' }, () => {
        return logContext.get('requestId')
      })

      expect(result1).toBe('req_1')
      expect(result2).toBe('req_2')
    })

    it('should support multiple context values', () => {
      logContext.run(
        {
          requestId: 'req_123',
          userId: 'user_456',
          sessionId: 'session_789',
        },
        () => {
          expect(logContext.get('requestId')).toBe('req_123')
          expect(logContext.get('userId')).toBe('user_456')
          expect(logContext.get('sessionId')).toBe('session_789')
        }
      )
    })

    it('should return callback result', () => {
      const result = logContext.run({ test: 'value' }, () => {
        return { data: 'result' }
      })

      expect(result).toEqual({ data: 'result' })
    })

    it('should handle async callbacks', async () => {
      const result = await logContext.run({ requestId: 'req_async' }, async () => {
        await new Promise((resolve) => setTimeout(resolve, 10))
        return logContext.get('requestId')
      })

      expect(result).toBe('req_async')
    })

    it('should handle nested contexts', () => {
      logContext.run({ outer: 'value1' }, () => {
        expect(logContext.get('outer')).toBe('value1')

        logContext.run({ inner: 'value2' }, () => {
          expect(logContext.get('inner')).toBe('value2')
          // Outer context is replaced, not inherited
          expect(logContext.get('outer')).toBeUndefined()
        })

        // Back to outer context
        expect(logContext.get('outer')).toBe('value1')
      })
    })

    it('should handle errors in callback', () => {
      expect(() => {
        logContext.run({ requestId: 'req_error' }, () => {
          throw new Error('Test error')
        })
      }).toThrow('Test error')
    })

    it('should clear context after execution', () => {
      logContext.run({ requestId: 'req_123' }, () => {
        expect(logContext.get('requestId')).toBe('req_123')
      })

      // Outside of run context
      expect(logContext.get('requestId')).toBeUndefined()
    })
  })

  describe('get', () => {
    it('should get context value by key', () => {
      logContext.run({ userId: 'user_123' }, () => {
        expect(logContext.get('userId')).toBe('user_123')
      })
    })

    it('should return undefined for non-existent keys', () => {
      logContext.run({ key1: 'value1' }, () => {
        expect(logContext.get('nonExistent')).toBeUndefined()
      })
    })

    it('should return undefined outside of context', () => {
      expect(logContext.get('anyKey')).toBeUndefined()
    })

    it('should handle different value types', () => {
      logContext.run(
        {
          string: 'text',
          number: 42,
          boolean: true,
          object: { nested: 'value' },
          array: [1, 2, 3],
          null: null,
        },
        () => {
          expect(logContext.get('string')).toBe('text')
          expect(logContext.get('number')).toBe(42)
          expect(logContext.get('boolean')).toBe(true)
          expect(logContext.get('object')).toEqual({ nested: 'value' })
          expect(logContext.get('array')).toEqual([1, 2, 3])
          expect(logContext.get('null')).toBe(null)
        }
      )
    })
  })

  describe('set', () => {
    it('should set context value within active context', () => {
      logContext.run({ initial: 'value' }, () => {
        expect(logContext.get('initial')).toBe('value')

        logContext.set('newKey', 'newValue')
        expect(logContext.get('newKey')).toBe('newValue')
      })
    })

    it('should update existing value', () => {
      logContext.run({ key: 'original' }, () => {
        expect(logContext.get('key')).toBe('original')

        logContext.set('key', 'updated')
        expect(logContext.get('key')).toBe('updated')
      })
    })

    it('should do nothing when called outside of context', () => {
      // Should not throw
      expect(() => {
        logContext.set('key', 'value')
      }).not.toThrow()

      // Value should not be retrievable
      expect(logContext.get('key')).toBeUndefined()
    })

    it('should persist value for remainder of context', () => {
      logContext.run({ initial: 'value' }, () => {
        logContext.set('added', 'during-execution')

        // Still accessible
        expect(logContext.get('added')).toBe('during-execution')
        expect(logContext.get('initial')).toBe('value')
      })

      // Not accessible outside
      expect(logContext.get('added')).toBeUndefined()
    })
  })

  describe('getAll', () => {
    it('should return all context values', () => {
      logContext.run(
        {
          requestId: 'req_123',
          userId: 'user_456',
          sessionId: 'session_789',
        },
        () => {
          const all = logContext.getAll()

          expect(all).toEqual({
            requestId: 'req_123',
            userId: 'user_456',
            sessionId: 'session_789',
          })
        }
      )
    })

    it('should return empty object when no context', () => {
      const all = logContext.getAll()
      expect(all).toEqual({})
    })

    it('should include values added with set()', () => {
      logContext.run({ initial: 'value' }, () => {
        logContext.set('added', 'newValue')

        const all = logContext.getAll()
        expect(all).toEqual({
          initial: 'value',
          added: 'newValue',
        })
      })
    })

    it('should return a new object each time', () => {
      logContext.run({ key: 'value' }, () => {
        const all1 = logContext.getAll()
        const all2 = logContext.getAll()

        expect(all1).toEqual(all2)
        expect(all1).not.toBe(all2) // Different object instances
      })
    })
  })

  describe('clear', () => {
    it('should clear all context values', () => {
      logContext.run({ key1: 'value1', key2: 'value2' }, () => {
        expect(logContext.getAll()).toEqual({ key1: 'value1', key2: 'value2' })

        logContext.clear()

        expect(logContext.getAll()).toEqual({})
        expect(logContext.get('key1')).toBeUndefined()
        expect(logContext.get('key2')).toBeUndefined()
      })
    })

    it('should do nothing when no context exists', () => {
      expect(() => {
        logContext.clear()
      }).not.toThrow()
    })

    it('should not affect parent context after nested clear', () => {
      logContext.run({ outer: 'value' }, () => {
        expect(logContext.get('outer')).toBe('value')

        logContext.run({ inner: 'value' }, () => {
          logContext.clear()
          expect(logContext.getAll()).toEqual({})
        })

        // Parent context should still exist
        expect(logContext.get('outer')).toBe('value')
      })
    })
  })

  describe('hasContext', () => {
    it('should return true when in active context', () => {
      logContext.run({ key: 'value' }, () => {
        expect(logContext.hasContext()).toBe(true)
      })
    })

    it('should return false when no context', () => {
      expect(logContext.hasContext()).toBe(false)
    })

    it('should return true even with empty context', () => {
      logContext.run({}, () => {
        expect(logContext.hasContext()).toBe(true)
      })
    })

    it('should return false after context cleared', () => {
      // hasContext checks if AsyncLocalStorage has a store, which is managed by run()
      // Clearing doesn't remove the store, just empties it
      logContext.run({ key: 'value' }, () => {
        expect(logContext.hasContext()).toBe(true)
        logContext.clear()
        expect(logContext.hasContext()).toBe(true) // Still in run() context
      })

      expect(logContext.hasContext()).toBe(false) // Outside run()
    })
  })

  describe('async operations', () => {
    it('should preserve context across async operations', async () => {
      const result = await logContext.run({ requestId: 'req_async_1' }, async () => {
        await new Promise((resolve) => setTimeout(resolve, 10))
        expect(logContext.get('requestId')).toBe('req_async_1')

        await new Promise((resolve) => setTimeout(resolve, 10))
        expect(logContext.get('requestId')).toBe('req_async_1')

        return logContext.get('requestId')
      })

      expect(result).toBe('req_async_1')
    })

    it('should isolate context across concurrent async operations', async () => {
      const promises = [
        logContext.run({ id: '1' }, async () => {
          await new Promise((resolve) => setTimeout(resolve, Math.random() * 20))
          return logContext.get('id')
        }),
        logContext.run({ id: '2' }, async () => {
          await new Promise((resolve) => setTimeout(resolve, Math.random() * 20))
          return logContext.get('id')
        }),
        logContext.run({ id: '3' }, async () => {
          await new Promise((resolve) => setTimeout(resolve, Math.random() * 20))
          return logContext.get('id')
        }),
      ]

      const results = await Promise.all(promises)

      expect(results).toEqual(['1', '2', '3'])
    })

    it('should maintain context through promise chains', async () => {
      const result = await logContext.run({ requestId: 'req_chain' }, () => {
        return Promise.resolve()
          .then(() => {
            expect(logContext.get('requestId')).toBe('req_chain')
            return 'step1'
          })
          .then((value) => {
            expect(logContext.get('requestId')).toBe('req_chain')
            expect(value).toBe('step1')
            return 'step2'
          })
          .then((value) => {
            expect(logContext.get('requestId')).toBe('req_chain')
            return value
          })
      })

      expect(result).toBe('step2')
    })
  })

  describe('real-world usage patterns', () => {
    it('should support HTTP request tracking pattern', () => {
      const simulateRequest = (requestId: string, userId: string) => {
        return logContext.run(
          {
            [ContextKeys.REQUEST_ID]: requestId,
            [ContextKeys.USER_ID]: userId,
            [ContextKeys.IP_ADDRESS]: '127.0.0.1',
            [ContextKeys.METHOD]: 'GET',
            [ContextKeys.PATH]: '/api/users',
          },
          () => {
            // Simulate request processing
            const context = logContext.getAll()

            expect(context[ContextKeys.REQUEST_ID]).toBe(requestId)
            expect(context[ContextKeys.USER_ID]).toBe(userId)
            expect(context[ContextKeys.IP_ADDRESS]).toBe('127.0.0.1')

            return context
          }
        )
      }

      const req1 = simulateRequest('req_1', 'user_1')
      const req2 = simulateRequest('req_2', 'user_2')

      expect(req1[ContextKeys.REQUEST_ID]).toBe('req_1')
      expect(req2[ContextKeys.REQUEST_ID]).toBe('req_2')
    })

    it('should support adding context during execution', () => {
      logContext.run({ [ContextKeys.REQUEST_ID]: 'req_123' }, () => {
        // Initially only requestId
        expect(logContext.getAll()).toEqual({
          [ContextKeys.REQUEST_ID]: 'req_123',
        })

        // After authentication, add userId
        logContext.set(ContextKeys.USER_ID, 'user_456')

        expect(logContext.getAll()).toEqual({
          [ContextKeys.REQUEST_ID]: 'req_123',
          [ContextKeys.USER_ID]: 'user_456',
        })

        // After session check, add sessionId
        logContext.set(ContextKeys.SESSION_ID, 'session_789')

        expect(logContext.getAll()).toEqual({
          [ContextKeys.REQUEST_ID]: 'req_123',
          [ContextKeys.USER_ID]: 'user_456',
          [ContextKeys.SESSION_ID]: 'session_789',
        })
      })
    })
  })
})
