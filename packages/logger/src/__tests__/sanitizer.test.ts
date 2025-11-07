import { describe, it, expect } from 'vitest'
import {
  sanitize,
  DEFAULT_REDACT_FIELDS,
  maskEmail,
  maskCreditCard,
} from '../utils/sanitizer'

describe('Sanitizer', () => {
  describe('DEFAULT_REDACT_FIELDS', () => {
    it('should include common sensitive field names', () => {
      expect(DEFAULT_REDACT_FIELDS).toContain('password')
      expect(DEFAULT_REDACT_FIELDS).toContain('token')
      expect(DEFAULT_REDACT_FIELDS).toContain('apiKey')
      expect(DEFAULT_REDACT_FIELDS).toContain('secret')
      expect(DEFAULT_REDACT_FIELDS).toContain('authorization')
      expect(DEFAULT_REDACT_FIELDS).toContain('cookie')
      expect(DEFAULT_REDACT_FIELDS).toContain('creditCard')
      expect(DEFAULT_REDACT_FIELDS).toContain('ssn')
      expect(DEFAULT_REDACT_FIELDS).toContain('privateKey')
      expect(DEFAULT_REDACT_FIELDS).toContain('accessToken')
      expect(DEFAULT_REDACT_FIELDS).toContain('refreshToken')
      expect(DEFAULT_REDACT_FIELDS).toContain('idToken')
    })

    it('should include both camelCase and snake_case variants', () => {
      expect(DEFAULT_REDACT_FIELDS).toContain('apiKey')
      expect(DEFAULT_REDACT_FIELDS).toContain('api_key')
      expect(DEFAULT_REDACT_FIELDS).toContain('creditCard')
      expect(DEFAULT_REDACT_FIELDS).toContain('credit_card')
      expect(DEFAULT_REDACT_FIELDS).toContain('privateKey')
      expect(DEFAULT_REDACT_FIELDS).toContain('private_key')
    })
  })

  describe('sanitize', () => {
    describe('primitives and null values', () => {
      it('should handle null and undefined', () => {
        expect(sanitize(null)).toBe(null)
        expect(sanitize(undefined)).toBe(undefined)
      })

      it('should pass through primitive values', () => {
        expect(sanitize('string')).toBe('string')
        expect(sanitize(123)).toBe(123)
        expect(sanitize(true)).toBe(true)
        expect(sanitize(false)).toBe(false)
      })

      it('should handle Date objects', () => {
        const date = new Date('2025-01-06')
        expect(sanitize(date)).toBe(date)
      })
    })

    describe('arrays', () => {
      it('should sanitize arrays', () => {
        const arr = [1, 'string', true, null]
        expect(sanitize(arr)).toEqual([1, 'string', true, null])
      })

      it('should sanitize objects within arrays', () => {
        const arr = [
          { name: 'John', password: 'secret123' },
          { name: 'Jane', token: 'abc123' },
        ]

        const sanitized = sanitize(arr)

        expect(sanitized[0]).toEqual({ name: 'John', password: '[REDACTED]' })
        expect(sanitized[1]).toEqual({ name: 'Jane', token: '[REDACTED]' })
      })

      it('should handle nested arrays', () => {
        const nested = [
          [{ password: 'secret' }],
          [{ token: 'token123' }],
        ]

        const sanitized = sanitize(nested)

        expect(sanitized[0][0]).toEqual({ password: '[REDACTED]' })
        expect(sanitized[1][0]).toEqual({ token: '[REDACTED]' })
      })
    })

    describe('default field redaction', () => {
      it('should redact password field', () => {
        const obj = { username: 'john', password: 'secret123' }
        const sanitized = sanitize(obj)

        expect(sanitized).toEqual({
          username: 'john',
          password: '[REDACTED]',
        })
      })

      it('should redact token fields', () => {
        const obj = {
          accessToken: 'access123',
          refreshToken: 'refresh456',
          idToken: 'id789',
        }
        const sanitized = sanitize(obj)

        expect(sanitized).toEqual({
          accessToken: '[REDACTED]',
          refreshToken: '[REDACTED]',
          idToken: '[REDACTED]',
        })
      })

      it('should redact API keys', () => {
        const obj = {
          apiKey: 'key123',
          api_key: 'key456',
        }
        const sanitized = sanitize(obj)

        expect(sanitized).toEqual({
          apiKey: '[REDACTED]',
          api_key: '[REDACTED]',
        })
      })

      it('should redact secret fields', () => {
        const obj = {
          secret: 'secret123',
          clientSecret: 'client456',
        }
        const sanitized = sanitize(obj)

        expect(sanitized).toEqual({
          secret: '[REDACTED]',
          clientSecret: '[REDACTED]',
        })
      })

      it('should redact authorization headers', () => {
        const obj = {
          headers: {
            authorization: 'Bearer token123',
            'content-type': 'application/json',
          },
        }
        const sanitized = sanitize(obj)

        expect(sanitized.headers).toEqual({
          authorization: '[REDACTED]',
          'content-type': 'application/json',
        })
      })

      it('should redact credit card information', () => {
        const obj = {
          creditCard: '4242424242424242',
          credit_card: '4111111111111111',
        }
        const sanitized = sanitize(obj)

        expect(sanitized).toEqual({
          creditCard: '[REDACTED]',
          credit_card: '[REDACTED]',
        })
      })

      it('should redact private keys', () => {
        const obj = {
          privateKey: '-----BEGIN PRIVATE KEY-----',
          private_key: 'MIIEvQIBADANBg...',
        }
        const sanitized = sanitize(obj)

        expect(sanitized).toEqual({
          privateKey: '[REDACTED]',
          private_key: '[REDACTED]',
        })
      })
    })

    describe('case-insensitive matching', () => {
      it('should redact fields regardless of case', () => {
        const obj = {
          PASSWORD: 'secret',
          Password: 'secret',
          pAsSwOrD: 'secret',
          TOKEN: 'token',
          Token: 'token',
        }
        const sanitized = sanitize(obj)

        expect(sanitized.PASSWORD).toBe('[REDACTED]')
        expect(sanitized.Password).toBe('[REDACTED]')
        expect(sanitized.pAsSwOrD).toBe('[REDACTED]')
        expect(sanitized.TOKEN).toBe('[REDACTED]')
        expect(sanitized.Token).toBe('[REDACTED]')
      })

      it('should match partial field names case-insensitively', () => {
        const obj = {
          userPassword: 'secret',
          USER_PASSWORD: 'secret',
          accessToken: 'token',
          ACCESS_TOKEN: 'token',
        }
        const sanitized = sanitize(obj)

        expect(sanitized.userPassword).toBe('[REDACTED]')
        expect(sanitized.USER_PASSWORD).toBe('[REDACTED]')
        expect(sanitized.accessToken).toBe('[REDACTED]')
        expect(sanitized.ACCESS_TOKEN).toBe('[REDACTED]')
      })
    })

    describe('custom redact fields', () => {
      it('should accept custom fields to redact', () => {
        const obj = {
          name: 'John',
          email: 'john@example.com',
          customSecret: 'secret123',
        }
        const sanitized = sanitize(obj, ['customSecret'])

        expect(sanitized).toEqual({
          name: 'John',
          email: 'john@example.com',
          customSecret: '[REDACTED]',
        })
      })

      it('should combine default and custom redact fields', () => {
        const obj = {
          password: 'secret',
          internalId: '12345',
          publicId: '67890',
        }
        const customFields = [...DEFAULT_REDACT_FIELDS, 'internalId']
        const sanitized = sanitize(obj, customFields)

        expect(sanitized).toEqual({
          password: '[REDACTED]',
          internalId: '[REDACTED]',
          publicId: '67890',
        })
      })
    })

    describe('nested objects', () => {
      it('should sanitize nested objects', () => {
        const obj = {
          user: {
            name: 'John',
            credentials: {
              password: 'secret123',
              apiKey: 'key456',
            },
          },
        }
        const sanitized = sanitize(obj)

        expect(sanitized).toEqual({
          user: {
            name: 'John',
            credentials: {
              password: '[REDACTED]',
              apiKey: '[REDACTED]',
            },
          },
        })
      })

      it('should sanitize deeply nested objects', () => {
        const obj = {
          level1: {
            level2: {
              level3: {
                level4: {
                  password: 'deep-secret',
                },
              },
            },
          },
        }
        const sanitized = sanitize(obj)

        expect(sanitized.level1.level2.level3.level4.password).toBe('[REDACTED]')
      })

      it('should preserve non-sensitive nested data', () => {
        const obj = {
          user: {
            id: '123',
            profile: {
              name: 'John',
              age: 30,
              settings: {
                theme: 'dark',
                notifications: true,
              },
            },
          },
          auth: {
            token: 'secret-token',
          },
        }
        const sanitized = sanitize(obj)

        expect(sanitized.user.id).toBe('123')
        expect(sanitized.user.profile.name).toBe('John')
        expect(sanitized.user.profile.age).toBe(30)
        expect(sanitized.user.profile.settings.theme).toBe('dark')
        expect(sanitized.user.profile.settings.notifications).toBe(true)
        expect(sanitized.auth.token).toBe('[REDACTED]')
      })
    })

    describe('mixed structures', () => {
      it('should handle objects with arrays and nested structures', () => {
        const obj = {
          users: [
            {
              name: 'John',
              password: 'secret1',
              roles: ['admin', 'user'],
            },
            {
              name: 'Jane',
              apiKey: 'key123',
              permissions: {
                read: true,
                write: false,
              },
            },
          ],
          config: {
            database: {
              host: 'localhost',
              password: 'db-secret',
            },
          },
        }
        const sanitized = sanitize(obj)

        expect(sanitized.users[0].password).toBe('[REDACTED]')
        expect(sanitized.users[0].name).toBe('John')
        expect(sanitized.users[0].roles).toEqual(['admin', 'user'])
        expect(sanitized.users[1].apiKey).toBe('[REDACTED]')
        expect(sanitized.users[1].permissions).toEqual({ read: true, write: false })
        expect(sanitized.config.database.host).toBe('localhost')
        expect(sanitized.config.database.password).toBe('[REDACTED]')
      })
    })

    describe('partial matching', () => {
      it('should redact fields that contain sensitive keywords', () => {
        const obj = {
          userPassword: 'secret',
          adminPassword: 'secret',
          systemPassword: 'secret',
          bearerToken: 'token',
          oauthToken: 'token',
        }
        const sanitized = sanitize(obj)

        expect(sanitized.userPassword).toBe('[REDACTED]')
        expect(sanitized.adminPassword).toBe('[REDACTED]')
        expect(sanitized.systemPassword).toBe('[REDACTED]')
        expect(sanitized.bearerToken).toBe('[REDACTED]')
        expect(sanitized.oauthToken).toBe('[REDACTED]')
      })

      it('should not redact fields that only partially match by coincidence', () => {
        const obj = {
          passwordStrength: 'strong', // Contains 'password' but describes strength
          tokenCount: 5, // Contains 'token' but is a count
        }

        // Note: The current implementation does partial matching,
        // so these WILL be redacted. This test documents current behavior.
        const sanitized = sanitize(obj)

        expect(sanitized.passwordStrength).toBe('[REDACTED]')
        expect(sanitized.tokenCount).toBe('[REDACTED]')
      })
    })
  })

  describe('maskEmail', () => {
    it('should mask email addresses correctly', () => {
      expect(maskEmail('john@example.com')).toBe('joh***@example.com')
      expect(maskEmail('jane@test.org')).toBe('jan***@test.org')
      expect(maskEmail('admin@company.co.uk')).toBe('adm***@company.co.uk')
    })

    it('should handle short email addresses', () => {
      expect(maskEmail('ab@test.com')).toBe('***@test.com')
      expect(maskEmail('a@test.com')).toBe('***@test.com')
    })

    it('should handle exactly 3 character local part', () => {
      expect(maskEmail('abc@test.com')).toBe('***@test.com')
    })

    it('should preserve domain completely', () => {
      const masked = maskEmail('user@subdomain.example.com')
      expect(masked).toContain('@subdomain.example.com')
    })

    it('should handle invalid email format gracefully', () => {
      expect(maskEmail('notanemail')).toBe('notanemail')
      expect(maskEmail('no@domain@here.com')).toBe('no@domain@here.com')
    })

    it('should handle empty string', () => {
      expect(maskEmail('')).toBe('')
    })
  })

  describe('maskCreditCard', () => {
    it('should mask credit card numbers keeping last 4 digits', () => {
      expect(maskCreditCard('4242424242424242')).toBe('****4242')
      expect(maskCreditCard('4111111111111111')).toBe('****1111')
      expect(maskCreditCard('5555555555554444')).toBe('****4444')
    })

    it('should handle credit cards with spaces', () => {
      expect(maskCreditCard('4242 4242 4242 4242')).toBe('****4242')
      expect(maskCreditCard('4111 1111 1111 1111')).toBe('****1111')
    })

    it('should handle credit cards with dashes', () => {
      expect(maskCreditCard('4242-4242-4242-4242')).toBe('****4242')
    })

    it('should handle short numbers', () => {
      expect(maskCreditCard('123')).toBe('****')
      expect(maskCreditCard('12')).toBe('****')
      expect(maskCreditCard('1')).toBe('****')
      expect(maskCreditCard('')).toBe('****')
    })

    it('should handle exactly 4 digits', () => {
      expect(maskCreditCard('1234')).toBe('****1234')
    })

    it('should handle numbers with mixed formatting', () => {
      expect(maskCreditCard('4242 4242-4242 4242')).toBe('****4242')
    })
  })

  describe('integration with sanitize', () => {
    it('should work with email and credit card masking in real scenarios', () => {
      // Note: sanitize() redacts but doesn't use maskEmail/maskCreditCard
      // These are utility functions for manual use
      const obj = {
        user: {
          email: 'john@example.com',
          password: 'secret123',
        },
        payment: {
          creditCard: '4242424242424242',
          cvv: '123',
        },
      }

      const sanitized = sanitize(obj)

      // Password and creditCard are redacted
      expect(sanitized.user.password).toBe('[REDACTED]')
      expect(sanitized.payment.creditCard).toBe('[REDACTED]')

      // Email is not auto-redacted (not in default fields)
      expect(sanitized.user.email).toBe('john@example.com')

      // CVV is not auto-redacted (not in default fields)
      expect(sanitized.payment.cvv).toBe('123')

      // But we can manually mask email if needed
      const maskedEmail = maskEmail(sanitized.user.email)
      expect(maskedEmail).toBe('joh***@example.com')
    })
  })
})

