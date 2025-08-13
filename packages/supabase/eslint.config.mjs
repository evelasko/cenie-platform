import { nextConfig } from '../eslint-config/src/next.js';

export default [
  ...nextConfig,
  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    rules: {
      // Supabase/Database specific rules
      'no-console': ['error', { allow: ['warn', 'error'] }], // Stricter console usage
      
      // Security rules for authentication
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'off', // Environment variables often need this
      'no-eval': 'error',
      'no-implied-eval': 'error',
      
      // Async/await patterns for database operations
      'no-await-in-loop': 'warn',
      'prefer-promise-reject-errors': 'error',
      'require-atomic-updates': 'error',
      
      // Import rules for API packages
      'import/no-default-export': 'error',
      'import/prefer-default-export': 'off',
      
      // Error handling
      'no-throw-literal': 'error',
      
      // Prevent common Supabase mistakes
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
    },
  },
  {
    files: ['**/middleware.ts', '**/server.ts'],
    rules: {
      // Allow default exports for middleware and server files
      'import/no-default-export': 'off',
    },
  },
];