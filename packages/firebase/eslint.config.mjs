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
      // Firebase specific rules
      'no-console': ['error', { allow: ['warn', 'error'] }], // Stricter console usage
      
      // Security rules for authentication and analytics
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      'no-eval': 'error',
      'no-implied-eval': 'error',
      
      // Async/await patterns for Firebase operations
      'no-await-in-loop': 'warn',
      'prefer-promise-reject-errors': 'error',
      'require-atomic-updates': 'error',
      
      // Import rules for API packages
      'import/no-default-export': 'error',
      'import/prefer-default-export': 'off',
      
      // Error handling for Firebase operations
      'no-throw-literal': 'error',
      
      // Firebase specific async patterns
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      
      // Analytics and tracking considerations
      'no-restricted-globals': [
        'error',
        {
          name: 'window',
          message: 'Use proper environment checks before accessing window object.',
        },
      ],
    },
  },
  {
    files: ['**/middleware.ts', '**/server.ts'],
    rules: {
      // Allow default exports for middleware and server files
      'import/no-default-export': 'off',
    },
  },
  {
    files: ['**/analytics/context.tsx', '**/auth/context.tsx'],
    rules: {
      // Allow default exports for React context files
      'import/no-default-export': 'off',
      // Context files may need to use window object
      'no-restricted-globals': 'off',
    },
  },
];