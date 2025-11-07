import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/**',
        'dist/**',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData/**',
        '**/__tests__/**',
        '**/test/**',
        '.next/**',
        '.turbo/**',
      ],
    },
    include: ['**/*.{test,spec}.{ts,tsx}'],
    exclude: [
      'node_modules/**',
      'dist/**',
      '.next/**',
      '.turbo/**',
      'apps/**',
    ],
  },
  resolve: {
    alias: {
      '@cenie/ui': path.resolve(__dirname, './packages/ui/src'),
      '@cenie/firebase': path.resolve(__dirname, './packages/firebase/src'),
      '@cenie/auth-client': path.resolve(__dirname, './packages/auth-client/src'),
      '@cenie/supabase': path.resolve(__dirname, './packages/supabase/src'),
      '@cenie/logger': path.resolve(__dirname, './packages/logger/src'),
      '@cenie/errors': path.resolve(__dirname, './packages/errors/src'),
    },
  },
})

